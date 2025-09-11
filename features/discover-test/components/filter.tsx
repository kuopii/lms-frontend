"use client";

import { ModuleType } from "@/types/class";
import { cn } from "@/lib/utils";
import { sortOptions, levelOptions } from "@/data/test-filter-options";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

type ParamsType = {
  search?: string | null;
  module_type?: ModuleType | null;
  sort?: string | null;
  level?: string | null;
  question_type?: string | null;
};

export const Filter = ({
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
  questionTypeOptions: readonly { label: string; value: string }[];
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
