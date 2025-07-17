"use client";

import React, { useEffect, useState } from "react";
import DetailStudent from "./detail-student";
import { cn } from "@/lib/utils";
import { Role } from "@/types/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import InviteStudentForm from "./invite-student-form";
import { FaUserPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useFetchClass } from "../../api/use-fetch-class";
import { toast } from "sonner";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/helpers/get-initials-from-name";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/use-debounce";

export const inviteStudentFormSchema = z.object({
  classCode: z.string(),
  email: z.string().email(),
});

export type InviteStudentFormSchema = z.infer<typeof inviteStudentFormSchema>;

const CardStudent = ({
  student,
  onClick,
  isTeacher,
}: {
  student: { id: string; name: string; image?: string };
  onClick: () => void;
  isTeacher: boolean;
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5 px-2.5">
          <Avatar className="size-9">
            <AvatarImage src={student.image} alt={student.name} />
            <AvatarFallback>{getInitialsFromName(student.name)}</AvatarFallback>
          </Avatar>
          <span className="text-white">{student.name}</span>
        </div>
        {isTeacher && (
          <Button
            onClick={onClick}
            size="xs"
            className="h-7 bg-[#787878] px-1.5 text-xs hover:bg-[#787878E6]"
          >
            View Profile
          </Button>
        )}
      </div>
      <Separator />
    </>
  );
};

const TabContentStudent = ({ classId }: { classId: string }) => {
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });
  const isTeacher = session.user.role === Role.TEACHER;
  const { params, updateParams } = useUpdateSearchParams();
  const [detailStudent, setDetailStudent] = useState<null | any>(null);
  const [searchStudent, setSearchStudent] = useState(
    params.search_student || "",
  );
  const debouncedSearchStudent = useDebounce(searchStudent, 300);

  const { data: classData } = useFetchClass({
    classId,
    onError: (e) => {
      toast.error(e.message || "Something went wrong");
      console.error(e);
    },
  });

  const form = useForm<InviteStudentFormSchema>({
    resolver: zodResolver(inviteStudentFormSchema),
    defaultValues: {
      classCode: classId,
      email: "",
    },
  });

  const handleInviteStudent = (data: InviteStudentFormSchema) => {
    console.log(data);
  };

  useEffect(() => {
    updateParams({ search_student: debouncedSearchStudent || null });
  }, [debouncedSearchStudent, updateParams]);

  return (
    <div className="w-full">
      {detailStudent ? (
        <DetailStudent
          student={detailStudent}
          onStudentChange={setDetailStudent}
        />
      ) : (
        <>
          <div
            className={cn(
              "mb-6 flex items-center justify-between",
              session.user.role === Role.TEACHER &&
                "flex-col gap-4 md:flex-row",
            )}
          >
            {session.user.role === Role.STUDENT ? (
              <h3 className="text-xl font-medium">My Classmate</h3>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="xs"
                    className="order-2 h-10 w-full rounded-full md:order-1 md:w-fit [&_svg:not([class*='size-'])]:size-6"
                  >
                    <FaUserPlus />
                    Invite Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl">
                      Invite Student
                    </DialogTitle>
                  </DialogHeader>
                  <FormProvider {...form}>
                    <InviteStudentForm onInviteStudent={handleInviteStudent} />
                  </FormProvider>
                </DialogContent>
              </Dialog>
            )}
            <div
              className={cn(
                session.user.role === Role.TEACHER &&
                  "order-1 w-full md:order-2 md:w-1/2 lg:w-fit",
              )}
            >
              <Input
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search"
                className="h-11 w-full lg:w-96"
                endIcon={searchStudent ? X : Search}
                onClickEndIcon={
                  searchStudent ? () => setSearchStudent("") : undefined
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {classData?.students?.map((student) => (
              <CardStudent
                key={student.id}
                student={student}
                isTeacher={isTeacher}
                onClick={() => setDetailStudent(student)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TabContentStudent;
