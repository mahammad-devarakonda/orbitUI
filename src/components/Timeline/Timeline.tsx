import React from 'react';
import { cn } from '../../utils/cn';
import { TimelineContext } from './TimelineContext';
import type { TimelineAlign, TimelineMode } from './TimelineContext';

export interface TimelineProps {
  /** The children should be a list of TimelineItem components */
  children: React.ReactNode;
  /** Alignment of content relative to the timeline line (Vertical only) */
  align?: TimelineAlign;
  /** Layout orientation (Vertical list vs Horizontal row) */
  mode?: TimelineMode;
  /** Whether to enable slide and fade entrance animations */
  animate?: boolean;
  /** Additional styling class names for the container */
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  children,
  align = 'left',
  mode = 'vertical',
  animate = true,
  className = ''
}) => {
  const contextValue = React.useMemo(() => ({
    align,
    mode,
    animate
  }), [align, mode, animate]);

  // Filter out invalid/falsy children so index counting is accurate
  const validChildren = React.Children.toArray(children).filter(React.isValidElement);
  const totalItems = validChildren.length;

  return (
    <TimelineContext.Provider value={contextValue}>
      <div
        className={cn(
          "w-full relative",
          mode === 'horizontal' 
            ? "flex flex-row overflow-x-auto pb-4 pt-8 scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200 dark:scrollbar-track-slate-900 dark:scrollbar-thumb-slate-800" 
            : "flex flex-col py-6",
          className
        )}
      >
        {validChildren.map((child, index) => {
          return React.cloneElement(child as React.ReactElement<any>, {
            index,
            isLast: index === totalItems - 1
          });
        })}
      </div>
    </TimelineContext.Provider>
  );
};
