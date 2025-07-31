"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaFileImport, FaTrash } from "react-icons/fa";
import { ScanText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import dynamic from "next/dynamic";

const QuestionsSection = dynamic(() => import("./questions-section"), {
  ssr: false,
});

type PassageSectionProps = {
  index: number;
  onRemove?: (index: number) => void;
  isLast: boolean;
  onAddPassage: () => void; // Add this prop
};

export const PassageSection = ({
  index,
  onRemove,
  isLast,
  onAddPassage,
}: PassageSectionProps) => {
  const form = useFormContext();

  const { fields: questionGroupFields } = useFieldArray({
    control: form.control,
    name: `passages.${index}.questionGroups`,
  });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-xl font-medium text-white">
            Passage {index + 1}
          </h3>
          <div className="h-10">
            <Separator orientation="vertical" className="mx-8" />
          </div>
          <div className="flex items-center gap-4">
            <Button type="button" size="xsm">
              <FaFileImport />
              Import File
            </Button>
            <Button type="button" size="xsm">
              <ScanText />
              OCR
            </Button>
          </div>
        </div>
        <Button
          size="iconSm"
          variant="ghost"
          className="text-destructive"
          onClick={() => onRemove?.(index)}
          disabled={isLast}
        >
          <FaTrash />
        </Button>
      </div>

      <FormField
        control={form.control}
        name={`passages.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Judul Passage</FormLabel>
            <FormControl>
              <Input
                placeholder="Type the title of the passage here..."
                className="border-none bg-[#333333]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`passages.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi Passage</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Type or paste the text here..."
                className="min-h-64 border-none bg-[#333333]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {questionGroupFields.map((qg, qgIndex) => (
        <React.Fragment key={qg.id}>
          <section className="bg-primary my-14 rounded-3xl p-5">
            <h4 className="mb-5 text-xl font-medium text-white">
              Question Instructions
            </h4>
            <FormField
              control={form.control}
              name={`passages.${index}.questionGroups.${qgIndex}.instruction`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      variant="underline"
                      className="px-0 placeholder:text-white"
                      placeholder="Type instruction for this question type here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <QuestionsSection
            onAddPassage={onAddPassage}
            nestIndex={index}
            questionGroupIndex={qgIndex}
          />
        </React.Fragment>
      ))}
    </section>
  );
};
