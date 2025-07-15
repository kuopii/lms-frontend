type CardSkillsType = {
  variant: "leftSide" | "rightSide";
  titleCard: string;
};

const CardSkills = ({ variant, titleCard }: CardSkillsType) => {
  return (
    <div
      className={`card-custom flex h-[350px] w-full flex-col pt-[30px] md:w-[624px] ${variant === "leftSide" ? "pr-[30px]" : "pl-[30px]"}`}
    >
      <div
        className={`h-full w-full bg-white/40 ${variant === "leftSide" ? "rounded-r-[30px]" : "rounded-l-[30px]"}`}
      ></div>
      <div className="h-[80px] text-center text-[36px] font-bold">
        <h3>{titleCard}</h3>
      </div>
    </div>
  );
};

export default CardSkills;
