"use client";

import { flattenErrors, prettyPath } from "@/helpers/flattern-error";
import { useFormStore } from "@/store/form-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createWritingTestForm,
  CreateWritingTestForm,
} from "../form/create-writing-form";
import BaseForm from "../components/base-form";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

const PassageSection = dynamic(
  () => import("../writing/passage-section").then((mod) => mod.PassageSection),
  {
    ssr: false,
  },
);

const CreateWritingTestPage = () => {
  const { setTrigger, setTitle } = useFormStore();

  const form = useForm<CreateWritingTestForm>({
    resolver: zodResolver(createWritingTestForm),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "beginner",
      timer_mode: "notimer",
      type_test: "single",
      type: "writing",
      timer_settings: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      settings: {
        shuffle_questions: false,
      },
      passages: [
        {
          title: "",
          description: "",
          image_context: null,
          questions: [{ question_number: 1, question_text: "" }],
        },
      ],
    },
  });

  const {
    fields: passageFields,
    append: appendPassage,
    remove: removePassage,
  } = useFieldArray({
    control: form.control,
    name: "passages",
  });

  const onSubmit = useCallback((values: CreateWritingTestForm) => {
    alert("Form submitted");
    console.log("Form values:", values);
  }, []);

  const onError = useCallback(
    (errors: typeof form.formState.errors) => {
      const flat = flattenErrors(errors);
      flat.forEach((err) => {
        toast.error(`${prettyPath(err.path)}: ${err.message}`);
      });
    },
    [form],
  );

  const handleAddPassage = useCallback(() => {
    appendPassage({
      title: "",
      description: "",
      image_context: null,
      questions: [{ question_number: 1, questioin_text: "" }],
    });
  }, [appendPassage]);

  useEffect(() => {
    setTitle("Create a New Writing Test");
  }, [setTitle]);

  useEffect(() => {
    setTrigger(form.handleSubmit(onSubmit, onError));
  }, [setTrigger, form, onSubmit, onError]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <BaseForm showAllowRepetition={false} />

        <Separator className="my-20" />

        <div className="flex flex-col gap-16">
          {passageFields.map((field, index) => {
            return (
              <PassageSection
                key={field.id}
                index={index}
                isLast={passageFields.length === 1}
                onRemove={removePassage}
                onAddPassage={handleAddPassage}
              />
            );
          })}
        </div>
      </form>
      <pre className="mt-6 overflow-auto rounded-md bg-black p-4 text-sm text-white">
        {JSON.stringify(form.watch(), null, 2)}
      </pre>
    </FormProvider>
  );
};

export default CreateWritingTestPage;
