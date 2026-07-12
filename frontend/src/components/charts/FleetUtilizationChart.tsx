import type { Vehicle } from "../../services/mockData";

interface FleetUtilizationChartProps {
  vehicles: Vehicle[];
}

export default function FleetUtilizationChart({ vehicles }: FleetUtilizationChartProps) {
  const counts = vehicles.reduce(
    (acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    },
    { Available: 0, "On Trip": 0, "In Shop": 0, Retired: 0 } as Record<string, number>
  );

  const total = vehicles.length || 1;
  const statusConfig = [
    { label: "Available", count: counts["Available"], color: "#10B981", bg: "bg-emerald-500" },
    { label: "On Trip", count: counts["On Trip"], color: "#3B82F6", bg: "bg-blue-500" },
    { label: "In Shop", count: counts["In Shop"], color: "#F59E0B", bg: "bg-amber-500" },
    { label: "Retired", count: counts["Retired"], color: "#EF4444", bg: "bg-red-500" },
  ];

  // Circle SVG calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          {/* Inner grey helper ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            className="text-gray-100 dark:text-gray-800/40"
          />
          {statusConfig.map((item) => {
            const percentage = item.count / total;
            const strokeLength = percentage * circumference;
            const strokeOffset = circumference - strokeLength + accumulatedPercent * circumference;
            accumulatedPercent -= percentage;

            if (percentage === 0) return null;

            return (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:stroke-[14] cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-extrabold text-gray-800 dark:text-white">{vehicles.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">
            Total Fleet
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {statusConfig.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900 dark:text-white">{item.count}</span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 w-10 text-right">
                {Math.round((item.count / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
