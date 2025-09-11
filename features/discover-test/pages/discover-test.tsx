"use client";

import { SelectModuleType } from "@/components/container/select-module-type";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { ModuleType } from "@/types/class";
import { Search, Trash, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
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
import { BsSliders } from "react-icons/bs";
import { useFetchTests } from "../api/use-fetch-tests";
import { Filter } from "../components/filter";
import { CardTest } from "../components/card-test";

export const DiscoverTestPage = () => {
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

  const handleChangeModuleType = useCallback(
    (value: ModuleType) => {
      setModuleType(value);
      updateParams({ module_type: value, question_type: null });
    },
    [updateParams],
  );

  const showResetButton =
    debouncedSearch !== "" ||
    moduleType !== ModuleType.Reading ||
    sort !== "latest" ||
    level !== "beginner" ||
    questionType !== null;

  const handleReset = useCallback(() => {
    resetParams();
    setSearch("");
    setModuleType(ModuleType.Reading);
  }, [resetParams]);

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
              <CardTest key={testItem.id} testItem={testItem} />
            ))
          )}
        </section>
      </div>
    </div>
  );
};
