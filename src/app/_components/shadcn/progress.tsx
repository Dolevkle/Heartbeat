"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "~/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ className, value, orientation = "horizontal", ...props }, ref) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        `relative ${isHorizontal ? "h-4 w-full" : "h-full w-4"} overflow-hidden rounded-full bg-secondary`,
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={
          isHorizontal
            ? { transform: `translateX(-${100 - (value ?? 0)}%)` }
            : { transform: `translateY(-${100 - (value ?? 0)}%)` }
        }
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
