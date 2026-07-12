import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Maintenance() {
  const token = useAuthStore((state) => state.token);
  const [logs, setLogs] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/maintenance/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/v1/maintenance/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicle_id: parseInt(vehicleId),
          description,
          cost: parseFloat(cost)
        })
      });
      if (res.ok) {
        setVehicleId('');
        setDescription('');
        setCost('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Maintenance Logs</h2>
          <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <input 
              type="number" 
              placeholder="Vehicle ID" 
              value={vehicleId} 
              onChange={e => setVehicleId(e.target.value)} 
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              required 
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="border p-2 rounded flex-1 dark:bg-gray-700 dark:text-white"
              required 
            />
            <input 
              type="number" 
              step="0.01" 
              placeholder="Cost" 
              value={cost} 
              onChange={e => setCost(e.target.value)} 
              className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              required 
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Log</button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-2 dark:text-gray-900 dark:text-white">ID</th>
                  <th className="p-2 dark:text-gray-900 dark:text-white">Vehicle ID</th>
                  <th className="p-2 dark:text-gray-900 dark:text-white">Description</th>
                  <th className="p-2 dark:text-gray-900 dark:text-white">Cost</th>
                  <th className="p-2 dark:text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b dark:border-gray-700">
                    <td className="p-2 dark:text-gray-300">{log.id}</td>
                    <td className="p-2 dark:text-gray-300">{log.vehicle_id}</td>
                    <td className="p-2 dark:text-gray-300">{log.description}</td>
                    <td className="p-2 dark:text-gray-300">${log.cost}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${log.status === 'Open' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
