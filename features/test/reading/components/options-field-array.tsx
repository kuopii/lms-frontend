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
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiDeleteBack2Fill } from "react-icons/ri";

const OptionsFieldArray = ({
  nestIndex,
  questionGroupIndex,
  qIndex,
}: {
  nestIndex: number;
  questionGroupIndex: number;
  qIndex: number;
}) => {
  const form = useFormContext();
  const { control, getValues, setValue } = form;
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    replace,
  } = useFieldArray({
    control,
    name: `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.options`,
  });

  const type = form.watch(
    `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.type`,
  ) as string;

  const isReadonlyOptions =
    type === "true_false_not_given" || type === "yes_no_not_given";

  useEffect(() => {
    if (type === "true_false_not_given") {
      const predefinedOptions = ["True", "False", "Not Given"];
      const currentOptions = getValues(
        `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.options`,
      );

      // Only replace if current options don't match predefined options
      const needsUpdate =
        !currentOptions ||
        currentOptions.length !== 3 ||
        !predefinedOptions.every(
          (option, idx) => option === currentOptions[idx],
        );

      if (needsUpdate) {
        replace(predefinedOptions);

        // Also reset answer key if it's not valid
        const currentAnswerKey = getValues(
          `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
        );

        if (!predefinedOptions.includes(currentAnswerKey)) {
          setValue(
            `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
            "True",
            { shouldDirty: true, shouldValidate: false },
          );
        }
      }
    } else {
      // For other question types, reset options if coming from true_false_not_given
      const currentOptions = getValues(
        `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.options`,
      );

      // Check if current options are from true_false_not_given
      const isTrueFalseOptions =
        currentOptions &&
        currentOptions.length === 3 &&
        currentOptions[0] === "True" &&
        currentOptions[1] === "False" &&
        currentOptions[2] === "Not Given";

      if (isTrueFalseOptions) {
        // Reset to default options for regular question types
        replace(["Option 1", "Option 2"]);
      } else if (!currentOptions || currentOptions.length === 0) {
        // Ensure we have at least one option for new questions
        replace(["Option 1"]);
      }

      // Reset answer key for type changes without immediate validation
      if (type === "choose_multiple_answer") {
        const currentAnswerKey = getValues(
          `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
        );
        if (!Array.isArray(currentAnswerKey)) {
          setValue(
            `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
            [],
            { shouldDirty: true, shouldValidate: false },
          );
        }
      } else if (type === "choose_correct_answer") {
        const currentAnswerKey = getValues(
          `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
        );
        if (
          Array.isArray(currentAnswerKey) ||
          (typeof currentAnswerKey === "string" &&
            ["True", "False", "Not Given"].includes(currentAnswerKey))
        ) {
          setValue(
            `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
            "",
            { shouldDirty: true, shouldValidate: false },
          );
        }
      }
    }
  }, [
    type,
    nestIndex,
    questionGroupIndex,
    qIndex,
    getValues,
    setValue,
    replace,
  ]);

  useEffect(() => {
    if (lastAddedIndex !== null && inputRefs.current[lastAddedIndex]) {
      const inputElement = inputRefs.current[lastAddedIndex];
      inputElement?.focus();
      inputElement?.select();
      setLastAddedIndex(null);
    }
  }, [optionFields.length, lastAddedIndex]);

  const handleAddOption = () => {
    if (!isReadonlyOptions) {
      const newIndex = optionFields.length;
      appendOption("");
      setLastAddedIndex(newIndex);
    }
  };

  const handleRemoveOption = (optIndex: number) => {
    if (!isReadonlyOptions && optionFields.length > 1) {
      removeOption(optIndex);

      // Update answer key if it references the removed option
      const currentAnswerKey = getValues(
        `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
      );

      if (
        type === "choose_multiple_answer" &&
        Array.isArray(currentAnswerKey)
      ) {
        const newAnswerKey = currentAnswerKey.filter(
          (key) =>
            key !==
            getValues(
              `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.options.${optIndex}`,
            ),
        );

        if (newAnswerKey.length !== currentAnswerKey.length) {
          setValue(
            `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
            newAnswerKey,
            { shouldDirty: true, shouldValidate: false },
          );
        }
      } else if (type === "choose_correct_answer") {
        const removedOptionValue = getValues(
          `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.options.${optIndex}`,
        );

        if (currentAnswerKey === removedOptionValue) {
          setValue(
            `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.answerKey`,
            "",
            { shouldDirty: true, shouldValidate: false },
          );
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {optionFields.map((field, optIndex) => (
        <div
          key={field.id}
          className="flex items-center justify-between gap-4 p-2.5"
        >
          <div className="flex flex-1 items-center gap-4">
            <Badge size={"icon"}>{String.fromCharCode(65 + optIndex)}</Badge>
            <FormField
              control={control}
              name={`passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}.options.${optIndex}`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      ref={(el) => {
                        inputRefs.current[optIndex] = el;
                      }}
                      readOnly={isReadonlyOptions}
                      placeholder={`Option ${optIndex + 1}`}
                      variant="ghost"
                      className={`w-full shadow-none ${
                        isReadonlyOptions ? "cursor-default" : ""
                      }`}
                      onFocus={(e) => {
                        if (!isReadonlyOptions) e.target.select();
                      }}
                      onBlur={(e) => {
                        if (!isReadonlyOptions) {
                          const value = e.target.value.trim();
                          if (!value) {
                            const fallback = `Option ${optIndex + 1}`;
                            field.onChange(fallback);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!isReadonlyOptions && (
            <Button
              size={"icon"}
              variant={"ghost"}
              type="button"
              onClick={() => handleRemoveOption(optIndex)}
              disabled={optionFields.length <= 1}
              className="[&_svg:not([class*='size-'])]:size-5"
            >
              <RiDeleteBack2Fill />
            </Button>
          )}
        </div>
      ))}
      {!isReadonlyOptions && (
        <div className="flex items-center gap-4 p-2.5">
          <Badge size={"icon"} className="border-[#787878] bg-transparent" />
          <Input
            onClick={handleAddOption}
            variant="ghost"
            placeholder="Add option"
            className="shadow-none"
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default OptionsFieldArray;
