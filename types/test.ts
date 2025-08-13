export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const TIME_TYPES = ["countup", "countdown", "notimer"] as const;
export const TEST_TYPES = ["single", "final"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type TimeType = (typeof TIME_TYPES)[number];
export type TestType = (typeof TEST_TYPES)[number];

export type ReadingQuestion = {
  type: string;
  question: string;
  options: string[];
  answerKey: string;
  breakdown: string;
};
