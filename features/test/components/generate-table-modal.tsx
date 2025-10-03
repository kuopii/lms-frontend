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
import { useFormContext } from "react-hook-form";
import { MdTableChart } from "react-icons/md";
import { Table } from "../form/create-listening-form";

interface GenerateTableModalProps {
  questionPath: string;
  reindexTable: () => void;
}

const generateTable = (
  oldTable: Table,
  rows: number,
  cols: number,
): string[][] => {
  return Array.from({ length: rows }, (_, rowIndex) => {
    return Array.from({ length: cols }, (_, colIndex) => {
      if (rowIndex === 0) {
        return (
          oldTable?.[rowIndex]?.[colIndex] ?? `Columns Name${colIndex + 1}`
        );
      }
      return oldTable?.[rowIndex]?.[colIndex] ?? "content";
    });
  });
};

const filterCorrectAnswer = (
  correctAnswer: {
    option_key: string;
    option_text: string;
  }[],
  rows: number,
  cols: number,
) => {
  return correctAnswer.filter((ans) => {
    const [row, col] = ans.option_key.split("-").map(Number);
    return row < rows && col < cols;
  });
};

export function GenerateTableModal({
  questionPath,
  reindexTable,
}: GenerateTableModalProps) {
  const { setValue, getValues } = useFormContext();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [open, setOpen] = useState(false);

  const handleGenerate = () => {
    const oldTable = getValues(`${questionPath}.question_data.table`) ?? [];
    const oldAnswer = getValues(`${questionPath}.correct_answer`) ?? [];

    const newTable = generateTable(oldTable, rows, cols);
    const newAnswer = filterCorrectAnswer(oldAnswer, rows, cols);

    console.log("new Answer?", newAnswer);

    setValue(`${questionPath}.question_data.table`, newTable, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(`${questionPath}.correct_answer`, newAnswer, {
      shouldDirty: true,
      shouldValidate: true,
    });

    reindexTable();

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
