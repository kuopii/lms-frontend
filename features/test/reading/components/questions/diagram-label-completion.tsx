"use client";

import React, { useState, useEffect } from "react";
import QuestionHeader from "../question-header";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import Image from "next/image";
import { Trash, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionBreakdown from "../question-breakdown";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";

type DiagramLabelCompletionProps = {
  questionsPath: string;
  qIndex: number;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
};

const DiagramLabelCompletion = ({
  questionsPath,
  qIndex,
  onDuplicateQuestion,
  onRemoveQuestion,
}: DiagramLabelCompletionProps) => {
  const [labelType, setLabelType] = useState<"alphabet" | "number">("alphabet");
  const { control, watch, setValue } = useFormContext();
  const imageValue = watch(`${questionsPath}.${qIndex}.image`) as string;

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `${questionsPath}.${qIndex}.items`,
  });

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  // Function to generate label based on index and type
  const generateLabel = (
    index: number,
    type: "alphabet" | "number",
  ): string => {
    if (type === "alphabet") {
      return String.fromCharCode(65 + index); // A, B, C, etc.
    } else {
      return (index + 1).toString(); // 1, 2, 3, etc.
    }
  };

  // Update all labels when labelType changes or items change
  useEffect(() => {
    itemFields.forEach((_, index) => {
      const newLabel = generateLabel(index, labelType);
      setValue(`${questionsPath}.${qIndex}.items.${index}.label`, newLabel);
    });
  }, [labelType, itemFields, setValue, questionsPath, qIndex]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue(`${questionsPath}.${qIndex}.image`, base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = () => {
    const newIndex = itemFields.length;
    const newLabel = generateLabel(newIndex, labelType);
    appendItem({ label: newLabel, answerKey: "" });
  };

  const handleLabelTypeChange = (value: "alphabet" | "number") => {
    setLabelType(value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          typePath={`${questionsPath}.${qIndex}.type`}
          withNumber={false}
          qIndex={qIndex}
          variant={"input"}
          questionPlaceholder="Type the map title here..."
          questionsPath={`${questionsPath}.${qIndex}.question`}
        />

        <FormField
          control={control}
          name={`${questionsPath}.${qIndex}.image`}
          render={() => (
            <FormItem className="w-full">
              <FormControl>
                {!imageValue ? (
                  <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
                    <span className="text-center text-[clamp(1rem,1.5vw,1.3rem)] font-medium text-white">
                      Attach Supporting Diagram/ Picture.
                    </span>
                    <label
                      className="mx-auto flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-transparent px-20 py-9 text-center"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, #DEDEDE 0 10px, transparent 10px 20px), repeating-linear-gradient(to left, #DEDEDE 0 10px, transparent 10px 20px), repeating-linear-gradient(to top, #DEDEDE 0 10px, transparent 10px 20px), repeating-linear-gradient(to bottom, #DEDEDE 0 10px, transparent 10px 20px)",
                        backgroundRepeat:
                          "repeat-x, repeat-x, repeat-y, repeat-y",
                        backgroundPosition:
                          "top left, bottom left, top left, top right",
                        backgroundSize:
                          "100% 2px, 100% 2px, 2px 100%, 2px 100%",
                      }}
                    >
                      <Upload className="mb-6 h-20 w-20 text-white" />
                      <p className="flex flex-col gap-1.5 font-medium text-white">
                        Drag and Drop here <br />
                        <span>or</span>
                        <span className="text-primary">Browse Files</span>
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    <p className="text-xs text-[#AAAAAA]">
                      Accepted file types: JPEG/JPG, PNG
                    </p>
                  </div>
                ) : (
                  <div className="relative mx-auto">
                    <Image
                      width={500}
                      height={300}
                      src={imageValue}
                      alt="Preview"
                      className="rounded-xl border border-white object-cover"
                    />
                    <Button
                      type="button"
                      size={"iconSm"}
                      variant={"destructive"}
                      className="absolute top-0 -right-11"
                      onClick={() =>
                        setValue(`${questionsPath}.${qIndex}.image`, "")
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mx-auto max-w-xl">
          {itemFields.map((field, index) => (
            <div className="mb-4 flex items-center gap-4" key={field.id}>
              <FormField
                control={control}
                name={`${questionsPath}.${qIndex}.items.${index}.label`}
                render={({ field }) => (
                  <FormItem className="w-full max-w-16">
                    <FormControl>
                      <Input
                        tabIndex={-1}
                        variant="underline"
                        {...field}
                        readOnly
                        placeholder="Type your statement here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`${questionsPath}.${qIndex}.items.${index}.answerKey`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        variant="underline"
                        {...field}
                        placeholder="Type the correct answer here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                size={"icon"}
                variant={"ghost"}
                type="button"
                tabIndex={-1}
                onClick={() => removeItem(index)}
                disabled={itemFields.length <= 1}
                className="[&_svg:not([class*='size-'])]:size-5"
              >
                <RiDeleteBack2Fill />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size={"xsm"}
            onClick={handleAddItem}
            className="mt-4 w-full"
            variant={"outline"}
          >
            Add the correct answer
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="hidden shrink-0 font-medium text-white md:block">
              Label Type:
            </p>
            <Select value={labelType} onValueChange={handleLabelTypeChange}>
              <SelectTrigger className="w-full max-w-72">
                <SelectValue placeholder="Pilih tipe label" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabet">Alphabet</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
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
      <QuestionBreakdown
        questionsPath={`${questionsPath}.${qIndex}.breakdown`}
      />
    </div>
  );
};

export default DiagramLabelCompletion;
