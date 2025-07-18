"use client";

import SelectModuleType from "@/components/container/select-module-type";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { ModuleType } from "@/types/class";
import { useQuery } from "@tanstack/react-query";
import { Search, Trash, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import imageEmpty from "@/public/images/empty-test-image.png";
import { Button } from "@/components/ui/button";
import { FaCirclePlay } from "react-icons/fa6";
import {
  sortOptions,
  levelOptions,
  listeningQuestionTypes,
  readingQuestionTypes,
} from "@/data/test-filter-options";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BsSliders } from "react-icons/bs";

type Test = {
  id: string;
  image?: string | null;
  name: string;
  attempts: number;
};

type ParamsType = {
  search?: string | null;
  module_type?: ModuleType | null;
  sort?: string | null;
  level?: string | null;
  question_type?: string | null;
};

export const dummyTests: Test[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1565022536102-f7645c84354a",
    name: "Grammar Essentials",
    attempts: 145,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1552321046-a54642dc0cb8",
    name: "Vocabulary Builder",
    attempts: 298,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
    name: "English Reading Test",
    attempts: 73,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1477865300989-86ba6d4adcab",
    name: "Listening Comprehension",
    attempts: 202,
  },
  { id: "5", image: null, name: "TOEFL Practice Test", attempts: 87 },
];

export const useFetchTests = ({
  onError,
  search,
  type,
  sort,
  level,
  questionType,
}: {
  onError: (e: Error) => void;
  search: string;
  type: ModuleType;
  sort: string;
  level: string;
  questionType?: string | null;
}) => {
  return useQuery<Test[]>({
    queryFn: async () => {
      const obj = {
        search,
        type,
        sort,
        level,
        questionType,
      };
      console.log("OBJ", obj);
      try {
        const data = dummyTests;
        return data;
      } catch (error) {
        onError(error as Error);
        throw error;
      }
    },
    queryKey: ["tests", search, type, sort, level, questionType],
  });
};

const Filter = ({
  params,
  updateParams,
  moduleType,
  questionTypeOptions,
  className,
  radioGroupClassName,
}: {
  params: ParamsType;
  updateParams: (val: Partial<ParamsType>) => void;
  moduleType: ModuleType;
  questionTypeOptions: { label: string; value: string }[];
  className?: string;
  radioGroupClassName?: string;
}) => {
  return (
    <section
      className={cn(
        "hidden h-fit w-full flex-col gap-5 rounded-3xl border border-[#FFFFFF66] p-6 lg:col-span-2 lg:flex",
        className,
      )}
    >
      {/* Sort By */}
      <div className="space-y-4">
        <h3 className="text-white">Sort By</h3>
        <RadioGroup
          value={params.sort || "latest"}
          onValueChange={(val) => updateParams({ sort: val })}
          className={cn("space-y-3", radioGroupClassName)}
        >
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label className="hover:cursor-pointer" htmlFor={option.value}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <Separator />
      {/* Level */}
      <div className="space-y-4">
        <h3 className="text-white">Level</h3>
        <RadioGroup
          value={params.level || "beginner"}
          onValueChange={(val) => updateParams({ level: val })}
          className={cn("space-y-3", radioGroupClassName)}
        >
          {levelOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label className="hover:cursor-pointer" htmlFor={option.value}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      {/* Question Type */}
      {(moduleType === ModuleType.Reading ||
        moduleType === ModuleType.Listening) && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-white">Question Type</h3>
            <RadioGroup
              value={params.question_type || ""}
              onValueChange={(val) => updateParams({ question_type: val })}
              className={cn("space-y-3", radioGroupClassName)}
            >
              {questionTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    className="hover:cursor-pointer"
                    htmlFor={option.value}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </section>
  );
};

const DiscoverTest = () => {
  const { params, updateParams, resetParams } = useUpdateSearchParams();
  const [search, setSearch] = useState(params.search || "");
  const debouncedSearch = useDebounce(search, 300);
  const [moduleType, setModuleType] = useState<ModuleType>(
    (params.module_type as ModuleType) || ModuleType.Reading,
  );
  const sort = params.sort || "latest";
  const level = params.level || "beginner";
  const questionType = params.question_type || null;

  const { data: testsData } = useFetchTests({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
    },
    search: debouncedSearch,
    type: moduleType,
    sort,
    level,
    questionType,
  });

  useEffect(() => {
    updateParams({ search: debouncedSearch || null });
  }, [debouncedSearch, updateParams]);

  const handleChangeModuleType = (value: ModuleType) => {
    setModuleType(value);
    updateParams({ module_type: value, question_type: null });
  };

  const showResetButton =
    debouncedSearch !== "" ||
    moduleType !== ModuleType.Reading ||
    sort !== "latest" ||
    level !== "beginner" ||
    questionType !== null;

  const handleReset = () => {
    resetParams();
    setSearch("");
    setModuleType(ModuleType.Reading);
  };

  const questionTypeOptions =
    moduleType === ModuleType.Listening
      ? listeningQuestionTypes
      : moduleType === ModuleType.Reading
        ? readingQuestionTypes
        : [];

  return (
    <div>
      <h1 className="mb-2.5 text-[28px] font-semibold text-white">
        Discover Tests
      </h1>
      <p className="mb-11">
        Browse a collection of free practice tests to sharpen your skills
        anytime.
      </p>
      <div className="mb-9 grid grid-cols-1 flex-col gap-4 md:grid-cols-3 lg:flex lg:flex-row">
        <Input
          conteinerClassName="lg:w-full md:col-span-3"
          value={search}
          placeholder="Search"
          className="h-11 border-[#FFFFFF66]"
          onChange={(e) => setSearch(e.target.value)}
          endIcon={search ? X : Search}
          onClickEndIcon={search ? () => setSearch("") : undefined}
        />
        <SelectModuleType
          value={moduleType}
          className="lg:w-xs"
          onChange={handleChangeModuleType}
        />
        <div className="flex w-full flex-1 gap-4 md:col-span-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                size={"sm"}
                className="h-11 flex-1 rounded-full border-[#FFFFFF66] lg:hidden"
              >
                Filter <BsSliders />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter</DialogTitle>
                <DialogDescription>
                  Select your preferences to narrow test results.
                </DialogDescription>
              </DialogHeader>
              <Filter
                params={params}
                className="flex rounded-none border-none p-0"
                radioGroupClassName="grid grid-cols-2 "
                updateParams={updateParams}
                moduleType={moduleType}
                questionTypeOptions={questionTypeOptions}
              />
              <DialogClose asChild>
                <Button
                  variant="outline"
                  size={"xs"}
                  className="mt-4 rounded-full md:ml-auto md:w-fit"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          {showResetButton && (
            <Button
              disabled={!showResetButton}
              onClick={handleReset}
              variant={"destructive"}
              className="h-11 flex-1 rounded-full"
              size={"xs"}
            >
              <Trash />
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:gap-8">
        <Filter
          params={params}
          updateParams={updateParams}
          moduleType={moduleType}
          questionTypeOptions={questionTypeOptions}
        />
        <section className="grid h-fit grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-4">
          {testsData?.length === 0 ? (
            <div className="col-span-1 mx-auto flex max-w-lg flex-col items-center justify-between py-20 text-center md:col-span-2">
              <Image
                src={"/images/empty-test-illustration.png"}
                width={800}
                height={500}
                priority
                className="mb-8 h-auto max-w-[358px]"
                alt="class empty illustration"
              />
              <h1 className="mb-2.5 text-2xl font-semibold text-white">
                Hang Tight!
              </h1>
              <p>
                This section doesn&apos;t have any available tests for now, but
                they&apos;ll show up soon.
              </p>
            </div>
          ) : (
            testsData?.map((testItem) => (
              <Card
                key={testItem.id}
                className="h-fit cursor-pointer border border-[#FFFFFF66] bg-transparent pt-0"
              >
                <Image
                  className="h-[136px] w-full rounded-t-xl object-cover"
                  width={500}
                  height={300}
                  src={testItem.image ?? imageEmpty}
                  alt={testItem.name}
                />
                <div className="flex flex-1 flex-col justify-between gap-10">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-base leading-8 font-normal">
                      {testItem.name}
                    </CardTitle>
                    <p className="text-foreground text-xs font-normal">
                      {testItem.attempts} attempts made
                    </p>
                  </CardHeader>
                  <CardFooter>
                    <Button size="xs" className="h-7 rounded-full px-3 text-xs">
                      Attempt the Test
                      <FaCirclePlay className="size-[15px]" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default DiscoverTest;
