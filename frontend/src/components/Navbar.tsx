import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Car, Users, Map, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            TransitOps
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/vehicles" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
              <Car size={18} /> Vehicles
            </Link>
            <Link to="/drivers" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
              <Users size={18} /> Drivers
            </Link>
            <Link to="/trips" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2">
              <Map size={18} /> Trips
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Role: {role}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-md transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
