import { GrCycle } from "react-icons/gr";
import { FaTimes } from "react-icons/fa";
import { PiWarningFill } from "react-icons/pi";
import { AiFillLike } from "react-icons/ai";

const FeedbackSummaryArea = () => {
  const feedbackData = [
    {
      category: "Fluency & Coherence",
      score: "6.0 / 9.0",
      status: "Average",
      icon: <GrCycle className="h-6 w-6 text-[#2196f3]" />,
      notes: "[[notes]]",
    },
    {
      category: "Lexical Resource",
      score: "4.5 / 9.0",
      status: "Poor",
      icon: <FaTimes className="h-6 w-6 text-[#f44336]" />,
      notes: "[[notes]]",
    },
    {
      category: "Grammatical Range & Accuracy",
      score: "5.5 / 9.0",
      status: "Weak",
      icon: <PiWarningFill className="h-6 w-6 text-[#ffc107]" />,
      notes: "[[notes]]",
    },
    {
      category: "Pronunciation",
      score: "7.0 / 9.0",
      status: "Good",
      icon: <AiFillLike className="h-6 w-6 text-[#55ff5d]" />,
      notes: "[[notes]]",
    },
  ];

  return (
    <div className="flex flex-col gap-8 rounded-[30px] bg-[#333333] px-[34px] py-[32px]">
      <h1 className="flex justify-center border-b-1 border-[#DEDEDE] pb-[50px] text-[22px] font-medium text-white">
        Feedback Summary
      </h1>

      <div>
        {feedbackData.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 divide-x divide-[#FFFFFF66] text-[22px] font-medium text-white"
          >
            <div className="flex items-center px-5 py-8">{row.category}</div>
            <div className="flex items-center px-5 py-8">{row.score}</div>
            <div className="flex items-center gap-4 px-5 py-8">
              {" "}
              {row.icon} <span>{row.status}</span>
            </div>
            <div className="flex items-center px-5 py-8">{row.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackSummaryArea;
