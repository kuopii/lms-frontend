"use client";

import SortableItem from "@/components/ui/sortable-item";
import { cn } from "@/lib/utils";
import { useToolbarStore } from "@/store/toolbar-store";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { MdDragIndicator } from "react-icons/md";
import { QuestionRenderer } from "../../components/question-renderer";
import { defaultQuestionValues } from "../../constant/default-question-values";
import Toolbar from "../../reading/components/toolbar";
import { Question, QuestionType } from "../types/question";
import { questionTemplates } from "../types/question-templates";
import { ChooseMultipleAnswers } from "./templates-questions/choose-multiple-answers";
import { ChooseTheCorrectAnswer } from "./templates-questions/choose-the-correct-answer";
import FormCompletion from "./templates-questions/form-completion";
import MapLabeling from "./templates-questions/map-labeling";
import NoteCompletion from "./templates-questions/note-completion";
import { SentenceCompletion } from "./templates-questions/sentence-completion";
import ShortAnswerQuestion from "./templates-questions/short-answer-question";
import SummaryCompletion from "./templates-questions/summary-completion";

type QuestionsSectionProps = {
  nestIndex: number;
  questionGroupIndex: number;
  onAddPassage: () => void;
  onAddQuestionGroup?: () => void;
};

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

export const QuestionsSection = ({
  nestIndex,
  questionGroupIndex,
  onAddPassage,
  onAddQuestionGroup,
}: QuestionsSectionProps) => {
  const form = useFormContext();
  const { control, getValues } = form;
  const { activeQuestionId, setActiveQuestion, clearActive } =
    useToolbarStore();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const previousQuestionTypesRef = useRef<Record<string, string>>({});
  const isDraggingRef = useRef(false);

  const questionsPath = `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions`;

  const {
    fields: questionFields,
    remove: removeQuestion,
    insert: insertQuestion,
    move,
  } = useFieldArray({ control, name: questionsPath });

  // Watch only question types to minimize re-renders
  const watchedQuestions = useWatch({
    control,
    name: questionsPath,
  }) as Question[];

  // Memoize question types to prevent unnecessary effect runs
  const questionTypes = useMemo(() => {
    return (
      watchedQuestions?.map((q, index) => ({
        id: questionFields[index]?.id,
        type: q?.type as QuestionType,
        index,
        question: q?.prompt,
      })) || []
    );
  }, [watchedQuestions, questionFields]);

  useEffect(() => {
    // Skip during drag operations
    if (isDraggingRef.current) return;

    if (!questionTypes.length) return;

    questionTypes.forEach(({ id: questionId, type: questionType, index }) => {
      if (!questionType || !questionId) return;

      const previousType = previousQuestionTypesRef.current[questionId];

      if (previousType && previousType !== questionType) {
        const defaultData =
          defaultQuestionValues[
            questionType as keyof typeof defaultQuestionValues
          ];

        if (defaultData) {
          // Use setTimeout to avoid conflicts with drag operations
          setTimeout(() => {
            // Create completely new question with default values
            const newQuestion = {
              ...defaultData,
              type: questionType,
              id: questionId, // Keep the same ID to maintain references
            };

            // Remove old question and insert new one at the same position
            removeQuestion(index);
            insertQuestion(index, newQuestion);
          }, 0);
        }
      }

      // Update ref without causing re-render
      previousQuestionTypesRef.current[questionId] = questionType;
    });
  }, [questionTypes, removeQuestion, insertQuestion, questionsPath]);

  // Memoized sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Increase distance
    }),
  );

  // Event handlers
  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Reset dragging flag
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 100);

      if (!over || active.id === over.id) return;

      const oldIndex = questionFields.findIndex((q) => q.id === active.id);
      const newIndex = questionFields.findIndex((q) => q.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    },
    [questionFields, move],
  );

  const handleDuplicateQuestion = useCallback(
    (questionIndex: number) => {
      const currentQuestions = getValues(questionsPath);
      const questionToDuplicate = currentQuestions[questionIndex];

      const clonedQuestion = {
        ...JSON.parse(JSON.stringify(questionToDuplicate)),
        id: crypto.randomUUID(),
      };

      insertQuestion(questionIndex + 1, clonedQuestion);
    },
    [getValues, questionsPath, insertQuestion],
  );

  const handleAddQuestion = useCallback(() => {
    const activeIndex = questionFields.findIndex(
      (q) => q.id === activeQuestionId,
    );

    // Ambil tipe dari soal aktif, fallback ke tipe pertama di questionTemplates
    const activeType = (watchedQuestions?.[activeIndex]?.type ||
      "Choose_the_Correct_Answer") as QuestionType;

    const template = questionTemplates[activeType];

    if (!template) {
      console.log(`Template untuk type ${activeType} tidak ditemukan`);
      return;
    }

    // Kalau template adalah fungsi (defaultData), jalankan
    const defaultData = typeof template === "function" && template();

    const newQuestion = {
      ...defaultData,
      type: activeType,
      id: crypto.randomUUID(),
    };

    const insertIndex =
      activeIndex !== -1 ? activeIndex + 1 : questionFields.length;

    insertQuestion(insertIndex, newQuestion);
  }, [activeQuestionId, questionFields, watchedQuestions, insertQuestion]);

  const handleQuestionClick = useCallback(
    (questionId: string, questionIndex: number, event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-toolbar="true"]')) return;

      setActiveQuestion(
        questionId,
        nestIndex,
        questionGroupIndex,
        questionIndex,
      );
    },
    [setActiveQuestion, nestIndex, questionGroupIndex],
  );

  const handleRemoveQuestion = useCallback(
    (questionIndex: number) => {
      if (questionFields.length > 1) {
        removeQuestion(questionIndex);
      }
    },
    [questionFields.length, removeQuestion],
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isToolbarClick = target.closest('[data-toolbar="true"]');
      const isSelectClick =
        target.closest('[role="listbox"]') ||
        target.closest("[data-radix-select-content]") ||
        target.closest("[data-radix-popper-content-wrapper]");
      const isContainerClick = questionsContainerRef.current?.contains(target);

      if (!isToolbarClick && !isSelectClick && !isContainerClick) {
        clearActive();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearActive]);

  // test

  // --------

  return (
    <div className="space-y-4" ref={questionsContainerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questionFields.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questionFields.map((question, qIndex) => {
            // const watchedQuestion = watchedQuestions?.[qIndex];
            // const questionType = watchedQuestion?.type || SINGLE_CHOICE_TYPE;
            const isActive = question.id === activeQuestionId;

            return (
              <SortableItem key={question.id} id={question.id}>
                <div className="relative">
                  <div
                    className={cn(
                      "relative space-y-6 rounded-3xl border bg-[#1A1A1A] px-4 pt-14 pb-6 transition-colors duration-200 md:px-5 lg:px-6",
                      isActive ? "border-primary" : "border-transparent",
                    )}
                    onClick={(event) =>
                      handleQuestionClick(question.id, qIndex, event)
                    }
                  >
                    <MdDragIndicator
                      className="absolute top-2 left-1/2 -translate-x-1/2 rotate-90 hover:cursor-move"
                      size={25}
                    />

                    {isActive && (
                      <Toolbar
                        isActive={isActive}
                        onAddQuestion={handleAddQuestion}
                        onAddPassage={onAddPassage}
                        onAddQustionGroup={onAddQuestionGroup}
                      />
                    )}

                    {/* QUESTION RENDER */}
                    <QuestionRenderer
                      fieldPrefix={
                        `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions.${qIndex}` as const
                      }
                      questionIndex={qIndex}
                      questionGroupIndex={questionGroupIndex}
                      onRemove={() => handleRemoveQuestion(qIndex)}
                      // kirimkan handle duplicate
                    />
                  </div>
                </div>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default QuestionsSection;
