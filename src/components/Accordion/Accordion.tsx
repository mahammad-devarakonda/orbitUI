import React, { createContext, useContext, useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionContextType {
  activeValues: string[];
  toggleItem: (value: string) => void;
  variant: "bordered" | "ghost" | "separated";
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion compound items must be rendered within an <Accordion> component");
  }
  return context;
};

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  variant?: "bordered" | "ghost" | "separated";
  children: React.ReactNode;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      type = "single",
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      variant = "bordered",
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const activeValues = isControlled ? controlledValue : uncontrolledValue;

    const toggleItem = (itemValue: string) => {
      let newValues: string[];
      if (type === "single") {
        newValues = activeValues.includes(itemValue) ? [] : [itemValue];
      } else {
        newValues = activeValues.includes(itemValue)
          ? activeValues.filter((v) => v !== itemValue)
          : [...activeValues, itemValue];
      }

      if (!isControlled) {
        setUncontrolledValue(newValues);
      }
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <AccordionContext.Provider value={{ activeValues, toggleItem, variant }}>
        <div
          ref={ref}
          className={cn(
            "w-full flex flex-col",
            variant === "bordered" && "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950",
            variant === "ghost" && "divide-y divide-gray-150 dark:divide-gray-800",
            variant === "separated" && "gap-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

interface AccordionItemContextType {
  value: string;
  disabled: boolean;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionItem subcomponents must be rendered within an <AccordionItem> component");
  }
  return context;
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    const { activeValues, variant } = useAccordion();
    const isOpen = activeValues.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, disabled, isOpen }}>
        <div
          ref={ref}
          className={cn(
            "w-full transition-all duration-200",
            variant === "separated" && "border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 shadow-xs",
            disabled && "opacity-60 pointer-events-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, icon, ...props }, ref) => {
    const { toggleItem } = useAccordion();
    const { value, disabled, isOpen } = useAccordionItem();

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={() => toggleItem(value)}
        className={cn(
          "w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-900/40",
          !isOpen && "hover:bg-gray-50/50 dark:hover:bg-gray-900/10",
          className
        )}
        {...props}
      >
        <span className="flex-1 min-w-0 pr-4 select-none">{children}</span>
        <span className="shrink-0 text-gray-400 dark:text-gray-500">
          {icon ? (
            icon
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </span>
      </button>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = useAccordionItem();

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div
              ref={ref}
              className={cn(
                "px-6 pb-5 pt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-900/20",
                className
              )}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

AccordionContent.displayName = "AccordionContent";
