"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInitialsFromName } from "@/helpers/get-initials-from-name";
import { Class, Student } from "@/types/class";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCircleUser } from "react-icons/fa6";
// import { RiBookMarkedFill } from "react-icons/ri";

export const CardClass = ({ classItem }: { classItem: Class }) => {
  const router = useRouter();
  const { id, name, cover_image, teacher } = classItem;
  return (
    <Card
      onClick={() => router.push(`/dashboard/class/${id}`)}
      key={classItem.id}
      className="cursor-pointer border-transparent pt-0 pb-3 transition-transform duration-300 hover:scale-105"
    >
      <div className="relative">
        <Image
          className="h-[103px] w-full rounded-t-xl object-cover"
          width={500}
          height={300}
          src={cover_image}
          alt={name}
        />
        <Avatar className="absolute right-3 bottom-[-30px] h-[70px] w-[70px]">
          <AvatarImage
            className="object-cover"
            src={teacher.avatar || ""}
            alt={teacher.name}
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
        {classItem?.students?.length === 0 || classItem?.students === null ? (
          <div className="z-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-[#787878]">
            {classItem?.students?.length ?? 0}
          </div>
        ) : (
          <div className="flex -space-x-2">
            {classItem?.students?.slice(0, 3).map((student: Student) => (
              <Avatar
                key={student.id}
                className="h-8 w-8 border-[0.3px] border-[#FFFFFF66]"
              >
                <AvatarImage src={student.avatar || ""} alt={student.name} />
                <AvatarFallback>
                  {getInitialsFromName(student.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {classItem?.students && classItem.students.length > 4 && (
              <div className="z-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-[#787878]">
                +{classItem.students.length - 4}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <FaCircleUser size={18} />
          <p>
            Teacher: <span>{classItem.teacher.name}</span>
          </p>
        </div>
        {/* <div className="flex items-center gap-1.5">
          <RiBookMarkedFill size={18} />
          <p>
            <span>{classItem.file}</span> file
          </p>
        </div> */}
      </CardFooter>
    </Card>
  );
};
