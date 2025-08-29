"use client";

import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePointsCalculation } from "@/hooks/use-points-calculation";
import { CircleQuestionMark } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PointsField = ({ questionPath }: { questionPath: string }) => {
  const [showPointsWarning, setShowPointsWarning] = useState(false);
  const { control } = useFormContext();

  const { totalPoints, maxPointsForCurrent, remainingPoints, isOverLimit } =
    usePointsCalculation(questionPath);

  const handlePointsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling

    const value = e.target.value;
    const numValue = value === "" ? undefined : Number(value);

    // Always update the field first (for controlled input)
    onChange(numValue ?? 0);

    // Show warning if this would exceed total
    if (numValue && numValue > maxPointsForCurrent) {
      setShowPointsWarning(true);
      setTimeout(() => setShowPointsWarning(false), 3000);
    }
  };

  const getPointsInputStyle = () => {
    if (isOverLimit) {
      return "border-destructive focus:ring-destructive text-destructive";
    }
    return "";
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="hidden text-white md:block">Point: </span>
        <FormField
          control={control}
          name={`${questionPath}.points_value`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    max={maxPointsForCurrent}
                    min={1}
                    variant="underline"
                    placeholder="Score Point"
                    value={field.value ?? ""}
                    onChange={(e) => handlePointsChange(e, field.onChange)}
                    onKeyDown={(e) => {
                      // Prevent Enter from submitting form
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur(); // Remove focus
                      }
                    }}
                    className={`w-20 ${getPointsInputStyle()}`}
                  />
                  {showPointsWarning && (
                    <Badge
                      className="absolute -top-7 -left-24 z-10"
                      variant={"destructive"}
                    >
                      Total would exceed 100! Max: {maxPointsForCurrent}
                    </Badge>
                    // <div className="bg-destructive absolute -top-10 -left-24 z-10 rounded px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
                    //   Total would exceed 100! Max: {maxPointsForCurrent}
                    // </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Points info */}
      <Badge variant={isOverLimit ? "destructive" : "primary"} size={"lg"}>
        {remainingPoints}
        <Tooltip>
          <TooltipTrigger className="hover:cursor-pointer">
            <CircleQuestionMark size={16} />
          </TooltipTrigger>
          <TooltipContent className="flex max-w-48 flex-col gap-1 text-xs">
            <p>
              <span className="font-semibold">Remaining:</span>{" "}
              {remainingPoints}
            </p>
            <p>
              <span className="font-semibold">Total:</span> {totalPoints}/100
            </p>
            <Separator className="my-1" />
            <p className="text-gray-300">
              Remaining shows how many points you still have left to spend.
              Total is your accumulated points out of 100.
            </p>
          </TooltipContent>
        </Tooltip>
      </Badge>
    </div>
  );
};

export default PointsField;
