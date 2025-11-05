import { useState } from "react";
import useUser from "../../Hooks/useUser";
import DashboardSidebar from "./Components/DashboardSidebar";
import DashboardNavbar from "./Components/DashboardNavbar";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/dashboard");

  const { userData } = useUser();
  const role = userData?.role;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />

      {/* Navbar */}
      <DashboardNavbar
        user={userData}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className="ml-0 lg:ml-64 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
