import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
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
    onScheduleClick: () => void;
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
    onScheduleClick,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 border-b border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 gap-4 shadow-sm relative z-20">
            <div className="flex items-center gap-6">
                <div className="flex flex-col gap-0.5 min-w-[140px]">
                    <Typography variant="h5" className="font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                        {format(currentDate, view === 'month' ? 'MMMM' : 'MMM d')}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                        {format(currentDate, 'yyyy')}
                    </Typography>
                </div>

                <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-1 shadow-inner">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrev}
                        className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:text-blue-600 rounded-lg transition-transform active:scale-90"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onToday}
                        className="h-9 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-lg transition-all"
                    >
                        Today
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNext}
                        className="h-9 w-9 text-gray-600 dark:text-gray-400 hover:text-blue-600 rounded-lg transition-transform active:scale-90"
                        aria-label="Next"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-72 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter anything..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-medium"
                    />
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1 shadow-inner">
                    <button
                        onClick={() => onViewChange('month')}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${view === 'month'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md transform scale-[1.05]'
                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => onViewChange('week')}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${view === 'week'
                            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md transform scale-[1.05]'
                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Week
                    </button>
                </div>

                <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Plus className="w-5 h-5" />}
                    onClick={onScheduleClick}
                    className="rounded-xl font-extrabold px-6 bg-blue-600 shadow-lg shadow-blue-500/20 transition-all"
                >
                    Schedule Event
                </Button>
                <Button
                    variant="primary"
                    size="icon"
                    onClick={onScheduleClick}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 lg:hidden flex h-10 w-10 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
