"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { useState } from "react";

type BarKeyConfig = {
  key: string;
  label?: string;
  color?: string;
};

type BarChartsProps = {
  data: Record<string | number, unknown>[];
  xKey: string;
  dataKeys: BarKeyConfig[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  variant?: "horizontal" | "vertical";
  barSize?: number;
  barGap?: number | string;
  fontSize?: number;
};

export const BarCharts = ({
  data,
  xKey,
  dataKeys,
  xLabel,
  yLabel,
  height = 320,
  className,
  showLegend = false,
  variant = "vertical",
  barSize = 20,
  barGap = 8,
  fontSize = 12,
}: BarChartsProps) => {
  const isHorizontal = variant === "horizontal";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={cn("rounded-3xl", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          barGap={barGap}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid
            stroke="#575757"
            vertical={!isHorizontal}
            horizontal={isHorizontal}
          />

          <XAxis
            type={isHorizontal ? "number" : "category"}
            dataKey={isHorizontal ? undefined : xKey}
            stroke="#9ca3af"
            tick={{ fontSize }}
            label={
              xLabel && !isHorizontal
                ? {
                    value: xLabel,
                    position: "insideBottom",
                    offset: -5,
                    fill: "#9ca3af",
                    style: { fontSize },
                  }
                : undefined
            }
          />

          <YAxis
            type={isHorizontal ? "category" : "number"}
            dataKey={isHorizontal ? xKey : undefined}
            stroke="#9ca3af"
            tick={{ fontSize }}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: isHorizontal ? 0 : -90,
                    position: "insideLeft",
                    fill: "#fff",
                    style: { textAnchor: "middle", fontSize },
                  }
                : undefined
            }
          />

          <Tooltip
            contentStyle={{ backgroundColor: "#252627", border: "none" }}
            labelStyle={{ color: "#f9fafb", fontSize }}
            itemStyle={{ color: "#f9fafb", fontSize }}
          />

          {showLegend && (
            <Legend
              wrapperStyle={{ color: "#fff", fontSize }}
              formatter={(value) => {
                const config = dataKeys.find((d) => d.key === value);
                if (!config?.label) return null;
                return (
                  <span style={{ color: config.color || "#fff" }}>
                    {config.label}
                  </span>
                );
              }}
            />
          )}

          {dataKeys.map((bar) => (
            <Bar
              className="hover:bg-transparent"
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color || "#3b82f6"}
              radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              barSize={barSize}
              onMouseOver={(_, idx) => setActiveIndex(idx)}
            >
              {data.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={bar.color || "#3b82f6"}
                  fillOpacity={
                    activeIndex === null || activeIndex === idx ? 1 : 0.3
                  }
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
