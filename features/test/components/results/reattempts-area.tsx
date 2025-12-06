"use client";

import ReattemptTest from "../reattempt-test";
import ReattemptsButton from "./components/reattempts-button";

interface ReattemptsAreaProps {
  testId?: string;
}

const ReattemptsArea = ({ testId }: ReattemptsAreaProps) => {
  return (
    <div className="flex items-center justify-center gap-5 text-base font-medium text-white">
      <ReattemptsButton testId={testId} />
      <ReattemptTest />
    </div>
  );
};

export default ReattemptsArea;
