"use client";

import { useMemo } from "react";

interface Props {
  activeQuestion: number;
}

const ReadingPassagePanel = ({ activeQuestion }: Props) => {
  // Dummy data - akan diganti dengan data dari API
  const passageText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`;

  // Dummy highlights - akan diganti dengan data dari breakdown
  const highlights = useMemo(() => {
    if (activeQuestion === 1) {
      return [
        { start: 0, end: 58, color: "#EE47FF" }, // Purple
        { start: 200, end: 230, color: "#0F68DC" }, // Blue
        { start: 350, end: 400, color: "#50BFA5" }, // Green
      ];
    }
    return [];
  }, [activeQuestion]);

  const renderTextWithHighlights = () => {
    if (highlights.length === 0) {
      return (
        <p className="text-base leading-relaxed font-normal">{passageText}</p>
      );
    }

    const parts: Array<{ text: string; color?: string }> = [];
    let lastIndex = 0;

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        parts.push({ text: passageText.slice(lastIndex, highlight.start) });
      }
      // Add highlighted text
      parts.push({
        text: passageText.slice(highlight.start, highlight.end),
        color: highlight.color,
      });
      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < passageText.length) {
      parts.push({ text: passageText.slice(lastIndex) });
    }

    return (
      <p className="text-base leading-relaxed font-normal">
        {parts.map((part, index) => (
          <span
            key={index}
            style={part.color ? { backgroundColor: part.color } : {}}
            className={part.color ? "rounded px-1" : ""}
          >
            {part.text}
          </span>
        ))}
      </p>
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 rounded-[30px] bg-[#333333] p-[37px]">
      <h1 className="text-[22px] font-medium text-white">Reading Title</h1>
      <div className="flex-1 overflow-y-auto">{renderTextWithHighlights()}</div>
    </div>
  );
};

export default ReadingPassagePanel;
