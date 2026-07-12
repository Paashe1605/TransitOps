import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus, Edit2, X } from "lucide-react";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    license_number: "",
    name: "",
    license_category: "",
    expiry_date: "",
    contact: "",
    safety_score: "100"
  });

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

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/drivers/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          safety_score: parseInt(formData.safety_score)
        })
      });
      setIsAddModalOpen(false);
      setFormData({ license_number: "", name: "", license_category: "", expiry_date: "", contact: "", safety_score: "100" });
      fetchDrivers();
    } catch (err: any) {
      alert("Error adding driver: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage driver profiles and licenses.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Add New Driver</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateDriver} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">License Number</label>
                <input required type="text" value={formData.license_number} onChange={e => setFormData({...formData, license_number: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">License Category</label>
                <input required type="text" value={formData.license_category} onChange={e => setFormData({...formData, license_category: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Expiry Date</label>
                <input required type="date" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Contact (Phone/Email)</label>
                <input required type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Safety Score</label>
                <input required type="number" max="100" min="0" value={formData.safety_score} onChange={e => setFormData({...formData, safety_score: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
