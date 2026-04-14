import React from 'react';

// --- Types ---
type ResponsiveValue<T> = T | {
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
};

// --- Grid Item ---
export interface GridItemProps {
    children?: React.ReactNode;
    /** How many columns to span across. 1-12 or 'full' */
    colSpan?: ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full'>;
    /** How many rows to span across. */
    rowSpan?: ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6>;
    /** Start position in grid */
    colStart?: ResponsiveValue<number | string>;
    /** Additional classes */
    className?: string;
}

const getResponsiveClasses = (
    propName: string,
    value: ResponsiveValue<any> | undefined,
    map?: Record<any, string>
) => {
    if (value === undefined) return '';

    if (typeof value !== 'object') {
        return map ? map[value] || '' : `${propName}-${value}`;
    }

    return Object.entries(value)
        .map(([breakpoint, val]) => {
            const prefix = breakpoint === 'sm' ? '' : `${breakpoint}:`;
            const className = map ? map[val as any] || '' : `${propName}-${val}`;
            if (!className) return '';
            return `${prefix}${className}`;
        })
        .filter(Boolean)
        .join(' ');
};

const GridItem: React.FC<GridItemProps> = ({
    children,
    colSpan,
    rowSpan,
    colStart,
    className = '',
}) => {
    const spanMap = {
        1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
        5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
        9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
        full: 'col-span-full',
    };

    const rowSpanMap = {
        1: 'row-span-1', 2: 'row-span-2', 3: 'row-span-3',
        4: 'row-span-4', 5: 'row-span-5', 6: 'row-span-6',
    };

    const classes = [
        getResponsiveClasses('col-span', colSpan, spanMap),
        getResponsiveClasses('row-span', rowSpan, rowSpanMap),
        getResponsiveClasses('col-start', colStart),
        className
    ].filter(Boolean).join(' ');

    return <div className={classes}>{children}</div>;
};

// --- Grid Container ---
export interface GridProps {
    children: React.ReactNode;
    /** Number of columns. 1-12 */
    cols?: ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>;
    /** Gap size (tailwind spacing scale) */
    gap?: ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>;
    /** Vertical Gap */
    gapY?: ResponsiveValue<number>;
    /** Horizontal Gap */
    gapX?: ResponsiveValue<number>;
    /** CSS Grid flow direction */
    flow?: 'row' | 'col' | 'row-dense' | 'col-dense';
    /** Align items */
    align?: 'start' | 'center' | 'end' | 'stretch';
    /** Justify items */
    justify?: 'start' | 'center' | 'end' | 'between';
    className?: string;
}

export const Grid: React.FC<GridProps> & { Item: typeof GridItem } = ({
    children,
    cols = 1,
    gap = 4,
    gapX,
    gapY,
    flow = 'row',
    align,
    justify,
    className = '',
}) => {
    const colsMap = {
        1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
        5: 'grid-cols-5', 6: 'grid-cols-6', 8: 'grid-cols-8', 10: 'grid-cols-10', 12: 'grid-cols-12',
    };

    const gapMap = {
        0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4',
        5: 'gap-5', 6: 'gap-6', 8: 'gap-8', 10: 'gap-10', 12: 'gap-12',
    };

    const classes = [
        'grid',
        getResponsiveClasses('grid-cols', cols, colsMap),
        gapX === undefined && gapY === undefined ? getResponsiveClasses('gap', gap, gapMap) : '',
        getResponsiveClasses('gap-x', gapX),
        getResponsiveClasses('gap-y', gapY),
        flow ? `grid-flow-${flow}` : '',
        align ? `items-${align}` : '',
        justify ? `justify-${justify}` : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

Grid.Item = GridItem;
