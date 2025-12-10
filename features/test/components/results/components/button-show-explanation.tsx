"use client";

import { useParams, useRouter } from "next/navigation";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

const ButtonShowExplanation = () => {
  const router = useRouter();
  const params = useParams();
  const testName = params.name as string;

  const handleClick = () => {
    router.push(`/test/review/${testName}`);
  };

  return (
    <button
      onClick={handleClick}
      className="font white bg-primary flex w-fit flex-row items-center gap-4 rounded-[30px] px-[15px] py-[8px] transition-opacity hover:opacity-90"
    >
      Show Explanation
      <BsFillArrowRightCircleFill className="h-5 w-5" />
    </button>
  );
};

export default ButtonShowExplanation;
