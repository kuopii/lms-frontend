"use client";

import { useFetchTest } from "@/features/test/api/use-fetch-test";
import { GeneralError } from "@/components/pages/general-error";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import HeaderTest from "../components/section/header-test";
import BodyResults from "../components/section/body-results";

const ResultsTestPage = () => {
  const params = useParams();
  const testName = params.name as string;

  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });

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
        className="h-[70svh]"
        errorCode={404}
        title="Test Not Found"
        message="The test results you're looking for don't exist or have been removed."
        textButton="Retry"
        onClick={refetch}
        withBackButton={true}
      />
    );
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Fixed Header */}
      <div className="p-4">
        <HeaderTest testData={testData} showProgress={false} />
      </div>

      {/* Scrollable Body */}
      <div>
        <BodyResults testData={testData} />
      </div>
    </div>
  );
};

export default ResultsTestPage;
