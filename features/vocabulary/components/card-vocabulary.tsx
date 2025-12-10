"use client";

import React, { useState } from "react";
import { SquarePen, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FaBookmark } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/auth";
import { VocabularyData, useVocabularyModalStore } from "@/store/vocab-store";
import { EditVocabularyType } from "@/validators/vocabulary";
import { useUpdateVocabulary } from "../api/use-update-vocabulary";
import { toast } from "sonner";

const CardVocabulary = ({ vocab }: { vocab: VocabularyData }) => {
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });

  const { openEditModal, closeModal } = useVocabularyModalStore();

  const getBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "verb":
        return "bg-[#50BFA5] text-white border-none";
      case "adjective":
        return "bg-[#EE47FF] text-white border-none";
      case "adverb":
        return "bg-[#0F68DC] text-white border-none";
      case "noun":
        return "bg-[#FFC107] text-white border-none";
      default:
        return "bg-gray-300 text-black border-none";
    }
  };

  const { mutate: updateVocabulary } = useUpdateVocabulary({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    onSuccess: () => {
      toast.success("Vocabulary created successfully");
      closeModal();
    },
  });

  const handleEdit = (data: EditVocabularyType) =>
    updateVocabulary({ payload: data, accessToken: undefined });

  const handleEditClick = () => {
    openEditModal(vocab, handleEdit);
  };

  return (
    <div className="relative flex flex-col gap-6">
      <div className="card-custom flex w-full flex-col gap-4 border-none px-6 py-3 lg:flex-row">
        <div className="flex flex-col items-start justify-center gap-5 p-[10px] lg:w-[300px]">
          <p className="text-lg font-medium">{vocab.word}</p>
          <div className="flex items-center justify-start gap-[20px]">
            <span>
              <Volume2 className="size-5" />
            </span>
            <p className="text-sm uppercase">{vocab.spelling}</p>
          </div>
        </div>

        <div className="flex w-full justify-between gap-3">
          <div className="flex flex-col gap-5 p-2.5">
            <div className="flex items-center justify-start gap-5">
              <Badge
                size={"lg"}
                className={cn(getBadgeClass(vocab.category), "border-none")}
                variant={"custom"}
              >
                {vocab.category}
              </Badge>
              <p className="typoSubHeadlines">Translation</p>
            </div>
            <p className="text-justify text-sm">{vocab.translation}</p>
          </div>

          {session.user.role === Role.TEACHER ? (
            <Button
              onClick={handleEditClick}
              className="absolute top-6 right-6 items-center justify-center hover:bg-transparent md:static lg:flex"
              variant={"ghost"}
              size={"iconSm"}
            >
              <SquarePen className="text-primary" size={25} />
            </Button>
          ) : (
            <Button
              className="absolute top-6 right-6 items-center justify-center hover:bg-transparent md:static lg:flex"
              variant={"ghost"}
              size={"iconSm"}
            >
              <FaBookmark className="text-primary" size={25} />
            </Button>
          )}
        </div>
      </div>
      <Separator className="bg-neutral-custom-3" />
    </div>
  );
};

export default CardVocabulary;
