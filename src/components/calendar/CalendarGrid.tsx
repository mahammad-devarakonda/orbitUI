import React from 'react';
import { format } from 'date-fns';
import type { CalendarView, DayInfo, CalendarEvent } from './types';
import { getEventColorClasses } from './utils';
import { Typography } from '../Typography/Typography';

interface CalendarGridProps {
    view: CalendarView;
    days: DayInfo[];
    onDateClick: (date: Date) => void;
    onEventClick: (event: CalendarEvent) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
    view,
    days,
    onDateClick,
    onEventClick,
}) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (view === 'month') {
        return (
            <div className="flex flex-col flex-1 overflow-hidden bg-gray-200 dark:bg-gray-800 gap-px border-b border-gray-200 dark:border-gray-800">
                {/* Day headers */}
                <div className="grid grid-cols-7 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    {weekDays.map((day) => (
                        <div key={day} className="py-2 text-center">
                            <Typography variant="caption" className="font-semibold text-gray-500 uppercase tracking-wider">
                                {day}
                            </Typography>
                        </div>
                    ))}
                </div>

                {/* Grid cells */}
                <div className="grid grid-cols-7 grid-rows-6 flex-1 bg-gray-200 dark:bg-gray-800 gap-px overflow-y-auto">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`min-h-[100px] flex flex-col bg-white dark:bg-gray-900 p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${
                                !day.isCurrentMonth ? 'text-gray-400 bg-gray-50/50 dark:bg-gray-900/50' : ''
                            }`}
                            onClick={() => onDateClick(day.date)}
                            role="gridcell"
                            aria-label={format(day.date, 'PPPP')}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span
                                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                                        day.isToday
                                            ? 'bg-blue-600 text-white'
                                            : day.isCurrentDay
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    {format(day.date, 'd')}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {day.events.slice(0, 4).map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEventClick(event);
                                        }}
                                        className={`px-2 py-1 text-[10px] sm:text-xs rounded border transition-shadow hover:shadow-sm truncate ${getEventColorClasses(
                                            event.color
                                        )}`}
                                    >
                                        <span className="font-medium mr-1">{format(event.start, 'HH:mm')}</span>
                                        {event.title}
                                    </div>
                                ))}
                                {day.events.length > 4 && (
                                    <div className="px-2 py-0.5 text-[10px] text-gray-500 font-medium">
                                        + {day.events.length - 4} more
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Week View
    return (
        <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="grid grid-cols-[60px_1fr] border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div className="border-r border-gray-200 dark:border-gray-800" />
                <div className="grid grid-cols-7">
                    {days.map((day, index) => (
                        <div key={index} className="py-3 text-center border-r border-gray-100 dark:border-gray-800 last:border-0">
                            <Typography variant="caption" className="block text-gray-500 font-medium uppercase mb-1">
                                {format(day.date, 'EEE')}
                            </Typography>
                            <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-lg font-semibold ${
                                    day.isToday
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-900 dark:text-white'
                                }`}
                            >
                                {format(day.date, 'd')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-[60px_1fr] relative">
                    {/* Time Gutter */}
                    <div className="flex flex-col">
                        {Array.from({ length: 24 }).map((_, hour) => (
                            <div key={hour} className="h-20 border-r border-gray-200 dark:border-gray-800 pr-2 text-right">
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Lines & Events */}
                    <div className="grid grid-cols-7 relative">
                        {/* Grid Vertical Lines */}
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="absolute top-0 bottom-0 border-r border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer" 
                                 style={{ left: `${(i + 1) * (100 / 7)}%` }}
                                 onClick={() => onDateClick(days[i].date)}
                            />
                        ))}

                        {/* Grid Horizontal Lines */}
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="absolute left-0 right-0 h-px bg-gray-100 dark:bg-gray-800" style={{ top: `${i * 80}px` }} />
                        ))}

                        {/* Events Overlay */}
                        {days.map((day, dayIndex) => (
                            <div key={dayIndex} className="relative h-[1920px]"> {/* 24 hours * 80px */}
                                {day.events.map((event) => {
                                    const startHour = event.start.getHours();
                                    const startMin = event.start.getMinutes();
                                    const endHour = event.end.getHours();
                                    const endMin = event.end.getMinutes();
                                    
                                    const top = (startHour * 80) + (startMin / 60 * 80);
                                    const durationHours = (endHour - startHour) + ((endMin - startMin) / 60);
                                    const height = Math.max(durationHours * 80, 24); // Minimum height

                                    return (
                                        <div
                                            key={event.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick(event);
                                            }}
                                            className={`absolute left-1 right-1 rounded-md border p-2 text-xs overflow-hidden transition-all hover:z-20 hover:ring-2 hover:ring-blue-400 cursor-pointer shadow-sm ${getEventColorClasses(
                                                event.color
                                            )}`}
                                            style={{ top: `${top}px`, height: `${height}px` }}
                                        >
                                            <div className="font-bold truncate">{event.title}</div>
                                            <div className="opacity-80 text-[10px] truncate">
                                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
