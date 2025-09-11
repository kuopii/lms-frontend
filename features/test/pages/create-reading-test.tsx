"use client";

import { Separator } from "@/components/ui/separator";
import BaseForm from "@/features/test/components/base-form";
import {
  createReadingTestSchema,
  CreateReadingTestSchema,
} from "@/features/test/form/create-reading-form";
import { useFormStore } from "@/store/form-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { defaultReadingQuestion } from "../constant/default-reading-question";
import { PassageSection } from "../reading/components/passage-section";
import VocabularyModal from "@/features/vocabulary/components/vocabulary-modal";
import { toast } from "sonner";
import { flattenErrors, prettyPath } from "@/helpers/flattern-error";

const CreateReadingTestPage = () => {
  const { setTrigger, setTitle } = useFormStore();
  const form = useForm<CreateReadingTestSchema>({
    resolver: zodResolver(createReadingTestSchema),
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
          title: "",
          description: "",
          questionGroups: [
            {
              instruction: "",
              questions: [defaultReadingQuestion["choose_correct_answer"]],
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
      questionGroups: [
        {
          instruction: "",
          questions: [defaultReadingQuestion["choose_correct_answer"]],
        },
      ],
    });
  }, [appendPassage]);

  useEffect(() => {
    setTrigger(handleSubmit(onSubmit, onError));
  }, [handleSubmit, setTrigger, onSubmit, onError]);

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
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
      <VocabularyModal />
    </>
  );
};

export default CreateReadingTestPage;
