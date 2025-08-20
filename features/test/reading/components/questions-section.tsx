"use client";

import SortableItem from "@/components/ui/sortable-item";
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
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { MdDragIndicator } from "react-icons/md";
import Toolbar from "./toolbar";
import { defaultReadingQuestion } from "../../constant/default-reading-question";
// import ChooseMultipleAnswer from "./questions/choose-multiple-answer";
// import DiagramLabelCompletion from "./questions/diagram-label-completion";
// import MatchingFeatures from "./questions/matching-features";
// import MatchingHeading from "./questions/matching-heading";
// import MatchingInformation from "./questions/matching-information";
// import MatchingSentenceEnding from "./questions/matching-sentence-ending";
// import NoteCompletion from "./questions/note-completion";
// import ParagraphCompletion from "./questions/paragraph-completion";
// import SentenceCompletion from "./questions/sentence-completion";
// import ShortAnswer from "./questions/short-answer";
// import TrueFalseNotGiven from "./questions/true-false-not-given";
// import YesNoNotGiven from "./questions/yes-no-not-given";
import ChooseCorrectAnswer from "@/features/test/components/questions/choose-correct-answer";
import ChooseMultipleAnswer from "@/features/test/components/questions/choose-multiple-answer";
import TrueFalseNotGiven from "@/features/test/components/questions/true-false-not-given";
import YesNoNotGiven from "@/features/test/components/questions/yes-no-not-given";

type QuestionsSectionProps = {
  nestIndex: number;
  questionGroupIndex: number;
  onAddPassage: () => void;
  onAddQuestionGroup?: (questionType: QuestionType) => void;
};

const TRUE_FALSE_TYPE = "true_false_not_given";
const YES_NO_TYPE = "yes_no_not_given";
const MULTIPLE_CHOICE_TYPE = "choose_multiple_answer";
const SINGLE_CHOICE_TYPE = "choose_correct_answer";
// const MATCHING_HEADING_TYPE = "matching_heading";
// const SHORT_ANSWER_TYPE = "short_answer_question";
// const MATCHING_FEATURES_TYPE = "matching_features";
// const MATCHING_SENTENCE_ENDING_TYPE = "matching_sentence_ending";
// const MATCHING_INFORMATION_TYPE = "matching_information";
// const DIAGRAM_LABEL_COMPLETION_TYPE = "diagram_label_completion";
// const SENTENCE_COMPLETION_TYPE = "sentence_completion";
// const PARAGRAPH_COMPLETION_TYPE = "paragraph_completion";
// const NOTE_COMPLETION_TYPE = "note_completion";

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
  }) as ReadingQuestion[];

  // Memoize question types to prevent unnecessary effect runs
  const questionTypes = useMemo(() => {
    return (
      watchedQuestions?.map((q, index) => ({
        id: questionFields[index]?.id,
        type: q?.question_type,
        index,
        question: q?.question_text,
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
        // If only 1 question, replace it with default question
        if (questionFields.length === 1) {
          const defaultData =
            defaultReadingQuestion[
              questionType as keyof typeof defaultReadingQuestion
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
        } else {
          // If more than 1 question, call onAddQuestionGroup and remove current question
          if (onAddQuestionGroup) {
            setTimeout(() => {
              onAddQuestionGroup(questionType as QuestionType);
              // Remove the question that changed type
              removeQuestion(index);
            }, 0);
          }
        }
      }

      // Update ref without causing re-render
      previousQuestionTypesRef.current[questionId] = questionType;
    });
  }, [
    questionTypes,
    questionFields.length,
    removeQuestion,
    insertQuestion,
    onAddQuestionGroup,
  ]);

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
      defaultReadingQuestion[activeType as keyof typeof defaultReadingQuestion];
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
                            />
                          );
                        case TRUE_FALSE_TYPE:
                          return (
                            <TrueFalseNotGiven
                              qIndex={qIndex}
                              key={`${question.id}-${questionType}`}
                              questionsPath={questionsPath}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                            />
                          );
                        case YES_NO_TYPE:
                          return (
                            <YesNoNotGiven
                              qIndex={qIndex}
                              questionsPath={questionsPath}
                              key={`${question.id}-${questionType}`}
                              onDuplicateQuestion={handleDuplicateQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                            />
                          );
                        // case MATCHING_HEADING_TYPE:
                        //   return (
                        //     <MatchingHeading
                        //       key={`${question.id}-${questionType}`}
                        //       qIndex={qIndex}
                        //       questionsPath={questionsPath}
                        //     />
                        //   );
                        // case SHORT_ANSWER_TYPE:
                        //   return (
                        //     <ShortAnswer
                        //       key={`${question.id}-${questionType}`}
                        //       qIndex={qIndex}
                        //       questionsPath={questionsPath}
                        //       onDuplicateQuestion={handleDuplicateQuestion}
                        //       onRemoveQuestion={handleRemoveQuestion}
                        //     />
                        //   );
                        // case MATCHING_FEATURES_TYPE:
                        //   return (
                        //     <MatchingFeatures
                        //       key={`${question.id}-${questionType}`}
                        //       questionsPath={questionsPath}
                        //       qIndex={qIndex}
                        //     />
                        //   );
                        // case MATCHING_SENTENCE_ENDING_TYPE:
                        //   return (
                        //     <MatchingSentenceEnding
                        //       qIndex={qIndex}
                        //       key={`${question.id}-${questionType}`}
                        //       questionsPath={questionsPath}
                        //     />
                        //   );
                        // case MATCHING_INFORMATION_TYPE:
                        //   return (
                        //     <MatchingInformation
                        //       qIndex={qIndex}
                        //       key={`${question.id}-${questionType}`}
                        //       questionsPath={questionsPath}
                        //     />
                        //   );
                        // case DIAGRAM_LABEL_COMPLETION_TYPE:
                        //   return (
                        //     <DiagramLabelCompletion
                        //       key={`${question.id}-${questionType}`}
                        //       qIndex={qIndex}
                        //       questionsPath={questionsPath}
                        //     />
                        //   );
                        // case SENTENCE_COMPLETION_TYPE:
                        //   return (
                        //     <SentenceCompletion
                        //       questionsPath={questionsPath}
                        //       qIndex={qIndex}
                        //       key={`${question.id}-${questionType}`}
                        //       onDuplicateQuestion={handleDuplicateQuestion}
                        //       onRemoveQuestion={handleRemoveQuestion}
                        //     />
                        //   );
                        // case PARAGRAPH_COMPLETION_TYPE:
                        //   return (
                        //     <ParagraphCompletion
                        //       key={`${question.id}-${questionType}`}
                        //       qIndex={qIndex}
                        //       questionsPath={questionsPath}
                        //       onDuplicateQuestion={handleDuplicateQuestion}
                        //       onRemoveQuestion={handleRemoveQuestion}
                        //     />
                        //   );
                        // case NOTE_COMPLETION_TYPE:
                        //   return (
                        //     <NoteCompletion
                        //       key={`${question.id}-${questionType}`}
                        //       qIndex={qIndex}
                        //       questionsPath={questionsPath}
                        //       onDuplicateQuestion={handleDuplicateQuestion}
                        //       onRemoveQuestion={handleRemoveQuestion}
                        //     />
                        //   );
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
