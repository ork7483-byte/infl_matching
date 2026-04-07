"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartComponentProps {
  data: { name: string; value: number }[];
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: "8px 12px",
      }}
    >
      <p style={{ color: "#6B7280", margin: 0, fontSize: 12 }}>{label}</p>
      <p style={{ color: "#111827", margin: "2px 0 0", fontSize: 13, fontWeight: 600 }}>
        {payload[0].value}
      </p>
    </div>
  );
}

export default function BarChartComponent({
  data,
  gradientFrom = "#7c3aed",
  gradientTo = "#e94560",
}: BarChartComponentProps) {
  const gradientId = "barGradient";

  return (
    <div style={{ minHeight: 220, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientFrom} stopOpacity={1} />
              <stop offset="100%" stopColor={gradientTo} stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
          <Bar
            dataKey="value"
            fill={`url(#${gradientId})`}
            radius={[4, 4, 0, 0]}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
