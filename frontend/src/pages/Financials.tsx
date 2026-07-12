import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Financials() {
  const token = useAuthStore((state) => state.token);
  const [vehicleId, setVehicleId] = useState('');
  const [roiData, setRoiData] = useState<any>(null);

  const fetchRoi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/expenses/roi/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRoiData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vehicle Financials & ROI</h2>
          <form onSubmit={fetchRoi} className="flex gap-4 mb-8">
            <input 
              type="number" 
              placeholder="Vehicle ID" 
              value={vehicleId} 
              onChange={e => setVehicleId(e.target.value)} 
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              required 
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Calculate ROI</button>
          </form>

          {roiData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Acquisition Cost</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${roiData.acquisition_cost}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Maintenance</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">${roiData.total_maintenance_cost}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fuel</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">${roiData.total_fuel_cost}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">ROI Percentage</h3>
                <p className={`text-2xl font-bold ${roiData.roi_percentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {roiData.roi_percentage}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
