import React from 'react';
import type { CellData, SeatType } from './types';
import { useSeatLayoutEditor } from './context';
import { Accessibility } from 'lucide-react';

interface SeatCellProps {
    row: number;
    col: number;
    cell?: CellData;
    onInteract: (row: number, col: number) => void;
    rowLabel?: string;
    seatSize?: number;
}


const SeatCell: React.FC<SeatCellProps> = ({ row, col, cell, onInteract, rowLabel, seatSize }) => {
    const { layout, categories, readOnly, selectable, selectedSeats, bookedSeats, lockedSeats, onSeatClick } = useSeatLayoutEditor();
    const categoryInfo = categories.find(c => c.id === cell?.category);

    const cellKey = `${row}_${col}`;
    const isSelected = selectedSeats?.includes(cellKey);
    const isBooked = bookedSeats?.includes(cellKey);
    const isLocked = lockedSeats?.includes(cellKey);

    // In readOnly mode, hide damaged, blocked and empty seats by treating them as aisles (invisible gaps)
    const effectiveType = (readOnly && (cell?.type === 'damaged' || cell?.type === 'blocked' || !cell || cell?.type === 'empty'))
        ? 'aisle'
        : (cell?.type || 'empty');

    const seatNumber = React.useMemo(() => {
        if (!layout) return col + 1;
        let count = 0;
        for (let c = 0; c <= col; c++) {
            const currentCell = layout.grid[`${row}_${c}`];
            // In readOnly mode, we hide damaged, blocked, empty, or undefined cells
            const isHidden = readOnly && (!currentCell || currentCell.type === 'damaged' || currentCell.type === 'blocked' || currentCell.type === 'empty');
            const cellType = isHidden ? 'aisle' : (currentCell?.type || 'empty');

            if (cellType === 'seat' || cellType === 'wheelchair') {
                count++;
            }
        }
        return count;
    }, [layout, row, col, readOnly]);

    const getTypeStyles = (type: SeatType) => {
        if (selectable && (isBooked || isLocked)) {
            return 'bg-zinc-900 border-zinc-950 text-zinc-700 cursor-not-allowed select-none opacity-40';
        }
        if (selectable && isSelected) {
            return 'bg-green-400 border-green-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.15)] scale-105 ring-1 ring-green-200';
        }

        switch (type) {
            case 'aisle':
                return 'bg-transparent border-transparent shadow-none cursor-default';
            case 'empty':
                return 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 border-dashed shadow-inner';
            case 'wheelchair':
                if (readOnly) {
                    return 'bg-white dark:bg-slate-900 border-slate-300 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850/20';
                }
                return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-700 text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-blue-700';
            case 'blocked':
                return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900 text-slate-100 shadow-inner opacity-75';
            case 'damaged':
                return 'bg-gradient-to-br from-red-400 to-red-600 border-red-700 text-white shadow-md shadow-red-500/20 hover:from-red-500 hover:to-red-700';
            case 'seat':
                if (readOnly) {
                    return 'bg-white dark:bg-slate-900 border-slate-300 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850/20';
                }
                if (categoryInfo) {
                    if (categoryInfo.color.startsWith('bg-')) {
                        return `${categoryInfo.color} border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-950 shadow-md`;
                    }
                    return 'border-slate-300 dark:border-slate-700 text-white shadow-md';
                }
                return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-sm';
            default:
                return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm';
        }
    };

    const isAisle = effectiveType === 'aisle';
    const isEmpty = effectiveType === 'empty';

    const isCustomHexColor = !readOnly && effectiveType === 'seat' && categoryInfo && !categoryInfo.color.startsWith('bg-');
    const customStyle = {
        width: seatSize !== undefined ? `${seatSize}px` : undefined,
        height: seatSize !== undefined ? `${seatSize}px` : undefined,
        fontSize: seatSize !== undefined ? `${Math.max(6, Math.min(10, seatSize * 0.3))}px` : undefined,
        ...isCustomHexColor ? {
            backgroundColor: categoryInfo.color,
            borderColor: categoryInfo.color,
        } : {}
    };

    return (
        <div
            className={`rounded-sm border flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm select-none
                ${seatSize === undefined ? 'w-8 h-8' : ''}
                ${getTypeStyles(effectiveType)}
                ${isAisle ? 'opacity-20 pointer-events-none' : 'hover:scale-110 hover:shadow-md hover:z-10 active:scale-95'}
                ${isEmpty ? 'opacity-60 hover:opacity-100' : ''}`}
            style={customStyle}
            onMouseEnter={(e) => !selectable && e.buttons === 1 && onInteract(row, col)}
            onMouseDown={(e) => {
                e.preventDefault();
                if (selectable) {
                    if (isBooked || isLocked) return;
                    if (effectiveType !== 'seat' && effectiveType !== 'wheelchair') return;
                    if (onSeatClick) onSeatClick(row, col);
                } else {
                    onInteract(row, col);
                }
            }}
        >
            {!isAisle && !isEmpty && (
                <span className="text-[9px] font-black select-none tracking-tighter uppercase pointer-events-none flex items-center justify-center">
                    {cell?.type === 'blocked'
                        ? 'Block'
                        : cell?.type === 'damaged'
                            ? 'Dmg'
                            : cell?.type === 'wheelchair'
                                ? <Accessibility size={seatSize !== undefined ? Math.max(10, seatSize * 0.5) : 16} strokeWidth={2.5} />
                                : readOnly && cell?.type === 'seat'
                                    ? seatNumber.toString()
                                    : cell?.id || `${rowLabel || String.fromCharCode(65 + row)}${col + 1}`}
                </span>
            )}
        </div>
    );
};

export default React.memo(SeatCell);
