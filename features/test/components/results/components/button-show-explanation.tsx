import { BsFillArrowRightCircleFill } from "react-icons/bs";

const ButtonShowExplanation = () => {
  return (
    <button className="font white bg-primary flex w-fit flex-row items-center gap-4 rounded-[30px] px-[15px] py-[8px]">
      Show Explanation
      <BsFillArrowRightCircleFill className="h-5 w-5" />
    </button>
  );
};

export default ButtonShowExplanation;
