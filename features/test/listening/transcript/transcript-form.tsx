import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { CreateListeningTestSchema } from "../../form/create-listening-form";
import TranscriptConversation from "./transcript-conversation";
import TranscriptDescriptive from "./transcript-descriptive";

interface TranscriptFormParams {
  index: number;
  qgIndex: number;
  removePassage: (index: number) => void;
  isLast: boolean;
}

const TranscriptForm = ({
  removePassage,
  index,
  qgIndex,
  isLast,
}: TranscriptFormParams) => {
  const { control, watch, setValue } =
    useFormContext<CreateListeningTestSchema>();

  const transcriptType = watch(
    `passages.${index}.questionGroups.${qgIndex}.transcript.type`,
  );

  const transcriptPath =
    `passages.${index}.questionGroups.${qgIndex}.transcript` as const;

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
              name={`${transcriptPath}.type`}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    const basePath = `${transcriptPath}` as const;
                    if (val === "descriptive") {
                      setValue(basePath, {
                        type: "descriptive",
                        title: "",
                        text: "",
                      });
                    }

                    if (val === "conversation") {
                      setValue(basePath, {
                        type: "conversation",
                        title: "",
                        speakers: [
                          { name: "", inputs: [{ text: "" }] },
                          { name: "", inputs: [{ text: "" }] },
                        ],
                      });
                    }

                    if (val === "transcript") {
                      setValue(basePath, {
                        type: "transcript",
                        title: "",
                        text: "",
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
        </div>

        {/* transcript  descriptive*/}
        {transcriptType === "descriptive" && (
          <TranscriptDescriptive transcriptPath={transcriptPath} />
        )}

        {/* Trascript conversation */}
        {transcriptType === "conversation" && (
          <TranscriptConversation
            transcriptPath={transcriptPath}
            index={index}
          />
        )}
      </div>
    </>
  );
};

export default TranscriptForm;
