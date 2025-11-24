interface SummaryCardProps {
  score?: number; // from 0 to 100
}

const SummaryCard = ({ score = 75 }: SummaryCardProps) => {
  const info = [
    { label: "Test type", value: "xxxx" },
    { label: "Date", value: "xxxx" },
    { label: "Time Spent", value: "xxxx" },
  ];

  return (
    <div className="flex items-center gap-[60px]">
      {/* Circle Progress */}
      <div className="relative h-[170px] w-[170px] rounded-full bg-white">
        <svg viewBox="0 0 36 36" className="h-full w-full rotate-90 transform">
          {/* Background circle */}
          <path
            className="text-[#E0E9D8]"
            stroke="currentColor"
            strokeWidth="3.8"
            fill="none"
            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Progress circle */}
          <path
            className="text-primary"
            stroke="currentColor"
            strokeWidth="3.8"
            strokeDasharray={`${score}, 100`}
            fill="none"
            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        {/* Score text in center */}
        <span className="text-primary absolute inset-0 flex items-center justify-center text-[55px] font-extrabold">
          {score}
        </span>
      </div>
      <div className="flex flex-col gap-2 text-white">
        {info.map((item, i) => (
          <span key={i} className="text-[22px] font-semibold">
            {item.label}: <span className="font-extralight">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
