"use client";

import React, { memo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateUserSchema } from "@/validators/profile";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { IoMdImage } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { MdEditSquare } from "react-icons/md";

export const ProfileForm = memo(
  ({
    form,
    onSubmit,
  }: {
    form: ReturnType<typeof useForm<UpdateUserSchema>>;
    onSubmit: (data: UpdateUserSchema) => void;
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder="Your name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="Your email..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Profile Image
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-between gap-4 overflow-hidden md:flex-row">
                  {/* Preview */}
                  <div className="border-muted aspect-square w-1/2 shrink-0 overflow-hidden rounded-3xl border md:h-20 md:w-20 md:rounded-full">
                    {field.value instanceof File ? (
                      <Image
                        src={URL.createObjectURL(field.value)}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <IoMdImage size={24} />
                      </div>
                    )}
                  </div>

                  {/* Custom File Input */}
                  <label className="border-muted-foreground text-muted-foreground hover:bg-muted/20 flex w-full cursor-pointer items-center justify-start gap-4 rounded-md border border-dashed px-4 py-2 text-sm">
                    <span className="bg-primary rounded-md px-4 py-1.5 text-white">
                      Upload
                    </span>
                    <span className="line-clamp-1 max-w-[200px] truncate overflow-hidden">
                      {field.value?.name || "No file selected"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        form.setValue("avatar", file || null);
                      }}
                    />
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-end">
          <Button size="xs" type="submit" className="rounded-full">
            Update <MdEditSquare size={20} />
          </Button>
        </div>
      </form>
    </Form>
  ),
);

ProfileForm.displayName = "ProfileForm";
