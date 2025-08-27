import { baseTestSchema, withAllValidations } from "@/validators/test";
import { z } from "zod";

export const QuestionType = z.enum([
  "choose_correct_answer",
  "choose_multiple_answer",
  "true_false_not_given",
  "yes_no_not_given",
  // "matching_heading",
  // "short_answer_question",
  // "matching_features",
  // "matching_sentence_ending",
  // "matching_information",
  // "diagram_label_completion",
  // "sentence_completion",
  // "paragraph_completion",
  // "note_completion",
]);

const optionSchema = z.object({
  option_key: z.string().min(1, "Option key is required"),
  option_text: z.string().min(1, "Option text is required"),
});

export const breakdownSchema = z.object({
  explanation: z.string().optional(),
  has_highlight: z.boolean().default(false),
  highlights: z
    .array(
      z.object({ start_char_index: z.number(), end_char_index: z.number() }),
    )
    .optional(),
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

const trueFalseNotGiven = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("true_false_not_given"),
  question_text: z.string().min(1, "Question text is required"),
  correct_answer: optionSchema,
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

// const matchingHeadingSchema = z.object({
//   type: z.literal("matching_heading"),
//   options: z
//     .array(z.string().min(1, "Heading tidak boleh kosong"))
//     .min(1, "Minimal 1 heading"),
//   items: z
//     .array(
//       z.object({
//         text: z.string().min(1, "Teks item wajib diisi"),
//         answerKey: z.string().min(1, "Jawaban wajib diisi"),
//         breakdown: z.string().optional(),
//       }),
//     )
//     .min(1, "Minimal 1 item untuk dicocokkan"),
// });

const yesNoNotGiven = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("yes_no_not_given"),
  question_text: z.string().min(1, "Question text is required"),
  correct_answer: optionSchema,
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

// const shortAnswerSchema = z.object({
//   type: z.literal("short_answer_question"),
//   question: z.string().min(1, "Soal wajib diisi"),
//   answerKey: z
//     .array(z.string().min(1, "Jawaban tidak boleh kosong"))
//     .min(1, "Minimal 1 jawaban harus diberikan"),
//   otherAnswerIncorrect: z.boolean(),
//   breakdown: z.string().optional(),
// });

// const matchingFeaturesSchema = z.object({
//   type: z.literal("matching_features"),
//   options: z
//     .array(z.string().min(1, "Fitur tidak boleh kosong"))
//     .min(1, "Minimal 1 fitur harus disediakan"),
//   items: z
//     .array(
//       z.object({
//         text: z.string().min(1, "Teks item wajib diisi"),
//         answerKey: z.string().min(1, "Jawaban wajib diisi"),
//         breakdown: z.string().optional(),
//       }),
//     )
//     .min(1, "Minimal 1 item untuk dicocokkan"),
// });

// const matchingSentenceEndingSchema = z.object({
//   type: z.literal("matching_sentence_ending"),
//   options: z
//     .array(z.string().min(1, "Akhiran kalimat tidak boleh kosong"))
//     .min(1, "Minimal 1 akhiran kalimat harus disediakan"),
//   items: z
//     .array(
//       z.object({
//         text: z.string().min(1, "Teks awal kalimat wajib diisi"),
//         answerKey: z.string().min(1, "Jawaban wajib diisi"),
//         breakdown: z.string().optional(),
//       }),
//     )
//     .min(1, "Minimal 1 kalimat untuk dicocokkan"),
// });

// const matchingInformationSchema = z.object({
//   type: z.literal("matching_information"),
//   paragraph: z.array(z.string().min(1, "Paragraf tidak boleh kosong")).min(1),
//   items: z
//     .array(
//       z.object({
//         question: z.string().min(1, "Pertanyaan wajib diisi"),
//         answerKey: z.string().min(1, "Jawaban wajib diisi"),
//         breakdown: z.string().optional(),
//       }),
//     )
//     .min(1, "Minimal 1 kalimat untuk dicocokkan"),
// });

// const diagramLabelCompletionSchema = z.object({
//   type: z.literal("diagram_label_completion"),
//   image: z.string().min(1, "Gambar wajib diisi"), // base64
//   question: z.string().min(1, "Soal wajib diisi"),
//   items: z
//     .array(
//       z.object({
//         label: z.string().min(1, "Label wajib diisi"),
//         answerKey: z.string().min(1, "Jawaban wajib diisi"),
//       }),
//     )
//     .min(1, "Minimal 1 item harus disediakan"),
//   breakdown: z.string().optional(),
// });

// const sentenceCompletionSchema = z.object({
//   type: z.literal("sentence_completion"),
//   items: z
//     .array(
//       z.object({
//         question: z.string().min(1, "Pertanyaan wajib diisi"),
//         answerKey: z.string().min(1, "Jawaban wajib diisi"),
//       }),
//     )
//     .min(1, "Minimal 1 kalimat harus disediakan"),
//   breakdown: z.string().optional(),
// });

// const paragraphCompletionSchema = z.object({
//   type: z.literal("paragraph_completion"),
//   paragraph: z.string().min(1, "Paragraf tidak boleh kosong"),
//   options: z.array(z.string().min(1, "Opsi tidak boleh kosong")).min(2),
//   answerKey: z.array(z.string().min(1, "Jawaban wajib diisi")).min(1),
//   breakdown: z.string().optional(),
// });

// const noteCompletionSchema = z.object({
//   type: z.literal("note_completion"),
//   paragraph: z.string().min(1, "Paragraf tidak boleh kosong"),
//   answerKey: z
//     .array(
//       z.object({
//         number: z.string().min(1, "Nomor blank wajib diisi"),
//         answer: z.string().min(1, "Jawaban wajib diisi"),
//       }),
//     )
//     .min(1, "Minimal harus ada 1 blank"),
//   breakdown: z.string().optional(),
// });

export const questionSchema = z.discriminatedUnion("question_type", [
  chooseCorrectAnswerSchema,
  chooseMultipleAnswerSchema,
  trueFalseNotGiven,
  // matchingHeadingSchema,
  yesNoNotGiven,
  // shortAnswerSchema,
  // matchingFeaturesSchema,
  // matchingSentenceEndingSchema,
  // matchingInformationSchema,
  // diagramLabelCompletionSchema,
  // sentenceCompletionSchema,
  // paragraphCompletionSchema,
  // noteCompletionSchema,
]);

const questionGroupSchema = z.object({
  instruction: z.string().min(1, "Instruction is required"),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

const passageSchema = z.object({
  title: z.string().min(1, "Passage title is required"),
  description: z.string().min(1, "Passage description is required"),
  questionGroups: z
    .array(questionGroupSchema)
    .min(1, "At least one question group is required"),
});

export const createReadingTestSchema = withAllValidations(
  baseTestSchema.extend({
    passages: z.array(passageSchema).min(1, "At least one passage is required"),
  }),
);

export type CreateReadingTestSchema = z.infer<typeof createReadingTestSchema>;
export type PassageReading = z.infer<typeof passageSchema>;
