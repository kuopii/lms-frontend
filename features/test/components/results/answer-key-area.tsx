import PassageResults from "./components/passage-results";

const AnswerKeyArea = () => {
  const passages = [
    { number: 1, range: "1-10", start: 1 },
    { number: 1, range: "11-20", start: 11 },
    { number: 1, range: "21-30", start: 21 },
  ];

  const questionTexts = [
    "Lorem ipsum dolor sit amet",
    "Consectetur adipiscing elit sed",
    "Eiusmod tempor incididunt ut labore",
    "Dolore magna aliqua enim ad",
    "Minim veniam quis nostrud exercitation",
    "Ullamco laboris nisi ut aliquip",
    "Ex ea commodo consequat duis",
    "Aute irure dolor in reprehenderit",
    "Voluptate velit esse cillum dolore",
    "Eu fugiat nulla pariatur excepteur",
  ];

  const generateQuestions = (
    start: number,
  ): Array<{ number: number; text: string }> => {
    return Array.from({ length: 10 }, (_, i) => ({
      number: start + i,
      text: questionTexts[i] || "",
    }));
  };

  return (
    <div className="flex flex-col gap-[70px] rounded-[30px] bg-[#333333] px-[108px] py-[32px]">
      <h1 className="flex justify-center text-4xl font-bold text-white">
        Answer Key
      </h1>
      <div className="grid grid-cols-1 gap-8 divide-white md:grid-cols-3 md:divide-x">
        {passages.map((passage, index) => (
          <div
            key={index}
            className="flex flex-col gap-10 first:pl-0 last:pr-0"
          >
            <div className="flex w-full justify-center">
              <PassageResults
                passageNumber={passage.number}
                range={passage.range}
              />
            </div>

            <div className="space-y-3">
              {generateQuestions(passage.start).map((question) => (
                <div key={question.number} className="flex items-center gap-3">
                  <span className="text-primary text-[22px] font-medium">
                    {question.number}
                  </span>
                  <span className="text-base font-normal text-white">
                    {question.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerKeyArea;
