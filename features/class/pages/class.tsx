"use client";

import { Loader } from "@/components/container/loader";
import { GeneralError } from "@/components/pages/general-error";
import { Button } from "@/components/ui/button";
import { useFetchClasses } from "@/features/class/api/use-fetch-classes";
import { ClassActionModal } from "@/features/class/components/class-action-modal";
import classEmptyIllustrationTeacher from "@/public/images/class-empty-illustration-2.png";
import classEmptyIllustration from "@/public/images/class-empty-illustration.png";
import { Role } from "@/types/auth";
import { Class } from "@/types/class";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaCircleArrowRight } from "react-icons/fa6";
import { toast } from "sonner";
import { CardClass } from "../components/card-class";

export const ClassPage = () => {
  const { data: session } = useSession();

  const {
    data: classes,
    isPending,
    isError,
    refetch,
  } = useFetchClasses({
    onError: (e) => {
      if (e instanceof AxiosError) {
        const message = e.response?.data?.message;
        toast.error(message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
    accessToken: session?.accessToken,
  });

  if (isPending) {
    return <Loader className="min-h-[80vh]" />;
  }

  if (isError) {
    return (
      <GeneralError
        className="h-[75vh]"
        withBackButton={false}
        textButton="Retry"
        onClick={refetch}
      />
    );
  }

  return (
    <>
      {classes?.length === 0 ? (
        <section className="mt-8 flex min-h-[70svh] flex-col items-center justify-center gap-8">
          <Image
            width={650}
            height={495}
            priority
            src={
              session?.user.role === Role.STUDENT
                ? classEmptyIllustration
                : classEmptyIllustrationTeacher
            }
            className="h-auto w-3/4 max-w-[450px]"
            alt="class empty illustration"
          />
          <h1 className="text-2xl font-semibold">
            {" "}
            {session?.user.role === Role.STUDENT ? "Add" : "Create"} a class to
            get started
          </h1>
          <ClassActionModal
            onRefetchClasses={refetch}
            onTrigger={
              <Button
                className="rounded-full [&_svg:not([class*='size-'])]:size-6"
                size={"xs"}
              >
                {session?.user.role === Role.STUDENT
                  ? "Join the Class"
                  : "Set Up Class"}
                <FaCircleArrowRight />
              </Button>
            }
          />
        </section>
      ) : (
        <div>
          <div className="flex flex-col gap-11">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-white">My Classes</h1>
              <ClassActionModal
                onRefetchClasses={refetch}
                onTrigger={
                  <Button
                    className="rounded-full [&_svg:not([class*='size-'])]:size-6"
                    size={"xs"}
                  >
                    {session?.user.role === Role.STUDENT
                      ? "Join the Class"
                      : "Create Class"}
                  </Button>
                }
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {classes?.map((classItem: Class) => (
                <CardClass key={classItem.id} classItem={classItem} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
