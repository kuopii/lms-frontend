import { baseTestSchema, withTimeValidation } from "@/validators/test";
import { z } from "zod";

export const QuestionType = z.enum([
  "choose_correct_answer",
  "choose_multiple_answer",
  "true_false_not_given",
  "yes_no_not_given",
]);

const chooseCorrectAnswerSchema = z.object({
  type: z.literal("choose_correct_answer"),
  question: z.string().min(1, "Soal wajib diisi"),
  options: z.array(z.string().min(1, "Opsi tidak boleh kosong")).min(2),
  answerKey: z.string().min(1, "Jawaban wajib diisi"),
  breakdown: z.string().optional(),
});

const chooseMultipleAnswerSchema = z.object({
  type: z.literal("choose_multiple_answer"),
  question: z.string().min(1, "Soal wajib diisi"),
  options: z.array(z.string().min(1, "Opsi tidak boleh kosong")).min(2),
  answerKey: z.array(z.string().min(1, "Jawaban wajib diisi")).min(1).max(2),
  breakdown: z.string().optional(),
});

const trueFalseNotGiven = z.object({
  type: z.literal("true_false_not_given"),
  question: z.string().min(1, "Soal wajib diisi"),
  options: z
    .tuple([z.literal("True"), z.literal("False"), z.literal("Not Given")])
    .refine(
      (val) => Array.isArray(val) && val.length === 3,
      "Opsi harus terdiri dari True, False, dan Not Given",
    ),
  answerKey: z.enum(["True", "False", "Not Given"]),
  breakdown: z.string().optional(),
});

const yesNoNotGiven = z.object({
  type: z.literal("yes_no_not_given"),
  question: z.string().min(1, "Soal wajib diisi"),
  options: z
    .tuple([z.literal("Yes"), z.literal("No"), z.literal("Not Given")])
    .refine(
      (val) => Array.isArray(val) && val.length === 3,
      "Opsi harus terdiri dari Yes, No, dan Not Given",
    ),
  answerKey: z.enum(["Yes", "No", "Not Given"]),
  breakdown: z.string().optional(),
});

export const questionSchema = z.discriminatedUnion("type", [
  chooseCorrectAnswerSchema,
  chooseMultipleAnswerSchema,
  trueFalseNotGiven,
  yesNoNotGiven,
]);

const questionGroupSchema = z.object({
  instruction: z.string().min(1, "Instruksi wajib diisi"),
  questions: z.array(questionSchema).min(1, "Minimal 1 soal"),
});

const passageSchema = z.object({
  title: z.string().min(1, "Judul passage wajib diisi"),
  description: z.string().min(1, "Deskripsi passage wajib diisi"),
  questionGroups: z.array(questionGroupSchema).min(1, "Minimal 1 grup soal"),
});

export const createReadingTestSchema = withTimeValidation(
  baseTestSchema.extend({
    passages: z.array(passageSchema).min(1, "At least one passage is required"),
  }),
);

export type CreateReadingTestSchema = z.infer<typeof createReadingTestSchema>;
