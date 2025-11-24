import { FaLocationArrow } from "react-icons/fa6";

export default function SubmitButton() {
  return (
    <button className="flex items-center justify-between gap-[11px] rounded-[30px] bg-[#7A9D58] px-[15px] py-[8px] text-base font-normal">
      Submit
      <FaLocationArrow className="h-4 w-4 rotate-45" />
    </button>
  );
}
