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
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiDeleteBack2Fill } from "react-icons/ri";

type OptionType = {
  option_key: string;
  option_text: string;
};

const OptionFieldArray = ({
  questionsPath,
  variant = "editable",
  withNumber = true,
  placeholder = "",
  inputVariant = "ghost",
  answer,
  questionsPathAnswer,
}: {
  variant?: "editable" | "readonly";
  questionsPath: string;
  withNumber?: boolean;
  placeholder?: string;
  inputVariant?: "ghost" | "underline" | "default";
  answer: OptionType | OptionType[];
  questionsPathAnswer: string;
}) => {
  const form = useFormContext();
  const { control, watch } = form;
  const optionsData = watch(questionsPath) || [];
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  // Function to update option_keys after any change
  const updateOptionKeys = () => {
    const currentOptions = form.getValues(questionsPath) || [];
    const updatedOptions = currentOptions.map(
      (option: { option_key: string; option_text: string }, index: number) => ({
        ...option,
        option_key: indexToLetter(index),
      }),
    );
    form.setValue(questionsPath, updatedOptions);
  };
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: questionsPath,
  });

  useEffect(() => {
    if (lastAddedIndex !== null && inputRefs.current[lastAddedIndex]) {
      const inputElement = inputRefs.current[lastAddedIndex];
      inputElement?.focus();
      inputElement?.select();
      setLastAddedIndex(null);
    }
  }, [optionFields.length, lastAddedIndex]);

  const handleAddOption = () => {
    if (variant === "editable") {
      const newIndex = optionFields.length;
      const newOptionKey = indexToLetter(newIndex);
      appendOption({
        option_key: newOptionKey,
        option_text: "",
      });
      setLastAddedIndex(newIndex);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (variant === "editable") {
      removeOption(index);
      setTimeout(() => updateOptionKeys(), 0);
    }
  };

  function removeAnswerForOption(
    currentAnswer: OptionType | OptionType[],
    targetKey: string,
  ): OptionType | OptionType[] {
    if (Array.isArray(currentAnswer)) {
      // multiple answer
      return currentAnswer.filter((ans) => ans.option_key !== targetKey);
    } else {
      // correct answer
      if (currentAnswer.option_key === targetKey) {
        return { option_key: "", option_text: "" };
      }
      return currentAnswer;
    }
  }

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
                {optionsData[optIndex]?.option_key || indexToLetter(optIndex)}
              </Badge>
            )}
            <FormField
              control={control}
              name={`${questionsPath}.${optIndex}.option_text`}
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
              onClick={() => {
                if (optionFields.length > 0) {
                  const targetKey = optionsData[optIndex]?.option_key;
                  console.log("targetKey", targetKey);

                  form.setValue(
                    questionsPathAnswer,
                    removeAnswerForOption(answer, targetKey),
                  );
                }
                handleRemoveOption(optIndex);
              }}
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
