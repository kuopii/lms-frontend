"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FormValues } from "@/validators/create-test-listening-teacher";
import { SquareDashedMousePointer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaDeleteLeft, FaTrash } from "react-icons/fa6";
import { arrayEqual } from "../../utils/arrray-equal";
import {
  isObjectOptionsArray,
  isStructuredAnswer,
} from "../../utils/is-object";
import { AnswerKeyDialog } from "../answer-key-dialog";

interface Props {
  onRemove: () => void;
  fieldPrefix: `sections.${number}.questions.${number}`;
}

export function SentenceCompletion({ onRemove, fieldPrefix }: Props) {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FormValues>();

  const [open, setOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.options` as const,
  });

  const rawOptions = watch(`${fieldPrefix}.options`);
  const options = isObjectOptionsArray(rawOptions);

  const rawAnswer = watch(`${fieldPrefix}.answer`);
  const answer = isStructuredAnswer(rawAnswer) ? rawAnswer : [];

  const filteredOptions = options.filter((opt) => opt.answer?.trim?.());
  const isOptionsAvailable = filteredOptions.length > 0;

  const isChanged = !arrayEqual(
    filteredOptions.map((opt: any) => opt.answer).filter(Boolean),
    answer.map((e) => e.word).filter(Boolean),
  );

  //    --------------- Test handle mark as blank
  const [selected, setSelected] = useState<{
    optIndex: number;
    wordIndex: number;
    word: string;
  } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleMarkAsBlank = () => {
    if (!selected) return;
    const { optIndex, wordIndex, word } = selected;

    const options = getValues(`${fieldPrefix}.options`) as {
      label: string;
      answer: string;
    }[];
    const currentLabel = options[optIndex].label || "";

    const words = currentLabel.split(" ");
    const isAlreadyBlank = words[wordIndex] === "____";
    const hasAlreadyBlank = words.includes("____");

    if (!isAlreadyBlank && hasAlreadyBlank) {
      alert("Only one blank is allowed per options.");
      return;
    }

    if (isAlreadyBlank) {
      const originalWord = options[optIndex]?.answer;
      if (!originalWord) return;

      // kembalikan orignal di options label
      words[wordIndex] = originalWord;
      setValue(`${fieldPrefix}.options.${optIndex}.label`, words.join(" "));

      // hapus dari options answer
      setValue(`${fieldPrefix}.options.${optIndex}.answer`, "");
      setValue(`${fieldPrefix}.answer`, []);
    } else {
      words[wordIndex] = "____";

      // set value ke options label dengan words yang sudah blank
      setValue(`${fieldPrefix}.options.${optIndex}.label`, words.join(" "));

      // masukkan kata yang di selected ke options answer
      setValue(`${fieldPrefix}.options.${optIndex}.answer`, word);
    }

    setSelected(null);
  };

  //    --------------- Test handle selection
  const handleSelection = (optIndex: number) => {
    // temukan posisi input options
    const input = inputRefs.current[optIndex];
    if (!input) return;

    // Ambil selection
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    // Ambil fulltext
    const fullOptions = getValues(`${fieldPrefix}.options`) as {
      label: string;
      answer: string;
    }[];
    const fullText = fullOptions?.[optIndex].label;

    // Split fulltext jadi kata
    const selectedText = fullText.slice(selectionStart, selectionEnd).trim();
    // hanya dapat memblock 1 kata
    if (selectedText.split(" ").length > 1) {
      alert("Please select only one word.");
      return;
    }

    // Hitung posisi awal setiap kata dan mapping
    const wordStartIndex: number[] = [];
    const words = fullText.split(" ");
    let currentIndex = 0;
    for (let i = 0; i < words.length; i++) {
      wordStartIndex.push(currentIndex);
      currentIndex += words[i].length + 1; // +1 untuk menghitung spasi
    }

    // Cari kata yang diblok user [awal index dan akhir index]
    const wordIndex = wordStartIndex.findIndex((start, idx) => {
      const end = start + words[idx].length;
      return selectionStart >= start && selectionEnd <= end;
    });

    if (wordIndex === -1 && words[wordIndex] !== selectedText) {
      alert("please select a valid single word");
      return;
    }
    // set selected
    setSelected({
      optIndex,
      word: selectedText,
      wordIndex,
    });
  };

  console.log("selected?:", selected);

  const handleSaveAnswer = () => {
    const options = getValues(`${fieldPrefix}.options`) as {
      label: string;
      answer: string;
    }[];

    const answerKey: {
      optIndex: number;
      wordIndex: number;
      word: string;
    }[] = [];

    options.forEach((opt, optIndex) => {
      if (!opt.answer) return;

      const words = opt.label.split(" ");
      const wordIndex = words.findIndex((w) => w === "____");
      if (wordIndex !== -1) {
        answerKey.push({
          optIndex,
          wordIndex,
          word: opt.answer,
        });
      }
    });

    setValue(`${fieldPrefix}.answer`, answerKey);
  };

  //  --------------------

  // tambah field options
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

  // menghapus answer jika options dihapus dan mapping answer key
  const optionsValues = getValues(`${fieldPrefix}.options`) as {
    label: string;
    answer: string;
  }[];

  const answerPreview = optionsValues
    .map((opt, optIndex) => {
      const wordIndex = opt.label?.split(" ").findIndex((w) => w === "____");
      if (!opt.answer || wordIndex === -1) return null;

      return (
        <div key={optIndex} className="flex gap-2">
          <p>{optIndex + 1}</p>
          <p>
            Answer : <strong>{opt.answer}</strong>
          </p>
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {fields.map((field, optIndex) => {
        return (
          <div key={field.id}>
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center gap-4">
                <Label className="flex h-1.5 w-1.5 rounded-full bg-white"></Label>
                <input
                  onMouseUp={(e) => {
                    inputRefs.current[optIndex] = e.currentTarget;
                    handleSelection(optIndex);
                  }}
                  placeholder="Type the sentence here..."
                  {...register(`${fieldPrefix}.options.${optIndex}.label`)}
                  className="w-3/4 border-b outline-none"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (fields.length > 0) {
                    // Hapus jawaban yang berhubungan dengan optIndex ini
                    const updatedAnswer = answer.filter(
                      (ans) => ans.optIndex !== optIndex,
                    );
                    setValue(`${fieldPrefix}.answer`, updatedAnswer);

                    // Hapus option-nya
                    remove(optIndex);
                  }
                }}
                className="hover:text-red-500"
              >
                <FaDeleteLeft className="size-[20px]" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={() => append("")}
        variant="secondary"
        className="bg-transparent text-white hover:bg-transparent hover:text-[#dedede]"
        disabled={options.some((opt) => opt.label.trim() === "")}
      >
        + Add Sentence
      </Button>

      <Separator />

      <div className="flex items-center gap-4">
        <Button
          onClick={handleMarkAsBlank}
          disabled={!selected}
          type="button"
          size="custom"
          variant="custom"
        >
          <SquareDashedMousePointer className="size-[20px]" /> Mark as Blank
        </Button>

        <div className="flex w-full items-center justify-between">
          <AnswerKeyDialog
            open={open}
            setOpen={setOpen}
            triggerLabel="Answer Key"
            canSave={isOptionsAvailable && isChanged}
            onSave={handleSaveAnswer}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                {answerPreview.length > 0 ? (
                  answerPreview
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No blanks selected.
                  </p>
                )}
              </div>
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
    </div>
  );
}
