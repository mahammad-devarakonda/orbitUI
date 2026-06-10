import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';
import { SearchBar } from '../SearchBar/SearchBar';
import { Filter, type FilterConfig } from '../Filter/Filter';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
    width?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    isLoading?: boolean;
    onSort?: (column: Column<T>) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    emptyMessage?: string;
    className?: string;

    // Search and Header Actions
    searchable?: boolean;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    headerActions?: React.ReactNode;

    // Filters
    filters?: FilterConfig[];
    filterValues?: Record<string, any>;
    onFilterChange?: (key: string, value: any) => void;
    onClearFilters?: () => void;

    // Custom Render Overrides
    renderSearch?: (props: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    }) => React.ReactNode;
    renderFilter?: (props: {
        filters: FilterConfig[];
        filterValues: Record<string, any>;
        onFilterChange: (key: string, value: any) => void;
        onClearFilters?: () => void;
    }) => React.ReactNode;

    // Custom Pagination
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;
    onRowsPerPageChange?: (val: number) => void;
    totalRows?: number;
}

export const DataTable = <T extends any>({
    data,
    columns,
    keyExtractor,
    isLoading,
    onSort,
    pagination,
    emptyMessage = 'No data available',
    className = '',
    searchable = false,
    searchPlaceholder = 'Search...',
    searchValue = '',
    onSearchChange,
    headerActions,
    filters = [],
    filterValues = {},
    onFilterChange,
    onClearFilters,
    renderSearch,
    renderFilter,
    rowsPerPageOptions = [10, 25, 50],
    rowsPerPage,
    onRowsPerPageChange,
    totalRows,
}: DataTableProps<T>) => {
    return (
        <div className={`w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden ${className}`}>
            {/* Search & Header Action Toolbar */}
            {(searchable || headerActions) && (
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {searchable && (
                        renderSearch ? (
                            renderSearch({
                                value: searchValue,
                                onChange: onSearchChange || (() => {}),
                                placeholder: searchPlaceholder,
                            })
                        ) : (
                            <SearchBar
                                value={searchValue}
                                onChange={onSearchChange}
                                placeholder={searchPlaceholder}
                                size="sm"
                                containerClassName="w-full max-w-md"
                            />
                        )
                    )}
                    {!searchable && <div />}
                    {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
                </div>
            )}

            {/* Dropdown Filters Bar */}
            {filters && filters.length > 0 && (
                renderFilter ? (
                    renderFilter({
                        filters,
                        filterValues,
                        onFilterChange: onFilterChange || (() => {}),
                        onClearFilters,
                    })
                ) : (
                    <Filter
                        filters={filters}
                        filterValues={filterValues}
                        onFilterChange={onFilterChange || (() => {})}
                        onClearFilters={onClearFilters}
                    />
                )
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${col.className || ''}`}
                                    style={{ width: col.width }}
                                    onClick={() => onSort && onSort(col)}
                                >
                                    <div className={`flex items-center gap-2 ${onSort ? 'cursor-pointer hover:text-slate-750' : ''}`}>
                                        {col.header}
                                        {onSort && <ArrowUpDown size={14} className="text-slate-405" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                    <Typography variant="body2">{emptyMessage}</Typography>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={keyExtractor(row)} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition">
                                    {columns.map((col, index) => (
                                        <td key={index} className={`px-6 py-4 text-sm text-slate-700 dark:text-slate-350 ${col.className || ''}`}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(row)
                                                : (row[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <Stack
                    direction="row"
                    justifyContent="between"
                    alignItems="center"
                    className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"
                >
                    {/* Advanced pagination metadata */}
                    {totalRows !== undefined && rowsPerPage !== undefined ? (
                        <div className="flex items-center gap-5 text-xs text-slate-500 select-none">
                            {onRowsPerPageChange && (
                                <div className="flex items-center gap-2">
                                    <span>Rows per page:</span>
                                    <div className="relative">
                                        <select
                                            value={rowsPerPage}
                                            onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
                                            className="appearance-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 pl-2 pr-6 py-1 rounded cursor-pointer font-bold focus:outline-none"
                                        >
                                            {rowsPerPageOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-400">
                                            <ChevronDown size={12} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <span>
                                {Math.min(totalRows, (pagination.currentPage - 1) * rowsPerPage + 1)}-
                                {Math.min(totalRows, pagination.currentPage * rowsPerPage)} of {totalRows}
                            </span>
                        </div>
                    ) : (
                        <Typography variant="caption" color="text-slate-500">
                            Page <span className="font-medium text-slate-800 dark:text-slate-200">{pagination.currentPage}</span> of{' '}
                            <span className="font-medium text-slate-800 dark:text-slate-200">{pagination.totalPages}</span>
                        </Typography>
                    )}

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={pagination.currentPage === 1 || isLoading}
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            className="bg-white dark:bg-slate-800 border-slate-150 dark:border-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={pagination.currentPage === pagination.totalPages || isLoading}
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            className="bg-white dark:bg-slate-800 border-slate-150 dark:border-slate-750 text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </Stack>
            )}
        </div>
    );
};
