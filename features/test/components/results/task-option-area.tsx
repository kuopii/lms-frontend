import React, { useEffect, useState } from "react";

const TaskOptionArea = () => {
  const [activeTask, setActiveTask] = useState("task1");

  useEffect(() => {
    setActiveTask("task1");
  }, []);

  return (
    <div className="flex w-fit items-center justify-center gap-2 self-center rounded-[30px] bg-[#333333] px-[15px] py-[10px] text-[22px] font-medium text-white">
      <button
        onClick={() => setActiveTask("task1")}
        className={`rounded-[30px] px-[70px] py-[10px] transition-all duration-300 ease-in-out ${
          activeTask === "task1" ? "bg-primary" : "hover:bg-[#444444]"
        }`}
      >
        Task 1
      </button>

      <button
        onClick={() => setActiveTask("task2")}
        className={`rounded-[30px] px-[70px] py-[10px] transition-all duration-300 ease-in-out ${
          activeTask === "task2" ? "bg-primary" : "hover:bg-[#444444]"
        }`}
      >
        Task 2
      </button>
    </div>
  );
};

export default TaskOptionArea;
