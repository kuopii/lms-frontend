import AudioPlayer from "../exercise/component/audio-player";
import AnalyticsTable from "../results/analytics-table";
import AnswerKeyArea from "../results/answer-key-area";
import ListeningAnswer from "../results/listening-answer";
import FeedbackSummaryArea from "../results/feedback-summary-area";
import ReattemptsArea from "../results/reattempts-area";
import ResultsSummary from "../results/results-summary";
import SpeakingWritingCorrection from "../results/speaking-writing-correction";
import SuggestedRevision from "../results/suggested-revision";
import TaskOptionArea from "../results/task-option-area";
import VocabRemember from "../results/vocab-remember";

interface Props {
  testData?: {
    type_test?: string;
    [key: string]: unknown;
  };
}

const BodyResults = ({ testData }: Props) => {
  const renderResults = () => {
    switch (testData?.type_test) {
      case "reading":
        return (
          <div className="overflow-hiding container mx-auto mb-16 flex flex-col gap-[100px]">
            <ResultsSummary testData={testData} />
            <AnswerKeyArea />
            <AnalyticsTable />
          </div>
        );
      case "listening":
        return (
          <div className="overflow-hiding container mx-auto mb-16 flex flex-col gap-[100px]">
            <ResultsSummary testData={testData} />
            <ListeningAnswer />
            <AnalyticsTable />
          </div>
        );
      case "writing":
        return (
          <div className="overflow-hiding container mx-auto mb-16 flex flex-col gap-[100px]">
            <ResultsSummary testData={testData} />
            <TaskOptionArea />
            <FeedbackSummaryArea />
            <SpeakingWritingCorrection testData={testData} />
            <SuggestedRevision />
            <ReattemptsArea />
          </div>
        );
      case "speaking":
        return (
          <div className="overflow-hiding container mx-auto mb-16 flex flex-col gap-[100px]">
            <ResultsSummary testData={testData} />
            <AudioPlayer />
            <FeedbackSummaryArea />
            <SpeakingWritingCorrection testData={testData} />
            <ReattemptsArea />
            <VocabRemember />
          </div>
        );
      default:
        return <div>Unknown test type</div>;
    }
  };

  return renderResults();
};

export default BodyResults;
