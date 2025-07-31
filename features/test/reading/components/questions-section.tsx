"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { readingQuestionTypes } from "@/data/test-filter-options";
import { cn } from "@/lib/utils";
import { useToolbarStore } from "@/store/toolbar-store";
import React, { useRef, useEffect, useCallback } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { MdDragIndicator } from "react-icons/md";
import { PiCopyFill } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import QuestionBreakdown from "./question-breakdown";
import OptionsFieldArray from "./options-field-array";
import { ReadingQuestion } from "@/types/test";
import Toolbar from "./toolbar";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/ui/sortable-item";
import { AnswerKeyField } from "./answer-key-field";
import { defaultQuestionValues } from "../constant/default-question-values";

type QuestionsSectionProps = {
  nestIndex: number;
  questionGroupIndex: number;
  onAddPassage: () => void;
};

const TRUE_FALSE_OPTIONS = ["True", "False", "Not Given"];
const YES_NO_OPTIONS = ["Yes", "No", "Not Given"];
const TRUE_FALSE_TYPE = "true_false_not_given";
const YES_NO_TYPE = "yes_no_not_given";
const MULTIPLE_CHOICE_TYPE = "choose_multiple_answer";
const SINGLE_CHOICE_TYPE = "choose_correct_answer";

export const QuestionsSection = ({
  nestIndex,
  questionGroupIndex,
  onAddPassage,
}: QuestionsSectionProps) => {
  const form = useFormContext();
  const { control, getValues, setValue } = form;
  const { activeQuestionId, setActiveQuestion, clearActive } =
    useToolbarStore();
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  const questionsPath = `passages.${nestIndex}.questionGroups.${questionGroupIndex}.questions`;

  const {
    fields: questionFields,
    remove: removeQuestion,
    insert: insertQuestion,
    move,
  } = useFieldArray({ control, name: questionsPath });

  const watchedQuestions = useWatch({
    control,
    name: questionsPath,
  }) as ReadingQuestion[];

  // Memoized sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // Optimized answer key management
  const updateAnswerKeyForQuestionType = useCallback(
    (question: ReadingQuestion, index: number) => {
      if (!question) return;

      const basePath = `${questionsPath}.${index}`;
      const { type, options = [], answerKey } = question;

      if (type === TRUE_FALSE_TYPE) {
        // Handle True/False/Not Given questions
        const needsOptionsUpdate =
          !options.length ||
          options.length !== 3 ||
          !TRUE_FALSE_OPTIONS.every((option, idx) => option === options[idx]);

        if (needsOptionsUpdate) {
          setValue(`${basePath}.options`, TRUE_FALSE_OPTIONS, {
            shouldDirty: true,
            shouldValidate: false,
          });
        }

        if (!TRUE_FALSE_OPTIONS.includes(answerKey as string)) {
          setValue(`${basePath}.answerKey`, "True", {
            shouldDirty: true,
            shouldValidate: false,
          });
        }
      } else if (type === YES_NO_TYPE) {
        // Handle Yes/No/Not Given questions
        const needsOptionsUpdate =
          !options.length ||
          options.length !== 3 ||
          !YES_NO_OPTIONS.every((option, idx) => option === options[idx]);

        if (needsOptionsUpdate) {
          setValue(`${basePath}.options`, YES_NO_OPTIONS, {
            shouldDirty: true,
            shouldValidate: false,
          });
        }

        if (!YES_NO_OPTIONS.includes(answerKey as string)) {
          setValue(`${basePath}.answerKey`, "Yes", {
            shouldDirty: true,
            shouldValidate: false,
          });
        }
      } else {
        // Handle other question types
        const shouldBeArray = type === MULTIPLE_CHOICE_TYPE;
        const isCurrentlyArray = Array.isArray(answerKey);

        if (shouldBeArray && !isCurrentlyArray) {
          setValue(`${basePath}.answerKey`, [], {
            shouldDirty: true,
            shouldValidate: false,
          });
        } else if (!shouldBeArray && isCurrentlyArray) {
          setValue(`${basePath}.answerKey`, "", {
            shouldDirty: true,
            shouldValidate: false,
          });
        }
      }
    },
    [questionsPath, setValue],
  );

  // Optimized effect for answer key management
  useEffect(() => {
    if (!watchedQuestions?.length) return;
    watchedQuestions.forEach(updateAnswerKeyForQuestionType);
  }, [watchedQuestions, updateAnswerKeyForQuestionType]);

  // Event handlers
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = questionFields.findIndex((q) => q.id === active.id);
      const newIndex = questionFields.findIndex((q) => q.id === over.id);
      move(oldIndex, newIndex);
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
      watchedQuestions?.[activeIndex]?.type || SINGLE_CHOICE_TYPE;

    const defaultData =
      defaultQuestionValues[activeType as keyof typeof defaultQuestionValues];
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

  // Helper function
  const getAnswerKeyVariant = (questionType: string): "single" | "multiple" =>
    questionType === MULTIPLE_CHOICE_TYPE ? "multiple" : "single";

  return (
    <div className="space-y-4" ref={questionsContainerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questionFields.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questionFields.map((question, qIndex) => {
            const watchedQuestion = watchedQuestions?.[qIndex];
            const questionType = watchedQuestion?.type || SINGLE_CHOICE_TYPE;
            const questionOptions = watchedQuestion?.options || [];
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
                      />
                    )}

                    <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
                      {/* QUESTION & TYPE */}
                      <div className="flex items-center justify-between gap-7">
                        <span className="text-medium text-primary text-xl">
                          {qIndex + 1}
                        </span>
                        <div className="flex flex-1 flex-col items-center justify-between gap-4 md:flex-row">
                          <FormField
                            control={control}
                            name={`${questionsPath}.${qIndex}.question`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Type your question here..."
                                    className="min-h-11 resize-none"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`${questionsPath}.${qIndex}.type`}
                            render={({ field }) => (
                              <FormItem className="w-full md:w-64">
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Question Type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {readingQuestionTypes.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <OptionsFieldArray
                        nestIndex={nestIndex}
                        questionGroupIndex={questionGroupIndex}
                        qIndex={qIndex}
                      />

                      <Separator />

                      {/* ANSWER KEY & ACTION */}
                      <div className="flex items-center justify-between gap-4">
                        <AnswerKeyField
                          name={`${questionsPath}.${qIndex}.answerKey`}
                          variant={getAnswerKeyVariant(questionType)}
                          options={questionOptions}
                        />

                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            size="iconSm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateQuestion(qIndex);
                            }}
                            className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
                          >
                            <PiCopyFill />
                          </Button>
                          <Button
                            size="iconSm"
                            type="button"
                            variant="ghost"
                            onClick={
                              questionFields.length > 1
                                ? (e) => {
                                    e.stopPropagation();
                                    handleRemoveQuestion(qIndex);
                                  }
                                : undefined
                            }
                            className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* BREAKDOWN */}
                    <QuestionBreakdown
                      index={qIndex}
                      nestIndex={nestIndex}
                      questionGroupIndex={questionGroupIndex}
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
