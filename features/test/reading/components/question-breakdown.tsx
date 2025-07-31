"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Pencil, Plus } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";

const QuestionBreakdown = ({
  index,
  nestIndex,
  questionGroupIndex,
}: {
  index: number;
  nestIndex: number;
  questionGroupIndex: number;
}) => {
  const form = useFormContext();
  const { control } = form;

  return (
    <div className="space-y-4 rounded-3xl bg-[#e4ecd7] p-3 md:p-4 lg:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-primary text-lg font-medium">
          Question Breakdown with Answer Explanation
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size={"xsm"}
            className="w-full rounded-full lg:w-fit"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Highlight Passage
          </Button>
          <Button
            type="button"
            size={"xsm"}
            variant="outline"
            className="border-primary hover:bg-primary w-full rounded-full text-[#333333] hover:text-white lg:w-fit"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vocabulary
          </Button>
        </div>
      </div>

      <Separator className="bg-[#787878]" />

      <FormField
        control={control}
        name={`passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${index}.breakdown`}
        render={({ field }) => (
          <FormControl>
            <Input
              {...field}
              placeholder="Type the answer explanation here..."
              variant="underline"
              className="border-b-none px-0 text-black shadow-none ring-0 focus-visible:border-none focus-visible:ring-0 active:border-none"
            />
          </FormControl>
        )}
      />
    </div>
  );
};

export default QuestionBreakdown;
