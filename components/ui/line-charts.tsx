"use client";

import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DataKeyConfig = {
  key: string;
  label?: string;
  color?: string;
};

type LineChartsProps = {
  data: Record<string | number, unknown>[];
  xKey: string;
  dataKeys: DataKeyConfig[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  fontSize?: number;
  className?: string;
  showLegend?: boolean;
};

export const LineCharts = ({
  data,
  xKey,
  dataKeys,
  xLabel,
  yLabel = "Value",
  height = 360,
  fontSize = 12,
  className,
  showLegend = false,
}: LineChartsProps) => {
  const hasXAxis = !!xLabel;

  return (
    <div className={cn("rounded-3xl", className)} style={{ height }}>
      {showLegend && (
        <div className="mb-2 overflow-x-auto px-1 py-2">
          <div
            className="flex flex-nowrap gap-3 text-white md:justify-center"
            style={{ fontSize }}
          >
            {dataKeys.map((item) => (
              <div key={item.key} className="flex shrink-0 items-center gap-1">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "9999px",
                    backgroundColor: item.color || "#3b82f6",
                  }}
                />
                <span>{item.label || item.key}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ResponsiveContainer
        width="100%"
        height="100%"
        className="border-none ring-0 outline-0"
      >
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: showLegend ? 60 : 20,
            left: 20,
          }}
        >
          <CartesianGrid
            stroke="#575757"
            strokeDasharray="0 0"
            vertical={false}
          />

          {xKey === "label" ? (
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              tick={({ x, y, payload }) => {
                const [title, tag] = payload.value.split("\n");
                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    <text
                      x={0}
                      y={0}
                      dy={0}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize={12}
                    >
                      {title}
                    </text>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="middle"
                      fill="#6b7280"
                      fontSize={10}
                    >
                      {tag}
                    </text>
                  </g>
                );
              }}
            />
          ) : (
            <XAxis
              dataKey={xKey}
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize }}
              label={
                hasXAxis
                  ? {
                      value: xLabel,
                      position: "insideBottom",
                      offset: -5,
                      fill: "#9ca3af",
                      fontSize,
                    }
                  : undefined
              }
            />
          )}

          <YAxis
            stroke="#9ca3af"
            tick={{ fill: "#9ca3af", fontSize }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fill: "#fff",
              fontSize,
              style: { textAnchor: "middle" },
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#252627",
              border: "none",
              fontSize,
            }}
            labelStyle={{ color: "#f9fafb", fontSize }}
            itemStyle={{ color: "#f9fafb", fontSize }}
          />

          {dataKeys.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color || "#3b82f6"}
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
