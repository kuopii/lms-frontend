"use client";

import { CardDashboard } from "@/components/card-dashboard/CardDashboard";
import { LineCharts } from "@/components/ui/line-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Role } from "@/types/auth";
import { format, setMonth, setYear } from "date-fns";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

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

export const SpeakingComp = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // dari BE
  const userData = {
    id: "1",
    name: "anton",
    role: "student",
  };

  // Cast Role
  const user = {
    ...userData,
    role: userData.role as Role,
  };

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = setMonth(setYear(new Date(), currentYear), i);
    return {
      label: format(date, "MMMM"),
      value: format(date, "yyyy-MM"),
    };
  });
  return (
    <div className="flex flex-col gap-[45px]">
      <section>
        <CardDashboard userRole={user.role} />
      </section>
      <div className="flex w-full flex-col justify-between gap-9 lg:flex-row">
        {/* Line chart */}
        <section className="w-full">
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
        </section>

        {/* Performance question */}
        <section className="card-custom w-full px-[18px] py-[15px] lg:w-[500px]">
          <div className="mb-[25px] flex flex-col gap-2">
            <div className="flex gap-4">
              <h3 className="text-[22px] font-medium text-white">
                Speaking Revision Insights
              </h3>
            </div>

            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] text-[#dedede]">
                Based on lowest accuracy
              </p>
              <Separator className="h-2 bg-[#ffffff]" />
            </div>
          </div>

          <div className="text-white">
            <ul className="list-disc space-y-4 pl-5">
              <li>
                <div className="flex items-center gap-2">
                  <span>Task 1</span>
                  <ExternalLink className="size-[15px]" />
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>Total Revisions</span>
                    <span>Avg Revisions</span>
                  </div>
                  <div>
                    <Separator orientation="vertical" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#DC3545]">4</span>
                    <span className="text-[#DC3545]">2</span>
                  </div>
                </div>
                <Separator className="mt-[15px]" />
              </li>

              <li>
                <div className="flex items-center gap-2">
                  <span>Task 2</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>Total Revisions</span>
                    <span>Avg Revisions</span>
                  </div>
                  <div>
                    <Separator orientation="vertical" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#DC3545]">8</span>
                    <span className="text-[#DC3545]">2</span>
                  </div>
                </div>
                <Separator className="mt-[15px]" />
              </li>

              <li>
                <div className="flex items-center gap-2">
                  <span>Task 3</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>Total Revisions</span>
                    <span>Avg Revisions</span>
                  </div>
                  <div>
                    <Separator orientation="vertical" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#DC3545]">8</span>
                    <span className="text-[#DC3545]">2</span>
                  </div>
                </div>
                <Separator className="mt-[15px]" />
              </li>

              <li className="">
                <span>Most Revised Task</span>
                <div className="flex items-center gap-2">
                  <p className="text-[#DC3545]">
                    Test 4 - Describing a Picture
                  </p>
                  <ExternalLink className="size-[15px]" />
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

const page = () => {
  return (
    <div>
      <SpeakingComp />
    </div>
  );
};

export default page;
