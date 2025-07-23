"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaFileImport, FaTrash } from "react-icons/fa";
import { ScanText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const TIME_TYPES = ["countup", "countdown", "notimer"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type TimeType = (typeof TIME_TYPES)[number];

const createTestSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(DIFFICULTIES),
    timeType: z.enum(TIME_TYPES),

    hours: z.string(),
    minutes: z.string(),
    seconds: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.timeType === "countdown") {
      const total =
        Number(data.hours || "0") +
        Number(data.minutes || "0") +
        Number(data.seconds || "0");

      if (total === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Countdown duration must be more than 00:00:00",
          path: ["hours"],
        });
      }
    }
  });

type CreateTestSchema = z.infer<typeof createTestSchema> & {
  hours: string;
  minutes: string;
  seconds: string;
};

const PassageSection = () => {
  return (
    <section className="space-y-6">
      <div className="flex h-10 items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-xl font-medium text-white">Passage 1</h3>
          <Separator orientation="vertical" className="mx-8" />
          <div className="flex items-center gap-4">
            <Button
              size={"xsm"}
              className="[&_svg:not([class*='size-'])]:size-5"
            >
              <FaFileImport />
              Import File
            </Button>
            <Button
              size={"xsm"}
              className="[&_svg:not([class*='size-'])]:size-5"
            >
              <ScanText />
              OCR
            </Button>
          </div>
        </div>
        <Button
          size={"iconSm"}
          variant={"ghost"}
          className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
        >
          <FaTrash />
        </Button>
      </div>
      <Input
        placeholder="Type the title of the passage here..."
        className="border-none bg-[#333333]"
      />
      <Textarea placeholder="Type or paste the text here..." className="min-h-64 bg-[#333333] border-none" />
    </section>
  );
};

const CreateReadingTest = () => {
  const form = useForm<CreateTestSchema>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "beginner",
      timeType: "notimer",
      hours: "00",
      minutes: "00",
      seconds: "00",
    },
  });

  const onSubmit = (values: CreateTestSchema) => {
    console.log("Form submitted:", values);
    // kirim ke backend atau proses lainnya
  };

  const formatTimeLabel = (type: TimeType) =>
    type === "countdown"
      ? "Count Down"
      : type === "countup"
        ? "Count Up"
        : "No Timer";

  return (
    <div>
      {/* General Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 md:flex-row md:justify-between"
        >
          <div className="flex w-full max-w-screen-sm flex-col space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-4">
                  <FormLabel className="w-40 font-semibold text-white">
                    Test Title
                  </FormLabel>
                  <FormControl className="flex-1">
                    <Input
                      variant="underline"
                      placeholder="Enter test name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-4">
                  <FormLabel className="w-40 font-semibold text-white">
                    Test Description
                  </FormLabel>
                  <FormControl className="flex-1">
                    <Input
                      variant="underline"
                      placeholder="Describe the test..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulty Select */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-0">
                  <FormLabel className="w-32 font-semibold text-white">
                    Difficulty Level
                  </FormLabel>
                  <FormControl className="flex-1 md:max-w-sm">
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(val) => {
                        if (val) field.onChange(val);
                      }}
                      className="flex w-full gap-2 rounded-4xl border border-[#FFFFFF66] md:w-fit"
                    >
                      {DIFFICULTIES.map((item) => (
                        <ToggleGroupItem
                          key={item}
                          value={item}
                          aria-label={item}
                          className="data-[state=on]:bg-primary rounded-full px-3 py-2 transition-colors data-[state=on]:text-white"
                        >
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Time Settings */}
          <div className="flex flex-col gap-6 rounded-3xl border bg-[#333333] px-4 py-5">
            <h2 className="text-xl font-medium text-white">
              Test Completion Time
            </h2>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
              <FormField
                control={form.control}
                name="timeType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {TIME_TYPES.map((type) => (
                          <FormItem
                            key={type}
                            className="flex items-center space-y-0 space-x-3"
                          >
                            <FormControl>
                              <RadioGroupItem id={type} value={type} />
                            </FormControl>
                            <FormLabel
                              htmlFor={type}
                              className="cursor-pointer font-normal text-white"
                            >
                              {formatTimeLabel(type)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                {/* Hours */}
                <div className="flex w-[80px] flex-col items-center gap-2">
                  <Label className="order-2 text-sm font-semibold text-white">
                    Hours
                  </Label>
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md border border-white/30 bg-white/10 px-3 py-1 text-white focus:ring-2 focus:ring-white/50 focus:outline-none">
                            <SelectValue placeholder="HH" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, "0")}
                              className="text-sm"
                            >
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <span className="text-white">:</span>

                {/* Minutes */}
                <div className="flex w-[80px] flex-col items-center gap-2">
                  <Label className="order-2 text-sm font-semibold text-white">
                    Minutes
                  </Label>
                  <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md border border-white/30 bg-white/10 px-3 py-1 text-white focus:ring-2 focus:ring-white/50 focus:outline-none">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 60 }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, "0")}
                              className="text-sm"
                            >
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <span className="text-white">:</span>

                {/* Seconds */}
                <div className="flex w-[80px] flex-col items-center gap-2">
                  <Label className="order-2 text-sm font-semibold text-white">
                    Seconds
                  </Label>
                  <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md border border-white/30 bg-white/10 px-3 py-1 text-white focus:ring-2 focus:ring-white/50 focus:outline-none">
                            <SelectValue placeholder="SS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 60 }).map((_, i) => (
                            <SelectItem
                              key={i}
                              value={i.toString().padStart(2, "0")}
                              className="text-sm"
                            >
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Separator className="my-20" />

      <Select>
        <SelectTrigger className="mb-12 w-full border-[#FFFFFF66] bg-[#333333] md:w-72">
          <SelectValue placeholder="Select Question Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>

      <PassageSection />
    </div>
  );
};

export default CreateReadingTest;
