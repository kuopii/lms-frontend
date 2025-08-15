import { baseTestSchema, withAllValidations } from "@/validators/test";
import { z } from "zod";

// const questionSchema = z.discriminatedUnion("type", [
//   // Tipe2 dari listening
// ]);

const questionGroupSchema = z.object({
  instruction: z.string().min(1, "Instruksi wajib diisi"),
  //   questions: z.array(questionSchema).min(1, "Minimal 1 soal"),
});

const passageSchema = z.object({
  title: z.string().min(1, "Judul passage wajib diisi"),
  description: z.string().min(1, "Deskripsi passage wajib diisi"),
  questionGroups: z.array(questionGroupSchema).min(1, "Minimal 1 grup soal"),
});

export const createListeningTestSchema = withAllValidations(
  baseTestSchema.extend({
    passages: z.array(passageSchema).min(1, "At least one passage is required"),
  }),
);

export type CreateListeningTestSchema = z.infer<
  typeof createListeningTestSchema
>;
