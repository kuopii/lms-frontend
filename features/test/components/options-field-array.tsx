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
import { indexToLetter } from "@/helpers/index-to-letter";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Option } from "@/types/test";

const OptionFieldArray = ({
  variant = "editable",
  withNumber = true,
  placeholder = "",
  inputVariant = "ghost",
  questionPath,
  correctAnswerPath,
}: {
  variant?: "editable" | "readonly";
  withNumber?: boolean;
  placeholder?: string;
  inputVariant?: "ghost" | "underline" | "default";
  questionPath: string;
  correctAnswerPath?: string;
}) => {
  const { control, watch, getValues, setValue } = useFormContext();

  // Memoize paths untuk menghindari string concatenation berulang
  const paths = useMemo(
    () => ({
      options: `${questionPath}.options`,
      correctAnswer: correctAnswerPath || `${questionPath}.correct_answer`,
    }),
    [questionPath, correctAnswerPath],
  );

  const watchOptionsData = watch(paths.options) || [];
  const watchCorrectAnswer = watch(paths.correctAnswer);

  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: paths.options,
  });

  // Memoize function untuk update option keys
  const updateOptionKeys = useCallback(() => {
    const currentOptions = getValues(paths.options) || [];
    const updatedOptions = currentOptions.map(
      (option: Option, index: number) => ({
        ...option,
        option_key: indexToLetter(index),
      }),
    );
    setValue(paths.options, updatedOptions);
  }, [getValues, setValue, paths.options]);

  // Memoize function untuk remove answer
  const removeAnswerForOption = useCallback(
    (
      currentAnswer: Option | Option[],
      targetKey: string,
    ): Option | Option[] => {
      if (Array.isArray(currentAnswer)) {
        return currentAnswer.filter((ans) => ans.option_key !== targetKey);
      } else {
        return currentAnswer.option_key === targetKey
          ? { option_key: "", option_text: "" }
          : currentAnswer;
      }
    },
    [],
  );

  // Focus pada input yang baru ditambah
  useEffect(() => {
    if (lastAddedIndex !== null && inputRefs.current[lastAddedIndex]) {
      const inputElement = inputRefs.current[lastAddedIndex];
      inputElement?.focus();
      inputElement?.select();
      setLastAddedIndex(null);
    }
  }, [optionFields.length, lastAddedIndex]);

  const handleAddOption = () => {
    if (variant !== "editable") return;

    const newIndex = optionFields.length;
    const newOptionKey = indexToLetter(newIndex);
    appendOption({
      option_key: newOptionKey,
      option_text: "",
    });
    setLastAddedIndex(newIndex);
  };

  const handleRemoveOption = (index: number) => {
    if (optionFields.length === 0 || variant !== "editable") return;

    const targetKey = watchOptionsData[index]?.option_key;

    if (watchCorrectAnswer && targetKey) {
      setValue(
        paths.correctAnswer,
        removeAnswerForOption(watchCorrectAnswer, targetKey),
      );
    }

    removeOption(index);
    // Gunakan setTimeout untuk memastikan DOM sudah diupdate
    setTimeout(() => updateOptionKeys(), 0);
  };

  return (
    <div className="flex flex-col gap-5">
      {optionFields.map((field, optIndex) => (
        <div
          key={field.id}
          className="flex items-center justify-between gap-4 p-2.5"
        >
          <div className="flex flex-1 items-center gap-4">
            {withNumber && (
              <Badge size={"icon"}>
                {watchOptionsData[optIndex]?.option_key ||
                  indexToLetter(optIndex)}
              </Badge>
            )}
            <FormField
              control={control}
              name={`${paths.options}.${optIndex}.option_text`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      ref={(el) => {
                        inputRefs.current[optIndex] = el;
                      }}
                      readOnly={variant === "readonly"}
                      placeholder={placeholder || `Option ${optIndex + 1}`}
                      variant={inputVariant}
                      className={cn(
                        "w-full shadow-none",
                        variant === "readonly"
                          ? "cursor-default focus-visible:ring-0"
                          : "",
                      )}
                      onFocus={(e) => {
                        if (variant === "editable") e.target.select();
                      }}
                      onBlur={(e) => {
                        if (variant === "editable") {
                          const value = e.target.value.trim();
                          if (!value) {
                            const fallback =
                              placeholder || `Option ${optIndex + 1}`;
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

          {variant === "editable" && (
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

      {variant === "editable" && (
        <div className="flex items-center gap-4 p-2.5">
          {withNumber && (
            <Badge size={"icon"} className="border-[#787878] bg-transparent" />
          )}
          <Input
            onClick={handleAddOption}
            variant={inputVariant}
            placeholder={placeholder || "Add option"}
            className={cn("shadow-none")}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default OptionFieldArray;
