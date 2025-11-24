const ListeningAnswer = () => {
  const answers = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    text: "Lorem ipsum dolor sit amet",
  }));

  const leftColumn = answers.slice(0, 10);
  const rightColumn = answers.slice(10, 20);

  return (
    <div className="flex flex-col gap-[70px] rounded-[30px] bg-[#333333] px-[108px] py-[32px]">
      <h1 className="flex justify-center text-4xl font-bold text-white">
        Answer Key
      </h1>
      <div className="grid grid-cols-1 divide-[#DEDEDE] md:grid-cols-2 md:divide-x">
        <div className="flex flex-col gap-3 px-12">
          {leftColumn.map((answer) => (
            <div
              key={answer.number}
              className="grid grid-cols-[auto_1fr] items-center gap-4"
            >
              <span className="text-primary text-[22px] font-medium">
                {answer.number}
              </span>
              <span className="text-base font-normal text-white">
                {answer.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 px-12">
          {rightColumn.map((answer) => (
            <div
              key={answer.number}
              className="grid grid-cols-[auto_1fr] items-center gap-4"
            >
              <span className="text-primary text-[22px] font-medium">
                {answer.number}
              </span>
              <span className="text-base font-normal text-white">
                {answer.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListeningAnswer;
