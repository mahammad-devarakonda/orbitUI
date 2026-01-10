import React from 'react';

export interface TypographyProps {
    /** The visual style variation */
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
    /** The semantic HTML element to render */
    component?: React.ElementType;
    children: React.ReactNode;
    /** Font weight */
    weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    /** Text alignment */
    align?: 'left' | 'center' | 'right' | 'justify';
    /** Text color class (e.g., text-gray-500) */
    color?: string;
    className?: string;
    /** Truncate text with ellipsis if it overflows */
    noWrap?: boolean;
    /** Use a gradient for the text */
    gradient?: boolean | string;
}

export const Typography: React.FC<TypographyProps> = ({
    variant = 'body1',
    component,
    children,
    weight,
    align = 'left',
    color,
    className = '',
    noWrap = false,
    gradient,
}) => {
    // Default element mapping logic
    const defaultComponents: Record<string, React.ElementType> = {
        h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
        body1: 'p', body2: 'p', caption: 'span', overline: 'span',
    };

    const Component = component || defaultComponents[variant] || 'p';

    // Style Definitions
    const variantStyles = {
        h1: 'text-5xl md:text-6xl tracking-tight leading-tight',
        h2: 'text-4xl md:text-5xl tracking-tight leading-tight',
        h3: 'text-3xl md:text-4xl tracking-tight',
        h4: 'text-2xl md:text-3xl tracking-tight',
        h5: 'text-xl md:text-2xl tracking-normal',
        h6: 'text-lg md:text-xl tracking-normal',
        body1: 'text-base md:text-lg leading-relaxed',
        body2: 'text-sm md:text-base leading-relaxed',
        caption: 'text-xs md:text-sm text-gray-500',
        overline: 'text-xs uppercase tracking-widest font-semibold',
    };

    // Default weights per variant if not overridden
    const defaultWeights = {
        h1: 'font-extrabold',
        h2: 'font-bold',
        h3: 'font-bold',
        h4: 'font-bold',
        h5: 'font-semibold',
        h6: 'font-semibold',
        body1: 'font-normal',
        body2: 'font-normal',
        caption: 'font-normal',
        overline: 'font-bold',
    };

    const weightMap = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
    };

    const alignMap = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
    };

    // Construct class string
    const variantClass = variantStyles[variant];
    const weightClass = weight ? weightMap[weight] : defaultWeights[variant];
    const alignClass = alignMap[align];

    let colorClass = color || (variant === 'caption' ? 'text-gray-500' : 'text-gray-900');

    if (gradient) {
        const gradientClass = typeof gradient === 'string'
            ? gradient
            : 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500';
        colorClass = `${gradientClass} text-transparent bg-clip-text`;
    }

    const wrapClass = noWrap ? 'truncate' : '';

    const finalClasses = [
        variantClass,
        weightClass,
        alignClass,
        colorClass,
        wrapClass,
        className
    ].filter(Boolean).join(' ');

    return (
        <Component className={finalClasses}>
            {children}
        </Component>
    );
};
