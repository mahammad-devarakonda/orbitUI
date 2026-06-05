import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { LayoutData, SeatType, CellData, PricingCategory } from './types';
import { SeatLayoutEditorContext } from './context';
import type { SeatLayoutEditorContextType } from './context';
import { Toolbar } from './Toolbar';
import { EditorCanvas } from './EditorCanvas';
import { Stack } from '../Stack';

export const createDefaultLayout = (rows = 10, cols = 15): LayoutData => {
    const grid: Record<string, CellData> = {};
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[`${r}_${c}`] = { type: 'seat' };
        }
    }
    return {
        dimensions: { rows, cols },
        grid,
        dividerRows: [],
        dividerCols: [],
    };
};

const defaultCategories: PricingCategory[] = [
    { id: 'silver', name: 'Silver', color: 'bg-slate-300 dark:bg-slate-500' },
    { id: 'gold', name: 'Gold', color: 'bg-yellow-300 dark:bg-yellow-500' },
    { id: 'vip', name: 'VIP', color: 'bg-amber-400 dark:bg-amber-500' },
];

export interface SeatLayoutEditorProps {
    value?: LayoutData;
    onChange?: (value: LayoutData) => void;
    defaultValue?: LayoutData;
    readOnly?: boolean;
    className?: string;
    style?: React.CSSProperties;
    categories?: PricingCategory[];
}

export const SeatLayout: React.FC<SeatLayoutEditorProps> = ({
    value,
    onChange,
    defaultValue,
    readOnly = false,
    className = '',
    style,
    categories: categoriesProp
}) => {
    // Uncontrolled state fallback
    const [internalLayout, setInternalLayout] = useState<LayoutData>(() => {
        return defaultValue || createDefaultLayout(10, 15);
    });

    // The active layout is controlled if `value` is passed, else uncontrolled
    const layout = useMemo(() => {
        return value !== undefined ? value : internalLayout;
    }, [value, internalLayout]);

    const resolvedCategories = useMemo<PricingCategory[]>(() => {
        return layout.categories || categoriesProp || defaultCategories;
    }, [layout.categories, categoriesProp]);

    const [activeCategory, setActiveCategory] = useState<string>(() => {
        return resolvedCategories[0]?.id || '';
    });
    const [activeType, setActiveType] = useState<SeatType>('seat');
    const [selectedTool, setSelectedTool] = useState<'select' | 'paint' | 'erase'>('paint');

    // Sync active category if resolvedCategories change and active is no longer valid
    useEffect(() => {
        if (resolvedCategories.length > 0) {
            const isValid = resolvedCategories.some(c => c.id === activeCategory);
            if (!isValid) {
                setActiveCategory(resolvedCategories[0]?.id || '');
            }
        } else {
            setActiveCategory('');
        }
    }, [resolvedCategories, activeCategory]);

    // Dispatcher callback to sync layouts
    const handleLayoutChange = useCallback((newLayout: LayoutData) => {
        if (value === undefined) {
            setInternalLayout(newLayout);
        }
        if (onChange) {
            onChange(newLayout);
        }
    }, [value, onChange]);

    // Context Actions
    const updateCell = useCallback((row: number, col: number, data: Partial<CellData>) => {
        if (readOnly) return;
        const gridKey = `${row}_${col}`;
        const newGrid = {
            ...layout.grid,
            [gridKey]: {
                ...layout.grid[gridKey],
                ...data
            } as CellData
        };

        handleLayoutChange({
            ...layout,
            grid: newGrid
        });
    }, [layout, readOnly, handleLayoutChange]);

    const updateDimensions = useCallback((rows: number, cols: number) => {
        if (readOnly) return;
        const oldGrid = layout.grid;
        const newGrid: Record<string, CellData> = {};

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const key = `${r}_${c}`;
                newGrid[key] = oldGrid[key] || { type: 'seat' };
            }
        }

        const dividerRows = (layout.dividerRows || []).filter(r => r < rows);
        const dividerCols = (layout.dividerCols || []).filter(c => c < cols);

        handleLayoutChange({
            dimensions: { rows, cols },
            grid: newGrid,
            dividerRows,
            dividerCols
        });
    }, [layout, readOnly, handleLayoutChange]);

    const toggleDividerRow = useCallback((row: number) => {
        if (readOnly) return;
        const currentDividers = layout.dividerRows || [];
        let newDividers: number[];

        if (currentDividers.includes(row)) {
            newDividers = currentDividers.filter(r => r !== row);
        } else {
            newDividers = [...currentDividers, row].sort((a, b) => a - b);
        }

        handleLayoutChange({
            ...layout,
            dividerRows: newDividers
        });
    }, [layout, readOnly, handleLayoutChange]);

    const toggleDividerCol = useCallback((col: number) => {
        if (readOnly) return;
        const currentDividers = layout.dividerCols || [];
        let newDividers: number[];

        if (currentDividers.includes(col)) {
            newDividers = currentDividers.filter(c => c !== col);
        } else {
            newDividers = [...currentDividers, col].sort((a, b) => a - b);
        }

        handleLayoutChange({
            ...layout,
            dividerCols: newDividers
        });
    }, [layout, readOnly, handleLayoutChange]);

    const addCategory = useCallback((newCat: PricingCategory) => {
        if (readOnly) return;
        const currentCats = layout.categories || categoriesProp || defaultCategories;
        if (currentCats.some(c => c.id === newCat.id)) return;

        handleLayoutChange({
            ...layout,
            categories: [...currentCats, newCat]
        });
    }, [layout, categoriesProp, readOnly, handleLayoutChange]);

    const removeCategory = useCallback((catId: string) => {
        if (readOnly) return;
        const currentCats = layout.categories || categoriesProp || defaultCategories;
        const updatedCats = currentCats.filter(c => c.id !== catId);

        const newGrid = { ...layout.grid };
        Object.entries(newGrid).forEach(([key, cell]) => {
            if (cell.category === catId) {
                newGrid[key] = { ...cell, category: undefined };
            }
        });

        handleLayoutChange({
            ...layout,
            grid: newGrid,
            categories: updatedCats
        });
    }, [layout, categoriesProp, readOnly, handleLayoutChange]);

    const updateDividerName = useCallback((row: number, name: string) => {
        if (readOnly) return;
        const newNames = {
            ...(layout.dividerNames || {}),
            [row]: name
        };

        handleLayoutChange({
            ...layout,
            dividerNames: newNames
        });
    }, [layout, readOnly, handleLayoutChange]);

    const contextValue = useMemo<SeatLayoutEditorContextType>(() => ({
        layout,
        readOnly,
        activeCategory,
        activeType,
        categories: resolvedCategories,
        selectedTool,
        setSelectedTool,
        setActiveCategory,
        setActiveType,
        updateCell,
        updateDimensions,
        toggleDividerRow,
        toggleDividerCol,
        addCategory,
        removeCategory,
        updateDividerName
    }), [
        layout,
        readOnly,
        activeCategory,
        activeType,
        resolvedCategories,
        selectedTool,
        updateCell,
        updateDimensions,
        toggleDividerRow,
        toggleDividerCol,
        addCategory,
        removeCategory,
        updateDividerName
    ]);

    return (
        <SeatLayoutEditorContext.Provider value={contextValue}>
            <Stack
                direction="row"
                spacing={0}
                className={`bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden h-full w-full shadow-sm border border-slate-100 dark:border-slate-800 ${className}`}
                style={style}
            >
                <Toolbar />
                <div className="flex-1 bg-slate-50/30 dark:bg-slate-950/10 p-6 md:p-12 flex items-center justify-center overflow-hidden h-full">
                    <EditorCanvas />
                </div>
            </Stack>
        </SeatLayoutEditorContext.Provider>
    );
};
