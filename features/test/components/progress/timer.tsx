import React from "react";

const TimeLeftDisplay = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-[30px] bg-[#DC354566] px-[30px] py-[10px] text-white sm:ml-auto">
      <p className="text-base font-normal">Time Left</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="text-[22px] font-medium">00</div>
          <div className="text-base font-normal">hours</div>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="text-[22px] font-medium">00</div>
          <div className="text-base font-normal">minutes</div>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="text-[22px] font-medium">00</div>
          <div className="text-base font-normal">seconds</div>
        </div>
      </div>
    </div>
  );
};

export default TimeLeftDisplay;
