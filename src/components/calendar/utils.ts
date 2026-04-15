import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import type { CalendarEvent, DayInfo } from './types';

export const getMonthDays = (currentDate: Date, events: CalendarEvent[]): DayInfo[] => {
  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });

  const days: DayInfo[] = [];

  let day = startDate;

  // We always show 6 rows to keep the grid size consistent (6 * 7 = 42 days)
  const totalDays = 42;

  for (let i = 0; i < totalDays; i++) {
    const dayEvents = events.filter(event =>
      isWithinInterval(day, { start: startOfDay(event.start), end: endOfDay(event.end) })
    );

    days.push({
      date: day,
      isCurrentMonth: isSameMonth(day, monthStart),
      isToday: isToday(day),
      isCurrentDay: isSameDay(day, currentDate),
      events: dayEvents,
    });
    day = addDays(day, 1);
  }

  return days;
};

/**
 * Generates an array of days for a week view
 */
export const getWeekDays = (currentDate: Date, events: CalendarEvent[]): DayInfo[] => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days: DayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const day = addDays(startDate, i);
    const dayEvents = events.filter(event =>
      isWithinInterval(day, { start: startOfDay(event.start), end: endOfDay(event.end) })
    );

    days.push({
      date: day,
      isCurrentMonth: true,
      isToday: isToday(day),
      isCurrentDay: isSameDay(day, currentDate),
      events: dayEvents,
    });
  }

  return days;
};

/**
 * Formats a time range for display
 */
export const formatTimeRange = (start: Date, end: Date): string => {
  return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
};

/**
 * Helper to get status color based on event
 */
export const getEventColorClasses = (color?: string) => {
  if (!color) return 'bg-blue-100 text-blue-700 border-blue-200';
  // If it's a hex, we might need custom style, but for now we'll support some preset keys
  const presets: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  };
  return presets[color] || presets.blue;
};
