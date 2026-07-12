import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import { Plus, Send, CheckCircle, XCircle } from "lucide-react";
import CreateTripModal from "../components/modals/CreateTripModal";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import GlassCard from "../components/GlassCard";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleComplete = async (id: number) => {
    try {
      await fetchWithAuth(`/trips/${id}/complete`, { method: "POST" });
      fetchTrips();
    } catch (err: any) {
      alert("Error completing: " + err.message);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await fetchWithAuth(`/trips/${id}/cancel`, { method: "POST" });
      fetchTrips();
    } catch (err: any) {
      alert("Error cancelling: " + err.message);
    }
  };

  const renderTripStatus = (t: Trip) => {
    const styles: Record<string, string> = {
      Draft: "bg-gray-50 text-gray-700 border-gray-200/50 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
      Dispatched: "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      Cancelled: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[t.status] || styles['Draft']}`}>
        {t.status}
      </span>
    );
  };

  const tripColumns: ColumnDef<Trip>[] = [
    { key: "id", header: "Trip ID", sortable: true },
    { key: "source", header: "Source", sortable: true },
    { key: "destination", header: "Destination", sortable: true },
    { key: "cargo_weight", header: "Cargo (kg)", sortable: true, render: (t) => `${t.cargo_weight.toLocaleString()} kg` },
    { key: "status", header: "Status", sortable: true, render: renderTripStatus },
    {
      key: "id",
      header: "Actions",
      sortable: false,
      render: (t) => (
        <div className="flex gap-2 justify-end">
          {t.status === 'Draft' && (
            <button onClick={() => handleDispatch(t.id)} title="Dispatch" className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:scale-110 transition-transform">
              <Send size={16} />
            </button>
          )}
          {t.status === 'Dispatched' && (
            <>
              <button onClick={() => handleComplete(t.id)} title="Complete" className="p-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg hover:scale-110 transition-transform">
                <CheckCircle size={16} />
              </button>
              <button onClick={() => handleCancel(t.id)} title="Cancel" className="p-1.5 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg hover:scale-110 transition-transform">
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-panel p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Manifests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create and dispatch fleet trips.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-colors font-semibold"
        >
          <Plus size={18} /> Draft Trip
        </button>
      </div>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTrips} 
      />

      <GlassCard>
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading trips...</div>
        ) : (
          <DataGrid
            data={trips}
            columns={tripColumns}
            searchPlaceholder="Search trips by source, destination..."
            filterColumn={{
              key: "status",
              options: ["Draft", "Dispatched", "Completed", "Cancelled"],
              label: "Status",
            }}
          />
        )}
      </GlassCard>
    </div>
  );
}
