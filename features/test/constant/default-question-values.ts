import { QuestionType, questionSchema } from "../form/create-reading-form";
import { z } from "zod";

// Ambil union literal dari Zod enum
type QuestionTypeValue = z.infer<typeof QuestionType>;

// Ambil tipe data dari questionSchema
type QuestionSchemaValue = z.infer<typeof questionSchema>;

export const defaultQuestionValues: Record<
  QuestionTypeValue,
  QuestionSchemaValue
> = {
  choose_correct_answer: {
    type: "choose_correct_answer",
    question: "",
    options: ["Option 1"],
    answerKey: "",
    breakdown: "",
  },
  choose_multiple_answer: {
    type: "choose_multiple_answer",
    question: "",
    options: ["Option 1"],
    answerKey: [],
    breakdown: "",
  },
  true_false_not_given: {
    type: "true_false_not_given",
    question: "",
    options: ["True", "False", "Not Given"] as const,
    answerKey: "",
    breakdown: "",
  },
  yes_no_not_given: {
    type: "yes_no_not_given",
    question: "",
    options: ["Yes", "No", "Not Given"] as const,
    answerKey: "",
    breakdown: "",
  },
  matching_heading: {
    type: "matching_heading",
    options: ["Heading 1"],
    items: [
      {
        text: "",
        answerKey: "",
        breakdown: "",
      },
    ],
  },
  short_answer_question: {
    type: "short_answer_question",
    question: "",
    answerKey: ["Type the correct answer here..."],
    otherAnswerIncorrect: false,
    breakdown: "",
  },
  matching_features: {
    type: "matching_features",
    options: ["Type the feature options here..."],
    items: [
      {
        text: "",
        answerKey: "",
        breakdown: "",
      },
    ],
  },
  matching_sentence_ending: {
    type: "matching_sentence_ending",
    options: ["Type the sentence endings here"],
    items: [
      {
        text: "",
        answerKey: "",
        breakdown: "",
      },
    ],
  },
  matching_information: {
    type: "matching_information",
    paragraph: ["Type or paste the text here..."],
    items: [
      {
        question: "",
        answerKey: "",
        breakdown: "",
      },
    ],
  },
  diagram_label_completion: {
    type: "diagram_label_completion",
    image: "",
    question: "",
    items: [
      {
        answerKey: "",
        label: "A",
      },
    ],
    breakdown: "",
  },
  sentence_completion: {
    type: "sentence_completion",
    items: [
      {
        question: "",
        answerKey: "",
      },
    ],
    breakdown: "",
  },
  paragraph_completion: {
    type: "paragraph_completion",
    paragraph: "",
    options: ["Type the suggested answers here..."],
    answerKey: [""],
    breakdown: "",
  },
  note_completion: {
    type: "note_completion",
    paragraph: "",
    answerKey: [
      {
        number: "1",
        answer: "",
      },
    ],
    breakdown: "",
  },
};
