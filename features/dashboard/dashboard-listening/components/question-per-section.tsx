import { FormValues } from "@/validators/create-test-listening-teacher";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { MdStarOutline } from "react-icons/md";
import { PiRectangleDashedFill } from "react-icons/pi";
import { QuestionRenderer } from "../../../test/components/question-renderer";
import { questionTemplates } from "../../../test/listening/types/question-templates";
import { SortableQuestion } from "./sortable-question";

interface QuestionsPerSectionProps {
  sectionIndex: number;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
  handleAppendSection: () => void;
  activeIndex: {
    section: number;
    question: number;
  } | null;
  setActiveIndex: React.Dispatch<
    React.SetStateAction<{ section: number; question: number } | null>
  >;
  // handleInsertSection: (sectionIndex: number) => void;
}

export const QuestionsPerSection = ({
  sectionIndex,
  control,
  setValue,
  watch,
  handleAppendSection,
  activeIndex,
  setActiveIndex,
  // handleInsertSection,
}: QuestionsPerSectionProps) => {
  const {
    fields: questionFields,
    remove,
    insert,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  // console.log("sectionIndex", sectionIndex);
  // console.log("questions", watch(`sections.${sectionIndex}.questions`));
  // console.log("WATCH: sections", watch("sections"));

  const handleDeleteQuestion = (questionIndex: number) => {
    if (questionFields.length > 1) {
      return remove(questionIndex);
    }
  };

  return (
    <SortableContext
      items={questionFields.map((q) => q.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="retative flex w-full flex-col gap-[25px]">
        {questionFields.map((question, questionIndex) => (
          <SortableQuestion
            key={question.id}
            id={question.id}
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
          >
            <div className="relative flex h-full w-full flex-col justify-center">
              <QuestionRenderer
                fieldPrefix={
                  `sections.${sectionIndex}.questions.${questionIndex}` as const
                }
                questionIndex={questionIndex}
                sectionIndex={sectionIndex}
                onRemove={() => handleDeleteQuestion(questionIndex)}
                onClick={() => {
                  if (
                    activeIndex?.section === sectionIndex &&
                    activeIndex?.question === questionIndex
                  ) {
                    setActiveIndex(null);
                  } else {
                    setActiveIndex({
                      section: sectionIndex,
                      question: questionIndex,
                    });
                  }
                }}
                isActive={
                  activeIndex?.section === sectionIndex &&
                  activeIndex.question === questionIndex
                }
              />

              {/* button add question pada soal */}
              {activeIndex?.section === sectionIndex &&
                activeIndex?.question === questionIndex && (
                  <div className="absolute -right-8 flex h-[248px] w-[61px] flex-col items-center justify-center gap-[18px] rounded-[30px] bg-[#E0E9D8]">
                    <button
                      type="button"
                      className="bg-primary flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full text-white"
                      onClick={() => {
                        console.log("question di click saat active");
                        const sections = watch("sections");
                        if (!sections?.[sectionIndex]) return; // prevent ghost append

                        insert(activeIndex.question + 1, {
                          ...questionTemplates["Choose_the_Correct_Answer"](),
                          id: crypto.randomUUID(),
                        });
                        setActiveIndex({
                          section: sectionIndex,
                          question: activeIndex.question + 1,
                        });
                      }}
                    >
                      <Plus className="size-[25px]" />
                    </button>

                    <button
                      type="button"
                      className="bg-primary flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full text-white"
                    >
                      <MdStarOutline className="size-[25px]" />
                    </button>

                    <button
                      type="button"
                      className="bg-primary flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full text-white"
                    >
                      <FaImage className="size-[25px]" />
                    </button>

                    <button
                      onClick={(e) => {
                        console.log("apeend", sectionIndex);
                        e.stopPropagation();
                        handleAppendSection();
                      }}
                      type="button"
                      className="bg-primary flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full text-white"
                    >
                      <PiRectangleDashedFill className="size-[25px]" />
                    </button>
                  </div>
                )}
            </div>
          </SortableQuestion>
        ))}
      </div>
    </SortableContext>
  );
};
