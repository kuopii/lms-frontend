import ListeningBodyExercise from "../exercise/listening/body";
import ReadingBodyExercise from "../exercise/reading/body";
import SpeakingBodyExercise from "../exercise/speaking/body";
import WritingBodyExercise from "../exercise/writing/body";

interface Props {
  testData?: {
    type_test?: string;
    [key: string]: unknown;
  };
}

const BodyTest = ({ testData }: Props) => {
  if (!testData) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center">
        <p className="text-white">Loading test data...</p>
      </div>
    );
  }

  const renderExercise = () => {
    const type = testData.type_test?.toLowerCase();

    switch (type) {
      case "reading":
        return <ReadingBodyExercise testData={testData} />;
      case "listening":
        return <ListeningBodyExercise testData={testData} />;
      case "writing":
        return <WritingBodyExercise testData={testData} />;
      case "speaking":
        return <SpeakingBodyExercise />;
      default:
        return <div>Unknown test type</div>;
    }
  };

  return (
    <div className="overflow-hiding h-full text-base font-normal text-white">
      {renderExercise()}
    </div>
  );
};

export default BodyTest;
