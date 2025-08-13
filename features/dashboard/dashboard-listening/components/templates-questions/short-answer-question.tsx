"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

const ShortAnswerQuestion = ({
  onRemove,
  fieldPrefix,
  sectionIndex,
}: Props) => {
  const [open, setOpen] = useState(false);

  const { control, register, watch, setValue } = useFormContext<FormValues>();
  const rawOptions = watch(`${fieldPrefix}.options`);
  const options = isStringArray(rawOptions) ? rawOptions : [];
  const RawAnswer = watch(`${fieldPrefix}.answer`);
  const answer = isStringArray(RawAnswer) ? RawAnswer : [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.options` as const,
  });

  const filteredOptions = options.filter((opt: string) => opt.trim() !== "");
  const isOptionsAvailable = filteredOptions.length > 0;
  const isChanged = !arrayEqual(filteredOptions, answer);

  const handleSelectAnswer = () => {
    setValue(`${fieldPrefix}.answer`, filteredOptions);
  };

  // hapus value answer jika optionsnya terhapus
  useEffect(() => {
    const validAnswer = answer.filter((ans) => options.includes(ans));
    if (validAnswer.length !== options.length) {
      setValue(`${fieldPrefix}.answer`, validAnswer);
    }
  }, [options]);

  // Tambah satu options awal kosong
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

  console.log("options??", options);
  console.log("panjang options??", options.length);
  console.log("filter options??", filteredOptions);
  console.log("panjang filter options??", filteredOptions.length);
  console.log("answer??", answer);

  return (
    <div className="space-y-4">
      {/* List Option */}
      {fields.map((field, optIndex) => (
        <div key={field.id} className="flex items-center gap-4">
          <div className="w-3/4 border-b border-white">
            <Input
              placeholder={"Type the correct answer here..."}
              {...register(`${fieldPrefix}.options.${optIndex}`)}
              className="focus-visible:border-ring focus-visible:ring-ring/0 border-none"
            />
          </div>

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
        + Add the correct answer
      </Button>

      {/* separator */}
      <Separator />

      <div className="flex w-full items-center justify-between">
        <AnswerKeyDialog
          open={open}
          setOpen={setOpen}
          triggerLabel="Answer Key"
          onSave={handleSelectAnswer}
          title="Correct Words for Each Blank"
          canSave={isOptionsAvailable && isChanged}
        >
          <div className="flex flex-col gap-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt: string, i: number) => {
                return (
                  <div className="flex flex-col gap-2" key={i}>
                    <div className="flex h-[41px] w-full items-center gap-[25px]">
                      <p className="w-[25px] border-r">{i + 1}</p>
                      <p className="w-full border-b">{opt}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm italic">
                No options available.
              </p>
            )}
          </div>
        </AnswerKeyDialog>

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
};

export default ShortAnswerQuestion;
