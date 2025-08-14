"use client";

import React, { memo, useCallback, useMemo, useRef } from "react";
import QuestionHeader from "../question-header";
import { Separator } from "@/components/ui/separator";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { PiCopyFill } from "react-icons/pi";
import { GrSelect } from "react-icons/gr";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MIN_ITEMS = 1;
const BLANK_PLACEHOLDER = "____";

const validateSelection = (
  start: number | null,
  end: number | null,
): boolean => {
  return start !== null && end !== null && start !== end;
};

const createBlankFromSelection = (
  text: string,
  start: number,
  end: number,
): { updatedText: string; selectedText: string } => {
  const selectedText = text.substring(start, end).trim();
  const updatedText =
    text.substring(0, start) + BLANK_PLACEHOLDER + text.substring(end);

  return { updatedText, selectedText };
};

const restoreTextFromBlank = (question: string, answerKey: string): string => {
  return question.replace(BLANK_PLACEHOLDER, answerKey);
};

type SentenceCompletionProps = {
  questionsPath: string;
  qIndex: number;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
};

const SentenceCompletion = ({
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: SentenceCompletionProps) => {
  const { control, watch, setValue } = useFormContext();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const itemsPath = useMemo(
    () => `${questionsPath}.${qIndex}.items`,
    [questionsPath, qIndex],
  );

  const typePathMemo = useMemo(
    () => `${questionsPath}.${qIndex}.type`,
    [questionsPath, qIndex],
  );

  const breakdownPathMemo = useMemo(
    () => `${questionsPath}.${qIndex}.breakdown`,
    [questionsPath, qIndex],
  );

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: itemsPath,
  });

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const canRemoveItems = useMemo(
    () => itemFields.length > MIN_ITEMS,
    [itemFields.length],
  );

  const canRemoveQuestion = useMemo(
    () => questionFields.length > 0,
    [questionFields.length],
  );

  // Watch all answer keys at once to prevent multiple watch calls
  const allAnswerKeys = watch(
    itemFields.map((_, index) => `${itemsPath}.${index}.answerKey`),
  );

  const markAsBlank = useCallback(
    (itemIndex: number) => {
      const inputElement = inputRefs.current[itemIndex];
      if (!inputElement) return;

      const start = inputElement.selectionStart;
      const end = inputElement.selectionEnd;

      if (!validateSelection(start, end)) {
        alert("Please select the text you want to make blank first");
        return;
      }

      const fieldPath = `${itemsPath}.${itemIndex}`;
      const currentQuestion = watch(`${fieldPath}.question`);
      const answerKey = watch(`${fieldPath}.answerKey`);

      try {
        // Restore original text if there's already a blank
        const baseText = answerKey
          ? restoreTextFromBlank(currentQuestion, answerKey)
          : currentQuestion;

        const { updatedText, selectedText } = createBlankFromSelection(
          baseText,
          start as number,
          end as number,
        );

        if (!selectedText) {
          alert("The selected text is invalid");
          return;
        }

        setValue(`${fieldPath}.question`, updatedText);
        setValue(`${fieldPath}.answerKey`, selectedText);

        // Reset selection and blur input
        inputElement.setSelectionRange(0, 0);
        inputElement.blur();
      } catch (error) {
        console.error("Error marking text as blank:", error);
        alert("An error occurred while marking text as blank");
      }
    },
    [itemsPath, watch, setValue],
  );

  const resetItem = useCallback(
    (itemIndex: number) => {
      const fieldPath = `${itemsPath}.${itemIndex}`;
      const currentQuestion = watch(`${fieldPath}.question`);
      const answerKey = watch(`${fieldPath}.answerKey`);

      if (!answerKey) return;

      try {
        const restoredText = restoreTextFromBlank(currentQuestion, answerKey);
        setValue(`${fieldPath}.question`, restoredText);
        setValue(`${fieldPath}.answerKey`, "");
      } catch (error) {
        console.error("Error resetting item:", error);
      }
    },
    [itemsPath, watch, setValue],
  );

  const handleAddItem = useCallback(() => {
    appendItem({ question: "", answerKey: "" });
  }, [appendItem]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      removeItem(index);
    },
    [removeItem],
  );

  const handleDuplicateQuestion = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDuplicateQuestion?.(qIndex);
    },
    [onDuplicateQuestion, qIndex],
  );

  const handleRemoveQuestion = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemoveQuestion?.(qIndex);
    },
    [onRemoveQuestion, qIndex],
  );

  // Memoized ref setter to prevent recreating on every render
  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          withNumber={false}
          typePath={typePathMemo}
        />

        {itemFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-4 rounded-xl border border-white/30 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <FormField
                control={control}
                name={`${itemsPath}.${index}.question`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        variant="underline"
                        ref={setInputRef(index)}
                        placeholder="Type a sentence here, then select the word you want to make blank..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => handleRemoveItem(index)}
                disabled={!canRemoveItems}
                className="[&_svg:not([class*='size-'])]:size-5"
                aria-label="Remove sentence"
              >
                <RiDeleteBack2Fill />
              </Button>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Button
                size="xs"
                onClick={() => markAsBlank(index)}
                className="rounded-3xl [&_svg:not([class*='size-'])]:size-5"
                type="button"
                aria-label="Mark selected text as blank"
              >
                <GrSelect />
                Mark as Blank
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => resetItem(index)}
                  size="icon"
                  variant="ghost"
                  className="mr-2"
                  disabled={!allAnswerKeys[index]}
                  aria-label="Reset sentence"
                >
                  <RotateCcw />
                </Button>
                <span className="text-sm text-white/70">Answer:</span>
                <Badge
                  className="bg-white/10 text-white"
                  size="lg"
                  aria-label={`Answer: ${allAnswerKeys[index] || "Not set"}`}
                >
                  {allAnswerKeys[index] || "-"}
                </Badge>
              </div>
            </div>
          </div>
        ))}

        <Separator />

        <div className="flex items-center justify-between gap-4 md:flex-row">
          <Button
            type="button"
            size="xsm"
            onClick={handleAddItem}
            variant="outline"
            aria-label="Add new sentence"
          >
            <Plus />
            Add Sentence
          </Button>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              size="iconSm"
              variant="ghost"
              onClick={handleDuplicateQuestion}
              className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
              aria-label="Duplicate question"
            >
              <PiCopyFill />
            </Button>

            <Button
              size="iconSm"
              type="button"
              variant="ghost"
              onClick={handleRemoveQuestion}
              disabled={!canRemoveQuestion}
              className="text-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5"
              aria-label="Remove question"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </div>

      <QuestionBreakdown name={breakdownPathMemo} />
    </div>
  );
};

export default memo(SentenceCompletion);
