"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AnswerKeyDialog } from "@/features/test/components/answer-key-dialog";
import { CreateListeningTestSchema } from "@/features/test/form/create-listening-form";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaDeleteLeft, FaTrash } from "react-icons/fa6";
import { arrayEqual } from "../../utils/arrray-equal";
import { isStringArray } from "../../utils/is-array";
import { isObjectOptionsArray } from "../../utils/is-object";

interface Props {
  questionIndex: number;
  onRemove: () => void;
  fieldPrefix: `passages.${number}.questionGroups.${number}.questions.${number}`;
}

const FormCompletion = ({ onRemove, fieldPrefix }: Props) => {
  const [open, setOpen] = useState(false);

  const { control, register, watch, setValue } =
    useFormContext<CreateListeningTestSchema>();

  const rawOptions = watch(`${fieldPrefix}.options`);
  const options = isObjectOptionsArray(rawOptions);

  const rawAnswer = watch(`${fieldPrefix}.answer`);
  const answer = isStringArray(rawAnswer) ? rawAnswer : [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.options` as const,
  });

  const filteredOptions = options.filter((opt) => opt.answer?.trim?.());

  const isOptionsAvailable = filteredOptions.length > 0;
  const isChanged = !arrayEqual(
    filteredOptions.map((opt: any) => opt.answer).filter(Boolean),
    answer,
  );

  const handleSelectAnswer = () => {
    const answerKey = filteredOptions.map((opt) => opt.answer.trim());
    setValue(`${fieldPrefix}.answer`, answerKey);
  };

  // hapus value answer jika optionsnya terhapus
  useEffect(() => {
    const currentAnswer = isStringArray(rawAnswer) ? rawAnswer : [];
    const optionAnswers = options.map((opt) => opt.answer);
    const validAnswer = currentAnswer.filter((ans) =>
      optionAnswers.includes(ans),
    );

    if (!arrayEqual(currentAnswer, validAnswer)) {
      setValue(`${fieldPrefix}.answer`, validAnswer);
    }
  }, [rawOptions]);

  // Tambah satu options awal kosong
  const isAppended = useRef(false);
  useEffect(() => {
    if (fields.length === 0 && !isAppended.current) {
      append([]);
      isAppended.current = true;
    }
  }, [append, fields]);

  console.log("options??", options);
  console.log("answer??", answer);
  console.log("fields.length??", fields.length);

  return (
    <div className="space-y-4">
      {/* Image */}
      <div className="flex flex-col justify-between">
        {/* List Question */}
        {fields.map((field, optIndex) => (
          <div key={field.id} className="flex items-center gap-4">
            <div className="flex w-full gap-2 border-white">
              <div className="flex w-1/2 items-center">
                <p className="rounded-full bg-[#dedede] px-[10px] py-[2px] text-[#787878]">
                  {optIndex + 1}
                </p>
                <Input
                  placeholder={"Type the question here..."}
                  {...register(`${fieldPrefix}.options.${optIndex}.label`)}
                  className="border-muted rounded-none border-0 border-b focus:border-b focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                />
              </div>

              <div className="flex w-1/2 items-center border-dashed">
                <span>:</span>
                <Input
                  placeholder={"Type the answer here..."}
                  {...register(`${fieldPrefix}.options.${optIndex}.answer`)}
                  className="border-muted rounded-none border-0 border-b border-dashed focus:border-b focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                />
              </div>
            </div>

            {/* remove options */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (fields.length > 0) {
                  // Hapus dari answer jika match
                  const removed = options[optIndex]?.answer;
                  if (removed && answer.includes(removed)) {
                    const updatedAnswer = answer.filter((a) => a !== removed);
                    setValue(`${fieldPrefix}.answer`, updatedAnswer);
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
      </div>

      {/* Add Option */}
      <div>
        <Button
          type="button"
          onClick={() => append({ label: "", answer: "" })}
          variant="secondary"
          className="hover:text-primary bg-transparent text-white hover:bg-transparent"
          disabled={options.some((opt) => opt?.answer.trim() === "")}
        >
          + Add the correct answer
        </Button>
      </div>

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
              filteredOptions.map((opt, i) => {
                return (
                  <div className="flex flex-col gap-2" key={i}>
                    <div className="flex h-[41px] w-full items-center gap-[25px]">
                      <p className="w-[25px] border-r">{i + 1}</p>
                      <p className="w-full border-b">{opt.answer}</p>
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

export default FormCompletion;
