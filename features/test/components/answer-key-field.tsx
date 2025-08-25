"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

type OptionType = {
  option_key: string;
  option_text: string;
};

type AnswerKeyFieldProps = {
  name: string;
  variant: "single" | "multiple";
  options: OptionType[];
};

const AnswerKeyField = ({ name, variant, options }: AnswerKeyFieldProps) => {
  const validOptions = (options ?? []).filter(
    (opt) => opt.option_text.trim() !== "",
  );

  if (variant === "single") {
    return (
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem className="w-full md:w-fit md:max-w-64">
            <Select
              onValueChange={(value) => {
                const selectedOption = validOptions.find(
                  (opt) => opt.option_key === value,
                );
                if (selectedOption) {
                  field.onChange({
                    option_key: selectedOption.option_key,
                    option_text: selectedOption.option_text,
                  });
                }
              }}
              value={
                field.value &&
                typeof field.value === "object" &&
                "option_key" in field.value
                  ? field.value.option_key
                  : ""
              }
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Answer Key" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {validOptions.length === 0 ? (
                  <SelectItem value="no-options" disabled>
                    No valid options
                  </SelectItem>
                ) : (
                  validOptions.map((option) => (
                    <SelectItem
                      key={option.option_key}
                      value={option.option_key}
                    >
                      <div className="flex items-center gap-4">
                        <Badge className="rounded-full" size="icon">
                          {option.option_key}
                        </Badge>
                        {option.option_text}
                      </div>
                    </SelectItem>
                  ))
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
          // Ensure field.value is always an array of OptionType objects
          const currentValue: OptionType[] = Array.isArray(field.value)
            ? field.value
            : [];

          const syncValue = currentValue.filter((ans) =>
            validOptions.some((opt) => opt.option_key === ans.option_key),
          );

          if (syncValue.length !== currentValue.length) {
            field.onChange(syncValue);
          }

          return (
            <FormItem className="line-clamp-1 w-full space-y-2 md:w-fit">
              <div className="flex flex-wrap gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"xsm"}
                      className="text-muted-foreground hover:text-muted-foreground h-12 w-full overflow-hidden text-sm font-normal hover:bg-transparent md:max-w-64"
                    >
                      {currentValue.length > 0 ? (
                        <div className="flex items-center gap-3">
                          {currentValue.map((selectedOption: OptionType) => (
                            <div
                              key={selectedOption.option_key}
                              className="flex items-center gap-2"
                            >
                              <Badge
                                className="rounded-full text-black"
                                size="icon"
                              >
                                {selectedOption.option_key}
                              </Badge>
                              <span className="text-sm text-white">
                                {selectedOption.option_text}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        "Answer Key"
                      )}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-fit flex-col justify-start gap-2 rounded-3xl p-2">
                    {validOptions.map((option) => {
                      const isChecked = syncValue.some(
                        (v) => v.option_key === option.option_key,
                      );

                      return (
                        <label
                          key={option.option_key}
                          className="group hover:bg-border flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2"
                        >
                          <Checkbox
                            checked={isChecked}
                            className="group-hover:border-black"
                            disabled={!isChecked && syncValue.length >= 2}
                            onCheckedChange={(checked) => {
                              let newValue = [...syncValue];

                              if (checked) {
                                if (
                                  newValue.length < 2 &&
                                  !newValue.some(
                                    (v) => v.option_key === option.option_key,
                                  )
                                ) {
                                  newValue = [
                                    ...newValue,
                                    {
                                      option_key: option.option_key,
                                      option_text: option.option_text,
                                    },
                                  ];
                                }
                              } else {
                                newValue = newValue.filter(
                                  (v: OptionType) =>
                                    v.option_key !== option.option_key,
                                );
                              }

                              field.onChange(newValue);
                            }}
                          />
                          <Badge className="rounded-full" size="icon">
                            {option.option_key}
                          </Badge>
                          <span className="text-sm group-hover:text-black">
                            {option.option_text}
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

export default AnswerKeyField;
