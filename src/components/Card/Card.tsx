import React from 'react';

interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'transparent';
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    title,
    subtitle,
    children,
    footer,
    className = '',
    variant = 'default',
    noPadding = false,
}) => {
    const variantClasses = {
        default: 'bg-white border-gray-200 shadow-sm',
        glass: 'bg-black/40 backdrop-blur-lg border-gray-800 shadow-lg',
        transparent: 'bg-transparent border-none shadow-none',
    };

    return (
        <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${variantClasses[variant]} ${className}`}>
            {(title || subtitle) && (
                <div className={`px-6 py-4 border-b ${variant === 'glass' ? 'border-gray-800' : 'border-gray-100'}`}>
                    {title && (
                        <h3 className={`text-lg font-semibold ${variant === 'glass' ? 'text-white' : 'text-gray-900'}`}>
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className={`text-sm mt-1 ${variant === 'glass' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            <div className={noPadding ? '' : 'px-6 py-4'}>
                {children}
            </div>
            {footer && (
                <div className={`px-6 py-4 border-t ${variant === 'glass' ? 'bg-black/20 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};
