"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle } from "lucide-react";
import { GrSelect } from "react-icons/gr";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";
import QuestionHeader from "../question-header";
import OptionFieldArray from "../options-field-array";
import QuestionBreakdown from "../question-breakdown";
import { ImagePreview } from "../question-image";
import PointsField from "../points-field";
import AnswerKeyField from "../answer-key-field";
import { Item, Option } from "@/types/test";
import { indexToLetter } from "@/helpers/index-to-letter";
import { shuffleArray } from "@/helpers/shuffle-array";

type ParagraphCompletionProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
};

interface BlankInText {
  match: string;
  number: number;
  index: number;
  endIndex: number;
  originalText: string;
}

export const ParagraphCompletion = ({
  qIndex,
  questionsPath,
  globalNumber,
  onDuplicateQuestion,
  onRemoveQuestion,
}: ParagraphCompletionProps) => {
  const { control, watch, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);

  const questionPath = `${questionsPath}.${qIndex}`;

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  // Memoized paths
  const paths = useMemo(
    () => ({
      questionText: `${questionPath}.question_text`,
      options: `${questionPath}.options`,
      items: `${questionPath}.items`,
      images: `${questionPath}.question_data.images`,
    }),
    [questionPath],
  );

  const currentImages = watch(paths.images);
  const watchedQuestionText = watch(paths.questionText) as string;
  const watchedOptions = watch(paths.options) as Option[];
  const watchedItems = watch(paths.items) as Item[];

  const { fields: itemFields, replace: replaceItems } = useFieldArray({
    control,
    name: paths.items,
  });

  // Helper function to find blanks in text with their original text
  const findBlanksInText = useCallback((paragraph: string): BlankInText[] => {
    const blankPattern = /__(\d+)\.(\d+)__/g;
    const blanksInText: BlankInText[] = [];
    let match;

    while ((match = blankPattern.exec(paragraph)) !== null) {
      const number = parseFloat(`${match[1]}.${match[2]}`);

      blanksInText.push({
        match: match[0],
        number: number,
        index: match.index,
        endIndex: match.index + match[0].length,
        originalText: "",
      });
    }

    return blanksInText.sort((a, b) => a.index - b.index);
  }, []);

  // Helper function to create number mapping
  const createNumberMapping = useCallback(
    (blanks: BlankInText[]): Record<number, string> => {
      const mapping: Record<number, string> = {};
      blanks.forEach((blank, index) => {
        mapping[blank.number] = `${globalNumber}.${index + 1}`;
      });
      return mapping;
    },
    [globalNumber],
  );

  // Helper function to update paragraph with new numbers
  const updateParagraphNumbers = useCallback(
    (
      paragraph: string,
      blanks: BlankInText[],
      mapping: Record<number, string>,
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
    (paragraph: string) => {
      const blanksInText = findBlanksInText(paragraph);
      const numberMapping = createNumberMapping(blanksInText);
      const updatedParagraph = updateParagraphNumbers(
        paragraph,
        blanksInText,
        numberMapping,
      );

      // Create new items based on the order of blanks in the paragraph
      const newItems: Item[] = blanksInText.map((blank, index) => {
        const existingItem = watchedItems?.find(
          (item) => Math.abs(item.question_number - blank.number) < 0.001,
        );

        return {
          question_number: parseFloat(`${globalNumber}.${index + 1}`),
          correct_answer: existingItem?.correct_answer || {
            option_key: "",
            option_text: "",
          },
        };
      });

      return { updatedParagraph, newItems };
    },
    [
      findBlanksInText,
      createNumberMapping,
      updateParagraphNumbers,
      globalNumber,
      watchedItems,
    ],
  );

  // Effect to handle globalNumber changes
  useEffect(() => {
    if (!watchedQuestionText || !watchedItems?.length) return;

    const currentBlanks = findBlanksInText(watchedQuestionText);
    if (currentBlanks.length === 0) return;

    // Check if any blank has different globalNumber than current
    const needsUpdate = currentBlanks.some((blank) => {
      const [currentGlobalNum] = blank.number.toString().split(".");
      return parseInt(currentGlobalNum) !== globalNumber;
    });

    if (needsUpdate) {
      const { updatedParagraph, newItems } =
        reorderBlanksInParagraph(watchedQuestionText);
      setValue(paths.questionText, updatedParagraph);
      replaceItems(newItems);
    }
  }, [
    globalNumber,
    watchedQuestionText,
    watchedItems,
    findBlanksInText,
    reorderBlanksInParagraph,
    setValue,
    paths.questionText,
    replaceItems,
  ]);

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

  // Create new options based on current state
  const createNewOptions = useCallback(
    (currentOptions: Option[], selectedText: string): Option[] => {
      const isFirstOptionAndEmpty =
        currentOptions.length === 1 &&
        currentOptions[0].option_key === "A" &&
        currentOptions[0].option_text === "Option 1";

      if (isFirstOptionAndEmpty) {
        return [
          {
            option_key: "A",
            option_text: selectedText.trim(),
          },
        ];
      } else {
        // Check if this exact text is already in options to avoid duplicates
        if (
          !currentOptions.some((opt) => opt.option_text === selectedText.trim())
        ) {
          return [
            ...currentOptions,
            {
              option_key: indexToLetter(currentOptions.length),
              option_text: selectedText.trim(),
            },
          ];
        }
        return currentOptions;
      }
    },
    [],
  );

  const markAsBlank = useCallback(() => {
    if (!selectedText.trim() || !textareaRef.current) return;

    const currentQuestionText = watchedQuestionText || "";
    const currentOptions = watchedOptions || [];

    // Replace selected text with temporary placeholder
    const beforeSelection = currentQuestionText.substring(0, selectionStart);
    const afterSelection = currentQuestionText.substring(selectionEnd);
    const tempParagraph = beforeSelection + "___TEMP___" + afterSelection;

    // Create new options
    const newOptions = createNewOptions(currentOptions, selectedText);

    // Replace temp placeholder with actual blank using temporary number
    const paragraphWithNewBlank = tempParagraph.replace(
      "___TEMP___",
      "__999.999__",
    );

    // Reorder all blanks
    const { updatedParagraph, newItems } = reorderBlanksInParagraph(
      paragraphWithNewBlank,
    );

    // Update form values
    setValue(paths.questionText, updatedParagraph);
    setValue(paths.options, newOptions);
    replaceItems(newItems);

    // Clear selection and focus
    setSelectedText("");
    setSelectionStart(0);
    setSelectionEnd(0);

    // Clear textarea selection
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
    watchedOptions,
    setValue,
    paths.questionText,
    paths.options,
    reorderBlanksInParagraph,
    replaceItems,
    createNewOptions,
  ]);

  const handleDeleteOption = useCallback(
    (index: number, option: Option) => {
      const currentQuestionText = watchedQuestionText || "";
      const currentOptions = watchedOptions || [];
      const currentItems = watchedItems || [];

      // Find all items that use this option as correct answer
      const itemsUsingThisOption = currentItems.filter(
        (item) => item.correct_answer.option_key === option.option_key,
      );

      if (itemsUsingThisOption.length > 0) {
        // Case 1: Option is used as correct answer in some blanks
        let updatedQuestionText = currentQuestionText;

        // Replace all blanks that use this option with the option text
        itemsUsingThisOption.forEach((item) => {
          const blankPattern = new RegExp(`__${item.question_number}__`, "g");
          updatedQuestionText = updatedQuestionText.replace(
            blankPattern,
            option.option_text,
          );
        });

        // Remove the items that used this option
        // const remainingItems = currentItems.filter(
        //   (item) => item.correct_answer.option_key !== option.option_key,
        // );

        // Remove the option
        const remainingOptions = currentOptions.filter((_, i) => i !== index);

        // Reorder remaining blanks and items
        const { updatedParagraph, newItems } =
          reorderBlanksInParagraph(updatedQuestionText);

        // Update form values
        setValue(paths.questionText, updatedParagraph);
        setValue(paths.options, remainingOptions);
        replaceItems(newItems);
      } else {
        // Case 2: Option is not used as correct answer (or correct answers not set yet)
        // Strategy: Try to find blank that matches option index position

        const optionText = option.option_text;
        const targetBlankNumber = `${globalNumber}.${index + 1}`;

        // Find all blank patterns in the text
        const blankMatches = Array.from(
          currentQuestionText.matchAll(/__(\d+)\.(\d+)__/g),
        );

        // Look for the blank that matches the option's index position
        const targetBlankMatch = blankMatches.find((match) => {
          const blankNumber = `${match[1]}.${match[2]}`;
          return blankNumber === targetBlankNumber;
        });

        if (targetBlankMatch) {
          // Found matching blank, replace it with option text
          const updatedQuestionText = currentQuestionText.replace(
            targetBlankMatch[0],
            optionText,
          );

          // Remove the option
          const remainingOptions = currentOptions.filter((_, i) => i !== index);

          // Reorder remaining blanks and items
          const { updatedParagraph, newItems } =
            reorderBlanksInParagraph(updatedQuestionText);

          // Update form values
          setValue(paths.questionText, updatedParagraph);
          setValue(paths.options, remainingOptions);
          replaceItems(newItems);
        } else {
          // No matching blank found, just remove the option
          const remainingOptions = currentOptions.filter((_, i) => i !== index);
          setValue(paths.options, remainingOptions);
        }
      }
    },
    [
      watchedQuestionText,
      watchedOptions,
      watchedItems,
      setValue,
      globalNumber,
      paths.questionText,
      paths.options,
      replaceItems,
      reorderBlanksInParagraph,
    ],
  );

  const handleShuffleOptions = useCallback(() => {
    // Get current options and items
    const currentOptions = [...(watchedOptions || [])];
    const currentItems = [...(watchedItems || [])];

    // Create mapping of old option_key to new option_key
    const optionTexts = currentOptions.map((opt) => opt.option_text);
    const shuffledTexts = shuffleArray(optionTexts);

    // Create new options with shuffled texts but same keys
    const shuffledOptions = currentOptions.map((opt, index) => ({
      ...opt,
      option_text: shuffledTexts[index],
    }));

    // Update items' correct_answer to follow the shuffle
    const updatedItems = currentItems.map((item) => {
      if (item.correct_answer.option_key) {
        // Find the old option that matches this correct answer
        const oldOptionIndex = currentOptions.findIndex(
          (opt) => opt.option_key === item.correct_answer.option_key,
        );

        if (oldOptionIndex !== -1) {
          // Find where this text ended up after shuffle
          const oldText = currentOptions[oldOptionIndex].option_text;
          const newOptionIndex = shuffledTexts.findIndex(
            (text) => text === oldText,
          );

          if (newOptionIndex !== -1) {
            return {
              ...item,
              correct_answer: {
                option_key: shuffledOptions[newOptionIndex].option_key,
                option_text: shuffledOptions[newOptionIndex].option_text,
              },
            };
          }
        }
      }
      return item;
    });

    // Update form values
    setValue(paths.options, shuffledOptions);
    replaceItems(updatedItems);
  }, [watchedOptions, watchedItems, setValue, paths.options, replaceItems]);

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          questionPath={questionPath}
          globalNumber={globalNumber}
          withNumber={false}
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
                  questionFields.length > 0
                    ? (e) => {
                        e.stopPropagation();
                        onRemoveQuestion?.(qIndex);
                      }
                    : undefined
                }
                className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
                aria-label="Remove question"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h4 className="text-lg font-medium text-white">
            Add Suggested Answer for Paragraph Completion
          </h4>
          <Button
            onClick={handleShuffleOptions}
            type="button"
            size={"xsm"}
            className="w-full md:w-fit"
          >
            <Shuffle />
            Shuffle Options
          </Button>
        </div>

        <OptionFieldArray
          questionPath={questionPath}
          onDeleteOption={handleDeleteOption}
        />
      </div>

      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <h4 className="text-lg font-medium text-white">
          Correct Words for Each Blank
        </h4>

        {itemFields.length === 0 ? (
          <p className="my-12 text-center text-sm text-gray-300">
            No blanks created yet. Select text in the paragraph above and click
            &quot;Mark as Blank&quot; to create answer keys.
          </p>
        ) : (
          <div className="space-y-6">
            {itemFields.map((field, index) => {
              const typedField = field as Item & { id: string };

              return (
                <div key={field.id} className="flex items-center gap-4">
                  <Badge
                    size={"icon"}
                    variant={"custom"}
                    className="text-primary p-4 text-sm"
                  >
                    {typedField.question_number}
                  </Badge>

                  <AnswerKeyField
                    name={`${paths.items}.${index}.correct_answer`}
                    variant={"single"}
                    options={watchedOptions || []}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuestionBreakdown
        breakdownPath={`${questionsPath}.${qIndex}.breakdown`}
      />
    </div>
  );
};
