import React, { useCallback } from 'react';
import { useSeatLayoutEditor } from './context';
import type { CellData } from './types';
import SeatCell from './SeatCell';
import { Typography } from '../Typography/Typography';
import { Stack } from '../Stack';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export interface EditorCanvasProps {
    readOnly?: boolean;
    width?: string | number;
    height?: string | number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ readOnly: propReadOnly, width, height }) => {
    const {
        layout,
        readOnly: contextReadOnly,
        activeCategory,
        activeType,
        selectedTool,
        updateCell,
        toggleDividerRow,
        toggleDividerCol,
        categories,
        zoom: contextZoom,
        setZoom: contextSetZoom
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
                <Typography variant="body2" className="text-slate-450 dark:text-slate-500 animate-pulse">
                    Initializing layout...
                </Typography>
            </Stack>
        );
    }

    const { rows, cols } = layout.dimensions;
    const dividerRows = layout.dividerRows || [];
    const dividerCols = layout.dividerCols || [];

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

    // Dynamic Sizing calculations using ResizeObserver
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [baseSeatSize, setBaseSeatSize] = React.useState(32);
    const [localZoom, localSetZoom] = React.useState(1);
    const zoom = contextZoom !== undefined ? contextZoom : localZoom;
    const setZoom = contextSetZoom !== undefined ? contextSetZoom : localSetZoom;

    const isConstrained = height !== undefined || width !== undefined;

    React.useEffect(() => {
        const element = containerRef.current;
        if (!element || !isConstrained) {
            setBaseSeatSize(32);
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const availableWidth = entry.contentRect.width;
                const availableHeight = entry.contentRect.height;

                const numDividerCols = dividerCols.length;
                const numNormalCols = cols - numDividerCols;

                let gapSize = 12;
                if (availableWidth < 400 || availableHeight < 300) {
                    gapSize = 4;
                } else if (availableWidth < 600 || availableHeight < 450) {
                    gapSize = 8;
                }

                const colFactors = numNormalCols + 0.5 * numDividerCols + 1;
                const maxSWidth = colFactors > 0
                    ? (availableWidth - 64 - gapSize * (cols - 1)) / colFactors
                    : 32;

                const maxSHeight = rows > 0
                    ? (availableHeight - 72 - gapSize * rows - (firstCat ? 28 : 0)) / rows
                    : 32;

                const calculatedSize = Math.max(12, Math.min(48, Math.min(maxSWidth, maxSHeight)));
                setBaseSeatSize(calculatedSize);
            }
        });

        resizeObserver.observe(element);
        return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        };
    }, [isConstrained, height, width, cols, rows, dividerCols.length, dividerRows.length, !!firstCat]);

    const seatSize = Math.round(baseSeatSize * zoom);

    const gapSize = seatSize < 20 ? 4 : seatSize < 28 ? 8 : 12;

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

    // Define grid column widths dynamically: dividers are half the seatSize wide
    const colWidths = Array.from({ length: cols }).map((_, c) => {
        return dividerCols.includes(c) ? `${seatSize / 2}px` : `${seatSize}px`;
    }).join(' ');

    return (
        <Stack
            ref={containerRef}
            alignItems="center"
            className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl/40 overflow-auto w-full no-scrollbar ${isConstrained ? 'p-3 md:p-4' : 'p-6 md:p-10'
                }`}
            style={{
                maxHeight: height !== undefined ? height : '600px',
                width: width !== undefined ? width : '100%',
                height: height !== undefined ? height : 'auto',
            }}
        >
            <div className="relative group p-4 min-w-max flex flex-col items-center justify-center">
                {firstCat && (
                    <div className="flex justify-center mb-2" style={{ marginLeft: `${seatSize + 16}px` }}>
                        <span
                            className="text-slate-855 dark:text-slate-200 select-none font-bold"
                            style={{ fontSize: `${Math.max(8, Math.min(14, seatSize * 0.38))}px` }}
                        >
                            {firstCat.name}{firstCat.price !== undefined ? `: ₹${firstCat.price.toFixed(2)}` : ''}
                        </span>
                    </div>
                )}


                {/* Column Headers */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: colWidths,
                        gap: `${gapSize}px`,
                        marginBottom: `${gapSize}px`,
                        marginLeft: `${seatSize + 16}px`,
                    }}
                >
                    {colLabels.map((info, c) => (
                        <div key={`col_${c}`} className="flex items-center justify-center relative group/col-header h-6" style={{ height: `${seatSize * 0.75}px` }}>
                            {info.isDivider ? (
                                <span onClick={() => handleToggleDividerCol(c)} className="cursor-pointer">
                                    <span
                                        className="text-[10px] tracking-tighter text-purple-500 hover:text-purple-700 transition-colors select-none font-extrabold uppercase"
                                        style={{ fontSize: `${Math.max(6, Math.min(10, seatSize * 0.3))}px` }}
                                    >
                                        {info.label}
                                    </span>
                                </span>
                            ) : (
                                <span
                                    className="text-[10px] tracking-tighter text-slate-300 dark:text-slate-600 select-none font-extrabold"
                                    style={{ fontSize: `${Math.max(6, Math.min(10, seatSize * 0.3))}px` }}
                                >
                                    {info.label}
                                </span>
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
                    <div className="flex flex-col mr-4" style={{ gap: `${gapSize}px`, width: `${seatSize}px` }}>
                        {rowLabels.map((info, r) => (
                            <div key={`row_${r}`} className="flex items-center justify-end" style={{ height: `${seatSize}px` }}>
                                <span
                                    className="text-[10px] text-slate-300 dark:text-slate-600 select-none font-extrabold"
                                    style={{ fontSize: `${Math.max(6, Math.min(10, seatSize * 0.3))}px` }}
                                >
                                    {info.isDivider ? '' : info.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Container */}
                    <div
                        className="grid p-1"
                        style={{
                            gridTemplateColumns: colWidths,
                            gap: `${gapSize}px`,
                        }}
                    >
                        {Array.from({ length: rows }).flatMap((_, r) => {
                            const isRowDivider = dividerRows.includes(r);
                            if (isRowDivider) {
                                return [
                                    <div
                                        key={`divider_row_${r}`}
                                        className="flex items-center justify-center relative group/divider"
                                        style={{ gridColumn: `span ${cols}`, height: `${seatSize}px` }}
                                    >
                                        <div className="relative flex justify-center">
                                            <span
                                                className="text-slate-855 dark:text-slate-200 select-none font-bold"
                                                style={{ fontSize: `${Math.max(7, Math.min(12, seatSize * 0.35))}px` }}
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
                                            </span>
                                        </div>
                                        {!readOnly && (
                                            <button
                                                onClick={() => handleToggleDividerRow(r)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900 transition-all opacity-0 group-hover/divider:opacity-100 cursor-pointer shadow-sm z-10"
                                                style={{ fontSize: `${Math.max(6, Math.min(9, seatSize * 0.28))}px`, padding: `${Math.max(2, seatSize * 0.05)}px ${Math.max(4, seatSize * 0.1)}px` }}
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
                                            className="w-full flex items-center justify-center relative group/col-divider"
                                            style={{ height: `${seatSize}px` }}
                                        >
                                            {!readOnly && (
                                                <div className="h-full border-l-2 border-dashed border-slate-200 dark:border-slate-800 group-hover/col-divider:border-purple-300 dark:group-hover/col-divider:border-purple-800 transition-colors" />
                                            )}
                                            {!readOnly && (
                                                <button
                                                    onClick={() => handleToggleDividerCol(c)}
                                                    className="absolute bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-500 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900 transition-all opacity-0 group-hover/col-divider:opacity-100 cursor-pointer shadow-sm z-10"
                                                    style={{ fontSize: `${Math.max(6, Math.min(8, seatSize * 0.25))}px`, padding: `${Math.max(1, seatSize * 0.03)}px ${Math.max(3, seatSize * 0.08)}px` }}
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
                                        seatSize={seatSize}
                                    />
                                );
                            });
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 w-full max-w-md select-none shrink-0">
                <div className="w-full relative h-10 flex items-center justify-center">
                    <svg
                        className="w-full h-full absolute inset-0 overflow-visible"
                        viewBox="0 0 400 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="15%" stopColor="#818cf8" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#c084fc" />
                                <stop offset="85%" stopColor="#818cf8" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        {/* Soft projection glow */}
                        <path
                            d="M 10,5 Q 200,25 390,5"
                            fill="none"
                            stroke="url(#screenGrad)"
                            strokeWidth="6"
                            opacity="0.2"
                            strokeLinecap="round"
                        />
                        {/* Main screen curve */}
                        <path
                            d="M 10,5 Q 200,25 390,5"
                            fill="none"
                            stroke="url(#screenGrad)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="text-[10px] tracking-[0.4em] font-extrabold uppercase text-slate-400 dark:text-slate-500 mt-6 relative z-10">
                        SCREEN
                    </span>
                </div>
            </div>

            {/* Zoom Controls */}
            {!readOnly && (
                <div className="absolute bottom-4 right-4 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-1.5 shadow-lg gap-1 z-20 transition-all select-none">
                    <button
                        onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                        disabled={zoom <= 0.5}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-[10px] font-black text-slate-650 dark:text-slate-350 min-w-[32px] text-center tracking-tighter">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                        disabled={zoom >= 2}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn size={16} />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                    <button
                        onClick={() => setZoom(1)}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer transition-colors"
                        title="Reset Zoom"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            )}
        </Stack>
    );
};

export default EditorCanvas;
