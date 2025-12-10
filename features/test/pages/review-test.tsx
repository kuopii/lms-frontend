"use client";

import { useFetchTest } from "@/features/test/api/use-fetch-test";
import { GeneralError } from "@/components/pages/general-error";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import ReviewHeader from "../components/review/review-header";
import ReviewBody from "../components/review/review-body";
import ReviewFooter from "../components/review/review-footer";

export const ReviewTestPage = () => {
  const params = useParams();
  const testName = params.name as string;

  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });

  const activePassage = 1; // Dummy data - akan diganti dengan data dari API
  const totalPassages = 3; // Dummy data - akan diganti dengan data dari API

  const {
    data: testData,
    isLoading,
    isError,
    refetch,
  } = useFetchTest({
    userId: session.user.id,
    testName: testName,
    onError: () => {
      // Error handled by GeneralError component
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70svh] items-center justify-center">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError || !testData) {
    return (
      <GeneralError
        className="h-[70svh] bg-black"
        errorCode={404}
        title="Test Not Found"
        message="The test you're looking for doesn't exist or has been removed."
        textButton="Retry"
        onClick={refetch}
        withBackButton={true}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <ReviewHeader testData={testData} />
      <ReviewBody testData={testData} />
      <ReviewFooter
        totalPassages={totalPassages}
        activePassage={activePassage}
      />
    </div>
  );
};
