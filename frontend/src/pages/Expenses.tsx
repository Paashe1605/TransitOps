import { useState, useEffect } from "react";
import { fetchWithAuth } from "../lib/api";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import GlassCard from "../components/GlassCard";
import CreateExpenseModal from "../components/modals/CreateExpenseModal";
import { Plus, FileSpreadsheet } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ["ID", "Vehicle ID", "Expense Type", "Cost", "Liters", "Date"];
    const rows = expenses.map(e => [
      e.id, 
      e.vehicle_id, 
      e.expense_type, 
      e.cost, 
      e.liters || 0, 
      e.date
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors font-semibold"
          >
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition-colors font-semibold"
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </div>

      <CreateExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchExpenses} 
      />

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
