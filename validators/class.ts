import { z } from "zod";

export const classCodeSchema = z
  .string({
    required_error: "Class code is required",
  })
  .min(6, { message: "Class code must be at least 6 characters long." })
  .regex(/[a-zA-Z]/, {
    message: "Class code must include at least one letter.",
  })
  .regex(/[0-9]/, {
    message: "Class code must include at least one number.",
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Class code must include at least one symbol.",
  })
  .regex(/^\S+$/, {
    message: "Class code must not contain spaces.",
  });

export const joinClassFormSchema = z.object({
  classCode: classCodeSchema,
});

export const createClassFormSchema = z.object({
  name: z
    .string({
      required_error: "Class name is required",
    })
    .min(1, "Class name is required"),
  description: z.string().optional(),
  classCode: classCodeSchema,
});

export type JoinClassFormSchema = z.infer<typeof joinClassFormSchema>;
export type CreateClassFormSchema = z.infer<typeof createClassFormSchema>;
