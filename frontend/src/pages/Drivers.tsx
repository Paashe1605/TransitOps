import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus } from "lucide-react";
import CreateDriverModal from "../components/modals/CreateDriverModal";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import GlassCard from "../components/GlassCard";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const renderDriverStatus = (d: Driver) => {
    const styles: Record<string, string> = {
      Available: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      "On Trip": "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      Suspended: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[d.status] || styles['Available']}`}>
        {d.status}
      </span>
    );
  };

  const driverColumns: ColumnDef<Driver>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "license_number", header: "License No.", sortable: false },
    { key: "license_category", header: "Category", sortable: true },
    { key: "expiry_date", header: "Expiry Date", sortable: true },
    { key: "contact", header: "Contact", sortable: false },
    {
      key: "safety_score",
      header: "Safety Score",
      sortable: true,
      render: (d) => (
        <span
          className={`font-bold ${
            d.safety_score >= 90
              ? "text-emerald-600 dark:text-emerald-400"
              : d.safety_score >= 75
              ? "text-amber-600 dark:text-amber-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {d.safety_score}%
        </span>
      ),
    },
    { key: "status", header: "Status", sortable: true, render: renderDriverStatus },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-panel p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage driver profiles and licenses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-colors font-semibold"
        >
          <Plus size={18} /> Add Driver
        </button>
      </div>

      <CreateDriverModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchDrivers} 
      />

      <GlassCard>
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading drivers...</div>
        ) : (
          <DataGrid
            data={drivers}
            columns={driverColumns}
            searchPlaceholder="Search drivers by name or license..."
            filterColumn={{
              key: "status",
              options: ["Available", "On Trip", "Suspended"],
              label: "Status",
            }}
          />
        )}
      </GlassCard>
    </div>
  );
}
