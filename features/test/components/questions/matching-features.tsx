"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import QuestionHeader from "../question-header";
import { ImagePreview } from "../question-image";
import OptionFieldArray from "../options-field-array";
import { Separator } from "@/components/ui/separator";
import PointsField from "../points-field";
import { Button } from "@/components/ui/button";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";
import { Plus } from "lucide-react";
import { Item, Option } from "@/types/test";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import QuestionBreakdown from "../question-breakdown";
import AnswerKeyField from "../answer-key-field";

type MatchingFeaturesProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
};

type ItemFieldProps = {
  item: Item;
  index: number;
  itemsPath: string;
  options: Option[];
  onDuplicateItem: (index: number) => void;
  onRemoveItem: (index: number) => void;
  canRemove: boolean;
};

const ItemField = React.memo(
  ({
    item,
    index,
    itemsPath,
    options,
    onDuplicateItem,
    onRemoveItem,
    canRemove,
  }: ItemFieldProps) => {
    const { control } = useFormContext();

    return (
      <div className="space-y-6 rounded-3xl bg-[#333333] px-3 py-8 md:px-4 lg:px-5">
        <div className="flex items-center justify-between gap-7">
          <span className="text-medium text-primary text-xl">
            {item.question_number}
          </span>
          <FormField
            control={control}
            name={`${itemsPath}.${index}.question_text`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type your statement here..."
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
            name={`${itemsPath}.${index}.correct_answer`}
            variant="single"
            options={options}
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="iconSm"
              variant="ghost"
              onClick={() => onDuplicateItem(index)}
              className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
            >
              <PiCopyFill />
            </Button>
            <Button
              size="iconSm"
              type="button"
              variant="ghost"
              onClick={canRemove ? () => onRemoveItem(index) : undefined}
              disabled={!canRemove}
              className="text-destructive hover:text-destructive disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
        <QuestionBreakdown breakdownPath={`${itemsPath}.${index}.breakdown`} />
      </div>
    );
  },
);

ItemField.displayName = "ItemField";

export const MatchingFeatures = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: MatchingFeaturesProps) => {
  const { control, watch, setValue } = useFormContext();

  const questionPath = `${questionsPath}.${qIndex}`;

  const paths = useMemo(
    () => ({
      images: `${questionPath}.question_data.images`,
      items: `${questionPath}.items`,
      questionNumber: `${questionPath}.question_number`,
    }),
    [questionPath],
  );

  const watchImages = watch(paths.images);
  const watchItems = watch(paths.items) as Item[];
  const watchOptions = watch(`${questionPath}.options`) as Option[];
  const watchQuestionNumber = watch(paths.questionNumber) as number;

  const {
    fields: itemsField,
    remove: removeItem,
    insert: insertItem,
    append: appendItem,
  } = useFieldArray({
    control,
    name: paths.items,
  });

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  // Auto-update question numbers when globalNumber changes
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

  const createNewItem = (questionNumber: number) => ({
    question_number: questionNumber,
    question_text: "",
    correct_answer: { option_key: "", option_text: "" },
    breakdown: {
      explanation: "",
      has_highlight: false,
      highlights: [],
    },
  });

  const handleFirstInsertItem = () => {
    const newItem = createNewItem(parseFloat(`${watchQuestionNumber}.1`));
    appendItem(newItem);
  };

  // useCallback karena di-pass ke ItemField yang di-memo
  const handleDuplicateItem = useCallback(
    (index: number) => {
      const itemToDuplicate = watchItems[index];
      if (itemToDuplicate) {
        const newQuestionNumber = parseFloat(
          `${globalNumber}.${watchItems.length + 1}`,
        );
        const duplicatedItem = {
          ...itemToDuplicate,
          question_number: newQuestionNumber,
        };

        // Insert after the current item
        insertItem(index + 1, duplicatedItem);
      }
    },
    [watchItems, globalNumber, insertItem],
  );

  // useCallback karena di-pass ke ItemField yang di-memo
  const handleRemoveItem = useCallback(
    (index: number) => {
      if (watchItems.length > 1) {
        removeItem(index);
      }
    },
    [watchItems.length, removeItem],
  );

  const canRemoveItem = watchItems?.length > 1;

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="text"
          textHeader="Add Feature Options to Match the Statements"
          questionPath={questionPath}
          globalNumber={globalNumber}
          withNumber={false}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={watchImages}
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
        <div className="space-y-6">
          {itemsField.map((item, index) => {
            const itemField = item as Item & { id: string };

            return (
              <ItemField
                key={itemField.id}
                item={itemField}
                index={index}
                itemsPath={paths.items}
                options={watchOptions || []}
                onDuplicateItem={handleDuplicateItem}
                onRemoveItem={handleRemoveItem}
                canRemove={canRemoveItem}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
