import { z } from "zod";
import { DIFFICULTIES, TEST_TYPES, TIME_TYPES, TYPE } from "@/types/test";

export const baseTestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(DIFFICULTIES, {
    errorMap: () => ({ message: "Difficulty must be selected" }),
  }),
  timer_mode: z.enum(TIME_TYPES, {
    errorMap: () => ({ message: "Time type must be selected" }),
  }),
  type: z.enum(TYPE, {
    errorMap: () => ({ message: "Type must be selected" }),
  }),
  type_test: z.enum(TEST_TYPES, {
    errorMap: () => ({ message: "Type test must be selected" }),
  }),
  timer_settings: z.object({
    hours: z.number().int().min(0).default(0),
    minutes: z.number().int().min(0).max(59).default(0),
    seconds: z.number().int().min(0).max(59).default(0),
  }),
  allow_repetition: z.boolean().default(false),
  max_repetition_count: z.number().optional(),
  is_public: z.boolean().default(false),
  is_published: z.boolean().default(false),
  settings: z.object({
    shuffle_questions: z.boolean().default(false),
  }),
});

// Utility: validasi durasi waktu berdasarkan `timer_mode`
export const withTimeValidation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: z.infer<T>, ctx) => {
    const { hours, minutes, seconds } = data.timer_settings;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const isCountdown = data.timer_mode === "countdown";
    const isCountup = data.timer_mode === "countup";
    const isNoTimer = data.timer_mode === "notimer";

    if ((isCountdown || isCountup) && totalSeconds === 0) {
      ctx.addIssue({
        path: ["timer_settings", "hours"],
        code: z.ZodIssueCode.custom,
        message: "Duration must be more than 0:00:00 for this timer mode.",
      });
    }

    if ((isCountdown || isCountup) && minutes > 59) {
      ctx.addIssue({
        path: ["timer_settings", "minutes"],
        code: z.ZodIssueCode.custom,
        message: "Minutes cannot exceed 59",
      });
    }

    if ((isCountdown || isCountup) && seconds > 59) {
      ctx.addIssue({
        path: ["timer_settings", "seconds"],
        code: z.ZodIssueCode.custom,
        message: "Seconds cannot exceed 59",
      });
    }

    if (isNoTimer && totalSeconds > 0) {
      // Reset timer settings to 0 when no timer is selected
      data.timer_settings = {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  });

// Utility: validasi repetition berdasarkan `allow_repetition`
export const withRepetitionValidation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: z.infer<T>, ctx) => {
    // Jika allow_repetition true, maka max_repetition_count wajib ada dan > 0
    if (data.allow_repetition) {
      if (!data.max_repetition_count || data.max_repetition_count <= 0) {
        ctx.addIssue({
          path: ["max_repetition_count"],
          code: z.ZodIssueCode.custom,
          message:
            "Max repetition count is required and must be greater than 0 when repetition is allowed",
        });
      }
    } else {
      // Jika allow_repetition false, set max_repetition_count ke undefined
      data.max_repetition_count = undefined;
    }
  });

// Combined validation utility untuk di-apply ke extended schemas
export const withAllValidations = <T extends z.ZodTypeAny>(schema: T) =>
  withRepetitionValidation(withTimeValidation(schema));

// General schema dengan semua validasi (untuk standalone use)
export const generalCreateTestSchema = withAllValidations(baseTestSchema);

export type GeneralCreateTestSchema = z.infer<typeof generalCreateTestSchema>;
