import { GrSync } from "react-icons/gr";

const ReattemptsArea = () => {
  return (
    <div className="flex items-center justify-center gap-5 text-base font-medium text-white">
      <button className="bg-primary flex items-center gap-3 rounded-[30px] px-[18px] py-[8px]">
        Retake Test
        <GrSync />
      </button>
      <span className="border-destructive rounded-[30px] border-1 px-[18px] py-[8px]">
        Test Attempts: 2
      </span>
    </div>
  );
};

export default ReattemptsArea;
