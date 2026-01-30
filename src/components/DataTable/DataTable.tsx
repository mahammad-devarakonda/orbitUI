import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Typography } from '../Typography/Typography';

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
}: DataTableProps<T>) => {
    return (
        <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                                    style={{ width: col.width }}
                                    onClick={() => onSort && onSort(col)}
                                >
                                    <div className={`flex items-center gap-2 ${onSort ? 'cursor-pointer hover:text-gray-700' : ''}`}>
                                        {col.header}
                                        {onSort && <ArrowUpDown size={14} className="text-gray-400" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    <Typography variant="body2">{emptyMessage}</Typography>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={keyExtractor(row)} className="hover:bg-gray-50/50 transition-colors">
                                    {columns.map((col, index) => (
                                        <td key={index} className={`px-6 py-4 text-sm text-gray-700 ${col.className || ''}`}>
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
                    className="px-6 py-4 border-t border-gray-200 bg-gray-50/50"
                >
                    <Typography variant="caption" color="text-gray-500">
                        Page <span className="font-medium text-gray-900">{pagination.currentPage}</span> of{' '}
                        <span className="font-medium text-gray-900">{pagination.totalPages}</span>
                    </Typography>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={pagination.currentPage === 1 || isLoading}
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            className="bg-white border-gray-200 text-gray-600 hover:text-gray-800"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={pagination.currentPage === pagination.totalPages || isLoading}
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            className="bg-white border-gray-200 text-gray-600 hover:text-gray-800"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </Stack>
            )}
        </div>
    );
};
