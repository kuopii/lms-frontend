"use client";

import FormFieldCustom from "@/components/formField/FormFieldCustom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  createVocabulary,
  CreateVocabularyType,
} from "@/validators/vocabulary";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, Search, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";

type FormTypeMethod = "create" | "update" | "delete";

const dataVocab: VocabularyData[] = [
  {
    category_id: 1,
    word: "Frustrate",
    spelling: "/ˌfrʌ'streit/",
    category: "Verb",
    translation: "Hinder or prevent, as an effort, plan, or desire.",
  },
  {
    category_id: 2,
    word: "Frustrate",
    spelling: "/ˌfrʌ'streit/",
    category: "Adjective",
    translation: "Hinder or prevent, as an effort, plan, or desire.",
  },
  {
    category_id: 3,
    word: "Frustrate",
    spelling: "/ˌfrʌ'streit/",
    category: "Adverb",
    translation: "Hinder or prevent, as an effort, plan, or desire.",
  },
  {
    category_id: 4,
    word: "Frustrate",
    spelling: "/ˌfrʌ'streit/",
    category: "Noun",
    translation: "Hinder or prevent, as an effort, plan, or desire.",
  },
];

const classData: ClassData[] = [
  {
    id: 1,
    name: "class-A",
  },
  {
    id: 2,
    name: "class-B",
  },
  {
    id: 3,
    name: "class-C",
  },
  {
    id: 4,
    name: "class-D",
  },
];

// ----- TYPE ROLE -----
type Role = "student" | "teacher";

// ----- Hooks UseDebouce -----
export function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}

//  ----- Search Bar -----
export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 900);

  // bisa dimasukkan ke helper "extractValue"
  const extractValue = (
    e:
      | string
      | number
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): string => {
    if (typeof e === "string") return e;
    if (typeof e === "number") return e.toString();
    if ("target" in e) return e.target.value;
    return "";
  };

  const handleSearchChange = (
    e:
      | string
      | number
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = extractValue(e);
    console.log("typed value:", value);
    setSearchTerm(value);
  };

  const form = useForm<{ search: string }>();

  useEffect(() => {
    if (debouncedSearch.trim() !== "") {
      console.log("debouncedSearch", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <Form {...form}>
      <div className="relative flex h-full w-full">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <Input
              {...field}
              onChange={handleSearchChange}
              placeholder="Search vocabulary here..."
            />
          )}
        />

        <span className="absolute right-5 bottom-2.5 text-white">
          <Search size={25} />
        </span>
      </div>
    </Form>
  );
};

// CARD/CARD VOCAB
interface CardVocabParams {
  dataVocab: VocabularyData[];
}
export const CardVocab = ({ dataVocab }: CardVocabParams) => {
  console.log("data vocab?", dataVocab);

  const getBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "verb":
        return "bg-[#50BFA5] text-white text-[16px] border-none";
      case "adjective":
        return "bg-[#EE47FF] text-white text-[16px] border-none";
      case "adverb":
        return "bg-[#0F68DC] text-white text-[16px] border-none";
      case "noun":
        return "bg-[#FFC107] text-white text-[16px] border-none";
      default:
        return "bg-gray-300 text-black text-[16px] border-none";
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-[25px]">
      {dataVocab.map((e, idx) => {
        return (
          <div key={idx} className="flex flex-col gap-[25px]">
            <div className="card-custom flex w-full flex-col gap-[15px] border-none px-[30px] py-[14px] md:flex-row">
              <div className="flex flex-col items-start justify-center gap-[22px] p-[10px] md:w-[300px]">
                <p className="typoSubHeadlines">{e.word}</p>
                <div className="flex items-center justify-start gap-[20px]">
                  <span>
                    <Volume2 className="size-[20px]" />
                  </span>
                  <p className="text-[16px] uppercase">{e.spelling}</p>
                </div>
              </div>

              <div className="flex w-full justify-between gap-[15px]">
                <div className="flex flex-col gap-[22px] p-[10px]">
                  <div className="flex items-center justify-start gap-[20px]">
                    <Badge
                      className={`text-[16px] ${getBadgeClass(e.category)}`}
                      variant={"custom"}
                    >
                      {e.category}
                    </Badge>
                    <p className="typoSubHeadlines">Translation</p>
                  </div>
                  <p className="text-justify">{e.translation}</p>
                </div>
                <span className="flex items-center justify-center">
                  {/* color="#7A9D58" */}
                  <FaBookmark className="text-primary" size={25} />
                </span>
              </div>
            </div>
            <Separator className="bg-neutral-custom-3" />
          </div>
        );
      })}
    </div>
  );
};

// ----- Select COMPONENT -----
interface SelectVocabularyParams {
  data: ClassData[];
}
export const SelectVocabulary = ({ data }: SelectVocabularyParams) => {
  if (!data) return;
  console.log("data class?", data);

  const [selectedValue, setSelectedValue] = useState("");
  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="select-trigger-custom w-[180px] bg-[#333333] text-white">
        <SelectValue placeholder="Select Class" />
      </SelectTrigger>

      <SelectContent className="bg-[#333333] text-white">
        {data.map((e) => (
          <SelectItem key={e.id} value={String(e.id)}>
            {selectedValue === String(e.id) && (
              <CheckCircle2 size={18} className="text-green-400" />
            )}
            <span>{e.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// ----- VocabularyComp COMPONENT -----
export interface VocabularyData {
  word: string;
  spelling: string;
  category_id: number;
  category: string;
  translation: string;
  wordExplanation?: string;
}

export interface VocabularyCompParams {
  userData?: UserData;
}

export interface ClassData {
  id: number;
  name: string;
}

// ----- Dialog COMPONENT for create and edit -----
interface DialogVocabFormParams {
  titleTriger: string;
  titleTrigerClassName?: string;
  dialogTriggerClassName?: string;
  titleHeader: string;
  titleHeaderClassName?: string;
  textButton: string;
  textDialogDescription?: string;
  classNameButton?: string;
  iconButton?: React.ReactNode;
  type: FormTypeMethod;
  setOpenDialog: (ctx: boolean) => void;
  openDialog: boolean;
  idEdit?: string;
  iconSubmit?: React.ReactNode;
}

export const DialogVocabForm = ({
  textButton,
  titleTriger,
  titleTrigerClassName,
  titleHeader,
  titleHeaderClassName,
  textDialogDescription,
  classNameButton,
  iconButton,
  dialogTriggerClassName,
  type,
  openDialog,
  setOpenDialog,
  idEdit,
  iconSubmit,
}: DialogVocabFormParams) => {
  const form = useForm<CreateVocabularyType>({
    resolver: zodResolver(createVocabulary),
  });

  const onSubmit: SubmitHandler<CreateVocabularyType> = (data) => {
    if (type === "create") {
      console.log("data?", data);
    }
  };

  const CategoryIdOption = classData.map((e) => ({
    value: e.id,
    label: `${e.name}`,
  }));

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger className={dialogTriggerClassName}>
          {iconButton}
          <span className={titleTrigerClassName}>{titleTriger}</span>
        </DialogTrigger>
        <DialogContent className="flex flex-col rounded-[30px] border-none px-[20] py-[15px] lg:h-[700px] lg:w-[850px]">
          <DialogHeader>
            <DialogTitle className={titleHeaderClassName}>
              {titleHeader}
            </DialogTitle>
            <Separator className="mt-[15px] mb-[20px]" />
            <DialogDescription>{textDialogDescription}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormFieldCustom
                control={form.control}
                name="word"
                label="Word"
                placeholder="Type the word here..."
              />
              <FormFieldCustom
                control={form.control}
                name="category_id"
                label="Category"
                type="select"
                optionSelect={CategoryIdOption}
                placeholder="Select Category"
              />

              <FormFieldCustom
                control={form.control}
                name="translation"
                label="Translation"
                type="select"
                placeholder="Type the translation here..."
              />

              <FormFieldCustom
                control={form.control}
                name="spelling"
                label="Spelling"
                placeholder="Type the spelling here..."
              />

              <FormFieldCustom
                control={form.control}
                name="wordExplanation"
                label="Word Explanation"
                placeholder="Type the explanation here..."
              />
              <div className="flex w-full items-center justify-center">
                <Button
                  variant={"custom"}
                  size={"custom"}
                  className={classNameButton}
                  type="submit"
                >
                  {iconSubmit}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Create Vocab
export const CreateVocab = () => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <DialogVocabForm
      openDialog={openCreate}
      setOpenDialog={setOpenCreate}
      type="create"
      textButton="submit"
      titleTriger="Add New Vocabulary"
      titleHeader="Add New Vocabulary"
      titleHeaderClassName="typoSubHeadlines"
      titleTrigerClassName="text-white"
      iconButton={<Plus className="size-[25px]" />}
      dialogTriggerClassName="flex gap-[11px] text-[16px] cursor-pointer"
      iconSubmit={<FaSave className="size-[20px]" />}
    />
  );
};

export const VocabularyComp = ({ userData }: VocabularyCompParams) => {
  if (!userData) return;

  const isStudent = userData.role === "student";
  const isTeacher = userData.role === "teacher";

  // todo : fetch data untuk class

  return (
    <main className="flex flex-col gap-[45px]">
      <section className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
        <h2 className="text-[28px] font-semibold">
          {isStudent ? "My Vocabulary List" : "Class Vocabulary Bank"}
        </h2>

        {/*  teacher  */}
        {isTeacher && (
          <Button variant={"custom"} size={"custom"}>
            <CreateVocab />
          </Button>
        )}
      </section>

      {/* teacher : [add vocab, search form, select class ] || student : [ search form ] */}
      <section className="flex w-full items-center justify-center gap-4">
        <SearchBar />
        {/* teacher  */}
        {isTeacher && classData && <SelectVocabulary data={classData} />}
      </section>

      <section>
        <CardVocab dataVocab={dataVocab} />
      </section>
    </main>
  );
};

// FORM VOCAB
// test user
export interface UserData {
  name: string;
  role: Role;
}

export const userData: UserData = {
  name: "user",
  role: "teacher",
};

const page = () => {
  return (
    <div>
      <VocabularyComp userData={userData} />
    </div>
  );
};

export default page;
