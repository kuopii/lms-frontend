"use client";

import SortableItem from "@/components/ui/sortable-item";
import ChooseCorrectAnswer from "@/features/test/components/questions/choose-correct-answer";
import ChooseMultipleAnswer from "@/features/test/components/questions/choose-multiple-answer";
import { cn } from "@/lib/utils";
import { useToolbarStore } from "@/store/toolbar-store";
import { QuestionType, ReadingQuestion } from "@/types/test";
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
import React, { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { MdDragIndicator } from "react-icons/md";
import { defaultListeningQuestion } from "../../constant/default-listening-question";
import Toolbar from "../../reading/components/toolbar";

type QuestionsSectionProps = {
  nestIndex: number;
  questionGroupIndex: number;
  onAddPassage: () => void;
  onAddQuestionGroup?: (questionType: QuestionType) => void;
};

const SINGLE_CHOICE_TYPE = "choose_correct_answer";
const MULTIPLE_CHOICE_TYPE = "choose_multiple_answer";

export const QuestionsSection = ({
  nestIndex,
  questionGroupIndex,
  onAddPassage,
  onAddQuestionGroup,
}: QuestionsSectionProps) => {
  const form = useFormContext();
  const { control, getValues, setValue } = form;
  const { activeQuestionId, setActiveQuestion, clearActive } =
    useToolbarStore();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
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
  }) as ReadingQuestion[];

  // pengecekan global number
  const passages = useWatch({ name: "passages" });
  const getGlobalNumberQuestionIndex = (
    nestIndex: number,
    groupIndex: number,
    qIndex: number,
  ) => {
    let counter = 0;
    for (let p = 0; p <= nestIndex; p++) {
      for (let g = 0; g < passages[p].questionGroups.length; g++) {
        if (p === nestIndex && g === groupIndex) {
          return counter + qIndex + 1;
        }
        counter += passages[p].questionGroups[g].questions.length;
      }
    }
    setValue(`${questionsPath}.${qIndex}.question_number`, counter + 1);
    return counter + 1;
  };

  const handleChangeType = (
    nestIndex: number,
    groupIndex: number,
    qIndex: number,
    newType: QuestionType,
  ) => {
    if (groupIndex == null || qIndex == null || nestIndex == null) return;
    const passages = getValues("passages");
    const questionGroup = passages[nestIndex].questionGroups[groupIndex];
    const question = questionGroup.questions[qIndex];

    // default data untuk tipe baru
    const defaultData =
      defaultListeningQuestion[
        newType as keyof typeof defaultListeningQuestion
      ];

    if (questionGroup.questions.length === 1) {
      // case 1: hanya ada 1 soal : replace ke default
      questionGroup.questions[qIndex] = {
        ...defaultData,
        question_type: newType,
        id: question.id,
      };
    } else {
      // case 2: ada lebih dari 1 soal : pindahkan jadi grup baru
      const newGroup = {
        questions: [
          {
            ...defaultData,
            question_type: newType,
            id: question.id,
          },
        ],
      };

      // hapus soal dari group lama
      questionGroup.questions.splice(qIndex, 1);

      // tambahkan group baru setelah group saat ini
      passages[nestIndex].questionGroups.splice(groupIndex + 1, 0, newGroup);
    }

    // update form state
    setValue("passages", passages, { shouldDirty: true, shouldValidate: true });
  };

  // useEffect(() => {
  //   // Skip during drag operations
  //   if (isDraggingRef.current) return;

  //   if (!questionTypes.length) return;

  //   questionTypes.forEach(
  //     ({ id: questionId, question_type: questionType, index }) => {
  //       if (!questionType || !questionId) return;

  //       const previousType = previousQuestionTypesRef.current[questionId];

  //       if (previousType && previousType !== questionType) {
  //         // If only 1 question, replace it with default question
  //         if (questionFields.length === 1) {
  //           const defaultData =
  //             defaultListeningQuestion[
  //               questionType as keyof typeof defaultListeningQuestion
  //             ];

  //           if (defaultData) {
  //             // Use setTimeout to avoid conflicts with drag operations
  //             setTimeout(() => {
  //               // Create completely new question with default values
  //               const newQuestion = {
  //                 ...defaultData,
  //                 question_Type: questionType,
  //                 id: questionId, // Keep the same ID to maintain references
  //               };

  //               // Remove old question and insert new one at the same position
  //               insertQuestion(index, newQuestion);
  //               removeQuestion(index);
  //             }, 0);
  //           }
  //         } else {
  //           // If more than 1 question, call onAddQuestionGroup and remove current question
  //           if (onAddQuestionGroup) {
  //             setTimeout(() => {
  //               onAddQuestionGroup(questionType as QuestionType);
  //               // Remove the question that changed type
  //               removeQuestion(index);
  //             }, 0);
  //           }
  //         }
  //       }

  //       // Update ref without causing re-render
  //       previousQuestionTypesRef.current[questionId] = questionType;
  //     },
  //   );
  // }, [
  //   questionTypes,
  //   questionFields.length,
  //   removeQuestion,
  //   insertQuestion,
  //   onAddQuestionGroup,
  // ]);

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
    const activeType =
      watchedQuestions?.[activeIndex]?.question_type || SINGLE_CHOICE_TYPE;

    const defaultData =
      defaultListeningQuestion[
        activeType as keyof typeof defaultListeningQuestion
      ];
    const newQuestion = { ...defaultData, id: crypto.randomUUID() };
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

  // Inject question_number setiap question
  useEffect(() => {
    questionFields.map((_, qIndex) => {
      const globalNumber = getGlobalNumberQuestionIndex(
        nestIndex,
        questionGroupIndex,
        qIndex,
      );
      setValue(`${questionsPath}.${qIndex}.question_number`, globalNumber);
    });
  }, [questionFields, nestIndex, questionGroupIndex, setValue]);

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
            const watchedQuestion = watchedQuestions?.[qIndex];
            const questionType =
              watchedQuestion?.question_type || SINGLE_CHOICE_TYPE;
            const isActive = question.id === activeQuestionId;

            // tambahan
            const globalNumber = getGlobalNumberQuestionIndex(
              nestIndex,
              questionGroupIndex,
              qIndex,
            );

            console.log("globalNumber", globalNumber);

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

                    {(() => {
                      switch (questionType) {
                        case SINGLE_CHOICE_TYPE:
                          return (
                            <ChooseCorrectAnswer
                              key={`${question.id}-${questionType}`}
                              qIndex={qIndex}
                              questionsPath={questionsPath}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              // tambahan
                              nestIndex={nestIndex}
                              groupIndex={questionGroupIndex}
                              globalNumber={globalNumber}
                              handleChangeType={handleChangeType}
                            />
                          );
                        case MULTIPLE_CHOICE_TYPE:
                          return (
                            <ChooseMultipleAnswer
                              key={`${question.id}-${questionType}`}
                              qIndex={qIndex}
                              questionsPath={questionsPath}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              // tambahan
                              nestIndex={nestIndex}
                              groupIndex={questionGroupIndex}
                              globalNumber={globalNumber}
                              handleChangeType={handleChangeType}
                            />
                          );
                        default:
                          return null;
                      }
                    })()}
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
