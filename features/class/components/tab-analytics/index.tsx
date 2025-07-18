"use client";

import SelectModuleType from "@/components/container/select-module-type";
import { BarCharts } from "@/components/ui/bar-charts";
import { Input } from "@/components/ui/input";
import { LineCharts } from "@/components/ui/line-charts";
import { Separator } from "@/components/ui/separator";
import { ModuleType } from "@/types/class";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { format, setMonth, setYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PerformanceOverview from "./performance-overview";

const sectionKeys = [
  {
    key: "multipleChoice",
    label: "Multiple Choice",
    color: "#2dd4bf",
  }, // teal
  {
    key: "identifyingInformation",
    label: "Identifying Information",
    color: "#2563eb",
  }, // blue
  {
    key: "matchingHeading",
    label: "Matching Heading",
    color: "#facc15",
  }, // yellow
  {
    key: "sentenceCompletion",
    label: "Sentence Completion",
    color: "#e879f9",
  }, // pink
  {
    key: "paragraphCompletion",
    label: "Paragraph Completion",
    color: "#f43f5e",
  }, // red
];

const readingData = [
  {
    week: "Week 1",
    multipleChoice: 40,
    identifyingInformation: 50,
    matchingHeading: 75,
    sentenceCompletion: 80,
    paragraphCompletion: 60,
  },
  {
    week: "Week 2",
    multipleChoice: 50,
    identifyingInformation: 35,
    matchingHeading: 70,
    sentenceCompletion: 82,
    paragraphCompletion: 70,
  },
  {
    week: "Week 3",
    multipleChoice: 60,
    identifyingInformation: 65,
    matchingHeading: 85,
    sentenceCompletion: 76,
    paragraphCompletion: 80,
  },
  {
    week: "Week 4",
    multipleChoice: 88,
    identifyingInformation: 70,
    matchingHeading: 90,
    sentenceCompletion: 88,
    paragraphCompletion: 88,
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

const currentYear = new Date().getFullYear();
const months = Array.from({ length: 12 }, (_, i) => {
  const date = setMonth(setYear(new Date(), currentYear), i);
  return {
    label: format(date, "MMMM"),
    value: format(date, "yyyy-MM"),
  };
});

const TabContentAnalytics = () => {
  const [performanceModuleType, setPerformanceModuleType] = useState(
    ModuleType.Reading,
  );
  const [searchTestName, setSearchTestName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  return (
    <div className="w-full space-y-7">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-6">
        <section className="flex min-h-[352px] w-full flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-gradient-to-b from-[#3a3a00] to-black p-2 text-center text-white shadow-lg xl:col-span-2">
          <div className="mb-20 text-xl font-semibold text-white">
            Class Average Score
          </div>
          <div className="mb-6 text-5xl font-extrabold">XX</div>
          <div className="mx-auto mb-4 h-[2px] w-3/4 bg-[#7A9D58]" />
          <div className="mt-6 text-base">For whole test</div>
        </section>
        <section className="h-full w-full rounded-4xl xl:col-span-4">
          <PerformanceOverview />
        </section>
      </div>
      <section className="rounded-4xl bg-[#333333] p-4 lg:p-6">
        <h4 className="mb-6 text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
          Average Score by Skill
        </h4>
        <BarCharts
          data={[
            { skill: "Reading", score: 70 },
            { skill: "Listening", score: 80 },
            { skill: "Speaking", score: 90 },
            { skill: "Writing", score: 85 },
          ]}
          xKey="skill"
          barGap={32}
          dataKeys={[
            { key: "score", label: "Average Score", color: "#7A9D58" },
          ]}
          variant="horizontal"
          barSize={60}
        />
      </section>
      <div className="flex flex-col gap-6 rounded-4xl bg-[#1A1A1A] p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
            Class Performance Overview
          </h4>
          <SelectModuleType
            value={performanceModuleType}
            className="w-[180px]"
            onChange={setPerformanceModuleType}
            placeholder="Select module type"
          />
        </div>
        <Separator />
        <section className="rounded-4xl bg-[#333333] p-4 lg:p-6">
          <div className="mb-5 flex items-center justify-between gap-4 flex-col md:flex-row">
            <h4 className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
              Average Reading Score / Test
            </h4>
            <div className="w-full lg:w-fit lg:min-w-xs">
              <Input
                className="h-11 w-full "
                value={searchTestName}
                placeholder="Search test name..."
                onChange={(e) => setSearchTestName(e.target.value)}
                endIcon={searchTestName ? X : Search}
                onClickEndIcon={
                  searchTestName ? () => setSearchTestName("") : undefined
                }
              />
            </div>
          </div>
          <LineCharts
            data={testData}
            xKey="label"
            dataKeys={[
              { key: "average", label: "Average Score", color: "#84cc16" },
            ]}
            yLabel="Average Score"
          />
        </section>
        <section className="rounded-4xl bg-[#333333] p-4 lg:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
              Reading Progress by Section
            </h4>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px] bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <LineCharts
            data={readingData}
            xKey="week"
            dataKeys={sectionKeys}
            yLabel="Average Score"
            showLegend
          />
        </section>
      </div>
    </div>
  );
};

export default TabContentAnalytics;
