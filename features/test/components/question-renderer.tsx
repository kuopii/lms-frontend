"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import LazyImage from "@/components/imageReusable/base/LazyImage";
import { Separator } from "@/components/ui/separator";
import { Controller, useFormContext } from "react-hook-form";
import { CreateListeningTestSchema } from "../form/create-listening-form";
import { ChooseMultipleAnswers } from "../listening/components/templates-questions/choose-multiple-answers";
import { ChooseTheCorrectAnswer } from "../listening/components/templates-questions/choose-the-correct-answer";
import FormCompletion from "../listening/components/templates-questions/form-completion";
import MapLabeling from "../listening/components/templates-questions/map-labeling";
import NoteCompletion from "../listening/components/templates-questions/note-completion";
import { SentenceCompletion } from "../listening/components/templates-questions/sentence-completion";
import ShortAnswerQuestion from "../listening/components/templates-questions/short-answer-question";
import SummaryCompletion from "../listening/components/templates-questions/summary-completion";
import {
  Question,
  QuestionType,
  questionTypeLabels,
} from "../listening/types/question";
import { questionTemplates } from "../listening/types/question-templates";

const typeMap = {
  Choose_Multiple_Answers: ChooseMultipleAnswers,
  Choose_the_Correct_Answer: ChooseTheCorrectAnswer,
  Sentence_Completion: SentenceCompletion,
  Short_Answer_Question: ShortAnswerQuestion,
  Map_Labeling: MapLabeling,
  Form_Completion: FormCompletion,
  Note_Completion: NoteCompletion,
  Summary_Completion: SummaryCompletion,
  // test punya faiq dibawah
};

interface QuestionRendererProps<
  TFieldPrefix extends
    `passages.${number}.questionGroups.${number}.questions.${number}`,
> {
  questionIndex: number;
  onRemove: () => void;
  onClick?: () => void; // test opsional
  isActive?: boolean; // test opsional
  questionGroupIndex: number;
  fieldPrefix: TFieldPrefix;
}

export function QuestionRenderer<
  TFieldPrefix extends
    `passages.${number}.questionGroups.${number}.questions.${number}`,
>({
  questionIndex,
  onRemove,
  onClick,
  isActive,
  questionGroupIndex,
  fieldPrefix,
}: QuestionRendererProps<TFieldPrefix>) {
  const {
    register,
    setValue,
    watch,
    control,
    resetField,
    formState: { errors },
  } = useFormContext<CreateListeningTestSchema>(); // nanti coba gunakan type cek form lain

  const type = watch(`${fieldPrefix}.type`) as keyof typeof typeMap;
  const Renderer = typeMap[type];

  const handleTypeChange = (newType: QuestionType) => {
    const template = questionTemplates[newType]();
    Object.entries(template).forEach(([key, value]) => {
      setValue(
        `${fieldPrefix}.${key}` as `${typeof fieldPrefix}.${keyof Question}`,
        value,
      );
    });
  };

  // checking pertanyaan input
  const isPromptInput =
    type === "Choose_the_Correct_Answer" ||
    type === "Choose_Multiple_Answers" ||
    type === "Short_Answer_Question" ||
    type === "Map_Labeling" ||
    type === "Form_Completion";

  // checking pertanyaan yang dalam 1 soal memiliki beberapa pertanyaan
  const isQuestionCompletion =
    type === "Sentence_Completion" ||
    type === "Note_Completion" ||
    type === "Summary_Completion";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer space-y-[25px] rounded-[30px] bg-[#1A1A1A] px-[25px] pb-[25px] ${isActive ? "ring-primary ring-1" : ""}`}
    >
      <div className="card-custom flex flex-col gap-[25px] px-[20px] py-[20px]">
        {/* pertanyaan */}
        <div className="flex items-center justify-between gap-[30px] text-[22px]">
          {isPromptInput && (
            <>
              {typeof questionIndex === "number" && (
                <p className="text-primary">{questionIndex + 1}</p>
              )}
              <Input
                placeholder="Type your question here..."
                {...register(`${fieldPrefix}.prompt`)}
              />
              {/* <ErrorForm
                error={
                  (
                    (errors.sections?.[sectionIndex] as any).questions?.[
                      questionIndex
                    ] as any
                  )?.prompt
                }
              /> */}
            </>
          )}
          {isQuestionCompletion && (
            <div className="flex items-center gap-[25px] rounded-[30px] bg-[#DEDEDE] p-[10px]">
              <div className="relative h-[45px] w-[45px]">
                <LazyImage
                  src={"/icons/lamp.png"}
                  alt="english"
                  sizes="30px"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-wrap text-[16px] text-black">
                <p className="">
                  Select a word or phrase in the sentence and click
                  <span className="text-primary px-1">“Mark as Blank”</span>
                  to create a gap for students to fill.
                </p>
              </div>
            </div>
          )}
          {/* select type question */}
          <Controller
            control={control}
            name={`${fieldPrefix}.type`}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  handleTypeChange(val as QuestionType);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(questionTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Modular Renderer isi question*/}
        {Renderer ? (
          <Renderer
            questionIndex={questionIndex}
            questionGroupIndex={questionGroupIndex}
            fieldPrefix={fieldPrefix}
            onRemove={onRemove}
          />
        ) : null}
      </div>

      {/* Question Breakdown with Answer Explanation */}
      <div className="flex flex-col gap-[17px] rounded-[30px] bg-[#E0E9D8] p-[20px]">
        <h4 className="typoSubHeadlines text-primary">
          Question Breakdown with Answer Explanation
        </h4>
        <Separator className="bg-[#787878]" />
        <input
          className="h-[25px] text-black outline-none"
          placeholder="Type the answer explanation here..."
          {...register(`${fieldPrefix}.explanation`)}
        />
        {/* <ErrorForm
          error={
            (
              (errors.sections?.[sectionIndex] as any)?.questions?.[
                questionIndex
              ] as any
            )?.explanation
          }
        /> */}
      </div>
    </div>
  );
}
