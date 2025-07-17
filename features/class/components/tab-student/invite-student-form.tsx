"use client";

import { InviteStudentFormSchema } from ".";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "sonner";

const InviteStudentForm = ({
  onInviteStudent,
}: {
  onInviteStudent: (data: InviteStudentFormSchema) => void;
}) => {
  const form = useFormContext<InviteStudentFormSchema>();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onInviteStudent)}
        className="mt-4 space-y-5"
      >
        <FormField
          control={form.control}
          name="classCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  endIcon={Copy}
                  onClickEndIcon={() => {
                    if (field.value) {
                      navigator.clipboard.writeText(field.value);
                      toast.success("Class code copied to clipboard!");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-center">
          <Button
            className="mx-auto h-10 rounded-full [&_svg:not([class*='size-'])]:size-6"
            size="sm"
          >
            <FaUserPlus />
            Invite Student
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InviteStudentForm;
