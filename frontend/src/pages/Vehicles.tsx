import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus, Edit2, X } from "lucide-react";

interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  type: string;
  max_load: number;
  odometer: number;
  status: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    registration_number: "",
    model: "",
    type: "",
    max_load: "",
    odometer: "0",
    acquisition_cost: ""
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await fetchWithAuth("/vehicles/");
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/vehicles/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          max_load: parseFloat(formData.max_load),
          odometer: parseFloat(formData.odometer),
          acquisition_cost: parseFloat(formData.acquisition_cost)
        })
      });
      setIsAddModalOpen(false);
      setFormData({ registration_number: "", model: "", type: "", max_load: "", odometer: "0", acquisition_cost: "" });
      fetchVehicles();
    } catch (err: any) {
      alert("Error adding vehicle: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your fleet vehicles here.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading vehicles...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Reg. Number</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Max Load (kg)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{v.registration_number}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{v.model}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{v.type}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{v.max_load}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      v.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      v.status === 'On Trip' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No vehicles found. Click "Add Vehicle" to register one.
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
              <h2 className="text-xl font-bold dark:text-white">Add New Vehicle</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Registration Number</label>
                <input required type="text" value={formData.registration_number} onChange={e => setFormData({...formData, registration_number: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Model</label>
                <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Type</label>
                <input required type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Max Load (kg)</label>
                <input required type="number" value={formData.max_load} onChange={e => setFormData({...formData, max_load: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Current Odometer</label>
                <input required type="number" value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Acquisition Cost</label>
                <input required type="number" value={formData.acquisition_cost} onChange={e => setFormData({...formData, acquisition_cost: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
