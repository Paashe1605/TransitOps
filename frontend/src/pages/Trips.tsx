import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus, CheckCircle, XCircle, Send, X } from "lucide-react";

interface Trip {
  id: number;
  vehicle_id: number;
  driver_id: number;
  source: string;
  destination: string;
  cargo_weight: number;
  status: string;
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    driver_id: "",
    source: "",
    destination: "",
    cargo_weight: "",
    planned_distance: ""
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await fetchWithAuth("/trips/");
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (id: number) => {
    try {
      await fetchWithAuth(`/trips/${id}/dispatch`, { method: "POST" });
      fetchTrips();
    } catch (err: any) {
      alert("Error dispatching: " + err.message);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/trips/", {
        method: "POST",
        body: JSON.stringify({
          vehicle_id: parseInt(formData.vehicle_id),
          driver_id: parseInt(formData.driver_id),
          source: formData.source,
          destination: formData.destination,
          cargo_weight: parseFloat(formData.cargo_weight),
          planned_distance: parseFloat(formData.planned_distance)
        })
      });
      setIsAddModalOpen(false);
      setFormData({ vehicle_id: "", driver_id: "", source: "", destination: "", cargo_weight: "", planned_distance: "" });
      fetchTrips();
    } catch (err: any) {
      alert("Error creating trip: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and dispatch fleet trips.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus size={18} /> New Trip
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading trips...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Vehicle ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{t.id}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.source} → {t.destination}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{t.cargo_weight} kg</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">#{t.vehicle_id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      t.status === 'Draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                      t.status === 'Dispatched' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      t.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                    {t.status === 'Draft' && (
                      <button onClick={() => handleDispatch(t.id)} title="Dispatch" className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Send size={18} />
                      </button>
                    )}
                    {t.status === 'Dispatched' && (
                      <>
                        <button title="Complete" className="text-green-600 hover:text-green-800 transition-colors">
                          <CheckCircle size={18} />
                        </button>
                        <button title="Cancel" className="text-red-600 hover:text-red-800 transition-colors">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No trips found. Click "New Trip" to plan one.
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
              <h2 className="text-xl font-bold dark:text-white">Schedule New Trip</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Vehicle ID</label>
                <input required type="number" value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Driver ID</label>
                <input required type="number" value={formData.driver_id} onChange={e => setFormData({...formData, driver_id: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Source (Origin)</label>
                <input required type="text" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Destination</label>
                <input required type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Cargo Weight (kg)</label>
                <input required type="number" value={formData.cargo_weight} onChange={e => setFormData({...formData, cargo_weight: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Planned Distance (km)</label>
                <input required type="number" value={formData.planned_distance} onChange={e => setFormData({...formData, planned_distance: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Schedule Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
