"use client";

import SelectModuleType from "@/components/container/select-module-type";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModuleType } from "@/types/class";
import { ExternalLink } from "lucide-react";
import React, { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const performanceData = {
  reading: [
    {
      title: "Paragraph Completion",
      value: 18,
    },
    {
      title: "Matching Heading",
      value: 16,
    },
    {
      title: "Multiple Choice",
      value: 10,
    },
  ],
  listening: [
    {
      title: "Map Labeling",
      value: 18,
    },
    {
      title: "Show answer",
      value: 16,
    },
    {
      title: "Sentence Completion",
      value: 10,
    },
  ],
  speaking: [
    {
      title: "Task 1",
      totalRevisions: 4,
      avgRevisions: 2,
    },
    {
      title: "Task 2",
      totalRevisions: 8,
      avgRevisions: 2,
    },
    {
      title: "Task 3",
      totalRevisions: 9,
      avgRevisions: 3,
    },
    {
      title: "Most Revised Task",
      paragraf: "Test 1 - Describing a Memorable Trip",
    },
  ],
  writing: [
    {
      title: "Task 1",
      totalRevisions: 4,
      avgRevisions: 2,
    },
    {
      title: "Task 2",
      totalRevisions: 8,
      avgRevisions: 2,
    },
    {
      title: "Most Revised Task",
      paragraf: "Test 4 - Describing a Picture",
    },
  ],
};

type DefaultItem = { title: string; value: number };

type RevisionRegularItem = {
  title: string;
  totalRevisions: number;
  avgRevisions: number;
};

type RevisionHighlightItem = {
  title: string;
  paragraf: string;
};

type RevisionItem = RevisionRegularItem | RevisionHighlightItem;

export const PerformanceItemList = ({
  data,
  variant = "default",
}: {
  data: DefaultItem[] | RevisionItem[];
  variant?: "default" | "revision";
}) => {
  return (
    <div className="flex flex-col gap-4">
      {variant === "default" &&
        (data as { title: string; value: number }[]).map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-start gap-2.5">
              <span className="text-lg">•</span>
              <div className="flex w-full items-center justify-between">
                <div>
                  <h4 className="text-white">{item.title}</h4>
                  <p className="text-destructive text-sm">
                    {item.value}% correct
                  </p>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
            </div>
            <Separator />
          </React.Fragment>
        ))}

      {variant === "revision" &&
        (data as RevisionItem[]).map((item, index) => {
          const isMostRevised = "paragraf" in item;

          return (
            <React.Fragment key={index}>
              <div className="flex items-start gap-2.5">
                <span className="text-lg">•</span>
                <div className="flex w-full flex-col">
                  {isMostRevised ? (
                    <>
                      <p className="font-medium text-white">{item.title}</p>
                      <a
                        className="text-destructive flex items-center gap-2 text-sm"
                        href="#"
                      >
                        {item.paragraf}
                        <ExternalLink color="white" size={16} />
                      </a>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-white">{item.title}</p>
                      <div className="flex h-10 items-center gap-4 text-sm">
                        <div>
                          <p>Total Revision</p>
                          <p>Avg Revision</p>
                        </div>
                        <Separator
                          orientation="vertical"
                          className="bg-border h-10 w-px"
                        />
                        <div>
                          <p className="text-destructive">
                            {item.totalRevisions}
                          </p>
                          <p className="text-destructive">
                            {item.avgRevisions}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <Separator />
            </React.Fragment>
          );
        })}
    </div>
  );
};

const PerformanceOverview = () => {
  const [moduleType, setModuleType] = useState(ModuleType.Reading);
  const [direction, setDirection] = useState<"up" | "down">("down");

  return (
    <div className="flex h-full w-full flex-col gap-6 rounded-3xl bg-[#333333] px-5 py-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            size={"icon"}
            variant={"link"}
            className={`${direction === "down" ? "text-destructive rotate-180" : ""} hidden`}
            onClick={() =>
              setDirection((prev) => (prev === "up" ? "down" : "up"))
            }
          >
            <FaArrowUp />
          </Button>
          <div className="space-y-2.5">
            <h4 className="text-xl font-medium">
              {moduleType === ModuleType.Reading ||
              moduleType === ModuleType.Listening
                ? "Weakest Performance Areas"
                : moduleType === ModuleType.Speaking
                  ? "Speaking Revision Insights"
                  : moduleType === ModuleType.Writing
                    ? "Writing Revision Insights"
                    : "No Data Available"}
            </h4>
            <p className="text-sm">
              Based on {direction === "up" ? "highest" : "lowest"} accuracy
            </p>
          </div>
        </div>
        <SelectModuleType
          className="h-11 w-fit"
          value={moduleType}
          onChange={setModuleType}
        />
      </div>
      <Separator />
      {/* Content */}
      {moduleType === ModuleType.Reading && (
        <PerformanceItemList data={performanceData.reading} />
      )}
      {moduleType === ModuleType.Listening && (
        <PerformanceItemList data={performanceData.listening} />
      )}
      {moduleType === ModuleType.Speaking && (
        <PerformanceItemList
          data={performanceData.speaking}
          variant="revision"
        />
      )}
      {moduleType === ModuleType.Writing && (
        <PerformanceItemList
          data={performanceData.writing}
          variant="revision"
        />
      )}
    </div>
  );
};

export default PerformanceOverview;
