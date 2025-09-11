"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFetchClass } from "@/features/class/api/use-fetch-class";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IoArrowForwardCircle } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { BsSliders } from "react-icons/bs";
import { CalendarDays, Check, Search, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Role } from "@/types/auth";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { useFetchAssignments } from "@/features/class/api/use-fetch-assignments";
import { getInitialsFromName } from "@/helpers/get-initials-from-name";
import TabContentStudent from "@/features/class/components/tab-student";
import TabContentAnalytics from "@/features/class/components/tab-analytics";
import { AssignmentCard } from "@/features/class/components/assignment-card";

export const DetailClassPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });
  const { params: searchParams, updateParams } = useUpdateSearchParams();
  const [search, setSearch] = useState(searchParams.search || "");
  const debouncedSearch = useDebounce(search, 300);
  const [deadlineRange, setDeadlineRange] = useState<DateRange | undefined>({
    from: searchParams.from ? new Date(searchParams.from) : undefined,
    to: searchParams.to ? new Date(searchParams.to) : undefined,
  });
  const [selectedModules, setSelectedModules] = useState<string[]>(
    searchParams.modules?.split(",") || [],
  );
  const [monthsToShow, setMonthsToShow] = useState(2);

  const { data: rawAssignments } = useFetchAssignments({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    classId: id,
    userId: session.user.id,
  });

  const assignments = rawAssignments?.map((assignment) => ({
    ...assignment,
    type: assignment.type as "reading" | "listening" | "speaking" | "writing",
    deadline: new Date(assignment.deadline),
  }));

  const { data: classData } = useFetchClass({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    classId: id,
  });

  const handleApplyFilter = () => {
    updateParams({
      modules: selectedModules.length > 0 ? selectedModules.join(",") : null,
      from: deadlineRange?.from
        ? format(deadlineRange.from, "yyyy-MM-dd")
        : null,
      to: deadlineRange?.to ? format(deadlineRange.to, "yyyy-MM-dd") : null,
    });
  };

  useEffect(() => {
    const handleResize = () => setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateParams({ search: debouncedSearch || null });
  }, [debouncedSearch, updateParams]);

  return (
    <div>
      <section className="relative mb-7 h-56 w-full rounded-4xl bg-[#333333]">
        <div className="absolute bottom-7 left-0 flex flex-col gap-5 px-9">
          <h1 className="text-3xl text-white">{classData?.name}</h1>
          <div className="flex items-center gap-2.5">
            <Avatar>
              <AvatarImage src={classData?.teacher.image} />
              <AvatarFallback className="text-muted-foreground">
                {getInitialsFromName(classData?.teacher.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-white">{classData?.teacher.name}</span>
          </div>
        </div>
      </section>
      <Tabs defaultValue="class-assignments">
        <TabsList>
          <TabsTrigger value="class-assignments">Class Assignments</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
          {session.user.role === Role.TEACHER && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="class-assignments" className="mt-11">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:justify-between lg:gap-8">
            <Button
              size={"xs"}
              className="h-11 rounded-full [&_svg:not([class*='size-'])]:size-6"
            >
              Submission List <IoArrowForwardCircle />
            </Button>
            <div className="flex items-center gap-4 md:flex-row">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="h-11 w-full lg:w-96"
                endIcon={search ? X : Search}
                onClickEndIcon={search ? () => setSearch("") : undefined}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 text-white [&_svg:not([class*='size-'])]:size-6"
                  >
                    <BsSliders />
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-full max-w-xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Filters</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* MODULE */}
                    <div>
                      <div className="border-b pb-4 font-medium text-white">
                        Module
                      </div>
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
                    </div>

                    {/* DEADLINE */}
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
                      size={"sm"}
                      className="w-full rounded-3xl"
                    >
                      Apply Filter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Assignments */}
          <div className="mt-7 flex flex-col gap-4">
            {assignments?.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="student" className="mt-11">
          <TabContentStudent classId={id} />
        </TabsContent>
        {session.user.role === Role.TEACHER && (
          <TabsContent value="analytics" className="mt-11">
            <TabContentAnalytics />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
