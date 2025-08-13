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
import { FormValues } from "@/validators/create-test-listening-teacher";
import { Controller, useFormContext } from "react-hook-form";
import { Question, QuestionType, questionTypeLabels } from "../types/question";
import { questionTemplates } from "../types/question-templates";
import { ErrorForm } from "./error-form";
import { ChooseMultipleAnswers } from "./templates-questions/choose-multiple-answers";
import { ChooseTheCorrectAnswer } from "./templates-questions/choose-the-correct-answer";
import FormCompletion from "./templates-questions/form-completion";
import MapLabeling from "./templates-questions/map-labeling";
import NoteCompletion from "./templates-questions/note-completion";
import { SentenceCompletion } from "./templates-questions/sentence-completion";
import ShortAnswerQuestion from "./templates-questions/short-answer-question";
import SummaryCompletion from "./templates-questions/summary-completion";

const typeMap = {
  Choose_the_Correct_Answer: ChooseTheCorrectAnswer,
  Choose_Multiple_Answers: ChooseMultipleAnswers,
  Sentence_Completion: SentenceCompletion,
  Short_Answer_Question: ShortAnswerQuestion,
  Map_Labeling: MapLabeling,
  Form_Completion: FormCompletion,
  Note_Completion: NoteCompletion,
  Summary_Completion: SummaryCompletion,
  // etc
};

interface QuestionRendererProps<
  TFieldPrefix extends `sections.${number}.questions.${number}`,
> {
  questionIndex: number;
  onRemove: () => void;
  onClick: () => void;
  isActive: boolean;
  sectionIndex: number;
  fieldPrefix: TFieldPrefix;
}

export function QuestionRenderer<
  TFieldPrefix extends `sections.${number}.questions.${number}`,
>({
  questionIndex,
  onRemove,
  onClick,
  isActive,
  sectionIndex,
  fieldPrefix,
}: QuestionRendererProps<TFieldPrefix>) {
  const {
    register,
    setValue,
    watch,
    control,
    resetField,
    formState: { errors },
  } = useFormContext<FormValues>();

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
      className={`cursor-pointer space-y-[25px] rounded-[30px] bg-[#1A1A1A] px-[25px] pt-[45px] pb-[25px] ${isActive ? "ring-primary ring-1" : ""}`}
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
              <ErrorForm
                error={
                  (
                    (errors.sections?.[sectionIndex] as any).questions?.[
                      questionIndex
                    ] as any
                  )?.prompt
                }
              />
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
            sectionIndex={sectionIndex}
            fieldPrefix={fieldPrefix} // akan menggantikan questionIndex & sectionIndex
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
        <ErrorForm
          error={
            (
              (errors.sections?.[sectionIndex] as any)?.questions?.[
                questionIndex
              ] as any
            )?.explanation
          }
        />
      </div>
    </div>
  );
}
