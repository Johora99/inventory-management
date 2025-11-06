import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useAllUsers from "../../../Hooks/useAllUsers";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function AllUsers() {
  const { allUsers = [], isLoading, refetch } = useAllUsers();
  const axiosSecure = useAxiosSecure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  if (isLoading) return <p className="text-center py-6">Loading users...</p>;
  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((uid) => uid !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0)
      return alert("Please select users to delete.");
    if (!window.confirm(`Delete ${selectedUsers.length} user(s)?`)) return;

    try {
      await Promise.all(selectedUsers.map((id) => axiosSecure.delete(`/api/auth/deleteUser/${id}`)));
      alert("Selected users deleted successfully!");
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected users");
    }
  };

  // ✅ Change user role
  const handleRoleChange = async (id, newRole) => {
    try {
      await axiosSecure.put(`/api/auth/role/${id}`, { role: newRole });
      alert("User role updated successfully!");
      refetch();
    } catch (error) {
      console.error("Role change error:", error);
      alert("Failed to change role");
    }
  };

  return (
    <div className="p-6">
      {/* ✅ Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Users</h2>

        <div className="flex items-center gap-4">
          {/* Disabled icons until selection */}
          <button
            onClick={() => alert(`Edit ${selectedUsers.length} user(s)`)}
            disabled={selectedUsers.length === 0}
            className={`p-2 rounded ${
              selectedUsers.length === 0
                ? "text-gray-500 cursor-not-allowed bg-gray-300"
                : "text-yellow-400 hover:text-yellow-500 bg-teal-700"
            }`}
          >
            <FaEdit />
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
            className={`p-2 rounded ${
              selectedUsers.length === 0
                ? "text-gray-500 cursor-not-allowed bg-gray-300"
                : "text-red-500 hover:text-red-600 bg-teal-700"
            }`}
          >
            <FaTrash />
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
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked ? allUsers.map((u) => u._id) : []
                    )
                  }
                  checked={
                    selectedUsers.length === allUsers.length &&
                    allUsers.length > 0
                  }
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((user) => (
              <tr
                key={user._id}
                className={`border-t border-gray-300 hover:bg-teal-100 ${
                  selectedUsers.includes(user._id)
                    ? "bg-teal-50"
                    : "bg-transparent"
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
                  <select
                    value={user.role || "user"}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-teal-700 text-white p-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
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
