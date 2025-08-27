"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm, Control, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormFieldCustom from "@/components/formField/FormFieldCustom";
import { useVocabularyModalStore } from "@/store/vocab-store";
import {
  createVocabulary,
  editVocabulary,
  CreateVocabularyType,
  EditVocabularyType,
} from "@/validators/vocabulary";

const categoryData = [
  { id: "1", name: "Verb" },
  { id: "2", name: "Adjective" },
  { id: "3", name: "Adverb" },
  { id: "4", name: "Noun" },
];

// Base fields yang sama di kedua form
type BaseVocabularyFields = {
  word: string;
  spelling: string;
  category_id: string;
  translation: string;
  wordExplanation: string;
};

// Shared form fields component dengan proper typing menggunakan generic constraint
const VocabularyFormFields = <T extends BaseVocabularyFields>({
  control,
}: {
  control: Control<T>;
}) => (
  <>
    <FormFieldCustom
      control={control}
      name={"word" as FieldPath<T>}
      label="Word"
      placeholder="Type the word here..."
    />

    <FormFieldCustom
      control={control}
      name={"category_id" as FieldPath<T>}
      label="Category"
      type="select"
      optionSelect={categoryData.map((e) => ({
        value: e.id,
        label: e.name,
      }))}
      placeholder="Select Category"
    />

    <FormFieldCustom
      control={control}
      name={"translation" as FieldPath<T>}
      label="Translation"
      placeholder="Type the translation here..."
    />

    <FormFieldCustom
      control={control}
      name={"spelling" as FieldPath<T>}
      label="Spelling"
      placeholder="Type the spelling here..."
    />

    <FormFieldCustom
      control={control}
      name={"wordExplanation" as FieldPath<T>}
      label="Word Explanation"
      placeholder="Type the explanation here..."
    />
  </>
);

const VocabularyModal = () => {
  const {
    isOpen,
    variant,
    vocabularyData,
    onCreateSubmit,
    onEditSubmit,
    closeModal,
  } = useVocabularyModalStore();

  // Use different resolvers based on variant
  const createForm = useForm<CreateVocabularyType>({
    resolver: zodResolver(createVocabulary),
    defaultValues: {
      word: "",
      spelling: "",
      category_id: "",
      translation: "",
      wordExplanation: "",
    },
  });

  const editForm = useForm<EditVocabularyType>({
    resolver: zodResolver(editVocabulary),
    defaultValues: {
      vocab_id: "",
      word: "",
      spelling: "",
      category_id: "",
      translation: "",
      wordExplanation: "",
    },
  });

  // Reset form when modal opens/closes or vocabulary data changes
  useEffect(() => {
    if (isOpen) {
      if (variant === "edit" && vocabularyData) {
        editForm.reset({
          vocab_id: vocabularyData.id?.toString() || "",
          word: vocabularyData.word,
          spelling: vocabularyData.spelling,
          category_id: vocabularyData.category_id,
          translation: vocabularyData.translation,
          wordExplanation: vocabularyData.wordExplanation,
        });
      } else {
        createForm.reset({
          word: vocabularyData?.word || "",
          spelling: "",
          category_id: "",
          translation: "",
          wordExplanation: "",
        });
      }
    }
  }, [isOpen, variant, vocabularyData, createForm, editForm]);

  const handleCreateFormSubmit = (data: CreateVocabularyType) => {
    if (onCreateSubmit) {
      onCreateSubmit(data);
    }

    closeModal();
  };

  const handleEditFormSubmit = (data: EditVocabularyType) => {
    if (onEditSubmit) {
      onEditSubmit(data);
    }
  };

  if (variant === "create") {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="flex max-w-md flex-col rounded-3xl border-none px-0 py-4">
          <div className="relative">
            <DialogHeader className="absolute top-0 right-0 left-0 border-b px-4 py-5">
              <DialogTitle>Add New Vocabulary</DialogTitle>
            </DialogHeader>
          </div>

          <FormProvider {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateFormSubmit)}
              className="super-thin-scrollbar my-16 h-full space-y-4 overflow-y-auto px-4"
            >
              <VocabularyFormFields
                control={createForm.control as VocabularyFormControl}
              />

              <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-3 border-t px-4 pt-4">
                <Button
                  variant="custom"
                  size="custom"
                  type="submit"
                  className="flex-1"
                >
                  Add Vocabulary
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="flex max-w-md flex-col rounded-3xl border-none px-0 py-4">
        <div className="relative">
          <DialogHeader className="absolute top-0 right-0 left-0 border-b px-4 py-5">
            <DialogTitle>Edit Vocabulary</DialogTitle>
          </DialogHeader>
        </div>

        <FormProvider {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(handleEditFormSubmit)}
            className="super-thin-scrollbar my-16 h-full space-y-4 overflow-y-auto px-4"
          >
            <VocabularyFormFields
              control={editForm.control as VocabularyFormControl}
            />

            <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-3 border-t px-4 pt-4">
              <Button
                variant="custom"
                size="custom"
                type="submit"
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default VocabularyModal;
