"use client";

import React from "react";
import { BiSolidImage } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AlignLeft, Plus, ShieldQuestionMark, Sparkle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ToolbarProps {
  onAddQuestion: () => void;
  onAddPassage: () => void;
  onAddQustionGroup?: () => void;
  isActive?: boolean;
}

const Toolbar = ({
  onAddQuestion,
  onAddPassage,
  isActive = false,
  onAddQustionGroup,
}: ToolbarProps) => {
  if (!isActive) return null;

  const handleToolbarClick = (e: React.MouseEvent) => {
    // Prevent click dari bubbling ke parent (question container)
    e.stopPropagation();
  };

  return (
    <div
      className="absolute top-1/2 -right-4 z-0 flex -translate-y-1/2 flex-col gap-4.5 rounded-full bg-[#E0E9D8] px-1.5 py-4 shadow-lg md:-right-8 md:px-2.5"
      data-toolbar="true"
      onClick={handleToolbarClick}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            type="button"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddQuestion();
            }}
          >
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Add Question</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size={"icon"}
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // Handle generate question logic here
            }}
          >
            <Sparkle />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Generate Question</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size={"icon"}
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddQustionGroup?.();
            }}
          >
            <ShieldQuestionMark />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Add Question Instruction</p>
        </TooltipContent>
      </Tooltip>

      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <BiSolidImage />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Add Picture</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent>{/* Isi dialog di sini */}</DialogContent>
      </Dialog>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            type="button"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddPassage();
            }}
          >
            <AlignLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Add Passage</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
