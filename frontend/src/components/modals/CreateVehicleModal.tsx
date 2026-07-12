import { useState } from "react";
import { fetchWithAuth } from "../../lib/api";
import { X } from "lucide-react";

interface CreateVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateVehicleModal({ isOpen, onClose, onSuccess }: CreateVehicleModalProps) {
  const [formData, setFormData] = useState({
    registration_number: "",
    model: "",
    type: "",
    max_load: "",
    acquisition_cost: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await fetchWithAuth("/vehicles/", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          max_load: parseFloat(formData.max_load),
          acquisition_cost: parseFloat(formData.acquisition_cost)
        })
      });
      onSuccess();
      onClose();
      setFormData({ registration_number: "", model: "", type: "", max_load: "", acquisition_cost: "" });
    } catch (err: any) {
      setError(err.message || "Failed to create vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Vehicle</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
            <input 
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              placeholder="e.g. MH-12-XY-1234"
              value={formData.registration_number}
              onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
            <input 
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              placeholder="e.g. Tata Prima"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select 
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="">Select a type</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Reefer">Reefer</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Load (kg)</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                value={formData.max_load}
                onChange={(e) => setFormData({...formData, max_load: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Acquisition Cost</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                value={formData.acquisition_cost}
                onChange={(e) => setFormData({...formData, acquisition_cost: e.target.value})}
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? "Saving..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
