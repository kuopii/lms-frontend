"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DIFFICULTIES, TEST_TYPES, TIME_TYPES } from "@/types/test";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatTimeLabel } from "../helpers/format-time-label";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BaseForm = () => {
  const { control, formState } = useFormContext();

  const isTimeError =
    !!formState.errors.hours ||
    !!formState.errors.minutes ||
    !!formState.errors.seconds;

  return (
    <section className="flex flex-col gap-8 md:flex-row md:justify-between">
      {/* Base Form */}
      <div className="flex w-full max-w-screen-sm flex-col space-y-6">
        {/* Name Field */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-4">
              <FormLabel className="w-32 font-semibold text-white">
                Test Title
              </FormLabel>
              <div className="w-full flex-1 space-y-2">
                <FormControl>
                  <Input
                    variant="underline"
                    placeholder="Enter test name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-4">
              <FormLabel className="w-32 font-semibold text-white">
                Test Description
              </FormLabel>
              <div className="w-full flex-1 space-y-2">
                <FormControl>
                  <Input
                    variant="underline"
                    placeholder="Describe the test..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Difficulty Select */}
        <FormField
          control={control}
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

        {/* Type */}
        <FormField
          control={control}
          name="typeTest"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-0">
              <FormLabel className="w-32 font-semibold text-white">
                Type
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
                  {TEST_TYPES.map((item) => (
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
      <div className="flex h-fit flex-col gap-6 rounded-3xl border bg-[#333333] px-4 py-5">
        <h2 className="text-xl font-medium text-white">Test Completion Time</h2>
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
          <FormField
            control={control}
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
                control={control}
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
                control={control}
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
                control={control}
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
        {isTimeError && (
          <div className="text-destructive text-sm">
            {formState.errors.hours?.message?.toString() ||
              formState.errors.minutes?.message?.toString() ||
              formState.errors.seconds?.message?.toString()}
          </div>
        )}
      </div>
    </section>
  );
};

export default BaseForm;
