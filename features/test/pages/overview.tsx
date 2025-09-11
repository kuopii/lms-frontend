"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFetchTest } from "@/features/test/api/use-fetch-test";
import { Role } from "@/types/auth";
import { ArrowLeft, Dot, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { IoBook, IoPlayCircle } from "react-icons/io5";
import { toast } from "sonner";

export const OverviewPage = () => {
  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: testData, isLoading } = useFetchTest({
    userId: session.user.id,
    testId: id,
    onError: (e) => {
      toast.error(e.message || "Something went wrong when fetching test");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70svh] items-center justify-center">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <Button variant={"ghost"} size={"iconSm"} onClick={router.back}>
          <ArrowLeft />
        </Button>
      </div>
      <Badge
        size={"lg"}
        variant={"primary"}
        className="text-primary mt-9 mb-7 rounded-full bg-[#E0E9D8] px-6 capitalize"
      >
        {testData?.type_test}
      </Badge>
      <h2 className="mb-6 text-xl font-semibold">{testData?.name}</h2>
      <p className="mb-6">{testData?.description}</p>
      <div className="mb-7 flex items-center gap-4">
        <span className="text-xl font-medium capitalize">
          {testData?.level}
        </span>
        <Dot />
        <span>{testData?.created_at}</span>
      </div>
      {testData?.last_score !== 0 &&
        testData?.reapeatation &&
        testData.reapeatation.current_reapeatation >= 1 && (
          <div className="mb-7 flex items-center gap-4">
            <span className="text-xl font-medium capitalize">
              Last Score:{" "}
              {testData?.last_score === 0 ? "-" : testData?.last_score}
            </span>
            <Dot />
            <span className="text-destructive text-sm">
              Attempts: {testData?.reapeatation.current_reapeatation}/
              {testData?.reapeatation.max_reapeatation}
            </span>
          </div>
        )}
      <Separator />
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button
          size={"xsm"}
          className="gap-3 [&_svg:not([class*='size-'])]:size-6"
        >
          Attempt the Test <IoPlayCircle />
        </Button>
        {testData?.reapeatation &&
          testData.reapeatation.current_reapeatation >= 1 && (
            <Button
              size={"xsm"}
              variant={"outline"}
              className="hover:bg-primary border-primary hover:text-primary-foreground gap-3 [&_svg:not([class*='size-'])]:size-6"
            >
              Vocabulary
              <IoBook />
            </Button>
          )}
        {testData?.reapeatation.current_reapeatation ===
          testData?.reapeatation.max_reapeatation && (
          <Button
            size={"xsm"}
            variant={"outline"}
            className="hover:bg-primary border-primary hover:text-primary-foreground gap-3 [&_svg:not([class*='size-'])]:size-6"
          >
            View Explanation
            <BsFileEarmarkCheckFill />
          </Button>
        )}
      </div>
    </div>
  );
};
