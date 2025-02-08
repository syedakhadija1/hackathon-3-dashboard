"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import ProtectedRoute from "@/app/component/protected/ProtectedRoute";

interface Order {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: number;
  paymentMethod: string;
  total: string;
  orderDate: string;
  status: string | null;
  items: {
    name: string;
    imageUrl: string;
  }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          name,
          email,
          address,
          phone,
          paymentMethod,
          total,
          orderDate,
          status,
          items[]->{
            name,
            "imageUrl": image.asset->url
          }
        }`
      )
      .then((data) => {
        console.log(data); // Log data to check the structure
        setOrders(data);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Something went wrong while deleting.");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Something went wrong while updating the status.");
    }
  };

  const handleShowDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-[#FF9F0D] text-white p-4 shadow-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="sm:flex hidden space-x-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-white text-[#FF9F0D] font-bold" : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          {/* Hamburger menu for mobile */}
          <button
            className="sm:hidden text-white"
            onClick={toggleMenu}
          >
            <span className="material-icons">menu</span>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-[#FF9F0D] text-white p-4 space-y-2">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-white text-[#FF9F0D] font-bold" : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Orders List */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Foodtuck Orders</h2>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 shadow-md rounded-lg flex flex-col sm:flex-row sm:items-center"
              >
                <div className="sm:w-1/4">
                  <h3 className="text-xl font-semibold">{order.name}</h3>
                  <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="sm:w-1/2 mt-2 sm:mt-0 sm:px-4">
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                </div>
                <div className="flex flex-col sm:w-1/4 sm:flex-row sm:justify-end mt-4 sm:mt-0 sm:px-4">
                  <select
                    value={order.status || ""}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="bg-gray-100 p-1 rounded mb-2 sm:mb-0 sm:mr-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="dispatch">Dispatch</option>
                    <option value="success">Completed</option>
                  </select>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(order._id);
                    }}
                    className="bg-[#FF9F0D] text-white px-3 py-1 rounded hover:bg-[#e88e0b] transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Show/Hide order details on button click */}
                <button
                  onClick={() => handleShowDetails(order._id)}
                  className="mt-4 sm:mt-0 bg-[#FF9F0D] text-white px-3 py-1 rounded hover:bg-[#e88e0b] transition"
                >
                  Show Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Popup for Order Details */}
        {showModal && selectedOrderId && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-lg max-w-md w-full sm:w-3/4"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Order Details</h3>
                <button onClick={handleCloseModal} className="text-gray-600 text-xl">X</button>
              </div>
              {orders
                .filter((order) => order._id === selectedOrderId)
                .map((order) => (
                  <div key={order._id} className="mt-4">
                    <p><strong>Name:</strong> {order.name}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <ul className="mt-4">
                      {order.items.map((item, index) => (
                        <li key={`${order._id}-${index}`} className="flex items-center gap-2">
                          {item && item.name ? item.name : "Unknown Product"}
                          {item && item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              width={40}
                              height={40}
                              alt={item.name || "Product Image"}
                            />
                          ) : (
                            <span>No Image Available</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
