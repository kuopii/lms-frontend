import { baseTestSchema, withAllValidations } from "@/validators/test";
import { z } from "zod";

export const QuestionType = z.enum([
  "choose_correct_answer",
  "choose_multiple_answer",
]);

const optionSchema = z.object({
  option_key: z.string().min(1, "Option key is required"),
  option_text: z.string().min(1, "Option text is required"),
});

export const breakdownSchema = z.object({
  explanation: z.string().optional(),
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
  breakdown: breakdownSchema.optional(),
});

// const sentenceCompletion = z.object({
//   id: z.string().uuid(),
//   type: z.literal("Sentence_Completion"),
//   prompt: z.string().min(1),
//   options: z
//     .array(
//       z.object({
//         label: z.string(),
//         answer: z.string(),
//       }),
//     )
//     .min(1, "required"),
//   answer: z
//     .array(
//       z.object({
//         optIndex: z.number(),
//         wordIndex: z.number(),
//         word: z.string(),
//       }),
//     )
//     .min(1, "Please mark at least one blank"),
//   explanation: z.string().min(1),
// });

// const shortAnswerQuestion = z.object({
//   id: z.string().uuid(),
//   type: z.literal("Short_Answer_Question"),
//   prompt: z.string().min(1),
//   options: z.array(z.string()).min(1),
//   answer: z.array(z.string()).min(1),
//   explanation: z.string().min(1),
// });

// const mapLabeling = z.object({
//   id: z.string().uuid(),
//   type: z.literal("Map_Labeling"),
//   prompt: z.string().min(1),
//   options: z
//     .array(
//       z.object({
//         label: z.string(),
//         answer: z.string(),
//       }),
//     )
//     .min(1, "required"),
//   answer: z.array(z.string()).min(1),
//   explanation: z.string().min(1),
//   image: z.any().optional(),
// });

// const formCompletion = z.object({
//   id: z.string().uuid(),
//   type: z.literal("Form_Completion"),
//   prompt: z.string().min(1),
//   options: z
//     .array(
//       z.object({
//         label: z.string(),
//         answer: z.string(),
//       }),
//     )
//     .min(1, "required"),
//   answer: z.array(z.string()).min(1),
//   explanation: z.string().min(1),
//   image: z.any().optional(),
// });

// const noteCompletion = z.object({
//   id: z.string().uuid(),
//   type: z.literal("Note_Completion"),
//   prompt: z.string().min(1),
//   options: z
//     .array(
//       z.object({
//         label: z.string(),
//         answer: z.array(
//           z.object({
//             optIndex: z.number().int().nonnegative(),
//             wordIndex: z.number().int().nonnegative(),
//             word: z.string().min(1),
//           }),
//         ),
//       }),
//     )
//     .min(1, "required"),
//   answer: z
//     .array(
//       z.object({
//         optIndex: z.number(),
//         wordIndex: z.number(),
//         word: z.string(),
//       }),
//     )
//     .min(1, "Please mark at least one blank"),
//   explanation: z.string().min(1),
// });

// const summaryCompletion = z.object({
//   id: z.string().uuid(),
//   type: z.literal("Summary_Completion"),
//   prompt: z.string().min(1),
//   options: z
//     .array(
//       z.object({
//         label: z.string(),
//         answer: z.array(
//           z.object({
//             optIndex: z.number().int().nonnegative(),
//             wordIndex: z.number().int().nonnegative(),
//             word: z.string().min(1),
//           }),
//         ),
//       }),
//     )
//     .min(1, "required"),
//   answer: z
//     .array(
//       z.object({
//         optIndex: z.number(),
//         wordIndex: z.number(),
//         word: z.string(),
//       }),
//     )
//     .min(1, "Please mark at least one blank"),
//   explanation: z.string().min(1),
// });

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
  // sentenceCompletion,
  // shortAnswerQuestion,
  // mapLabeling,
  // formCompletion,
  // noteCompletion,
  // summaryCompletion,
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
