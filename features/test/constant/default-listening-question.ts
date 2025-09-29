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
    correct_answer: [
      {
        option_key: "1",
        option_text: "",
      },
    ],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
  note_completion: {
    question_type: "note_completion",
    question_number: 0,
    question_text: "",
    correct_answer: [
      {
        option_key: "1",
        option_text: "",
      },
    ],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
  sentence_completion: {
    question_number: 0,
    question_type: "sentence_completion",
    question_text: "",
    correct_answer: [
      {
        option_key: "",
        option_text: "",
      },
    ],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },

  form_completion: {
    question_number: 0,
    question_type: "form_completion",
    question_text: "",
    correct_answer: [
      {
        option_key: "",
        option_text: "",
      },
    ],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
  summary_completion: {
    question_type: "summary_completion",
    question_number: 0,
    question_text: "",
    correct_answer: [
      {
        option_key: "1",
        option_text: "",
      },
    ],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
  map_labeling: {
    question_number: 0,
    question_type: "map_labeling",
    question_text: "",
    question_data: { images: [] },
    items: [],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
  table_completion: {
    question_number: 0,
    question_type: "table_completion",
    question_data: {
      images: [],
      table: [],
    },
    correct_answer: [
      {
        option_key: "",
        option_text: "",
      },
    ],
    points_value: 0,
    breakdown: {
      explanation: "",
    },
  },
};
