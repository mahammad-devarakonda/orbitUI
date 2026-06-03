import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronRight, MoreHorizontal, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHomeIcon?: boolean;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      className,
      items,
      separator = <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-600" />,
      maxItems = 8,
      showHomeIcon = false,
      onItemClick,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasHomeIcon = showHomeIcon && items.length > 0;

    const allItems = [...items];

    const needsCollapse = allItems.length > maxItems && !isExpanded;

    const renderCollapsedItems = () => {
      const firstItem = allItems[0];
      const lastItems = allItems.slice(-2);

      return (
        <React.Fragment>
          {renderItem(firstItem, 0)}
          {renderSeparator(0)}

          <li className="flex items-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center h-6 w-8 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer focus:outline-none"
              aria-label="Show all breadcrumbs"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </li>
          {renderSeparator(1)}

          {lastItems.map((item, index) => {
            const actualIndex = allItems.length - 2 + index;
            return (
              <React.Fragment key={actualIndex}>
                {renderItem(item, actualIndex)}
                {index === 0 && renderSeparator(actualIndex)}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    };

    const renderItem = (item: BreadcrumbItem, index: number) => {
      const isLast = index === allItems.length - 1;
      const Icon = item.icon;

      const content = (
        <span className="flex items-center gap-1.5">
          {index === 0 && hasHomeIcon && (
            <Home className="h-3.5 w-3.5 shrink-0" />
          )}
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
          <span>{item.label}</span>
        </span>
      );

      return (
        <li
          key={index}
          className={cn(
            "flex items-center text-sm font-medium transition-colors duration-150 select-none",
            isLast
              ? "text-gray-900 dark:text-gray-100 cursor-default font-semibold"
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          )}
        >
          {!isLast && item.href ? (
            <a
              href={item.href}
              onClick={(e) => {
                if (onItemClick) {
                  e.preventDefault();
                  onItemClick(item, index);
                }
              }}
              className="focus:outline-none hover:underline"
            >
              {content}
            </a>
          ) : (
            <span
              onClick={() => {
                if (!isLast && onItemClick) {
                  onItemClick(item, index);
                }
              }}
              className={cn(!isLast && "cursor-pointer hover:underline")}
            >
              {content}
            </span>
          )}
        </li>
      );
    };

    const renderSeparator = (key: number | string) => (
      <li key={`sep-${key}`} className="flex items-center px-1" role="presentation">
        {separator}
      </li>
    );

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex flex-wrap items-center", className)}
        {...props}
      >
        <ol className="flex flex-wrap items-center gap-1 list-none m-0 p-0">
          <AnimatePresence mode="popLayout">
            {needsCollapse ? (
              renderCollapsedItems()
            ) : (
              allItems.map((item, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  {renderItem(item, index)}
                  {index < allItems.length - 1 && renderSeparator(index)}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";
