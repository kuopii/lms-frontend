import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
<<<<<<< HEAD
        "bg-card text-card-foreground flex flex-col gap-4 rounded-xl py-3 shadow-sm",
        // "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm",
=======
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm",
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
<<<<<<< HEAD
      className={cn("text-xl leading-none font-medium", className)}
      // className={cn("leading-none font-semibold", className)}
=======
      className={cn("leading-none font-semibold", className)}
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
<<<<<<< HEAD
      className={cn("flex-1 px-3", className)}
      // className={cn("px-6", className)}
=======
      className={cn("px-6", className)}
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
<<<<<<< HEAD
      className={cn("flex items-center px-3 [.border-t]:pt-6", className)}
      // className={cn("flex items-center px-6 [.border-t]:pt-6", className)}

=======
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
>>>>>>> 52f1c64750f6cededca179bddcbdf8dea8e76b7b
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
