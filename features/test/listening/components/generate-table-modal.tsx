import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MdTableChart } from "react-icons/md";
import { QuestionDataSchema } from "../../form/create-listening-form";

interface GenerateTableModalProps {
  questionPath: string;
}

export function GenerateTableModal({ questionPath }: GenerateTableModalProps) {
  const { setValue, control, getValues } = useFormContext();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [open, setOpen] = useState(false);

  type Table = QuestionDataSchema["table"];
  const table = useWatch({
    control,
    name: `${questionPath}.question_data.table`,
  }) as Table;

  const handleGenerate = () => {
    const prev = getValues(`${questionPath}.question_data.table`) as
      | Table
      | undefined;

    // generate columns
    const finalColumns = Array.from({ length: cols }, (_, i) => {
      const colId = `cols${i + 1}`;
      const prevCol = prev?.columns.find((col) => col.id === colId);

      return {
        id: colId,
        label: prevCol?.label ?? `Column Name ${i + 1}`,
      };
    });

    const finalRows = Array.from({ length: rows }, (_, i) => {
      const rowId = `row${i + 1}`;
      const prevRow = prev?.rows.find((row) => row.id === rowId) ?? {
        id: rowId,
      };

      const newRows: any = { id: rowId };

      finalColumns.forEach((col) => {
        newRows[col.id] = prevRow[col.id] ?? "content";
      });

      return newRows;
    });

    const blanks = getValues(
      `${questionPath}.question_data.blanks`,
    ) as QuestionDataSchema["blanks"];

    const validColumnsId = finalColumns.map((col) => col.id);
    const finalBlanks =
      blanks?.filter((b) => validColumnsId?.includes(b.colId)) ?? [];

    setValue(`${questionPath}.question_data.table`, {
      columns: finalColumns,
      rows: finalRows,
    });
    setValue(`${questionPath}.question_data.blanks`, finalBlanks);

    setValue(
      `${questionPath}.correct_answer`,
      finalBlanks.map((e) => ({
        option_key: e.id,
        option_text: e.originalText,
      })),
    );

    const totalPoints = finalBlanks.reduce(
      (sum, e) => sum + Number(e.points),
      0,
    );
    setValue(`${questionPath}.points_value`, totalPoints);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"xsm"} className="font-normal">
          <MdTableChart className="size-[22px]" />
          Set Table Structure
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[30px] border-none">
        <DialogHeader>
          <DialogTitle>Set Table Dimension</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center space-y-4 px-[60px] py-[40px]">
          <div className="grid w-full grid-cols-2 items-center">
            <label className="block text-sm font-medium">
              Number of Columns
            </label>
            <Input
              className="focus-visible:ring-ring/0 border-primary focus-visible:border-primary rounded-[15px]"
              type="number"
              min={1}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />
          </div>
          <div className="grid w-full grid-cols-2 items-center">
            <label className="block text-sm font-medium">Number of Rows</label>
            <Input
              className="focus-visible:ring-ring/0 border-primary focus-visible:border-primary rounded-[15px]"
              type="number"
              min={1}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-center">
            <Button
              size={"xsm"}
              className="font-normal"
              onClick={handleGenerate}
            >
              <MdTableChart className="size-[22px]" />
              Generate Table
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
