"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface AqsRadarChartProps {
  data: { subject: string; score: number; fullMark: number }[];
}

export default function AqsRadarChart({ data }: AqsRadarChartProps) {
  return (
    <div style={{ minHeight: 300, width: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#6B7280", fontSize: 10 }}
            stroke="#E5E7EB"
          />
          <Radar
            name="AQS"
            dataKey="score"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
