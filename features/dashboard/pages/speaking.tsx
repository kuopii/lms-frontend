"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, setMonth, setYear } from "date-fns";
import { BsClipboard2CheckFill, BsStarFill } from "react-icons/bs";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { CardStats } from "../components/card-stats";
import { LineCharts } from "@/components/ui/line-charts";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

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
  { id: "01", name: "Part 1", total_revision: 4, avg_revision: 2 },
  { id: "02", name: "Part 2", total_revision: 8, avg_revision: 2 },
  { id: "03", name: "Part 3", total_revision: 9, avg_revision: 3 },
];

export const SpeakingDashboardPage = () => {
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
        Speaking Progress Dashboard
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
        <div className="w-full">
          <div className="card-custom p-4 lg:p-6">
            <div className="mb-5 flex flex-col items-center justify-between gap-4 md:flex-row">
              <h4 className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
                Speaking Performance
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
        </div>

        {/* Revision insights */}
        <div className="card-custom w-full p-5 lg:w-[500px]">
          <div className="mb-6 flex flex-col gap-2">
            <div className="flex gap-4">
              <h3 className="text-xl font-medium text-white">
                Speaking Revision Insights
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-sm text-[#dedede]">Based on lowest accuracy</p>
              <Separator className="text-white" />
            </div>
          </div>

          <div className="text-white">
            <ul className="list-disc space-y-4 pl-5">
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
                <div className="flex items-center gap-2">
                  <p className="text-destructive">
                    Test 4 - Describing a Picture
                  </p>
                  <ExternalLink className="size-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
