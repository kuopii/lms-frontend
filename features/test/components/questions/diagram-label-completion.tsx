"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import QuestionHeader from "../question-header";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import QuestionBreakdown from "../question-breakdown";
import { ImagePreview } from "../question-image";
import { Button } from "@/components/ui/button";
import PointsField from "../points-field";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";
import { Item } from "@/types/test";
import { RiDeleteBack2Fill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { indexToLetter } from "@/helpers/index-to-letter";

enum ValueOption {
  ALPHABET = "alphabet",
  NUMBER = "number",
  COSTUME = "costume",
}

const OPTION_KEYS = [
  { name: "Alphabet", value: ValueOption.ALPHABET },
  { name: "Number", value: ValueOption.NUMBER },
  { name: "Custom", value: ValueOption.COSTUME },
];

type DiagramLabelCompletionProps = {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
};

const generateOptionKey = (index: number, type: ValueOption): string => {
  switch (type) {
    case ValueOption.ALPHABET:
      return indexToLetter(index);
    case ValueOption.NUMBER:
      return (index + 1).toString();
    case ValueOption.COSTUME:
      return ""; // Empty for custom input
    default:
      return "";
  }
};

const createNewItem = (questionNumber: number, optionKey = "") => ({
  question_number: questionNumber,
  correct_answer: { option_key: optionKey, option_text: "" },
});

export const DiagramLabelCompletion = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}: DiagramLabelCompletionProps) => {
  const [optionKeyType, setOptionKeyType] = useState<ValueOption>(
    ValueOption.ALPHABET,
  );

  const { control, watch, setValue } = useFormContext();

  const questionPath = `${questionsPath}.${qIndex}`;
  const paths = {
    images: `${questionPath}.question_data.images`,
    items: `${questionPath}.items`,
    questionNumber: `${questionPath}.question_number`,
  };

  const watchImages = watch(paths.images);
  const watchQuestionNumber = watch(paths.questionNumber) as number;
  const watchItems = watch(paths.items) as Item[];

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  const {
    fields: itemsField,
    remove: removeItem,
    append: appendItem,
  } = useFieldArray({
    control,
    name: paths.items,
  });

  // Only useCallback for functions used in useEffect dependencies
  const updateQuestionNumbers = useCallback(() => {
    if (!watchItems?.length) return;

    const updatedItems = watchItems.map((item, index) => ({
      ...item,
      question_number: parseFloat(`${globalNumber}.${index + 1}`),
    }));

    const hasChanged = watchItems.some(
      (item, index) =>
        item.question_number !== parseFloat(`${globalNumber}.${index + 1}`),
    );

    if (hasChanged) {
      setValue(paths.items, updatedItems);
    }
  }, [watchItems, globalNumber, setValue, paths.items]);

  const updateOptionKeys = useCallback(() => {
    if (optionKeyType === ValueOption.COSTUME) {
      // For custom type, clear option keys to allow user input
      itemsField.forEach((_, index) => {
        setValue(`${paths.items}.${index}.correct_answer.option_key`, "");
      });
    } else {
      // For alphabet/number types, auto-generate keys
      itemsField.forEach((_, index) => {
        const newKey = generateOptionKey(index, optionKeyType);
        setValue(`${paths.items}.${index}.correct_answer.option_key`, newKey);
      });
    }
  }, [optionKeyType, itemsField, setValue, paths.items]);

  useEffect(() => {
    updateQuestionNumbers();
  }, [globalNumber, updateQuestionNumbers]);

  useEffect(() => {
    updateOptionKeys();
  }, [optionKeyType, updateOptionKeys]);

  // Regular functions for event handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setValue(paths.images, imageFiles);
    }
  };

  const handleFirstInsertItem = () => {
    const newItem = createNewItem(parseFloat(`${watchQuestionNumber}.1`), "A");
    appendItem(newItem);
  };

  const handleRemoveImage = (index: number) => {
    if (watchImages && Array.isArray(watchImages)) {
      const updatedImages = watchImages.filter((_, i) => i !== index);
      setValue(paths.images, updatedImages);
    }
  };

  const handleAddItem = () => {
    const newIndex = itemsField.length;
    const newOptionKey = generateOptionKey(newIndex, optionKeyType);
    const newItem = createNewItem(
      parseFloat(`${watchQuestionNumber}.${newIndex + 1}`),
      newOptionKey,
    );
    appendItem(newItem);
  };

  const handleRemoveItem = (index: number) => {
    removeItem(index);
  };

  const handleOptionKeyTypeChange = (value: ValueOption) => {
    setOptionKeyType(value);
  };

  const handleDuplicateQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicateQuestion?.(qIndex);
  };

  const handleRemoveQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveQuestion?.(qIndex);
  };

  const canRemoveItem = itemsField.length > 1;
  const hasItems = itemsField.length > 0;
  const shouldShowUpload =
    !watchImages || (Array.isArray(watchImages) && watchImages.length === 0);

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="input"
          questionPath={questionPath}
          globalNumber={globalNumber}
          questionPlaceholder="Type the map title here..."
          withNumber={false}
        />

        <FormField
          control={control}
          name={paths.images}
          render={() => (
            <FormItem className="w-full">
              <FormControl>
                {shouldShowUpload ? (
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
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-[#AAAAAA]">
                      Accepted file types: JPEG/JPG, PNG
                    </p>
                  </div>
                ) : null}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={watchImages}
            showActions={true}
            containerClassName="grid-cols-3 md:grid-cols-4"
            onRemove={handleRemoveImage}
          />
        </div>

        <Separator />

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row md:justify-between">
          {!hasItems ? (
            <Button
              type="button"
              size="xsm"
              variant="outline"
              className="w-full md:w-fit"
              onClick={handleFirstInsertItem}
            >
              <Plus />
              Create Items
            </Button>
          ) : (
            <div className="hidden md:block" />
          )}
          <div className="flex w-full items-center justify-between gap-2 md:w-fit">
            <PointsField questionPath={questionPath} />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="iconSm"
                variant="ghost"
                onClick={handleDuplicateQuestion}
                className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
              >
                <PiCopyFill />
              </Button>
              <Button
                size="iconSm"
                type="button"
                variant="ghost"
                onClick={
                  questionFields.length > 0 ? handleRemoveQuestion : undefined
                }
                className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {hasItems && (
        <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
          {itemsField.map((item, itemIndex) => (
            <div key={item.id} className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-4">
                  <FormField
                    control={control}
                    name={`${paths.items}.${itemIndex}.correct_answer.option_key`}
                    render={({ field }) => (
                      <FormItem className="w-full max-w-16">
                        <FormControl>
                          <Input
                            tabIndex={
                              optionKeyType === ValueOption.COSTUME ? 0 : -1
                            }
                            variant="underline"
                            {...field}
                            readOnly={optionKeyType !== ValueOption.COSTUME}
                            placeholder={
                              optionKeyType === ValueOption.COSTUME ? "Key" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`${paths.items}.${itemIndex}.correct_answer.option_text`}
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
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleRemoveItem(itemIndex)}
                  disabled={!canRemoveItem}
                  className="[&_svg:not([class*='size-'])]:size-5"
                >
                  <RiDeleteBack2Fill />
                </Button>
              </div>
            </div>
          ))}

          <Separator />

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Select
              value={optionKeyType}
              onValueChange={handleOptionKeyTypeChange}
            >
              <SelectTrigger className="w-full data-[size=default]:h-10 md:max-w-72">
                <SelectValue placeholder="Choose option type" />
              </SelectTrigger>
              <SelectContent>
                {OPTION_KEYS.map((key) => (
                  <SelectItem key={key.name} value={key.value}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="xsm"
              onClick={handleAddItem}
              className="w-full md:w-fit"
              variant="outline"
            >
              <Plus />
              Add item
            </Button>
          </div>
        </div>
      )}

      <QuestionBreakdown breakdownPath={`${questionPath}.breakdown`} />
    </div>
  );
};
