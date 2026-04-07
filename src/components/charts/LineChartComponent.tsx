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
        background: "#1a1a2e",
        border: "1px solid #2a2a3e",
        borderRadius: 8,
        padding: "8px 12px",
      }}
    >
      <p style={{ color: "#a1a1aa", margin: 0, fontSize: 12 }}>{label}</p>
      <p style={{ color: "#e4e4e7", margin: "2px 0 0", fontSize: 13, fontWeight: 600 }}>
        {payload[0].value}
      </p>
    </div>
  );
}

const sharedAxisProps = {
  tick: { fill: "#a1a1aa", fontSize: 12 },
  axisLine: { stroke: "#2a2a3e" },
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
          <p style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 4 }}>{label}</p>
        )}
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
            <XAxis dataKey="date" {...sharedAxisProps} />
            <YAxis {...sharedAxisProps} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2a2a3e" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#1a1a2e", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 250, width: "100%" }}>
      {label && (
        <p style={{ color: "#a1a1aa", fontSize: 12, marginBottom: 4 }}>{label}</p>
      )}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" vertical={false} />
          <XAxis dataKey="date" {...sharedAxisProps} />
          <YAxis {...sharedAxisProps} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2a2a3e" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#1a1a2e", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
