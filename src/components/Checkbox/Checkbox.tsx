import React, { useRef, useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
    /** Label text or React element */
    label?: React.ReactNode;
    /** Controlled checked state */
    checked?: boolean;
    /** Indeterminate checked state */
    indeterminate?: boolean;
    /** Callback triggered when checked status changes */
    onChange?: (checked: boolean) => void;
    /** Error message to show helper text */
    error?: string;
    /** Design visual theme variant */
    variant?: 'default' | 'glass' | 'dark';
    /** Theme color for check fill */
    colorTheme?: 'blue' | 'indigo' | 'purple' | 'green' | 'rose';
    /** Checkbox size selection */
    size?: 'sm' | 'md' | 'lg';
    /** Extra styling class for outer wrapper */
    className?: string;
    /** Extra styling class for label string */
    labelClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
    label,
    checked = false,
    indeterminate = false,
    onChange,
    error,
    variant = 'default',
    colorTheme = 'indigo',
    size = 'md',
    className = '',
    labelClassName = '',
    disabled = false,
    id: providedId,
    ...props
}, ref) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = React.useId();
    const id = providedId || generatedId;

    // Assign refs correctly
    const setRefs = (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
    };

    // Keep native input indeterminate flag in sync
    useEffect(() => {
        if (internalRef.current) {
            internalRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    // Color definitions
    const themeFills = {
        blue: 'bg-blue-600 border-blue-600 text-white focus:ring-blue-500/20',
        indigo: 'bg-indigo-600 border-indigo-600 text-white focus:ring-indigo-500/20',
        purple: 'bg-purple-650 border-purple-650 text-white focus:ring-purple-500/20',
        green: 'bg-green-600 border-green-600 text-white focus:ring-green-500/20',
        rose: 'bg-rose-600 border-rose-600 text-white focus:ring-rose-500/20',
    };

    const variantBorders = {
        default: 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-650',
        glass: 'border-white/20 bg-white/5 text-white hover:bg-white/10',
        dark: 'border-gray-700 bg-gray-900 text-white hover:border-gray-600',
    };

    const sizeClasses = {
        sm: {
            box: 'w-4 h-4 rounded',
            strokeWidth: 3.5,
            text: 'text-xs',
            wrapper: 'gap-2',
        },
        md: {
            box: 'w-5 h-5 rounded-md',
            strokeWidth: 3.0,
            text: 'text-sm',
            wrapper: 'gap-2.5',
        },
        lg: {
            box: 'w-6 h-6 rounded-md',
            strokeWidth: 2.5,
            text: 'text-base',
            wrapper: 'gap-3',
        },
    };

    const activeSize = sizeClasses[size] || sizeClasses.md;
    const isChecked = checked || indeterminate;

    // Framer motion variants
    const checkVariants: Variants = {
        checked: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.2, ease: 'easeOut' }
        },
        unchecked: {
            pathLength: 0,
            opacity: 0,
            transition: { duration: 0.15 }
        }
    };

    return (
        <div className={cn('flex flex-col items-start', className)}>
            <label
                htmlFor={id}
                className={cn(
                    'inline-flex items-center select-none cursor-pointer',
                    disabled && 'opacity-50 cursor-not-allowed',
                    activeSize.wrapper
                )}
            >
                {/* Hidden Native Input */}
                <input
                    id={id}
                    ref={setRefs}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={handleCheckboxChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="sr-only"
                    aria-invalid={!!error}
                    {...props}
                />

                {/* Custom Box Styled Wrapper */}
                <motion.div
                    whileHover={!disabled ? { scale: 1.05 } : undefined}
                    whileTap={!disabled ? { scale: 0.95 } : undefined}
                    className={cn(
                        'flex items-center justify-center border border-solid transition-colors duration-150',
                        activeSize.box,
                        isChecked ? themeFills[colorTheme] : variantBorders[variant],
                        isFocused && 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900',
                        error && 'border-red-500 dark:border-red-500/80 ring-red-500/20'
                    )}
                >
                    {/* Check / Indeterminate SVG Checkmark */}
                    {isChecked && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={activeSize.strokeWidth}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4/5 h-4/5"
                        >
                            {indeterminate ? (
                                // Horizontal dash line
                                <motion.path
                                    d="M5 12h14"
                                    initial="unchecked"
                                    animate="checked"
                                    variants={checkVariants}
                                />
                            ) : (
                                // Standard Checkmark
                                <motion.path
                                    d="M20 6L9 17L4 12"
                                    initial="unchecked"
                                    animate="checked"
                                    variants={checkVariants}
                                />
                            )}
                        </svg>
                    )}
                </motion.div>

                {/* Label text */}
                {label && (
                    <span className={cn(
                        'font-medium transition-colors',
                        variant === 'glass' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300',
                        activeSize.text,
                        labelClassName
                    )}>
                        {label}
                    </span>
                )}
            </label>

            {/* Error Message */}
            {error && (
                <span className="text-xs text-red-500 mt-1 pl-7 flex items-center gap-1 font-medium">
                    ⚠️ {error}
                </span>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';
