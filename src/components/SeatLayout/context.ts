import { createContext, useContext } from 'react';
import type { LayoutData, SeatType, CellData, PricingCategory } from './types';

export interface SeatLayoutEditorContextType {
    layout: LayoutData;
    readOnly: boolean;
    activeCategory: string;
    activeType: SeatType;
    categories: PricingCategory[];
    setActiveCategory: (category: string) => void;
    setActiveType: (type: SeatType) => void;
    updateCell: (row: number, col: number, data: Partial<CellData>) => void;
    updateDimensions: (rows: number, cols: number) => void;
    toggleDividerRow: (row: number) => void;
    toggleDividerCol: (col: number) => void;
    addCategory: (category: PricingCategory) => void;
    removeCategory: (id: string) => void;
    updateDividerName: (row: number, name: string) => void;
}

export const SeatLayoutEditorContext = createContext<SeatLayoutEditorContextType | undefined>(undefined);

export const useSeatLayoutEditor = (): SeatLayoutEditorContextType => {
    const context = useContext(SeatLayoutEditorContext);
    if (!context) {
        throw new Error('useSeatLayoutEditor must be used within a SeatLayoutEditorProvider');
    }
    return context;
};
