"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import ProtectedRoute from "@/app/component/protected/ProtectedRoute";
import { FaBars, FaTimes } from "react-icons/fa";

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
  const [filter, setFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id, name, email, address, phone, paymentMethod, total, orderDate, status,
          items[]->{ name, "imageUrl": image.asset->url }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-[#1E293B] text-white w-64 p-6 space-y-6 fixed h-full transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform sm:translate-x-0`}>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <nav className="space-y-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`block w-full text-left px-4 py-2 rounded-lg transition ${filter === status ? "bg-white text-gray-800" : "hover:bg-gray-700"}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} Orders
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-[#FF9F0D] text-white p-4 flex justify-between items-center shadow-lg">
            <button className="sm:hidden" onClick={toggleSidebar}>
              {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </nav>

          {/* Orders List */}
          <div className="p-6 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold mb-4 text-center">Foodtuck Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold">{order.name}</h3>
                  <p className="text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
