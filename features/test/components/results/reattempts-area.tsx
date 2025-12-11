"use client";

import ReattemptTest from "../reattempt-test";
import ReattemptsButton from "./components/reattempts-button";

interface ReattemptsAreaProps {
  testName?: string;
}

const ReattemptsArea = ({ testName }: ReattemptsAreaProps) => {
  return (
    <div className="flex items-center justify-center gap-5 text-base font-medium text-white">
      <ReattemptsButton testName={testName} />
      <ReattemptTest />
    </div>
  );
};

export default ReattemptsArea;
