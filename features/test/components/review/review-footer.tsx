"use client";

import { IoBook } from "react-icons/io5";
import PassageProgress from "../progress/passage";

interface Props {
  totalPassages: number;
  activePassage: number;
}

const ReviewFooter = ({ totalPassages, activePassage }: Props) => {
  return (
    <footer className="p-4 pb-10">
      <div className="container mx-auto flex items-center justify-between">
        {/* Passage Navigation */}
        <PassageProgress
          totalPassages={totalPassages}
          activePassage={activePassage}
        />

        {/* Vocabulary Button */}
        <button className="flex items-center gap-3 rounded-[30px] bg-[#7A9D58] px-6 py-3 text-white transition-colors hover:bg-[#6a8d48]">
          <IoBook size={20} />
          <span className="font-medium">Vocabulary</span>
        </button>
      </div>
    </footer>
  );
};

export default ReviewFooter;
