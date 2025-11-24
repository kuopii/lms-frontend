interface PassageResultsProps {
  passageNumber: number;
  range: string;
}

const PassageResults = ({ passageNumber, range }: PassageResultsProps) => {
  return (
    <div className="flex w-fit flex-col items-center justify-center gap-1 rounded-[15px] border border-white px-[15px] py-[5px] text-white">
      <span className="text-[22px] font-medium">Passage {passageNumber}</span>
      <span className="text-normal text-sm">{range}</span>
    </div>
  );
};

export default PassageResults;
