import {
  listeningQuestionTypes,
  readingQuestionTypes,
} from "@/data/test-filter-options";

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
  points_value: number;
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

export type Passage = {
  title?: string;
  description?: string;
  audio_file?: string | null;
  questionGroups: QuestionGroup[];
};

export type QuestionGroup = {
  instruction: string;
  transcript?: Transcript | null;
  questions: Question[];
};

export type Transcript = {
  type: "descriptive" | "transcript" | "conversation";
  text: string;
  title?: string;
};

export type Question = {
  question_type: ReadingTypeQuestion | ListeningTypeQuestion;
  question_number: number;
  points_value: number;
  options?: Option[];
  breakdown: Breakdown;
  question_data?: {
    images?: File[];
    table: {
      columns: { id: string; label: string }[];
      rows: Record<string, string>[];
    };
    blanks: {
      id: string;
      rowId: string;
      colId: string;
      originalText: string;
      points: number;
    }[];
  };
  items?: Item[];
};

export type ReadingTypeQuestion =
  (typeof readingQuestionTypes)[number]["value"];

export type ListeningTypeQuestion =
  (typeof listeningQuestionTypes)[number]["value"];

export type Option = {
  option_key: string;
  option_text: string;
};

export type Item = {
  id: string;
  question_number: number;
  correct_answer: Option;
  question_text?: string;
  breakdown?: Breakdown;
};

export type Breakdown = {
  explanation: string;
  has_highlight?: boolean;
  highlights?: {
    start_char_index: number;
    end_char_index: number;
  }[];
};
