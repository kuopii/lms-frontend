"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle } from "lucide-react";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";
import QuestionHeader from "../question-header";
import OptionFieldArray from "../options-field-array";
import QuestionBreakdown from "../question-breakdown";
import { ImagePreview } from "../question-image";
import PointsField from "../points-field";
import AnswerKeyField from "../answer-key-field";
import { useTextSelection } from "@/hooks/use-text-selection";
import { Item, Option } from "@/types/test";
import { indexToLetter } from "@/helpers/index-to-letter";
import { shuffleArray } from "@/helpers/shuffle-array";
import { ParagraphTextArea } from "../../reading/components/paragraph-text-area";
import { BlankActions } from "../../reading/components/blank-action";
import { useBlankInText } from "@/hooks/use-blank-in-text";

type ParagraphCompletionProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
};

// ========== CUSTOM HOOKS ==========

// Hook untuk mengelola options
const useOptionManagement = () => {
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

  return { createNewOptions };
};

// ========== SUB COMPONENTS ==========

// Komponen untuk question actions
const QuestionActions: React.FC<{
  questionPath: string;
  qIndex: number;
  questionFieldsLength: number;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
}> = ({
  questionPath,
  qIndex,
  questionFieldsLength,
  onDuplicateQuestion,
  onRemoveQuestion,
}) => (
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
          questionFieldsLength > 0
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
);

// Komponen untuk options section
const OptionsSection: React.FC<{
  questionPath: string;
  onShuffleOptions: () => void;
  onDeleteOption: (index: number, option: Option) => void;
}> = ({ questionPath, onShuffleOptions, onDeleteOption }) => (
  <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <h4 className="text-lg font-medium text-white">
        Add Suggested Answer for Paragraph Completion
      </h4>
      <Button
        onClick={onShuffleOptions}
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
      onDeleteOption={onDeleteOption}
    />
  </div>
);

// Komponen untuk answer keys section
const AnswerKeysSection = React.memo<{
  itemFields: (Item & { id: string })[];
  itemsPath: string;
  watchedOptions: Option[];
}>(({ itemFields, itemsPath, watchedOptions }) => (
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
        {itemFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4">
            <Badge
              size={"icon"}
              variant={"custom"}
              className="text-primary p-4 text-sm"
            >
              {field.question_number}
            </Badge>

            <AnswerKeyField
              name={`${itemsPath}.${index}.correct_answer`}
              variant={"single"}
              options={watchedOptions || []}
            />
          </div>
        ))}
      </div>
    )}
  </div>
));

AnswerKeysSection.displayName = "AnswerKeysSection";

export const ParagraphCompletion = ({
  qIndex,
  questionsPath,
  globalNumber,
  onDuplicateQuestion,
  onRemoveQuestion,
}: ParagraphCompletionProps) => {
  const { control, watch, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // ========== CUSTOM HOOKS USAGE ==========
  const { reorderBlanksInParagraph, findBlanksInText } = useBlankInText({
    questionType: "paragraph",
    globalNumber,
  });

  const {
    selectedText,
    selectionStart,
    selectionEnd,
    handleTextSelection,
    clearSelection,
  } = useTextSelection(watchedQuestionText);
  const { createNewOptions } = useOptionManagement();

  // ========== EFFECTS ==========
  useEffect(() => {
    if (!watchedQuestionText || !watchedItems?.length) return;

    const currentBlanks = findBlanksInText(watchedQuestionText);
    if (currentBlanks.length === 0) return;

    const needsUpdate = currentBlanks.some((blank) => {
      const [currentGlobalNum] = blank.number.toString().split(".");
      return parseInt(currentGlobalNum) !== globalNumber;
    });

    if (needsUpdate) {
      const { updatedParagraph, newAnswerData: newItems } =
        reorderBlanksInParagraph(watchedQuestionText, watchedItems);
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

  // ========== EVENT HANDLERS ==========
  const onTextSelection = useCallback(() => {
    handleTextSelection(textareaRef);
  }, [handleTextSelection]);

  const markAsBlank = useCallback(() => {
    if (!selectedText.trim() || !textareaRef.current) return;

    const currentQuestionText = watchedQuestionText || "";
    const currentOptions = watchedOptions || [];

    const beforeSelection = currentQuestionText.substring(0, selectionStart);
    const afterSelection = currentQuestionText.substring(selectionEnd);
    const tempParagraph = beforeSelection + "___TEMP___" + afterSelection;

    const newOptions = createNewOptions(currentOptions, selectedText);
    const paragraphWithNewBlank = tempParagraph.replace(
      "___TEMP___",
      "__999.999__",
    );
    const { updatedParagraph, newAnswerData: newItems } =
      reorderBlanksInParagraph(paragraphWithNewBlank, watchedItems);

    setValue(paths.questionText, updatedParagraph);
    setValue(paths.options, newOptions);
    replaceItems(newItems);

    clearSelection();

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
    watchedItems,
    setValue,
    paths.questionText,
    paths.options,
    reorderBlanksInParagraph,
    replaceItems,
    createNewOptions,
    clearSelection,
  ]);

  const handleDeleteOption = useCallback(
    (index: number, option: Option) => {
      const currentQuestionText = watchedQuestionText || "";
      const currentOptions = watchedOptions || [];
      const currentItems = watchedItems || [];

      const itemsUsingThisOption = currentItems.filter(
        (item) => item.correct_answer.option_key === option.option_key,
      );

      if (itemsUsingThisOption.length > 0) {
        let updatedQuestionText = currentQuestionText;

        itemsUsingThisOption.forEach((item) => {
          const blankPattern = new RegExp(`__${item.question_number}__`, "g");
          updatedQuestionText = updatedQuestionText.replace(
            blankPattern,
            option.option_text,
          );
        });

        const remainingOptions = currentOptions.filter((_, i) => i !== index);
        const { updatedParagraph, newAnswerData: newItems } =
          reorderBlanksInParagraph(updatedQuestionText, watchedItems);

        setValue(paths.questionText, updatedParagraph);
        setValue(paths.options, remainingOptions);
        replaceItems(newItems);
      } else {
        const optionText = option.option_text;
        const targetBlankNumber = `${globalNumber}.${index + 1}`;

        const blankMatches = Array.from(
          currentQuestionText.matchAll(/__(\d+)\.(\d+)__/g),
        );

        const targetBlankMatch = blankMatches.find((match) => {
          const blankNumber = `${match[1]}.${match[2]}`;
          return blankNumber === targetBlankNumber;
        });

        if (targetBlankMatch) {
          const updatedQuestionText = currentQuestionText.replace(
            targetBlankMatch[0],
            optionText,
          );

          const remainingOptions = currentOptions.filter((_, i) => i !== index);
          const { updatedParagraph, newAnswerData: newItems } =
            reorderBlanksInParagraph(updatedQuestionText, watchedItems);

          setValue(paths.questionText, updatedParagraph);
          setValue(paths.options, remainingOptions);
          replaceItems(newItems);
        } else {
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
    const currentOptions = [...(watchedOptions || [])];
    const currentItems = [...(watchedItems || [])];

    const optionTexts = currentOptions.map((opt) => opt.option_text);
    const shuffledTexts = shuffleArray(optionTexts);

    const shuffledOptions = currentOptions.map((opt, index) => ({
      ...opt,
      option_text: shuffledTexts[index],
    }));

    const updatedItems = currentItems.map((item) => {
      if (item.correct_answer.option_key) {
        const oldOptionIndex = currentOptions.findIndex(
          (opt) => opt.option_key === item.correct_answer.option_key,
        );

        if (oldOptionIndex !== -1) {
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

        <ParagraphTextArea
          control={control}
          questionPath={questionPath}
          textareaRef={textareaRef}
          onTextSelection={onTextSelection}
        />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <BlankActions
            selectedText={selectedText}
            onMarkAsBlank={markAsBlank}
          />
          <QuestionActions
            questionPath={questionPath}
            qIndex={qIndex}
            questionFieldsLength={questionFields.length}
            onDuplicateQuestion={onDuplicateQuestion}
            onRemoveQuestion={onRemoveQuestion}
          />
        </div>
      </div>

      <OptionsSection
        questionPath={questionPath}
        onShuffleOptions={handleShuffleOptions}
        onDeleteOption={handleDeleteOption}
      />

      <AnswerKeysSection
        itemFields={itemFields as (Item & { id: string })[]}
        itemsPath={paths.items}
        watchedOptions={watchedOptions}
      />

      <QuestionBreakdown breakdownPath={`${questionPath}.breakdown`} />
    </div>
  );
};
