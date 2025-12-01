const ExplanationSection = () => {
  return (
    <div className="flex flex-col gap-4 rounded-[30px] bg-[var(--tertiary)] p-5">
      <h3 className="text-primary border-b-1 border-[var(--color-neutral-5)] pb-3 text-[22px] font-medium">
        Question Breakdown with Answer Explanation
      </h3>
      <p className="text-sm leading-relaxed font-normal text-black">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. .........................
      </p>
    </div>
  );
};

export default ExplanationSection;
