"use client";

import { cn } from "@/lib/utils";
import React from "react";

type CardStatsProps = {
  icon: React.ElementType;
  title: string;
  color: string;
  value: string;
};

export const CardStats = ({
  icon: Icon,
  title,
  color,
  value,
}: CardStatsProps) => {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-xl border p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon color={color} size={20} className="shrink-0" />
        <h2 className="text-sm font-bold md:text-base">{title}</h2>
      </div>
      <div>
        <span
          className={cn("block w-fit border-b-2 pb-2 text-4xl font-bold")}
          style={{ borderColor: color }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};
