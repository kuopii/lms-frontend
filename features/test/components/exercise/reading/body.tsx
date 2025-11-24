import QuestionHeaderExercise from "../component/question-header";
import TextAreaExercise from "../component/text-area";
import MatchingHeadingExercise from "../questions/reading/matching-heading";

interface Props {
  testData?: unknown;
}
const ReadingBodyExercise = ({ testData }: Props) => {
  if (!testData) {
    return (
      <div className="container mx-auto flex items-center justify-between">
        Loading...
      </div>
    );
  }
  return (
    <div className="container mx-auto flex flex-col gap-10 px-4">
      <div className="w-full self-center md:w-4xl">
        <QuestionHeaderExercise />
      </div>
      <div className="container mx-auto grid grid-cols-1 justify-between gap-4 sm:grid-cols-2">
        <TextAreaExercise />
        <MatchingHeadingExercise />
      </div>
    </div>
  );
};

export default ReadingBodyExercise;
