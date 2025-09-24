"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
  textButton?: string;
  onClick?: () => void;
  withBackButton?: boolean;
};

export function GeneralError({
  className,
  minimal = false,
  textButton = "Back to Home",
  withBackButton = true,
  onClick,
}: GeneralErrorProps) {
  const router = useRouter();

  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] leading-tight font-bold">500</h1>
        )}
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-muted-foreground text-center">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            {withBackButton && (
              <Button
                variant="outline"
                size={"xsm"}
                onClick={() => history.go(-1)}
              >
                Go Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (onClick) {
                  onClick();
                } else {
                  router.push("/");
                }
              }}
              size={"xsm"}
            >
              {textButton}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
