import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaCheckSquare, FaSquare } from "react-icons/fa";
import CreateInventoryForm from "../Components/CreateInventoryForm";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useMyInventory from "../../../Hooks/useMyInventory";

export default function MyInventories() {
  const axiosSecure = useAxiosSecure();
  const { myInventory, isLoading, refetch } = useMyInventory();
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [inventoryToEdit, setInventoryToEdit] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your inventories...</p>
        </div>
      </div>
    );
  }

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === myInventory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(myInventory.map((item) => item._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm("Are you sure you want to delete selected inventories?")) return;

    try {
      await Promise.all(
        selectedIds.map((id) => axiosSecure.delete(`/api/inventory/inventory/${id}`))
      );
      setSelectedIds([]);
      refetch();
    } catch (error) {
      console.error(error);
      alert("Failed to delete selected inventories.");
    }
  };

const handleEdit = () => {
  if (selectedIds.length === 0) return; // Nothing selected

  const selectedItems = myInventory.filter(inv => selectedIds.includes(inv._id));
  setInventoryToEdit(selectedItems); // Can be 1 or more items
  setShowForm(true);
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBoxOpen className="text-4xl text-teal-600" />
            <h1 className="text-4xl font-bold text-gray-800">My Inventories</h1>
          </div>
          <p className="text-gray-600">Manage and organize your inventory items</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-2 text-gray-700">
              {selectedIds.length > 0 ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  <FaCheckSquare />
                  {selectedIds.length} selected
                </span>
              ) : (
                <span className="text-sm text-gray-500">No items selected</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-auto">
              {/* Delete Selected */}
              <button
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  selectedIds.length > 0
                    ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title="Delete Selected"
              >
                <FaTrash />
                <span className="hidden sm:inline">Delete</span>
              </button>

              {/* Edit Selected */}
            <button
  onClick={handleEdit}
  disabled={selectedIds.length === 0}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
    selectedIds.length >= 1
      ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  }`}
>
  <FaEdit />
  <span className="hidden sm:inline">Edit</span>
</button>


              {/* New Inventory */}
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg font-medium hover:from-teal-700 hover:to-teal-600 transition-all duration-200 hover:shadow-lg"
              >
                <FaPlus />
                <span>New Inventory</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center justify-center w-6 h-6 rounded border-2 border-white hover:bg-teal-700 transition-colors"
                    >
                      {selectedIds.length === myInventory.length && myInventory.length > 0 ? (
                        <FaCheckSquare className="text-white" />
                      ) : (
                        <FaSquare className="text-white opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Custom ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myInventory.length > 0 ? (
                  myInventory.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-teal-50 transition-colors duration-150 ${
                        selectedIds.includes(item._id) ? "bg-teal-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => handleSelect(item._id)}
                          className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {item.customId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800 font-medium">{item.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.tags && item.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No tags</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No inventories found</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first inventory to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        {myInventory.length > 0 && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            Total: {myInventory.length} {myInventory.length === 1 ? "inventory" : "inventories"}
          </div>
        )}
      </div>

      {/* Conditional Form Display */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CreateInventoryForm
           inventoryToEdit={inventoryToEdit} // pass the actual object
       onClose={() => {
    setShowForm(false);
    setInventoryToEdit(null);
  }}
/>

          </div>
        </div>
      )}
    </div>
  );
}