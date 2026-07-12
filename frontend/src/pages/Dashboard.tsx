import { useAuthStore } from "../store/authStore";
import { Navigate, Link } from "react-router-dom";

export default function Dashboard() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TransitOps Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Logged in as: <span className="font-semibold text-blue-600 dark:text-blue-400">{role}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/maintenance" className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-md font-medium transition-colors">
              Maintenance
            </Link>
            <Link to="/financials" className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-md font-medium transition-colors">
              Financials
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-md font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Vehicles</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">12</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Drivers on Duty</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">8</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vehicles in Shop</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
