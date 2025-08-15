import { Question, QuestionType } from "./question";

export const questionTemplates: Record<QuestionType, () => Question> = {
  Choose_the_Correct_Answer: () => ({
    type: "Choose_the_Correct_Answer",
    prompt: "",
    options: [""],
    answer: "",
    explanation: "",
  }),

  Choose_Multiple_Answers: () => ({
    type: "Choose_Multiple_Answers",
    prompt: "",
    options: [""],
    answer: [],
    explanation: "",
  }),

  Sentence_Completion: () => ({
    type: "Sentence_Completion",
    prompt: "",
    options: [],
    answer: [],
    explanation: "",
  }),

  Short_Answer_Question: () => ({
    type: "Short_Answer_Question",
    prompt: "",
    options: [""],
    answer: [],
    explanation: "",
  }),

  Map_Labeling: () => ({
    type: "Map_Labeling",
    prompt: "",
    options: [],
    answer: [],
    explanation: "",
    image: "",
  }),

  Form_Completion: () => ({
    type: "Form_Completion",
    prompt: "",
    options: [],
    answer: [],
    explanation: "",
    image: "",
  }),

  Note_Completion: () => ({
    type: "Note_Completion",
    prompt: "",
    options: [],
    answer: [],
    explanation: "",
  }),

  Summary_Completion: () => ({
    type: "Summary_Completion",
    prompt: "",
    options: [],
    answer: [],
    explanation: "",
  }),
} as const;
