import { baseTestSchema, withTimeValidation } from "@/validators/test";
import { z } from "zod";

export const QuestionType = z.enum([
  "choose_correct_answer",
  "choose_multiple_answer",
  "true_false_not_given",
  "yes_no_not_given",
  "matching_heading",
  "short_answer_question",
  "matching_features",
  "matching_sentence_ending",
  "matching_information",
  "diagram_label_completion",
  "sentence_completion",
  "paragraph_completion",
  "note_completion",
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
  answerKey: z
    .string()
    .refine((val) => ["", "True", "False", "Not Given"].includes(val), {
      message: "Answer must be True, False, or Not Given",
    }),
  breakdown: z.string().optional(),
});

const matchingHeadingSchema = z.object({
  type: z.literal("matching_heading"),
  options: z
    .array(z.string().min(1, "Heading tidak boleh kosong"))
    .min(1, "Minimal 1 heading"),
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Teks item wajib diisi"),
        answerKey: z.string().min(1, "Jawaban wajib diisi"),
        breakdown: z.string().optional(),
      }),
    )
    .min(1, "Minimal 1 item untuk dicocokkan"),
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
  answerKey: z
    .string()
    .refine((val) => ["", "Yes", "No", "Not Given"].includes(val), {
      message: "Answer must be Yes, No, or Not Given",
    }),
  breakdown: z.string().optional(),
});

const shortAnswerSchema = z.object({
  type: z.literal("short_answer_question"),
  question: z.string().min(1, "Soal wajib diisi"),
  answerKey: z
    .array(z.string().min(1, "Jawaban tidak boleh kosong"))
    .min(1, "Minimal 1 jawaban harus diberikan"),
  otherAnswerIncorrect: z.boolean(),
  breakdown: z.string().optional(),
});

const matchingFeaturesSchema = z.object({
  type: z.literal("matching_features"),
  options: z
    .array(z.string().min(1, "Fitur tidak boleh kosong"))
    .min(1, "Minimal 1 fitur harus disediakan"),
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Teks item wajib diisi"),
        answerKey: z.string().min(1, "Jawaban wajib diisi"),
        breakdown: z.string().optional(),
      }),
    )
    .min(1, "Minimal 1 item untuk dicocokkan"),
});

const matchingSentenceEndingSchema = z.object({
  type: z.literal("matching_sentence_ending"),
  options: z
    .array(z.string().min(1, "Akhiran kalimat tidak boleh kosong"))
    .min(1, "Minimal 1 akhiran kalimat harus disediakan"),
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Teks awal kalimat wajib diisi"),
        answerKey: z.string().min(1, "Jawaban wajib diisi"),
        breakdown: z.string().optional(),
      }),
    )
    .min(1, "Minimal 1 kalimat untuk dicocokkan"),
});

const matchingInformationSchema = z.object({
  type: z.literal("matching_information"),
  paragraph: z.array(z.string().min(1, "Paragraf tidak boleh kosong")).min(1),
  items: z
    .array(
      z.object({
        question: z.string().min(1, "Pertanyaan wajib diisi"),
        answerKey: z.string().min(1, "Jawaban wajib diisi"),
        breakdown: z.string().optional(),
      }),
    )
    .min(1, "Minimal 1 kalimat untuk dicocokkan"),
});

const diagramLabelCompletionSchema = z.object({
  type: z.literal("diagram_label_completion"),
  image: z.string().min(1, "Gambar wajib diisi"), // base64
  question: z.string().min(1, "Soal wajib diisi"),
  items: z
    .array(
      z.object({
        label: z.string().min(1, "Label wajib diisi"),
        answerKey: z.string().min(1, "Jawaban wajib diisi"),
      }),
    )
    .min(1, "Minimal 1 item harus disediakan"),
  breakdown: z.string().optional(),
});

const sentenceCompletionSchema = z.object({
  type: z.literal("sentence_completion"),
  items: z
    .array(
      z.object({
        question: z.string().min(1, "Pertanyaan wajib diisi"),
        answerKey: z.string().min(1, "Jawaban wajib diisi"),
      }),
    )
    .min(1, "Minimal 1 kalimat harus disediakan"),
  breakdown: z.string().optional(),
});

const paragraphCompletionSchema = z.object({
  type: z.literal("paragraph_completion"),
  paragraph: z.string().min(1, "Paragraf tidak boleh kosong"),
  options: z.array(z.string().min(1, "Opsi tidak boleh kosong")).min(2),
  answerKey: z.array(z.string().min(1, "Jawaban wajib diisi")).min(1),
  breakdown: z.string().optional(),
});

const noteCompletionSchema = z.object({
  type: z.literal("note_completion"),
  paragraph: z.string().min(1, "Paragraf tidak boleh kosong"),
  answerKey: z
    .array(
      z.object({
        number: z.string().min(1, "Nomor blank wajib diisi"),
        answer: z.string().min(1, "Jawaban wajib diisi"),
      }),
    )
    .min(1, "Minimal harus ada 1 blank"),
  breakdown: z.string().optional(),
});

export const questionSchema = z.discriminatedUnion("type", [
  chooseCorrectAnswerSchema,
  chooseMultipleAnswerSchema,
  trueFalseNotGiven,
  matchingHeadingSchema,
  yesNoNotGiven,
  shortAnswerSchema,
  matchingFeaturesSchema,
  matchingSentenceEndingSchema,
  matchingInformationSchema,
  diagramLabelCompletionSchema,
  sentenceCompletionSchema,
  paragraphCompletionSchema,
  noteCompletionSchema,
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
