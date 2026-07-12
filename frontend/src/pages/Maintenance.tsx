import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import GlassCard from "../components/GlassCard";
import { Plus, CheckCircle } from "lucide-react";

interface MaintenanceLog {
  id: number;
  vehicle_id: number;
  description: string;
  cost: number;
  status: string;
  created_at: string;
}

export default function Maintenance() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await fetchWithAuth("/maintenance/");
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseLog = async (id: number) => {
    try {
      await fetchWithAuth(`/maintenance/${id}/close`, { method: "PUT" });
      fetchLogs();
    } catch (err: any) {
      alert("Error closing log: " + err.message);
    }
  };

  const renderStatus = (m: MaintenanceLog) => {
    const styles: Record<string, string> = {
      Open: "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      Closed: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[m.status] || styles['Open']}`}>
        {m.status}
      </span>
    );
  };

  const columns: ColumnDef<MaintenanceLog>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "vehicle_id", header: "Vehicle ID", sortable: true },
    { key: "description", header: "Description", sortable: false },
    { key: "cost", header: "Cost", sortable: true, render: (m) => `$${m.cost.toLocaleString()}` },
    { key: "created_at", header: "Date Created", sortable: true, render: (m) => new Date(m.created_at).toLocaleDateString() },
    { key: "status", header: "Status", sortable: true, render: renderStatus },
    {
      key: "id",
      header: "Actions",
      sortable: false,
      render: (m) => (
        <div className="flex justify-end">
          {m.status === 'Open' && (
            <button onClick={() => handleCloseLog(m.id)} title="Close Log" className="p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg hover:scale-110 transition-transform">
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-panel p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Logbook</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track vehicle repairs and servicing.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-colors font-semibold">
          <Plus size={18} /> Add Log
        </button>
      </div>

      <GlassCard>
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading logs...</div>
        ) : (
          <DataGrid
            data={logs}
            columns={columns}
            searchPlaceholder="Search logs by description..."
            filterColumn={{
              key: "status",
              options: ["Open", "Closed"],
              label: "Status",
            }}
          />
        )}
      </GlassCard>
    </div>
  );
}
