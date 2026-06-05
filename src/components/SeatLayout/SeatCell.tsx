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
}

const SeatCell: React.FC<SeatCellProps> = ({ row, col, cell, onInteract, rowLabel }) => {
    const { categories, readOnly, selectable, selectedSeats, bookedSeats, lockedSeats, onSeatClick } = useSeatLayoutEditor();
    const categoryInfo = categories.find(c => c.id === cell?.category);

    const cellKey = `${row}_${col}`;
    const isSelected = selectedSeats?.includes(cellKey);
    const isBooked = bookedSeats?.includes(cellKey);
    const isLocked = lockedSeats?.includes(cellKey);

    // In readOnly mode, hide damaged and empty seats by treating them as aisles (invisible gaps)
    const effectiveType = (readOnly && (cell?.type === 'damaged' || !cell || cell?.type === 'empty')) 
        ? 'aisle' 
        : (cell?.type || 'empty');

    const getTypeStyles = (type: SeatType, category?: string) => {
        if (selectable && (isBooked || isLocked)) {
            return 'bg-zinc-900 border-zinc-950 text-zinc-700 cursor-not-allowed select-none opacity-40';
        }
        if (selectable && isSelected) {
            return 'bg-rose-600 border-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)] scale-105 ring-2 ring-rose-500/20 hover:bg-rose-500';
        }

        switch (type) {
            case 'aisle':
                return 'bg-transparent border-transparent shadow-none cursor-default';
            case 'empty':
                return 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 border-dashed shadow-inner';
            case 'wheelchair':
                return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-700 text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-blue-700';
            case 'blocked':
                return 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900 text-slate-100 shadow-inner opacity-75';
            case 'damaged':
                return 'bg-gradient-to-br from-red-400 to-red-600 border-red-700 text-white shadow-md shadow-red-500/20 hover:from-red-500 hover:to-red-700';
            case 'seat':
                if (category === 'vip') {
                    return 'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-600 text-amber-950 shadow-md shadow-amber-300/30 dark:shadow-amber-500/10 hover:from-amber-400 hover:to-amber-600';
                }
                if (category === 'gold') {
                    return 'bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500 text-yellow-950 shadow-md shadow-yellow-200/30 dark:shadow-yellow-400/10 hover:from-yellow-300 hover:to-yellow-500';
                }
                if (category === 'silver') {
                    return 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-500 text-slate-900 dark:text-slate-950 shadow-md shadow-slate-300/30 dark:shadow-slate-400/10 hover:from-slate-300 hover:to-slate-500';
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

    const isCustomHexColor = effectiveType === 'seat' && categoryInfo && !categoryInfo.color.startsWith('bg-');
    const customStyle = isCustomHexColor
        ? {
              backgroundColor: categoryInfo.color,
              borderColor: categoryInfo.color,
          }
        : undefined;

    return (
        <div
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm select-none
                ${getTypeStyles(effectiveType, cell?.category)}
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
                        ? <Accessibility size={16} strokeWidth={2.5} />
                        : cell?.id || `${rowLabel || String.fromCharCode(65 + row)}${col + 1}`}
                </span>
            )}
        </div>
    );
};

export default React.memo(SeatCell);
