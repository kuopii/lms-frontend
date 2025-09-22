"use client";

import React, { useState } from "react";
import { LineCharts } from "@/components/ui/line-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardStats } from "../components/card-stats";
import { BsClipboard2CheckFill, BsStarFill } from "react-icons/bs";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { format, setMonth, setYear } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { CardPerformance } from "../components/card-performance";

const statsData = [
  {
    icon: BsClipboard2CheckFill,
    title: "Tasks Completed",
    color: "#7A9D58",
    value: "XX",
  },
  {
    icon: MdOutlineAccessTimeFilled,
    title: "Time Spent",
    color: "#0F68DC",
    value: "XX",
  },
  {
    icon: BsStarFill,
    title: "Average Score",
    color: "#FFC107",
    value: "XX",
  },
];

const testData = [
  {
    testName: "Test 1",
    tag: "#Travel",
    average: 55,
    label: "Test 1\n#Travel",
  },
  {
    testName: "Test 2",
    tag: "#Food",
    average: 50,
    label: "Test 2\n#Food",
  },
  {
    testName: "Test 3",
    tag: "#Music",
    average: 65,
    label: "Test 3\n#Music",
  },
  {
    testName: "Test 4",
    tag: "#School",
    average: 70,
    label: "Test 4\n#School",
  },
  {
    testName: "Test 5",
    tag: "#Art",
    average: 90,
    label: "Test 5\n#Art",
  },
];

const revisionInsights = [
  { id: "01", name: "Task 1", total_revision: 4, avg_revision: 2 },
  { id: "02", name: "Task 2", total_revision: 8, avg_revision: 2 },
];

export const WritingDashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = setMonth(setYear(new Date(), currentYear), i);
    return {
      label: format(date, "MMMM"),
      value: format(date, "yyyy-MM"),
    };
  });

  return (
    <div className="space-y-11">
      <h1 className="text-2xl font-semibold text-white">
        Writing Progress Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {statsData.map((e, idx) => (
          <CardStats
            key={idx}
            icon={e.icon}
            title={e.title}
            color={e.color}
            value={e.value}
          />
        ))}
      </div>

      <section className="flex w-full flex-col justify-between gap-9 lg:flex-row">
        {/* Line chart */}
        <section className="w-full">
          <div className="card-custom p-4 lg:p-6">
            <div className="mb-5 flex flex-col items-center justify-between gap-4 md:flex-row">
              <h4 className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
                Writing Performance
              </h4>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="select-trigger-custom w-[180px] text-white ring-1 ring-white/20 backdrop-blur-sm">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent className="text-white">
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <LineCharts
              data={testData}
              xKey="label"
              dataKeys={[
                { key: "average", label: "Average Score", color: "#84cc16" },
              ]}
              yLabel="Average Score"
            />
          </div>
        </section>

        {/* Revision insights */}
        <CardPerformance
          headTitle={"Writing Revision Insights"}
          paragraph={"Based on lowest accuracy"}
          className="lg:w-[500px]"
        >
          {revisionInsights.map((revision) => (
            <li key={revision.id} className="text-sm">
              <h4>{revision.name}</h4>

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span>Total Revisions</span>
                  <span>Avg Revisions</span>
                </div>
                <div>
                  <Separator orientation="vertical" />
                </div>
                <div className="flex flex-col">
                  <span className="text-destructive">
                    {revision.total_revision}
                  </span>
                  <span className="text-destructive">
                    {revision.avg_revision}
                  </span>
                </div>
              </div>
              <Separator className="mt-4" />
            </li>
          ))}

          <li className="text-sm">
            <span>Most Revised Task</span>
            <p className="text-destructive">Test 4 - Describing a Picture</p>
          </li>
        </CardPerformance>
      </section>
    </div>
  );
};
