import React, { useMemo, useState } from 'react';
import type { LayoutData, PricingCategory } from './types';
import { SeatLayoutEditorContext } from './context';
import type { SeatLayoutEditorContextType } from './context';
import { EditorCanvas } from './EditorCanvas';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const defaultCategories: PricingCategory[] = [
    { id: 'silver', name: 'Silver', color: 'bg-slate-300 dark:bg-slate-500', price: 150 },
    { id: 'gold', name: 'Gold', color: 'bg-yellow-300 dark:bg-yellow-500', price: 250 },
    { id: 'vip', name: 'VIP', color: 'bg-amber-400 dark:bg-amber-500', price: 350 },
];

export interface SeatLayoutViewerProps {
    value: LayoutData;
    categories?: PricingCategory[];
    className?: string;
    style?: React.CSSProperties;
    selectable?: boolean;
    selectedSeats?: string[];
    bookedSeats?: string[];
    lockedSeats?: string[];
    onSeatClick?: (row: number, col: number) => void;
    width?: string | number;
    height?: string | number;
    canvasWidth?: string | number;
    canvasHeight?: string | number;
    showLegend?: boolean;
}

export const SeatLayoutViewer: React.FC<SeatLayoutViewerProps> = ({
    value: layout,
    categories: categoriesProp,
    className = '',
    style,
    selectable = false,
    selectedSeats = [],
    bookedSeats = [],
    lockedSeats = [],
    onSeatClick,
    width,
    height,
    canvasWidth,
    canvasHeight,
    showLegend = true,
}) => {
    const [zoom, setZoom] = useState(1);

    const resolvedCategories = useMemo<PricingCategory[]>(() => {
        return layout?.categories || categoriesProp || defaultCategories;
    }, [layout?.categories, categoriesProp]);

    const contextValue = useMemo<SeatLayoutEditorContextType>(() => ({
        layout: layout || { dimensions: { rows: 0, cols: 0 }, grid: {} },
        readOnly: true,
        activeCategory: '',
        activeType: 'seat',
        categories: resolvedCategories,
        selectedTool: 'paint',
        setSelectedTool: () => { },
        setActiveCategory: () => { },
        setActiveType: () => { },
        updateCell: () => { },
        updateDimensions: () => { },
        toggleDividerRow: () => { },
        toggleDividerCol: () => { },
        addCategory: () => { },
        removeCategory: () => { },
        updateDividerName: () => { },
        selectable,
        selectedSeats,
        bookedSeats,
        lockedSeats,
        onSeatClick,
        zoom,
        setZoom
    }), [layout, resolvedCategories, selectable, selectedSeats, bookedSeats, lockedSeats, onSeatClick, zoom, setZoom]);

    if (!layout) {
        return (
            <div
                className={`flex items-center justify-center w-full h-full p-12 text-slate-450 dark:text-slate-500 animate-pulse ${className}`}
                style={{ width, height, ...style }}
            >
                Loading layout...
            </div>
        );
    }

    return (
        <SeatLayoutEditorContext.Provider value={contextValue}>
            <div
                className={`flex flex-col items-center justify-center w-full h-full overflow-hidden ${className}`}
                style={{ width, height, ...style }}
            >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-0">
                    <EditorCanvas width={canvasWidth} height={canvasHeight} />
                </div>
                {showLegend && (
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-4 mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-6 py-2.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm select-none shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                                <span>Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-green-400 border border-green-500"></div>
                                <span>Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-zinc-700 border border-zinc-500 opacity-40"></div>
                                <span>Sold Out</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                                disabled={zoom <= 0.5}
                                className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut size={14} />
                            </button>
                            <span className="text-[10px] font-black text-slate-650 dark:text-slate-350 min-w-[28px] text-center tracking-tighter">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                                disabled={zoom >= 2}
                                className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn size={14} />
                            </button>
                            <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800 mx-0.5" />
                            <button
                                onClick={() => setZoom(1)}
                                className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer transition-colors"
                                title="Reset Zoom"
                            >
                                <Maximize2 size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </SeatLayoutEditorContext.Provider>
    );
};
