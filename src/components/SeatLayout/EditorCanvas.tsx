import React, { useCallback } from 'react';
import { useSeatLayoutEditor } from './context';
import type { CellData } from './types';
import SeatCell from './SeatCell';
import { Typography } from '../Typography/Typography';
import { Stack } from '../Stack';

export interface EditorCanvasProps {
    readOnly?: boolean;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ readOnly: propReadOnly }) => {
    const {
        layout,
        readOnly: contextReadOnly,
        activeCategory,
        activeType,
        updateCell,
        toggleDividerRow,
        toggleDividerCol
    } = useSeatLayoutEditor();

    const readOnly = propReadOnly !== undefined ? propReadOnly : contextReadOnly;

    const handleInteract = useCallback((row: number, col: number) => {
        if (readOnly || !layout) return;

        const currentCell = layout.grid[`${row}_${col}`];
        let data: Partial<CellData> = {};

        const isSameType = currentCell?.type === activeType;
        const isSameCategory = activeType !== 'seat' || currentCell?.category === activeCategory;

        if (isSameType && isSameCategory && currentCell?.type !== 'empty') {
            data = { type: 'empty', category: undefined };
        } else {
            data = { type: activeType, category: activeType === 'seat' ? activeCategory : undefined };
        }

        updateCell(row, col, data);
    }, [readOnly, layout, activeCategory, activeType, updateCell]);

    const handleToggleDividerRow = useCallback((row: number) => {
        if (readOnly) return;
        toggleDividerRow(row);
    }, [readOnly, toggleDividerRow]);

    const handleToggleDividerCol = useCallback((col: number) => {
        if (readOnly) return;
        toggleDividerCol(col);
    }, [readOnly, toggleDividerCol]);

    if (!layout) {
        return (
            <Stack alignItems="center" justifyContent="center" className="h-full py-12">
                <Typography variant="body2" className="text-slate-400 dark:text-slate-500 animate-pulse">
                    Initializing layout...
                </Typography>
            </Stack>
        );
    }

    const { rows, cols } = layout.dimensions;
    const dividerRows = layout.dividerRows || [];
    const dividerCols = layout.dividerCols || [];

    // Calculate row labels dynamically by skipping divider rows
    let currentLetterCode = 65; // Code for 'A'
    const rowLabels = Array.from({ length: rows }).map((_, r) => {
        const isDivider = dividerRows.includes(r);
        if (isDivider) {
            return { isDivider, label: '' };
        }

        let label = '';
        let tempCode = currentLetterCode - 65;
        const repeatCount = Math.floor(tempCode / 26) + 1;
        const letter = String.fromCharCode(65 + (tempCode % 26));
        label = letter.repeat(repeatCount);

        currentLetterCode++;
        return { isDivider, label };
    });

    // Calculate column labels dynamically by skipping divider columns
    let currentColNumber = 1;
    const colLabels = Array.from({ length: cols }).map((_, c) => {
        const isDivider = dividerCols.includes(c);
        if (isDivider) {
            return { isDivider, label: readOnly ? '' : '|' };
        }
        const label = currentColNumber.toString();
        currentColNumber++;
        return { isDivider, label };
    });

    // Define grid column widths dynamically: dividers are 16px wide, regular seats are 32px
    const colWidths = Array.from({ length: cols }).map((_, c) => {
        return dividerCols.includes(c) ? '16px' : '32px';
    }).join(' ');

    return (
        <Stack
            alignItems="center"
            className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl/40 overflow-auto max-h-[600px] w-full no-scrollbar"
        >
            <div className="relative group p-4 min-w-max">


                {/* Column Headers */}
                <div
                    className="grid gap-3 mb-4 ml-10"
                    style={{
                        gridTemplateColumns: colWidths,
                    }}
                >
                    {colLabels.map((info, c) => (
                        <div key={`col_${c}`} className="flex items-center justify-center relative group/col-header h-6">
                            {info.isDivider ? (
                                <span onClick={() => handleToggleDividerCol(c)} className="cursor-pointer">
                                    <Typography
                                        variant="caption"
                                        weight="extrabold"
                                        className="text-[10px] tracking-tighter text-purple-500 hover:text-purple-700 transition-colors select-none"
                                    >
                                        {info.label}
                                    </Typography>
                                </span>
                            ) : (
                                <Typography
                                    variant="caption"
                                    weight="extrabold"
                                    className="text-[10px] tracking-tighter text-slate-300 dark:text-slate-600 select-none"
                                >
                                    {info.label}
                                </Typography>
                            )}
                            {!readOnly && info.isDivider && (
                                <button
                                    onClick={() => handleToggleDividerCol(c)}
                                    className="absolute -top-6 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-500 text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded border border-red-200 dark:border-red-900 transition-all opacity-0 group-hover/col-header:opacity-100 cursor-pointer shadow-sm z-10"
                                >
                                    Del
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex">
                    {/* Row Headers */}
                    <div className="flex flex-col gap-3 mr-4 w-6">
                        {rowLabels.map((info, r) => (
                            <div key={`row_${r}`} className="h-8 flex items-center justify-end">
                                <Typography
                                    variant="caption"
                                    weight="extrabold"
                                    className="text-[10px] text-slate-300 dark:text-slate-600 select-none"
                                >
                                    {info.isDivider ? '—' : info.label}
                                </Typography>
                            </div>
                        ))}
                    </div>

                    {/* Grid Container */}
                    <div
                        className="grid gap-3 p-1"
                        style={{
                            gridTemplateColumns: colWidths,
                        }}
                    >
                        {Array.from({ length: rows }).flatMap((_, r) => {
                            const isRowDivider = dividerRows.includes(r);
                            if (isRowDivider) {
                                return [
                                    <div
                                        key={`divider_row_${r}`}
                                        className="h-8 flex items-center justify-center relative group/divider"
                                        style={{ gridColumn: `span ${cols}` }}
                                    >
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800 group-hover/divider:border-purple-300 dark:group-hover/divider:border-purple-800 transition-colors" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-3 bg-white dark:bg-slate-900 text-[10px] font-black text-purple-600 dark:text-purple-450 uppercase tracking-[0.2em] group-hover/divider:text-purple-500 transition-colors select-none">
                                                {layout.dividerNames?.[r] || 'Stage Divider'}
                                            </span>
                                        </div>
                                        {!readOnly && (
                                            <button
                                                onClick={() => handleToggleDividerRow(r)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900 transition-all opacity-0 group-hover/divider:opacity-100 cursor-pointer shadow-sm z-10"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ];
                            }
                            return Array.from({ length: cols }).map((_, c) => {
                                const isColDivider = dividerCols.includes(c);
                                if (isColDivider) {
                                    return (
                                        <div
                                            key={`divider_col_${r}_${c}`}
                                            className="h-8 w-full flex items-center justify-center relative group/col-divider"
                                        >
                                            {!readOnly && (
                                                <div className="h-full border-l-2 border-dashed border-slate-200 dark:border-slate-800 group-hover/col-divider:border-purple-300 dark:group-hover/col-divider:border-purple-800 transition-colors" />
                                            )}
                                            {!readOnly && (
                                                <button
                                                    onClick={() => handleToggleDividerCol(c)}
                                                    className="absolute bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-500 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900 transition-all opacity-0 group-hover/col-divider:opacity-100 cursor-pointer shadow-sm z-10"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    );
                                }
                                return (
                                    <SeatCell
                                        key={`${r}_${c}`}
                                        row={r}
                                        col={c}
                                        cell={layout.grid[`${r}_${c}`]}
                                        onInteract={handleInteract}
                                        rowLabel={rowLabels[r]?.label}
                                    />
                                );
                            });
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-lg">
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200/50 dark:border-slate-700/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-800 to-transparent animate-pulse" />
                </div>
            </div>
        </Stack>
    );
};

export default EditorCanvas;
