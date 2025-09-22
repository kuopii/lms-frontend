"use client";

import { LineCharts } from "@/components/ui/line-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccurationType } from "@/types/dashboard";
import { format, setMonth, setYear } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { BsClipboard2CheckFill, BsStarFill } from "react-icons/bs";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { CardStats } from "../components/card-stats";
import {
  CardPerformance,
  CardPerformanceList,
} from "../components/card-performance";

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

const accurations = [
  {
    id: "01",
    test_name: "Choose the Correct Answer",
    accuracy: 10,
    accuration_type: AccurationType.lowest,
  },
  {
    id: "02",
    test_name: "Choose Multiple Answer",
    accuracy: 18,
    accuration_type: AccurationType.lowest,
  },
  {
    id: "03",
    test_name: "Map Labeling",
    accuracy: 20,
    accuration_type: AccurationType.lowest,
  },
  {
    id: "04",
    test_name: "Table Completion",
    accuracy: 80,
    accuration_type: AccurationType.highest,
  },
  {
    id: "05",
    test_name: "Sentence Completion",
    accuracy: 78,
    accuration_type: AccurationType.highest,
  },
  {
    id: "06",
    test_name: "Short Answer Question",
    accuracy: 75,
    accuration_type: AccurationType.highest,
  },
];

export const ListeningDashboardPage = () => {
  const [accurationType, setAccurationType] = useState<AccurationType>(
    AccurationType.lowest,
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = setMonth(setYear(new Date(), currentYear), i);
    return {
      label: format(date, "MMMM"),
      value: format(date, "yyyy-MM"),
    };
  });

  const handleChangeAccurationType = () => {
    setAccurationType((prev) =>
      prev === AccurationType.lowest
        ? AccurationType.highest
        : AccurationType.lowest,
    );
  };

  const filteredAccurations = accurations.filter(
    (accuration) => accuration.accuration_type === accurationType,
  );

  const config =
    accurationType === AccurationType.highest
      ? {
          title: "Your Best Question Type",
          subtitle: "Based on highest accuracy",
          icon: <ArrowUp className="text-primary" />,
          textColor: "text-primary",
        }
      : {
          title: "Your Weakest Question Type",
          subtitle: "Based on lowest accuracy",
          icon: <ArrowDown className="text-destructive" />,
          textColor: "text-destructive",
        };

  return (
    <div className="space-y-11">
      <h1 className="text-2xl font-semibold text-white">
        Listening Progress Dashboard
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
        </div>

        {/* Performance question */}
        <CardPerformance
          icon={config.icon}
          headTitle={config.title}
          paragraph={config.subtitle}
          className="lg:w-[500px]"
          onClick={handleChangeAccurationType}
        >
          {filteredAccurations.map((item, idx) => (
            <CardPerformanceList
              key={idx}
              title={item.test_name}
              accurateness={item.accuracy}
              className={config.textColor}
              withSeparator={idx !== filteredAccurations.length - 1}
            />
          ))}
        </CardPerformance>
      </section>

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
