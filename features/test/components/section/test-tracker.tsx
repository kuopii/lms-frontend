"use client";

import React, { useState } from "react";
import StepIndicator from "../progress/step-indicator";
import TimeLeftDisplay from "../progress/timer";

const TestTracker = () => {
  const totalSteps = 40; // TODO: derive from exercise data if available
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="container mx-auto mt-3 grid grid-cols-1 items-center justify-between gap-4 lg:grid-cols-4">
      <StepIndicator
        className="lg:col-span-3"
        totalSteps={totalSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />
      <TimeLeftDisplay />
    </div>
  );
};

export default TestTracker;
