import React from 'react';
import { format } from 'date-fns';
import { X, Clock, Calendar as CalendarIcon, Plus, Info } from 'lucide-react';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import type { CalendarEvent } from './types';
import { getEventColorClasses } from './utils';

interface EventListSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onScheduleClick: () => void;
}

export const EventListSidebar: React.FC<EventListSidebarProps> = ({
    isOpen,
    onClose,
    date,
    events,
    onEventClick,
    onScheduleClick,
}) => {
    return (
        <div
            className={`absolute top-0 right-0 h-full w-80 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
                    <div>
                        <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                            {format(date, 'EEEE')}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 font-medium">
                            {format(date, 'MMMM d, yyyy')}
                        </Typography>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full h-8 w-8 hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </Button>
                </div>

                {/* Event List */}
                <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                    {events.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                                    Upcoming Events
                                </span>
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {events.length}
                                </span>
                            </div>

                            {events.sort((a, b) => a.start.getTime() - b.start.getTime()).map((event) => (
                                <div
                                    key={event.id}
                                    onClick={() => onEventClick(event)}
                                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${getEventColorClasses(
                                        event.color
                                    )} opacity-90 hover:opacity-100`}
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 opacity-70" />
                                                <span className="text-[11px] font-bold">
                                                    {format(event.start, 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-bold leading-tight line-clamp-2">
                                            {event.title}
                                        </h4>
                                        {event.description && (
                                            <p className="text-[10px] opacity-70 line-clamp-1 italic">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-3xl flex items-center justify-center mb-4">
                                <CalendarIcon className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                            </div>
                            <Typography variant="body2" className="text-gray-900 dark:text-white font-bold mb-1">
                                No events scheduled
                            </Typography>
                            <Typography variant="caption" className="text-gray-500 mb-6">
                                Your schedule is clear for this day. Want to plan something?
                            </Typography>
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Plus className="w-4 h-4" />}
                                onClick={onScheduleClick}
                                className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                            >
                                Schedule Now
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                {events.length > 0 && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="primary"
                            fullWidth
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={onScheduleClick}
                            className="rounded-xl font-bold py-6 shadow-xl shadow-blue-500/10 bg-blue-600 hover:bg-blue-700"
                        >
                            New Appointment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
