import { useState } from "react";

export default function FuelEfficiencyChart() {
  const data = [
    { label: "Jan", val: 8.2 },
    { label: "Feb", val: 8.6 },
    { label: "Mar", val: 7.9 },
    { label: "Apr", val: 9.1 },
    { label: "May", val: 8.8 },
    { label: "Jun", val: 9.4 },
    { label: "Jul", val: 9.8 },
  ];

  const maxVal = Math.max(...data.map((d) => d.val)) * 1.1;
  const minVal = Math.min(...data.map((d) => d.val)) * 0.9;
  const range = maxVal - minVal;

  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert data points to SVG coordinates
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.val - minVal) / range) * chartHeight;
    return { x, y, label: d.label, val: d.val };
  });

  // Construct path string for line and area
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }
    areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  const [hoveredPoint, setHoveredPoint] = useState<typeof points[0] | null>(null);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = paddingTop + ratio * chartHeight;
          const val = maxVal - ratio * range;
          return (
            <g key={index} className="opacity-40">
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-gray-200 dark:text-gray-800"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] font-bold text-gray-400 dark:text-gray-400 fill-current"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Gradient Area under curve */}
        {areaD && <path d={areaD} fill="url(#chartGlow)" />}

        {/* Path curve */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        )}

        {/* X Axis Labels & Interactive Points */}
        {points.map((p, i) => (
          <g key={i}>
            <line
              x1={p.x}
              y1={paddingTop + chartHeight}
              x2={p.x}
              y2={paddingTop + chartHeight + 4}
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-300 dark:text-gray-700"
            />
            <text
              x={p.x}
              y={paddingTop + chartHeight + 16}
              textAnchor="middle"
              className="text-[10px] font-bold text-gray-400 dark:text-gray-400 fill-current"
            >
              {p.label}
            </text>

            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredPoint?.label === p.label ? "6" : "4"}
              className="fill-blue-500 stroke-white dark:stroke-slate-900 cursor-pointer transition-all duration-150"
              strokeWidth="2"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}
      </svg>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute glass-panel px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-800/50 text-[11px] font-bold text-gray-800 dark:text-gray-200 shadow-md pointer-events-none transition-all duration-150"
          style={{
            left: `${((hoveredPoint.x - paddingLeft) / chartWidth) * 85 + 7}%`,
            top: `${((hoveredPoint.y - paddingTop) / chartHeight) * 55 - 10}%`,
          }}
        >
          <div className="text-gray-400 dark:text-gray-400 text-[9px] uppercase tracking-wide">
            {hoveredPoint.label} Avg Efficiency
          </div>
          <div className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">{hoveredPoint.val} km/L</div>
        </div>
      )}
    </div>
  );
}
