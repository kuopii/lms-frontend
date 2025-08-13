"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type AnswerKeyFieldProps = {
  name: string;
  variant: "single" | "multiple";
  options: string[];
};

export const AnswerKeyField = ({
  name,
  variant,
  options,
}: AnswerKeyFieldProps) => {
  const validOptions = (options ?? []).filter((opt) => opt.trim() !== "");

  if (variant === "single") {
    return (
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem className="w-full md:w-fit">
            <Select
              onValueChange={field.onChange}
              value={
                Array.isArray(field.value)
                  ? (field.value[0] ?? "")
                  : (field.value ?? "")
              }
            >
              <FormControl>
                <SelectTrigger className="w-full max-w-64">
                  <SelectValue placeholder="Answer Key" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {validOptions.length === 0 ? (
                  <SelectItem value="no-options" disabled>
                    No valid options
                  </SelectItem>
                ) : (
                  validOptions.map((option, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    return (
                      <SelectItem key={option} value={option}>
                        <div className="flex items-center gap-4">
                          <Badge className="rounded-full" size="icon">
                            {label}
                          </Badge>
                          {option}
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (variant === "multiple") {
    return (
      <FormField
        name={name}
        render={({ field }) => {
          // Ensure field.value is always an array
          const currentValue = Array.isArray(field.value) ? field.value : [];

          return (
            <FormItem className="w-full max-w-sm space-y-2">
              <div className="flex flex-wrap gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"xsm"}
                      className="text-muted-foreground hover:text-muted-foreground h-12 text-sm font-normal hover:bg-transparent"
                    >
                      {currentValue.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                          {currentValue.map((selectedOption: string) => {
                            const optionIndex = validOptions.findIndex(
                              (opt) => opt === selectedOption,
                            );
                            const label =
                              optionIndex >= 0
                                ? String.fromCharCode(65 + optionIndex)
                                : "?";

                            return (
                              <div
                                key={selectedOption}
                                className="flex items-center gap-2"
                              >
                                <Badge
                                  className="rounded-full text-black"
                                  size="icon"
                                >
                                  {label}
                                </Badge>
                                <span className="text-sm text-white">
                                  {selectedOption}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        "Answer Key"
                      )}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-fit flex-col justify-start gap-2 rounded-3xl p-2">
                    {validOptions.map((option, idx) => {
                      const label = String.fromCharCode(65 + idx);
                      const isChecked = currentValue.includes(option);

                      return (
                        <label
                          key={option}
                          className="group hover:bg-border flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2"
                        >
                          <Checkbox
                            checked={isChecked}
                            className="group-hover:border-black"
                            disabled={!isChecked && currentValue.length >= 2}
                            onCheckedChange={(checked) => {
                              let newValue = [...currentValue];

                              if (checked) {
                                if (
                                  newValue.length < 2 &&
                                  !newValue.includes(option)
                                ) {
                                  newValue = [...newValue, option];
                                }
                              } else {
                                newValue = newValue.filter(
                                  (v: string) => v !== option,
                                );
                              }

                              field.onChange(newValue);
                            }}
                          />
                          <Badge className="rounded-full" size="icon">
                            {label}
                          </Badge>
                          <span className="text-sm group-hover:text-black">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                    <span className="text-muted-foreground my-1 px-4 text-sm">
                      {currentValue.length}/2 selected
                    </span>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  return null;
};
