import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'link' | 'ghost' | 'gradient';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    gradient?: string;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    rounded = 'full',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    disabled,
    gradient,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:pointer-events-none transition-colors duration-150';

    const variantStyles: Record<string, string> = {
        primary: 'bg-[#0070f3] text-white hover:bg-[#0060df] border border-transparent',
        secondary: 'bg-transparent text-[#0070f3] border border-[#0070f3] hover:bg-blue-50', // White with Blue Border
        tertiary: 'bg-transparent text-[#0070f3] border border-gray-300 hover:border-gray-400 hover:bg-gray-50', // White with Gray Border
        danger: 'bg-[#c23b22] text-white hover:bg-[#a0301b] border border-transparent', // Burnt Orange/Red
        link: 'bg-transparent text-[#0070f3] hover:underline px-0 py-0 h-auto border-none', // Text only
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent', // Transparent with hover bg
        gradient: `text-white border-none hover:opacity-90 active:scale-95 ${gradient || 'bg-gradient-to-r from-red-500 to-pink-500'}`,
    };

    const sizeStyles = {
        sm: 'px-4 py-1.5 text-xs gap-1.5 min-w-[80px]',
        md: 'px-6 py-2.5 text-sm gap-2 min-w-[100px]',
        lg: 'px-8 py-3.5 text-lg gap-2 min-w-[120px]',
        icon: 'w-10 h-10 p-0 min-w-0',
    };

    const roundedStyles = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${widthStyle} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span className="truncate">{isLoading ? 'Loading...' : children}</span>
            {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    );
};
