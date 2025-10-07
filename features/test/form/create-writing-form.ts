import { baseTestSchema, withTimeValidation } from "@/validators/test";
import z from "zod";

const questionSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_text: z.string().min(1, "Question text is required"),
  question_data: z
    .object({
      images: z
        .array(
          z.instanceof(File, { message: "Each image must be a valid file" }),
        )
        .optional(),
    })
    .optional(),
});

const passageSchema = z.object({
  title: z.string().min(1, "Passage title is required"),
  description: z.string().min(1, "Passage description is required"),
  image_context: z
    .instanceof(File, { message: "Image must be a valid file" })
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image size must be less than 5MB",
    })
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPEG, PNG, and WEBP formats are allowed",
      },
    ),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export const createWritingTestForm = withTimeValidation(
  baseTestSchema
    .pick({
      title: true,
      description: true,
      difficulty: true,
      timer_mode: true,
      type: true,
      type_test: true,
      timer_settings: true,
      settings: true,
    })
    .extend({
      passages: z
        .array(passageSchema)
        .min(1, "At least one passage is required"),
    }),
);

export type CreateWritingTestForm = z.infer<typeof createWritingTestForm>;
export type PassageWriting = z.infer<typeof passageSchema>;
export type QuestionWritingSchema = z.infer<typeof questionSchema>;
