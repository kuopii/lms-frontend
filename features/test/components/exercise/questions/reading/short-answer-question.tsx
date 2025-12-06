import { autoResizeTextarea } from "@/hooks/auto-resize-text-area";
import QuestionHeaderExercise from "../../component/question-header";
import { useState } from "react";

interface ShortQuestionItem {
  number: number;
  question: string;
}

const shortQuestions: ShortQuestionItem[] = [
  {
    number: 1,
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
  },
  {
    number: 2,
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
  },
  {
    number: 3,
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
  },
  {
    number: 4,
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
  },
];

const ShortAnswerReading = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleChange = (num: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [num]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <QuestionHeaderExercise />

      {shortQuestions.map((item) => (
        <div
          key={item.number}
          className="bg-popover flex flex-col gap-3 rounded-[30px] p-5"
        >
          <div className="grid grid-cols-[auto_1fr] items-center gap-3">
            <span className="text-primary text-[22px] font-medium">
              {item.number}
            </span>
            <p>{item.question}</p>
          </div>

          <textarea
            value={answers[item.number] || ""}
            onChange={(e) => handleChange(item.number, e.target.value)}
            onInput={autoResizeTextarea}
            rows={1}
            className="focus:border-primary resize-none overflow-hidden border-b border-[var(--color-neutral-3)] outline-0"
          />
        </div>
      ))}
    </div>
  );
};

export default ShortAnswerReading;
