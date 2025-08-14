"use client";

import React from "react";
import QuestionHeader from "../question-header";
import { Separator } from "@/components/ui/separator";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import { Button } from "@/components/ui/button";
import { PiCopyFill } from "react-icons/pi";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import OptionFieldArray from "../options-field-array";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const ShortAnswer = ({
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
}) => {
  const { control } = useFormContext();

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const otherAnswerIncorrectPath = `${questionsPath}.${qIndex}.otherAnswerIncorrect`;

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          questionsPath={`${questionsPath}.${qIndex}.question`}
          variant="input"
          typePath={`${questionsPath}.${qIndex}.type`}
        />

        <div className="space-y-4">
          <h4 className="text-medium px-2.5 text-lg">
            List of correct answers
          </h4>
          <OptionFieldArray
            variant="editable"
            withNumber={false}
            placeholder="Type the correct answer here..."
            questionsPath={`${questionsPath}.${qIndex}.answerKey`}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4 border-b-white">
          <FormField
            control={control}
            name={otherAnswerIncorrectPath}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-0">
                <Checkbox
                  id={`otherAnswerIncorrect-${qIndex}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel
                  htmlFor={`otherAnswerIncorrect-${qIndex}`}
                  className="text-sm font-normal"
                >
                  Other answers are incorrect
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-4">
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
      <QuestionBreakdown name={`${questionsPath}.${qIndex}.breakdown`} />
    </div>
  );
};

export default ShortAnswer;
