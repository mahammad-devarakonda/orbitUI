import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The active progress value */
    value?: number;
    /** The maximum possible value. Defaults to 100 */
    max?: number;
    /** The minimum possible value. Defaults to 0 */
    min?: number;
    /** Secondary progress value (e.g. for buffering) */
    buffer?: number;
    /** Sizing thickness preset */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Theme style variants including rich premium gradients */
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient-indigo' | 'gradient-sunset' | 'gradient-ocean';
    /** Custom background color override for the progress indicator (e.g., '#8b5cf6') */
    color?: string;
    /** Corner rounding style */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /** Displays the percentage value text */
    showValue?: boolean;
    /** Where to place the value text relative to the track */
    valuePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inside' | 'tooltip';
    /** Custom label displayed alongside the progress bar */
    label?: React.ReactNode;
    /** Apply a matching soft drop-shadow glow below the bar */
    glow?: boolean;
    /** Give the track container a glassmorphic look */
    glassmorphism?: boolean;
    /** Draw repeating striped patterns on the progress bar */
    striped?: boolean;
    /** Animates stripes or the transition of the bar value */
    animated?: boolean;
    /** Puts the progress bar in an infinite loading state */
    indeterminate?: boolean;
    /** Custom CSS class for the outer container */
    className?: string;
    /** Custom CSS class for the progress bar itself */
    barClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value = 0,
    max = 100,
    min = 0,
    buffer,
    size = 'md',
    variant = 'primary',
    color,
    rounded = 'full',
    showValue = false,
    valuePosition = 'top-right',
    label,
    glow = false,
    glassmorphism = false,
    striped = false,
    animated = true,
    indeterminate = false,
    className = '',
    barClassName = '',
    ...props
}) => {
    // Calculate percentage values safely
    const calculatePercentage = (val: number) => {
        if (max === min) return 0;
        return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
    };

    const percentage = calculatePercentage(value);
    const bufferPercentage = buffer !== undefined ? calculatePercentage(buffer) : undefined;

    // Size mappings
    const sizeClasses = {
        xs: 'h-1 text-[8px]',
        sm: 'h-2 text-[9px]',
        md: 'h-3 text-[10px]',
        lg: 'h-5 text-xs font-semibold',
        xl: 'h-7 text-sm font-bold',
    };

    // Rounded shape mappings
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    // Styling variants
    const variantClasses = {
        primary: 'bg-blue-600 dark:bg-blue-500',
        secondary: 'bg-gray-600 dark:bg-gray-500',
        success: 'bg-emerald-600 dark:bg-emerald-500',
        warning: 'bg-amber-500 dark:bg-amber-400',
        danger: 'bg-red-600 dark:bg-red-500',
        info: 'bg-sky-500 dark:bg-sky-400',
        'gradient-indigo': 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600',
        'gradient-sunset': 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
        'gradient-ocean': 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600',
    };

    // Glow shadows mapped to color themes
    const glowClasses = {
        primary: 'shadow-[0_0_12px_rgba(59,130,246,0.45)]',
        secondary: 'shadow-[0_0_12px_rgba(107,114,128,0.35)]',
        success: 'shadow-[0_0_12px_rgba(16,185,129,0.45)]',
        warning: 'shadow-[0_0_12px_rgba(245,158,11,0.45)]',
        danger: 'shadow-[0_0_12px_rgba(239,68,68,0.45)]',
        info: 'shadow-[0_0_12px_rgba(14,165,233,0.45)]',
        'gradient-indigo': 'shadow-[0_0_14px_rgba(139,92,246,0.5)]',
        'gradient-sunset': 'shadow-[0_0_14px_rgba(236,72,153,0.5)]',
        'gradient-ocean': 'shadow-[0_0_14px_rgba(6,182,212,0.5)]',
    };

    // Inside placement is only viable for lg and xl sizes
    const canShowInside = size === 'lg' || size === 'xl';
    const showInside = showValue && valuePosition === 'inside' && canShowInside;

    // Define unique styling animation keyframes for self-containment
    const stripesAnimationCSS = `
        @keyframes progress-bar-stripes {
            0% { background-position: 1rem 0; }
            100% { background-position: 0 0; }
        }
        .animate-stripes-slide {
            animation: progress-bar-stripes 1s linear infinite;
        }
    `;

    const barStyle: React.CSSProperties = {
        ...(color ? { backgroundColor: color } : {}),
        ...(striped
            ? {
                  backgroundImage: `linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)`,
                  backgroundSize: '1rem 1rem',
              }
            : {}),
    };

    const formattedPercentage = `${Math.round(percentage)}%`;

    return (
        <div className={cn('w-full flex flex-col gap-1.5 select-none', className)} {...props}>
            {/* Embedded styles for animation self-containment */}
            {striped && <style>{stripesAnimationCSS}</style>}

            {/* Label and outside top text */}
            {(label || (showValue && !showInside && valuePosition.startsWith('top'))) && (
                <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                        {valuePosition === 'top-left' && showValue && (
                            <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                                {formattedPercentage}
                            </span>
                        )}
                        {label && <span className="text-gray-800 dark:text-gray-200">{label}</span>}
                    </div>
                    {valuePosition === 'top-right' && showValue && (
                        <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                            {formattedPercentage}
                        </span>
                    )}
                </div>
            )}

            {/* Main Progress Bar Container (Track) */}
            <div className="relative w-full">
                {/* Floating Tooltip Indicator */}
                {showValue && valuePosition === 'tooltip' && !indeterminate && (
                    <motion.div
                        className="absolute bottom-full mb-2 z-10 flex flex-col items-center"
                        style={{ left: `${percentage}%`, x: '-50%' }}
                        animate={{ left: `${percentage}%` }}
                        transition={animated ? { type: 'spring', stiffness: 100, damping: 18 } : { duration: 0 }}
                    >
                        <span className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-bold py-0.5 px-1.5 rounded shadow-md whitespace-nowrap">
                            {formattedPercentage}
                        </span>
                        <div className="w-1.5 h-1.5 bg-gray-900 dark:bg-gray-100 rotate-45 -mt-0.5" />
                    </motion.div>
                )}

                {/* Track */}
                <div
                    className={cn(
                        'w-full overflow-hidden relative flex items-center',
                        sizeClasses[size],
                        roundedClasses[rounded],
                        glassmorphism
                            ? 'bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/5'
                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200/20 dark:border-gray-700/20'
                    )}
                    role="progressbar"
                    aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuetext={indeterminate ? 'Loading...' : formattedPercentage}
                >
                    {/* Buffer Bar */}
                    {bufferPercentage !== undefined && !indeterminate && (
                        <motion.div
                            className={cn(
                                'absolute left-0 top-0 bottom-0 opacity-40',
                                color ? '' : variantClasses[variant],
                                roundedClasses[rounded]
                            )}
                            style={{ 
                                width: `${bufferPercentage}%`,
                                ...(color ? { backgroundColor: color } : {})
                            }}
                            animate={{ width: `${bufferPercentage}%` }}
                            transition={animated ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                        />
                    )}

                    {/* Active Progress Bar */}
                    {indeterminate ? (
                        <motion.div
                            className={cn(
                                'h-full w-full absolute top-0 left-0',
                                color ? '' : variantClasses[variant],
                                roundedClasses[rounded],
                                glow && glowClasses[variant],
                                striped && 'animate-stripes-slide',
                                barClassName
                            )}
                            style={barStyle}
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: 'easeInOut',
                            }}
                        />
                    ) : (
                        <motion.div
                            className={cn(
                                'h-full flex items-center justify-center text-white text-[10px] select-none transition-shadow',
                                color ? '' : variantClasses[variant],
                                roundedClasses[rounded],
                                glow && glowClasses[variant],
                                striped && 'animate-stripes-slide',
                                barClassName
                            )}
                            style={{ 
                                ...barStyle,
                                width: `${percentage}%` 
                            }}
                            animate={{ width: `${percentage}%` }}
                            transition={animated ? { type: 'spring', stiffness: 80, damping: 15 } : { duration: 0 }}
                        >
                            {showInside && (
                                <span className="px-2 truncate leading-none drop-shadow-sm font-bold">
                                    {formattedPercentage}
                                </span>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Outside bottom text */}
            {showValue && !showInside && valuePosition.startsWith('bottom') && (
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div>
                        {valuePosition === 'bottom-left' && (
                            <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                                {formattedPercentage}
                            </span>
                        )}
                    </div>
                    <div>
                        {valuePosition === 'bottom-right' && (
                            <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                                {formattedPercentage}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

ProgressBar.displayName = 'ProgressBar';
