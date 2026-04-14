import React, { useState, useEffect, useMemo } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import type { CalendarView, CalendarEvent, CalendarProps } from './types';
import { getMonthDays, getWeekDays } from './utils';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { EventModal } from './EventModal';

/**
 * Reusable Calendar component mimicking Microsoft Teams UI.
 * Supports Month and Week views, event management (CRUD), and accessibility.
 */
export const Calendar: React.FC<CalendarProps> = ({
    events: initialEvents = [],
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    modalSize,
    className = '',
}) => {
    // --- State ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('month');
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    // --- Handlers ---
    const handlePrev = () => {
        setCurrentDate(prev => view === 'month' ? subMonths(prev, 1) : subWeeks(prev, 1));
    };

    const handleNext = () => {
        setCurrentDate(prev => view === 'month' ? addMonths(prev, 1) : addWeeks(prev, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setSelectedDate(event.start);
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
    }, [view, currentDate, isModalOpen]);

    return (
        <div className={`flex flex-col h-full min-h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm ${className}`}>
            <CalendarHeader
                currentDate={currentDate}
                view={view}
                onPrev={handlePrev}
                onNext={handleNext}
                onToday={handleToday}
                onViewChange={setView}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <CalendarGrid
                    view={view}
                    days={gridDays}
                    onDateClick={handleDateClick}
                    onEventClick={handleEventClick}
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
            />
        </div>
    );
};
