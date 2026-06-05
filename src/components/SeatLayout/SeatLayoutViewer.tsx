import React, { useMemo } from 'react';
import type { LayoutData, PricingCategory } from './types';
import { SeatLayoutEditorContext } from './context';
import type { SeatLayoutEditorContextType } from './context';
import { EditorCanvas } from './EditorCanvas';

const defaultCategories: PricingCategory[] = [
    { id: 'silver', name: 'Silver', color: 'bg-slate-300 dark:bg-slate-500' },
    { id: 'gold', name: 'Gold', color: 'bg-yellow-300 dark:bg-yellow-500' },
    { id: 'vip', name: 'VIP', color: 'bg-amber-400 dark:bg-amber-500' },
];

export interface SeatLayoutViewerProps {
    value: LayoutData;
    categories?: PricingCategory[];
    className?: string;
    style?: React.CSSProperties;
}

export const SeatLayoutViewer: React.FC<SeatLayoutViewerProps> = ({
    value: layout,
    categories: categoriesProp,
    className = '',
    style,
}) => {
    const resolvedCategories = useMemo<PricingCategory[]>(() => {
        return layout.categories || categoriesProp || defaultCategories;
    }, [layout.categories, categoriesProp]);

    const contextValue = useMemo<SeatLayoutEditorContextType>(() => ({
        layout,
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
        updateDividerName: () => { }
    }), [layout, resolvedCategories]);

    return (
        <SeatLayoutEditorContext.Provider value={contextValue}>
            <div
                className={`flex items-center justify-center w-full h-full overflow-hidden ${className}`}
                style={style}
            >
                <EditorCanvas />
            </div>
        </SeatLayoutEditorContext.Provider>
    );
};
