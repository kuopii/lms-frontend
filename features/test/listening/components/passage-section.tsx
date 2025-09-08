"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question, QuestionType } from "@/types/test";
import dynamic from "next/dynamic";
import React, { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { defaultListeningQuestion } from "../../constant/default-listening-question";
import TranscriptForm from "../transcript/transcript-form";
import { AudioDropzone } from "./audio-dropzone";
import { ImageDropzone } from "./image-dropzone";

const QuestionsSection = dynamic(() => import("./questions-section"), {
  ssr: false,
});

type PassageSectionProps = {
  index: number;
  onRemove: (index: number) => void;
  isLast: boolean;
  onAddPassage: () => void;
};

type QuestionGroup = {
  instruction: string;
  transcript: { type: string; text: string; title: string };
  image: { title: string; file: File | null };
  questions: Question[];
};

export const PassageSection = ({
  index,
  onRemove,
  isLast,
  onAddPassage,
}: PassageSectionProps) => {
  const { control, watch } = useFormContext();

  const {
    fields: questionGroupFields,
    append: appendQuestionGroup,
    remove: removeQuestionGroup,
  } = useFieldArray({
    control: control,
    name: `passages.${index}.questionGroups`,
  });

  const handleAddQuestionGroup = useCallback(
    (defaultQuestion: QuestionType) => {
      appendQuestionGroup({
        instruction: "",
        transcript: { type: "descriptive", text: "", title: "" },
        image: {
          title: "",
          file: null,
        },
        questions: [
          defaultListeningQuestion[defaultQuestion || "choose_correct_answer"],
        ],
      });
    },
    [appendQuestionGroup],
  );

  const handleRemoveQuestionGroup = useCallback(
    (qgIndex: number) => {
      if (questionGroupFields.length > 1) {
        removeQuestionGroup(qgIndex);
      }
    },
    [questionGroupFields.length, removeQuestionGroup],
  );

  const questionGroups = watch(
    `passages.${index}.questionGroups`,
  ) as QuestionGroup[];

  return (
    <section className="space-y-25">
      {/* Audio Dropzone */}
      <div className="flex w-full flex-col gap-[45px]">
        <div className="flex justify-between">
          <div className="flex gap-[50px]">
            <div className="flex w-[156px] items-center justify-start border-r border-[#dedede]">
              <p className="typoSubHeadlines">Section {index + 1}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="typoSubHeadlines mb-2 text-white">
                Upload and Attach Audio
              </p>
              <p className="text-[16px] text-[#DEDEDE]">
                Add listening material to enhance your questions.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              disabled={isLast}
              onClick={() => onRemove(index)}
              className="bg-transparent hover:bg-white/20"
            >
              <FaTrash className="size-[20px] text-red-500" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <AudioDropzone index={index} />
          <p className="text-[12px] text-[#aaaaaa]">Accepted file types: MP3</p>
        </div>
      </div>

      {questionGroupFields.map((qg, qgIndex) => {
        const currentGroup = questionGroups[qgIndex];

        return (
          <React.Fragment key={qg.id}>
            <section className="rounded-3xl">
              <div className="flex w-full flex-col gap-[50px]">
                {/* Add Transcript */}
                <div>
                  <TranscriptForm
                    qgIndex={qgIndex}
                    removePassage={onRemove}
                    index={index}
                    isLast={isLast}
                  />
                </div>
              </div>
            </section>

            <div className="bg-primary my-14 rounded-3xl p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h4 className="text-xl font-medium text-white">
                  Question Instructions
                </h4>
                {questionGroupFields.length > 1 && (
                  <Button
                    size="iconSm"
                    variant="ghost"
                    type="button"
                    className="text-destructive hover:text-destructive hover:bg-destructive/20 disabled:opacity-50"
                    onClick={() => handleRemoveQuestionGroup(qgIndex)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>

              <FormField
                control={control}
                name={`passages.${index}.questionGroups.${qgIndex}.instruction`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        variant="underline"
                        className="px-0 placeholder:text-white"
                        placeholder="Type instruction for this question type here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image for map labeling */}
            {currentGroup.questions.some(
              (e) => e.question_type === "map_labeling",
            ) && (
              <div className="mb-14 flex w-full flex-col items-center justify-center gap-6 rounded-3xl bg-[#1A1A1A] px-4 py-6">
                <FormField
                  name={`passages.${index}.questionGroups.${qgIndex}.image.title`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Type the map title here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ImageDropzone
                  fieldPrefix={`passages.${index}.questionGroups.${qgIndex}.image.file`}
                />
              </div>
            )}

            {/* questions */}
            <QuestionsSection
              onAddPassage={onAddPassage}
              nestIndex={index}
              questionGroupIndex={qgIndex}
              onAddQuestionGroup={handleAddQuestionGroup}
            />
          </React.Fragment>
        );
      })}
    </section>
  );
};
