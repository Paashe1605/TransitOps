import type { Expense } from "../../services/mockData";

interface FinancialCostsChartProps {
  expenses: Expense[];
}

export default function FinancialCostsChart({ expenses }: FinancialCostsChartProps) {
  // Aggregate expenses by category
  const categories = expenses.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + curr.cost;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { label: "Fuel", val: categories["Fuel"] || 0, color: "#3B82F6" },
    { label: "Tolls", val: categories["Toll"] || 0, color: "#10B981" },
    { label: "Maintenance", val: categories["Maintenance"] || 0, color: "#F59E0B" },
    { label: "Insurance", val: categories["Insurance"] || 0, color: "#8B5CF6" },
  ];

  const maxVal = Math.max(...data.map((d) => d.val), 500) * 1.1;

  return (
    <div className="space-y-4">
      <div className="space-y-3.5">
        {data.map((item) => {
          const percentage = (item.val / maxVal) * 100;
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                <span className="text-gray-800 dark:text-gray-200">{item.label}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ${item.val.toLocaleString()}
                </span>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(percentage, 2)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold">
        <span>0</span>
        <span>${Math.round(maxVal / 2).toLocaleString()}</span>
        <span>${Math.round(maxVal).toLocaleString()}</span>
      </div>
    </div>
  );
}
