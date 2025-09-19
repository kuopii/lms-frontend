// components/answer-key-dialog.tsx

"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaCaretRight } from "react-icons/fa";

interface AnswerKeyDialogProps {
  title?: string;
  triggerLabel?: string;
  children: React.ReactNode;
  onSave?: () => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  canSave?: boolean;
}

export function AnswerKeyDialog({
  title = "Answer Key",
  triggerLabel = "Answer Key",
  children,
  open,
  setOpen,
}: AnswerKeyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-[30px] border bg-transparent"
          type="button"
          size="xs"
        >
          {triggerLabel}
          <FaCaretRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[30px] border-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
