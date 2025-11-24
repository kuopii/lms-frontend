"use client";

import { useFetchTest } from "@/features/test/api/use-fetch-test";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import BodyTest from "../components/section/body-test";
import FooterTest from "../components/section/footer-test";
import HeaderTest from "../components/section/header-test";

export const AttemptTestPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [session] = useState({
    user: {
      id: "dev-user",
      role: Role.TEACHER,
    },
  });

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

  if (!testData) {
    return (
      <div className="flex h-[70svh] items-center justify-center">
        <p className="text-white">Test not found</p>
      </div>
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
