"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import QuestionHeader from "../question-header";
import QuestionBreakdown from "../question-breakdown";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GrSelect } from "react-icons/gr";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";

type AnswerKeyItem = {
  number: string;
  answer: string;
};

type BlankInText = {
  match: string;
  number: number;
  index: number;
  endIndex: number;
};

type NoteCompletionProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
};

const NoteCompletion = ({
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: NoteCompletionProps) => {
  const { control, watch, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);

  const typePath = `${questionsPath}.${qIndex}.type`;
  const paragraphPath = `${questionsPath}.${qIndex}.paragraph`;
  const answerKeyPath = `${questionsPath}.${qIndex}.answerKey`;

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const { fields: answerKeyFields } = useFieldArray({
    control,
    name: answerKeyPath,
  });

  const watchedParagraph = watch(paragraphPath) as string;
  const watchedAnswerKey = watch(answerKeyPath) as AnswerKeyItem[];

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

  const reorderBlanksInParagraph = useCallback(
    (paragraph: string, answerKey: AnswerKeyItem[]) => {
      // Find all blanks and their positions in the paragraph
      const blankPattern = /__(\d+)__/g;
      const blanksInText: BlankInText[] = [];

      let match;
      while ((match = blankPattern.exec(paragraph)) !== null) {
        blanksInText.push({
          match: match[0],
          number: parseInt(match[1]),
          index: match.index,
          endIndex: match.index + match[0].length,
        });
      }

      // Sort blanks by their position in text (left to right)
      blanksInText.sort((a, b) => a.index - b.index);

      // Create mapping from old number to new number based on position
      const numberMapping: Record<number, number> = {};
      blanksInText.forEach((blank, index) => {
        const newNumber = index + 1;
        numberMapping[blank.number] = newNumber;
      });

      // Update paragraph with new sequential numbers
      let updatedParagraph = paragraph;
      // Replace from right to left to avoid index shifting issues
      for (let i = blanksInText.length - 1; i >= 0; i--) {
        const blank = blanksInText[i];
        const newNumber = numberMapping[blank.number];
        updatedParagraph =
          updatedParagraph.substring(0, blank.index) +
          `__${newNumber}__` +
          updatedParagraph.substring(blank.endIndex);
      }

      // Update answer key with new numbers and sort by position
      const newAnswerKey = answerKey.map((item) => ({
        ...item,
        number: (
          numberMapping[parseInt(item.number)] || parseInt(item.number)
        ).toString(),
      }));

      // Sort answer key by number
      newAnswerKey.sort((a, b) => parseInt(a.number) - parseInt(b.number));

      return { updatedParagraph, newAnswerKey };
    },
    [],
  );

  const markAsBlank = useCallback(() => {
    if (!selectedText.trim() || !textareaRef.current) return;

    const currentParagraph = watchedParagraph || "";
    const currentAnswerKey = watchedAnswerKey || [];

    // Create new paragraph with the selected text replaced by a temporary placeholder
    const beforeSelection = currentParagraph.substring(0, selectionStart);
    const afterSelection = currentParagraph.substring(selectionEnd);
    const tempParagraph = beforeSelection + "___TEMP___" + afterSelection;

    // Check if this is the first blank and default answer key exists but is empty
    let newAnswerKey: AnswerKeyItem[];

    if (
      currentAnswerKey.length === 1 &&
      currentAnswerKey[0].number === "1" &&
      currentAnswerKey[0].answer === "" &&
      !currentParagraph.includes("__1__")
    ) {
      // This is the first blank, use the existing default item
      newAnswerKey = [
        {
          number: "999", // Temporary number, will be reordered
          answer: selectedText.trim(),
        },
      ];
    } else {
      // Add new answer key item to existing ones
      newAnswerKey = [
        ...currentAnswerKey,
        {
          number: "999", // Temporary number, will be reordered
          answer: selectedText.trim(),
        },
      ];
    }

    // Replace temp placeholder with actual blank
    const paragraphWithNewBlank = tempParagraph.replace(
      "___TEMP___",
      "__999__",
    );

    // Reorder all blanks
    const { updatedParagraph, newAnswerKey: reorderedAnswerKey } =
      reorderBlanksInParagraph(paragraphWithNewBlank, newAnswerKey);

    // Update form values
    setValue(paragraphPath, updatedParagraph);
    setValue(answerKeyPath, reorderedAnswerKey);

    // Clear selection
    setSelectedText("");

    // Focus back to textarea and clear selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(0, 0);
      }
    }, 0);
  }, [
    selectedText,
    selectionStart,
    selectionEnd,
    watchedParagraph,
    watchedAnswerKey,
    setValue,
    paragraphPath,
    answerKeyPath,
    reorderBlanksInParagraph,
  ]);

  const removeBlank = useCallback(
    (indexToRemove: number) => {
      const currentParagraph = watchedParagraph || "";
      const currentAnswerKey = watchedAnswerKey || [];

      if (indexToRemove < 0 || indexToRemove >= currentAnswerKey.length) return;

      const itemToRemove = currentAnswerKey[indexToRemove];
      const numberToRemove = itemToRemove.number;

      // Remove the blank from paragraph
      const blankPattern = new RegExp(`__${numberToRemove}__`, "g");
      const paragraphWithoutBlank = currentParagraph.replace(
        blankPattern,
        itemToRemove.answer,
      );

      // Remove from answer key
      const newAnswerKey = currentAnswerKey.filter(
        (_, index) => index !== indexToRemove,
      );

      // Reorder remaining blanks
      const { updatedParagraph, newAnswerKey: reorderedAnswerKey } =
        reorderBlanksInParagraph(paragraphWithoutBlank, newAnswerKey);

      // Update form values
      setValue(paragraphPath, updatedParagraph);
      setValue(answerKeyPath, reorderedAnswerKey);
    },
    [
      watchedParagraph,
      watchedAnswerKey,
      setValue,
      paragraphPath,
      answerKeyPath,
      reorderBlanksInParagraph,
    ],
  );

  const canRemoveQuestion = useMemo(
    () => questionFields.length > 1,
    [questionFields.length],
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
                  variant="default"
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

        <Separator />

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
              <span className="text-sm">
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

      {/* Answer Key Section */}
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <h4 className="text-lg font-medium text-white">
          Correct Words for Each Blank
        </h4>

        {answerKeyFields.length === 0 ? (
          <p className="my-10 text-center text-sm">
            No blanks created yet. Select text in the paragraph above and click
            &quot;Mark as Blank&quot; to create answer keys.
          </p>
        ) : (
          <div className="space-y-4">
            {answerKeyFields.map((field, index) => {
              const typedField = field as AnswerKeyItem & { id: string };

              return (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="min-w-8 border-r text-sm font-medium text-white">
                      {typedField.number}
                    </span>
                  </div>

                  <FormField
                    control={control}
                    name={`${answerKeyPath}.${index}.answer`}
                    render={({ field: answerField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...answerField}
                            variant="underline"
                            className="bg-[#2a2a2a] text-white"
                            placeholder="Enter the correct answer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    size="iconSm"
                    variant="ghost"
                    onClick={() => removeBlank(index)}
                    className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-4"
                    aria-label={`Remove blank ${typedField.number}`}
                  >
                    <FaTrash />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuestionBreakdown
        questionsPath={`${questionsPath}.${qIndex}.breakdown`}
      />
    </div>
  );
};

export default NoteCompletion;
