"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ErrorForm } from "@/features/dashboard/dashboard-listening/components/error-form";
import { QuestionsPerSection } from "@/features/dashboard/dashboard-listening/components/question-per-section";
import { AudioDropzone } from "@/features/test/listening/components/audio-dropzone";
import TranscriptForm from "@/features/test/listening/transcript/transcript-form";
import { questionTemplates } from "@/features/test/listening/types/question-templates";
import { createHandleDragEnd } from "@/features/test/listening/utils/handle-drag-end";
import {
  formSchema,
  FormValues,
  submitCreateSchema,
} from "@/validators/create-test-listening-teacher";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

// COMPONENT CreateTestListening

const CreateTestListening = () => {
  const [addTranscriptActive, setAddTranscriptActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<{
    section: number;
    question: number;
  } | null>(null); // Track soal aktif
  const [activeId, setActiveId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Beginner",
      type: "single",
      sections: [],
    },
  });

  const { control, handleSubmit, watch, setValue, getValues } = form;

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = (data: FormValues) => {
    const safeData = submitCreateSchema.parse(data);
    console.log("Submitted with safe data:", safeData);

    form.reset();
  };

  // handle append section
  const handleAppendSection = useCallback(() => {
    const newQuestion = {
      ...questionTemplates["Choose_the_Correct_Answer"](),
      id: crypto.randomUUID(),
    };
    appendSection({
      instructions: "",
      audio: undefined,
      transcriptValue: undefined,
      questions: [newQuestion],
    });
    // reset fokus agar tidak double append
    setActiveIndex(null);
  }, [appendSection]);

  // func move question
  function moveQuestion(
    fromSection: number,
    toSection: number,
    fromIndex: number,
    toIndex: number,
  ) {
    const allSections = getValues("sections");
    const questionToMove = allSections[fromSection].questions[fromIndex];
    if (!questionToMove) return;

    if (fromSection === toSection) {
      // Reorder di dalam section yang sama
      const updatedQuestions = [...allSections[fromSection].questions];
      const [movedItem] = updatedQuestions.splice(fromIndex, 1);
      updatedQuestions.splice(toIndex, 0, movedItem);

      setValue(`sections.${fromSection}.questions`, updatedQuestions);
    } else {
      // Pindah antar section
      const updatedFromQuestions = [...allSections[fromSection].questions];
      const updatedToQuestions = [...allSections[toSection].questions];

      updatedFromQuestions.splice(fromIndex, 1);
      updatedToQuestions.splice(toIndex, 0, questionToMove);

      setValue(`sections.${fromSection}.questions`, updatedFromQuestions);
      setValue(`sections.${toSection}.questions`, updatedToQuestions);
    }
  }

  // handle drag untuk perpindahan section
  const handleDragEndSection = createHandleDragEnd({
    move: moveQuestion,
  });

  // console.log("activeIndex.section", activeIndex?.section);
  // console.log("activeIndex.question", activeIndex?.question);
  console.log("initial form", form.watch("sections"));

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <header>
            {/* header bisa diganti dengan reusable comp */}
            <div className="flex items-center justify-between">
              <h2 className="typoHeadlines">Create a New Listening Test </h2>
              <Button type="submit">Submit</Button>
            </div>
          </header>

          {/* container */}
          <div className="mt-[46px]">
            {/* test input and timer */}
            <div>
              <div className="flex flex-col justify-between md:flex-row">
                <div className="flex w-full flex-col gap-[25px] md:w-[624px]">
                  <div>
                    <div className="flex h-[65px] w-full items-end gap-[25px]">
                      <p className="typoSubHeadlines w-[174px]">Test Title</p>
                      <input
                        className="w-[425px] border-b border-b-white outline-none"
                        placeholder="Judul Test"
                        {...form.register("title", { required: true })}
                      />
                    </div>
                    <ErrorForm error={form.formState.errors.title} />
                  </div>

                  {/* description */}
                  <div>
                    <div className="flex h-[65px] w-full items-end gap-[25px]">
                      <p className="typoSubHeadlines w-[174px]">
                        Test Description
                      </p>
                      <input
                        className="w-[425px] border-b border-b-white outline-none"
                        placeholder="Deskripsi Test"
                        {...form.register("description", { required: true })}
                      />
                    </div>
                    <ErrorForm error={form.formState.errors.description} />
                  </div>

                  {/* Difficulty Selector  */}
                  <div className="flex h-[65px] w-full items-end">
                    <div className="flex gap-[25px]">
                      <p className="typoSubHeadlines w-[174px] font-medium">
                        Difficulty Level :
                      </p>
                      <ToggleGroup
                        type="single"
                        value={watch("difficulty")}
                        onValueChange={(val) =>
                          setValue("difficulty", val as any)
                        }
                        className="flex gap-2 rounded-full border"
                      >
                        {["Beginner", "Intermediate", "Advanced"].map(
                          (level) => (
                            <ToggleGroupItem
                              key={level}
                              value={level}
                              className="hover:text-primary data-[state=on]:bg-primary bg-transparent px-[15px] capitalize hover:bg-transparent data-[state=on]:text-white"
                            >
                              {level}
                            </ToggleGroupItem>
                          ),
                        )}
                      </ToggleGroup>
                    </div>
                  </div>
                </div>

                {/* card timer */}
                <div className="card-custom h-full w-[346px] px-[18px] py-[15px]">
                  <div className="flex flex-col gap-[25px]">
                    <div>
                      <p className="typoSubHeadlines">Test Completion Time</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <p>Countdown</p>
                      <p>Count up</p>
                      <p>No timer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* separator */}
            <Separator className="my-[80px] bg-[#ffffff]" />

            {/* Test Type Selector */}
            <div className="mb-5">
              <Select
                value={watch("type")}
                onValueChange={(val) => setValue("type", val as any)}
              >
                <SelectTrigger className="w-[200px] bg-[#333333]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Test</SelectItem>
                  <SelectItem value="full">Full Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add Question + new Section awal */}
            {sectionFields.length < 1 && (
              <div className="mt-[50px]">
                <Button
                  size={"custom"}
                  type="button"
                  onClick={() => {
                    console.log("clicked");
                    handleAppendSection();
                  }}
                  variant="custom"
                >
                  + Add Question
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-[50px]">
              {/* Render Section */}
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndSection}
              >
                <div className="space-y-[50px]">
                  {sectionFields.map((section, sectionIndex) => {
                    const transcriptValue = watch(
                      `sections.${sectionIndex}.transcriptValue`,
                    );
                    const transcriptName = transcriptValue?.name;

                    return (
                      <div
                        key={section.id}
                        className="flex h-full w-full flex-col items-center justify-center gap-[50px]"
                      >
                        <div className="flex w-full flex-col gap-[50px]">
                          {/* Audio Dropzone */}
                          {transcriptName === "descriptive" && (
                            <div className="mt-[40px] flex w-full flex-col gap-[45px]">
                              <div className="flex gap-[50px]">
                                <div className="flex w-[156px] items-center justify-start border-r border-[#dedede]">
                                  <p className="typoSubHeadlines">
                                    Section {sectionIndex + 1}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <p className="typoSubHeadlines mb-2 text-white">
                                    Upload and Attach Audio
                                  </p>
                                  <p className="text-[16px] text-[#DEDEDE]">
                                    Add listening material to enhance your
                                    questions.
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3">
                                <AudioDropzone sectionIndex={sectionIndex} />
                                <p className="text-[12px] text-[#aaaaaa]">
                                  Accepted file types: MP3
                                </p>
                              </div>
                            </div>
                          )}

                          {transcriptName === "conversation" && (
                            <p className="typoSubHeadlines mt-[40px] text-white">
                              Section {sectionIndex + 1}
                            </p>
                          )}

                          {/* Add Transcript */}
                          <div>
                            {addTranscriptActive ? (
                              <>
                                {/* Isi transcript pilihan select :  Conversation/Dialog atau Descriptive text  */}
                                <TranscriptForm
                                  removeSection={removeSection}
                                  sectionIndex={sectionIndex}
                                />
                              </>
                            ) : (
                              <Button
                                onClick={() => setAddTranscriptActive(true)}
                                size={"custom"}
                                type="button"
                                variant="custom"
                              >
                                <Plus className="size-[24px]" />
                                Add Transcript
                              </Button>
                            )}
                          </div>
                        </div>

                        {/*  instructions */}
                        <div className="bg-primary flex w-full flex-col gap-[17px] rounded-[30px] p-[20px] text-white">
                          <h4 className="typoSubHeadlines">
                            Question Instructions
                          </h4>
                          <input
                            className="h-[57px] px-2 text-[16px] text-[#dedede] outline-none"
                            placeholder="Type instruction for this question type here..."
                            {...form.register(
                              `sections.${sectionIndex}.instructions`,
                            )}
                          />
                          <Separator className="bg-white" />
                          <ErrorForm
                            error={
                              form.formState.errors.sections?.[sectionIndex]
                                ?.instructions
                            }
                          />
                        </div>

                        {/* section */}
                        <div className="w-full">
                          <QuestionsPerSection
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                            sectionIndex={sectionIndex}
                            control={control}
                            setValue={setValue}
                            watch={watch}
                            handleAppendSection={handleAppendSection} // untuk menambahkan section baru
                          />
                        </div>

                        <Separator />
                      </div>
                    );
                  })}
                </div>
              </DndContext>
            </div>
          </div>

          {/* test */}
          <pre className="mt-6 overflow-auto rounded-md bg-black p-4 text-sm text-white">
            {JSON.stringify(form.watch(), null, 2)}
          </pre>
        </form>
      </FormProvider>
    </div>
  );
};

const page = () => {
  return (
    <div>
      <CreateTestListening />
    </div>
  );
};

export default page;
