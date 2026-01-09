import React from 'react';

export interface BadgeProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'sm' | 'md' | 'full';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    size = 'md',
    rounded = 'full',
    children,
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none';

    const variantStyles = {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        outline: 'bg-transparent border border-gray-300 text-gray-700',
        destructive: 'bg-red-100 text-red-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
    };

    const sizeStyles = {
        sm: 'text-[10px] px-1.5 py-0.5 min-w-[16px]',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
    };

    const roundedStyles = {
        sm: 'rounded',
        md: 'rounded-md',
        full: 'rounded-full',
    };

    return (
        <span
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${roundedStyles[rounded]}
                ${className}
            `}
        >
            {children}
        </span>
    );
};
