import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";

type CardPerformanceListProps = {
  title: string;
  className?: string;
  accurateness: number;
  withSeparator?: boolean;
};

export function CardPerformanceList({
  title,
  className,
  accurateness,
  withSeparator = true,
}: CardPerformanceListProps) {
  return (
    <>
      <li className="space-y-1 text-sm">
        <span>{title}</span>
        <p className={className}>{accurateness}% correct</p>
      </li>
      {withSeparator && <Separator className="mt-4 text-white/40" />}
    </>
  );
}

type CardPerformanceProps = {
  children: React.ReactNode;
  headTitle: string;
  className?: string;
  paragraph: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  onClick?: () => void;
};

export function CardPerformance({
  children,
  className,
  headTitle,
  paragraph,
  icon,
  iconClassName,
  onClick,
}: CardPerformanceProps) {
  return (
    <div className={cn("card-custom w-full space-y-4 p-5", className)}>
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-white">{headTitle}</h3>
          <p className="text-sm">{paragraph}</p>
        </div>
        {icon && (
          <Button
            className={cn(
              !onClick &&
                "hover:text-foreground border-none shadow-none hover:cursor-default hover:bg-transparent [&_svg:not([class*='size-'])]:size-6",
              iconClassName,
            )}
            variant={"outline"}
            size={"icon"}
            onClick={onClick}
          >
            {icon}
          </Button>
        )}
      </div>
      <Separator />
      <ul className={"list-disc space-y-4 pl-5"}>{children}</ul>
    </div>
  );
}
