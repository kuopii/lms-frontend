import { create } from "zustand";
import {
  CreateVocabularyType,
  EditVocabularyType,
} from "@/validators/vocabulary";

export type VocabularyData = {
  id?: number;
  word: string;
  spelling: string;
  category_id: string; // Changed to string to match schema
  category: string;
  translation: string;
  wordExplanation: string; // Made required to match schema
};

interface VocabularyModalState {
  isOpen: boolean;
  variant: "create" | "edit";
  vocabularyData: VocabularyData | null;
  onCreateSubmit: ((data: CreateVocabularyType) => void) | null;
  onEditSubmit: ((data: EditVocabularyType) => void) | null;

  // Actions
  openCreateModal: (
    vocabulary?: VocabularyData,
    onSubmit?: (data: CreateVocabularyType) => void,
  ) => void;
  openEditModal: (
    vocabulary: VocabularyData,
    onSubmit?: (data: EditVocabularyType) => void,
  ) => void;
  closeModal: () => void;
}

export const useVocabularyModalStore = create<VocabularyModalState>((set) => ({
  isOpen: false,
  variant: "create",
  vocabularyData: null,
  onCreateSubmit: null,
  onEditSubmit: null,

  openCreateModal: (vocabulary, onSubmit) =>
    set({
      isOpen: true,
      variant: "create",
      vocabularyData: vocabulary,
      onCreateSubmit: onSubmit || null,
      onEditSubmit: null,
    }),

  openEditModal: (vocabulary, onSubmit) =>
    set({
      isOpen: true,
      variant: "edit",
      vocabularyData: vocabulary,
      onCreateSubmit: null,
      onEditSubmit: onSubmit || null,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      variant: "create",
      vocabularyData: null,
      onCreateSubmit: null,
      onEditSubmit: null,
    }),
}));
