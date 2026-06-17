import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useTimeline } from './TimelineContext';
import type { TimelineStatus } from './TimelineContext';
import { Typography } from '../Typography/Typography';

export interface TimelineItemProps {
  /** The title/heading of the timeline event */
  title: React.ReactNode;
  /** Optional summary or description text */
  description?: React.ReactNode;
  /** Time or date indicator for the event */
  timestamp?: React.ReactNode;
  /** Status color variant for the node and line */
  status?: TimelineStatus;
  /** Custom icon or node replacement inside the marker circle */
  icon?: React.ReactNode;
  /** Whether the item is the current/active event (enables glow & pulse) */
  active?: boolean;
  /** Additional classes for the container */
  className?: string;
  /** Additional custom content to render inside the item card */
  children?: React.ReactNode;
  /** Injected by parent Timeline component: the index of this item */
  index?: number;
  /** Injected by parent Timeline component: is this the last item in the list? */
  isLast?: boolean;
}

const statusStyles = {
  primary: {
    dot: "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)] dark:bg-indigo-950 dark:text-indigo-400",
    line: "bg-indigo-500/30 dark:bg-indigo-500/20",
    activeLine: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
    pulse: "bg-indigo-500",
    dotActive: "border-indigo-600 bg-white text-indigo-600 shadow-[0_0_20px_0_rgba(79,70,229,0.5)] dark:bg-slate-900"
  },
  success: {
    dot: "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] dark:bg-emerald-950 dark:text-emerald-400",
    line: "bg-emerald-500/30 dark:bg-emerald-500/20",
    activeLine: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    pulse: "bg-emerald-500",
    dotActive: "border-emerald-500 bg-white text-emerald-600 shadow-[0_0_20px_0_rgba(16,185,129,0.5)] dark:bg-slate-900"
  },
  warning: {
    dot: "border-amber-500 bg-amber-50 text-amber-600 shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)] dark:bg-amber-950 dark:text-amber-400",
    line: "bg-amber-500/30 dark:bg-amber-500/20",
    activeLine: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    pulse: "bg-amber-500",
    dotActive: "border-amber-500 bg-white text-amber-600 shadow-[0_0_20px_0_rgba(245,158,11,0.5)] dark:bg-slate-900"
  },
  danger: {
    dot: "border-rose-500 bg-rose-50 text-rose-600 shadow-[0_0_15px_-3px_rgba(244,63,94,0.4)] dark:bg-rose-950 dark:text-rose-400",
    line: "bg-rose-500/30 dark:bg-rose-500/20",
    activeLine: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    pulse: "bg-rose-500",
    dotActive: "border-rose-500 bg-white text-rose-600 shadow-[0_0_20px_0_rgba(244,63,94,0.5)] dark:bg-slate-900"
  },
  info: {
    dot: "border-sky-500 bg-sky-50 text-sky-600 shadow-[0_0_15px_-3px_rgba(14,165,233,0.4)] dark:bg-sky-950 dark:text-sky-400",
    line: "bg-sky-500/30 dark:bg-sky-500/20",
    activeLine: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    pulse: "bg-sky-500",
    dotActive: "border-sky-500 bg-white text-sky-600 shadow-[0_0_20px_0_rgba(14,165,233,0.5)] dark:bg-slate-900"
  },
  default: {
    dot: "border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
    line: "bg-slate-200 dark:bg-slate-800",
    activeLine: "bg-slate-400 dark:bg-slate-600",
    text: "text-slate-500 dark:text-slate-400",
    pulse: "bg-slate-400",
    dotActive: "border-slate-400 bg-white text-slate-600 shadow-[0_0_15px_0_rgba(148,163,184,0.4)] dark:bg-slate-900"
  }
};

const itemVariants = {
  hidden: (custom: { align: string; isEven: boolean; animate: boolean }) => {
    if (!custom.animate) return { opacity: 1, x: 0, y: 0 };
    const xOffset = custom.align === 'alternate'
      ? (custom.isEven ? -40 : 40)
      : (custom.align === 'right' ? -40 : 40);
    return { opacity: 0, x: xOffset, y: 15 };
  },
  visible: (custom: { animate: boolean }) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: (custom.animate ? {
      type: 'spring',
      stiffness: 90,
      damping: 14,
      mass: 0.8
    } : { duration: 0 }) as any
  })
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  timestamp,
  status = 'default',
  icon,
  active = false,
  className = '',
  children,
  index = 0,
  isLast = false
}) => {
  const { align, mode, animate } = useTimeline();
  const isEven = index % 2 === 0;
  const currentStyles = statusStyles[status];

  // Render Horizontal Layout
  if (mode === 'horizontal') {
    return (
      <motion.div
        custom={{ align, isEven, animate }}
        variants={itemVariants}
        initial={animate ? "hidden" : undefined}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-50px" }}
        className={cn(
          "relative flex flex-col items-center flex-1 min-w-[100px] sm:min-w-0 px-4 text-center group",
          className
        )}
      >
        {/* Timestamp Above Dot */}
        {timestamp && (
          <div className="mb-3 h-6 flex items-end justify-center">
            <Typography
              variant="caption"
              weight="medium"
              color="text-slate-400 dark:text-slate-500"
              className="text-[11px] uppercase tracking-wider block"
            >
              {timestamp}
            </Typography>
          </div>
        )}

        {/* Marker & Line Container */}
        <div className="relative w-full flex items-center justify-center mb-4">
          {/* Connector Line (Horizontal) */}
          {!isLast && (
            <div className="absolute left-1/2 w-full h-[2px] z-0">
              <div className={cn("w-full h-full transition-all duration-500", currentStyles.line)}>
                {active && <div className={cn("h-full animate-pulse w-full", currentStyles.pulse)} />}
              </div>
            </div>
          )}

          {/* Circle Dot Marker */}
          <div className="relative z-10 flex items-center justify-center">
            <div
              className={cn(
                "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                active ? currentStyles.dotActive : currentStyles.dot,
                active && "scale-110"
              )}
            >
              {icon ? (
                <span className="text-sm">{icon}</span>
              ) : (
                <span className={cn("w-2 h-2 rounded-full", active ? currentStyles.pulse : "bg-current")} />
              )}
            </div>

            {/* Glowing pulse ring if active */}
            {active && (
              <span className={cn("absolute inset-0 rounded-full animate-ping opacity-25 scale-110", currentStyles.pulse)}></span>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="flex flex-col items-center max-w-full">
          <Typography
            variant="body2"
            weight={active ? "bold" : "semibold"}
            color={active ? "text-slate-950 dark:text-slate-50" : "text-slate-800 dark:text-slate-200"}
            className="text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              color="text-slate-500 dark:text-slate-400"
              className="text-xs mt-1 px-2 line-clamp-2"
            >
              {description}
            </Typography>
          )}

          {children && (
            <div className="mt-3 w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 shadow-xs text-left">
              {children}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Render Vertical Layout
  return (
    <motion.div
      custom={{ align, isEven, animate }}
      variants={itemVariants}
      initial={animate ? "hidden" : undefined}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "relative flex flex-col w-full mb-10 last:mb-0",
        align === 'alternate' && "md:flex-row md:items-start md:justify-center",
        align === 'right' && "md:flex-row-reverse",
        className
      )}
    >
      {/* Connector Line (Vertical) */}
      {!isLast && (
        <div
          className={cn(
            "absolute top-9 bottom-[-40px] w-[2px] z-0 transition-all duration-500",
            align === 'left' && "left-[17px]",
            align === 'right' && "right-[17px] md:right-[17px] left-auto",
            align === 'alternate' && "left-[17px] md:left-1/2 md:-translate-x-1/2",
            currentStyles.line
          )}
        >
          {active && <div className={cn("w-full h-1/2 animate-pulse", currentStyles.pulse)} />}
        </div>
      )}

      {/* Circle Dot Marker */}
      <div
        className={cn(
          "absolute top-0 z-10 flex items-center justify-center",
          align === 'left' && "left-0",
          align === 'right' && "left-0 md:left-auto md:right-0",
          align === 'alternate' && "left-0 md:left-1/2 md:-translate-x-1/2"
        )}
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            active ? currentStyles.dotActive : currentStyles.dot,
            active && "scale-110"
          )}
        >
          {icon ? (
            <span className="text-sm">{icon}</span>
          ) : (
            <span className={cn("w-2 h-2 rounded-full", active ? currentStyles.pulse : "bg-current")} />
          )}
        </div>

        {/* Glowing active ring */}
        {active && (
          <span className={cn("absolute inset-0 rounded-full animate-ping opacity-25 scale-110", currentStyles.pulse)}></span>
        )}
      </div>

      {/* Metadata / Timestamp Side Panel */}
      {/* In Alternate layout: Even index has timestamp on the right, Odd has it on the left */}
      <div
        className={cn(
          "w-full md:w-1/2 pl-14 pr-4 md:pl-0 md:pr-0 mt-1 md:mt-2.5 flex items-start z-0",
          align === 'left' && "md:hidden", // In standard left align, timestamp sits inside content
          align === 'right' && "md:hidden", // In standard right align, timestamp sits inside content
          align === 'alternate' && (
            isEven
              ? "md:order-last md:pl-8 md:justify-start"
              : "md:order-first md:pr-8 md:justify-end"
          )
        )}
      >
        {timestamp && (
          <Typography
            variant="caption"
            weight="semibold"
            color="text-slate-400 dark:text-slate-500"
            className="text-[11px] uppercase tracking-wider block"
          >
            {timestamp}
          </Typography>
        )}
      </div>

      {/* Main Content Side Panel */}
      <div
        className={cn(
          "w-full md:w-1/2 pl-14 pr-4 z-10",
          align === 'left' && "md:w-full md:pl-16",
          align === 'right' && "md:w-full md:pl-4 md:pr-16 md:text-right",
          align === 'alternate' && (
            isEven
              ? "md:order-first md:pr-8 md:text-right"
              : "md:order-last md:pl-8 md:text-left"
          )
        )}
      >
        <div className="flex flex-col">
          {/* Timestamp inside content box for non-alternate layouts, or on mobile */}
          {timestamp && (align === 'left' || align === 'right' || window.innerWidth < 768) && (
            <Typography
              variant="caption"
              weight="semibold"
              color="text-slate-400 dark:text-slate-500"
              className="text-[10px] uppercase tracking-wider mb-1"
            >
              {timestamp}
            </Typography>
          )}

          <Typography
            variant="body1"
            weight={active ? "bold" : "semibold"}
            color={active ? "text-slate-950 dark:text-slate-50" : "text-slate-900 dark:text-slate-100"}
            className="text-base leading-snug"
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              color="text-slate-500 dark:text-slate-400"
              className="mt-1 text-sm font-normal leading-relaxed"
            >
              {description}
            </Typography>
          )}

          {children && (
            <div
              className={cn(
                "mt-3 w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800",
                align === 'right' && "md:text-right"
              )}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
