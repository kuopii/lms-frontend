import { Passage, Question, QuestionGroup } from "@/types/test";
import { baseTestSchema, withAllValidations } from "@/validators/test";
import { z } from "zod";

export const QuestionType = z.enum([
  "choose_correct_answer",
  "choose_multiple_answer",
  "note_completion",
  "sentence_completion",
  "form_completion",
  "summary_completion",
  "map_labeling",
  "table_completion",
]);

const optionSchema = z.object({
  option_key: z.string().min(1, "Option key is required"),
  option_text: z.string().min(1, "Option text is required"),
});

export const breakdownSchema = z.object({
  explanation: z.string().optional(),
});

const blankSchema = z.object({
  id: z.string(),
  rowId: z.string(),
  colId: z.string(),
  originalText: z.string(),
  points: z.coerce.number().min(1),
});

export const questionDataSchema = z.object({
  images: z
    .array(z.instanceof(File, { message: "Each image must be a valid file" }))
    .optional(),
  table: z
    .object({
      columns: z.array(z.object({ id: z.string(), label: z.string() })),
      rows: z.array(z.record(z.string(), z.string())),
    })
    .optional(),
  blanks: z.array(blankSchema).optional(),
});

const chooseCorrectAnswerSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("choose_correct_answer"),
  question_text: z.string().min(1, "Question text is required"),
  correct_answer: optionSchema,
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  question_data: questionDataSchema.optional(),
  breakdown: breakdownSchema.optional(),
});

const chooseMultipleAnswerSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("choose_multiple_answer"),
  question_text: z.string().min(1, "Question text is required"),
  correct_answer: z.array(optionSchema).min(1).max(2),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  question_data: questionDataSchema.optional(),
  breakdown: breakdownSchema.optional(),
});

const sentenceCompletion = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("sentence_completion"),
  question_text: z.string().min(1, "Question text is required"),
  correct_answer: z.array(optionSchema).min(1).max(2),
  points_value: z.number().min(1, "Points value must be at least 1"),
  question_data: questionDataSchema.optional(),
  breakdown: breakdownSchema.optional(),
});

const mapLabelingSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("map_labeling"),
  question_text: z.string().min(1, "Question text is required"),
  correct_answer: z.array(optionSchema).min(1).max(2),
  points_value: z.number().min(1, "Points value must be at least 1"),
  question_data: questionDataSchema.optional(),
  breakdown: breakdownSchema.optional(),
});

const formCompletionSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("form_completion"),
  question_text: z.string().min(1, "Question text is required"),
  question_data: questionDataSchema.optional(),
  correct_answer: z.array(optionSchema).min(1).max(2),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

const noteCompletionSchema = z.object({
  question_type: z.literal("note_completion"),
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_text: z.string().min(1, "Question text is required"),
  question_data: questionDataSchema.optional(),
  correct_answer: z
    .array(optionSchema)
    .min(2, "At least 2 correct answers are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

const summaryCompletionSchema = z.object({
  question_type: z.literal("summary_completion"),
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_text: z.string().min(1, "Question text is required"),
  question_data: questionDataSchema.optional(),
  correct_answer: z
    .array(optionSchema)
    .min(2, "At least 2 correct answers are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

const tableCompletionSchema = z.object({
  question_type: z.literal("table_completion"),
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_text: z.string().optional(),
  question_data: questionDataSchema.refine(
    (data) => data?.table && data?.blanks && data.blanks.length > 0,
    {
      message:
        "Table Completion must include both table and blanks in question_data",
    },
  ),
  correct_answer: z
    .array(optionSchema)
    .min(1, "At least 2 correct answers are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

const transcriptValueSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("descriptive"),
    title: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("transcript"),
    title: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("conversation"),
    title: z.string(),
    speakers: z
      .array(
        z.object({
          name: z.string().min(1, "Speaker name required"),
          inputs: z.array(
            z.object({
              text: z.string().min(1, "Dialogue required"),
            }),
          ),
        }),
      )
      .length(2, "There must be exactly 2 speakers"),
  }),
]);

export const questionSchema = z.discriminatedUnion("question_type", [
  chooseCorrectAnswerSchema,
  chooseMultipleAnswerSchema,
  sentenceCompletion,
  mapLabelingSchema,
  formCompletionSchema,
  noteCompletionSchema,
  summaryCompletionSchema,
  tableCompletionSchema,
]);

const questionGroupSchema = z.object({
  instruction: z.string().min(1, "Instruksi wajib diisi"),
  questions: z.array(questionSchema).min(1, "Minimal 1 soal"),
  transcript: transcriptValueSchema.optional(),
  image: z
    .object({
      title: z.string().optional(),
      file: z.instanceof(File).nullable().optional(),
    })
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        if (!val.file) return true;
        return !!val.title && val.title.trim().length > 0;
      },
      { message: "image title is required", path: ["title"] },
    ),
});

const passageSchema = z.object({
  questionGroups: z.array(questionGroupSchema).min(1, "Minimal 1 grup soal"),
  audio_file: z
    .any()
    .refine((file) => !file || file instanceof File, "Audio must be a file")
    .optional(),
});

const withPointsValidation = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: z.infer<T>, ctx) => {
    let totalPoints = 0;

    data.passages?.forEach((passage: Passage) => {
      passage.questionGroups?.forEach((group: QuestionGroup) => {
        group.questions?.forEach((question: Question) => {
          totalPoints += question.points_value || 0;
        });
      });
    });

    // Validasi total points harus tepat 100
    if (totalPoints !== 100) {
      ctx.addIssue({
        path: ["passages"],
        code: z.ZodIssueCode.custom,
        message: `Total points must equal 100, but currently is ${totalPoints}. Please adjust the points for each question.`,
      });
    }
  });

export const createListeningTestSchema = withPointsValidation(
  withAllValidations(
    baseTestSchema.extend({
      passages: z
        .array(passageSchema)
        .min(1, "At least one passage is required"),
    }),
  ),
);

export type CreateListeningTestSchema = z.infer<
  typeof createListeningTestSchema
>;

export type PassageListening = z.infer<typeof passageSchema>;
export type QuestionDataSchema = z.infer<typeof questionDataSchema>;
export type InferQuestion<
  T extends z.infer<typeof questionSchema>["question_type"],
> = Extract<z.infer<typeof questionSchema>, { question_type: T }>;
