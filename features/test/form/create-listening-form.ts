import { baseTestSchema, withAllValidations } from "@/validators/test";
import { z } from "zod";

const chooseOneSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("Choose_the_Correct_Answer"),
  prompt: z.string().min(1),
  options: z.array(z.string()).min(1),
  answer: z.string().min(1, "Answer required"),
  explanation: z.string().min(1),
});

const chooseMultipleSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("Choose_Multiple_Answers"),
  prompt: z.string().min(1),
  options: z.array(z.string()).min(1),
  answer: z.array(z.string()).min(1, "Answer required"),
  explanation: z.string().min(1),
});

const sentenceCompletion = z.object({
  id: z.string().uuid(),
  type: z.literal("Sentence_Completion"),
  prompt: z.string().min(1),
  options: z
    .array(
      z.object({
        label: z.string(),
        answer: z.string(),
      }),
    )
    .min(1, "required"),
  answer: z
    .array(
      z.object({
        optIndex: z.number(),
        wordIndex: z.number(),
        word: z.string(),
      }),
    )
    .min(1, "Please mark at least one blank"),
  explanation: z.string().min(1),
});

const shortAnswerQuestion = z.object({
  id: z.string().uuid(),
  type: z.literal("Short_Answer_Question"),
  prompt: z.string().min(1),
  options: z.array(z.string()).min(1),
  answer: z.array(z.string()).min(1),
  explanation: z.string().min(1),
});

const mapLabeling = z.object({
  id: z.string().uuid(),
  type: z.literal("Map_Labeling"),
  prompt: z.string().min(1),
  options: z
    .array(
      z.object({
        label: z.string(),
        answer: z.string(),
      }),
    )
    .min(1, "required"),
  answer: z.array(z.string()).min(1),
  explanation: z.string().min(1),
  image: z.any().optional(),
});

const formCompletion = z.object({
  id: z.string().uuid(),
  type: z.literal("Form_Completion"),
  prompt: z.string().min(1),
  options: z
    .array(
      z.object({
        label: z.string(),
        answer: z.string(),
      }),
    )
    .min(1, "required"),
  answer: z.array(z.string()).min(1),
  explanation: z.string().min(1),
  image: z.any().optional(),
});

const noteCompletion = z.object({
  id: z.string().uuid(),
  type: z.literal("Note_Completion"),
  prompt: z.string().min(1),
  options: z
    .array(
      z.object({
        label: z.string(),
        answer: z.array(
          z.object({
            optIndex: z.number().int().nonnegative(),
            wordIndex: z.number().int().nonnegative(),
            word: z.string().min(1),
          }),
        ),
      }),
    )
    .min(1, "required"),
  answer: z
    .array(
      z.object({
        optIndex: z.number(),
        wordIndex: z.number(),
        word: z.string(),
      }),
    )
    .min(1, "Please mark at least one blank"),
  explanation: z.string().min(1),
});

const summaryCompletion = z.object({
  id: z.string().uuid(),
  type: z.literal("Summary_Completion"),
  prompt: z.string().min(1),
  options: z
    .array(
      z.object({
        label: z.string(),
        answer: z.array(
          z.object({
            optIndex: z.number().int().nonnegative(),
            wordIndex: z.number().int().nonnegative(),
            word: z.string().min(1),
          }),
        ),
      }),
    )
    .min(1, "required"),
  answer: z
    .array(
      z.object({
        optIndex: z.number(),
        wordIndex: z.number(),
        word: z.string(),
      }),
    )
    .min(1, "Please mark at least one blank"),
  explanation: z.string().min(1),
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

const questionSchema = z.discriminatedUnion("type", [
  chooseOneSchema,
  chooseMultipleSchema,
  sentenceCompletion,
  shortAnswerQuestion,
  mapLabeling,
  formCompletion,
  noteCompletion,
  summaryCompletion,
]);

const questionGroupSchema = z.object({
  instruction: z.string().min(1, "Instruksi wajib diisi"),
  questions: z.array(questionSchema).min(1, "Minimal 1 soal"),
  transcript: transcriptValueSchema.optional(),
});

const passageSchema = z.object({
  questionGroups: z.array(questionGroupSchema).min(1, "Minimal 1 grup soal"),
  audio_file: z
    .any()
    .refine((file) => !file || file instanceof File, "Audio must be a file")
    .optional(),
});

export const createListeningTestSchema = withAllValidations(
  baseTestSchema.extend({
    passages: z.array(passageSchema).min(1, "At least one passage is required"),
  }),
);

export type CreateListeningTestSchema = z.infer<
  typeof createListeningTestSchema
>;
