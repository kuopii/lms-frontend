"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FormValues } from "@/validators/create-test-listening-teacher";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaDeleteLeft, FaTrash } from "react-icons/fa6";
import { isString, isStringArray } from "../../utils/is-array";
import { AnswerKeyDialog } from "../answer-key-dialog";
import { ErrorForm } from "../error-form";

interface Props {
  questionIndex: number;
  onRemove: () => void;
  sectionIndex: number;
  fieldPrefix: `sections.${number}.questions.${number}`;
}

export function ChooseTheCorrectAnswer({
  questionIndex,
  onRemove,
  sectionIndex,
  fieldPrefix,
}: Props) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();

  const rawOptions = watch(`${fieldPrefix}.options`);
  const options = isStringArray(rawOptions) ? rawOptions : [];

  const rawAnswer = watch(`${fieldPrefix}.answer`);
  // const answer = typeof rawAnswer === "string" ? rawAnswer : "";
  const answer = isString(rawAnswer) ? rawAnswer : "";

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.options` as const,
  });

  const [open, setOpen] = useState(false);
  const [tempAnswer, setTempAnswer] = useState(answer);

  const handleSelectAnswer = () => {
    setValue(`${fieldPrefix}.answer`, tempAnswer);
  };

  const filteredOptions = options.filter(
    (opt: string) => typeof opt === "string" && opt.trim() !== "",
  );

  const isOptions = filteredOptions.length > 0;
  const isChanged = answer?.trim() !== tempAnswer.trim();
  const isAnswerSelected =
    typeof tempAnswer === "string" && tempAnswer.trim() !== "";

  // toogle answer key
  const toogleAnswer = (opt: string) => {
    if (tempAnswer === opt) {
      setTempAnswer("");
    } else {
      setTempAnswer(opt);
    }
  };

  // menghapus nilai answer yang tersimpan (ketika options sudah dihapus)
  useEffect(() => {
    if (typeof answer === "string" && !options.includes(answer)) {
      setValue(`${fieldPrefix}.answer`, "");
    }
  }, [options]);

  // render options awal
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, []);

  // render answer key saat diopen
  useEffect(() => {
    if (open) {
      setTempAnswer(answer); // Reset dari RHF answer ketika dialog dibuka
    }
  }, [open, answer]);

  // console.log("isOptions", isOptions);

  const questionLength = watch(`sections.${sectionIndex}.questions`).length;

  return (
    <div className="space-y-4">
      {/* List Options */}
      {fields.map((field, optIndex) => (
        <div key={field.id} className="flex items-center gap-4">
          <Label className="flex h-6 w-7 items-center justify-center rounded-full bg-white text-[#787878]">
            {String.fromCharCode(97 + optIndex).toUpperCase()}
          </Label>
          <Input
            placeholder={`Option ${String.fromCharCode(97 + optIndex).toUpperCase()}`}
            {...register(`${fieldPrefix}.options.${optIndex}`)}
            className="border-none"
          />

          {/* remove options */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (fields.length > 0) {
                remove(optIndex);
              }
            }}
            className="hover:bg-transparent hover:text-red-500"
          >
            <FaDeleteLeft className="size-[20px]" />
          </Button>
        </div>
      ))}

      {/* Add Option */}
      <Button
        type="button"
        onClick={() => append("")}
        variant="secondary"
        className="hover:text-primary bg-transparent text-white hover:bg-transparent"
        disabled={options.some(
          (opt: string) => typeof opt === "string" && opt.trim() === "",
        )}
      >
        + Add Option
      </Button>

      {/* separator */}
      <Separator />

      {/* Answer Key dialog */}
      <div className="flex w-full items-center justify-between">
        <AnswerKeyDialog
          open={open}
          setOpen={setOpen}
          onSave={handleSelectAnswer}
          triggerLabel="Answer Key"
          canSave={isOptions && isAnswerSelected && isChanged}
        >
          <div className="flex flex-col gap-2">
            {filteredOptions.filter((opt: string) => opt.trim() !== "").length >
            0 ? (
              filteredOptions.map((opt: string, i: number) => (
                <Button
                  key={i}
                  variant={opt === tempAnswer ? "default" : "outline"}
                  onClick={() => toogleAnswer(opt)}
                  className={cn("justify-start", {
                    "bg-primary text-white": opt === tempAnswer,
                  })}
                >
                  {String.fromCharCode(97 + i).toUpperCase()}.{" "}
                  {opt || "(empty)"}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No options available.
              </p>
            )}
            <ErrorForm
              error={
                (
                  (errors.sections?.[sectionIndex] as any).questions?.[
                    questionIndex
                  ] as any
                )?.answer
              }
            />
          </div>
        </AnswerKeyDialog>

        {/* remove soal */}
        <Button
          disabled={questionLength === 1}
          type="button"
          variant="destructive"
          onClick={onRemove}
          className={cn(
            "hover:bg-muted-foreground/20 disabled:text-primary bg-transparent",
            questionLength === 1 && "cursor-not-allowed opacity-10",
          )}
        >
          <FaTrash className="size-[20px] text-red-500" />
        </Button>
      </div>
    </div>
  );
}
