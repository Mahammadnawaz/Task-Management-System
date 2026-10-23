import React from "react";
import { cn, getPriorityStyles, getStatusStyles } from "@/lib/utils";
import { Priority, Status } from "@/types";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: "priority" | "status" | "default";
  priority?: Priority;
  status?: Status;
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  priority,
  status,
  size = "md",
  className,
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  if (variant === "priority" && priority) {
    const styles = getPriorityStyles(priority);
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border",
          styles.badge,
          sizeStyles[size],
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </span>
    );
  }

  if (variant === "status" && status) {
    const styles = getStatusStyles(status);
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md border",
          styles.bg,
          styles.text,
          styles.border,
          sizeStyles[size],
          className
        )}
      >
        {styles.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
