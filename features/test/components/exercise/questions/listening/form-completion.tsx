import { autoResizeTextarea } from "@/hooks/auto-resize-text-area";

const FormCompletionListening = () => {
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-center text-[22px] font-medium">
        University Accommodation Application Form
      </h1>
      <div className="bg-popover flex w-full flex-col justify-center gap-6 rounded-[30px] p-[36px]">
        <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-2">
          <span>
            Applicant’s Full Name:Lorem ipsum dolor sit amet consectetur
            adipiscing elitLorem ipsum dolor sit amet consectetur adipiscing
            elitLorem ipsum dolor sit amet consectetur adipiscing elitLorem
            ipsum dolor sit amet consectetur adipiscing elitLorem ipsum dolor
            sit amet consectetur adipiscing elit{" "}
          </span>
          <div className="flex h-fit gap-3 border-b-1">
            <span className="text-primary text-[22px] font-medium">1</span>
            <textarea
              name=""
              id=""
              className="thin-scrollbar w-full outline-none"
              onInput={autoResizeTextarea}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCompletionListening;
