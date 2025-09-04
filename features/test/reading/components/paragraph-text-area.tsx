"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const ParagraphTextArea: React.FC<{
  control: Control;
  questionPath: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onTextSelection: () => void;
}> = ({ control, questionPath, textareaRef, onTextSelection }) => (
  <FormField
    control={control}
    name={`${questionPath}.question_text`}
    render={({ field }) => (
      <FormItem className="w-full">
        <FormControl>
          <Textarea
            {...field}
            ref={textareaRef}
            className="min-h-64"
            variant="underline"
            placeholder="Type a sentence here, then select the word you want to make blank..."
            onSelect={onTextSelection}
            onMouseUp={onTextSelection}
            onKeyUp={onTextSelection}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
