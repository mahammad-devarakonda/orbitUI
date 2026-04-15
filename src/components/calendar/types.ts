export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string; // Hex or CSS color
}

export interface CalendarProps {
  events?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (id: string) => void;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isCurrentDay: boolean; // Selected day
  events: CalendarEvent[];
}

export interface TimeSlot {
  time: Date;
  events: CalendarEvent[];
}
