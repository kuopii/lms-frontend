type Option = { label: string; answer: string };

type AnswerItem = {
  optIndex: number;
  wordIndex: number;
  word: string;
};

export function isStructuredAnswer(val: unknown): val is AnswerItem[] {
  return (
    Array.isArray(val) &&
    val.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "optIndex" in item &&
        "wordIndex" in item &&
        "word" in item,
    )
  );
}

// array object of Option? (map labeling dan form completion )
export function isObjectOptionsArray(rawOptions: any) {
  return Array.isArray(rawOptions) &&
    rawOptions.every(
      (opt) => typeof opt === "object" && "label" in opt && "answer" in opt,
    )
    ? (rawOptions as { label: string; answer: string }[])
    : [];
}

type OptionAnswer = {
  optIndex: number;
  wordIndex: number;
  word: string;
};

type OptionObject = {
  label: string;
  answer: OptionAnswer[];
};

export const isObjectOptionsAnswerArray = (rawOptions: any): OptionObject[] => {
  if (
    Array.isArray(rawOptions) &&
    rawOptions.every(
      (opt) =>
        typeof opt === "object" &&
        opt !== null &&
        typeof opt.label === "string" &&
        Array.isArray(opt.answer) &&
        opt.answer.every(
          (ans: any) =>
            typeof ans === "object" &&
            ans !== null &&
            typeof ans.optIndex === "number" &&
            typeof ans.wordIndex === "number" &&
            typeof ans.word === "string",
        ),
    )
  ) {
    return rawOptions as OptionObject[];
  }
  return [];
};
