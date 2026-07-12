import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus } from "lucide-react";
import CreateVehicleModal from "../components/modals/CreateVehicleModal";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import GlassCard from "../components/GlassCard";

interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  type: string;
  max_load: number;
  odometer: number;
  acquisition_cost: number;
  status: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const renderVehicleStatus = (v: Vehicle) => {
    const styles: Record<string, string> = {
      Available: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      "On Trip": "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      "In Shop": "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      Retired: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[v.status] || styles['Available']}`}>
        {v.status}
      </span>
    );
  };

  const vehicleColumns: ColumnDef<Vehicle>[] = [
    { key: "registration_number", header: "Reg No.", sortable: true },
    { key: "model", header: "Model", sortable: true },
    { key: "type", header: "Type", sortable: true },
    { key: "max_load", header: "Max Cap (kg)", sortable: true, render: (v) => `${v.max_load.toLocaleString()} kg` },
    { key: "odometer", header: "Odometer (km)", sortable: true, render: (v) => `${v.odometer.toLocaleString()} km` },
    { key: "acquisition_cost", header: "Cost", sortable: true, render: (v) => v.acquisition_cost ? `$${v.acquisition_cost.toLocaleString()}` : '-' },
    { key: "status", header: "Status", sortable: true, render: renderVehicleStatus },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-panel p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your fleet vehicles here.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-colors font-semibold"
        >
          <Plus size={18} /> Add Vehicle
        </button>
      </div>
      
      <CreateVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchVehicles} 
      />

      <GlassCard>
        {loading ? (
           <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading vehicles...</div>
        ) : (
          <DataGrid
            data={vehicles}
            columns={vehicleColumns}
            searchPlaceholder="Search vehicles by Reg No. or model..."
            filterColumn={{
              key: "status",
              options: ["Available", "On Trip", "In Shop", "Retired"],
              label: "Status",
            }}
          />
        )}
      </GlassCard>
    </div>
  );
}
