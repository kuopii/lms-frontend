import { useToolbarStore } from "@/store/toolbar-store";
import React, { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { PassageSpeaking } from "../form/create-speaking-form";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa6";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageContextUpload } from "../writing/image-context-upload";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { QuestionField } from "./question-field";

type PassageSectionProps = {
  index: number;
  isLast: boolean;
  onRemove?: (index: number) => void;
  onAddPassage: () => void;
};

export const PassageSection = ({
  index,
  isLast,
  onRemove,
  onAddPassage,
}: PassageSectionProps) => {
  const { control, getValues, setValue } = useFormContext();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const { activeQuestionId } = useToolbarStore();

  const questionsPath = `passages.${index}.questions`;

  const {
    fields: questionFields,
    insert: insertQuestionField,
    remove: removeQuestionField,
    move,
  } = useFieldArray({
    control: control,
    name: questionsPath,
  });

  const passages = useWatch({
    name: "passages",
  }) as PassageSpeaking[];

  const getGlobalNumberQuestionIndex = useCallback(
    (nestIndex: number, qIndex: number) => {
      let counter = 0;

      for (let p = 0; p <= nestIndex; p++) {
        const currentPassage = passages[p];
        const totalQuestions = currentPassage.questions.length;

        if (p === nestIndex) {
          return counter + qIndex + 1;
        }

        counter += totalQuestions;
      }

      setValue(`${questionsPath}.${qIndex}.question_number`, counter + 1);
      return counter + 1;
    },
    [passages, setValue, questionsPath],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

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

  const handleAddQuestion = useCallback(() => {
    const activeIndex = questionFields.findIndex(
      (q) => q.id === activeQuestionId,
    );

    const insertIndex =
      activeIndex !== -1 ? activeIndex + 1 : questionFields.length;

    insertQuestionField(insertIndex, {
      question_number: 1,
      question_text: "",
      voice_limit: 0,
    });
  }, [activeQuestionId, insertQuestionField, questionFields]);

  const handleRemoveQuestion = useCallback(
    (qgIndex: number) => {
      if (questionFields.length > 1) {
        removeQuestionField(qgIndex);
      }
    },
    [questionFields.length, removeQuestionField],
  );

  const handleDuplicateQuestion = useCallback(
    (qIndex: number) => {
      const questionToDuplicate = getValues(`${questionsPath}.${qIndex}`);

      // Create a deep copy of the question
      const duplicatedQuestion = {
        ...questionToDuplicate,
        question_number: questionToDuplicate.question_number + 1,
        // Deep copy images if they exist
        question_data: questionToDuplicate.question_data
          ? {
              ...questionToDuplicate.question_data,
              images: questionToDuplicate.question_data.images
                ? [...questionToDuplicate.question_data.images]
                : [],
            }
          : { images: [] },
      };

      // Insert the duplicated question right after the current one
      insertQuestionField(qIndex + 1, duplicatedQuestion);
    },
    [getValues, insertQuestionField, questionsPath],
  );

  useEffect(() => {
    passages?.forEach((p, pIndex) => {
      p.questions?.forEach((_, qIndex: number) => {
        const globalNumber = getGlobalNumberQuestionIndex(pIndex, qIndex);
        const path =
          `passages.${pIndex}.questions.${qIndex}.question_number` as const;
        const current = getValues(path);

        if (current !== globalNumber) {
          setValue(path, globalNumber, {
            shouldDirty: false,
            shouldValidate: false,
          });
        }
      });
    });
  }, [passages, setValue, getValues, getGlobalNumberQuestionIndex]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-medium text-white">Passage {index + 1}</h3>
        <Button
          size="iconSm"
          variant="ghost"
          className="text-destructive"
          onClick={() => onRemove?.(index)}
          disabled={isLast}
        >
          <FaTrash />
        </Button>
      </div>

      <FormField
        control={control}
        name={`passages.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Type the title of the passage here..."
                className="border-none bg-[#333333]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`passages.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Type or paste the text here..."
                className="min-h-64 border-none bg-[#333333]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`passages.${index}.image_context`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Context Image (Optional)</FormLabel>
            <FormControl>
              <ImageContextUpload
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
            {questionFields.map((question, qIndex) => (
              <QuestionField
                key={question.id}
                passageIndex={index}
                question={question}
                questionIndex={qIndex}
                questionsPath={questionsPath}
                questionFieldsLength={questionFields.length}
                onAddPassage={onAddPassage}
                onAddQuestion={handleAddQuestion}
                onRemoveQuestion={handleRemoveQuestion}
                onDuplicateQuestion={handleDuplicateQuestion}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
};
