import React from "react";
import { cn } from "../../utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  align?: "left" | "center" | "right";
  gradient?: boolean;
  children?: React.ReactNode;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = "horizontal",
      variant = "solid",
      align = "center",
      gradient = false,
      children,
      ...props
    },
    ref
  ) => {
    const hasChildren = !!children && orientation === "horizontal";

    const variantClasses = {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    };

    if (hasChildren) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center w-full text-xs text-gray-500 font-medium my-4",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "flex-grow border-t border-gray-200 dark:border-gray-800",
              variantClasses[variant],
              gradient && "bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-800 border-t-0 h-[1px]",
              align === "left" && "flex-grow-0 w-4"
            )}
          />
          <span
            className={cn(
              "px-3 shrink-0 select-none",
              align === "left" && "pl-2 pr-3",
              align === "right" && "pl-3 pr-2"
            )}
          >
            {children}
          </span>
          <span
            className={cn(
              "flex-grow border-t border-gray-200 dark:border-gray-800",
              variantClasses[variant],
              gradient && "bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent border-t-0 h-[1px]",
              align === "right" && "flex-grow-0 w-4"
            )}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0 bg-gray-200 dark:bg-gray-800",
          orientation === "horizontal"
            ? cn(
                "h-[1px] w-full border-t border-gray-200 dark:border-gray-800",
                variant !== "solid" && "bg-transparent border-t h-0",
                variantClasses[variant]
              )
            : cn(
                "w-[1px] h-full border-l border-gray-200 dark:border-gray-800",
                variant !== "solid" && "bg-transparent border-l w-0",
                variantClasses[variant]
              ),
          gradient && orientation === "horizontal" && "bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent h-[1px] border-none",
          gradient && orientation === "vertical" && "bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent w-[1px] border-none",
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
