import { Passage, Question, QuestionGroup } from "@/types/test";
import { baseTestSchema, withAllValidations } from "@/validators/test";
import { z } from "zod";

export const QuestionType = z.enum([
  "choose_correct_answer",
  "choose_multiple_answer",
  "true_false_not_given",
  "yes_no_not_given",
  "sentence_completion",
  "matching_heading",
  "matching_features",
  "matching_sentence_ending",
  "matching_information",
  "diagram_label_completion",
  "paragraph_completion",
  "note_completion",
  "table_completion",
]);

export const questionDataSchema = z.object({
  images: z
    .array(z.instanceof(File, { message: "Each image must be a valid file" }))
    .optional(),
  table: z.array(z.array(z.string())).optional(),
});

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
  question_data: questionDataSchema.optional(),
  breakdown: breakdownSchema.optional(),
});

const matchingHeadingSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("matching_heading"),
  question_data: questionDataSchema.optional(),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  items: z
    .array(
      z.object({
        question_number: z.number({
          required_error: "Question number is required",
          invalid_type_error: "Question number must be a number",
        }),
        question_text: z.string().min(1, "Question text is required"),
        correct_answer: optionSchema,
        breakdown: breakdownSchema.optional(),
      }),
    )
    .min(1, "Minimum 1 item to match"),
});

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
  question_data: questionDataSchema.optional(),
  breakdown: breakdownSchema.optional(),
});

const matchingFeaturesSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("matching_features"),
  question_data: questionDataSchema.optional(),
  points_value: z.number().min(1, "Points value must be at least 1"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  items: z
    .array(
      z.object({
        question_number: z.number({
          required_error: "Question number is required",
          invalid_type_error: "Question number must be a number",
        }),
        question_text: z.string().min(1, "Question text is required"),
        correct_answer: optionSchema,
        breakdown: breakdownSchema.optional(),
      }),
    )
    .min(1, "Minimum 1 item to match"),
});

const matchingSentenceEndingSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("matching_sentence_ending"),
  question_data: questionDataSchema.optional(),
  points_value: z.number().min(1, "Points value must be at least 1"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  items: z
    .array(
      z.object({
        question_number: z.number({
          required_error: "Question number is required",
          invalid_type_error: "Question number must be a number",
        }),
        question_text: z.string().min(1, "Question text is required"),
        correct_answer: optionSchema,
        breakdown: breakdownSchema.optional(),
      }),
    )
    .min(1, "Minimum 1 item to match"),
});

const matchingInformationSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("matching_information"),
  question_data: questionDataSchema.optional(),
  points_value: z.number().min(1, "Points value must be at least 1"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  items: z
    .array(
      z.object({
        question_number: z.number({
          required_error: "Question number is required",
          invalid_type_error: "Question number must be a number",
        }),
        question_text: z.string().min(1, "Question text is required"),
        correct_answer: optionSchema,
        breakdown: breakdownSchema.optional(),
      }),
    )
    .min(1, "Minimum 1 item to match"),
});

const diagramLabelCompletionSchema = z.object({
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_type: z.literal("diagram_label_completion"),
  question_text: z.string().min(1, "Question text is required"),
  question_data: questionDataSchema.optional(),
  points_value: z.number().min(1, "Points value must be at least 1"),
  items: z
    .array(
      z.object({
        question_number: z.number({
          required_error: "Question number is required",
          invalid_type_error: "Question number must be a number",
        }),
        correct_answer: optionSchema,
      }),
    )
    .min(1, "Minimal 1 item harus disediakan"),
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

const paragraphCompletionSchema = z.object({
  question_type: z.literal("paragraph_completion"),
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_text: z.string().min(1, "Question text is required"),
  question_data: questionDataSchema.optional(),
  points_value: z.number().min(1, "Points value must be at least 1"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
  items: z
    .array(
      z.object({
        question_number: z.number({
          required_error: "Question number is required",
          invalid_type_error: "Question number must be a number",
        }),
        correct_answer: optionSchema,
      }),
    )
    .min(1, "Minimum 1 item to match"),
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

const tableCompletionSchema = z.object({
  question_type: z.literal("table_completion"),
  question_number: z.number({
    required_error: "Question number is required",
    invalid_type_error: "Question number must be a number",
  }),
  question_data: questionDataSchema.optional(),
  correct_answer: z
    .array(optionSchema)
    .min(1, "At least 2 correct answers are required"),
  points_value: z.number().min(1, "Points value must be at least 1"),
  breakdown: breakdownSchema.optional(),
});

export const questionSchema = z.discriminatedUnion("question_type", [
  chooseCorrectAnswerSchema,
  chooseMultipleAnswerSchema,
  trueFalseNotGiven,
  matchingHeadingSchema,
  yesNoNotGiven,
  sentenceCompletion,
  matchingFeaturesSchema,
  matchingSentenceEndingSchema,
  matchingInformationSchema,
  diagramLabelCompletionSchema,
  paragraphCompletionSchema,
  noteCompletionSchema,
  tableCompletionSchema,
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

export const createReadingTestSchema = withPointsValidation(
  withAllValidations(
    baseTestSchema.extend({
      passages: z
        .array(passageSchema)
        .min(1, "At least one passage is required"),
    }),
  ),
);

export type CreateReadingTestSchema = z.infer<typeof createReadingTestSchema>;
export type PassageReading = z.infer<typeof passageSchema>;
