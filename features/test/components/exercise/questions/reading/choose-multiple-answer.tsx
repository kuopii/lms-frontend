import { useState } from "react";
import QuestionHeaderExercise from "../../component/question-header";

interface OptionItem {
  label: string;
  text: string;
}

interface QuestionItem {
  number: number;
  question: string;
  options: OptionItem[];
}

const questionsData: QuestionItem[] = [
  {
    number: 1,
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    options: [
      { label: "A", text: "Option A untuk soal 1" },
      { label: "B", text: "Option B untuk soal 1" },
      { label: "C", text: "Option C untuk soal 1" },
    ],
  },
  {
    number: 2,
    question: "Duis aute irure dolor in reprehenderit in voluptate velit esse?",
    options: [
      { label: "A", text: "Option A untuk soal 2" },
      { label: "B", text: "Option B untuk soal 2" },
      { label: "C", text: "Option C untuk soal 2" },
    ],
  },
  {
    number: 3,
    question: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem?",
    options: [
      { label: "A", text: "Option A untuk soal 3" },
      { label: "B", text: "Option B untuk soal 3" },
      { label: "C", text: "Option C untuk soal 3" },
    ],
  },
];

const ChooseMultipleAnswerReading = () => {
  const [selected, setSelected] = useState<Record<number, string[]>>({});

  const toggleSelect = (questionNumber: number, label: string) => {
    setSelected((prev) => {
      const current = prev[questionNumber] || [];

      const updated = current.includes(label)
        ? current.filter((l) => l !== label)
        : [...current, label];

      return { ...prev, [questionNumber]: updated };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <QuestionHeaderExercise />

      {questionsData.map((q) => (
        <div
          key={q.number}
          className="bg-popover flex flex-col gap-5 rounded-[30px] p-5"
        >
          {/* Question */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-3">
            <span className="text-primary text-[22px] font-medium">
              {q.number}
            </span>
            <p>{q.question}</p>
          </div>

          {/* Options */}
          {q.options.map((opt) => {
            const active = selected[q.number]?.includes(opt.label);

            return (
              <div
                key={opt.label}
                className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3"
                onClick={() => toggleSelect(q.number, opt.label)}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full p-2 transition-all ${
                    active
                      ? "bg-primary text-white"
                      : "bg-[var(--color-neutral-1)] text-[var(--color-neutral-5)]"
                  } `}
                >
                  {opt.label}
                </span>

                <span>{opt.text}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChooseMultipleAnswerReading;
