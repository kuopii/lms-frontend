"use client";

import { useState } from "react";
import QuestionsPanel from "../exercise/component/questions-panel";
import TextAreaExercise from "../exercise/component/text-area";
import QuestionHeaderExercise from "../exercise/component/question-header";
import ExplanationSection from "../exercise/component/explanation-section";

interface Props {
  testData: {
    type_test?: string;
    [key: string]: unknown;
  };
}

const ReviewBody = ({}: Props) => {
  const [activeQuestion] = useState(1);

  return (
    <div className="flex flex-1 flex-col">
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Left Panel - Question Area */}
        <TextAreaExercise />

        {/* Right Panel - Questions and Explanation */}
        <div className="flex flex-col gap-5">
          <QuestionHeaderExercise />
          <QuestionsPanel questionNumber={activeQuestion} />
          <ExplanationSection />
        </div>
      </div>
    </div>
  );
};

export default ReviewBody;
