"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AnswerKeyField from "@/features/test/components/answer-key-field";
import OptionFieldArray from "@/features/test/components/options-field-array";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import QuestionHeader from "@/features/test/components/question-header";
import { QuestionType } from "@/types/test";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { PiCopyFill } from "react-icons/pi";

type OptionType = {
  option_key: string;
  option_text: string;
};

const YesNoNotGiven = ({
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
  globalNumber,
  handleChangeType,
  nestIndex,
  groupIndex,
}: {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  nestIndex: number;
  groupIndex: number;
  globalNumber: number;
  handleChangeType: (
    nestIndex: number,
    groupIndex: number,
    qIndex: number,
    newType: QuestionType,
  ) => void;
}) => {
  const { control, watch } = useFormContext();

  const questionPath = `${questionsPath}.${qIndex}`;

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const questionOptions = watch(
    `${questionsPath}.${qIndex}.options`,
  ) as OptionType[];

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          questionsPath={`${questionPath}.question_text`}
          variant="input"
          typePath={`${questionPath}.question_type`}
          nestIndex={nestIndex}
          groupIndex={groupIndex}
          globalNumber={globalNumber}
          handleChangeType={handleChangeType}
        />

        <OptionFieldArray
          questionsPath={`${questionPath}.options`}
          variant="readonly"
        />

        <Separator />

        {/* ANSWER KEY & ACTION */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <AnswerKeyField
            name={`${questionsPath}.${qIndex}.correct_answer`}
            variant={"single"}
            options={questionOptions || []}
          />

          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
            <span>Point: </span>
            <FormField
              control={control}
              name={`${questionsPath}.${qIndex}.points_value`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="number"
                      max={100}
                      min={0}
                      variant="underline"
                      placeholder="Score Point"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : Number(val));
                      }}
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

      <QuestionBreakdown name={`${questionPath}.breakdown.explanation`} />
    </div>
  );
};

export default YesNoNotGiven;
