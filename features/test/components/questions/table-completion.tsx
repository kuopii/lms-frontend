import { useFormContext } from "react-hook-form";
import QuestionBreakdown from "../question-breakdown";
import QuestionHeader from "../question-header";
import { ImagePreview } from "../question-image";
import { TableBuilder } from "../table-builder";

interface TableCompletionProps {
  qIndex: number;
  questionsPath: string;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
  globalNumber: number;
  canRemove: boolean;
}

const TableCompletion = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
  canRemove,
}: TableCompletionProps) => {
  const { watch } = useFormContext();
  const questionPath = `${questionsPath}.${qIndex}`;

  const currentImages = watch(
    `${questionsPath}.${qIndex}.question_data.images`,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          questionPath={questionPath}
          globalNumber={globalNumber}
          withNumber={false}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={currentImages}
            showActions={false}
            containerClassName="grid-cols-3 md:grid-cols-4"
          />
        </div>

        <TableBuilder
          qIndex={qIndex}
          onDuplicateQuestion={onDuplicateQuestion}
          questionsPath={questionsPath}
          onRemoveQuestion={onRemoveQuestion}
          canRemove={canRemove}
        />

        <QuestionBreakdown
          breakdownPath={`${questionsPath}.${qIndex}.breakdown`}
        />
      </div>
    </div>
  );
};

export default TableCompletion;
