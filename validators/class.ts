import { z } from "zod";

export const classCodeSchema = z
  .string({
    required_error: "Class code is required",
  })
  .min(6, { message: "Class code must be at least 6 characters long." });

export const joinClassFormSchema = z.object({
  classCode: classCodeSchema,
});

export const createClassFormSchema = z.object({
  name: z
    .string({
      required_error: "Class name is required",
    })
    .min(1, "Class name is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  class_code: classCodeSchema,
  cover_image: z
    .any()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid file type",
    })
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "Image size must be 2MB or less",
    })
    .optional(),
});

export type JoinClassFormSchema = z.infer<typeof joinClassFormSchema>;
export type CreateClassFormSchema = z.infer<typeof createClassFormSchema>;
