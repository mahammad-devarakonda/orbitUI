import React from 'react';

export type BoxProps<T extends React.ElementType = 'div'> = {
    /**
     * The component used for the root node.
     * Either a string to use a HTML element or a component.
     * @default 'div'
     */
    as?: T;
    className?: string;
    children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export const Box = React.forwardRef(<T extends React.ElementType = 'div'>(
    { as, className = '', children, ...props }: BoxProps<T>,
    ref: React.Ref<any>
) => {
    const Component = as || 'div';

    return (
        <Component ref={ref} className={className} {...props}>
            {children}
        </Component>
    );
});

Box.displayName = 'Box';
