const MultipleAnswerListening = () => {
  const questions = [
    {
      number: 1,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      ],
    },
    {
      number: 2,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      ],
    },
    {
      number: 3,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      ],
    },
    {
      number: 4,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4 text-white">
      <h1 className="text-[22px] font-medium">Tittle</h1>
      <div className="grid grid-cols-2 gap-5 text-base font-normal">
        {questions.map((q) => (
          <div
            key={q.number}
            className="bg-popover flex flex-col gap-5 rounded-[30px] p-[30px]"
          >
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <span className="text-primary text-[22px] font-medium">
                {q.number}
              </span>
              <p className="self-center">{q.question}</p>
            </div>
            <div className="flex flex-col gap-4">
              {q.options.map((opt, i) => (
                <button key={i} className="flex items-center gap-4">
                  <span className="hover:bg-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[var(--color-neutral-1)] text-[var(--color-neutral-5)] duration-200 ease-in-out hover:text-white">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="h-[2px] w-full rounded-full bg-[#333333]"></div>
    </div>
  );
};

export default MultipleAnswerListening;
