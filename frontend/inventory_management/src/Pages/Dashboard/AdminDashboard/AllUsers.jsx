import React, { useState } from "react";
import { FaTrash, FaUserShield, FaBan, FaUnlock } from "react-icons/fa";
import useAllUsers from "../../../Hooks/useAllUsers";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function AllUsers() {
  const { allUsers = [], isLoading, refetch } = useAllUsers();
  const axiosSecure = useAxiosSecure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkRole, setBulkRole] = useState("user");

  // if (isLoading) return <p className="text-center py-6">Loading users...</p>;

  // ✅ Select single user
  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((uid) => uid !== id)
        : [...prev, id]
    );
  };

  // ✅ Select all users
  const handleSelectAll = (e) => {
    setSelectedUsers(e.target.checked ? allUsers.map((u) => u._id) : []);
  };

  // ✅ Bulk delete
  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0)
      return alert("Please select users to delete.");
    if (!window.confirm(`Delete ${selectedUsers.length} user(s)?`)) return;

    try {
      await Promise.all(
        selectedUsers.map((id) => axiosSecure.delete(`/api/auth/deleteUser/${id}`))
      );
      alert("Selected users deleted successfully!");
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected users");
    }
  };

  // ✅ Bulk role change
  const handleBulkRoleChange = async () => {
    if (selectedUsers.length === 0)
      return alert("Please select users to change role.");
    if (!window.confirm(`Change role to "${bulkRole}" for ${selectedUsers.length} user(s)?`)) return;

    try {
      await Promise.all(
        selectedUsers.map((id) =>
          axiosSecure.put(`/api/auth/role/${id}`, { role: bulkRole })
        )
      );
      alert("User roles updated successfully!");
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Bulk role change error:", error);
      alert("Failed to change user roles");
    }
  };

  // ✅ Block selected users
  const handleBlockSelected = async () => {
    if (selectedUsers.length === 0)
      return alert("Please select users to block.");
    if (!window.confirm(`Block ${selectedUsers.length} user(s)?`)) return;

    try {
      await Promise.all(
        selectedUsers.map((id) => axiosSecure.patch(`/api/auth/block/${id}`))
      );
      alert("Selected users blocked successfully!");
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Block users error:", error);
      alert("Failed to block selected users");
    }
  };

  // ✅ Unblock selected users
  const handleUnblockSelected = async () => {
    if (selectedUsers.length === 0)
      return alert("Please select users to unblock.");
    if (!window.confirm(`Unblock ${selectedUsers.length} user(s)?`)) return;

    try {
      await Promise.all(
        selectedUsers.map((id) => axiosSecure.patch(`/api/auth/unblock/${id}`))
      );
      alert("Selected users unblocked successfully!");
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Unblock users error:", error);
      alert("Failed to unblock selected users");
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* ✅ Toolbar */}
      <div className="flex flex-wrap justify-between items-center bg-teal-700 text-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">
          User Management ({selectedUsers.length} selected)
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Bulk role change dropdown */}
          <select
            value={bulkRole}
            onChange={(e) => setBulkRole(e.target.value)}
            className="bg-white text-teal-700 font-medium rounded px-2 py-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleBulkRoleChange}
            disabled={selectedUsers.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              selectedUsers.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <FaUserShield />
            Apply Role
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              selectedUsers.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            <FaTrash />
            Delete
          </button>

          <button
            onClick={handleBlockSelected}
            disabled={selectedUsers.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              selectedUsers.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            <FaBan />
            Block
          </button>

          <button
            onClick={handleUnblockSelected}
            disabled={selectedUsers.length === 0}
            className={`flex items-center gap-2 px-3 py-2 rounded ${
              selectedUsers.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <FaUnlock />
            Unblock
          </button>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedUsers.length === allUsers.length &&
                      allUsers.length > 0
                    }
                  />
                </th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th> {/* New Status column */}
              </tr>
            </thead>

            <tbody>
              {allUsers.map((user) => (
                <tr
                  key={user._id}
                  className={`border-t border-gray-200 ${
                    selectedUsers.includes(user._id)
                      ? "bg-teal-50"
                      : "hover:bg-teal-100"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allUsers.length === 0 && (
            <p className="text-center text-gray-400 py-6">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
