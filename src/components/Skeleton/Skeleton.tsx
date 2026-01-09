import React from 'react';

export interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className = '',
}) => {
    const baseStyles = 'animate-pulse bg-gray-200';

    const variantStyles = {
        text: 'rounded mt-1 mb-1',
        circular: 'rounded-full',
        rectangular: 'rounded-md',
    };

    const style = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${className}
            `}
            style={style}
        />
    );
};
