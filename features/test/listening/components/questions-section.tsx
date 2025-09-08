"use client";

import SortableItem from "@/components/ui/sortable-item";
import ChooseCorrectAnswer from "@/features/test/components/questions/choose-correct-answer";
import ChooseMultipleAnswer from "@/features/test/components/questions/choose-multiple-answer";
import NoteCompletion from "@/features/test/components/questions/note-completion";
import Toolbar from "@/features/test/components/toolbar";
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
import SentenceCompletion from "../../components/questions/sentence-completion";
import { defaultListeningQuestion } from "../../constant/default-listening-question";
import { PassageListening } from "../../form/create-listening-form";
import FormCompletion from "./questions/form-completion";
import MapLabeling from "./questions/map-labeling";
import SummaryCompletion from "./questions/summary-completion";

type QuestionsSectionProps = {
  nestIndex: number;
  questionGroupIndex: number;
  onAddPassage: () => void;
  onAddQuestionGroup?: (questionType: QuestionType) => void;
};

const SINGLE_CHOICE_TYPE = "choose_correct_answer";
const MULTIPLE_CHOICE_TYPE = "choose_multiple_answer";
const NOTE_COMPLETION_TYPE = "note_completion";
const SENTENCE_COMPLETION = "sentence_completion";
const FORM_COMPLETION = "form_completion";
const SUMMARY_COMPLETION = "summary_completion";
const MAP_LABELING = "map_labeling";

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
  const passages = useWatch({
    name: "passages",
  }) as PassageListening[];

  const getGlobalNumberQuestionIndex = useCallback(
    (nestIndex: number, groupIndex: number, qIndex: number) => {
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
    },
    [passages, setValue, questionsPath],
  );

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
    const newQuestion = { ...defaultData };
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
      const isDialogClick =
        target.closest("[data-radix-dialog-content]") ||
        target.closest("[role='dialog']") ||
        target.closest(".dialog-content");
      const isContainerClick = questionsContainerRef.current?.contains(target);

      // Don't clear active state if clicking on dialog, toolbar, select, or container
      if (
        !isToolbarClick &&
        !isSelectClick &&
        !isDialogClick &&
        !isContainerClick
      ) {
        clearActive();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearActive]);

  // Inject question_number setiap question
  useEffect(() => {
    passages?.forEach((p, pIndex) => {
      p.questionGroups?.forEach((g, gIndex) => {
        g.questions?.forEach((_, qIndex) => {
          const globalNumber = getGlobalNumberQuestionIndex(
            pIndex,
            gIndex,
            qIndex,
          );
          const path =
            `passages.${pIndex}.questionGroups.${gIndex}.questions.${qIndex}.question_number` as const;
          const current = getValues(path);
          if (current !== globalNumber) {
            setValue(path, globalNumber, {
              shouldDirty: false,
              shouldValidate: false,
            });
          }
        });
      });
    });
  }, [passages, setValue, getValues, getGlobalNumberQuestionIndex]);

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

            const globalNumber = getGlobalNumberQuestionIndex(
              nestIndex,
              questionGroupIndex,
              qIndex,
            );

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
                        variant="listening"
                      />
                    )}

                    {(() => {
                      switch (questionType) {
                        case SINGLE_CHOICE_TYPE:
                          return (
                            <ChooseCorrectAnswer
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                            />
                          );
                        case MULTIPLE_CHOICE_TYPE:
                          return (
                            <ChooseMultipleAnswer
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                            />
                          );
                        case NOTE_COMPLETION_TYPE:
                          return (
                            <NoteCompletion
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                            />
                          );
                        case SENTENCE_COMPLETION:
                          return (
                            <SentenceCompletion
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                            />
                          );
                        case FORM_COMPLETION:
                          return (
                            <FormCompletion
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                              canRemove={questionFields.length > 1}
                            />
                          );
                        case SUMMARY_COMPLETION:
                          return (
                            <SummaryCompletion
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                              canRemove={questionFields.length > 1}
                            />
                          );
                        case MAP_LABELING:
                          return (
                            <MapLabeling
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              qIndex={qIndex}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              globalNumber={globalNumber}
                              canRemove={questionFields.length > 1}
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
