export type SeatType = 'seat' | 'aisle' | 'empty' | 'wheelchair' | 'blocked' | 'damaged';

export interface CellData {
    id?: string;
    type: SeatType;
    category?: string;
}

export interface LayoutDimensions {
    rows: number;
    cols: number;
}

export interface LayoutData {
    dimensions: LayoutDimensions;
    grid: Record<string, CellData>; // key: "row_col"
    dividerRows?: number[];
    dividerCols?: number[];
    dividerNames?: Record<number, string>;
    categories?: PricingCategory[];
}

export interface PricingCategory {
    id: string;
    name: string;
    color: string;
}
