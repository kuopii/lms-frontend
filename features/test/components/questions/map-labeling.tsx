import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PointsField from "@/features/test/components/points-field";
import QuestionBreakdown from "@/features/test/components/question-breakdown";
import QuestionHeader from "@/features/test/components/question-header";
import { useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { PiCopyFill } from "react-icons/pi";

interface MapLabelingProps {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
  canRemove: boolean;
}

const MapLabeling = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
  canRemove,
}: MapLabelingProps) => {
  const { control, watch } = useFormContext();
  const questionPath = `${questionsPath}.${qIndex}`;

  const watchedAnswerKey = watch(`${questionPath}.correct_answer.0.option_key`);

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="text"
          questionPath={questionPath}
          globalNumber={globalNumber}
          textHeader="Add Question Labels and Answers"
        />
        <div className="flex items-center justify-between gap-4 py-3 md:flex-row md:py-5">
          <FormField
            name={`${questionPath}.question_text`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    variant="underline"
                    placeholder="Type the label here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <span>:</span>

          <FormField
            name={`${questionPath}.correct_answer.0`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    value={field.value?.option_key ?? ""}
                    onChange={(e) => {
                      const text = e.target.value;
                      field.onChange({
                        option_key: text,
                        option_text: text,
                      });
                    }}
                    variant="underline"
                    placeholder="Type the answer here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full items-center gap-2 md:w-fit">
            <span className="text-sm text-white/70">Answer: </span>
            <Badge
              className="flex-1 bg-white/10 text-white"
              size="lg"
              aria-label={`Answer: ${watchedAnswerKey || "Not set"}`}
            >
              {watchedAnswerKey || "-"}
            </Badge>
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
            <PointsField questionPath={questionPath} />

            <Button
              type="button"
              size="iconSm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateQuestion?.(qIndex);
              }}
              className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
            >
              <PiCopyFill />
            </Button>

            <Button
              size="iconSm"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveQuestion?.(qIndex);
              }}
              disabled={!canRemove}
              className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
            >
              <FaTrash />
            </Button>
          </div>
        </div>

        <QuestionBreakdown
          breakdownPath={`${questionsPath}.${qIndex}.breakdown`}
        />
      </div>
    </div>
  );
};

export default MapLabeling;
