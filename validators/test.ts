import { z } from "zod";
import { DIFFICULTIES, TEST_TYPES, TIME_TYPES } from "@/types/test";

export const baseTestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(DIFFICULTIES, {
    errorMap: () => ({ message: "Difficulty must be selected" }),
  }),
  timeType: z.enum(TIME_TYPES, {
    errorMap: () => ({ message: "Time type must be selected" }),
  }),
  type: z.enum(["listening", "reading", "writing", "speaking"], {
    errorMap: () => ({ message: "Type must be selected" }),
  }),
  typeTest: z.enum(TEST_TYPES, {
    errorMap: () => ({ message: "Type must be selected" }),
  }),
  hours: z.string().default("0"),
  minutes: z.string().default("0"),
  seconds: z.string().default("0"),
});

// Utility: validasi durasi waktu berdasarkan `timeType`
export const withTimeValidation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: z.infer<T>, ctx) => {
    const hours = Number(data.hours || "0");
    const minutes = Number(data.minutes || "0");
    const seconds = Number(data.seconds || "0");
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const isCountdown = data.timeType === "countdown";
    const isCountup = data.timeType === "countup";
    const isNoTimer = data.timeType === "notimer";

    if ((isCountdown || isCountup) && totalSeconds === 0) {
      ctx.addIssue({
        path: ["hours"],
        code: z.ZodIssueCode.custom,
        message: "Duration must be more than 00:00:00 for this time type.",
      });
    }

    if ((isCountdown || isCountup) && minutes > 59) {
      ctx.addIssue({
        path: ["minutes"],
        code: z.ZodIssueCode.custom,
        message: "Minutes cannot exceed 59",
      });
    }

    if ((isCountdown || isCountup) && seconds > 59) {
      ctx.addIssue({
        path: ["seconds"],
        code: z.ZodIssueCode.custom,
        message: "Seconds cannot exceed 59",
      });
    }

    if (isNoTimer && totalSeconds > 0) {
      ctx.addIssue({
        path: ["hours"],
        code: z.ZodIssueCode.custom,
        message: "Time must be 00:00:00 if using 'No Timer'",
      });
    }
  });

// Final base schema
export const generalCreateTestSchema = withTimeValidation(baseTestSchema);
export type GeneralCreateTestSchema = z.infer<typeof generalCreateTestSchema>;
