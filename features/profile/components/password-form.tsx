"use client";

import React, { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ChangePasswordSchema } from "@/validators/profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { MdEditSquare } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const PasswordForm = memo(
  ({
    form,
    isLoading,
    onSubmit,
  }: {
    form: ReturnType<typeof useForm<ChangePasswordSchema>>;
    isLoading: boolean;
    onSubmit: (data: ChangePasswordSchema) => void;
  }) => {
    const [show, setShow] = useState({
      current_password: false,
      new_password: false,
      new_password_confirmation: false,
    });

    const toggleVisibility = useCallback((field: keyof typeof show) => {
      setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    }, []);

    const renderPasswordField = useCallback(
      (
        name: keyof ChangePasswordSchema,
        label: string,
        placeholder: string,
      ) => (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={show[name] ? "text" : "password"}
                    placeholder={placeholder}
                    className="pr-10"
                  />
                  <button
                    tabIndex={-1}
                    type="button"
                    onClick={() => toggleVisibility(name)}
                    className="text-muted-foreground absolute top-1/2 right-3.5 -translate-y-1/2 hover:cursor-pointer"
                  >
                    {show[name] ? <IoEye size={18} /> : <IoEyeOff size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
      [form.control, show, toggleVisibility],
    );

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {renderPasswordField(
            "current_password",
            "Old Password",
            "Enter old password",
          )}
          {renderPasswordField(
            "new_password",
            "New Password",
            "Enter new password",
          )}
          {renderPasswordField(
            "new_password_confirmation",
            "Confirm New Password",
            "Confirm new password",
          )}

          <div className="mt-4 flex justify-end">
            <Button
              size="xs"
              disabled={isLoading}
              type="submit"
              className="min-w-32 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Change Password <MdEditSquare size={20} />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  },
);

PasswordForm.displayName = "PasswordForm";
