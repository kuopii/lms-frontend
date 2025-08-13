"use client";

import React from "react";
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
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { readingQuestionTypes } from "@/data/test-filter-options";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface QuestionHeaderProps {
  variant: "input" | "text" | "tips";
  qIndex: number;
  questionsPath?: string;
  typePath: string;
  withNumber?: boolean;
  className?: string;
  textHeader?: string;
  questionPlaceholder?: string;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  qIndex,
  questionsPath,
  questionPlaceholder = "Type your question here...",
  typePath,
  variant = "input",
  withNumber = true,
  className = "",
  textHeader = "",
}) => {
  const { control } = useFormContext();

  return (
    <div className={cn("flex items-center justify-between gap-7", className)}>
      {withNumber && (
        <span className="text-medium text-primary text-xl">{qIndex + 1}</span>
      )}
      <div className="flex w-full flex-1 flex-col items-center justify-between gap-4 md:flex-row">
        {variant === "input" && (
          <FormField
            control={control}
            name={questionsPath || ""}
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
          <div className="flex items-center gap-3 rounded-4xl bg-[#DEDEDE] px-4 py-2">
            <Image width={45} height={45} className="w-9 h-9" alt="tips" src="/icons/tips.svg" />
            <h4 className="text-black text-sm">
              Select a word or phrase in the sentence and click
              <span className="text-primary">“Mark as Blank”</span>
              to create a gap for students to fill.
            </h4>
          </div>
        )}
        <FormField
          control={control}
          name={typePath}
          render={({ field }) => (
            <FormItem className="w-full md:w-64">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Question Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {readingQuestionTypes.map((type) => (
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
