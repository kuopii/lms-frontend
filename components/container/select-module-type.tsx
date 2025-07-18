"use client";

import { ModuleType } from "@/types/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SelectModuleType = ({
  value,
  onChange,
  placeholder = "Select module type",
  className,
}: {
  value: ModuleType;
  onChange: (val: ModuleType) => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as ModuleType)}>
      <SelectTrigger
        className={cn("h-11 w-full border-[#FFFFFF66] bg-[#333333]", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-[#FFFFFF66] p-1">
        {Object.values(ModuleType).map((type) => (
          <SelectItem className="rounded-xl" key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectModuleType;
