import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import GlassCard from "../components/GlassCard";
import { Plus } from "lucide-react";

interface Expense {
  id: number;
  vehicle_id: number;
  expense_type: string;
  cost: number;
  liters: number;
  date: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await fetchWithAuth("/finance/expenses");
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Expense>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "vehicle_id", header: "Vehicle ID", sortable: true },
    { 
      key: "expense_type", 
      header: "Expense Type", 
      sortable: true,
      render: (e) => (
        <span className="capitalize font-bold text-gray-800 dark:text-gray-200">
          {e.expense_type}
        </span>
      )
    },
    { key: "cost", header: "Cost", sortable: true, render: (e) => `$${e.cost.toLocaleString()}` },
    { key: "liters", header: "Liters", sortable: true, render: (e) => e.liters > 0 ? `${e.liters} L` : '-' },
    { key: "date", header: "Date", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-panel p-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track fuel logs, tolls, and maintenance costs.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-colors font-semibold">
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <GlassCard>
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading expenses...</div>
        ) : (
          <DataGrid
            data={expenses}
            columns={columns}
            searchPlaceholder="Search expenses..."
            filterColumn={{
              key: "expense_type",
              options: ["Fuel", "Toll", "Insurance"],
              label: "Type",
            }}
          />
        )}
      </GlassCard>
    </div>
  );
}
