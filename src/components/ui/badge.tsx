import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-elevated text-text",
        secondary: "border-border bg-surface text-text-secondary",
        destructive: "border-critical-red/50 bg-critical-red/20 text-critical-red",
        outline: "border-border text-text",
        modis: "border-data-blue/40 bg-data-blue/15 text-data-blue",
        viirs: "border-thermal-orange/40 bg-thermal-orange/15 text-thermal-orange",
        agreement: "border-agreement-teal/40 bg-agreement-teal/15 text-agreement-teal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
