"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface OptionProps {
  value: string | number;
  label: string;
}

interface FormFieldCustomParams<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "select" | "file" | "textarea" | "number";
  optionSelect?: OptionProps[];
  disabled?: boolean;
  rows?: number;
  onChangeCustom?: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | number
      | string,
  ) => void;
}

const FormFieldCustom = <T extends FieldValues>({
  control,
  name,
  type = "text",
  label,
  placeholder,
  optionSelect,
  onChangeCustom,
  disabled,
  rows,
}: FormFieldCustomParams<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          if (type === "file") {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              field.onChange(file); // kirim FileList ke react-hook-form
              onChangeCustom?.(e as React.ChangeEvent<HTMLInputElement>); // trigger preview
            }
          } else {
            field.onChange(e);
            console.log("isi field.onChange(e)", e.target.value);
          }
        };

        return (
          <FormItem className="flex flex-col gap-[15px]">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {type === "select" && optionSelect ? (
                <Select
                  onValueChange={(val) => {
                    const foundOption = optionSelect.find(
                      (opt) => opt.value === val || String(opt.value) === val,
                    );
                    const shouldBeNumber =
                      typeof foundOption?.value === "number";

                    field.onChange(shouldBeNumber ? Number(val) : val);
                    onChangeCustom?.(val);
                  }}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger className="w-full" disabled={disabled}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {optionSelect.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "file" ? (
                <Input
                  type="file"
                  name={field.name}
                  ref={field.ref}
                  onChange={handleChange}
                  className="w-full"
                />
              ) : type === "textarea" ? (
                <textarea
                  {...field}
                  rows={rows}
                  placeholder={placeholder}
                  className="focus:ring-primary w-full rounded border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
                />
              ) : type === "number" ? (
                <Input
                  type="number"
                  placeholder={placeholder}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                  className="w-full"
                />
              ) : (
                <Input
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  className="w-full"
                  disabled={disabled}
                  onChange={(e) => {
                    field.onChange(e);
                    onChangeCustom?.(e);
                  }}
                />
              )}
            </FormControl>
            <FormMessage className="rounded-[1px] text-[14px]">
              {fieldState.error?.message}
            </FormMessage>
          </FormItem>
        );
      }}
    />
  );
};

export default FormFieldCustom;
