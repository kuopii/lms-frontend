import { QuestionType, questionSchema } from "../form/create-reading-form";
import { z } from "zod";

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
  // matching_heading: {
  //   type: "matching_heading",
  //   options: ["Heading 1"],
  //   items: [
  //     {
  //       text: "",
  //       answerKey: "",
  //       breakdown: "",
  //     },
  //   ],
  // },
  // short_answer_question: {
  //   type: "short_answer_question",
  //   question: "",
  //   answerKey: ["Type the correct answer here..."],
  //   otherAnswerIncorrect: false,
  //   breakdown: "",
  // },
  // matching_features: {
  //   type: "matching_features",
  //   options: ["Type the feature options here..."],
  //   items: [
  //     {
  //       text: "",
  //       answerKey: "",
  //       breakdown: "",
  //     },
  //   ],
  // },
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
  // sentence_completion: {
  //   type: "sentence_completion",
  //   items: [
  //     {
  //       question: "",
  //       answerKey: "",
  //     },
  //   ],
  //   breakdown: "",
  // },
  // paragraph_completion: {
  //   type: "paragraph_completion",
  //   paragraph: "",
  //   options: ["Type the suggested answers here..."],
  //   answerKey: [""],
  //   breakdown: "",
  // },
  // note_completion: {
  //   type: "note_completion",
  //   paragraph: "",
  //   answerKey: [
  //     {
  //       number: "1",
  //       answer: "",
  //     },
  //   ],
  //   breakdown: "",
  // },
};
