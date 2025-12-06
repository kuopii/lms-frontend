import TopicAreaExercise from "../exercise/component/topic-area";
import RewriteTextBox from "./components/rewrite-textbox";
import AnsweredTest from "./components/answered-test";

interface Props {
  testData?: {
    id?: string;
    type_test?: string;
    [key: string]: unknown;
  };
}

const BodyResults = ({ testData }: Props) => {
  const renderResults = () => {
    const type = testData?.type_test?.toLowerCase();

    switch (type) {
      case "reading":
        return <div></div>;
      case "listening":
        return <div></div>;
      case "writing":
        return (
          <div className="container mx-auto">
            <TopicAreaExercise />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <AnsweredTest />
              <RewriteTextBox />
            </div>
          </div>
        );
      case "speaking":
        return <div></div>;
      default:
        return <div>Unknown test type</div>;
    }
  };

  return renderResults();
};

export default BodyResults;
