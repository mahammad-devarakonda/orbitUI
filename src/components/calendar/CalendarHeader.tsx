import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import type { CalendarView } from './types';

interface CalendarHeaderProps {
    currentDate: Date;
    view: CalendarView;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    onViewChange: (view: CalendarView) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    currentDate,
    view,
    onPrev,
    onNext,
    onToday,
    onViewChange,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 gap-4">
            <div className="flex items-center gap-4">
                <Typography variant="h4" className="min-w-[180px] font-semibold text-gray-900 dark:text-white">
                    {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
                </Typography>

                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrev}
                        className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-blue-600"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onToday}
                        className="h-8 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600"
                    >
                        Today
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNext}
                        className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-blue-600"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => onViewChange('month')}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                            view === 'month'
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => onViewChange('week')}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                            view === 'week'
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Week
                    </button>
                </div>
            </div>
        </div>
    );
};
