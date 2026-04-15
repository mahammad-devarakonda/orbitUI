import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, isSameDay } from 'date-fns';
import type { CalendarView, CalendarEvent, CalendarProps } from './types';
import { getMonthDays, getWeekDays } from './utils';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { EventModal } from './EventModal';
import { EventListSidebar } from './EventListSidebar';

/**
 * Reusable Calendar component mimicking Microsoft Teams UI.
 * Supports Month and Week views, event management (CRUD), accessibility, and dark mode.
 */
export const Calendar: React.FC<CalendarProps> = ({
    events: initialEvents = [],
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    modalSize,
    className = '',
    theme = 'system',
}) => {
    // --- State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    
    // Modal & Sidebar State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [lockModalDate, setLockModalDate] = useState(false);

    // Theme handling
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
        if (theme !== 'system') return theme as 'light' | 'dark';
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setEffectiveTheme(isDark ? 'dark' : 'light');

            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => setEffectiveTheme(e.matches ? 'dark' : 'light');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            setEffectiveTheme(theme as 'light' | 'dark');
        }
    }, [theme]);

    // Sync with props/initialEvents or localStorage
    useEffect(() => {
        const stored = localStorage.getItem('orbit_calendar_events');
        if (stored) {
            try {
                const parsed = JSON.parse(stored).map((e: any) => ({
                    ...e,
                    start: new Date(e.start),
                    end: new Date(e.end)
                }));
                // Combine with props (ensure no duplicates by ID if exists)
                setEvents(parsed);
            } catch (e) {
                console.error('Failed to parse stored events', e);
            }
        } else if (initialEvents.length > 0) {
            setEvents(initialEvents);
        }
    }, [initialEvents]);

    // Save to localStorage whenever events change
    useEffect(() => {
        localStorage.setItem('orbit_calendar_events', JSON.stringify(events));
    }, [events]);

    // --- Memoized Helpers ---
    const filteredEvents = useMemo(() => {
        if (!searchQuery) return events;
        return events.filter(e => 
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [events, searchQuery]);

    const gridDays = useMemo(() => {
        return view === 'month' 
            ? getMonthDays(currentDate, filteredEvents) 
            : getWeekDays(currentDate, filteredEvents);
    }, [view, currentDate, filteredEvents]);

    const selectedDateEvents = useMemo(() => {
        return events.filter(e => isSameDay(e.start, selectedDate));
    }, [events, selectedDate]);

    // --- Handlers ---
    const handlePrev = useCallback(() => {
        setCurrentDate(prev => view === 'month' ? subMonths(prev, 1) : subWeeks(prev, 1));
    }, [view]);

    const handleNext = useCallback(() => {
        setCurrentDate(prev => view === 'month' ? addMonths(prev, 1) : addWeeks(prev, 1));
    }, [view]);

    const handleToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsSidebarOpen(true);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setSelectedDate(event.start);
        setLockModalDate(true);
        setIsModalOpen(true);
    };

    const handleScheduleClick = (lockDate: boolean = false) => {
        setSelectedEvent(null);
        setLockModalDate(lockDate);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'> & { id?: string }) => {
        if (eventData.id) {
            // Update
            const updatedEvent = { ...eventData, id: eventData.id } as CalendarEvent;
            setEvents(prev => prev.map(e => e.id === eventData.id ? updatedEvent : e));
            onUpdateEvent?.(updatedEvent);
        } else {
            // Add
            const newEvent: CalendarEvent = {
                ...eventData,
                id: crypto.randomUUID(),
            };
            setEvents(prev => [...prev, newEvent]);
            onAddEvent?.(newEvent);
        }
        setIsModalOpen(false);
    };

    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        onDeleteEvent?.(id);
        setIsModalOpen(false);
    };

    // Keyboard Navigation (Basic Arrow Keys)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isModalOpen) return;
            
            switch (e.key) {
                case 'ArrowLeft': handlePrev(); break;
                case 'ArrowRight': handleNext(); break;
                case 'Enter': handleDateClick(currentDate); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [view, currentDate, isModalOpen, handlePrev, handleNext]);

    return (
        <div className={`${effectiveTheme === 'dark' ? 'dark' : ''} h-full w-full`}>
            <div className={`flex flex-col h-full min-h-[600px] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-lg transition-colors duration-300 ${className}`}>
                <CalendarHeader
                    currentDate={currentDate}
                    view={view}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={handleToday}
                    onViewChange={setView}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onScheduleClick={() => handleScheduleClick(false)}
                />
                
                <div className="flex-1 flex flex-row overflow-hidden relative">
                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        <CalendarGrid
                            view={view}
                            days={gridDays.map(d => ({
                                ...d,
                                isCurrentDay: isSameDay(d.date, selectedDate)
                            }))}
                            onDateClick={handleDateClick}
                            onEventClick={handleEventClick}
                        />
                    </div>

                    <EventListSidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        date={selectedDate}
                        events={selectedDateEvents}
                        onEventClick={handleEventClick}
                        onScheduleClick={() => handleScheduleClick(true)}
                    />
                </div>

                <EventModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    event={selectedEvent}
                    selectedDate={selectedDate}
                    onSave={handleSaveEvent}
                    onDelete={handleDeleteEvent}
                    defaultSize={modalSize}
                    lockDate={lockModalDate}
                    theme={theme}
                />
            </div>
        </div>
    );
};
