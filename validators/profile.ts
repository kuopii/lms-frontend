import { z } from "zod";
import { authSchema } from "./auth";

export const updateUserSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    image: z
      .any()
      .refine((file) => !file || file instanceof File, {
        message: "Invalid file type",
      })
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
        message: "Image size must be 2MB or less",
      })
      .optional(),
  });

export const changePasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Current password is required",
      })
      .min(6, { message: "Current password must be at least 6 characters" }),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// TYPES VALIDATION
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
