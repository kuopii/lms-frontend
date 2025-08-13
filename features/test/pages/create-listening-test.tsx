"use client";

import { useFormStore } from "@/store/form-store";
import React, { useCallback, useEffect } from "react";
import {
  CreateListeningTestSchema,
  createListeningTestSchema,
} from "../form/create-listening-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import BaseForm from "@/features/test/components/base-form";
import { Separator } from "@/components/ui/separator";

const CreateListeningTestPage = () => {
  const { setTitle, setTrigger } = useFormStore();

  const form = useForm<CreateListeningTestSchema>({
    resolver: zodResolver(createListeningTestSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "beginner",
      timeType: "notimer",
      type: "listening",
      typeTest: "single",
      hours: "00",
      minutes: "00",
      seconds: "00",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = useCallback((values: CreateListeningTestSchema) => {
    alert("Form submitted");
    console.log("Form values:", values);
  }, []);

  useEffect(() => {
    setTitle("Create a New Listening Test");
  }, [setTitle]);

  useEffect(() => {
    setTrigger(handleSubmit(onSubmit));
  }, [handleSubmit, setTrigger, onSubmit]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BaseForm />

        <Separator className="my-20" />
      </form>
      <pre className="mt-6 overflow-auto rounded-md bg-black p-4 text-sm text-white">
        {JSON.stringify(form.watch(), null, 2)}
      </pre>
    </FormProvider>
  );
};

export default CreateListeningTestPage;
