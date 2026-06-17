import { createContext, useContext } from 'react';

export type TimelineAlign = 'left' | 'right' | 'alternate';
export type TimelineMode = 'vertical' | 'horizontal';
export type TimelineStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';

export interface TimelineContextType {
  align: TimelineAlign;
  mode: TimelineMode;
  animate: boolean;
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a <Timeline /> component');
  }
  return context;
};
