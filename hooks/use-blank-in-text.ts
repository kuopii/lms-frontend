import { useCallback } from "react";
import { Item, Option } from "@/types/test";

export interface BlankInText {
  match: string;
  number: number;
  index: number;
  endIndex: number;
  originalText: string;
}

type QuestionType = "paragraph" | "note";

interface UseBlankManagementConfig {
  questionType: QuestionType;
  globalNumber?: number; // Only needed for paragraph type
}

interface UseBlankInTextProps {
  findBlanksInText: (
    paragraph: string,
    answerData?: Item[] | Option[],
  ) => BlankInText[];
  reorderBlanksInParagraph: (
    paragraph: string,
    answerData: Item[] | Option[],
  ) => {
    updatedParagraph: string;
    newAnswerData: Item[] | Option[];
  };
  createNewAnswerData: (
    currentData: Item[] | Option[],
    selectedText: string,
    questionText?: string,
  ) => Item[] | Option[];
  removeBlank: (
    indexToRemove: number,
    currentQuestionText: string,
    currentAnswerData: Item[] | Option[],
  ) => {
    updatedParagraph: string;
    newAnswerData: Item[] | Option[];
  };
}

export const useBlankInText = ({
  questionType,
  globalNumber,
}: UseBlankManagementConfig): UseBlankInTextProps => {
  const findBlanksInText = useCallback(
    (paragraph: string, answerData?: Item[] | Option[]): BlankInText[] => {
      const blankPattern =
        questionType === "paragraph" ? /__(\d+)\.(\d+)__/g : /__(\d+)__/g;

      const blanksInText: BlankInText[] = [];
      let match;

      while ((match = blankPattern.exec(paragraph)) !== null) {
        let number: number;
        let originalText = "";

        if (questionType === "paragraph") {
          number = parseFloat(`${match[1]}.${match[2]}`);
          // For paragraph type, find in Item[]
          if (answerData) {
            const item = (answerData as Item[]).find(
              (item) => Math.abs(item.question_number - number) < 0.001,
            );
            originalText = item?.correct_answer?.option_text || "";
          }
        } else {
          number = parseInt(match[1]);
          // For note type, find in Option[]
          if (answerData) {
            const option = (answerData as Option[]).find(
              (option) => parseInt(option.option_key) === number,
            );
            originalText = option?.option_text || "";
          }
        }

        blanksInText.push({
          match: match[0],
          number: number,
          index: match.index,
          endIndex: match.index + match[0].length,
          originalText,
        });
      }

      return blanksInText.sort((a, b) => a.index - b.index);
    },
    [questionType],
  );

  const createNumberMapping = useCallback(
    (blanks: BlankInText[]): Record<number, string | number> => {
      const mapping: Record<number, string | number> = {};

      blanks.forEach((blank, index) => {
        if (questionType === "paragraph") {
          mapping[blank.number] = `${globalNumber}.${index + 1}`;
        } else {
          mapping[blank.number] = index + 1;
        }
      });

      return mapping;
    },
    [questionType, globalNumber],
  );

  const updateParagraphNumbers = useCallback(
    (
      paragraph: string,
      blanks: BlankInText[],
      mapping: Record<number, string | number>,
    ): string => {
      let updatedParagraph = paragraph;

      // Replace from right to left to avoid index shifting
      for (let i = blanks.length - 1; i >= 0; i--) {
        const blank = blanks[i];
        const newNumber = mapping[blank.number];
        updatedParagraph =
          updatedParagraph.substring(0, blank.index) +
          `__${newNumber}__` +
          updatedParagraph.substring(blank.endIndex);
      }

      return updatedParagraph;
    },
    [],
  );

  const reorderBlanksInParagraph = useCallback(
    (paragraph: string, answerData: Item[] | Option[]) => {
      const blanksInText = findBlanksInText(paragraph, answerData);
      const numberMapping = createNumberMapping(blanksInText);
      const updatedParagraph = updateParagraphNumbers(
        paragraph,
        blanksInText,
        numberMapping,
      );

      let newAnswerData: Item[] | Option[];

      if (questionType === "paragraph") {
        // Create new Item[]
        newAnswerData = blanksInText.map((blank, index) => {
          const existingItem = (answerData as Item[]).find(
            (item) => Math.abs(item.question_number - blank.number) < 0.001,
          );

          return {
            question_number: parseFloat(`${globalNumber}.${index + 1}`),
            correct_answer: existingItem?.correct_answer || {
              option_key: "",
              option_text: "",
            },
          };
        }) as Item[];
      } else {
        // Create new Option[]
        newAnswerData = blanksInText.map((blank, index) => ({
          option_key: (index + 1).toString(),
          option_text: blank.originalText,
        })) as Option[];
      }

      return { updatedParagraph, newAnswerData };
    },
    [
      findBlanksInText,
      createNumberMapping,
      updateParagraphNumbers,
      questionType,
      globalNumber,
    ],
  );

  const createNewAnswerData = useCallback(
    (
      currentData: Item[] | Option[],
      selectedText: string,
      questionText?: string,
    ): Item[] | Option[] => {
      if (questionType === "paragraph") {
        // For paragraph type, we don't need special logic here
        // The reordering will handle the new item creation
        return currentData;
      } else {
        // For note type, handle the special case
        const currentOptions = currentData as Option[];

        const isFirstBlankAndEmpty =
          currentOptions.length === 1 &&
          currentOptions[0].option_key === "1" &&
          currentOptions[0].option_text === "" &&
          !questionText?.includes("__1__");

        if (isFirstBlankAndEmpty) {
          return [
            {
              option_key: "999", // Temporary, will be reordered
              option_text: selectedText.trim(),
            },
          ];
        } else {
          return [
            ...currentOptions,
            {
              option_key: "999", // Temporary, will be reordered
              option_text: selectedText.trim(),
            },
          ];
        }
      }
    },
    [questionType],
  );

  const removeBlank = useCallback(
    (
      indexToRemove: number,
      currentQuestionText: string,
      currentAnswerData: Item[] | Option[],
    ) => {
      if (indexToRemove < 0 || indexToRemove >= currentAnswerData.length) {
        return {
          updatedParagraph: currentQuestionText,
          newAnswerData: currentAnswerData,
        };
      }

      let itemToRemove: { key: string; text: string };
      let newAnswerData: Item[] | Option[];

      if (questionType === "paragraph") {
        const items = currentAnswerData as Item[];
        const item = items[indexToRemove];
        itemToRemove = {
          key: item.question_number.toString(),
          text: item.correct_answer.option_text,
        };
        newAnswerData = items.filter((_, index) => index !== indexToRemove);
      } else {
        const options = currentAnswerData as Option[];
        const option = options[indexToRemove];
        itemToRemove = {
          key: option.option_key,
          text: option.option_text,
        };
        newAnswerData = options.filter((_, index) => index !== indexToRemove);
      }

      // Remove blank from paragraph (replace with original text)
      const blankPattern = new RegExp(`__${itemToRemove.key}__`, "g");
      const paragraphWithoutBlank = currentQuestionText.replace(
        blankPattern,
        itemToRemove.text,
      );

      // Reorder remaining blanks
      const { updatedParagraph, newAnswerData: reorderedAnswerData } =
        reorderBlanksInParagraph(paragraphWithoutBlank, newAnswerData);

      return {
        updatedParagraph,
        newAnswerData: reorderedAnswerData,
      };
    },
    [questionType, reorderBlanksInParagraph],
  );

  return {
    findBlanksInText,
    reorderBlanksInParagraph,
    createNewAnswerData,
    removeBlank,
  };
};
