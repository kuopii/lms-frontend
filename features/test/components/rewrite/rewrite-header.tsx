"use client";

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import StepIndicator from "../progress/step-indicator";
import TimeLeftDisplay from "../progress/timer";
import TotalQuestion from "../progress/total-question";

interface Props {
  testData: {
    type_test?: string;
    [key: string]: unknown;
  };
  showProgress?: boolean; // Untuk menampilkan step indicator dan timer (hanya untuk attempt, bukan results)
}

const RewriteHeader = ({ testData, showProgress = true }: Props) => {
  const totalSteps = 40; // TODO: derive from exercise data if available
  const [currentStep, setCurrentStep] = useState(1);

  if (!testData || !testData.type_test) {
    return null;
  }

  // Tentukan apakah test type adalah Writing atau Speaking
  const isWritingOrSpeaking =
    testData.type_test?.toLowerCase() === "writing" ||
    testData.type_test?.toLowerCase() === "speaking";

  // Tentukan apakah test type adalah Listening atau Reading
  const isListeningOrReading =
    testData.type_test?.toLowerCase() === "listening" ||
    testData.type_test?.toLowerCase() === "reading";

  return (
    <header className="flex flex-col gap-4 py-4">
      {/* Top row: Test type and close button */}
      <div className="container mx-auto flex items-center justify-between gap-[40px]">
        <h1 className="w-full rounded-[30px] bg-[#7a9d58] px-[8px] py-[12px] text-center text-2xl font-semibold capitalize">
          {testData.type_test}
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="rounded-full bg-[#333333] p-[16px]"
            aria-label="Close exercise"
          >
            <FaXmark size={24} />
          </button>
        </div>
      </div>

      {/* Bottom row: Step indicator/Total question and timer (hanya untuk attempt) */}
      {showProgress && (
        <div className="container mx-auto grid grid-cols-1 items-center justify-between gap-4 lg:grid-cols-4">
          {isWritingOrSpeaking ? (
            <TotalQuestion className="lg:col-span-3" testData={testData} />
          ) : isListeningOrReading ? (
            <StepIndicator
              className="lg:col-span-3"
              totalSteps={totalSteps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
          ) : null}
          <TimeLeftDisplay />
        </div>
      )}
    </header>
  );
};

export default RewriteHeader;
