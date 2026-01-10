import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'glass' | 'dark';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    leftIcon,
    rightIcon,
    variant = 'default',
    rounded = 'lg',
    className = '',
    ...props
}, ref) => {
    const variantClasses = {
        default: 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500',
        glass: 'bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500',
        dark: 'bg-gray-900 border-gray-800 text-white focus:ring-blue-500',
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className={`text-sm font-medium ${variant === 'default' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full 
                        ${leftIcon ? 'pl-10' : 'px-3'} 
                        ${rightIcon ? 'pr-10' : 'px-3'} 
                        py-3 
                        border 
                        ${error ? 'border-red-500' : ''} 
                        ${roundedClasses[rounded]}
                        shadow-sm 
                        focus:outline-none 
                        focus:ring-2 
                        ${error ? 'focus:ring-red-500' : ''} 
                        focus:border-transparent 
                        transition-all 
                        duration-200 
                        ${variantClasses[variant]}
                        ${className}
                    `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
