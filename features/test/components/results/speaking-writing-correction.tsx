import DetailMisatake from "./components/detail-mistake";
import GrammerReview from "./components/grammer-review";
import SpeakingSkills from "./components/speaking-skills";
import WritingSkills from "./components/writing-skills";

interface Props {
  testData?: {
    type_test?: string;
    [key: string]: unknown;
  };
}

const SpeakingWritingCorrection = ({ testData }: Props) => {
  const renderComponents = () => {
    switch (testData?.type_test) {
      case "writing":
        return (
          <div className="grid grid-cols-1 gap-10 text-white xl:grid-cols-2">
            <WritingSkills />
            <DetailMisatake />
          </div>
        );
      case "speaking":
        return (
          <div className="grid grid-cols-1 gap-10 text-white xl:grid-cols-2">
            <SpeakingSkills />
            <GrammerReview />
          </div>
        );
      default:
        return <div>Unknown test type</div>;
    }
  };

  return renderComponents();
};

export default SpeakingWritingCorrection;
