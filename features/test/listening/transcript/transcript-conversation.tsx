import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaUser } from "react-icons/fa6";
import SpeakerInputs from "./speaker-inputs";

interface TranscriptConversationParams<
  TFieldPrefixTranscript extends
    `passages.${number}.questionGroups.${number}.transcript`,
> {
  transcriptPath: TFieldPrefixTranscript;
  index: number;
}

const TranscriptConversation = <
  TFieldPrefixTranscript extends
    `passages.${number}.questionGroups.${number}.transcript`,
>({
  transcriptPath,
}: TranscriptConversationParams<TFieldPrefixTranscript>) => {
  const { register, control } = useFormContext();

  const { fields: speakerFields } = useFieldArray({
    control,
    name: `${transcriptPath}.speakers` as const,
  });

  console.log("speakerFields ? :", speakerFields);

  return (
    <div className="flex flex-col gap-[25px]">
      {/* input title conversation*/}
      <div>
        <Input
          placeholder="Type the title here..."
          className="card-custom border-none bg-[#333333]"
          {...register(`${transcriptPath}.title`)}
        />
      </div>

      {/* transcript  conversation*/}
      <div className="card-custom flex w-full flex-col gap-[15px] border-none p-7">
        {speakerFields.map((_, speakerIdx) => {
          return (
            //   input speaker name and input conversations
            <div
              key={speakerIdx}
              className={`flex w-full ${speakerIdx === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={cn(
                  "flex w-1/2 items-center gap-[10px]",
                  speakerIdx !== 0 && "flex-row-reverse",
                )}
              >
                <div className="flex h-10 w-11 items-center justify-center rounded-full bg-white">
                  <FaUser className="size-[20px] text-black" />
                </div>

                <div className="flex w-full flex-col gap-1">
                  <Input
                    placeholder="Type the name here..."
                    className={cn(
                      "card-custom focus-visible:ring-ring/0 h-[20px] w-full border-none bg-[#333333] outline-none placeholder:text-white",
                      speakerIdx !== 0 && "text-right",
                    )}
                    {...register(
                      `${transcriptPath}.speakers.${speakerIdx}.name`,
                    )}
                  />

                  {/* speaker inputs */}
                  <div className="flex w-full flex-col">
                    <SpeakerInputs
                      transcriptPath={transcriptPath}
                      speakerIdx={speakerIdx}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptConversation;
