import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { GrSelect } from "react-icons/gr";
import { PiCopyFill } from "react-icons/pi";
import { AnswerKeyDialog } from "../../components/answer-key-dialog";
import PointsField from "../../components/points-field";
import { QuestionDataSchema } from "../../form/create-listening-form";

interface TableBuilderProps {
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  qIndex: number;
  onRemoveQuestion?: (index: number) => void;
  canRemove: boolean;
}

// type TableCompletion = InferQuestion<"table_completion">;
// type CorrectAnswer = TableCompletion["correct_answer"];
type Table = QuestionDataSchema["table"];
type Row = NonNullable<Table>["rows"][number];
type Blanks = NonNullable<QuestionDataSchema["blanks"]>[number];

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
  }) as Table;

  const blanks = useWatch({
    control,
    name: `${questionPath}.question_data.blanks`,
  }) as Blanks[];

  // sync form
  const syncForm = (newRows: Row[], updateBlank: Blanks[]) => {
    const currentTable = getValues(
      `${questionPath}.question_data.table`,
    ) as Table;

    const totalPoints = updateBlank.reduce(
      (sum, e) => sum + Number(e.points),
      0,
    );

    const rowsCopy = (newRows ?? currentTable?.rows ?? []).map((e) => ({
      ...e,
    }));
    console.log("rowsCopy ?", rowsCopy);

    updateBlank.forEach((blank, idx) => {
      const placeholder = `__${idx + 1}__`;
      const rowIndex = rowsCopy.findIndex((e) => e.id === blank.rowId);
      if (rowIndex !== -1) {
        rowsCopy[rowIndex] = {
          ...rowsCopy[rowIndex],
          [blank.colId]: placeholder,
        };
      }
    });

    setValue(`${questionPath}.points_value`, totalPoints);
    setValue(
      `${questionPath}.question_data.table`,
      {
        ...currentTable,
        // rows: newRows,
        rows: rowsCopy,
        columns: currentTable?.columns ?? [],
      },
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      `${questionPath}.correct_answer`,
      updateBlank.map((e) => ({
        option_key: e.id,
        option_text: e.originalText,
      })),
    );
    setValue(`${questionPath}.question_data.blanks`, updateBlank);
  };

  // handle toggle
  const markAsBlank = useCallback(() => {
    if (!lastFocusedKey.current) {
      alert("Please select a cell first");
      return;
    }

    const key = lastFocusedKey.current;
    const [rowId, colId] = key.split("|");
    const inputElement = inputRefs.current[key];

    if (!inputElement) return;

    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;

    if (start === end) {
      alert("Please select text to blank");
      return;
    }

    const tableData = getValues(
      `${questionPath}.question_data.table`,
    ) as QuestionDataSchema["table"];
    const blanks = getValues(
      `${questionPath}.question_data.blanks`,
    ) as QuestionDataSchema["blanks"];

    // === Jika cell sudah blankt
    if (
      inputElement.value.startsWith("__") &&
      inputElement.value.endsWith("__")
    ) {
      const blanksData = blanks?.find(
        (e) => e.rowId === rowId && e.colId === colId,
      );

      const original = blanksData?.originalText ?? "";

      const newRows =
        tableData?.rows.map((row) =>
          row.id === rowId ? { ...row, [colId]: original } : row,
        ) ?? [];

      const updateBlank =
        blanks?.filter((e) => !(e.rowId === rowId && e.colId === colId)) ?? [];
      syncForm(newRows, updateBlank);
      return;
    }

    // === Jika cell belum blank
    const originalText = inputElement.value.slice(start, end);
    const placeholder = `____`;

    const newRows =
      tableData?.rows.map((row) =>
        row.id === rowId ? { ...row, [colId]: placeholder } : row,
      ) ?? [];

    const newBlank = {
      id: `${rowId}|${colId}`,
      rowId,
      colId,
      originalText,
      points: 1,
    };
    const updateBlank = [...(blanks ?? []), newBlank];
    syncForm(newRows, updateBlank);
  }, [questionPath, getValues, syncForm]);

  // total points auto sync
  useEffect(() => {
    if (!blanks) return;
    const total = blanks.reduce((sum, b) => sum + (Number(b.points) ?? 0), 0);
    setValue(`${questionPath}.points_value`, total);
  }, [blanks, questionPath, setValue]);

  if (table?.columns.length === 0 && table?.rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No table generated yet.</p>
    );
  }

  return (
    <div className="max-h-72 overflow-y-auto pl-2">
      <table>
        {/* === Header === */}
        <thead>
          <tr>
            {table?.columns.map((col, colIndex) => (
              <th key={col.id}>
                <FormField
                  control={control}
                  name={`${questionPath}.question_data.table.columns.${colIndex}.label`}
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
          {table?.rows.map((row, rowIndex) => (
            <tr key={row.id}>
              {table.columns.map((col) => (
                <td key={col.id} className="py-2">
                  <FormField
                    control={control}
                    name={`${questionPath}.question_data.table.rows.${rowIndex}.${col.id}`}
                    render={({ field }) => {
                      const key = `${row.id}|${col.id}`;
                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="border-none text-center"
                              {...field}
                              ref={(el) => {
                                inputRefs.current[key] = el;
                              }}
                              onFocus={() => {
                                lastFocusedKey.current = key;
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
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
              {blanks && blanks.length > 0 ? (
                blanks.map((field, i) => (
                  <div className="flex items-center gap-4" key={field.id}>
                    <p className="w-[25px] border-r">{i + 1}</p>
                    <p className="w-40 truncate">{field.originalText}</p>

                    <FormField
                      control={control}
                      name={`${questionPath}.question_data.blanks.${i}.points`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(
                                  val === "" ? 0 : e.target.valueAsNumber,
                                );
                              }}
                              className="w-20 text-center"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
  );
};

export default TableBuilder;
