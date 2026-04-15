import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { Calendar, Clock, Tag, Trash2, X } from 'lucide-react';
import { BaseDialog } from '../Dialog/BaseDialog';
import { Input } from '../Input/Input';
import { TextArea } from '../TextArea/TextArea';
import { Button } from '../Button/Button';
import type { CalendarEvent } from './types';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: CalendarEvent | null;
    selectedDate: Date;
    onSave: (event: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
    onDelete?: (id: string) => void;
    defaultSize?: 'sm' | 'md' | 'lg' | 'xl';
    lockDate?: boolean;
    theme?: 'light' | 'dark' | 'system';
}

const COLOR_OPTIONS = [
    { name: 'Blue', value: 'blue', bg: 'bg-[#0070f3]', ring: 'ring-blue-200' },
    { name: 'Green', value: 'green', bg: 'bg-[#10b981]', ring: 'ring-green-200' },
    { name: 'Red', value: 'red', bg: 'bg-[#ef4444]', ring: 'ring-red-200' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-[#f59e0b]', ring: 'ring-yellow-200' },
    { name: 'Purple', value: 'purple', bg: 'bg-[#8b5cf6]', ring: 'ring-purple-200' },
];


export const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    event,
    selectedDate,
    onSave,
    onDelete,
    defaultSize = 'md',
    lockDate = false,
    theme,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [date, setDate] = useState(format(selectedDate, 'yyyy-MM-dd'));
    const [color, setColor] = useState('blue');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description || '');
            setStartTime(format(event.start, 'HH:mm'));
            setEndTime(format(event.end, 'HH:mm'));
            setDate(format(event.start, 'yyyy-MM-dd'));
            setColor(event.color || 'blue');
        } else {
            setTitle('');
            setDescription('');
            setStartTime('09:00');
            setEndTime('10:00');
            setDate(format(selectedDate, 'yyyy-MM-dd'));
            setColor('blue');
        }
    }, [event, selectedDate, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const start = parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const end = parse(`${date} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

        onSave({
            id: event?.id,
            title,
            description,
            start,
            end,
            color,
        });
        onClose();
    };

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size={defaultSize as any || 'lg'}
            showCloseButton={false}
            className="rounded-2xl shadow-xl border-0 overflow-hidden"
            theme={theme}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full -m-6">
                <div className="px-8 py-5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl text-white shadow-md ${COLOR_OPTIONS.find(c => c.value === color)?.bg}`}>
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {event ? 'Edit meeting' : 'New meeting'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {event ? 'Update your event details' : 'Schedule a new calendar entry'}
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </Button>
                </div>

                <div className="px-8 py-6 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Event Title
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add a title"
                            required
                            autoFocus
                            className="text-base"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Clock className="w-4 h-4 text-[#0070f3]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Schedule</span>
                        </div>

                        <div className={`grid grid-cols-1 ${lockDate ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
                            {!lockDate && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Date</label>
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="w-full"
                                    />
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Start Time</label>
                                <Input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">End Time</label>
                                <Input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Tag className="w-4 h-4 text-[#8b5cf6]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Category Color</span>
                        </div>
                        <div className="flex gap-3 px-1">
                            {COLOR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setColor(opt.value)}
                                    className={`w-8 h-8 rounded-full transition-all relative flex items-center justify-center ${opt.bg} ${color === opt.value
                                        ? `ring-2 ring-offset-2 dark:ring-offset-gray-900 ${opt.ring.replace('ring-', 'ring-')}`
                                        : 'opacity-70 hover:opacity-100'
                                        }`}
                                    aria-label={`Select ${opt.name} category`}
                                >
                                    {color === opt.value && <X className="w-3 h-3 text-white rotate-45" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <TextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes or meeting details"
                            rows={3}
                            className="text-sm"
                        />
                    </div>
                </div>

                <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
                    <div>
                        {event && onDelete && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (window.confirm('Delete this event?')) {
                                        onDelete(event.id);
                                        onClose();
                                    }
                                }}
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                leftIcon={<Trash2 className="w-4 h-4" />}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="tertiary"
                            size="md"
                            onClick={onClose}
                            className="dark:bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            className="shadow-sm px-6"
                        >
                            {event ? 'Update' : 'Schedule'}
                        </Button>
                    </div>
                </div>
            </form>
        </BaseDialog>
    );
};
