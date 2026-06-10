import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'onInput'> {
    /** The search value (controlled mode) */
    value?: string;
    /** Callback triggered when search value changes (debounced) */
    onChange?: (value: string) => void;
    /** Callback triggered immediately on typing (non-debounced) */
    onInput?: (value: string) => void;
    /** Immediate callback when Enter is pressed or search button is clicked */
    onSearch?: (value: string) => void;
    /** Debounce interval in milliseconds */
    debounceMs?: number;
    /** Visual theme variant */
    variant?: 'default' | 'glass' | 'dark';
    /** Sizing options */
    size?: 'sm' | 'md' | 'lg';
    /** Rounded border configurations */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /** Displays a loading spinner on the right side */
    loading?: boolean;
    /** Callback when the clear button is clicked */
    onClear?: () => void;
    /** Whether to show a dedicated search action button on the right */
    showSearchButton?: boolean;
    /** Custom class for the container element */
    containerClassName?: string;
    /** Custom search icon. Pass null to hide the left icon. */
    searchIcon?: React.ReactNode;
    /** Custom clear icon. */
    clearIcon?: React.ReactNode;
    /** Custom class specifically for the input element */
    inputClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({
    value,
    onChange,
    onInput,
    onSearch,
    debounceMs = 300,
    variant = 'default',
    size = 'md',
    rounded = 'lg',
    loading = false,
    onClear,
    showSearchButton = false,
    placeholder = 'Search...',
    className = '',
    containerClassName = '',
    inputClassName = '',
    disabled = false,
    searchIcon,
    clearIcon,
    ...props
}, ref) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [prevValue, setPrevValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync state when controlled value prop changes
    if (value !== prevValue) {
        setPrevValue(value);
        setLocalValue(value || '');
    }

    // Clear active timer when controlled value changes
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, [value]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const triggerChange = (val: string) => {
        if (onChange) {
            onChange(val);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalValue(val);

        if (onInput) {
            onInput(val);
        }

        // Setup debounce
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            triggerChange(val);
        }, debounceMs);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Cancel pending debounce
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            // Trigger callbacks immediately
            triggerChange(localValue);
            if (onSearch) {
                onSearch(localValue);
            }
        }
    };

    const handleClear = () => {
        setLocalValue('');
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        triggerChange('');
        if (onClear) {
            onClear();
        }
    };

    const handleSearchClick = () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        triggerChange(localValue);
        if (onSearch) {
            onSearch(localValue);
        }
    };

    const variantClasses = {
        default: 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-400 dark:hover:border-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-950',
        dark: 'bg-gray-950 border-gray-800 text-slate-100 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-gray-700 disabled:bg-gray-900',
        glass: 'bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/10 text-white placeholder:text-white/40 dark:placeholder:text-white/30 focus:border-white/40 focus:ring-4 focus:ring-white/5 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30',
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const sizeClasses = {
        sm: {
            container: 'h-9 text-sm',
            paddingLeft: 'pl-8',
            paddingRight: 'pr-8',
            paddingY: 'py-1.5',
            leftIcon: 'left-2.5 h-4 w-4',
            rightIcon: 'right-2.5 h-4 w-4',
            button: 'px-3 text-xs',
        },
        md: {
            container: 'h-11 text-base',
            paddingLeft: 'pl-10',
            paddingRight: 'pr-10',
            paddingY: 'py-2.5',
            leftIcon: 'left-3.5 h-5 w-5',
            rightIcon: 'right-3.5 h-5 w-5',
            button: 'px-4 text-sm',
        },
        lg: {
            container: 'h-13 text-lg',
            paddingLeft: 'pl-12',
            paddingRight: 'pr-12',
            paddingY: 'py-3.5',
            leftIcon: 'left-4 h-6 w-6',
            rightIcon: 'right-4 h-6 w-6',
            button: 'px-5 text-base',
        },
    };

    const activeSize = sizeClasses[size] || sizeClasses.md;

    return (
        <motion.div
            animate={{
                boxShadow: isFocused
                    ? (variant === 'glass' ? '0 0 25px 3px rgba(255, 255, 255, 0.15)' : '0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.15)')
                    : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
            transition={{ duration: 0.25 }}
            className={cn('relative flex items-stretch w-full transition-all duration-300', activeSize.container, containerClassName)}
        >
            <div className="relative flex-grow flex items-center">
                {/* Left Search Icon */}
                {searchIcon !== null && (
                    <div className={cn(
                        'absolute pointer-events-none flex items-center transition-colors duration-200',
                        isFocused ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500',
                        activeSize.leftIcon
                    )}>
                        {searchIcon || <Search className="w-full h-full" />}
                    </div>
                )}

                {/* Input element */}
                <input
                    ref={ref}
                    type="text"
                    value={localValue}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                        setIsFocused(true);
                        if (props.onFocus) props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        if (props.onBlur) props.onBlur(e);
                    }}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={cn(
                        'w-full h-full border border-solid outline-none transition-all duration-200',
                        searchIcon === null
                            ? (size === 'sm' ? 'pl-3' : 'pl-4')
                            : activeSize.paddingLeft,
                        activeSize.paddingRight,
                        activeSize.paddingY,
                        variantClasses[variant as keyof typeof variantClasses],
                        roundedClasses[rounded],
                        // If showing search button, make the right border flat to join
                        showSearchButton && 'rounded-r-none border-r-0',
                        inputClassName,
                        className
                    )}
                    {...props}
                />

                {/* Right Area: Spinner or Clear Button */}
                <div className={cn('absolute flex items-center gap-1.5', activeSize.rightIcon)}>
                    {loading ? (
                        <Loader2 className="animate-spin text-gray-400 w-full h-full" />
                    ) : (
                        localValue && !disabled && (
                            <motion.button
                                whileHover={{ scale: 1.15, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={handleClear}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer flex items-center justify-center p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Clear search"
                            >
                                {clearIcon || <X className="w-full h-full" />}
                            </motion.button>
                        )
                    )}
                </div>
            </div>

            {/* Optional Action Search Button */}
            {showSearchButton && (
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={disabled}
                    onClick={handleSearchClick}
                    className={cn(
                        'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold tracking-tight shadow-md hover:shadow-indigo-500/20 outline-none flex items-center justify-center transition disabled:opacity-50 disabled:pointer-events-none border-none cursor-pointer',
                        activeSize.button,
                        // Match input rounded corners but only on the right side
                        rounded === 'none' && 'rounded-none',
                        rounded === 'sm' && 'rounded-r-sm',
                        rounded === 'md' && 'rounded-r-md',
                        rounded === 'lg' && 'rounded-r-lg',
                        rounded === 'full' && 'rounded-r-full'
                    )}
                >
                    Search
                </motion.button>
            )}
        </motion.div>
    );
});

SearchBar.displayName = 'SearchBar';
