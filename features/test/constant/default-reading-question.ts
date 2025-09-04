import { z } from "zod";
import { QuestionType, questionSchema } from "../form/create-reading-form";

// Ambil union literal dari Zod enum
type QuestionTypeValue = z.infer<typeof QuestionType>;

// Ambil tipe data dari questionSchema
type QuestionSchemaValue = z.infer<typeof questionSchema>;

export const defaultReadingQuestion: Record<
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
      has_highlight: false,
      highlights: [],
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
      has_highlight: false,
      highlights: [],
    },
  },
  true_false_not_given: {
    question_number: 0,
    question_type: "true_false_not_given",
    question_text: "",
    options: [
      {
        option_key: "A",
        option_text: "True",
      },
      {
        option_key: "B",
        option_text: "False",
      },
      {
        option_key: "C",
        option_text: "Not Given",
      },
    ],
    correct_answer: {
      option_key: "",
      option_text: "",
    },
    points_value: 0,
    breakdown: {
      explanation: "",
      has_highlight: false,
      highlights: [],
    },
  },
  yes_no_not_given: {
    question_number: 0,
    question_type: "yes_no_not_given",
    question_text: "",
    options: [
      {
        option_key: "A",
        option_text: "Yes",
      },
      {
        option_key: "B",
        option_text: "No",
      },
      {
        option_key: "C",
        option_text: "Not Given",
      },
    ],
    correct_answer: {
      option_key: "",
      option_text: "",
    },
    points_value: 0,
    breakdown: {
      explanation: "",
      has_highlight: false,
      highlights: [],
    },
  },
  sentence_completion: {
    question_number: 0,
    question_type: "sentence_completion",
    question_text: "",
    correct_answer: [{ option_key: "", option_text: "" }],
    points_value: 0,
    breakdown: {
      explanation: "",
      has_highlight: false,
      highlights: [],
    },
  },
  matching_heading: {
    question_number: 0,
    question_type: "matching_heading",
    options: [
      {
        option_key: "A",
        option_text: "Option 1",
      },
    ],
    points_value: 0,
    items: [],
    breakdown: {
      explanation: "",
      has_highlight: false,
      highlights: [],
    },
  },
  matching_features: {
    question_number: 0,
    question_type: "matching_features",
    points_value: 0,

    options: [
      {
        option_key: "A",
        option_text: "Option 1",
      },
    ],
    items: [],
  },
  // matching_sentence_ending: {
  //   type: "matching_sentence_ending",
  //   options: ["Type the sentence endings here"],
  //   items: [
  //     {
  //       text: "",
  //       answerKey: "",
  //       breakdown: "",
  //     },
  //   ],
  // },
  // matching_information: {
  //   type: "matching_information",
  //   paragraph: ["Type or paste the text here..."],
  //   items: [
  //     {
  //       question: "",
  //       answerKey: "",
  //       breakdown: "",
  //     },
  //   ],
  // },
  // diagram_label_completion: {
  //   type: "diagram_label_completion",
  //   image: "",
  //   question: "",
  //   items: [
  //     {
  //       answerKey: "",
  //       label: "A",
  //     },
  //   ],
  //   breakdown: "",
  // },
  paragraph_completion: {
    question_type: "paragraph_completion",
    question_number: 0,
    question_text: "",
    points_value: 0,
    options: [
      {
        option_key: "A",
        option_text: "Option 1",
      },
    ],
    items: [],
    breakdown: {
      explanation: "",
      has_highlight: false,
      highlights: [],
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
      has_highlight: false,
      highlights: [],
    },
  },
};
