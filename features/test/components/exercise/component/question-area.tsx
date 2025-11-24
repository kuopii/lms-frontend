interface Question {
  text: string;
  options: string[];
}

interface Props {
  questions: Question[];
}

const QuestionAreaExercise = ({ questions = [] }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, qi) => (
        <div
          key={qi}
          className="bg-popover flex flex-col gap-[15px] rounded-[30px] p-[20px]"
        >
          <div className="flex items-center gap-[15px]">
            <span className="text-primary text-[22px] font-medium">
              {qi + 1}
            </span>
            <p className="text-base font-normal text-white">{q.text}</p>
          </div>

          <div className="flex flex-col gap-[10px]">
            {q.options.map((opt, oi) => (
              <div
                key={oi}
                className="flex items-center gap-[10px] text-base font-normal"
              >
                <span className="text-primary flex h-7 w-7 items-center justify-center rounded-full bg-[#DEDEDE]">
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="text-white">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionAreaExercise;
