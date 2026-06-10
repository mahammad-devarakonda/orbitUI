import React, { useRef, useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface OtpInputProps {
    /** Number of OTP digit inputs to render */
    length?: number;
    /** Current value of the OTP inputs */
    value?: string;
    /** Callback triggered when any digit changes */
    onChange?: (value: string) => void;
    /** Callback triggered when all digits are filled */
    onComplete?: (value: string) => void;
    /** Standard HTML input type or styling behaviour */
    type?: 'number' | 'text' | 'password';
    /** Predefined styling design system variants */
    variant?: 'default' | 'glass' | 'dark';
    /** Height and width size options for the boxes */
    size?: 'sm' | 'md' | 'lg';
    /** Rounded border configurations */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /** Gap space between digit boxes */
    gap?: 'sm' | 'md' | 'lg' | 'xl';
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Whether the input is in an error state (triggers shake animation) */
    error?: boolean;
    /** Whether the input is in a success state */
    success?: boolean;
    /** Whether to auto-focus the first slot on mount */
    autoFocus?: boolean;
    /** Character shown when a slot is empty */
    placeholder?: string;
    /** Additional CSS class for the outer container flexbox */
    className?: string;
    /** Additional CSS class for each individual digit box */
    inputClassName?: string;
    /** Custom Tailwind focus ring classes (e.g. 'focus:ring-indigo-500') */
    focusRingColor?: string;
}

export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(({
    length = 6,
    value,
    onChange,
    onComplete,
    type = 'number',
    variant = 'default',
    size = 'md',
    rounded = 'lg',
    gap = 'md',
    disabled = false,
    error = false,
    success = false,
    autoFocus = false,
    placeholder = '•',
    className = '',
    inputClassName = '',
    focusRingColor,
}, ref) => {
    const [prevProps, setPrevProps] = useState({ value, length });
    const [otpValues, setOtpValues] = useState<string[]>(() => {
        const initial = value || '';
        return Array.from({ length }, (_, i) => initial[i] || '');
    });

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Sync state if controlled props change
    if (value !== prevProps.value || length !== prevProps.length) {
        setPrevProps({ value, length });
        setOtpValues(Array.from({ length }, (_, i) => (value || '')[i] || ''));
    }

    // Handle auto-focus on mount
    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const variantClasses = {
        default: 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-150 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-950 disabled:text-gray-400 dark:disabled:text-gray-600',
        glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/30 focus:border-white/60 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30',
        dark: 'bg-gray-800 border-gray-750 text-white placeholder:text-gray-500 focus:border-blue-500 hover:border-gray-700 disabled:bg-gray-900 disabled:text-gray-600',
    };

    const sizeClasses = {
        sm: 'w-10 h-12 text-lg font-bold',
        md: 'w-12 h-14 text-xl font-bold',
        lg: 'w-14 h-16 text-2xl font-extrabold',
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const gapClasses = {
        sm: 'gap-2',
        md: 'gap-3',
        lg: 'gap-4',
        xl: 'gap-6',
    };

    const defaultFocusRing = {
        default: 'focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
        glass: 'focus:ring-2 focus:ring-white/20 focus:outline-none',
        dark: 'focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        // Take only the last character entered
        const char = val.slice(-1);

        // Filter numeric input
        if (type === 'number' && char && !/^\d$/.test(char)) {
            return;
        }

        const newValues = [...otpValues];
        newValues[index] = char;
        setOtpValues(newValues);

        const mergedString = newValues.join('');
        if (onChange) {
            onChange(mergedString);
        }

        // Focus next sibling
        if (char !== '') {
            if (index < length - 1) {
                inputRefs.current[index + 1]?.focus();
                inputRefs.current[index + 1]?.select();
            } else {
                // Focus out or trigger complete
                if (onComplete && mergedString.length === length) {
                    onComplete(mergedString);
                }
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newValues = [...otpValues];

            if (otpValues[index] !== '') {
                // Clear active box
                newValues[index] = '';
                setOtpValues(newValues);
                if (onChange) onChange(newValues.join(''));
            } else if (index > 0) {
                // Clear preceding box and shift focus back
                newValues[index - 1] = '';
                setOtpValues(newValues);
                if (onChange) onChange(newValues.join(''));
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
                inputRefs.current[index - 1]?.select();
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (index < length - 1) {
                inputRefs.current[index + 1]?.focus();
                inputRefs.current[index + 1]?.select();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;

        const pastedData = e.clipboardData.getData('text').trim();
        const filteredData = type === 'number'
            ? pastedData.replace(/\D/g, '')
            : pastedData;

        if (!filteredData) return;

        const newValues = [...otpValues];
        let focusedIndex = inputRefs.current.findIndex(el => el === document.activeElement);
        if (focusedIndex === -1) focusedIndex = 0;

        let pastedCount = 0;
        for (let i = 0; i < length - focusedIndex; i++) {
            if (i < filteredData.length) {
                newValues[focusedIndex + i] = filteredData[i];
                pastedCount++;
            }
        }

        setOtpValues(newValues);
        const mergedString = newValues.join('');
        if (onChange) {
            onChange(mergedString);
        }

        const nextFocusIndex = Math.min(focusedIndex + pastedCount - 1, length - 1);
        inputRefs.current[nextFocusIndex]?.focus();

        if (mergedString.length === length && onComplete) {
            onComplete(mergedString);
        }
    };

    // Container shake animation for error state
    const shakeVariants: Variants = {
        shake: {
            x: [0, -8, 8, -8, 8, -5, 5, 0],
            transition: { duration: 0.45, ease: 'easeInOut' }
        },
        idle: { x: 0 }
    };

    return (
        <motion.div
            ref={ref}
            variants={shakeVariants}
            animate={error ? 'shake' : 'idle'}
            className={cn('flex items-center justify-center', gapClasses[gap], className)}
        >
            {otpValues.map((digit, index) => {
                const isFocused = focusedIndex === index;
                
                return (
                    <motion.input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type={type === 'password' ? 'password' : 'text'}
                        inputMode={type === 'number' ? 'numeric' : 'text'}
                        pattern={type === 'number' ? '[0-9]*' : undefined}
                        value={digit}
                        placeholder={isFocused ? '' : placeholder}
                        disabled={disabled}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={() => {
                            setFocusedIndex(index);
                            inputRefs.current[index]?.select();
                        }}
                        onBlur={() => setFocusedIndex(null)}
                        onClick={() => inputRefs.current[index]?.select()}
                        whileFocus={{ scale: 1.06, zIndex: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className={cn(
                            'border border-solid text-center transition-all duration-200 outline-none',
                            sizeClasses[size],
                            roundedClasses[rounded],
                            variantClasses[variant],
                            
                            // Focus styling
                            focusRingColor ? `focus:ring-2 ${focusRingColor}` : defaultFocusRing[variant],
                            
                            // Error Styling
                            error && 'border-red-500 dark:border-red-500/80 text-red-500 dark:text-red-400 focus:ring-red-500/20 focus:border-red-500',
                            
                            // Success Styling
                            success && 'border-green-500 dark:border-green-500/80 text-green-500 dark:text-green-400 focus:ring-green-500/20 focus:border-green-500',
                            
                            inputClassName
                        )}
                        maxLength={1}
                        aria-label={`OTP Digit ${index + 1}`}
                    />
                );
            })}
        </motion.div>
    );
});

OtpInput.displayName = 'OtpInput';
