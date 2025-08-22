import {
  QuestionType,
  questionSchema,
} from "@/features/test/form/create-listening-form";
import z from "zod";

type QuestionTypeValue = z.infer<typeof QuestionType>;

// Ambil tipe data dari questionSchema
type QuestionSchemaValue = z.infer<typeof questionSchema>;

export const defaultListeningQuestion: Record<
  QuestionTypeValue,
  QuestionSchemaValue
> = {
  choose_correct_answer: {
    question_number: 0,
    question_type: "choose_correct_answer",
    question_text: "",
    options: [
      {
        option_key: "A",
        option_text: "Option 1",
      },
    ],
    correct_answer: {
      option_key: "",
      option_text: "",
    },
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },

  choose_multiple_answer: {
    question_number: 0,
    question_type: "choose_multiple_answer",
    question_text: "",
    options: [
      {
        option_key: "A",
        option_text: "Option 1",
      },
    ],
    correct_answer: [],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
};
