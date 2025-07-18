"use client";

import SelectModuleType from "@/components/container/select-module-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ModuleType } from "@/types/class";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { LineCharts } from "@/components/ui/line-charts";
import { skillPerformanceData } from "@/data/dummy-class-data";

const DetailStudent = ({
  student,
  onStudentChange,
}: {
  student: any;
  onStudentChange: (student: unknown | null) => void;
}) => {
  const [moduleType, setModuleType] = useState(ModuleType.Reading);
  const [searchTest, setSearchTest] = useState("");

  return (
    <div>
      <div className="flex items-center gap-9">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="hover:scale-110 hover:bg-transparent hover:text-white"
          onClick={() => onStudentChange(null)}
        >
          <ArrowLeft className="hover:text-white" />
        </Button>
        <div className="flex items-center gap-2 md:gap-5">
          <Avatar className="size-11">
            <AvatarImage src={student.image} alt={student.name} />
            <AvatarFallback>{student.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-5">
            <h4 className="text-xl font-medium text-white">{student.name}</h4>

            {/* Mobile (horizontal) */}
            <div className="flex h-px w-full items-center md:hidden">
              <Separator orientation="horizontal" className="bg-white/50" />
            </div>

            {/* Desktop (vertical) */}
            <div className="hidden h-6 items-center md:flex">
              <Separator orientation="vertical" className="bg-white/50" />
            </div>

            <p>Skill Performance</p>
          </div>
        </div>
      </div>
      <div className="mt-7 rounded-3xl bg-[#1A1A1A] px-5 py-6">
        <div className="mb-7 flex items-center gap-6 text-white">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 shrink-0 rounded-full bg-[#7A9D58]"></span>
            <p>Class Average Score</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 shrink-0 rounded-full bg-[#DC3545]"></span>
            <p>{"<<name>>"} Score</p>
          </div>
        </div>
        <div className="rounded-4xl bg-[#333333] p-4">
          <div className="mb-7 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h4 className="shrink-0 text-xl font-medium text-white capitalize">
              {moduleType} Performance
            </h4>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:w-1/2 xl:w-3/4">
              <Input
                endIcon={Search}
                onClickEndIcon={() => setSearchTest("")}
                value={searchTest}
                onChange={(e) => setSearchTest(e.target.value)}
                placeholder="Search test name..."
              />
              <SelectModuleType value={moduleType} onChange={setModuleType} />
            </div>
          </div>
          <LineCharts
            data={skillPerformanceData}
            xKey="name"
            yLabel="Average Score"
            dataKeys={[
              { key: "studentScore", label: "Your Score", color: "#DC3545" },
              { key: "classAvg", label: "Class Average", color: "#7A9D58" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailStudent;
