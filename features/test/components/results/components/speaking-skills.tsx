const SpeakingSkills = () => {
  return (
    <div className="flex h-fit flex-col gap-6 overflow-hidden rounded-[30px] bg-[#333333] p-[35px] md:max-h-[900px]">
      <h2 className="flex justify-center text-[22px] font-medium">
        Your Speaking Transcript
      </h2>

      <div className="align-center grid grid-cols-4 justify-center gap-6 border-b pb-6 text-center">
        <div className="align-center flex flex-col gap-1">
          <span className="h-[10px] w-full rounded-[10px] bg-[#CB00FD]"></span>
          <p>Fluency & Coherence</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-[10px] w-full rounded-[10px] bg-[#0F68DC]"></span>
          <p>Lexical Resource</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-[10px] w-full rounded-[10px] bg-[#DC3545]"></span>
          <p>Grammatical Range & Accuracy</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="h-[10px] w-full rounded-[10px] bg-[#FFC107]"></span>
          <p>Pronunciation</p>
        </div>
      </div>

      <div className="thin-scrollbar flex flex-col gap-5 md:overflow-y-auto">
        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
          <div key={num} className="flex gap-2 text-white">
            <span className="text-[22px] font-medium">{num}</span>
            <span className="text-base font-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakingSkills;
