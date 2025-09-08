"use client";

import React, { useEffect, useMemo } from "react";
import QuestionHeader from "../question-header";
import { ImagePreview } from "../question-image";
import { useFieldArray, useFormContext } from "react-hook-form";
import OptionFieldArray from "../options-field-array";
import { Separator } from "@/components/ui/separator";
import PointsField from "../points-field";
import { Button } from "@/components/ui/button";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";
import AnswerKeyField from "../answer-key-field";
import { Option, Item } from "@/types/test";
import QuestionBreakdown from "../question-breakdown";
import { Plus } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type MatchingHeadingProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
};

const MatchingHeading = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: MatchingHeadingProps) => {
  const { watch, control, setValue } = useFormContext();
  const questionPath = `${questionsPath}.${qIndex}`;

  const paths = useMemo(
    () => ({
      images: `${questionPath}.question_data.images`,
      options: `${questionPath}.options`,
      questionNumber: `${questionPath}.question_number`,
      items: `${questionPath}.items`,
      questionType: `${questionPath}.question_type`,
    }),
    [questionPath],
  );

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const {
    fields: itemsField,
    remove: removeItem,
    append: appendItem,
  } = useFieldArray({
    control,
    name: paths.items,
  });

  const questionDataImages = watch(paths.images);
  const questionOptions = watch(paths.options) as Option[];
  const mainQuestionNumber = watch(paths.questionNumber) as number;
  const watchItems = watch(paths.items) as Item[];
  const watchQuestionType = watch(paths.questionType) as string;

  useEffect(() => {
    if (watchItems && watchItems.length > 0) {
      const updatedItems = watchItems.map((item, index) => ({
        ...item,
        question_number: parseFloat(`${globalNumber}.${index + 1}`),
      }));

      // Only update if there's actually a change
      const hasChanged = watchItems.some(
        (item, index) =>
          item.question_number !== parseFloat(`${globalNumber}.${index + 1}`),
      );

      if (hasChanged) {
        setValue(paths.items, updatedItems);
      }
    }
  }, [globalNumber, watchItems, setValue, paths.items]);

  const handleFirstInsertItem = () => {
    // Untuk item pertama, gunakan format question_number.1
    const newItem = {
      question_number: parseFloat(`${mainQuestionNumber}.1`),
      question_text: "",
      correct_answer: { option_key: "", option_text: "" },
      breakdown: {
        explanation: "",
        has_highlight: false,
        highlights: [],
      },
    };

    appendItem(newItem);
  };

  const handleAddItem = () => {
    // Hitung question_number berikutnya berdasarkan items yang sudah ada
    const nextSubNumber = itemsField.length + 1;
    const newQuestionNumber = parseFloat(
      `${mainQuestionNumber}.${nextSubNumber}`,
    );

    const newItem = {
      question_number: newQuestionNumber,
      correct_answer: { option_key: "", option_text: "" },
      question_text: "",
      breakdown: {
        explanation: "",
        has_highlight: false,
        highlights: [],
      },
    };

    appendItem(newItem);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);

    // Update question_number untuk items yang tersisa agar tetap berurutan
    setTimeout(() => {
      const currentItems = watch(paths.items);
      currentItems?.forEach((item: Item, idx: number) => {
        const newQuestionNumber = parseFloat(
          `${mainQuestionNumber}.${idx + 1}`,
        );
        setValue(`${paths.items}.${idx}.question_number`, newQuestionNumber);
      });
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          textHeader={`For ${watchQuestionType === "matching_heading" ? "Matching Heading" : "Matching Information"} questions, each paragraph in the passage must be labeled with a letter (A, B, C, …) at the beginning before listing the ${watchQuestionType === "matching_heading" ? "heading" : "information"}.`}
          withNumber={false}
          globalNumber={globalNumber}
          questionPath={questionPath}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={questionDataImages}
            showActions={false}
            containerClassName="grid-cols-3 md:grid-cols-4"
          />
        </div>

        <OptionFieldArray variant="editable" questionPath={questionPath} />

        <Separator />

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:justify-between">
          {itemsField.length < 1 ? (
            <Button
              type="button"
              size={"xsm"}
              variant={"outline"}
              className="w-full md:w-fit"
              onClick={handleFirstInsertItem}
            >
              <Plus />
              Create Items
            </Button>
          ) : (
            <div className="hidden md:block" />
          )}
          <div className="flex w-full items-center justify-between gap-2 md:w-fit">
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
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {itemsField.length > 0 && (
        <div className="space-y-10 rounded-3xl bg-[#333333] px-3 py-8 md:px-4 lg:px-5">
          {itemsField.map((item, index) => (
            <div key={item.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-medium text-primary border-r-primary min-w-10 border-r text-xl">
                  {mainQuestionNumber}.{index + 1}
                </span>
                <FormField
                  control={control}
                  name={`${paths.items}.${index}.question_text` || ""}
                  render={({ field }) => (
                    <FormItem className="w-full gap-3">
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Type your question here..."
                          className="min-h-11 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-2">
                <AnswerKeyField
                  name={`${paths.items}.${index}.correct_answer`}
                  variant={"single"}
                  options={questionOptions}
                />
                <Button
                  type="button"
                  size="iconSm"
                  variant="ghost"
                  onClick={() => handleRemoveItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <FaTrash className="h-3 w-3" />
                </Button>
              </div>
              <QuestionBreakdown
                breakdownPath={`${paths.items}.${index}.breakdown`}
              />
            </div>
          ))}
          <div className="flex items-center justify-end">
            <Button
              type="button"
              size="xsm"
              onClick={handleAddItem}
              className="flex w-full items-center gap-2 md:w-fit"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingHeading;
