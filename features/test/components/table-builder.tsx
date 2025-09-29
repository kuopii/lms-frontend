import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCallback, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { GrSelect } from "react-icons/gr";
import { PiCopyFill } from "react-icons/pi";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { InferQuestion, Table } from "../form/create-listening-form";
import { AnswerKeyDialog } from "./answer-key-dialog";
import { GenerateTableModal } from "./generate-table-modal";
import PointsField from "./points-field";

interface TableBuilderProps {
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  qIndex: number;
  onRemoveQuestion?: (index: number) => void;
  canRemove: boolean;
}

type TableCompletion = InferQuestion<"table_completion">;
type CorrectAnswer = TableCompletion["correct_answer"];

const TableBuilder = ({
  questionsPath,
  onDuplicateQuestion,
  qIndex,
  onRemoveQuestion,
  canRemove,
}: TableBuilderProps) => {
  const [open, setOpen] = useState(false);
  const { control, getValues, setValue } = useFormContext();
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const lastFocusedKey = useRef<string | null>(null);

  const questionPath = `${questionsPath}.${qIndex}`;

  const table = useWatch({
    control,
    name: `${questionPath}.question_data.table`,
  }) as Table | undefined;

  const correctAnswer = useWatch({
    control,
    name: `${questionPath}.correct_answer`,
  }) as CorrectAnswer;

  const reindexTable = useCallback(() => {
    const tableData = getValues(`${questionPath}.question_data.table`) as Table;
    const currentAnswer =
      (getValues(`${questionPath}.correct_answer`) as CorrectAnswer) ?? [];

    const newTable = tableData?.map((row, rowIdx) =>
      row.map((cell, cellIdx) => {
        const key = `${rowIdx}-${cellIdx}`;
        const idx = currentAnswer?.findIndex((a) => a.option_key === key);

        return idx !== -1 ? `__${idx + 1}__` : cell;
      }),
    );

    setValue(`${questionPath}.question_data.table`, newTable, {
      shouldDirty: true,
    });
    setValue(`${questionPath}.correct_answer`, currentAnswer, {
      shouldDirty: true,
    });
  }, [setValue, questionPath, getValues]);

  //  TOGGLE MARKS AS BLANK
  const markAsBlank = useCallback(() => {
    if (!lastFocusedKey.current) {
      toast.error("Please select a cell first");
      return;
    }

    const key = lastFocusedKey.current;
    console.log("key??", key);

    const [rStr, cStr] = key.split("-");

    const rowIndex = Number(rStr);
    const colIndex = Number(cStr);

    if (rowIndex === 0) {
      return;
    }

    const inputElement = inputRefs.current[key];

    if (!inputElement) return;

    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;

    if (start === end) {
      toast.error("Please select text to blank");
      return;
    }

    const tableData = getValues(`${questionPath}.question_data.table`) as Table;
    const prevAnswers =
      (getValues(`${questionPath}.correct_answer`) as CorrectAnswer) ?? [];

    const currentCell = tableData?.[rowIndex]?.[colIndex] ?? "";
    const existing = prevAnswers.find((a) => a.option_key === key);

    // === Jika cell sudah blank
    if (existing) {
      const filtered = prevAnswers.filter((ans) => ans.option_key !== key);

      //restore blank
      const restoreBlank = tableData?.map((row, rowIdx) =>
        row.map((cell, cellIdx) => {
          const key = `${rowIdx}-${cellIdx}`;
          const idx = existing.option_key === key;
          return idx ? existing.option_text : cell;
        }),
      );

      setValue(`${questionPath}.question_data.table`, restoreBlank, {
        shouldDirty: true,
      });

      setValue(`${questionPath}.correct_answer`, filtered, {
        shouldDirty: true,
      });
      reindexTable();
      return;
    } else {
      // Jika belum blank
      if (!currentCell) {
        toast.error("Cell is empty");
        return;
      }

      const selection = window.getSelection()?.toString() || currentCell;
      if (!selection) {
        toast.error("Please select text");
        return;
      }

      const newAnswer = [
        ...prevAnswers,
        { option_key: key, option_text: selection },
      ];

      setValue(`${questionPath}.correct_answer`, newAnswer, {
        shouldDirty: true,
      });
    }

    reindexTable();
  }, [reindexTable, questionPath, setValue, getValues]);

  const cols =
    table && table.length > 0
      ? Math.max(...table.map((row) => row.length), 0)
      : 0;

  return (
    <>
      <GenerateTableModal
        questionPath={questionPath}
        reindexTable={reindexTable}
      />

      {!table || table.length === 0 ? (
        <p className="text-muted-foreground text-sm">No table generated yet.</p>
      ) : (
        <div className="max-h-72 overflow-y-auto pl-2">
          <table>
            {/* === Header === */}
            <thead>
              <tr>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <th key={`h-${colIndex}`}>
                    <FormField
                      control={control}
                      name={`${questionPath}.question_data.table.0.${colIndex}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              className="border-r border-b text-center outline-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            {/* === Rows === */}
            <tbody>
              {table?.map((row, rowIndex) =>
                rowIndex === 0 ? null : (
                  <tr key={`r-${rowIndex}`}>
                    {Array.from({ length: cols }).map((_, colIndex) => {
                      const cellPath = `${questionPath}.question_data.table.${rowIndex}.${colIndex}`;
                      const key = `${rowIndex}-${colIndex}`;
                      return (
                        <td key={key} className="py-2">
                          <FormField
                            control={control}
                            name={cellPath}
                            render={({ field }) => {
                              return (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="border-none text-center"
                                      {...field}
                                      ref={(el) => {
                                        field.ref(el);
                                        inputRefs.current[key] = el;
                                      }}
                                      onFocus={() => {
                                        lastFocusedKey.current = key;
                                      }}
                                      // onChange={(e) => {
                                      //   const value = e.target.value;
                                      //   // kalau pattern blank rusak
                                      //   if (
                                      //     /^__\d+__$/.test(field.value) &&
                                      //     !/^__\d+__$/.test(value)
                                      //   ) {
                                      //     const filtered = correctAnswer.filter(
                                      //       (ans) => ans.option_key !== key,
                                      //     );
                                      //     reIndexBlanks(filtered);
                                      //     field.onChange(""); // reset cell kosong
                                      //   } else {
                                      //     field.onChange(value);
                                      //   }
                                      // }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>

          <Separator />

          <div className="flex w-full flex-col items-center justify-between gap-4 pt-3 md:flex-row">
            <div className="flex w-full items-center gap-4 md:w-fit">
              <Button
                size="xs"
                onClick={markAsBlank}
                className="flex-1 rounded-3xl md:w-fit [&_svg:not([class*='size-'])]:size-5"
                type="button"
                aria-label="Mark selected text as blank"
              >
                <GrSelect />
                Mark as Blank
              </Button>

              <AnswerKeyDialog
                open={open}
                setOpen={setOpen}
                triggerLabel="Answer Key"
                title="Correct Words for Each Blank"
              >
                <div className="flex flex-col gap-2">
                  {correctAnswer && correctAnswer.length > 0 ? (
                    correctAnswer.map((field, i) => (
                      <div
                        className="flex items-center gap-4"
                        key={field.option_key}
                      >
                        <p className="w-[25px] border-r">{i + 1}</p>
                        <p className="w-40 truncate">{field.option_text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      No options available.
                    </p>
                  )}
                </div>

                <div></div>
              </AnswerKeyDialog>
            </div>

            <div className="flex w-full items-center justify-between gap-4 md:w-fit">
              <PointsField questionPath={questionPath} />

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
                disabled={!canRemove}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveQuestion?.(qIndex);
                }}
                className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableBuilder;
