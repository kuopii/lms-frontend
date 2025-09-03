"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  listeningQuestionTypes,
  readingQuestionTypes,
} from "@/data/test-filter-options";
import { cn } from "@/lib/utils";
import { QuestionType } from "@/types/test";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { defaultListeningQuestion } from "../constant/default-listening-question";
import { defaultReadingQuestion } from "../constant/default-reading-question";
import { extractIndexes } from "@/helpers/extract-indexes";

export function getVariantFromPath(pathname: string): "reading" | "listening" {
  const segments = pathname.split("/").filter(Boolean);

  const variant = segments[1];

  if (variant === "listening") return "listening";
  return "reading";
}

interface QuestionHeaderProps {
  variant: "input" | "text" | "tips";
  qIndex: number;
  withNumber?: boolean;
  className?: string;
  textHeader?: string;
  questionPlaceholder?: string;
  globalNumber: number;
  questionPath: string;
}

const defaultQuestion = {
  listening: defaultListeningQuestion,
  reading: defaultReadingQuestion,
};

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  qIndex,
  questionPlaceholder = "Type your question here...",
  variant = "input",
  withNumber = true,
  className = "",
  textHeader = "",
  globalNumber,
  questionPath,
}) => {
  const { control } = useFormContext();
  const pathname = usePathname();
  const { getValues, setValue } = useFormContext();

  const selectOptionsVariant = getVariantFromPath(pathname);

  const handleChangeType = useCallback(
    (
      nestIndex: number,
      groupIndex: number,
      qIndex: number,
      newType: QuestionType,
      type: "listening" | "reading",
    ) => {
      if (groupIndex == null || qIndex == null || nestIndex == null) return;

      const passages = getValues("passages");
      const questionGroup = passages[nestIndex].questionGroups[groupIndex];
      const question = questionGroup.questions[qIndex];

      const defaults = defaultQuestion[type];
      const defaultData = defaults[newType as keyof typeof defaults];

      if (questionGroup.questions.length === 1) {
        questionGroup.questions[qIndex] = {
          ...defaultData,
          question_type: newType,
          id: question.id,
        };
      } else {
        const newGroup = {
          questions: [
            {
              ...defaultData,
              question_type: newType,
              id: question.id,
            },
          ],
        };

        questionGroup.questions.splice(qIndex, 1);

        passages[nestIndex].questionGroups.splice(groupIndex + 1, 0, newGroup);
      }

      setValue("passages", passages, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );

  const { nestIndex, questionGroupIndex } = extractIndexes(questionPath);

  return (
    <div className={cn("flex items-center justify-between gap-7", className)}>
      {withNumber && (
        <span className="text-medium text-primary text-xl">{globalNumber}</span>
      )}
      <div className="flex w-full flex-1 flex-col items-center justify-between gap-4 md:flex-row">
        {variant === "input" && (
          <FormField
            control={control}
            name={`${questionPath}.question_text` || ""}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={questionPlaceholder}
                    className="min-h-11 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {variant === "text" && (
          <h4 className="text-[clamp(1rem,2.3vw,1.2rem)] font-medium text-white">
            {textHeader || "Question"}
          </h4>
        )}
        {variant === "tips" && (
          <div className="flex w-full items-center gap-3 rounded-4xl bg-[#DEDEDE] px-4 py-2">
            <Image
              width={45}
              height={45}
              className="h-9 w-9"
              alt="tips"
              src="/icons/tips.svg"
            />
            <h4 className="text-sm text-[#111]">
              {textHeader || (
                <>
                  Select a word or phrase in the sentence and click{" "}
                  <span className="text-primary">“Mark as Blank”</span> to
                  create a gap for students to fill.
                </>
              )}
            </h4>
          </div>
        )}
        <FormField
          control={control}
          name={`${questionPath}.question_type`}
          render={({ field }) => (
            <FormItem className="w-full md:w-64">
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  handleChangeType?.(
                    nestIndex,
                    questionGroupIndex,
                    qIndex,
                    val as QuestionType,
                    selectOptionsVariant,
                  );
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Question Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectOptionsVariant === "reading" &&
                    readingQuestionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}

                  {selectOptionsVariant === "listening" &&
                    listeningQuestionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default QuestionHeader;
