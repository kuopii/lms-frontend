import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Minus, Plus } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreateListeningTestSchema } from "../../form/create-listening-form";

interface SpeakerInputsParams<
  TFieldPrefixTranscript extends
    `passages.${number}.questionGroups.${number}.transcript`,
> {
  transcriptPath: TFieldPrefixTranscript;
  speakerIdx: number;
}

const SpeakerInputs = <
  TFieldPrefixTranscript extends
    `passages.${number}.questionGroups.${number}.transcript`,
>({
  transcriptPath,
  speakerIdx,
}: SpeakerInputsParams<TFieldPrefixTranscript>) => {
  const { register, control } = useFormContext();

  const {
    fields: inputFields,
    remove: removeInput,
    append: appendInput,
    insert: insertInput,
  } = useFieldArray<CreateListeningTestSchema>({
    control,
    name: `${transcriptPath}.speakers.${speakerIdx}.inputs` as const,
  });

  // render options awal
  useEffect(() => {
    if (inputFields.length === 0) {
      appendInput({ text: "" });
    }
  }, [appendInput, inputFields.length]);

  const handleRemoveBuble = (inputIdx: number) => {
    if (inputFields.length > 1) {
      return removeInput(inputIdx);
    }
    return;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {inputFields.map((field, inputIdx) => {
        return (
          <div
            key={field.id}
            className={cn(
              "flex items-center",
              speakerIdx !== 0 && "flex-row-reverse",
            )}
          >
            <Input
              placeholder="Type the conversation here..."
              className="card-custom w-full border-none bg-[#666666] placeholder:text-white"
              {...register(
                `${transcriptPath}.speakers.${speakerIdx}.inputs.${inputIdx}.text`,
              )}
            />

            {/* delete / insert inputs  */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="cursor-pointer">
                  <EllipsisVertical />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-fit"
                align={`${speakerIdx === 0 ? "start" : "end"}`}
              >
                <div className="grid gap-4">
                  <div className="flex items-center justify-start">
                    <Button
                      className="flex w-60 justify-start"
                      variant={"custom"}
                      size={"custom"}
                      type="button"
                      onClick={() => {
                        insertInput(inputIdx + 1, { text: "" });
                      }}
                    >
                      <Plus className="size-[24px]" />
                      Add Bubble Text
                    </Button>
                  </div>
                  <div className="flex items-center justify-start">
                    <Button
                      className={cn(
                        "flex w-60 justify-start bg-[#DC3545]",
                        inputFields.length === 1 && "opacity-60",
                      )}
                      variant={"custom"}
                      type="button"
                      size={"custom"}
                      onClick={() => {
                        handleRemoveBuble(inputIdx);
                      }}
                    >
                      <Minus className="size-[24px]" />
                      Delete Bubble Text
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      })}
    </div>
  );
};

export default SpeakerInputs;
