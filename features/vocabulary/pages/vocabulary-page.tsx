"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { Role } from "@/types/auth";
import { Plus, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useVocabularyModalStore, VocabularyData } from "@/store/vocab-store";
import VocabularyModal from "../components/vocabulary-modal";
import { CreateVocabularyType } from "@/validators/vocabulary";
import CardVocabulary from "../components/card-vocabulary";
import { useFetchVocabularies } from "../api/use-fetch-vocabularies";
import { useCreateVocabulary } from "../api/use-create-vocabulary";
import { toast } from "sonner";

export type ClassData = {
  id: number;
  name: string;
};

const vocabData: VocabularyData[] = [
  {
    id: 1,
    category_id: "1",
    word: "Frustrate",
    spelling: "/ˌfrʌ'streit/",
    category: "Verb",
    translation:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    wordExplanation:
      "To feel or cause to feel upset or annoyed as a result of being unable to change or achieve something.",
  },
  {
    id: 2,
    category_id: "2",
    word: "Beautiful",
    spelling: "/ˈbjuːtɪfəl/",
    category: "Adjective",
    translation: "Having beauty; pleasing to the senses or mind aesthetically",
    wordExplanation:
      "Possessing qualities that give great pleasure or satisfaction to see, hear, think about, etc.",
  },
  {
    id: 3,
    category_id: "3",
    word: "Quickly",
    spelling: "/ˈkwɪkli/",
    category: "Adverb",
    translation: "At a fast speed; rapidly",
    wordExplanation: "At a fast speed; rapidly; without delay.",
  },
  {
    id: 4,
    category_id: "4",
    word: "Computer",
    spelling: "/kəmˈpjuːtər/",
    category: "Noun",
    translation: "An electronic device for storing and processing data",
    wordExplanation:
      "An electronic device which is capable of receiving information and performing a sequence of operations in accordance with a predetermined set of procedural instructions.",
  },
];

export const VocabularyPage = () => {
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });

  const { openCreateModal, closeModal } = useVocabularyModalStore();
  const { updateParams } = useUpdateSearchParams();
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { mutate: createVocabulary } = useCreateVocabulary({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    onSuccess: () => {
      toast.success("Vocabulary created successfully");
      closeModal();
    },
  });

  useEffect(() => {
    updateParams({ search: debouncedSearch });
  }, [debouncedSearch, updateParams]);

  const { data: vocabularies } = useFetchVocabularies({
    search: debouncedSearch,
    class: selectedClass,
    onError: (e) => console.error(e),
  });

  const handleCreateVocabulary = useCallback(
    (data: CreateVocabularyType) => {
      console.log("Creating new vocabulary:", data);
      createVocabulary(data);
    },
    [createVocabulary],
  );

  const handleSelectClassChange = useCallback(
    (value: string) => {
      setSelectedClass(value);
      updateParams({ class: value });
    },
    [updateParams],
  );

  const handleCreateClick = useCallback(() => {
    openCreateModal(
      {
        category_id: "",
        word: "",
        spelling: "",
        category: "",
        translation: "",
        wordExplanation: "",
      },
      handleCreateVocabulary,
    );
  }, [handleCreateVocabulary, openCreateModal]);

  return (
    <div className="space-y-11">
      {/* Header */}
      <div
        className={cn(
          "flex w-full flex-col justify-between gap-4 md:flex-row",
          session.user.role === Role.STUDENT ? "items-start" : "items-center",
        )}
      >
        <h2 className="text-[clamp(1.6rem,2vw,3rem)] font-semibold">
          {session.user.role === Role.STUDENT
            ? "My Vocabulary List"
            : "Class Vocabulary Bank"}
        </h2>

        {session.user.role === Role.TEACHER && (
          <Button
            onClick={handleCreateClick}
            size={"xsm"}
            className="w-full md:w-fit"
          >
            <Plus />
            Add New Vocabulary
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vocabulary here..."
          onClickEndIcon={search.length > 0 ? () => setSearch("") : undefined}
          endIcon={search.length > 0 ? X : Search}
        />
        {session.user.role === Role.TEACHER && (
          <Select value={selectedClass} onValueChange={handleSelectClassChange}>
            <SelectTrigger className="select-trigger-custom w-full bg-[#333333] text-white capitalize md:max-w-[180px]">
              <SelectValue placeholder="Select Class" className="capitalize" />
            </SelectTrigger>

            <SelectContent className="bg-[#333333] text-white">
              {vocabularies?.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.name}
                  className="capitalize"
                >
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Vocabularies */}
      <div className="w-full space-y-6">
        {vocabData.map((vocab) => (
          <CardVocabulary key={vocab.id} vocab={vocab} />
        ))}
      </div>

      {/* Modal Component */}
      <VocabularyModal />
    </div>
  );
};
