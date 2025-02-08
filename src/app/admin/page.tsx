"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "mahnoorshaikh1066@gmail.com" && password === "mahnoorshaikh") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FF9F0D]">
          Welcome to FoodTuck Admin Panel
        </h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF9F0D]"
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF9F0D]"
          value={password}
        />
        <button
          type="submit"
          className="bg-[#FF9F0D] text-white px-4 py-2 rounded w-full font-semibold hover:bg-[#e88e0b] transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
}
