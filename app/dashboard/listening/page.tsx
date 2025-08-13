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
import { FaArrowDown } from "react-icons/fa";

// ------------------------------------- Listening Component
const ListeningComp = () => {
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
                Listening Performance
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
                Your Weakest Question Type
              </h3>
              <FaArrowDown color="#DC3545" className="mt-2 size-[24px]" />
            </div>

            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] text-[#dedede]">
                Based on lowest accuracy
              </p>
              <Separator className="text-white" />
            </div>
          </div>

          <div className="text-white">
            <ul className="list-disc space-y-4 pl-5">
              <li>
                <div className="flex items-center gap-2">
                  <span>Choose the Correct Answer</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <p className="text-[#DC3545]">10% correct</p>
                <Separator className="mt-[15px] text-white/40" />
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <span>Choose Multiple Answer</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <p className="text-[#DC3545]">18% correct</p>
                <Separator className="mt-[15px] text-white/40" />
              </li>
              <li className="">
                <div className="flex items-center gap-2">
                  <span>Map Labeling</span>
                  <ExternalLink className="size-[15px]" />
                </div>
                <p className="text-[#DC3545]">20% correct</p>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Multiple Line chart */}
      <section className="card-custom p-4 lg:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-white">
            Listening Progress by Section
          </h4>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="select-trigger-custom w-[180px] text-white ring-1 ring-white/20 backdrop-blur-sm">
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
          data={listeningDataLineChartMulti}
          xKey="week"
          dataKeys={sectionKeys}
          yLabel="Average Score"
          showLegend
        />
      </section>
    </div>
  );
};

// ------------------------------------- PAGES

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

const listeningDataLineChartMulti = [
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

const page = () => {
  return (
    <div>
      <ListeningComp />
    </div>
  );
};

export default page;
