"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import SortableItem from "@/components/ui/sortable-item";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToolbarStore } from "@/store/toolbar-store";
import React, { useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { MdDragIndicator } from "react-icons/md";
import { PiCopyFill } from "react-icons/pi";
import { ImagePreview } from "../components/question-image";
import Toolbar from "../components/toolbar";

type QuestionFieldProps = {
  question: { id: string };
  passageIndex: number;
  questionIndex: number;
  questionsPath: string;
  questionFieldsLength: number;
  onAddPassage: () => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (qIndex: number) => void;
  onDuplicateQuestion: (qIndex: number) => void;
};

export const QuestionField = ({
  question,
  passageIndex,
  questionIndex,
  questionsPath,
  questionFieldsLength,
  onAddQuestion,
  onAddPassage,
  onRemoveQuestion,
  onDuplicateQuestion,
}: QuestionFieldProps) => {
  const { control, watch } = useFormContext();
  const { activeQuestionId, setActiveQuestion, clearActive } =
    useToolbarStore();
  const isActive = question.id === activeQuestionId;

  const questionPath = `${questionsPath}.${questionIndex}`;

  const paths = useMemo(
    () => ({
      question_number: `${questionPath}.question_number`,
      question_text: `${questionPath}.question_text`,
      images: `${questionPath}.question_data.images`,
    }),
    [questionPath],
  );

  const handleQuestionClick = useCallback(
    (questionId: string, questionIndex: number, event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-toolbar="true"]')) return;

      setActiveQuestion(questionId, 0, passageIndex, questionIndex);
    },
    [setActiveQuestion, passageIndex],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isToolbarClick = target.closest('[data-toolbar="true"]');
      const isSelectClick =
        target.closest('[role="listbox"]') ||
        target.closest("[data-radix-select-content]") ||
        target.closest("[data-radix-popper-content-wrapper]");
      const isDialogClick =
        target.closest("[data-radix-dialog-content]") ||
        target.closest("[role='dialog']") ||
        target.closest(".dialog-content");

      // Don't clear active state if clicking on dialog, toolbar, select, or container
      if (!isToolbarClick && !isSelectClick && !isDialogClick) {
        clearActive();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearActive]);

  const currentImages = watch(paths.images);
  const questionNumber = watch(paths.question_number);

  const isDeleteDisabled = questionFieldsLength <= 1;

  return (
    <SortableItem id={question.id}>
      <div className="relative">
        <div
          className={cn(
            "relative space-y-6 rounded-3xl border bg-[#1A1A1A] px-4 pt-14 pb-6 transition-colors duration-200 md:px-5 lg:px-6",
            isActive ? "border-primary" : "border-transparent",
          )}
          onClick={(event) =>
            handleQuestionClick(question.id, questionIndex, event)
          }
        >
          <MdDragIndicator
            className="absolute top-2 left-1/2 -translate-x-1/2 rotate-90 hover:cursor-move"
            size={25}
          />

          {isActive && (
            <Toolbar
              isActive={isActive}
              onAddQuestion={onAddQuestion}
              onAddPassage={onAddPassage}
              variant="writing"
            />
          )}

          <div className="space-y-6">
            <div className="bg-primary rounded-2xl p-4">
              Task {questionNumber}
            </div>
            <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
              <div className="mx-auto max-w-md">
                <ImagePreview
                  images={currentImages}
                  showActions={false}
                  containerClassName="grid-cols-3 md:grid-cols-4"
                />
              </div>
              <FormField
                control={control}
                name={paths.question_text}
                render={({ field }) => (
                  <FormItem className="w-full gap-3">
                    <FormLabel>Text Question</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        variant="underline"
                        className="min-h-32"
                        placeholder="Type a question here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="iconSm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateQuestion(questionIndex);
                  }}
                  className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
                  title="Duplicate question"
                >
                  <PiCopyFill />
                </Button>
                <Button
                  type="button"
                  size="iconSm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveQuestion(questionIndex);
                  }}
                  disabled={isDeleteDisabled}
                  className="text-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5"
                  title={
                    isDeleteDisabled
                      ? "Cannot delete the last question"
                      : "Delete question"
                  }
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SortableItem>
  );
};
