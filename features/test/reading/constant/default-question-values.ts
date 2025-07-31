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
    options: ["Option 1", ""],
    answerKey: "",
    breakdown: "",
  },
  choose_multiple_answer: {
    type: "choose_multiple_answer",
    question: "",
    options: ["Option 1", ""],
    answerKey: [],
    breakdown: "",
  },
  true_false_not_given: {
    type: "true_false_not_given",
    question: "",
    options: ["True", "False", "Not Given"],
    answerKey: "True",
    breakdown: "",
  },
  yes_no_not_given: {
    type: "yes_no_not_given",
    question: "",
    options: ["Yes", "No", "Not Given"],
    answerKey: "Yes",
    breakdown: "",
  },
};
