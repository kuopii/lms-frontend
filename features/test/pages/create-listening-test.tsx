"use client";

import { Separator } from "@/components/ui/separator";
import BaseForm from "@/features/test/components/base-form";
import { useFormStore } from "@/store/form-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  CreateListeningTestSchema,
  createListeningTestSchema,
} from "../form/create-listening-form";
import { PassageSection } from "../listening/components/passage-section";
import { questionTemplates } from "../listening/types/question-templates";

const CreateListeningTestPage = () => {
  const { setTitle, setTrigger } = useFormStore();

  const form = useForm<CreateListeningTestSchema>({
    resolver: zodResolver(createListeningTestSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "beginner",
      timer_mode: "notimer",
      type_test: "single",
      type: "reading",
      timer_settings: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      allow_repetition: false,
      max_repetition_count: undefined,
      is_public: false,
      is_published: false,
      settings: {
        shuffle_questions: false,
      },
      passages: [
        {
          audio_file: null,
          questionGroups: [
            {
              instruction: "",
              transcript: {
                type: "descriptive",
                text: "",
                title: "",
              },
              questions: [
                {
                  id: crypto.randomUUID(),
                  ...questionTemplates["Choose_the_Correct_Answer"](),
                },
              ],
            },
          ],
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

  const { handleSubmit } = form;

  const handleAddPassage = useCallback(() => {
    const newQuestion = {
      ...questionTemplates["Choose_the_Correct_Answer"](),
      id: crypto.randomUUID(),
    };
    appendPassage({
      title: "",
      description: "",
      questionGroups: [
        {
          instruction: "",
          questions: [newQuestion],
        },
      ],
    });
  }, [appendPassage]);

  const onSubmit = useCallback((values: CreateListeningTestSchema) => {
    alert("Form submitted");
    console.log("Form values:", values);
    form.reset();
  }, []);

  useEffect(() => {
    setTitle("Create a New Listening Test");
  }, [setTitle]);

  useEffect(() => {
    setTrigger(handleSubmit(onSubmit));
  }, [handleSubmit, setTrigger, onSubmit]);

  console.log("passage length ?", passageFields.length);

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

export default CreateListeningTestPage;
