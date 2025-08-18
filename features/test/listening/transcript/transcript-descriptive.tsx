import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface TranscriptDescriptiveParams<
  TFieldPrefixTranscript extends
    `passages.${number}.questionGroups.${number}.transcript`,
> {
  transcriptPath: TFieldPrefixTranscript;
}

const TranscriptDescriptive = <
  TFieldPrefixTranscript extends
    `passages.${number}.questionGroups.${number}.transcript`,
>({
  transcriptPath,
}: TranscriptDescriptiveParams<TFieldPrefixTranscript>) => {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-[25px]">
      {/* input title */}
      <Input
        placeholder="Type the title here..."
        className="card-custom bg-[#333333]"
        {...register(`${transcriptPath}.title`)}
      />
      {/* input description */}
      <textarea
        className="card-custom px-5 py-5"
        rows={10}
        placeholder="Type or paste the text here..."
        {...register(`${transcriptPath}.text`)}
      />
    </div>
  );
};

export default TranscriptDescriptive;
