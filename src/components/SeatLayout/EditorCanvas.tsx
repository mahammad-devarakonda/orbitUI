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
        selectedTool,
        updateCell,
        toggleDividerRow,
        toggleDividerCol,
        categories
    } = useSeatLayoutEditor();

    const readOnly = propReadOnly !== undefined ? propReadOnly : contextReadOnly;

    const handleInteract = useCallback((row: number, col: number) => {
        if (readOnly || !layout) return;

        let data: Partial<CellData> = {};
        if (selectedTool === 'erase') {
            data = { type: 'empty', category: undefined };
        } else if (selectedTool === 'paint') {
            data = { type: activeType, category: activeType === 'seat' ? activeCategory : undefined };
        } else if (selectedTool === 'select') {
            const currentCell = layout.grid[`${row}_${col}`];
            data = { type: currentCell?.type === 'aisle' ? 'seat' : 'aisle', category: undefined };
        }

        updateCell(row, col, data);
    }, [readOnly, layout, selectedTool, activeCategory, activeType, updateCell]);

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

    // Find the category of the first section if row 0 is not a divider
    const showTopCategory = !dividerRows.includes(0);
    let firstCat = null;
    if (showTopCategory && layout) {
        let categoryId = '';
        for (let r = 0; r < rows; r++) {
            if (dividerRows.includes(r)) {
                break; // Stop at first divider
            }
            for (let c = 0; c < cols; c++) {
                const cell = layout.grid[`${r}_${c}`];
                if (cell?.category) {
                    categoryId = cell.category;
                    break;
                }
            }
            if (categoryId) break;
        }
        if (categoryId) {
            firstCat = categories.find(c => c.id === categoryId) || null;
        }
    }

    return (
        <Stack
            alignItems="center"
            className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl/40 overflow-auto max-h-[600px] w-full no-scrollbar"
        >
            <div className="relative group p-4 min-w-max">
                {firstCat && (
                    <div className="flex justify-center mb-4 ml-10">
                        <Typography
                            variant="body2"
                            weight="bold"
                            className="text-slate-855 dark:text-slate-200 select-none"
                        >
                            {firstCat.name}{firstCat.price !== undefined ? `: ₹${firstCat.price.toFixed(2)}` : ''}
                        </Typography>
                    </div>
                )}


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
                                    {info.isDivider ? '' : info.label}
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
                                        <div className="relative flex justify-center">
                                            <Typography
                                                variant="body2"
                                                weight="bold"
                                                className="text-slate-850 dark:text-slate-200 select-none"
                                            >
                                                {(() => {
                                                    if (layout.dividerNames?.[r]) {
                                                        return layout.dividerNames[r];
                                                    }
                                                    // Find the category of seats below this divider
                                                    let categoryId = '';
                                                    for (let rowIdx = r + 1; rowIdx < rows; rowIdx++) {
                                                        if (dividerRows.includes(rowIdx)) {
                                                            break; // Stop at next divider
                                                        }
                                                        for (let colIdx = 0; colIdx < cols; colIdx++) {
                                                            const cell = layout.grid[`${rowIdx}_${colIdx}`];
                                                            if (cell?.category) {
                                                                categoryId = cell.category;
                                                                break;
                                                            }
                                                        }
                                                        if (categoryId) break;
                                                    }
                                                    if (categoryId) {
                                                        const cat = categories.find(c => c.id === categoryId);
                                                        if (cat) {
                                                            const priceStr = cat.price !== undefined ? `: ₹${cat.price.toFixed(2)}` : '';
                                                            return `${cat.name}${priceStr}`;
                                                        }
                                                    }
                                                    return 'Stage Divider';
                                                })()}
                                            </Typography>
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
