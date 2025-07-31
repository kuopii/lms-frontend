import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  conteinerClassName?: string;
  onClickStartIcon?: () => void;
  onClickEndIcon?: () => void;
  iconSize?: number;
  variant?: "default" | "underline" | "ghost";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      conteinerClassName,
      onClickStartIcon,
      onClickEndIcon,
      variant = "default",
      iconSize = 18,
      ...props
    },
    ref,
  ) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className={cn("relative w-full", conteinerClassName)}>
        {StartIcon && (
          <div className="absolute top-1/2 left-4.5 -translate-y-1/2">
            <StartIcon
              size={iconSize}
              className="text-muted-foreground cursor-pointer"
              onClick={onClickStartIcon}
            />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          data-slot="input"
          className={cn(
            // base style
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 bg-transparent px-5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",

            // variant styles
            variant === "default" &&
              "focus-visible:border-ring focus-visible:ring-ring/50 h-12 rounded-full border focus-visible:ring-[3px]",
            variant === "underline" &&
              "focus-visible:border-b-ring border-border/40 h-10 rounded-none border-x-0 border-t-0 border-b",
            variant === "ghost" &&
              "focus-visible:ring-ring/30 h-10 rounded-md border-none focus-visible:ring-1",

            // validation
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

            className,
          )}
          {...props}
        />
        {EndIcon && (
          <div className="absolute top-1/2 right-4.5 -translate-y-1/2">
            <EndIcon
              size={iconSize}
              className="text-foreground cursor-pointer"
              onClick={onClickEndIcon}
            />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
