"use client";

import { useEffect, useState } from "react";
import { PiRecordFill } from "react-icons/pi";

interface Props {
  isPaused?: boolean;
}

const RecordingTimer = ({ isPaused = false }: Props) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#DC3545] px-4 py-2 text-base font-normal text-white sm:w-[240px]">
      <div className="relative flex items-center justify-center">
        <PiRecordFill
          className={`h-4 w-4 ${isPaused ? "" : "animate-pulse"}`}
        />
        {!isPaused && (
          <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-white/30" />
        )}
      </div>
      <span>
        {isPaused ? "Paused" : "Recording"} <span>{formatTime(seconds)}</span>
      </span>
    </div>
  );
};

export default RecordingTimer;
