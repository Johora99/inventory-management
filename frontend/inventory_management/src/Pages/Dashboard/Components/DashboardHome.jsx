import React from 'react'
import { FaBell, FaBoxes, FaCog, FaPlus, FaUsers } from "react-icons/fa";
import useUser from '../../../Hooks/useUser';
export default function DashboardHome() {
  const {userData} = useUser();
  const role = userData?.role;
  return (
      <main>
          <div className="max-w-7xl mx-auto mt-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Welcome, {userData?.fullName || "User"} 👋
              </h2>
              <p className="text-gray-600">
                This is your {role === "admin" ? "Admin" : "User"} Dashboard.
              </p>
            </div>

            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-teal-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Inventories</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">24</h3>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <FaBoxes className="text-teal-600 text-2xl" />
                  </div>
                </div>
                <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Items</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">1,248</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBoxes className="text-blue-600 text-2xl" />
                  </div>
                </div>
                <p className="text-green-600 text-sm mt-2">↑ 8% from last month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Shared With</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">18</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaUsers className="text-purple-600 text-2xl" />
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">Active collaborators</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Low Stock</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">5</h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <FaBell className="text-orange-600 text-2xl" />
                  </div>
                </div>
                <p className="text-orange-600 text-sm mt-2">Needs attention</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "Added new item", item: "Laptop Dell XPS", time: "2 hours ago" },
                    { action: "Updated inventory", item: "Office Supplies", time: "5 hours ago" },
                    { action: "Shared inventory", item: "Warehouse A", time: "1 day ago" },
                    { action: "Removed item", item: "Old Printer", time: "2 days ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.item}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors text-left">
                    <FaPlus className="text-teal-600 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-800">Create New Inventory</p>
                      <p className="text-sm text-gray-500">Start tracking new items</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                    <FaUsers className="text-blue-600 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-800">Share Inventory</p>
                      <p className="text-sm text-gray-500">Collaborate with team</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                    <FaCog className="text-purple-600 text-xl" />
                    <div>
                      <p className="font-semibold text-gray-800">Settings</p>
                      <p className="text-sm text-gray-500">Manage preferences</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      
  )
}
