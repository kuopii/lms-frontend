"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionType } from "@/types/test";
import { AlignLeft, Plus, ShieldQuestionMark, Sparkle } from "lucide-react";
import React, { useState } from "react";
import { BiSolidImage } from "react-icons/bi";
import { TbSection } from "react-icons/tb";
import QuestionImage from "./question-image";

interface ToolbarProps {
  onAddQuestion: () => void;
  onAddPassage: () => void;
  onAddQustionGroup?: (questionType: QuestionType) => void;
  isActive?: boolean;
  variant?: "reading" | "listening";
}

const Toolbar = ({
  onAddQuestion,
  onAddPassage,
  isActive = false,
  onAddQustionGroup,
  variant = "reading",
}: ToolbarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!isActive) return null;

  const handleToolbarClick = (e: React.MouseEvent) => {
    // Prevent click dari bubbling ke parent (question container)
    e.stopPropagation();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <div
      className="absolute top-1/2 -right-4 z-10 flex -translate-y-1/2 flex-col gap-4.5 rounded-full bg-[#E0E9D8] px-1.5 py-4 shadow-lg md:-right-8 md:px-2.5"
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
              onAddQustionGroup?.("choose_correct_answer");
            }}
          >
            <ShieldQuestionMark />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Add Question Instruction</p>
        </TooltipContent>
      </Tooltip>

      <Dialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        modal={true}
      >
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

        <QuestionImage
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onDialogOpenChange={handleDialogOpenChange}
        />
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
            {variant === "reading" ? <AlignLeft /> : <TbSection />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Add {variant === "reading" ? "Passage" : "Section"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
