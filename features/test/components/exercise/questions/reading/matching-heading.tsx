import { FaCaretRight } from "react-icons/fa6";
import QuestionHeaderExercise from "../../component/question-header";
import { useEffect, useState } from "react";

const MatchingHeadingReading = () => {
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState("Choose correct answer");

  const options = ["Heading 1", "Heading 2", "Heading 3", "Heading 4"];

  useEffect(() => {
    const saved = localStorage.getItem("selectHeading");
    if (saved) {
      setSelect(saved);
    }
  }, []);

  const handleSelect = (opt: string) => {
    setSelect(opt);
    localStorage.setItem("selectHeading", opt);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <QuestionHeaderExercise />
      <div className="bg-popover flex flex-col gap-5 rounded-[30px] p-5">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <span className="text-primary text-[22px] font-medium">11</span>
          <p>Paragraph A</p>
        </div>
        <div
          className="flex flex-col rounded-[30px] border-1 p-5"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center justify-between">
            <span>{select}</span>
            <FaCaretRight
              className={`h-5 w-5 transition-transform duration-300 ${
                open ? "rotate-90" : ""
              }`}
            />
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              open ? "opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col divide-y">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt);
                  }}
                >
                  <span className="my-2 flex w-full cursor-pointer rounded-[30px] px-5 py-2 hover:bg-[var(--color-neutral-5)]">
                    {opt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingHeadingReading;
