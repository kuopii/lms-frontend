import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface TranscriptDescriptiveParams {
  sectionIndex: number;
}

const TranscriptDescriptive = ({
  sectionIndex,
}: TranscriptDescriptiveParams) => {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col gap-[25px]">
      {/* input title */}
      <Input
        placeholder="Type the title here..."
        className="card-custom bg-[#333333]"
        {...register(`sections.${sectionIndex}.transcriptValue.title`)}
      />
      {/* input description */}
      <textarea
        className="card-custom px-5 py-5"
        rows={10}
        placeholder="Type or paste the text here..."
        {...register(`sections.${sectionIndex}.transcriptValue.description`)}
      />
    </div>
  );
};

export default TranscriptDescriptive;
