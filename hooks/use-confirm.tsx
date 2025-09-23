import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import React, { JSX, useState } from "react";

export const useConfirm = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const Confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => {
    return (
      <Dialog
        open={promise !== null}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogClose onClick={handleCancel} />
        <DialogContent className="border-[0.5px] border-[#a1a1a1]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">{title}</DialogTitle>
            <DialogDescription className="text-foreground text-base">
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button size={"xs"} onClick={handleCancel} variant={"outline"}>
              Cancel
            </Button>
            <Button size={"xs"} onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmDialog, Confirm];
};
