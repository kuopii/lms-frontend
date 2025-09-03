"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { GrSelect } from "react-icons/gr";
import { PiCopyFill } from "react-icons/pi";
import QuestionBreakdown from "../question-breakdown";
import QuestionHeader from "../question-header";
import { Option } from "@/types/test";
import PointsField from "../points-field";
import { ImagePreview } from "../question-image";

interface SentenceCompletionProps {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
}

const SentenceCompletion = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: SentenceCompletionProps) => {
  const { control, watch, setValue, getValues } = useFormContext();
  const inputRefs = useRef<HTMLInputElement | null>(null);
  const questionPath = `${questionsPath}.${qIndex}`;

  const correctAnswerPath = useMemo(
    () => `${questionPath}.correct_answer`,
    [questionPath],
  );

  const { fields: correctAnswerField } = useFieldArray({
    control,
    name: correctAnswerPath,
  });

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const allAnswerKeys = watch(
    correctAnswerField.map(
      (_, index) => `${correctAnswerPath}.${index}.option_text`,
    ),
  );

  const BLANK_PLACEHOLDER = "____";

  const validateSelection = (
    start: number | null,
    end: number | null,
  ): boolean => {
    return start !== null && end !== null && start !== end;
  };

  //   Handle Mark As Blank
  const markAsBlank = useCallback(() => {
    const inputElement = inputRefs.current;
    if (!inputElement) return;

    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;

    if (!validateSelection(start, end)) {
      alert("Please select the text you want to make blank first");
      return;
    }

    const currentQuestion = getValues(`${questionPath}.question_text`);
    const correctAnswers =
      (getValues(`${questionPath}.correct_answer`) as Option[]) ?? [];

    const selectedText = currentQuestion.substring(start, end);
    if (!selectedText) {
      alert("The selected text is invalid");
      return;
    }

    const isAlreadyBlank = currentQuestion.includes(BLANK_PLACEHOLDER);

    if (isAlreadyBlank && correctAnswers.length > 0) {
      const originalWord = correctAnswers[0]?.option_text;
      if (!originalWord) return;

      const restoredText = currentQuestion.replace(
        BLANK_PLACEHOLDER,
        originalWord,
      );

      setValue(`${questionPath}.question_text`, restoredText);
      setValue(`${questionPath}.correct_answer`, [
        {
          option_key: "",
          option_text: "",
        },
      ]);
    } else {
      const updateText =
        currentQuestion.substring(0, start) +
        BLANK_PLACEHOLDER +
        currentQuestion.substring(end);

      setValue(`${questionPath}.question_text`, updateText);

      setValue(
        `${questionPath}.correct_answer`,
        [
          {
            option_key: selectedText,
            option_text: selectedText,
          },
        ],
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }

    // Reset selection and blur input
    inputElement.setSelectionRange(0, 0);
    inputElement.blur();
  }, [setValue, getValues, questionPath]);

  const resetItem = useCallback(() => {
    const currentQuestion = getValues(`${questionPath}.question_text`);
    const correctAnswers =
      (getValues(`${questionPath}.correct_answer`) as Option[]) ?? [];
    const originalWord = correctAnswers[0]?.option_text;
    if (!originalWord) return;

    if (!currentQuestion || !BLANK_PLACEHOLDER || !originalWord) return;

    const restoredText = currentQuestion.replace(
      BLANK_PLACEHOLDER,
      originalWord,
    );
    setValue(`${questionPath}.question_text`, restoredText);
    setValue(`${questionPath}.correct_answer`, [
      {
        option_key: "",
        option_text: "",
      },
    ]);
  }, [setValue, getValues, questionPath]);

  const currentImages = watch(
    `${questionsPath}.${qIndex}.question_data.images`,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          questionPath={questionPath}
          globalNumber={globalNumber}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={currentImages}
            showActions={false}
            containerClassName="grid-cols-3 md:grid-cols-4"
          />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-3 md:flex-row md:py-5">
          <FormField
            name={`${questionPath}.question_text`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    ref={inputRefs}
                    variant="underline"
                    placeholder="Type the sentence here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center gap-2 md:w-fit">
            <Button
              type="button"
              onClick={() => resetItem()}
              size="icon"
              variant="ghost"
              disabled={allAnswerKeys[0] === ""}
              aria-label="Reset sentence"
            >
              <RotateCcw />
            </Button>
            <Button
              size="xs"
              onClick={() => markAsBlank()}
              className="flex-1 rounded-3xl md:w-fit [&_svg:not([class*='size-'])]:size-5"
              type="button"
              aria-label="Mark selected text as blank"
            >
              <GrSelect />
              Mark as Blank
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full items-center gap-2 md:w-fit">
            <span className="text-sm text-white/70">Answer: </span>
            <Badge
              className="flex-1 bg-white/10 text-white"
              size="lg"
              aria-label={`Answer: ${allAnswerKeys[0] || "Not set"}`}
            >
              {allAnswerKeys[0] || "-"}
            </Badge>
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
            <PointsField questionPath={questionPath} />

            <Button
              type="button"
              size="iconSm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateQuestion?.(qIndex);
              }}
              className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
            >
              <PiCopyFill />
            </Button>
            <Button
              size="iconSm"
              type="button"
              variant="ghost"
              disabled={questionFields.length < 1}
              onClick={
                questionFields.length > 0
                  ? (e) => {
                      e.stopPropagation();
                      onRemoveQuestion?.(qIndex);
                    }
                  : undefined
              }
              className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </div>

      <QuestionBreakdown
        breakdownPath={`${questionsPath}.${qIndex}.breakdown`}
      />
    </div>
  );
};

export default SentenceCompletion;
