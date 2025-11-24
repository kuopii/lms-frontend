import { IoMdVolumeHigh } from "react-icons/io";
import { FaBookmark } from "react-icons/fa6";

interface Props {
  vocab: string;
  spelling: string;
  type: string;
  explanation: string;
}

const VocabDetails = ({ vocab, spelling, type, explanation }: Props) => {
  const typeColors: Record<string, string> = {
    Adjective: "#EE47FF",
    Adverb: "#0F68DC",
    Noun: "#FFC107",
    Verb: "#50BFA5",
  };

  const color = typeColors[type] || "#AAAAAA";

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 items-center gap-8 rounded-[30px] bg-black px-[30px] py-4 lg:grid-cols-[1fr_3fr_auto]">
        <div className="flex flex-col gap-4">
          <span className="text-[22px] font-medium">{vocab}</span>
          <button className="flex items-center gap-3 text-base font-normal">
            <IoMdVolumeHigh size={24} />
            {spelling}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <span
              style={{ backgroundColor: color }}
              className="rounded-[15px] px-[15px] py-[5px] text-base font-normal"
            >
              {type}
            </span>
            <h1 className="text-[22px] font-medium">Translation</h1>
          </div>
          <p className="text-base font-normal">{explanation}</p>
        </div>

        <button className="text-primary ml-auto">
          <FaBookmark size={24} />
        </button>
      </div>
    </div>
  );
};

export default VocabDetails;
