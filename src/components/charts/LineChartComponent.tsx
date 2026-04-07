"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface LineChartComponentProps {
  data: { date: string; value: number }[];
  color?: string;
  showArea?: boolean;
  label?: string;
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

const sharedAxisProps = {
  tick: { fill: "#6B7280", fontSize: 12 },
  axisLine: { stroke: "#E5E7EB" },
  tickLine: false as const,
};

export default function LineChartComponent({
  data,
  color = "#7c3aed",
  showArea = false,
  label,
}: LineChartComponentProps) {
  const gradientId = "lineAreaGradient";

  if (showArea) {
    return (
      <div style={{ minHeight: 250, width: "100%" }}>
        {label && (
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>{label}</p>
        )}
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" {...sharedAxisProps} />
            <YAxis {...sharedAxisProps} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E5E7EB" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 250, width: "100%" }}>
      {label && (
        <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>{label}</p>
      )}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis dataKey="date" {...sharedAxisProps} />
          <YAxis {...sharedAxisProps} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E5E7EB" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
