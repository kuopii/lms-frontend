import { GenerateTableModal } from "../../listening/components/generate-table-modal";
import TableBuilder from "../../listening/components/table-builder";
import QuestionBreakdown from "../question-breakdown";
import QuestionHeader from "../question-header";

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
  const questionPath = `${questionsPath}.${qIndex}`;

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

        <GenerateTableModal questionPath={questionPath} />

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
