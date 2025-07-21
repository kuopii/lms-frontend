"use client";
// use client hanya untuk test nantinnya akan dihapus

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Role } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Check, Plus } from "lucide-react";
import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { FaUsers, FaUsersRectangle } from "react-icons/fa6";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import z, { type ZodTypeAny } from "zod";
import { DashboardData, useColumns } from "./columns";
import { DataTable } from "./data-table";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getData } from "@/data/dummy-dashboard-data";
import { usePathname } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";

//  -------------------------------- Validator Filter -------------------------
export const studentSchema = z.object({
  module: z.string().optional(),
  testStatus: z.string().optional(),
  deadline: z.string().optional(),
  gradeMin: z.string().optional(),
  gradeMax: z.string().optional(),
});

export const teacherSchema = z.object({
  class: z.string().optional(),
  testStatus: z.string().optional(),
  dateCreated: z.string().optional(),
});

export const teacherDetailSchema = z.object({
  submissionStatus: z.string().optional(),
  scoreMin: z.string().optional(),
  scoreMax: z.string().optional(),
  submissionDateFrom: z.string().optional(),
  submissionDateTo: z.string().optional(),
});

export const filterSchemas = {
  student: studentSchema,
  teacher: teacherSchema,
} as const;

export type FilterSchemaByRole = {
  student: z.infer<typeof studentSchema>;
  teacher: z.infer<typeof teacherSchema>;
};

// -------------------------------- COMPONENT STATUS FILTER -------------------------
type StatusOption = keyof typeof statusLabelMap;

interface StatusFilterProps<T extends FieldValues> {
  name: Path<T>;
  options: StatusOption[];
  control: Control<T>;
  label?: string;
}

const statusLabelMap: Record<string, string> = {
  todo: "To Do",
  review: "Review",
  done: "Done",
  schedule: "Schedule",
  ongoing: "Ongoing",
  closed: "Closed",
};

export function StatusFilter<T extends FieldValues>({
  name,
  options,
  control,
  label = "Test Status",
}: StatusFilterProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="flex flex-col gap-[15px]">
            <label className="text-[22px] font-medium text-white">
              {label}
            </label>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {options.map((status) => (
                <div
                  key={status}
                  onClick={() => field.onChange(status)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-[30px] border px-4 py-2",
                    field.value === status
                      ? "bg-transparent"
                      : "hover:border-primary border-white",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border",
                      field.value === status ? "bg-white" : "border-white",
                    )}
                  >
                    {field.value === status && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-[16px] capitalize">
                    {statusLabelMap[status] ?? status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

// -------------------------------- COMPONENT FILTER DATE -------------------------

interface DateFilterProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
}

export function DateFilter<T extends FieldValues>({
  name,
  label,
  control,
}: DateFilterProps<T>) {
  return (
    <div className="flex w-full flex-col gap-[15px]">
      <Label className="text-[22px] font-medium text-white">{label}</Label>
      <Separator />
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[297px] justify-start rounded-[30px] text-left font-normal"
                >
                  {field.value
                    ? format(new Date(field.value), "yyyy-MM-dd")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date?.toLocaleDateString("en-CA")); // sesuai standar kamu
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
}

// -------------------------------- COMPONENT FILTER DATE MULTI -------------------------

interface DateRangeFilterProps<T extends FieldValues> {
  fromName: Path<T>;
  toName: Path<T>;
  control: Control<T>;
  label?: string;
}

export function DateRangeFilter<T extends FieldValues>({
  fromName,
  toName,
  control,
  label,
}: DateRangeFilterProps<T>) {
  return (
    <div className="flex w-full flex-col gap-[15px]">
      {label && (
        <Label className="text-[22px] font-medium text-white">{label}</Label>
      )}
      <Separator />

      <div className="flex gap-4">
        {/* From Date */}
        <Controller
          name={fromName}
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[170px] justify-between rounded-[30px] text-left font-normal md:w-[269px]"
                >
                  {field.value
                    ? format(new Date(field.value), "yyyy-MM-dd")
                    : "From date"}

                  <FaCalendarAlt className="size-[24px]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) =>
                    field.onChange(date?.toLocaleDateString("en-CA"))
                  }
                />
              </PopoverContent>
            </Popover>
          )}
        />

        {/* Garis pemisah */}
        <div className="flex flex-1 items-center">
          <div className="h-px w-full bg-white" />
        </div>

        {/* To Date */}
        <Controller
          name={toName}
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[170px] justify-between rounded-[30px] text-left font-normal md:w-[269px]"
                >
                  {field.value
                    ? format(new Date(field.value), "yyyy-MM-dd")
                    : "To date"}
                  <FaCalendarAlt className="size-[24px]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) =>
                    field.onChange(date?.toLocaleDateString("en-CA"))
                  }
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
    </div>
  );
}

// -------------------------------- COMPONENT CLASS FILTER -------------------------

interface ClassFilterProps<T extends Record<string, any>> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  placeholder?: string;
  options: {
    id: string;
    name: string;
  }[];
}

export function ClassFilter<T extends Record<string, any>>({
  name,
  label,
  control,
  options,
  placeholder = "Select class",
}: ClassFilterProps<T>) {
  return (
    <div className="flex flex-col gap-[15px]">
      {label && (
        <Label className="text-[22px] font-medium text-white">{label}</Label>
      )}
      <Separator />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

// -------------------------------- COMPONENT GRADE FILTER -------------------------

interface GradeFilterProps<T extends FieldValues> {
  gradeMin: Path<T>;
  gradeMax: Path<T>;
  control: Control<T>;
  label?: string;
  textMin?: string;
  textMax?: string;
}

export function GradeFilter<T extends FieldValues>({
  gradeMin,
  gradeMax,
  control,
  label = "Grade Range",
  textMin,
  textMax,
}: GradeFilterProps<T>) {
  return (
    <div className="flex flex-col gap-[15px]">
      <FormLabel className="text-[22px] font-medium text-white">
        {label}
      </FormLabel>
      <Separator />
      <div className="flex gap-12">
        <FormField
          control={control}
          name={gradeMin}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex gap-4">
                  <Label className="text-[16px]">{textMin}</Label>
                  <Input
                    placeholder="Min"
                    className="border-white"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={gradeMax}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex gap-4">
                  <Label className="text-[16px]">{textMax}</Label>
                  <Input
                    placeholder="Max"
                    {...field}
                    className="border-white"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

//  -------------------------------- Filter Dialog Component -------------
interface FilterDialogParams {
  openFilter: boolean;
  setOpenFilter: (ctx: boolean) => void;
}
export const FilterDialog = ({
  openFilter,
  setOpenFilter,
}: FilterDialogParams) => {
  return <FilterForm setOpenDialog={setOpenFilter} openDialog={openFilter} />;
};

//  -------------------------------- Filter Form Component -------------
interface FilterFormParams {
  iconButton?: React.ReactNode;
  setOpenDialog: (ctx: boolean) => void;
  openDialog: boolean;
  dialogTitle?: string;
  dialogDesc?: string;
}

export const FilterForm = ({
  iconButton,
  openDialog,
  setOpenDialog,
  dialogTitle,
  dialogDesc,
}: FilterFormParams) => {
  const pathname = usePathname();
  console.log("pathname", pathname);
  type RoleKey = keyof typeof filterSchemas; // "student" | "teacher"
  const role: RoleKey = userData.role.toLowerCase() as RoleKey;

  const isStudent = role === Role.STUDENT;
  const isTeacher = role === Role.TEACHER;

  const isDashboardRoot = pathname === "/dashboard";
  const isDashboardWithId = /^\/dashboard\/\w+/.test(pathname); // "/dashboard/some-id"

  const schema: ZodTypeAny =
    isTeacher && isDashboardWithId
      ? teacherDetailSchema
      : (filterSchemas[role] as ZodTypeAny);
  // type SchemaType = FilterSchemaByRole[typeof role];
  // <SchemaType>

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const onSubmit = (values: FilterSchemaByRole[keyof typeof filterSchemas]) => {
    if (role === Role.STUDENT) {
      console.log("Filter Student:", values);
    } else if (role === Role.TEACHER) {
      console.log("Filter Teacher:", values);
    }
  };

  const STATUS_BY_ROLE = {
    student: ["todo", "review", "done"],
    teacher: ["schedule", "ongoing", "closed"],
  };

  const MODULES = ["reading", "writing", "speaking", "listening"];

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>{iconButton}</DialogTrigger>
        <DialogContent className="rounded-[30px] border-none sm:max-w-[425px] md:max-w-[646px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDesc}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-13">
              <div className="flex flex-col gap-[30px]">
                {isTeacher && isDashboardRoot && (
                  <ClassFilter
                    name="class"
                    control={form.control}
                    label="Class"
                    options={[
                      { id: "1", name: "Class A" },
                      { id: "2", name: "Class B" },
                    ]}
                  />
                )}
                {/* modules */}
                {isStudent && isDashboardRoot && (
                  <StatusFilter
                    control={form.control}
                    name="module"
                    options={MODULES}
                  />
                )}
                {/* status student & teacher */}
                {isDashboardRoot && (
                  <StatusFilter
                    control={form.control}
                    name="testStatus"
                    options={STATUS_BY_ROLE[role]}
                  />
                )}

                {/* date */}
                {isStudent && isDashboardRoot && (
                  <DateFilter
                    control={form.control}
                    name="dateCreated"
                    label="Deadline"
                  />
                )}

                {/* GradeFilter student & teacher */}
                {isStudent && isDashboardRoot && (
                  <GradeFilter
                    gradeMin="gradeMin"
                    gradeMax="gradeMax"
                    control={form.control}
                    label="Grade Range"
                  />
                )}

                {/* created at */}
                {isTeacher && isDashboardRoot && (
                  <DateFilter
                    control={form.control}
                    name="dateCreated"
                    label="Date Created"
                  />
                )}

                {isTeacher && isDashboardWithId && (
                  <>
                    <StatusFilter
                      control={form.control}
                      name="submissionStatus"
                      options={["on time", "late", "unsubmitted"]}
                    />

                    <GradeFilter
                      gradeMin="scoreMin"
                      textMin="Min"
                      gradeMax="scoreMax"
                      textMax="Max"
                      control={form.control}
                      label="Score Range"
                    />

                    <DateRangeFilter
                      fromName="submissionDateFrom"
                      toName="submissionDateTo"
                      control={form.control}
                      label="Submission Date"
                    />
                  </>
                )}
              </div>

              <div className="w-full text-center">
                <Button
                  type="submit"
                  className="bg-primary h-fit rounded-[30px] px-4 py-2 text-white"
                >
                  <span>
                    <Check className="size-[25px]" />
                  </span>
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

//  -------------------------------- Buld Test Form Component -------------
interface BuildTestFormParams {
  icon?: React.ReactNode;
  classNameButtonTrigger?: string;
  triggerText?: string;
  classNameTriggerText: string;
  title?: string;
  separator?: boolean;
  classNameTitle?: string;
}
export const BuildTestForm = ({
  icon,
  classNameButtonTrigger,
  triggerText,
  classNameTriggerText,
  title,
  separator,
  classNameTitle,
}: BuildTestFormParams) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={classNameButtonTrigger}>
          {icon}
          <span className={classNameTriggerText}>{triggerText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-[272px] w-[418px] flex-col gap-[5px] rounded-[30px] border bg-[#333333] px-[15px] py-[10px]">
          <h2 className={classNameTitle}>{title}</h2>
          {separator && <Separator />}
          <div className="space-y-2">
            <p className="text-[16px]">Reading ETC</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

//  -------------------------------- Dashboard Component -------------
interface DashboardCompParams {
  userData: UserData;
  data: DashboardData[];
}
export const DashboardComp = ({ userData, data }: DashboardCompParams) => {
  const columnsByRole = useColumns(userData.role);
  const cardData = [
    {
      id: 1,
      name: "Tasks Completed",
      icon: <BsClipboard2CheckFill color="#7A9D58" size={24} />,
      text: "XX",
      borderColor: "#7A9D58",
      role: Role.STUDENT,
    },
    {
      id: 2,
      name: "Time Spent",
      icon: <MdOutlineAccessTimeFilled color="#0F68DC" size={24} />,
      text: "XX",
      borderColor: "#0F68DC",
      role: Role.STUDENT,
    },
    {
      id: 3,
      name: "Total Students",
      icon: <FaUsers color="#7A9D58" size={24} />,
      text: "XX",
      borderColor: "#7A9D58",
      role: Role.TEACHER,
    },
    {
      id: 4,
      name: "Total Classes",
      icon: <FaUsersRectangle color="#0F68DC" size={24} />,
      text: "XX",
      borderColor: "#0F68DC",
      role: Role.TEACHER,
    },
  ];

  const isTeacher = userData.role === Role.TEACHER;
  const isStudent = userData.role === Role.STUDENT;

  return (
    <section className="flex flex-col gap-[45px] md:pr-10 xl:pr-0">
      {/* title */}
      <div>
        <h2 className="text-[28px] font-semibold">
          {isTeacher ? "Overview" : "Your Wrap Up"}
        </h2>
      </div>

      {/* card */}
      <div className="flex flex-col gap-[34px] md:flex-row">
        {cardData
          .filter((e) => e.role === userData.role)
          .map((e, idx) => {
            return (
              <div
                key={idx}
                className="flex h-[110px] w-[216px] flex-col justify-between rounded-[15px] border p-[10px]"
              >
                <div className="flex items-center gap-[10px]">
                  <span>{e.icon}</span>
                  <p className="text-[16px] text-[#dedede]">{e.name}</p>
                </div>
                <div>
                  <p
                    className={`w-fit border-b-2 text-[36px] font-bold`}
                    style={{ borderColor: e.borderColor }}
                  >
                    {e.text}
                  </p>
                </div>
              </div>
            );
          })}

        {isTeacher && (
          <BuildTestForm
            icon={<Plus className="size-[75px]" />}
            classNameButtonTrigger="flex h-[110px] w-[125px] flex-col items-center justify-center gap-0 text-white"
            triggerText="Build Test"
            classNameTriggerText="text-[14px]"
            title="Choose the Test Module"
            classNameTitle="text-[22px] font-medium"
            separator
          />
        )}
      </div>

      {/* dashboard */}
      <div className="container mx-auto rounded-[30px] bg-[#333333] px-[20px] py-[15px]">
        <DataTable
          columns={columnsByRole}
          data={data}
          isStudent={isStudent}
          isTeacher={isTeacher}
        />
      </div>
    </section>
  );
};

//  ----- Dashboard Pages -----

export interface UserData {
  name: string;
  role: Role;
}

const userData: UserData = {
  name: "user",
  role: Role.TEACHER,
};

const page = async () => {
  const data = await getData();
  return (
    <div>
      <DashboardComp userData={userData} data={data} />
    </div>
  );
};

export default page;
