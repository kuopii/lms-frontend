"use client";

import { useFetchTest } from "@/features/test/api/use-fetch-test";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ReviewHeader from "../components/review/review-header";
import ReviewBody from "../components/review/review-body";
import ReviewFooter from "../components/review/review-footer";

export const ReviewTestPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [session] = useState({
    user: {
      id: "33hf9jdk38di",
      role: Role.TEACHER,
    },
  });

  const activePassage = 1; // Dummy data - akan diganti dengan data dari API
  const totalPassages = 3; // Dummy data - akan diganti dengan data dari API

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
