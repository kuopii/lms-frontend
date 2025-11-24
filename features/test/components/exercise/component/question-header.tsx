import React from "react";

const QuestionHeaderExercise = () => {
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-2 rounded-[30px] bg-[#7A9D58] px-[20px] py-[10px] text-white lg:grid-cols-3">
      <h1 className="text-[22px] font-medium">Question X - X</h1>
      <ul className="ml-6 list-disc space-y-1 text-base font-normal md:col-span-2">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit </li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
      </ul>
    </div>
  );
};

export default QuestionHeaderExercise;
