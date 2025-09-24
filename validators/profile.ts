import { z } from "zod";
import { authSchema, passwordSchema } from "./auth";

export const updateUserSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    avatar: z
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
    current_password: z.string({
      required_error: "Current password is required",
    }),
    new_password: passwordSchema,
    new_password_confirmation: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match",
    path: ["new_password_confirmation"],
  });

// TYPES VALIDATION
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
