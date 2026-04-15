import React, { useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'glass' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    shadow?: boolean;
    focusRing?: boolean;
    focusRingColor?: string;
    containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    rounded = 'lg',
    className = '',
    containerClassName = '',
    id: providedId,
    disabled,
    required,
    ...props
}, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const variantClasses = {
        default: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-500 dark:disabled:text-gray-500 disabled:border-gray-200 dark:disabled:border-gray-800',
        glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/40 focus:ring-white/40 focus:border-white/40 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30',
        dark: 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-600 disabled:bg-gray-900 disabled:text-gray-600 disabled:border-gray-800',
    };

    const sizeClasses = {
        sm: {
            input: 'py-2 px-3 text-sm',
            icon: 'h-4 w-4',
            iconPadding: 'pl-9 pr-9',
            spacing: 'gap-1'
        },
        md: {
            input: 'py-2.5 px-4 text-base',
            icon: 'h-5 w-5',
            iconPadding: 'pl-11 pr-11',
            spacing: 'gap-1.5'
        },
        lg: {
            input: 'py-3.5 px-5 text-lg',
            icon: 'h-6 w-6',
            iconPadding: 'pl-14 pr-14',
            spacing: 'gap-2'
        }
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const activeSize = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;

    const renderIcon = (icon: React.ReactNode, position: 'left' | 'right') => {
        if (!icon) return null;
        
        const alignmentClass = position === 'left' ? 'left-0 pl-3.5' : 'right-0 pr-3.5';
        const focusColorClass = variant === 'default' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-white';
        const baseColorClass = variant === 'default' ? 'text-gray-400' : 'text-gray-500';

        return (
            <div className={`absolute inset-y-0 ${alignmentClass} flex items-center pointer-events-none transition-colors duration-200 ${baseColorClass} ${focusColorClass}`}>
                {React.isValidElement<{ className?: string }>(icon) 
                    ? React.cloneElement(icon, { 
                        className: `${icon.props.className || ''} ${activeSize.icon}`.trim() 
                      }) 
                    : icon}
            </div>
        );
    };

    return (
        <div className={`flex flex-col w-full ${activeSize.spacing} ${containerClassName}`}>
            {label && (
                <label 
                    htmlFor={id}
                    className={`text-sm font-semibold tracking-tight ${variant === 'default' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-200'} ${disabled ? 'opacity-50' : ''}`}
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative group">
                {renderIcon(leftIcon, 'left')}
                
                <input
                    ref={ref}
                    id={id}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() || undefined}
                    className={`
                        w-full 
                        ${leftIcon ? activeSize.iconPadding.split(' ')[0] : (size === 'sm' ? 'pl-3' : 'pl-4')} 
                        ${rightIcon ? activeSize.iconPadding.split(' ')[1] : (size === 'sm' ? 'pr-3' : 'pr-4')} 
                        ${activeSize.input}
                        border 
                        ${error ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500' : ''} 
                        ${roundedClasses[rounded]}
                        ${props.shadow ? 'shadow-sm' : ''}
                        focus:outline-none 
                        ${props.focusRing ? 'focus:ring-2' : ''}
                        transition-all 
                        duration-200 
                        ${variantClasses[variant as keyof typeof variantClasses]}
                        ${className}
                    `}
                    style={props.focusRingColor ? { '--tw-ring-color': props.focusRingColor } as React.CSSProperties : undefined}
                    {...props}
                />

                {renderIcon(rightIcon, 'right')}
            </div>

            {error && (
                <p id={errorId} className="text-xs font-medium text-red-500 flex items-center gap-1">
                    <span className="shrink-0">⚠️</span>
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={helperId} className={`text-xs ${variant === 'default' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
