import { FaBell, FaBars, FaBox } from "react-icons/fa";

export default function DashboardNavbar({ user, onToggleSidebar }) {
  const getInitials = (name) => {
    if (!name) return "G";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-teal-900 to-teal-800 shadow-lg text-gray-100 flex items-center justify-between px-4 md:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden hover:bg-teal-700 p-2 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={20} />
        </button>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative hover:bg-teal-700 p-2 rounded-lg transition-colors group">
          <FaBell size={20} className="group-hover:text-yellow-300 transition-colors" />
          <span className="absolute top-1 right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 md:gap-3 hover:bg-teal-700 px-2 md:px-3 py-2 rounded-lg transition-colors cursor-pointer">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover border-2 border-teal-300"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm border-2 border-teal-300">
              {getInitials(user?.fullName)}
            </div>
          )}
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              {user?.fullName || "Guest User"}
            </span>
            <span className="text-xs text-teal-200 capitalize leading-tight">
              {user?.role || "user"}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}