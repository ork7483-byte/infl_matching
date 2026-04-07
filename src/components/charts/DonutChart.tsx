"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: { color: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div
      style={{
        background: "#1a1a2e",
        border: "1px solid #2a2a3e",
        borderRadius: 8,
        padding: "8px 12px",
      }}
    >
      <p style={{ color: item.payload.color, margin: 0, fontSize: 13, fontWeight: 600 }}>
        {item.name}
      </p>
      <p style={{ color: "#e4e4e7", margin: "2px 0 0", fontSize: 13 }}>
        {item.value}
      </p>
    </div>
  );
}

export default function DonutChart({ data }: DonutChartProps) {
  return (
    <div style={{ minHeight: 250, width: "100%" }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: "#a1a1aa", fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
