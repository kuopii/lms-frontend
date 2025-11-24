import { IoOpenOutline } from "react-icons/io5";

const attempts = [
  { label: "Attempt #1", score: 20 },
  { label: "Attempt #2", score: 90 },
];

const SpeakingScore = () => {
  return (
    <div className="flex flex-col gap-6 rounded-[15px] bg-[#333333] px-[25px] py-[15px] text-white">
      <h1>Spaking Score</h1>

      <div className="flex flex-col gap-4">
        {attempts.map((attempt, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            {/* Attempt Label */}
            <span className="text-sm">{attempt.label}</span>

            {/* Progress Bar Container */}
            <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-[#E0E9D8]">
              {/* Progress Fill */}
              <div
                className="bg-primary absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                style={{ width: `${attempt.score}%` }}
              />

              {/* Score Text */}
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-widest text-shadow-md/50">
                {attempt.score}/100
              </div>
            </div>

            {/* External link icon */}
            <IoOpenOutline
              size={24}
              className="cursor-pointer text-gray-300 hover:text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakingScore;
