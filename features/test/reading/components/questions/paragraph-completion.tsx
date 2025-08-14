"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import QuestionHeader from "../question-header";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { GrSelect } from "react-icons/gr";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import OptionFieldArray from "../options-field-array";
import { AnswerKeyField } from "../answer-key-field";

type ParagraphCompletionProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
};

const ParagraphCompletion = ({
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: ParagraphCompletionProps) => {
  const { control, watch, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);

  const optionsPath = `${questionsPath}.${qIndex}.options`;
  const typePath = `${questionsPath}.${qIndex}.type`;
  const paragraphPath = `${questionsPath}.${qIndex}.paragraph`;
  const answerKeyPath = `${questionsPath}.${qIndex}.answerKey`;

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  // Watch current values with proper memoization
  const watchedParagraph = watch(paragraphPath);
  const watchedOptions = watch(optionsPath);
  const watchedAnswerKey = watch(answerKeyPath);

  const currentParagraph = useMemo(
    () => watchedParagraph || "",
    [watchedParagraph],
  );

  // Get blank count from paragraph
  const blankCount = useMemo(() => {
    const matches = currentParagraph.match(/__\d+__/g);
    return matches ? matches.length : 0;
  }, [currentParagraph]);

  const canRemoveQuestion = useMemo(
    () => questionFields.length > 0,
    [questionFields.length],
  );

  // Handle text selection in textarea
  const handleTextSelection = useCallback(() => {
    if (!textareaRef.current) return;

    const paragraph = watchedParagraph || "";
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = paragraph.substring(start, end);

    if (selected.trim()) {
      setSelectedText(selected);
      setSelectionStart(start);
      setSelectionEnd(end);
    } else {
      setSelectedText("");
    }
  }, [watchedParagraph]);

  // Mark selected text as blank
  const markAsBlank = useCallback(() => {
    if (!selectedText.trim()) {
      alert("Please select text to mark as blank");
      return;
    }

    const paragraph = watchedParagraph || "";
    const options = watchedOptions || [];
    const answerKey = watchedAnswerKey || [];

    // Check if selection is still valid (user might have moved cursor)
    const currentSelection = paragraph.substring(selectionStart, selectionEnd);
    if (currentSelection !== selectedText) {
      alert("Selection has changed. Please select the text again.");
      setSelectedText("");
      return;
    }

    const blankNumber = blankCount + 1;
    const blankPlaceholder = `__${blankNumber}__`;

    // Use exact position-based replacement to avoid issues with duplicate words
    const newParagraph =
      paragraph.substring(0, selectionStart) +
      blankPlaceholder +
      paragraph.substring(selectionEnd);

    // Update paragraph
    setValue(paragraphPath, newParagraph);

    // Add selected text to options
    const newOptions = [...options];
    // Remove default placeholder if it exists
    if (
      newOptions.length === 1 &&
      newOptions[0] === "Type the suggested answers here..."
    ) {
      newOptions[0] = selectedText.trim();
    } else {
      // Check if this exact text is already in options to avoid duplicates
      if (!newOptions.includes(selectedText.trim())) {
        newOptions.push(selectedText.trim());
      }
    }
    setValue(optionsPath, newOptions);

    // Extend answerKey array if needed
    const newAnswerKey = [...answerKey];
    while (newAnswerKey.length < blankNumber) {
      newAnswerKey.push("");
    }
    setValue(answerKeyPath, newAnswerKey);

    // Clear selection
    setSelectedText("");
    setSelectionStart(0);
    setSelectionEnd(0);

    // Clear textarea selection
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(0, 0);
    }
  }, [
    selectedText,
    selectionStart,
    selectionEnd,
    watchedParagraph,
    watchedOptions,
    watchedAnswerKey,
    blankCount,
    setValue,
    paragraphPath,
    optionsPath,
    answerKeyPath,
  ]);

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

  // Get valid options for answer key (filter out empty and placeholder)
  const validAnswerOptions = useMemo(() => {
    const options = watchedOptions || [];
    return options.filter(
      (option: string) =>
        option &&
        option.trim() &&
        option !== "Type the suggested answers here...",
    );
  }, [watchedOptions]);

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          withNumber={false}
          typePath={typePath}
        />

        <FormField
          control={control}
          name={paragraphPath}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  {...field}
                  ref={textareaRef}
                  className="min-h-64"
                  variant="underline"
                  placeholder="Type a sentence here, then select the word you want to make blank..."
                  onSelect={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="xs"
              onClick={markAsBlank}
              className="rounded-3xl [&_svg:not([class*='size-'])]:size-5"
              type="button"
              aria-label="Mark selected text as blank"
              disabled={!selectedText.trim()}
            >
              <GrSelect />
              Mark as Blank
            </Button>
            {selectedText && (
              <span className="text-sm text-gray-400">
                Selected: &quot;{selectedText}&quot;
              </span>
            )}
          </div>
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

      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <h4 className="text-lg font-medium text-white">
          Add Suggested Answer for Paragraph Completion
        </h4>

        <OptionFieldArray
          questionsPath={optionsPath}
          inputVariant="underline"
        />
      </div>

      {blankCount > 0 && (
        <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
          <h4 className="text-lg font-medium text-white">
            Correct Answer for Each Blank
          </h4>

          <div className="space-y-4">
            {Array.from({ length: blankCount }, (_, index) => (
              <div key={index} className="flex items-center gap-4">
                <label className="mr-2 min-w-10 border-r text-white">
                  {index + 1}
                </label>
                <AnswerKeyField
                  name={`${answerKeyPath}.${index}`}
                  variant="single"
                  options={validAnswerOptions}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <QuestionBreakdown name={`${questionsPath}.${qIndex}.breakdown`} />
    </div>
  );
};

export default ParagraphCompletion;
