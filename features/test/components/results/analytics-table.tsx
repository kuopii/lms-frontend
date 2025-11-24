const AnalyticsTable = () => {
  const data = [
    {
      type: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      amount: "x",
      true: "x",
      false: "x",
      missed: "x",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      amount: "x",
      true: "x",
      false: "x",
      missed: "x",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      amount: "x",
      true: "x",
      false: "x",
      missed: "x",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      amount: "x",
      true: "x",
      false: "x",
      missed: "x",
    },
    {
      type: "Lorem ipsum dolor sit amet",
      amount: "x",
      true: "x",
      false: "x",
      missed: "x",
    },
  ];

  return (
    <div className="flex flex-col gap-[40px] rounded-[30px] bg-[#333333] not-only:py-8">
      <h1 className="text-center text-2xl font-bold text-white md:text-3xl">
        Analytics Table
      </h1>

      {/* Desktop / Tablet View */}
      <div className="hidden overflow-hidden text-white md:block">
        {/* Header Row */}
        <div className="col-span-5 mb-[20px] grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-[#555555] px-6 text-[22px] font-medium text-white md:px-16 lg:px-[108px]">
          <div className="flex h-1/2 items-center justify-center self-center border-r border-white px-5 py-3">
            Type of question
          </div>
          <div className="flex h-1/2 items-center justify-center self-center border-r border-white px-5 py-3">
            Amount
          </div>
          <div className="flex items-center justify-center px-5 py-3">
            <span className="bg-primary flex w-full justify-center rounded-[30px] px-4 py-1">
              True
            </span>
          </div>
          <div className="flex items-center justify-center px-5 py-3">
            <span className="bg-destructive flex w-full justify-center rounded-full px-4 py-1">
              False
            </span>
          </div>
          <div className="flex items-center justify-center px-5 py-3">
            <span className="bg-chart-4 flex w-full justify-center rounded-full px-4 py-1">
              Missed
            </span>
          </div>
        </div>

        {/* Data Rows */}
        {data.map((row, i) => (
          <div
            key={i}
            className="col-span-5 grid grid-cols-[2fr_1fr_1fr_1fr_1fr] divide-x divide-white px-6 text-base font-normal text-white md:px-16 lg:px-[108px]"
          >
            <div className="flex items-center px-5 py-3">{row.type}</div>
            <div className="flex items-center justify-center px-5 py-3">
              {row.amount}
            </div>
            <div className="flex items-center justify-center px-5 py-3">
              {row.true}
            </div>
            <div className="flex items-center justify-center px-5 py-3">
              {row.false}
            </div>
            <div className="flex items-center justify-center px-5 py-3">
              {row.missed}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 px-[20px] md:hidden">
        {data.map((row, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-[#444444] bg-[#222222] px-6 py-4 text-gray-200"
          >
            <div className="font-semibold text-white">{row.type}</div>

            <div className="flex justify-between">
              <span className="text-[#DEDEDE]">Amount</span>
              <span className="text-[#DEDEDE]">{row.amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#DEDEDE]">True</span>
              <span className="text-primary">{row.true}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#DEDEDE]">False</span>
              <span className="text-destructive">{row.false}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#DEDEDE]">Missed</span>
              <span className="text-chart-4">{row.missed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsTable;
