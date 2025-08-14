"use client";

import React, { useCallback } from "react";
import QuestionHeader from "../question-header";
import OptionFieldArray from "../options-field-array";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnswerKeyField } from "../answer-key-field";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";

type MatchingItem = {
  text: string;
  answerKey: string;
  breakdown: string;
};

type MatchingHeadingProps = {
  qIndex: number;
  questionsPath: string;
};

const MatchingHeading = ({ qIndex, questionsPath }: MatchingHeadingProps) => {
  const { control, watch, getValues } = useFormContext();

  const itemsPath = `${questionsPath}.${qIndex}.items`;

  const {
    fields: itemsField,
    remove: removeItem,
    insert: insertItem,
  } = useFieldArray({
    control,
    name: itemsPath,
  });

  const questionOptions = watch(
    `${questionsPath}.${qIndex}.options`,
  ) as string[];

  const handleInsertItem = useCallback(
    (index: number) => {
      insertItem(index + 1, {
        text: "",
        answerKey: "",
        breakdown: "",
      });
    },
    [insertItem],
  );

  const handleDuplicateItem = useCallback(
    (index: number) => {
      // Get current values from form instead of itemsField
      const currentItems = getValues(itemsPath) as MatchingItem[];
      const itemToDuplicate = currentItems[index];

      if (itemToDuplicate) {
        insertItem(index + 1, {
          text: itemToDuplicate.text,
          answerKey: itemToDuplicate.answerKey,
          breakdown: itemToDuplicate.breakdown,
        });
      } else {
        // Fallback if getValues fails
        insertItem(index + 1, {
          text: "",
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
          textHeader="Add Heading Option to Match the Paragraph"
          variant={"text"}
        />

        <OptionFieldArray
          questionsPath={`${questionsPath}.${qIndex}.options`}
          variant="editable"
        />
      </div>

      {itemsField.map((item, index) => (
        <div key={item.id} className="space-y-6 rounded-3xl bg-[#333333] p-5">
          <div className="flex items-center gap-7">
            <span className="text-primary text-xl font-medium">
              {qIndex + 1}.{index + 1}
            </span>
            <h4 className="text-white">
              Paragraph {String.fromCharCode(65 + index)}
            </h4>
          </div>

          <FormField
            control={control}
            name={`${itemsPath}.${index}.text`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type or paste the text here..."
                    className="min-h-60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* ANSWER KEY & ACTION */}
          <div className="flex items-center justify-between gap-4">
            <AnswerKeyField
              name={`${itemsPath}.${index}.answerKey`}
              variant={"single"}
              options={questionOptions}
            />

            <div className="flex items-center gap-4">
              <Button
                type="button"
                size="iconSm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateItem(index);
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
                        e.stopPropagation();
                        handleRemoveItem(index);
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

          <QuestionBreakdown name={`${itemsPath}.${index}.breakdown`} />

          <Button
            type="button"
            onClick={() => handleInsertItem(index)}
            className="rounded-full [&_svg:not([class*='size-'])]:size-5"
            size={"xsm"}
            title="Insert new paragraph below"
          >
            <Plus />
            Add Paragraph
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MatchingHeading;
