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
    center?: boolean;
    fullScreen?: boolean;
    bgImage?: string;
    overlay?: boolean | string;
    glass?: boolean;
} & React.ComponentPropsWithoutRef<T>;

export const Box = React.forwardRef(<T extends React.ElementType = 'div'>(
    {
        as,
        className = '',
        children,
        center,
        fullScreen,
        bgImage,
        overlay,
        glass,
        style,
        ...props
    }: BoxProps<T>,
    ref: React.Ref<any>
) => {
    const Component = as || 'div';

    const baseClasses = [
        center ? 'flex items-center justify-center' : '',
        fullScreen ? 'min-h-screen w-full' : '',
        glass ? 'backdrop-blur-lg bg-black/40' : '',
        className
    ].filter(Boolean).join(' ');

    const combinedStyle: React.CSSProperties = {
        ...(bgImage ? {
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        } : {}),
        ...style
    };

    return (
        <Component ref={ref} className={`relative ${baseClasses}`} style={combinedStyle} {...props}>
            {overlay && (
                <div
                    className={`absolute inset-0 z-0 ${typeof overlay === 'string' ? '' : 'bg-black/70'}`}
                    style={typeof overlay === 'string' ? { backgroundColor: overlay } : {}}
                />
            )}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                {children}
            </div>
        </Component>
    );
});

Box.displayName = 'Box';
