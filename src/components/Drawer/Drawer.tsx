import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  direction: "left" | "right" | "top" | "bottom";
  size: "sm" | "md" | "lg" | "full";
  closeOnOutsideClick: boolean;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer compound components must be rendered within a <Drawer> component");
  }
  return context;
};

export interface DrawerProps {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  closeOnOutsideClick?: boolean;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  direction = "right",
  size = "md",
  closeOnOutsideClick = true,
  children,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(open);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen, direction, size, closeOnOutsideClick }}>
      {children}
    </DrawerContext.Provider>
  );
};

export interface DrawerTriggerProps {
  asChild?: boolean;
  children: React.ReactElement;
}

export const DrawerTrigger: React.FC<DrawerTriggerProps> = ({ asChild = true, children }) => {
  const { setIsOpen } = useDrawer();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        if (child.props.onClick) {
          child.props.onClick(e);
        }
        setIsOpen(true);
      },
    });
  }

  return (
    <button onClick={() => setIsOpen(true)} className="cursor-pointer">
      {children}
    </button>
  );
};

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  className,
  children,
  ...props
}) => {
  const { isOpen, setIsOpen, direction, size, closeOnOutsideClick } = useDrawer();

  const directionVariants = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      class: "right-0 top-0 bottom-0 h-full border-l border-gray-200 dark:border-gray-800",
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      class: "left-0 top-0 bottom-0 h-full border-r border-gray-200 dark:border-gray-800",
    },
    top: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "-100%" },
      class: "top-0 left-0 right-0 w-full border-b border-gray-200 dark:border-gray-800",
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
      class: "bottom-0 left-0 right-0 w-full border-t border-gray-200 dark:border-gray-800",
    },
  };

  const sizeClasses = {
    horizontal: {
      sm: "w-full sm:w-[380px] max-w-full",
      md: "w-full sm:w-[480px] max-w-full",
      lg: "w-full sm:w-[640px] max-w-full",
      full: "w-full h-full",
    },
    vertical: {
      sm: "h-[30vh] max-h-full",
      md: "h-[45vh] max-h-full",
      lg: "h-[70vh] max-h-full",
      full: "h-full w-full",
    },
  };

  const isVertical = direction === "top" || direction === "bottom";
  const sizeClass = isVertical
    ? sizeClasses.vertical[size]
    : sizeClasses.horizontal[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnOutsideClick && setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            initial={directionVariants[direction].initial}
            animate={directionVariants[direction].animate}
            exit={directionVariants[direction].exit}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className={cn(
              "fixed z-50 flex flex-col bg-white dark:bg-gray-950 shadow-2xl overflow-hidden focus:outline-none",
              directionVariants[direction].class,
              sizeClass,
              className
            )}
            role="dialog"
            aria-modal="true"
            {...(props as any)}
          >
            {children}
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export const DrawerHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { setIsOpen } = useDrawer();

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-gray-100 dark:border-gray-900 px-6 py-4.5 shrink-0",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0 pr-4">{children}</div>
      <button
        onClick={() => setIsOpen(false)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Close panel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const DrawerTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h2
    className={cn(
      "text-base font-semibold leading-6 text-gray-900 dark:text-gray-100 truncate",
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

export const DrawerClose: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { setIsOpen } = useDrawer();

  if (React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        if (child.props.onClick) {
          child.props.onClick(e);
        }
        setIsOpen(false);
      },
    });
  }

  return null;
};

export const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "mt-auto border-t border-gray-100 dark:border-gray-900 px-6 py-4 bg-gray-50 dark:bg-gray-950/50 flex items-center justify-end gap-3 shrink-0",
      className
    )}
    {...props}
  />
);
