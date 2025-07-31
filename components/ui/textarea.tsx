import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "underline";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          // Base styles
          "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full bg-transparent px-5 py-4 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

          // Variant: default (rounded/outlined)
          variant === "default" &&
            "focus-visible:border-ring focus-visible:ring-ring/50 rounded-4xl border focus-visible:ring-[3px]",

          // Variant: underline
          variant === "underline" &&
            "focus-visible:border-b-ring rounded-none border-x-0 border-t-0 border-b border-white text-white shadow-none focus-visible:outline-none",

          // Validation
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
