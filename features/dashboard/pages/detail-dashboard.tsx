"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarDays,
  Check,
  Search,
  SlidersHorizontal,
  Trash,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFetchReport } from "../api/use-fetch-report";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import { MdOutlineShowChart } from "react-icons/md";
import { CardStats } from "../components/card-stats";
import {
  CardPerformance,
  CardPerformanceList,
} from "../components/card-performance";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { DataTable } from "../components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/container/pagination";
import { leaderboard_data } from "@/data/dashboard-data";
import { leaderboardColumns } from "../components/columns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useFetchResult } from "../api/use-fetch-result";

const statsData = [
  {
    icon: BsArrowUp,
    title: "Highest Score",
    color: "#7A9D58",
    value: "XX",
  },
  {
    icon: MdOutlineShowChart,
    title: "Average Score",
    color: "#0F68DC",
    value: "XX",
  },
  {
    icon: BsArrowDown,
    title: "Lowest Score",
    color: "#DC3545",
    value: "XX",
  },
];

const weakPerformanceData = [
  { title: "Matching Heading", accurate: 10 },
  { title: "Paragraph Completion", accurate: 18 },
  { title: "True /False / Not Given", accurate: 20 },
];

const bestPerformanceData = [
  { title: "Sentence Completion", accurate: 80 },
  { title: "Choose Multiple Answer", accurate: 78 },
  { title: "Choose The Correct Answer", accurate: 75 },
];

export const DetailDashboardPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    params: searchParams,
    updateParams,
    resetParams,
  } = useUpdateSearchParams();
  const [search, setSearch] = useState(searchParams.search || "");
  const debouncedSearch = useDebounce(search, 300);
  const [monthsToShow, setMonthsToShow] = useState(2);
  const [testStatus, setTestStatus] = useState<string[]>(
    searchParams.status?.split(",").filter(Boolean) || [],
  );
  const [submissionDate, setSubmissionDate] = useState<DateRange | undefined>({
    from:
      searchParams.from && searchParams.from !== null
        ? new Date(searchParams.from)
        : undefined,
    to:
      searchParams.to && searchParams.to !== null
        ? new Date(searchParams.to)
        : undefined,
  });
  const [minScore, setMinScore] = useState(searchParams.minScore || "");
  const [maxScore, setMaxScore] = useState(searchParams.maxScore || "");
  const currentPage = Number(searchParams.page) || 1;
  const currentPageSize = Number(searchParams.pageSize) || 10;

  const { data: reportData } = useFetchReport({
    id,
    onError: (e) => {
      toast.error(e.message || "Something went wrong when fetching test");
    },
  });

  const { data: resultData } = useFetchResult({
    search: searchParams.search || "",
    page: currentPage,
    size: currentPageSize,
    status: searchParams.status?.split(",").filter(Boolean) || [],
    from: searchParams.from || "",
    to: searchParams.to || "",
    minScore: Number(minScore) || null,
    maxScore: Number(maxScore) || null,
    onError: (e) => {
      toast.error(e.message || "Something went wrong when fetching test");
    },
  });

  console.log("resultData", resultData);

  const handleResetFilter = () => {
    resetParams();
    setSearch("");
    setTestStatus([]);
    setSubmissionDate(undefined);
    setMinScore("");
    setMaxScore("");
  };

  const handlePageSizeChange = (newPageSize: string) => {
    updateParams({
      pageSize: newPageSize,
      page: "1",
    });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
  };

  const handleApplyFilter = () => {
    updateParams({
      status: testStatus.length > 0 ? testStatus.join(",") : null,
      from: submissionDate?.from ? submissionDate.from.toISOString() : null,
      to: submissionDate?.to ? submissionDate.to.toISOString() : null,
      minScore: minScore || null,
      maxScore: maxScore || null,
      page: "1",
    });
  };

  useEffect(() => {
    updateParams({
      search: debouncedSearch || null,
    });
  }, [debouncedSearch, updateParams]);

  useEffect(() => {
    setTestStatus(searchParams.status?.split(",").filter(Boolean) || []);
    setSubmissionDate({
      from:
        searchParams.from && searchParams.from !== null
          ? new Date(searchParams.from)
          : undefined,
      to:
        searchParams.to && searchParams.to !== null
          ? new Date(searchParams.to)
          : undefined,
    });
    setMinScore(searchParams.minScore || "");
    setMaxScore(searchParams.maxScore || "");
  }, [
    searchParams.status,
    searchParams.from,
    searchParams.to,
    searchParams.minScore,
    searchParams.maxScore,
  ]);

  useEffect(() => {
    const handleResize = () => setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasActiveFilters = Boolean(
    searchParams.search ||
      searchParams.status ||
      searchParams.from ||
      searchParams.to ||
      searchParams.minScore ||
      searchParams.maxScore ||
      (searchParams.page && searchParams.page !== "1") ||
      (searchParams.pageSize && searchParams.pageSize !== "10"),
  );

  return (
    <div className="space-y-7">
      <div className="mb-6 flex items-center gap-3">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => router.push("/dashboard/summary")}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-semibold text-white">Test Report</h1>
      </div>

      <div className="mx-auto flex flex-col items-center justify-center gap-5 text-center">
        <h2 className="text-primary text-xl font-bold">
          {reportData?.test_name}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <p>Attemps:{reportData?.attemps}</p>
          <p> Class Name: {reportData?.class}</p>
          <p>Date: {reportData?.created_at}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {statsData.map((stat) => (
          <CardStats
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            color={stat.color}
            value={stat.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CardPerformance
          icon={<ArrowDown />}
          iconClassName="text-destructive hover:text-destructive"
          headTitle="Weakest Question Type"
          paragraph="Based on lowest accuracy"
        >
          {weakPerformanceData.map((item, idx) => (
            <CardPerformanceList
              key={idx}
              title={item.title}
              accurateness={item.accurate}
              className="text-destructive"
              withSeparator={idx !== weakPerformanceData.length - 1}
            />
          ))}
        </CardPerformance>
        <CardPerformance
          icon={<ArrowUp />}
          iconClassName="text-primary hover:text-primary"
          headTitle="Best Question Type"
          paragraph="Based on highest accuracy"
        >
          {bestPerformanceData.map((item, idx) => (
            <CardPerformanceList
              key={idx}
              title={item.title}
              accurateness={item.accurate}
              className="text-primary"
              withSeparator={idx !== weakPerformanceData.length - 1}
            />
          ))}
        </CardPerformance>
      </div>

      <section className="space-y-3 rounded-xl bg-[#333333] p-5">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h4 className="text-xl font-semibold text-white">Leaderboard</h4>
          <div className="flex w-full min-w-64 items-center gap-4 md:min-w-72 lg:max-w-96">
            <Input
              value={search}
              placeholder="Seach by student name"
              className="h-10"
              onChange={(e) => setSearch(e.target.value)}
              endIcon={search ? X : Search}
              onClickEndIcon={search ? () => setSearch("") : undefined}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"icon"} variant={"outline"}>
                  <SlidersHorizontal />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Status */}
                  <div className="space-y-4">
                    <div className="border-b pb-4 font-medium text-white">
                      Status
                    </div>
                    <ToggleGroup
                      type="multiple"
                      value={testStatus}
                      onValueChange={(value) => setTestStatus(value)}
                      className="mt-4 grid w-full grid-cols-2 gap-4 lg:grid-cols-3"
                    >
                      {["ontime", "late", "unsubmitted"].map((label) => {
                        const value = label.toLowerCase();
                        const isSelected = testStatus.includes(value);

                        return (
                          <ToggleGroupItem
                            key={value}
                            value={value}
                            className={cn(
                              "group flex items-center gap-2 rounded-full border px-5 py-2 text-white transition-all hover:bg-none",
                              "data-[state=on]:bg-white",
                            )}
                          >
                            {/* Icon */}
                            <span
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                isSelected
                                  ? "bg-primary text-white"
                                  : "group-hover:border-foreground border-white",
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>

                            {/* Label */}
                            <span className="text-xs capitalize">
                              {label.replace("-", " ")}
                            </span>
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                  </div>

                  {/* Created / Deadline */}
                  <div>
                    <div className="border-b pb-4 text-lg font-medium text-white">
                      Deadline
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size={"sm"}
                          variant="outline"
                          className="mt-4 w-full justify-between rounded-full text-sm text-white"
                        >
                          {submissionDate?.from && submissionDate?.to
                            ? `${format(
                                submissionDate.from,
                                "PPP",
                              )} - ${format(submissionDate.to, "PPP")}`
                            : "Pick a date range"}
                          <CalendarDays className="ml-2 h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden rounded-xl p-0 text-white"
                        align="center"
                      >
                        <Calendar
                          mode="range"
                          selected={submissionDate}
                          onSelect={setSubmissionDate}
                          numberOfMonths={monthsToShow}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Score Range */}
                  <div className="space-y-4">
                    <div className="border-b pb-4 text-lg font-medium text-white">
                      Score Range
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Min Score
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={minScore}
                          onChange={(e) => setMinScore(e.target.value)}
                          className="h-10"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">
                          Max Score
                        </label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={maxScore}
                          onChange={(e) => setMaxScore(e.target.value)}
                          className="h-10"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleApplyFilter}
                    size={"xsm"}
                    className="w-full"
                  >
                    Apply Filter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {hasActiveFilters && (
              <Button
                disabled={!hasActiveFilters}
                onClick={handleResetFilter}
                variant={"destructive"}
                className="h-11 flex-1 rounded-full"
                size={"xs"}
              >
                <Trash />
                Reset
              </Button>
            )}
          </div>
        </div>
        <DataTable columns={leaderboardColumns} data={leaderboard_data} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
            <Select
              value={currentPageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          </div>
          <Pagination
            page={currentPage}
            setPage={handlePageChange}
            totalPages={3}
            handleQueryParams={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
};
