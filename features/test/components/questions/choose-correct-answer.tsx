"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AnswerKeyField from "@/features/test/components/answer-key-field";
import OptionFieldArray from "@/features/test/components/options-field-array";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import QuestionHeader from "@/features/test/components/question-header";
import { Option } from "@/types/test";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { PiCopyFill } from "react-icons/pi";
import PointsField from "../points-field";
import { ImagePreview } from "../question-image";

const ChooseCorrectAnswer = ({
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
  globalNumber,
}: {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
}) => {
  const { control, watch } = useFormContext();

  const questionPath = `${questionsPath}.${qIndex}`;

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const questionOptions = watch(`${questionPath}.options`) as Option[];

  const currentImages = watch(
    `${questionsPath}.${qIndex}.question_data.images`,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="input"
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

        <OptionFieldArray variant="editable" questionPath={questionPath} />

        <Separator />

        {/* ANSWER KEY & ACTION */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <AnswerKeyField
            name={`${questionPath}.correct_answer`}
            variant={"single"}
            options={questionOptions || []}
          />

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

      <QuestionBreakdown
        breakdownPath={`${questionsPath}.${qIndex}.breakdown`}
      />
    </div>
  );
};

export default ChooseCorrectAnswer;
