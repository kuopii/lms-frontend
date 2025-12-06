import { FaArrowCircleRight } from "react-icons/fa";

export default function NextButton() {
  return (
    <button className="bg-primary ml-0 flex min-w-fit cursor-pointer items-center justify-between gap-[11px] rounded-[30px] px-4 py-2 text-base font-normal transition-all duration-200 ease-out hover:bg-[#6a8d48] sm:ml-auto">
      Next
      <FaArrowCircleRight className="h-4 w-4" />
    </button>
  );
}
