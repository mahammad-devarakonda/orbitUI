import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface OrbitSelectOption {
    label: string;
    value: string;
}

export interface OrbitSelectProps {
    label?: string;
    error?: string;
    options: OrbitSelectOption[];
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    placeholder?: string;
    variant?: 'default' | 'glass' | 'dark';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    shadow?: boolean;
    leftIcon?: React.ReactNode;
    className?: string;
}

export const OrbitSelect: React.FC<OrbitSelectProps> = ({
    label,
    error,
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    variant = 'default',
    rounded = 'lg',
    className = '',
    leftIcon,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const variantClasses = {
        default: 'bg-white border-gray-300 text-gray-900',
        glass: 'bg-black/30 border-gray-600 text-white',
        dark: 'bg-gray-900 border-gray-800 text-white',
    };

    const dropdownClasses = {
        default: 'bg-white border-gray-200 text-gray-900',
        glass: 'bg-gray-900/95 border-gray-700 text-white backdrop-blur-md',
        dark: 'bg-gray-950 border-gray-800 text-white',
    };

    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div className={`flex flex-col gap-1.5 w-full ${className}`} ref={containerRef}>
            {label && (
                <label className={`text-sm font-medium ${variant === 'default' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full px-3 py-3 border flex items-center gap-3 cursor-pointer
                        ${roundedClasses[rounded]}
                        ${variantClasses[variant]}
                        ${isOpen ? 'ring-2 ring-purple-500 border-transparent' : ''}
                        ${error ? 'border-red-500' : ''}
                        transition-all duration-200
                    `}
                >
                    {leftIcon && (
                        <div className="flex items-center text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <span className={`block truncate flex-1 ${!selectedOption ? 'text-gray-400' : ''}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center shrink-0">
                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {isOpen && (
                    <div className={`
                        absolute z-50 w-full mt-1 max-h-60 overflow-auto border shadow-xl
                        ${roundedClasses[rounded]}
                        ${dropdownClasses[variant]}
                    `}>
                        {options.map((option) => {
                            const isSelected = value === option.value;
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm transition-colors
                                        ${variant === 'default' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}
                                        ${isSelected ? (variant === 'default' ? 'bg-blue-50 text-blue-700' : 'bg-purple-500/20 text-purple-200') : ''}
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && <Check size={16} />}
                                </div>
                            );
                        })}
                        {options.length === 0 && (
                            <div className="px-3 py-2.5 text-sm text-gray-500 text-center">
                                No options available
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};

OrbitSelect.displayName = 'OrbitSelect';
