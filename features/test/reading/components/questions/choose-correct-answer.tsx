"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { PiCopyFill } from "react-icons/pi";
import { AnswerKeyField } from "../answer-key-field";
import OptionFieldArray from "../options-field-array";
import QuestionHeader from "../question-header";

const ChooseCorrectAnswer = ({
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
  const { control, watch } = useFormContext();

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const questionOptions = watch(
    `${questionsPath}.${qIndex}.options`,
  ) as string[];

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          questionsPath={`${questionsPath}.${qIndex}.question`}
          variant="input"
          typePath={`${questionsPath}.${qIndex}.type`}
        />

        <OptionFieldArray
          questionsPath={`${questionsPath}.${qIndex}.options`}
          variant="editable"
        />

        <Separator />

        {/* ANSWER KEY & ACTION */}
        <div className="flex items-center justify-between gap-4">
          <AnswerKeyField
            name={`${questionsPath}.${qIndex}.answerKey`}
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

export default ChooseCorrectAnswer;
