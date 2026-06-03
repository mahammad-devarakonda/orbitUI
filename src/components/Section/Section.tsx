import React from "react";
import { cn } from "../../utils/cn";

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  width?: "sm" | "md" | "lg" | "xl" | "full";
  bgAccent?: "flat" | "card" | "gradient" | "none";
  borderBottom?: boolean;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      className,
      title,
      subtitle,
      actions,
      padding = "md",
      width = "full",
      bgAccent = "none",
      borderBottom = false,
      children,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: "py-0",
      sm: "py-6 md:py-8",
      md: "py-10 md:py-14",
      lg: "py-16 md:py-24",
      xl: "py-24 md:py-36",
    };

    const widthClasses = {
      sm: "max-w-3xl mx-auto px-4 sm:px-6",
      md: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
      lg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      xl: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8",
      full: "w-full px-4 sm:px-6 lg:px-8",
    };

    const bgAccentClasses = {
      none: "",
      flat: "bg-gray-50 dark:bg-gray-900/50",
      card: "bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl shadow-xs p-6 md:p-8",
      gradient: "bg-gradient-to-br from-blue-50/40 via-transparent to-pink-50/20 dark:from-blue-950/10 dark:to-pink-950/5",
    };

    const hasHeader = title || subtitle || actions;

    return (
      <section
        ref={ref}
        className={cn(
          "w-full transition-all duration-200",
          bgAccentClasses[bgAccent],
          borderBottom && "border-b border-gray-200 dark:border-gray-800",
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        <div className={widthClasses[width]}>
          {hasHeader && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
              <div className="space-y-1">
                {title && (
                  typeof title === "string" ? (
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      {title}
                    </h2>
                  ) : (
                    title
                  )
                )}
                {subtitle && (
                  typeof subtitle === "string" ? (
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                      {subtitle}
                    </p>
                  ) : (
                    subtitle
                  )
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3 shrink-0 sm:self-center">
                  {actions}
                </div>
              )}
            </div>
          )}
          <div className="w-full">{children}</div>
        </div>
      </section>
    );
  }
);

Section.displayName = "Section";
