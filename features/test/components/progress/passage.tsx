interface Props {
  totalPassages?: number;
  activePassage?: number;
}

const PassageProgress = ({ totalPassages = 1, activePassage = 1 }: Props) => {
  return (
    <div className="rounded-[15px] border px-[10px] py-[5px]">
      <h1>Passage {activePassage}</h1>
      <div>
        <span>
          {activePassage}/{totalPassages}
        </span>
        <span>-</span>
      </div>
    </div>
  );
};

export default PassageProgress;
