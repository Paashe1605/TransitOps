import { useState } from "react";
import { fetchWithAuth } from "../../lib/api";
import { X } from "lucide-react";

interface CompleteTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tripId: number | null;
}

export default function CompleteTripModal({ isOpen, onClose, onSuccess, tripId }: CompleteTripModalProps) {
  const [formData, setFormData] = useState({
    final_odometer: "",
    fuel_consumed: "",
    fuel_cost: "",
    revenue: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !tripId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await fetchWithAuth(`/trips/${tripId}/complete`, {
        method: "POST",
        body: JSON.stringify({
          final_odometer: parseFloat(formData.final_odometer),
          fuel_consumed: parseFloat(formData.fuel_consumed),
          fuel_cost: parseFloat(formData.fuel_cost),
          revenue: parseFloat(formData.revenue)
        })
      });
      onSuccess();
      onClose();
      setFormData({ final_odometer: "", fuel_consumed: "", fuel_cost: "", revenue: "" });
    } catch (err: any) {
      setError(err.message || "Failed to complete trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Complete Trip #{tripId}</h2>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Final Odometer (km)</label>
            <input 
              required
              type="number"
              min="0"
              step="0.1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              value={formData.final_odometer}
              onChange={(e) => setFormData({...formData, final_odometer: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Consumed (Liters)</label>
            <input 
              required
              type="number"
              min="0"
              step="0.1"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              value={formData.fuel_consumed}
              onChange={(e) => setFormData({...formData, fuel_consumed: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Fuel Cost ($)</label>
            <input 
              required
              type="number"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              value={formData.fuel_cost}
              onChange={(e) => setFormData({...formData, fuel_cost: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trip Revenue ($)</label>
            <input 
              required
              type="number"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              value={formData.revenue}
              onChange={(e) => setFormData({...formData, revenue: e.target.value})}
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
              {loading ? "Completing..." : "Complete Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
