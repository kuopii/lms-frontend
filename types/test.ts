export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const TIME_TYPES = ["countup", "countdown", "notimer"] as const;
export const TEST_TYPES = ["single", "final"] as const;
export const TYPE = ["listening", "reading", "writing", "speaking"] as const;
export const ALLOW_REPETITION = [
  { label: "Yes", value: true },
  { label: "No", value: false },
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type TimeType = (typeof TIME_TYPES)[number];
export type TestType = (typeof TEST_TYPES)[number];

export type ReadingQuestion = {
  question_type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  breakdown: string;
};

export type QuestionType = "choose_correct_answer" | "choose_multiple_answer";
// | "true_false_not_given"
// | "yes_no_not_given"
// | "matching_heading"
// | "short_answer_question"
// | "matching_features"
// | "matching_sentence_ending"
// | "matching_information"
// | "diagram_label_completion"
// | "sentence_completion"
// | "paragraph_completion"
// | "note_completion";
