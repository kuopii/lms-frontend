import { Passage, Question, QuestionGroup } from "@/types/test";
import { CreateReadingTestSchema } from "../../form/create-reading-form";

const CleanedPayload = (values: CreateReadingTestSchema) => {
  return {
    ...values,
    passages: values.passages.map((p: Passage) => ({
      ...p,
      questionGroups: p.questionGroups.map((qg: QuestionGroup) => ({
        ...qg,
        questions: qg.questions.map((q: Question) => {
          if (q.question_type === "table_completion" && q.question_data) {
            const { blanks, ...question_data } = q.question_data;
            return { ...q, question_data };
          }
          return q;
        }),
      })),
    })),
  };
};

export default CleanedPayload;
