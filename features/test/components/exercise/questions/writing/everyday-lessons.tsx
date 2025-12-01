import TextBoxExercise from "../../component/text-box";
import TopicAreaExercise from "../../component/topic-area";

const EverydayLessonsWriting = () => {
  return (
    <div className="flex flex-col gap-8">
      <TopicAreaExercise />
      <TextBoxExercise />
    </div>
  );
};

export default EverydayLessonsWriting;
