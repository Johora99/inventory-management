import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaBoxes, FaUsers, FaCog, FaUserShield, FaPlus, FaTimes, FaArrowLeft } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";

export default function DashboardSidebar({ role = "user", isOpen, onClose, activeLink, setActiveLink }) {
  const {logout, signOutUser} = useAuth();
  const navigate = useNavigate()
  const commonLinks = [{ name: "Dashboard Home", path: "/dashboard", icon: <FaHome /> }];
  const userLinks = [
    { name: "My Inventories", path: "/dashboard/my-inventories", icon: <FaBoxes /> },
    { name: "Accessed Inventories", path: "/dashboard/accessInventory", icon: <FaUsers /> },
  ];
  const adminLinks = [
    { name: "All Users", path: "/dashboard/all-users", icon: <FaUserShield /> },
    { name: "Manage Inventories", path: "/dashboard/manage-inventory", icon: <FaCog /> },
  ];

  const links = role === "admin" ? [...commonLinks, ...adminLinks] : [...commonLinks, ...userLinks];
  const handleSignOut = async () => {
    await logout();
    await signOutUser();
    navigate('/')
  };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-teal-900 text-gray-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-teal-700 flex-shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-200 to-emerald-300 bg-clip-text text-transparent capitalize">
              {role} Dashboard
            </h2>
            <p className="text-xs text-teal-400">Inventory Manager</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded hover:bg-teal-700">
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Links */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
        <Link to="/" className="inline-flex items-center text-white hover:text-teal-500 mb-2">
  <FaArrowLeft className="mr-2" />
  <span>Back</span>
</Link>
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => {
                setActiveLink(link.path);
                onClose();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                activeLink === link.path
                  ? "bg-teal-600 text-white shadow-lg scale-105"
                  : "hover:bg-teal-800 hover:translate-x-1"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}

        
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-teal-700 flex-shrink-0">
          <button onClick={handleSignOut} className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
