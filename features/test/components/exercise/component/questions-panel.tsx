"use client";

interface Props {
  questionNumber: number;
}

const QuestionsPanel = ({ questionNumber }: Props) => {
  // Dummy data - akan diganti dengan data dari API
  const questionData = {
    header: {
      title: "Question 1-5",
      instructions: [
        "True - matches the passage",
        "False - contradicts the passage",
        "Not Given - not mentioned in the passage",
      ],
    },
    question: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: ["Yes", "No", "Not Given"],
      selectedAnswer: "Not Given",
      correctAnswer: "Yes",
    },
    explanation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...`,
  };

  const getButtonColor = (option: string) => {
    const isSelected = option === questionData.question.selectedAnswer;
    const isCorrect = option === questionData.question.correctAnswer;

    // Jika opsi ini adalah jawaban yang benar → hijau
    if (isCorrect) {
      return "bg-primary";
    }

    // Jika opsi ini dipilih tapi salah → merah
    if (isSelected && !isCorrect) {
      return "bg-[var(--error-1)] text-[var(--error-5)]";
    }

    // Jika opsi tidak dipilih dan bukan jawaban benar → abu-abu
    return "bg-gray-400";
  };

  return (
    <div className="flex h-fit flex-col gap-4">
      {/* Question Section */}
      <div className="bg-popover flex flex-col gap-5 rounded-[30px] p-5">
        {/* Question Number and Text */}
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <span className="text-primary text-[22px] font-medium">
            {questionNumber}
          </span>
          <h3>{questionData.question.text}</h3>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {questionData.question.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            const buttonColor = getButtonColor(option);

            return (
              <label key={index} className="flex items-center gap-3">
                {/* Circular Button */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full p-2 font-medium ${buttonColor}`}
                >
                  {optionLetter}
                </div>
                {/* Option Text */}
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPanel;
