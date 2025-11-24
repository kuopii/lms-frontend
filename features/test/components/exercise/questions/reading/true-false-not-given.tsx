import { useState } from "react";
import QuestionHeaderExercise from "../../component/question-header";

interface OptionItem {
  label: string;
  value: string;
}

interface QuestionTFNG {
  number: number;
  question: string;
  options: OptionItem[];
}

const questionData: QuestionTFNG = {
  number: 1,
  question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
  options: [
    { label: "A", value: "True" },
    { label: "B", value: "False" },
    { label: "C", value: "Not Given" },
  ],
};

const TrueOrFalseNotGivenReading = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (label: string) => {
    setSelected(label); // Only 1 can be selected
  };

  return (
    <div className="flex flex-col gap-6">
      <QuestionHeaderExercise />

      <div className="bg-popover flex flex-col gap-5 rounded-[30px] p-5">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <span className="text-primary text-[22px] font-medium">
            {questionData.number}
          </span>
          <p>{questionData.question}</p>
        </div>

        {questionData.options.map((opt) => {
          const active = selected === opt.label;

          return (
            <div
              key={opt.label}
              className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3"
              onClick={() => handleSelect(opt.label)}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full p-2 font-medium transition-all ${
                  active
                    ? "bg-primary text-white"
                    : "bg-[var(--color-neutral-1)] text-[var(--color-neutral-5)]"
                } `}
              >
                {opt.label}
              </span>

              <span>{opt.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrueOrFalseNotGivenReading;
