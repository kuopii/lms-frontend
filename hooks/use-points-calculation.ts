import { Passage, Question, QuestionGroup } from "@/types/test";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const usePointsCalculation = (currentQuestionPath?: string) => {
  const { watch } = useFormContext();

  // Watch all form data
  const formData = watch();

  // Watch specific question if path provided
  const currentQuestionPoints = currentQuestionPath
    ? watch(`${currentQuestionPath}.points_value`) || 0
    : 0;

  const calculations = useMemo(() => {
    if (!formData?.passages) {
      return {
        totalPoints: 0,
        pointsWithoutCurrent: 0,
        maxPointsForCurrent: 100,
        remainingPoints: 100,
        questionCount: 0,
        breakdown: [],
      };
    }

    let totalPoints = 0;
    let questionCount = 0;
    const breakdown: Array<{
      passageIndex: number;
      groupIndex: number;
      questionIndex: number;
      points: number;
      path: string;
      isCurrentQuestion: boolean;
    }> = [];

    // Calculate total points and create breakdown
    formData.passages.forEach((passage: Passage, pIndex: number) => {
      passage.questionGroups?.forEach(
        (group: QuestionGroup, gIndex: number) => {
          group.questions?.forEach((question: Question, qIndex: number) => {
            const questionPath = `passages.${pIndex}.questionGroups.${gIndex}.questions.${qIndex}`;
            const points = question.points_value || 0;
            const isCurrentQuestion = currentQuestionPath === questionPath;

            totalPoints += points;
            questionCount++;

            breakdown.push({
              passageIndex: pIndex,
              groupIndex: gIndex,
              questionIndex: qIndex,
              points,
              path: questionPath,
              isCurrentQuestion,
            });
          });
        },
      );
    });

    // Calculate points without current question
    const pointsWithoutCurrent = currentQuestionPath
      ? totalPoints - currentQuestionPoints
      : totalPoints;

    // Maximum points current question can have
    const maxPointsForCurrent = Math.max(0, 100 - pointsWithoutCurrent);

    // Remaining points in total
    const remainingPoints = Math.max(0, 100 - totalPoints);

    return {
      totalPoints,
      pointsWithoutCurrent,
      maxPointsForCurrent,
      remainingPoints,
      questionCount,
      breakdown,
    };
  }, [formData, currentQuestionPath, currentQuestionPoints]);

  return {
    ...calculations,
    isOverLimit: calculations.totalPoints > 100,
    isUnderLimit: calculations.totalPoints < 50 && calculations.totalPoints > 0,
    progressPercentage: Math.min((calculations.totalPoints / 100) * 100, 100),
  };
};
