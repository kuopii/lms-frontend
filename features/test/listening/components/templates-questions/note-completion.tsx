import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnswerKeyDialog } from "@/features/test/components/answer-key-dialog";
import { CreateListeningTestSchema } from "@/features/test/form/create-listening-form";
import { SquareDashedMousePointer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { arrayEqual } from "../../utils/arrray-equal";
import {
  isObjectOptionsAnswerArray,
  isStructuredAnswer,
} from "../../utils/is-object";

type OptionAnswer = {
  optIndex: number;
  wordIndex: number;
  word: string;
};

interface Props {
  onRemove: () => void;
  fieldPrefix: `passages.${number}.questionGroups.${number}.questions.${number}`;
}

const NoteCompletion = ({ onRemove, fieldPrefix }: Props) => {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<CreateListeningTestSchema>();
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(
    [],
  );

  const [selected, setSelected] = useState<{
    optIndex: number;
    wordIndex: number;
    word: string;
  } | null>(null);

  const [open, setOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPrefix}.options` as const,
  });

  const rawOptions = watch(`${fieldPrefix}.options`);
  const options = isObjectOptionsAnswerArray(rawOptions);

  const rawAnswer = watch(`${fieldPrefix}.answer`);
  const answer = isStructuredAnswer(rawAnswer) ? rawAnswer : [];

  const filteredOptions = options.filter(
    (opt) =>
      Array.isArray(opt.answer) && opt.answer.some((a) => a.word?.trim()),
  );

  const isOptionsAvailable = filteredOptions.length > 0;

  // isChanged?
  const isChanged = !arrayEqual(
    filteredOptions
      .flatMap((opt: any) => opt.answer?.map((e: any) => e.word) || [])
      .filter(Boolean),
    answer.map((e) => e.word).filter(Boolean),
  );

  console.log("filteredOptions?", filteredOptions);
  console.log("isChanged?", isChanged);

  //    --------------- Test handle mark as blank
  const handleMarkAsBlank = () => {
    if (!selected) return;
    const { optIndex, wordIndex, word } = selected;

    const options = getValues(`${fieldPrefix}.options`) as {
      label: string;
      answer: OptionAnswer[];
    }[];
    const currentLabel = options[optIndex].label || "";

    const words = currentLabel.split(" ");
    const isAlreadyBlank = words[wordIndex] === "____";

    const cleanAnswerList = (
      answer: OptionAnswer[],
      currentWords: string[],
    ) => {
      return answer.filter((e) => currentWords[e.wordIndex] === "____");
    };

    if (isAlreadyBlank) {
      const originalWord = options[optIndex]?.answer.find(
        (e) => e.wordIndex === wordIndex,
      );
      if (!originalWord) return;

      // kembalikan orignal di options label
      words[wordIndex] = originalWord.word;
      setValue(`${fieldPrefix}.options.${optIndex}.label`, words.join(" "));

      // hapus dan update options answer
      const newOptionsAnswer = options[optIndex].answer.filter(
        (e) => e.wordIndex !== wordIndex,
      );
      setValue(
        `${fieldPrefix}.options.${optIndex}.answer`,
        cleanAnswerList(newOptionsAnswer, words),
      );

      // update global answer
      const currentAnswer = getValues(
        `${fieldPrefix}.answer`,
      ) as OptionAnswer[];
      const newAnswer = currentAnswer.filter(
        (a) => !(a.optIndex === optIndex && a.wordIndex === wordIndex),
      );
      setValue(`${fieldPrefix}.answer`, newAnswer);
    } else {
      words[wordIndex] = "____";

      // set value ke options label dengan words blank
      setValue(`${fieldPrefix}.options.${optIndex}.label`, words.join(" "));

      // masukkan kata yang di selected ke options answer
      const newOptionsAnswer = [
        ...(options[optIndex].answer ?? []).filter(
          (ans) => ans.wordIndex !== wordIndex,
        ),
        { optIndex, wordIndex, word },
      ];

      const filtered = cleanAnswerList(newOptionsAnswer, words);
      setValue(`${fieldPrefix}.options.${optIndex}.answer`, filtered);
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
      answer: OptionAnswer[];
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

  //    --------------- Test save answer

  const handleSaveAnswer = () => {
    const options = getValues(`${fieldPrefix}.options`) as {
      label: string;
      answer: OptionAnswer[];
    }[];

    const answerMap = new Map<string, OptionAnswer>();

    options
      .flatMap((opt) => opt.answer ?? [])
      .forEach((ans) => {
        if (ans && ans.word) {
          const key = `${ans.optIndex}-${ans.wordIndex}`;
          answerMap.set(key, ans);
        }
      });

    const answerKey = Array.from(answerMap.values());

    setValue(`${fieldPrefix}.answer`, answerKey);
  };

  // ------- useEffect
  // tambah field options
  const isAppended = useRef(false);
  useEffect(() => {
    if (fields.length === 0 && !isAppended.current) {
      append({ label: "", answer: [] });
      isAppended.current = true;
    }
  }, [fields, append]);

  // menghapus answer jika options dihapus dan mapping answer key
  const optionsValues = getValues(`${fieldPrefix}.options`) as {
    label: string;
    answer: OptionAnswer[];
  }[];

  const answerPreview = optionsValues
    .map((opt, optIndex) => {
      if (!opt.answer.length) return null;
      const words = opt.label?.split(" ") || [];

      const validAnswer = opt.answer.filter(
        (w) => words[w.wordIndex] === "____",
      );

      if (!validAnswer.length) return null;

      return (
        <div key={optIndex} className="flex flex-col gap-2">
          {opt.answer.map((e, idx) => {
            return (
              <div
                key={idx}
                className="flex h-[41px] w-full items-center gap-[25px]"
              >
                <p className="w-[25px] border-r">{idx + 1}</p>
                <p className="w-full border-b">
                  <strong>{e.word}</strong>
                </p>
              </div>
            );
          })}
        </div>
      );
    })
    .filter(Boolean);

  console.log("selected?", selected);

  return (
    <div className="space-y-4">
      {fields.map((field, optIndex) => {
        return (
          <div key={field.id}>
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center gap-4">
                <textarea
                  rows={20}
                  onMouseUp={(e) => {
                    inputRefs.current[optIndex] = e.currentTarget;
                    handleSelection(optIndex);
                  }}
                  placeholder="Type or paste the notes here..."
                  {...register(`${fieldPrefix}.options.${optIndex}.label`)}
                  className="w-full max-w-full rounded-[30px] border border-white/40 p-5"
                />
              </div>
            </div>
          </div>
        );
      })}

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
};

export default NoteCompletion;
