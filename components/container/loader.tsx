import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className="text-primary animate-spin" size={size} />
    </div>
  );
}
