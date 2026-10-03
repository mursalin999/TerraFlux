import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[6px] border border-border bg-surface px-3 py-1 text-sm font-mono text-text transition-colors file:border-0 file:bg-transparent file:text-xs file:font-mono file:text-text placeholder:text-text-secondary/60 focus-visible:border-data-blue focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
