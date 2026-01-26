import React, { Children, isValidElement } from 'react';

export type StackProps<T extends React.ElementType = 'div'> = {
    /**
     * The component used for the root node.
     * Either a string to use a HTML element or a component.
     * @default 'div'
     */
    as?: T;
    /**
     * The direction of the stack.
     * @default 'column'
     */
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    /**
     * The spacing between children. 
     * If a number is provided, it is treated as a tailwind gap class suffix (e.g. 4 -> gap-4).
     * If a string is provided, it is used as a custom gap style if it's a valid CSS length, 
     * otherwise it's assumed to be a class.
     * @default 0
     */
    spacing?: number | string;
    /**
     * If true, the flexbox will wrap.
     * @default false
     */
    wrap?: boolean;
    /**
     * Add an element between each child.
     */
    divider?: React.ReactNode;
    /**
     * Align items along the cross axis.
     */
    alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    /**
     * Justify content along the main axis.
     */
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    className?: string;
    children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export const Stack = React.forwardRef(<T extends React.ElementType = 'div'>(
    {
        as,
        children,
        direction = 'column',
        spacing = 0,
        wrap = false,
        divider,
        alignItems,
        justifyContent,
        className = '',
        style,
        ...props
    }: StackProps<T>,
    ref: React.Ref<any>
) => {
    const Component = as || 'div';

    const directionMap = {
        'row': 'flex-row',
        'row-reverse': 'flex-row-reverse',
        'column': 'flex-col',
        'column-reverse': 'flex-col-reverse',
    };

    const alignMap = {
        'start': 'items-start',
        'center': 'items-center',
        'end': 'items-end',
        'stretch': 'items-stretch',
        'baseline': 'items-baseline',
    };

    const justifyMap = {
        'start': 'justify-start',
        'center': 'justify-center',
        'end': 'justify-end',
        'between': 'justify-between',
        'around': 'justify-around',
        'evenly': 'justify-evenly',
    };

    let gapClass = '';
    let customStyle = { ...style };

    if (typeof spacing === 'number') {
        gapClass = `gap-${spacing}`;
    } else if (typeof spacing === 'string') {
        // Simple heuristic: if it contains styling units or calc, treat as style, else class
        if (spacing.match(/^(?:\d+(?:px|rem|em|%)|calc|var)/)) {
            customStyle.gap = spacing;
        } else {
            gapClass = spacing; // Assume it's a full class like 'gap-x-4'
        }
    }

    const classes = [
        'flex',
        directionMap[direction],
        wrap ? 'flex-wrap' : 'flex-nowrap',
        alignItems ? alignMap[alignItems] : '',
        justifyContent ? justifyMap[justifyContent] : '',
        gapClass,
        className
    ].filter(Boolean).join(' ');

    const validChildren = Children.toArray(children).filter(isValidElement);

    return (
        <Component ref={ref} className={classes} style={customStyle} {...props}>
            {divider
                ? validChildren.map((child, index) => (
                    <React.Fragment key={index}>
                        {child}
                        {index < validChildren.length - 1 && divider}
                    </React.Fragment>
                ))
                : children
            }
        </Component>
    );
});

Stack.displayName = 'Stack';
