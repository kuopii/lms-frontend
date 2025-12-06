"use client";

import { FaMicrophone } from "react-icons/fa";
import { FaPause, FaPlay } from "react-icons/fa6";

interface Props {
  isRecording?: boolean;
  isPaused?: boolean;
  onClick?: () => void;
}

const RecordingButton = ({
  isRecording = false,
  isPaused = false,
  onClick,
}: Props) => {
  const getButtonContent = () => {
    if (!isRecording) {
      return {
        icon: <FaMicrophone className="h-4 w-4" />,
        text: "Start Record",
        bgColor:
          "bg-primary hover:bg-[#6a8d48] border border-primary hover:border-[#6a8d48]",
      };
    }

    if (isPaused) {
      return {
        icon: <FaPlay className="h-4 w-4" />,
        text: "Resume",
        bgColor: "border border-primary hover:bg-primary",
      };
    }

    return {
      icon: <FaPause className="h-4 w-4" />,
      text: "Pause",
      bgColor: "border border-primary hover:bg-primary",
    };
  };

  const { icon, text, bgColor } = getButtonContent();

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-[11px] rounded-[30px] px-[15px] py-[8px] text-base font-normal text-white transition-colors sm:max-w-[180px] ${bgColor}`}
    >
      {icon}
      {text}
    </button>
  );
};

export default RecordingButton;
