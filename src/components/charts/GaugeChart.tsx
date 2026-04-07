"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  label?: string;
  unit?: string;
}

export default function GaugeChart({
  value,
  min,
  max,
  label,
  unit = "",
}: GaugeChartProps) {
  const gradientId = "gaugeGradient";

  // Clamp value within [min, max]
  const clamped = Math.min(Math.max(value, min), max);
  const range = max - min;
  const filled = ((clamped - min) / range) * 180; // degrees out of 180
  const empty = 180 - filled;

  // PieChart half-circle: total = 180 units, startAngle 180, endAngle 0
  const gaugeData = [
    { name: "filled", value: filled },
    { name: "empty", value: empty },
  ];

  const displayValue = Math.round(clamped);

  return (
    <div style={{ minHeight: 180, width: "100%", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={180}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#e94560" />
            </linearGradient>
          </defs>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius="55%"
            outerRadius="80%"
            dataKey="value"
            stroke="none"
            paddingAngle={2}
          >
            <Cell fill={`url(#${gradientId})`} />
            <Cell fill="#E5E7EB" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            color: "#111827",
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1,
          }}
        >
          {displayValue}
          {unit && (
            <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 2 }}>
              {unit}
            </span>
          )}
        </p>
        {label && (
          <p style={{ color: "#6B7280", fontSize: 12, margin: "4px 0 0" }}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
