import ButtonShowExplanation from "./components/button-show-explanation";
import ScoreTest from "./components/score";
import SpeakingScore from "./components/speaking-score";
import SummaryCard from "./components/summary-card";
import OnlineTest from "@/public/images/online-test.png";
import Image from "next/image";

interface Props {
  testData?: {
    type_test?: string;
    [key: string]: unknown;
  };
}

const ResultsSummary = ({ testData }: Props) => {
  const renderSummary = () => {
    const type = testData?.type_test?.toLowerCase();

    switch (type) {
      case "reading":
        return (
          <div className="flex flex-col gap-[70px]">
            <span className="text-4xl font-bold text-white">
              Well done! You&apos;ve finished the test successfully.
            </span>
            <SummaryCard />
            <ScoreTest />
            <ButtonShowExplanation />
          </div>
        );
      case "listening":
        return (
          <div className="flex flex-col gap-[70px]">
            <span className="text-4xl font-bold text-white">
              Well done! You&apos;ve finished the test successfully.
            </span>
            <SummaryCard />
            <ScoreTest />
            <ButtonShowExplanation />
          </div>
        );
      case "writing":
        return (
          <div className="flex flex-col justify-between gap-[70px]">
            <span className="text-4xl font-bold text-white">
              Well done! You&apos;ve finished the test successfully.
            </span>
            <SummaryCard />
          </div>
        );
      case "speaking":
        return (
          <div className="flex flex-col justify-between gap-[70px]">
            <span className="text-4xl font-bold text-white">
              Well done! You&apos;ve finished the test successfully.
            </span>
            <SummaryCard />
            <SpeakingScore />
          </div>
        );
      default:
        return <div>Unknown test type</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {renderSummary()}
      <div className="hidden items-center justify-center lg:flex">
        <Image
          src={OnlineTest}
          alt="Online Test"
          className="mr-0 ml-auto w-[480px] object-contain"
        />
      </div>
    </div>
  );
};

export default ResultsSummary;
