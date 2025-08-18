"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ALLOW_REPETITION,
  DIFFICULTIES,
  TEST_TYPES,
  TIME_TYPES,
} from "@/types/test";
import React, { useCallback, useEffect, useMemo } from "react";
import { z } from "zod";
import { formatTimeLabel } from "../../../helpers/format-time-label";

const HOURS_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES_OPTIONS = Array.from({ length: 60 }, (_, i) => i);
const SECONDS_OPTIONS = Array.from({ length: 60 }, (_, i) => i);

import { useFormContext } from "react-hook-form";

const BaseForm = () => {
  const { control, formState, watch, setValue } = useFormContext();

  const timerMode = watch("timer_mode");
  const allowRepetition = watch("allow_repetition");

  const isTimerDisabled = useMemo(() => timerMode === "notimer", [timerMode]);

  const { isTimeError, timerErrorMessage } = useMemo(() => {
    const timerSettingsErrors = formState.errors.timer_settings;

    if (!timerSettingsErrors || typeof timerSettingsErrors !== "object") {
      return { isTimeError: false, timerErrorMessage: "" };
    }

    const hasError = !!(
      "hours" in timerSettingsErrors ||
      "minutes" in timerSettingsErrors ||
      "seconds" in timerSettingsErrors
    );

    const errors = timerSettingsErrors as Record<string, z.ZodIssue>;
    const message =
      errors.hours?.message?.toString() ||
      errors.minutes?.message?.toString() ||
      errors.seconds?.message?.toString() ||
      "";

    return { isTimeError: hasError, timerErrorMessage: message };
  }, [formState.errors.timer_settings]);

  const handleDifficultyChange = useCallback((val: string) => {
    if (val) return val;
  }, []);

  const handleTestTypeChange = useCallback((val: string) => {
    if (val) return val;
  }, []);

  const handleRepetitionChange = useCallback((val: string) => {
    if (val) return val === "true";
  }, []);

  const handleShuffleChange = useCallback((val: string) => {
    if (val) return val === "true";
  }, []);

  const handleNumberInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      return value ? parseInt(value) : undefined;
    },
    [],
  );

  const createSelectHandler = useCallback(
    (fieldOnChange: (value: number) => void) => (value: string) => {
      fieldOnChange(Number(value));
    },
    [],
  );

  useEffect(() => {
    if (!allowRepetition) {
      setValue("max_repetition_count", undefined, { shouldValidate: true });
    }
  }, [allowRepetition, setValue]);

  useEffect(() => {
    if (isTimerDisabled) {
      setValue("timer_settings.hours", 0, { shouldValidate: true });
      setValue("timer_settings.minutes", 0, { shouldValidate: true });
      setValue("timer_settings.seconds", 0, { shouldValidate: true });
    }
  }, [isTimerDisabled, setValue]);

  return (
    <section className="flex flex-col gap-8 md:flex-row md:justify-between">
      {/* Base Form */}
      <div className="flex w-full max-w-screen-md flex-col space-y-6 md:max-w-screen-sm">
        {/* Title Field */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-4">
              <FormLabel className="w-36 font-semibold text-white">
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
              <FormLabel className="w-36 font-semibold text-white">
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
              <FormLabel className="w-36 font-semibold text-white">
                Difficulty Level
              </FormLabel>
              <FormControl className="flex-1 md:max-w-sm">
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(val) => {
                    const result = handleDifficultyChange(val);
                    if (result) field.onChange(result);
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
          name="type_test"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-0">
              <FormLabel className="w-36 font-semibold text-white">
                Type
              </FormLabel>
              <FormControl className="flex-1 md:max-w-sm">
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(val) => {
                    const result = handleTestTypeChange(val);
                    if (result) field.onChange(result);
                  }}
                  className="flex w-full gap-2 rounded-4xl border border-[#FFFFFF66] md:max-w-xs lg:max-w-sm"
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

        {/* Allow Repetition */}
        <FormField
          control={control}
          name="allow_repetition"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-0">
              <FormLabel className="w-36 font-semibold text-white">
                Allow Repetition
              </FormLabel>
              <FormControl className="flex-1 md:max-w-sm">
                <ToggleGroup
                  type="single"
                  value={field.value ? "true" : "false"}
                  onValueChange={(val) => {
                    const result = handleRepetitionChange(val);
                    if (typeof result === "boolean") field.onChange(result);
                  }}
                  className="flex w-full gap-2 rounded-4xl border border-[#FFFFFF66] md:max-w-xs lg:max-w-sm"
                >
                  {ALLOW_REPETITION.map((item) => (
                    <ToggleGroupItem
                      key={item.label}
                      value={item.value.toString()}
                      aria-label={item.label}
                      className="data-[state=on]:bg-primary rounded-full px-3 py-2 transition-colors data-[state=on]:text-white"
                    >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Repetition Count - Only show if allow_repetition is true */}
        {allowRepetition && (
          <FormField
            control={control}
            name="max_repetition_count"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-4">
                <FormLabel className="w-36 font-semibold text-white">
                  Max Repetitions
                </FormLabel>
                <div className="w-full flex-1 space-y-2">
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      variant="underline"
                      placeholder="Enter max repetition count"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const result = handleNumberInputChange(e);
                        field.onChange(result);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Shuffle Questions */}
        <FormField
          control={control}
          name="settings.shuffle_questions"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start justify-start gap-6 lg:flex-row lg:items-center lg:gap-0">
              <FormLabel className="w-36 font-semibold text-white">
                Shuffle Questions
              </FormLabel>
              <FormControl className="flex-1 md:max-w-sm">
                <ToggleGroup
                  type="single"
                  value={field.value ? "true" : "false"}
                  onValueChange={(val) => {
                    const result = handleShuffleChange(val);
                    if (typeof result === "boolean") field.onChange(result);
                  }}
                  className="flex w-full gap-2 rounded-4xl border border-[#FFFFFF66] md:max-w-xs lg:max-w-sm"
                >
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map((item) => (
                    <ToggleGroupItem
                      key={item.label}
                      value={item.value.toString()}
                      aria-label={item.label}
                      className="data-[state=on]:bg-primary rounded-full px-3 py-2 transition-colors data-[state=on]:text-white"
                    >
                      {item.label}
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
            name="timer_mode"
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

          {/* Timer inputs */}
          <div className="flex items-center gap-2">
            {/* Hours */}
            <div className="flex w-[80px] flex-col items-center gap-2">
              <Label className="order-2 text-sm font-semibold text-white">
                Hours
              </Label>
              <FormField
                control={control}
                name="timer_settings.hours"
                render={({ field }) => (
                  <Select
                    onValueChange={createSelectHandler(field.onChange)}
                    value={field.value?.toString() || "0"}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="rounded-md border border-white/30 bg-white/10 px-3 py-1 text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        disabled={isTimerDisabled}
                      >
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {HOURS_OPTIONS.map((i) => (
                        <SelectItem
                          key={i}
                          value={i.toString()}
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
                name="timer_settings.minutes"
                render={({ field }) => (
                  <Select
                    onValueChange={createSelectHandler(field.onChange)}
                    value={field.value?.toString() || "0"}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="rounded-md border border-white/30 bg-white/10 px-3 py-1 text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        disabled={isTimerDisabled}
                      >
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MINUTES_OPTIONS.map((i) => (
                        <SelectItem
                          key={i}
                          value={i.toString()}
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
                name="timer_settings.seconds"
                render={({ field }) => (
                  <Select
                    onValueChange={createSelectHandler(field.onChange)}
                    value={field.value?.toString() || "0"}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="rounded-md border border-white/30 bg-white/10 px-3 py-1 text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        disabled={isTimerDisabled}
                      >
                        <SelectValue placeholder="SS" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SECONDS_OPTIONS.map((i) => (
                        <SelectItem
                          key={i}
                          value={i.toString()}
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
          <div className="text-destructive text-sm">{timerErrorMessage}</div>
        )}
      </div>
    </section>
  );
};

export default BaseForm;
