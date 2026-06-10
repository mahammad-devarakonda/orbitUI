import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
    DateRangePicker,
    createStaticRanges,
    type Range,
    type RangeKeyDict,
    type StaticRange,
} from 'react-date-range';
import { enUS } from 'date-fns/locale';
import { subDays, subMonths, subYears } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    options?: FilterOption[];
    type?: 'select' | 'date';
}

export interface FilterProps {
    /** The configuration for all filters */
    filters: FilterConfig[];
    /** The current active values for each filter key (either select arrays, strings, or react-date-range Range) */
    filterValues: Record<string, string | string[] | Range | undefined>;
    /** Callback when a filter value changes */
    onFilterChange: (key: string, value: string | string[] | Range | undefined) => void;
    /** Callback to clear all filter values */
    onClearFilters?: () => void;
    /** Whether to show custom ranges in date picker */
    showCustomRanges?: boolean;
    /** Optional custom container CSS classes */
    className?: string;
}

export const Filter: React.FC<FilterProps> = ({
    filters = [],
    filterValues = {},
    onFilterChange,
    onClearFilters,
    showCustomRanges = false,
    className = '',
}) => {
    const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setActiveFilterKey(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    if (!filters || filters.length === 0) {
        return null;
    }

    // Custom Static Ranges
    const customRanges: StaticRange[] = createStaticRanges([
        {
            label: 'Last Week',
            range: () => ({
                startDate: subDays(new Date(), 7),
                endDate: new Date(),
            }),
        },
        {
            label: 'Last Month',
            range: () => ({
                startDate: subMonths(new Date(), 1),
                endDate: new Date(),
            }),
        },
        {
            label: 'Last Year',
            range: () => ({
                startDate: subYears(new Date(), 1),
                endDate: new Date(),
            }),
        },
    ]);

    const handleSelect = (key: string, optionValue: string, isMulti: boolean) => {
        if (isMulti) {
            const currentSelected = (filterValues[key] as string[]) || [];
            const isAlreadySelected = currentSelected.includes(optionValue);
            const nextSelected = isAlreadySelected
                ? currentSelected.filter((v) => v !== optionValue)
                : [...currentSelected, optionValue];

            onFilterChange(key, nextSelected);
        } else {
            onFilterChange(key, optionValue);
            setActiveFilterKey(null);
        }
    };

    const handleDateChange = (key: string, selection: Range) => {
        if (selection?.startDate && selection?.endDate) {
            onFilterChange(key, selection);
        }
    };

    const getButtonLabel = (filter: FilterConfig, rawVal: any, isMulti: boolean, isDateRange: boolean) => {
        if (isDateRange) {
            const range = rawVal as Range | undefined;
            if (range && range.startDate instanceof Date && range.endDate instanceof Date) {
                return `${filter.label}: ${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}`;
            }
            return filter.label;
        }

        const selected = isMulti
            ? (rawVal as string[]) || []
            : rawVal
                ? [rawVal as string]
                : [];

        if (selected.length === 0) {
            return filter.label;
        }

        if (isMulti) {
            if (selected.length === 1) {
                const opt = filter.options?.find((o) => o.value === selected[0]);
                return `${filter.label}: ${opt?.label || selected[0]}`;
            }
            return `${filter.label}: ${selected.length} selected`;
        } else {
            const opt = filter.options?.find((o) => o.value === selected[0]);
            return opt ? `${filter.label}: ${opt.label}` : filter.label;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`flex flex-wrap items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 ${className}`}
        >
            {filters.map((filter) => {
                const rawVal = filterValues[filter.key];
                const isDateRange = filter.type === 'date' || (!filter.options || filter.options.length === 0);
                const isMulti = Array.isArray(rawVal);
                const isOpen = activeFilterKey === filter.key;

                const selected = isMulti
                    ? (rawVal as string[]) || []
                    : rawVal && typeof rawVal === 'string'
                        ? [rawVal]
                        : [];

                const hasValue = isDateRange
                    ? !!(rawVal && (rawVal as Range).startDate && (rawVal as Range).endDate)
                    : selected.length > 0;

                return (
                    <div key={filter.key} className="relative">
                        <button
                            type="button"
                            onClick={() => setActiveFilterKey(isOpen ? null : filter.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all duration-150 select-none outline-none ${hasValue
                                ? 'bg-blue-50/70 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 dark:bg-blue-950/20'
                                : 'bg-slate-100 hover:bg-slate-150/70 border-slate-200/50 dark:bg-slate-800 dark:hover:bg-slate-750 dark:border-slate-750 text-slate-700 dark:text-slate-250'
                                }`}
                        >
                            <span>{getButtonLabel(filter, rawVal, isMulti, isDateRange)}</span>
                            <ChevronDown
                                size={14}
                                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {isOpen && (
                            <div className="absolute left-0 mt-2 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-lg shadow-xl z-50 overflow-hidden">
                                {isDateRange ? (
                                    /* react-date-range Picker Container */
                                    <div className="text-slate-800 dark:text-slate-200">
                                        <DateRangePicker
                                            onChange={(ranges: RangeKeyDict) =>
                                                handleDateChange(filter.key, ranges?.selection)
                                            }
                                            moveRangeOnFirstSelection={false}
                                            ranges={[
                                                (rawVal && (rawVal as Range).startDate && (rawVal as Range).endDate)
                                                    ? (rawVal as Range)
                                                    : {
                                                        startDate: new Date(),
                                                        endDate: new Date(),
                                                        key: 'selection',
                                                    },
                                            ]}
                                            locale={enUS}
                                            staticRanges={showCustomRanges ? customRanges : []}
                                            inputRanges={[]}
                                            showDateDisplay={false}
                                            className={showCustomRanges ? '' : 'hide-defined-ranges'}
                                        />
                                    </div>
                                ) : (
                                    /* Single or Multi-Select dropdown list */
                                    <div className="w-60 py-1 max-h-64 overflow-y-auto">
                                        {!isMulti && (
                                            <div
                                                onClick={() => handleSelect(filter.key, '', isMulti)}
                                                className="flex items-center justify-between w-full px-4 py-2.5 text-left text-xs text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer select-none font-medium transition-colors"
                                            >
                                                <span>All {filter.label}</span>
                                                {selected.length === 0 && <Check size={12} className="text-blue-600" />}
                                            </div>
                                        )}
                                        {filter.options?.map((opt) => {
                                            const isSelected = selected.includes(opt.value);
                                            return (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => handleSelect(filter.key, opt.value, isMulti)}
                                                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer select-none font-medium transition-colors ${isSelected
                                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/10'
                                                        : 'text-slate-700 dark:text-slate-300'
                                                        }`}
                                                >
                                                    {isMulti ? (
                                                        <div
                                                            className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${isSelected
                                                                ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500 text-white'
                                                                : 'border-slate-300 dark:border-slate-700 bg-transparent'
                                                                }`}
                                                        >
                                                            {isSelected && <Check size={10} strokeWidth={3} />}
                                                        </div>
                                                    ) : null}
                                                    <span className="flex-1 truncate">{opt.label}</span>
                                                    {!isMulti && isSelected ? (
                                                        <Check size={12} className="text-blue-600 dark:text-blue-400" />
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer border-none bg-transparent outline-none ml-2"
                >
                    CLEAR FILTERS
                </button>
            )}
        </div>
    );
};

Filter.displayName = 'Filter';
