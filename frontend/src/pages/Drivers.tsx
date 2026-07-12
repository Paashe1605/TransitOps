import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus, Edit2 } from "lucide-react";

interface Driver {
  id: number;
  license_number: string;
  name: string;
  license_category: string;
  expiry_date: string;
  contact: string;
  safety_score: number;
  status: string;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await fetchWithAuth("/drivers/");
      setDrivers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage driver profiles and licenses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors">
          <Plus size={18} /> Add Driver
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading drivers...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">License #</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{d.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.license_number}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.license_category}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.expiry_date}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.safety_score}/100</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      d.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      d.status === 'On Trip' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No drivers found. Click "Add Driver" to register one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
