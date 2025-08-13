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
import { arrayEqual } from "../../utils/arrray-equal";
import { isStringArray } from "../../utils/is-array";
import { AnswerKeyDialog } from "../answer-key-dialog";

interface Props {
  questionIndex: number;
  onRemove: () => void;
  sectionIndex: number;
  fieldPrefix: `sections.${number}.questions.${number}`;
}

export function ChooseMultipleAnswers({
  questionIndex,
  onRemove,
  sectionIndex,
  fieldPrefix,
}: Props) {
  const { control, register, watch, setValue } = useFormContext<FormValues>();

  const rawOptions = watch(`${fieldPrefix}.options`);
  const options = isStringArray(rawOptions) ? rawOptions : [];

  const RawAnswer = watch(`${fieldPrefix}.answer`);
  const answer = isStringArray(RawAnswer) ? RawAnswer : [];

  console.log("options multi answer?", options);

  const [tempAnswer, setTempAnswer] = useState<string[]>(answer ?? []);
  const [open, setOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.options` as const,
  });

  const handleSelectAnswer = () => {
    setValue(`${fieldPrefix}.answer`, tempAnswer);
  };

  const filteredOptions = options.filter((opt: string) => opt.trim() !== "");
  const isOptions = filteredOptions.length > 0;
  const isAnswerSelected = tempAnswer.length > 0;
  const isChanged = !arrayEqual(tempAnswer, answer);

  // toggle pilihan pada answer key
  const toggleAnswer = (opt: string) => {
    if (tempAnswer.includes(opt)) {
      setTempAnswer(tempAnswer.filter((e) => e !== opt));
    } else {
      setTempAnswer([...tempAnswer, opt]);
    }
  };

  // menghapus nilai answer yang tersimpan (ketika answer pada options sudah dihapus)
  useEffect(() => {
    if (typeof answer === "string" && !options.includes(answer)) return;

    const validAnswer = tempAnswer.filter((ans) => options.includes(ans));
    if (validAnswer.length !== tempAnswer.length) {
      setValue(`${fieldPrefix}.answer`, validAnswer);
    }
  }, [options]);

  // render options awal
  useEffect(() => {
    if (fields.length === 0) {
      append(""); // Tambah satu kosong jika options awal kosong
    }
  }, [fields, append]);

  // render answer key saat diopen
  useEffect(() => {
    if (open) {
      setTempAnswer(answer); // Reset dari RHF answer ketika dialog dibuka
    }
  }, [open]);

  // console.log("isOptions", isOptions);
  console.log("answer di correct", answer);
  console.log("tempAnswer di correct", tempAnswer);

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
                const deleteOptions = options[optIndex];

                if (answer.includes(deleteOptions)) {
                  const updateAnswer = answer.filter(
                    (e) => e !== deleteOptions,
                  );
                  setValue(`${fieldPrefix}.answer`, updateAnswer);
                  setTempAnswer((prev) =>
                    prev.filter((e) => e !== deleteOptions),
                  );
                }

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
        disabled={options.some((opt: string) => opt.trim() === "")}
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
          <div className="flex gap-2">
            {filteredOptions.filter((opt: string) => opt.trim() !== "").length >
            0 ? (
              filteredOptions.map((opt: string, i: number) => {
                const isSelected = tempAnswer.includes(opt);
                return (
                  <Button
                    key={i}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleAnswer(opt)}
                    className={cn("justify-start", {
                      "bg-primary text-white": isSelected,
                    })}
                  >
                    {String.fromCharCode(97 + i).toUpperCase()}.{" "}
                    {opt || "(empty)"}
                  </Button>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No options available.
              </p>
            )}
          </div>
        </AnswerKeyDialog>

        {/* remove soal */}
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          className="hover:bg-muted-foreground/20 bg-transparent"
        >
          <FaTrash className="size-[20px] text-red-500" />
        </Button>
      </div>
    </div>
  );
}
