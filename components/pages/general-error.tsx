"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ErrorCode = 400 | 401 | 403 | 404 | 500 | 502 | 503 | 504;

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
  textButton?: string;
  onClick?: () => void;
  withBackButton?: boolean;
  errorCode?: ErrorCode;
  title?: string;
  message?: string;
};

const ERROR_CONFIG: Record<ErrorCode, { title: string; message: string }> = {
  400: {
    title: "Bad Request",
    message: "The request was invalid. Please check your input and try again.",
  },
  401: {
    title: "Unauthorized",
    message: "You need to be logged in to access this page.",
  },
  403: {
    title: "Forbidden",
    message: "You don't have permission to access this resource.",
  },
  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or has been moved.",
  },
  500: {
    title: "Internal Server Error",
    message:
      "Something went wrong on our end. We apologize for the inconvenience.",
  },
  502: {
    title: "Bad Gateway",
    message: "The server received an invalid response. Please try again later.",
  },
  503: {
    title: "Service Unavailable",
    message: "The service is temporarily unavailable. Please try again later.",
  },
  504: {
    title: "Gateway Timeout",
    message: "The request took too long to process. Please try again.",
  },
};

export function GeneralError({
  className,
  minimal = false,
  textButton,
  withBackButton = true,
  onClick,
  errorCode = 500,
  title,
  message,
}: GeneralErrorProps) {
  const router = useRouter();
  const errorConfig = ERROR_CONFIG[errorCode];
  const displayTitle = title || errorConfig.title;
  const displayMessage = message || errorConfig.message;

  // Default button text based on error code
  const defaultButtonText =
    textButton ||
    (errorCode === 404
      ? "Go Home"
      : errorCode === 401
        ? "Go to Login"
        : "Try Again");

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else if (errorCode === 401) {
      router.push("/auth/sign-in");
    } else {
      router.push("/");
    }
  };

  return (
    <div className={cn("bg-background h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-4 px-4">
        {!minimal && (
          <h1 className="text-foreground text-[7rem] leading-tight font-bold">
            {errorCode}
          </h1>
        )}
        <h2 className="text-foreground text-2xl font-semibold">
          {displayTitle}
        </h2>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          {displayMessage}
        </p>
        {!minimal && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {withBackButton && (
              <Button
                variant="outline"
                size={"xsm"}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.history.back();
                  }
                }}
              >
                Go Back
              </Button>
            )}
            <Button onClick={handleButtonClick} size={"xsm"}>
              {defaultButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
