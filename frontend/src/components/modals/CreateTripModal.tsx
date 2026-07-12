import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../lib/api";
import { X } from "lucide-react";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTripModal({ isOpen, onClose, onSuccess }: CreateTripModalProps) {
  const [formData, setFormData] = useState({
    vehicle_id: "",
    driver_id: "",
    source: "",
    destination: "",
    cargo_weight: "",
    planned_distance: ""
  });
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch available vehicles and drivers when modal opens
      fetchWithAuth("/vehicles/").then(data => {
        setVehicles(data.filter((v: any) => v.status === "Available"));
      }).catch(console.error);
      
      fetchWithAuth("/drivers/").then(data => {
        setDrivers(data.filter((d: any) => d.status === "Available"));
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await fetchWithAuth("/trips/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          vehicle_id: parseInt(formData.vehicle_id),
          driver_id: parseInt(formData.driver_id),
          cargo_weight: parseFloat(formData.cargo_weight),
          planned_distance: parseFloat(formData.planned_distance)
        })
      });
      onSuccess();
      onClose();
      setFormData({ vehicle_id: "", driver_id: "", source: "", destination: "", cargo_weight: "", planned_distance: "" });
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Draft New Trip</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle</label>
              <select 
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                value={formData.vehicle_id}
                onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registration_number} ({v.max_load}kg)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver</label>
              <select 
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                value={formData.driver_id}
                onChange={(e) => setFormData({...formData, driver_id: e.target.value})}
              >
                <option value="">Select Driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
              <input 
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                placeholder="e.g. Mumbai"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
              <input 
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                placeholder="e.g. Pune"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo Weight (kg)</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                value={formData.cargo_weight}
                onChange={(e) => setFormData({...formData, cargo_weight: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance (km)</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                value={formData.planned_distance}
                onChange={(e) => setFormData({...formData, planned_distance: e.target.value})}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? "Drafting..." : "Draft Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
