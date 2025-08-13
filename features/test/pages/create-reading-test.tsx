"use client";

import React, { useCallback, useEffect } from "react";
import {
  createReadingTestSchema,
  CreateReadingTestSchema,
} from "@/features/test/form/create-reading-form";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { PassageSection } from "../reading/components/passage-section";
import { defaultQuestionValues } from "../constant/default-question-values";
import { useFormStore } from "@/store/form-store";
import BaseForm from "@/features/test/components/base-form";

const CreateReadingTestPage = () => {
  const { setTrigger, setTitle } = useFormStore();
  const form = useForm<CreateReadingTestSchema>({
    resolver: zodResolver(createReadingTestSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "beginner",
      timeType: "notimer",
      typeTest: "single",
      type: "reading",
      hours: "00",
      minutes: "00",
      seconds: "00",
      passages: [
        {
          title: "",
          description: "",
          questionGroups: [
            {
              instruction: "",
              questions: [defaultQuestionValues["note_completion"]],
            },
          ],
        },
      ],
    },
  });

  const { handleSubmit } = form;

  const {
    fields: passageFields,
    append: appendPassage,
    remove: removePassage,
  } = useFieldArray({
    control: form.control,
    name: "passages",
  });

  useEffect(() => {
    setTitle("Create a New Reading Test");
  }, [setTitle]);

  const onSubmit = useCallback((values: CreateReadingTestSchema) => {
    alert("Form submitted");
    console.log("Form values:", values);
  }, []);

  const handleAddPassage = useCallback(() => {
    appendPassage({
      title: "",
      description: "",
      questionGroups: [
        {
          instruction: "",
          questions: [
            {
              id: crypto.randomUUID(),
              type: "choose_correct_answer",
              question: "",
              options: ["Option 1"],
              answerKey: "",
              breakdown: "",
            },
          ],
        },
      ],
    });
  }, [appendPassage]);

  useEffect(() => {
    setTrigger(handleSubmit(onSubmit));
  }, [handleSubmit, setTrigger, onSubmit]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <BaseForm />

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

export default CreateReadingTestPage;
