"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { PiCopyFill } from "react-icons/pi";
import QuestionHeader from "../question-header";
import PointsField from "../points-field";
import QuestionBreakdown from "../question-breakdown";
import { Option } from "@/types/test";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { ImagePreview } from "../question-image";
import { ParagraphTextArea } from "../../reading/components/paragraph-text-area";
import { useTextSelection } from "@/hooks/use-text-selection";
import { BlankActions } from "../../reading/components/blank-action";
import { useBlankInText } from "@/hooks/use-blank-in-text";

interface NoteCompletionProps {
  qIndex: number;
  questionsPath: string;
  globalNumber: number;
  onDuplicateQuestion?: (index: number) => void;
  onRemoveQuestion?: (index: number) => void;
}

const NoteCompletion: React.FC<NoteCompletionProps> = ({
  globalNumber,
  qIndex,
  questionsPath,
  onDuplicateQuestion,
  onRemoveQuestion,
}) => {
  const { control, watch, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const questionPath = `${questionsPath}.${qIndex}`;

  const { fields: questionFields } = useFieldArray({
    control,
    name: questionsPath,
  });

  // Memoized paths
  const paths = useMemo(
    () => ({
      correctAnswer: `${questionPath}.correct_answer`,
      questionText: `${questionPath}.question_text`,
      images: `${questionPath}.question_data.images`,
    }),
    [questionPath],
  );

  const { fields: correctAnswerFields } = useFieldArray({
    control,
    name: paths.correctAnswer,
  });

  // Watch values
  const watchedQuestionText = watch(paths.questionText) as string;
  const watchedCorrectAnswer = watch(paths.correctAnswer) as Option[];
  const currentImages = watch(paths.images);

  const { reorderBlanksInParagraph, removeBlank } = useBlankInText({
    questionType: "note",
  });

  const {
    selectedText,
    selectionStart,
    selectionEnd,
    handleTextSelection,
    clearSelection,
  } = useTextSelection(watchedQuestionText);

  const onTextSelection = useCallback(() => {
    handleTextSelection(textareaRef);
  }, [handleTextSelection]);

  // Create new answer key based on current state
  const createNewAnswerKey = (
    currentAnswer: Option[],
    selectedText: string,
    questionText: string,
  ): Option[] => {
    const isFirstBlankAndEmpty =
      currentAnswer.length === 1 &&
      currentAnswer[0].option_key === "1" &&
      currentAnswer[0].option_text === "" &&
      !questionText.includes("__1__");

    if (isFirstBlankAndEmpty) {
      return [
        {
          option_key: "999", // Temporary, will be reordered
          option_text: selectedText.trim(),
        },
      ];
    } else {
      return [
        ...currentAnswer,
        {
          option_key: "999", // Temporary, will be reordered
          option_text: selectedText.trim(),
        },
      ];
    }
  };

  const markAsBlank = () => {
    if (!selectedText.trim() || !textareaRef.current) return;

    const currentQuestionText = watchedQuestionText || "";
    const currentCorrectAnswer = watchedCorrectAnswer || [];

    // Replace selected text with temporary placeholder
    const beforeSelection = currentQuestionText.substring(0, selectionStart);
    const afterSelection = currentQuestionText.substring(selectionEnd);
    const tempParagraph = beforeSelection + "___TEMP___" + afterSelection;

    // Create new answer key
    const newAnswerKey = createNewAnswerKey(
      currentCorrectAnswer,
      selectedText,
      currentQuestionText,
    );

    // Replace temp placeholder with actual blank
    const paragraphWithNewBlank = tempParagraph.replace(
      "___TEMP___",
      "__999__",
    );

    // Reorder all blanks
    const { updatedParagraph, newAnswerData: reorderedAnswerKey } =
      reorderBlanksInParagraph(paragraphWithNewBlank, newAnswerKey);

    // Update form values
    setValue(paths.questionText, updatedParagraph);
    setValue(paths.correctAnswer, reorderedAnswerKey);

    // Clear selection and focus
    clearSelection();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(0, 0);
      }
    }, 0);
  };

  const handleRemoveBlank = (indexToRemove: number) => {
    const currentQuestionText = watchedQuestionText || "";
    const currentCorrectAnswer = watchedCorrectAnswer || [];

    const { updatedParagraph, newAnswerData } = removeBlank(
      indexToRemove,
      currentQuestionText,
      currentCorrectAnswer,
    );

    // Update form values
    setValue(paths.questionText, updatedParagraph);
    setValue(paths.correctAnswer, newAnswerData);
  };

  // Check if question can be removed
  const canRemoveQuestion = questionFields.length > 0;

  return (
    <div className="space-y-6">
      {/* Question Text Section */}
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <QuestionHeader
          qIndex={qIndex}
          variant="tips"
          globalNumber={globalNumber}
          questionPath={questionPath}
        />

        <div className="mx-auto max-w-md">
          <ImagePreview
            images={currentImages}
            showActions={false}
            containerClassName="grid-cols-3 md:grid-cols-4"
          />
        </div>

        <ParagraphTextArea
          control={control}
          questionPath={questionPath}
          textareaRef={textareaRef}
          onTextSelection={onTextSelection}
        />

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <BlankActions
            selectedText={selectedText}
            onMarkAsBlank={markAsBlank}
          />

          <div className="flex w-full items-center justify-between gap-4 md:w-fit">
            <PointsField questionPath={questionPath} />

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="iconSm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateQuestion?.(qIndex);
                }}
                className="-rotate-90 [&_svg:not([class*='size-'])]:size-6"
                aria-label="Duplicate question"
              >
                <PiCopyFill />
              </Button>

              <Button
                size="iconSm"
                type="button"
                variant="ghost"
                onClick={
                  canRemoveQuestion
                    ? (e) => {
                        e.stopPropagation();
                        onRemoveQuestion?.(qIndex);
                      }
                    : undefined
                }
                disabled={!canRemoveQuestion}
                className="text-destructive hover:text-destructive [&_svg:not([class*='size-'])]:size-5"
                aria-label="Remove question"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Correct Answer Section */}
      <div className="space-y-6 rounded-3xl bg-[#333333] p-3 md:p-4 lg:p-5">
        <h4 className="text-lg font-medium text-white">
          Correct Words for Each Blank
        </h4>

        {correctAnswerFields.length === 0 ? (
          <p className="my-12 text-center text-sm text-gray-300">
            No blanks created yet. Select text in the paragraph above and click
            &quot;Mark as Blank&quot; to create answer keys.
          </p>
        ) : (
          <div className="space-y-6">
            {correctAnswerFields.map((field, index) => {
              const typedField = field as Option & { id: string };

              return (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge size={"icon"}>{typedField.option_key}</Badge>
                  </div>

                  <FormField
                    control={control}
                    name={`${paths.correctAnswer}.${index}.option_text`}
                    render={({ field: answerField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...answerField}
                            variant="underline"
                            className="text-white"
                            placeholder="Enter the correct answer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    size="iconSm"
                    variant="ghost"
                    onClick={() => handleRemoveBlank(index)}
                    className="[&_svg:not([class*='size-'])]:size-5"
                    aria-label={`Remove blank ${typedField.option_key}`}
                  >
                    <RiDeleteBack2Fill />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuestionBreakdown breakdownPath={`${questionPath}.breakdown`} />
    </div>
  );
};

export default NoteCompletion;
