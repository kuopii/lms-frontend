"use client";

import React, { useCallback, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { GrSelect } from "react-icons/gr";
import { FaTrash } from "react-icons/fa6";
import { PiCopyFill } from "react-icons/pi";
import QuestionHeader from "../question-header";
import PointsField from "../points-field";
import QuestionBreakdown from "../question-breakdown";
import { extractIndexes } from "@/helpers/extract-indexes";
import { Option } from "@/types/test";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { ImagePreview } from "../question-image";

interface BlankInText {
  match: string;
  number: number;
  index: number;
  endIndex: number;
  originalText: string; // Add this to track original text
}

interface NoteCompletionProps {
  qIndex: number;
  questionsPath: string;
  globalNumber: number;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
}

const NoteCompletion: React.FC<NoteCompletionProps> = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}) => {
  const { control, watch, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Selection state
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);

  // Paths
  const questionPath = `${questionsPath}.${qIndex}`;
  const correctAnswerPath = `${questionPath}.correct_answer`;

  // Field arrays
  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });
  const { fields: correctAnswerFields } = useFieldArray({
    control,
    name: correctAnswerPath,
  });

  // Extract indexes
  const { nestIndex, questionGroupIndex } = extractIndexes(questionsPath);

  // Watch values
  const watchedQuestionText = watch(`${questionPath}.question_text`) as string;
  const watchedCorrectAnswer = watch(correctAnswerPath) as Option[];

  // Helper function to find blanks in text with their original text
  const findBlanksInText = useCallback(
    (paragraph: string, answerKey: Option[]): BlankInText[] => {
      const blankPattern = /__(\d+)__/g;
      const blanksInText: BlankInText[] = [];
      let match;

      while ((match = blankPattern.exec(paragraph)) !== null) {
        const number = parseInt(match[1]);
        const answerItem = answerKey.find(
          (item) => parseInt(item.option_key) === number,
        );

        blanksInText.push({
          match: match[0],
          number: number,
          index: match.index,
          endIndex: match.index + match[0].length,
          originalText: answerItem?.option_text || "",
        });
      }

      return blanksInText.sort((a, b) => a.index - b.index);
    },
    [],
  );

  // Helper function to create number mapping
  const createNumberMapping = useCallback(
    (blanks: BlankInText[]): Record<number, number> => {
      const mapping: Record<number, number> = {};
      blanks.forEach((blank, index) => {
        mapping[blank.number] = index + 1;
      });
      return mapping;
    },
    [],
  );

  // Helper function to update paragraph with new numbers
  const updateParagraphNumbers = useCallback(
    (
      paragraph: string,
      blanks: BlankInText[],
      mapping: Record<number, number>,
    ): string => {
      let updatedParagraph = paragraph;

      // Replace from right to left to avoid index shifting
      for (let i = blanks.length - 1; i >= 0; i--) {
        const blank = blanks[i];
        const newNumber = mapping[blank.number];
        updatedParagraph =
          updatedParagraph.substring(0, blank.index) +
          `__${newNumber}__` +
          updatedParagraph.substring(blank.endIndex);
      }

      return updatedParagraph;
    },
    [],
  );

  // Main function to reorder blanks
  const reorderBlanksInParagraph = useCallback(
    (paragraph: string, answerKey: Option[]) => {
      const blanksInText = findBlanksInText(paragraph, answerKey);
      const numberMapping = createNumberMapping(blanksInText);
      const updatedParagraph = updateParagraphNumbers(
        paragraph,
        blanksInText,
        numberMapping,
      );

      // Create new answer key based on the order of blanks in the paragraph
      const newAnswerKey: Option[] = blanksInText.map((blank, index) => ({
        option_key: (index + 1).toString(),
        option_text: blank.originalText,
      }));

      return { updatedParagraph, newAnswerKey };
    },
    [findBlanksInText, createNumberMapping, updateParagraphNumbers],
  );

  // Handle text selection
  const handleTextSelection = useCallback(() => {
    if (!textareaRef.current) return;

    const questionText = watchedQuestionText || "";
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = questionText.substring(start, end);

    if (selected.trim()) {
      setSelectedText(selected);
      setSelectionStart(start);
      setSelectionEnd(end);
    } else {
      setSelectedText("");
    }
  }, [watchedQuestionText]);

  // Create new answer key based on current state
  const createNewAnswerKey = useCallback(
    (
      currentAnswer: Option[],
      selectedText: string,
      questionText: string,
    ): Option[] => {
      const isFirstBlankAndEmpty =
        currentAnswer.length === 1 &&
        currentAnswer[0].option_key === "1" &&
        currentAnswer[0].option_text === "" &&
        !questionText.includes("__1__");

      if (isFirstBlankAndEmpty) {
        return [
          {
            option_key: "999", // Temporary, will be reordered
            option_text: selectedText.trim(),
          },
        ];
      } else {
        return [
          ...currentAnswer,
          {
            option_key: "999", // Temporary, will be reordered
            option_text: selectedText.trim(),
          },
        ];
      }
    },
    [],
  );

  // Mark selected text as blank
  const markAsBlank = useCallback(() => {
    if (!selectedText.trim() || !textareaRef.current) return;

    const currentQuestionText = watchedQuestionText || "";
    const currentCorrectAnswer = watchedCorrectAnswer || [];

    // Replace selected text with temporary placeholder
    const beforeSelection = currentQuestionText.substring(0, selectionStart);
    const afterSelection = currentQuestionText.substring(selectionEnd);
    const tempParagraph = beforeSelection + "___TEMP___" + afterSelection;

    // Create new answer key
    const newAnswerKey = createNewAnswerKey(
      currentCorrectAnswer,
      selectedText,
      currentQuestionText,
    );

    // Replace temp placeholder with actual blank
    const paragraphWithNewBlank = tempParagraph.replace(
      "___TEMP___",
      "__999__",
    );

    // Reorder all blanks
    const { updatedParagraph, newAnswerKey: reorderedAnswerKey } =
      reorderBlanksInParagraph(paragraphWithNewBlank, newAnswerKey);

    // Update form values
    setValue(`${questionPath}.question_text`, updatedParagraph);
    setValue(correctAnswerPath, reorderedAnswerKey);

    // Clear selection and focus
    setSelectedText("");
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
    watchedQuestionText,
    watchedCorrectAnswer,
    setValue,
    correctAnswerPath,
    reorderBlanksInParagraph,
    questionPath,
    createNewAnswerKey,
  ]);

  // Remove a blank from the paragraph and answer key
  const removeBlank = useCallback(
    (indexToRemove: number) => {
      const currentQuestionText = watchedQuestionText || "";
      const currentCorrectAnswer = watchedCorrectAnswer || [];

      if (indexToRemove < 0 || indexToRemove >= currentCorrectAnswer.length)
        return;

      const itemToRemove = currentCorrectAnswer[indexToRemove];
      const numberToRemove = itemToRemove.option_key;

      // Remove blank from paragraph (replace with original text)
      const blankPattern = new RegExp(`__${numberToRemove}__`, "g");
      const paragraphWithoutBlank = currentQuestionText.replace(
        blankPattern,
        itemToRemove.option_text, // Use the answer text as replacement
      );

      // Remove from answer key
      const newAnswerKey = currentCorrectAnswer.filter(
        (_, index) => index !== indexToRemove,
      );

      // Reorder remaining blanks
      const { updatedParagraph, newAnswerKey: reorderedAnswerKey } =
        reorderBlanksInParagraph(paragraphWithoutBlank, newAnswerKey);

      // Update form values
      setValue(`${questionPath}.question_text`, updatedParagraph);
      setValue(correctAnswerPath, reorderedAnswerKey);
    },
    [
      watchedCorrectAnswer,
      watchedQuestionText,
      setValue,
      reorderBlanksInParagraph,
      questionPath,
      correctAnswerPath,
    ],
  );

  // Check if question can be removed
  const canRemoveQuestion = questionFields.length > 0;

  const currentImages = watch(`${questionPath}.question_data.images`);

  return (
    <div className="space-y-6">
      {/* Question Text Section */}
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          questionsPath={`${questionPath}.question_text`}
          variant="tips"
          typePath={`${questionPath}.question_type`}
          nestIndex={nestIndex}
          groupIndex={questionGroupIndex}
          globalNumber={globalNumber}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={currentImages}
            showActions={false}
            containerClassName="grid-cols-3 md:grid-cols-4"
          />
        </div>

        <FormField
          control={control}
          name={`${questionPath}.question_text`}
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

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
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
              <span className="text-sm text-gray-300">
                Selected: &quot;{selectedText}&quot;
              </span>
            )}
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
            <PointsField questionPath={questionPath} />

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="iconSm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateQuestion?.(qIndex);
                }}
                className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
                aria-label="Duplicate question"
              >
                <PiCopyFill />
              </Button>

              <Button
                size="iconSm"
                type="button"
                variant="ghost"
                onClick={
                  canRemoveQuestion
                    ? (e) => {
                        e.stopPropagation();
                        onRemoveQuestion?.(qIndex);
                      }
                    : undefined
                }
                disabled={!canRemoveQuestion}
                className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
                aria-label="Remove question"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Correct Answer Section */}
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <h4 className="text-lg font-medium text-white">
          Correct Words for Each Blank
        </h4>

        {correctAnswerFields.length === 0 ? (
          <p className="my-12 text-center text-sm text-gray-300">
            No blanks created yet. Select text in the paragraph above and click
            &quot;Mark as Blank&quot; to create answer keys.
          </p>
        ) : (
          <div className="space-y-6">
            {correctAnswerFields.map((field, index) => {
              const typedField = field as Option & { id: string };

              return (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge size={"icon"}>{typedField.option_key}</Badge>
                  </div>

                  <FormField
                    control={control}
                    name={`${correctAnswerPath}.${index}.option_text`}
                    render={({ field: answerField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...answerField}
                            variant="underline"
                            className="text-white"
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
                    className="[&_svg:not([class*='size-'])]:size-5"
                    aria-label={`Remove blank ${typedField.option_key}`}
                  >
                    <RiDeleteBack2Fill />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuestionBreakdown breakdownPath={`${questionPath}.breakdown`} />
    </div>
  );
};

export default NoteCompletion;
