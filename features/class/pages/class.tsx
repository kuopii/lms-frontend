"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCircleArrowRight, FaCircleUser } from "react-icons/fa6";
import { toast } from "sonner";
import classEmptyIllustration from "@/public/images/class-empty-illustration.png";
import classEmptyIllustrationTeacher from "@/public/images/class-empty-illustration-2.png";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiBookMarkedFill } from "react-icons/ri";
import { getInitialsFromName } from "@/helpers/get-initials-from-name";
import { useFetchClasses } from "@/features/class/api/use-fetch-classes";
import { ClassActionModal } from "@/features/class/components/class-action-modal";
import { Role } from "@/types/auth";
import { Button } from "@/components/ui/button";

export const ClassPage = () => {
  const router = useRouter();
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
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
            src={
              session.user.role === Role.STUDENT
                ? classEmptyIllustration
                : classEmptyIllustrationTeacher
            }
            className="h-auto w-3/4 max-w-[450px]"
            alt="class empty illustration"
          />
          <h1 className="text-2xl font-semibold">
            {" "}
            {session.user.role === Role.STUDENT ? "Add" : "Create"} a class to
            get started
          </h1>
          <ClassActionModal
            onTrigger={
              <Button
                className="rounded-full [&_svg:not([class*='size-'])]:size-6"
                size={"xs"}
              >
                {session.user.role === Role.STUDENT
                  ? "Join the Class"
                  : "Set Up Class"}
                <FaCircleArrowRight />
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
                  {session.user.role === Role.STUDENT
                    ? "Join the Class"
                    : "Create Class"}
                </Button>
              }
            />
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {classes?.map((classItem) => (
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
                      {getInitialsFromName(classItem.teacher.name)}
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
                          {getInitialsFromName(student.name)}
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
