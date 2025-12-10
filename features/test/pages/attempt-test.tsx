"use client";

import { useFetchTest } from "@/features/test/api/use-fetch-test";
import { GeneralError } from "@/components/pages/general-error";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import BodyTest from "../components/section/body-test";
import FooterTest from "../components/section/footer-test";
import HeaderTest from "../components/section/header-test";

export const AttemptTestPage = () => {
  const params = useParams();
  const testName = params.name as string;

  const [session] = useState({
    user: {
      id: "dev-user",
      role: Role.TEACHER,
    },
  });

  const {
    data: testData,
    isLoading,
    isError,
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
        message="The test you're looking for doesn't exist or has been removed."
        textButton="Go Back"
        onClick={() => window.history.back()}
        withBackButton={true}
      />
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col gap-16">
      {/* Fixed Header */}
      <div className="p-4">
        <HeaderTest testData={testData} />
      </div>

      {/* Scrollable Body */}
      <div className="flex-1">
        <BodyTest testData={testData} />
      </div>

      {/* Footer */}
      <div className="p-4">
        <FooterTest testData={testData} />
      </div>
    </div>
  );
};
