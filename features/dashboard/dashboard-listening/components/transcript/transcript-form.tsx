import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "@/validators/create-test-listening-teacher";
import { Controller, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import TranscriptConversation from "./transcript-conversation";
import TranscriptDescriptive from "./transcript-descriptive";

interface TranscriptFormParams {
  sectionIndex: number;
  removeSection: (index: number) => void;
}

const TranscriptForm = ({
  removeSection,
  sectionIndex,
}: TranscriptFormParams) => {
  const { control, watch, setValue } = useFormContext<FormValues>();

  const transcriptType = watch(`sections.${sectionIndex}.transcriptValue.name`);

  return (
    <>
      {/* Isi transcript pilihan select :  Conversation/Dialog atau Descriptive text  */}
      <div className="flex flex-col gap-[25px]">
        <div className="flex justify-between">
          <div className="flex items-center gap-[50px]">
            <div className="flex w-[159px] items-center justify-start border-r border-[#dedede]">
              <p className="typoSubHeadlines">Transcript</p>
            </div>

            {/* Pilih Transcript Type */}
            <Controller
              control={control}
              name={`sections.${sectionIndex}.transcriptValue.name`}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    const basePath =
                      `sections.${sectionIndex}.transcriptValue` as const;
                    if (val === "descriptive") {
                      setValue(basePath, {
                        name: "descriptive",
                        title: "",
                        description: "",
                      });
                    }

                    if (val === "conversation") {
                      setValue(basePath, {
                        name: "conversation",
                        title: "",
                        speakers: [
                          { name: "", inputs: [""] },
                          { name: "", inputs: [""] },
                        ],
                      });
                    }

                    if (val === "transcript") {
                      setValue(basePath, {
                        name: "transcript",
                        title: "",
                        description: "",
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-[#333333]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="descriptive">
                      Descriptive Text
                    </SelectItem>
                    <SelectItem value="conversation">
                      Conversation/Dialog
                    </SelectItem>
                    <SelectItem value="transcript">Transcript</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* hapus section */}
          <div className="flex items-center justify-end">
            <Button
              onClick={() =>
                // setAddTranscriptActive(false)
                removeSection(sectionIndex)
              }
              className="bg-transparent hover:bg-white/20"
            >
              <FaTrash className="size-[20px] text-red-500" />
            </Button>
          </div>
        </div>

        {/* transcript  descriptive*/}
        {transcriptType === "descriptive" && (
          <TranscriptDescriptive sectionIndex={sectionIndex} />
        )}

        {/* Trascript conversation */}
        {transcriptType === "conversation" && (
          <TranscriptConversation sectionIndex={sectionIndex} />
        )}
      </div>
    </>
  );
};

export default TranscriptForm;
