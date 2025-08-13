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
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiDeleteBack2Fill } from "react-icons/ri";

const OptionFieldArray = ({
  questionsPath,
  variant = "editable",
  withNumber = true,
  placeholder = "",
  inputVariant = "ghost",
}: {
  variant?: "editable" | "readonly";
  questionsPath: string;
  withNumber?: boolean;
  placeholder?: string;
  inputVariant?: "ghost" | "underline" | "default";
}) => {
  const form = useFormContext();
  const { control } = form;
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);
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
      appendOption("");
      setLastAddedIndex(newIndex);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (variant === "editable") {
      removeOption(index);
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
            {withNumber && (
              <Badge size={"icon"}>{String.fromCharCode(65 + optIndex)}</Badge>
            )}
            <FormField
              control={control}
              name={`${questionsPath}.${optIndex}`}
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
