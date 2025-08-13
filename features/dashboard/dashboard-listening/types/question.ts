export type QuestionType =
  | "Choose_the_Correct_Answer"
  | "Choose_Multiple_Answers"
  | "Sentence_Completion"
  | "Short_Answer_Question"
  | "Map_Labeling"
  | "Form_Completion"
  | "Note_Completion"
  | "Summary_Completion";

// type untuk question
export interface ChooseOneQuestion {
  type: "Choose_the_Correct_Answer";
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}
export type ChooseMultipleQuestion = {
  type: "Choose_Multiple_Answers";
  prompt: string;
  options: string[];
  answer: string[];
  explanation: string;
};

export type SentenceCompletion = {
  type: "Sentence_Completion";
  prompt: string;
  options: {
    label: string;
    answer: string;
  }[];
  answer: {
    optIndex: number;
    wordIndex: number;
    word: string;
  }[];
  explanation: string;
};

export type ShortAnswerQuestion = {
  type: "Short_Answer_Question";
  prompt: string;
  options: string[];
  answer: string[];
  explanation: string;
};

export type MapLabeling = {
  type: "Map_Labeling";
  prompt: string;
  options: {
    label: string;
    answer: string;
  }[];
  answer: string[];
  explanation: string;
  image: string;
};

export type FormCompletion = {
  type: "Form_Completion";
  prompt: string;
  options: {
    label: string;
    answer: string;
  }[];
  answer: string[];
  explanation: string;
  image: string;
};

export type NoteCompletion = {
  type: "Note_Completion";
  prompt: string;
  options: {
    label: string;
    answer: {
      optIndex: number;
      wordIndex: number;
      word: string;
    };
  }[];
  answer: {
    optIndex: number;
    wordIndex: number;
    word: string;
  }[];
  explanation: string;
};

export type SummaryCompletion = {
  type: "Summary_Completion";
  prompt: string;
  options: {
    label: string;
    answer: {
      optIndex: number;
      wordIndex: number;
      word: string;
    };
  }[];
  answer: {
    optIndex: number;
    wordIndex: number;
    word: string;
  }[];
  explanation: string;
};

// untuk label
export const questionTypeLabels: Record<QuestionType, string> = {
  Choose_the_Correct_Answer: "Choose the Correct Answer",
  Choose_Multiple_Answers: "Choose Multiple Answers",
  Sentence_Completion: "Sentence Completion",
  Short_Answer_Question: "Short Answer Question",
  Map_Labeling: "Map Labeling",
  Form_Completion: "Form Completion",
  Note_Completion: "Note Completion",
  Summary_Completion: "Summary Completion",
};

export type Question =
  | ChooseOneQuestion
  | ChooseMultipleQuestion
  | SentenceCompletion
  | ShortAnswerQuestion
  | MapLabeling
  | FormCompletion
  | NoteCompletion
  | SummaryCompletion;

export type Section = {
  transcriptValue: "descriptive" | "conversation";
  type: "single" | "full";
  instructions: string;
  questions: Question[];
  audio: string;
};

// Tambahkan tipe lain jika kamu punya jenis soal lain...
