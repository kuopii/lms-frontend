"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GrSelect } from "react-icons/gr";

export const BlankActions: React.FC<{
  selectedText: string;
  onMarkAsBlank: () => void;
  className?: string;
}> = ({ selectedText, className, onMarkAsBlank }) => (
  <div
    className={cn(
      "flex w-full items-center justify-between gap-4 md:w-fit",
      className,
    )}
  >
    <Button
      size="xs"
      onClick={onMarkAsBlank}
      className="rounded-3xl [&_svg:not([class*='size-'])]:size-5"
      type="button"
      aria-label="Mark selected text as blank"
      disabled={!selectedText.trim()}
    >
      <GrSelect />
      Mark as Blank
    </Button>
    {selectedText && (
      <span className="text-sm text-gray-300">
        Selected: &quot;{selectedText}&quot;
      </span>
    )}
  </div>
);
