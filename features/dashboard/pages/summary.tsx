"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { student_dashboard, teacher_dashboard } from "@/data/dashboard-data";
import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { Role } from "@/types/auth";
import {
  CalendarDays,
  Check,
  Search,
  SlidersHorizontal,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsClipboard2CheckFill, BsFillPeopleFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { CardStats } from "../components/card-stats";
import { studentColumns, teacherColumns } from "../components/columns";
import { DataTable } from "../components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/container/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useDashboardSummary } from "../api/use-dashboard-summary";
import { toast } from "sonner";

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
    icon: BsFillPeopleFill,
    title: "Total Students",
    color: "#7A9D58",
    value: "XX",
  },
  {
    icon: SiGoogleclassroom,
    title: "Total Classes",
    color: "#0F68DC",
    value: "XX",
  },
];

const navigationTests = [
  { name: "Reading", href: "/test/reading/create" },
  { name: "Listening", href: "/test/listening/create" },
  { name: "Speaking", href: "/test/speaking/create" },
  { name: "Writing", href: "/test/writing/create" },
];

export const SummaryDashboardPage = () => {
  const { params, updateParams, resetParams } = useUpdateSearchParams();
  const [search, setSearch] = useState(params.search || "");
  const [selectedModules, setSelectedModules] = useState<string[]>(
    params.modules?.split(",").filter(Boolean) || [],
  );
  const [testStatus, setTestStatus] = useState<string[]>(
    params.status?.split(",").filter(Boolean) || [],
  );
  const [deadlineRange, setDeadlineRange] = useState<DateRange | undefined>({
    from: params.from ? new Date(params.from) : undefined,
    to: params.to ? new Date(params.to) : undefined,
  });
  const [selectedClass, setSelectedClass] = useState(params.class || "");
  const debouncedSearch = useDebounce(search, 300);
  const [monthsToShow, setMonthsToShow] = useState(2);

  const currentPage = Number(params.page) || 1;
  const currentPageSize = Number(params.pageSize) || 10;

  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.STUDENT,
    },
  });

  // Use params for API call instead of state
  const { data } = useDashboardSummary({
    page: currentPage,
    size: currentPageSize,
    search: params.search || "",
    module: params.modules?.split(",").filter(Boolean) || [],
    status: params.status?.split(",").filter(Boolean) || [],
    class: params.class || "",
    from: params.from || "",
    to: params.to || "",
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  console.log(data);

  useEffect(() => {
    updateParams({
      search: debouncedSearch || null,
    });
  }, [debouncedSearch, updateParams]);

  useEffect(() => {
    const handleResize = () => setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync state with params when params change
  useEffect(() => {
    setSelectedModules(params.modules?.split(",").filter(Boolean) || []);
    setTestStatus(params.status?.split(",").filter(Boolean) || []);
    setSelectedClass(params.class || "");
    setDeadlineRange({
      from: params.from ? new Date(params.from) : undefined,
      to: params.to ? new Date(params.to) : undefined,
    });
  }, [params.modules, params.status, params.class, params.from, params.to]);

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
  };

  const handleApplyFilter = () => {
    updateParams({
      modules: selectedModules.length > 0 ? selectedModules.join(",") : null,
      status: testStatus.length > 0 ? testStatus.join(",") : null,
      class: selectedClass || null,
      page: "1",
      from: deadlineRange?.from
        ? format(deadlineRange.from, "yyyy-MM-dd")
        : null,
      to: deadlineRange?.to ? format(deadlineRange.to, "yyyy-MM-dd") : null,
    });
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    updateParams({
      class: value || null,
      page: "1",
    });
  };

  const handlePageSizeChange = (newPageSize: string) => {
    updateParams({
      pageSize: newPageSize,
      page: "1",
    });
  };

  const handleResetFilter = () => {
    resetParams();
    setSearch("");
    setSelectedModules([]);
    setTestStatus([]);
    setSelectedClass("");
    setDeadlineRange(undefined);
  };

  const hasActiveFilters = Boolean(
    params.search ||
      params.modules ||
      params.status ||
      params.class ||
      params.from ||
      params.to ||
      (params.page && params.page !== "1") ||
      (params.pageSize && params.pageSize !== "10"),
  );

  const teacherStatsData = statsData.slice(2);
  const studentStatsData = statsData.slice(0, 2);

  const currentStats =
    session.user.role === Role.TEACHER ? teacherStatsData : studentStatsData;

  return (
    <div className="space-y-11">
      <h1 className="text-2xl font-semibold text-white">
        {session.user.role === Role.TEACHER ? "Overview" : "Your Wrap Up"}
      </h1>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {currentStats.map((e, idx) => (
          <CardStats
            key={idx}
            icon={e.icon}
            title={e.title}
            color={e.color}
            value={e.value}
          />
        ))}
        {session.user.role === Role.TEACHER && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-full min-h-[132px] flex-col [&_svg:not([class*='size-'])]:size-6">
                <FaPlus size={20} />
                Build Test
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 space-y-1" align="center">
              <DropdownMenuLabel>Choose the Test Module</DropdownMenuLabel>
              <Separator />
              {navigationTests.map((e, idx) => (
                <DropdownMenuItem key={idx} asChild>
                  <Link href={e.href} className="flex justify-center">
                    {e.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </section>

      <section className="space-y-3 rounded-xl bg-[#333333] p-5">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h4 className="text-xl font-semibold text-white">
            {session.user.role === Role.STUDENT
              ? "Task Overview"
              : "Test Library"}
          </h4>
          <div className="flex w-full min-w-64 items-center gap-4 md:min-w-72 lg:max-w-96">
            <Input
              value={search}
              placeholder="Search for a test"
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
                  {/* Module / Class */}
                  <div className="space-y-4">
                    <div className="border-b pb-4 font-medium text-white">
                      {session.user.role === Role.TEACHER ? "Class" : "Module"}
                    </div>
                    {session.user.role === Role.TEACHER ? (
                      <Select
                        value={selectedClass}
                        onValueChange={handleClassChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="class-a">Class A</SelectItem>
                            <SelectItem value="class-b">Class B</SelectItem>
                            <SelectItem value="class-c">Class C</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      <ToggleGroup
                        type="multiple"
                        value={selectedModules}
                        onValueChange={(value) => setSelectedModules(value)}
                        className="mt-4 grid w-full grid-cols-2 gap-4 lg:grid-cols-4"
                      >
                        {["reading", "listening", "speaking", "writing"].map(
                          (label) => {
                            const value = label.toLowerCase();
                            const isSelected = selectedModules.includes(value);

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
                                  {label}
                                </span>
                              </ToggleGroupItem>
                            );
                          },
                        )}
                      </ToggleGroup>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-4">
                    <div className="border-b pb-4 font-medium text-white">
                      Status
                    </div>
                    <ToggleGroup
                      type="multiple"
                      value={testStatus}
                      onValueChange={(value) => setTestStatus(value)}
                      className="mt-4 grid w-full grid-cols-2 gap-4 lg:grid-cols-4"
                    >
                      {(session?.user?.role === Role.STUDENT
                        ? ["done", "todo", "review"]
                        : ["ongoing", "closed", "schedule"]
                      ).map((label) => {
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
                          {deadlineRange?.from && deadlineRange?.to
                            ? `${format(
                                deadlineRange.from,
                                "PPP",
                              )} - ${format(deadlineRange.to, "PPP")}`
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
                          selected={deadlineRange}
                          onSelect={setDeadlineRange}
                          numberOfMonths={monthsToShow}
                        />
                      </PopoverContent>
                    </Popover>
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
        <DataTable
          columns={
            session.user.role === Role.TEACHER ? teacherColumns : studentColumns
          }
          data={
            session.user.role === Role.TEACHER
              ? teacher_dashboard
              : student_dashboard
          }
        />
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
