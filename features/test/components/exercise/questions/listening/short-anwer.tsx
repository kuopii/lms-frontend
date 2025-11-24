const ShortAnswerListening = () => {
  const questions = [
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
    {
      number: 5,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    },
    {
      number: 6,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    },
    {
      number: 7,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    },
    {
      number: 8,
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
    },
  ];

  return (
    <div className="flex flex-col gap-4 text-white">
      <div className="columns-1 gap-5 space-y-5 text-base font-normal sm:columns-2">
        {questions.map((q) => (
          <div
            key={q.number}
            className="bg-popover flex break-inside-avoid flex-col gap-5 rounded-[30px] p-[30px]"
          >
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <span className="text-primary text-[22px] font-medium">
                {q.number}
              </span>
              <p className="self-center">{q.question}</p>
            </div>
            <div className="flex flex-col gap-4 border-b-1">
              <textarea
                className="resize-none overflow-hidden outline-0"
                rows={1}
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortAnswerListening;
