import { create } from 'zustand';

interface ToolbarState {
  activeQuestionId: string | null;
  activePassageIndex: number | null;
  activeQuestionGroupIndex: number | null;
  activeQuestionIndex: number | null;
  
  // Actions
  setActiveQuestion: (
    questionId: string | null, 
    passageIndex?: number, 
    questionGroupIndex?: number,
    questionIndex?: number
  ) => void;
  clearActive: () => void;
}

export const useToolbarStore = create<ToolbarState>((set) => ({
  activeQuestionId: null,
  activePassageIndex: null,
  activeQuestionGroupIndex: null,
  activeQuestionIndex: null,

  setActiveQuestion: (questionId, passageIndex, questionGroupIndex, questionIndex) =>
    set({
      activeQuestionId: questionId,
      activePassageIndex: passageIndex ?? null,
      activeQuestionGroupIndex: questionGroupIndex ?? null,
      activeQuestionIndex: questionIndex ?? null,
    }),

  clearActive: () =>
    set({
      activeQuestionId: null,
      activePassageIndex: null,
      activeQuestionGroupIndex: null,
      activeQuestionIndex: null,
    }),
}));