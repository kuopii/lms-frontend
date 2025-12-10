"use client";

import { useEffect } from "react";
import { GeneralError } from "@/components/pages/general-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <GeneralError
      errorCode={500}
      title="Something went wrong!"
      message={
        error.message || "An unexpected error occurred. Please try again."
      }
      textButton="Try Again"
      onClick={reset}
      withBackButton={true}
    />
  );
}
