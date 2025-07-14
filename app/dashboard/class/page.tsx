"use client";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { Role } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaCircleArrowRight, FaCircleUser } from "react-icons/fa6";
import { toast } from "sonner";
import classEmptyIllustration from "@/public/images/class-empty-illustration.png";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiBookMarkedFill } from "react-icons/ri";
import { classData } from "@/data/dummy-class-data";
import { useRouter } from "next/navigation";

export const useFetchClasses = ({
  onError,
  userId,
}: {
  onError: (e: Error) => void;
  userId: string;
}) => {
  return useQuery({
    queryFn: async () => {
      try {
        const data = classData;
        // const { data } = await axiosInstance.get(`/class/${userId}`);
        return data;
      } catch (error) {
        onError(error as Error);
        console.error(error);
        throw error;
      }
    },
    enabled: !!userId,
    queryKey: ["class", userId],
  });
};

export const useJoinClass = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}) => {
  return useMutation({
    mutationFn: async ({ classCode }: { classCode: string }) => {
      const { data: response } = await axiosInstance.post(`/class/join`, {
        classCode,
      });
      return response;
    },
    onSuccess,
    onError,
  });
};

const joinClassFormSchema = z.object({
  classCode: z
    .string({
      required_error: "Class code is required",
    })
    .min(1, "Class code is required")
    .uuid({
      message: "Invalid class code format",
    }),
});

type JoinClassFormSchema = z.infer<typeof joinClassFormSchema>;

const ClassActionModal = ({ onTrigger }: { onTrigger: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<JoinClassFormSchema>({
    resolver: zodResolver(joinClassFormSchema),
    defaultValues: {
      classCode: "",
    },
  });

  const { mutate: joinClass, isPending: isJoining } = useJoinClass({
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success("Joined class successfully");
    },
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
  });

  const onSubmit = (data: JoinClassFormSchema) => {
    console.log("Submitted data:", data);
    joinClass({ classCode: data.classCode });
  };

  const handleClose = () => {
    setOpen(false);
    form.reset(); // Reset form saat dialog ditutup
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{onTrigger}</DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader className="border-b pb-6">
          <DialogTitle className="text-center text-xl">Join Class</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-white">
              Get the class code from your teacher, then enter it here
            </p>

            <FormField
              control={form.control}
              name="classCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Enter your class code" />
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <p className="text-sm text-[#AAAAAA]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <DialogFooter className="gap-4 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="border-primary hover:bg-primary rounded-full hover:text-white"
                onClick={handleClose}
              >
                Not Now
              </Button>
              <Button type="submit" size="xs" className="rounded-full">
                {isJoining ? "Joining..." : " Access Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ClassPage = () => {
  const router = useRouter();
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.STUDENT,
    },
  });

  const { data: classes } = useFetchClasses({
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
    userId: session?.user?.id,
  });

  return (
    <div>
      {classes?.length === 0 ? (
        <section className="mt-8 flex min-h-[70svh] flex-col items-center justify-center gap-8">
          <Image
            width={650}
            height={495}
            priority
            src={classEmptyIllustration}
            className="h-auto w-3/4 max-w-[450px]"
            alt="class empty illustration"
          />
          <h1 className="text-2xl font-semibold">Add a class to get started</h1>
          <ClassActionModal
            onTrigger={
              <Button
                className="rounded-full [&_svg:not([class*='size-'])]:size-6"
                size={"xs"}
              >
                Join the Class <FaCircleArrowRight />
              </Button>
            }
          />
        </section>
      ) : (
        <div className="flex flex-col gap-11">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">My Classes</h1>
            <ClassActionModal
              onTrigger={
                <Button
                  className="rounded-full [&_svg:not([class*='size-'])]:size-6"
                  size={"xs"}
                >
                  Join the Class
                </Button>
              }
            />
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {classData.map((classItem) => (
              <Card
                onClick={() => router.push(`/dashboard/class/${classItem.id}`)}
                key={classItem.id}
                className="cursor-pointer border-transparent pt-0 pb-3 transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <Image
                    className="h-[103px] w-full rounded-t-xl object-cover"
                    width={500}
                    height={300}
                    src={classItem.image}
                    alt={classItem.name}
                  />
                  <Avatar className="absolute right-3 bottom-[-30px] h-[70px] w-[70px]">
                    <AvatarImage
                      className="object-cover"
                      src={classItem.teacher.image}
                      alt={classItem.teacher.name}
                    />
                    <AvatarFallback className="text-muted-foreground">
                      {classItem.teacher.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}{" "}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="max-w-3/4 overflow-hidden">
                  <CardTitle className="line-clamp-2 leading-8">
                    {classItem.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-end">
                  <div className="flex -space-x-2">
                    {classItem.students.slice(0, 3).map((student) => (
                      <Avatar
                        key={student.id}
                        className="h-8 w-8 border-[0.3px] border-[#FFFFFF66]"
                      >
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {classItem.students.length > 4 && (
                      <div className="z-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-[#787878]">
                        +{classItem.students.length - 4}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <FaCircleUser size={18} />
                    <p>
                      Teacher: <span>{classItem.teacher.name}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RiBookMarkedFill size={18} />
                    <p>
                      <span>{classItem.file}</span> file
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
