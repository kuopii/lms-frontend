"use client";

import React, { useCallback } from "react";
import QuestionHeader from "../question-header";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { indexToLetter } from "../../../../../helpers/index-to-letter";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import { AnswerKeyField } from "../answer-key-field";
import { PiCopyFill } from "react-icons/pi";

type MatchingItem = {
  question: string;
  answerKey: string;
  breakdown: string;
};

const MatchingInformation = ({
  qIndex,
  questionsPath,
}: {
  qIndex: number;
  questionsPath: string;
}) => {
  const { control, getValues } = useFormContext();

  const paragraphPath = `${questionsPath}.${qIndex}.paragraph`;
  const itemsPath = `${questionsPath}.${qIndex}.items`;

  const {
    fields: paragraphFields,
    remove: removeParagraph,
    append: appendParagraph,
  } = useFieldArray({
    control,
    name: paragraphPath,
  });

  const {
    fields: itemsField,
    remove: removeItem,
    insert: insertItem,
  } = useFieldArray({
    control,
    name: itemsPath,
  });

  const handleRemoveParagraph = useCallback(
    (index: number) => {
      removeParagraph(index);
    },
    [removeParagraph],
  );

  const handleInsertItem = useCallback(
    (index: number) => {
      insertItem(index + 1, {
        question: "",
        answerKey: "",
        breakdown: "",
      });
    },
    [insertItem],
  );

  const handleDuplicateItem = useCallback(
    (index: number) => {
      const currentItems = getValues(itemsPath) as MatchingItem[];
      const itemToDuplicate = currentItems[index];

      if (itemToDuplicate) {
        insertItem(index + 1, {
          question: itemToDuplicate.question,
          answerKey: itemToDuplicate.answerKey,
          breakdown: itemToDuplicate.breakdown,
        });
      } else {
        // Fallback if getValues fails
        insertItem(index + 1, {
          question: "",
          answerKey: "",
          breakdown: "",
        });
      }
    },
    [insertItem, getValues, itemsPath],
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      removeItem(index);
    },
    [removeItem],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          typePath={`${questionsPath}.${qIndex}.type`}
          withNumber={false}
          qIndex={qIndex}
          textHeader="Add Paragraph to Match the Information"
          variant={"text"}
        />

        {paragraphFields.map((field, index) => (
          <div key={field.id} className="space-y-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h4 className="text-xl font-medium text-white">
                Paragraph {indexToLetter(index)}
              </h4>
              <Button
                type="button"
                size="iconSm"
                variant={"ghost"}
                disabled={paragraphFields.length <= 1}
                className="text-destructive hover:text-destructive disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5"
                title="Delete paragraph"
                onClick={
                  paragraphFields.length > 1
                    ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveParagraph(index);
                      }
                    : undefined
                }
              >
                <FaTrash />
              </Button>
            </div>
            <FormField
              control={control}
              name={`${paragraphPath}.${index}`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      {...field}
                      onFocus={(e) => {
                        if (
                          e.target.value === "Type or paste the text here..."
                        ) {
                          e.target.select();
                        }
                      }}
                      placeholder="Type the sentence beginnings here..."
                      className="min-h-60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
          </div>
        ))}

        <Button
          type="button"
          onClick={() => appendParagraph("Type or paste the text here...")}
          className="rounded-full [&_svg:not([class*='size-'])]:size-5"
          size={"xsm"}
          title="Insert new paragraph below"
        >
          <Plus />
          Add Paragraph
        </Button>
      </div>
      {itemsField.map((item, itemIndex) => (
        <div
          key={item.id}
          className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5"
        >
          <div className="flex items-center justify-between gap-7">
            <span className="text-primary text-xl font-medium">
              {qIndex + 1}.{itemIndex + 1}
            </span>
            <FormField
              control={control}
              name={`${itemsPath}.${itemIndex}.question`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type the sentence beginnings here..."
                      className="min-h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* ANSWER KEY & ACTION */}
          <div className="flex items-center justify-between gap-4">
            <AnswerKeyField
              name={`${itemsPath}.${itemIndex}.answerKey`}
              variant={"single"}
              options={paragraphFields.map(
                (_, index) => `Paragraph ${indexToLetter(index)}`,
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                type="button"
                size="iconSm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDuplicateItem(itemIndex);
                }}
                className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
                title="Duplicate paragraph"
              >
                <PiCopyFill />
              </Button>
              <Button
                size="iconSm"
                type="button"
                variant="ghost"
                onClick={
                  itemsField.length > 1
                    ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveItem(itemIndex);
                      }
                    : undefined
                }
                disabled={itemsField.length <= 1}
                className="text-destructive hover:text-destructive disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5"
                title="Delete paragraph"
              >
                <FaTrash />
              </Button>
            </div>
          </div>

          <QuestionBreakdown name={`${itemsPath}.${itemIndex}.breakdown`} />

          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleInsertItem(itemIndex);
            }}
            className="rounded-full [&_svg:not([class*='size-'])]:size-5"
            size={"xsm"}
            title="Insert new paragraph below"
          >
            <Plus />
            Add Information
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MatchingInformation;
