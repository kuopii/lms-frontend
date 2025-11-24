import QuestionHeaderExercise from "../component/question-header";
import FormCompletionListening from "../questions/listening/form-completion";

interface Props {
  testData?: unknown;
}

const ListeningBodyExercise = ({ testData }: Props) => {
  // Check if data is missing or not an array
  if (!testData) {
    return <div className="container mx-auto">Loading...</div>;
  }

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4">
      <div className="w-full self-center md:w-4xl">
        <QuestionHeaderExercise />
      </div>
      <FormCompletionListening />
    </div>
  );
};

export default ListeningBodyExercise;
