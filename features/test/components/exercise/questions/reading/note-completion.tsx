import React, { useState } from "react";

const NoteCompletionReading = () => {
  const [answers, setAnswers] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
  });

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-popover rounded-[30px] p-6 text-white">
      <ul className="list-disc space-y-4 pl-5">
        <li>
          Sleep plays a crucial role in consolidating memory after learning.
        </li>

        <li>
          Studies show that students who sleep after studying perform better on
          tests than those who do not.
        </li>

        <li>
          Declarative memory (facts and information) benefits from deep sleep,
          also known as{" "}
          <input
            type="text"
            value={answers.one}
            onChange={(e) => handleChange("one", e.target.value)}
            className="ml-1 w-32 border-b border-white bg-transparent text-center outline-none"
          />
        </li>

        <li>
          Procedural memory (skills and actions) improves during{" "}
          <input
            type="text"
            value={answers.two}
            onChange={(e) => handleChange("two", e.target.value)}
            className="ml-1 w-32 border-b border-white bg-transparent text-center outline-none"
          />{" "}
          sleep.
        </li>

        <li>
          Experiments showed that people remember word lists better after taking
          a{" "}
          <input
            type="text"
            value={answers.three}
            onChange={(e) => handleChange("three", e.target.value)}
            className="ml-1 w-32 border-b border-white bg-transparent text-center outline-none"
          />
        </li>

        <li>
          Sleep deprivation can reduce memory recall by up to{" "}
          <input
            type="text"
            value={answers.four}
            onChange={(e) => handleChange("four", e.target.value)}
            className="ml-1 w-20 border-b border-white bg-transparent text-center outline-none"
          />
        </li>

        <li>
          Best advice for students: prioritize{" "}
          <input
            type="text"
            value={answers.five}
            onChange={(e) => handleChange("five", e.target.value)}
            className="ml-1 w-32 border-b border-white bg-transparent text-center outline-none"
          />{" "}
          before exams, rather than extra cramming.
        </li>
      </ul>
    </div>
  );
};

export default NoteCompletionReading;
