import QuestionHeaderExercise from "../component/question-header";
import EverydayLessonsWriting from "../questions/writing/everyday-lessons";

interface Props {
  testData?: unknown;
}

const WritingBodyExercise = ({ testData }: Props) => {
  // Check if data is missing or not an array
  if (!testData) {
    return <div className="container mx-auto">Loading...</div>;
  }

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4">
      <div className="w-full self-center md:w-4xl">
        <QuestionHeaderExercise />
      </div>
      <EverydayLessonsWriting />
    </div>
  );
};

export default WritingBodyExercise;
