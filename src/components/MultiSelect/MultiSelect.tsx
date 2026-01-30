import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

export interface MultiSelectOption {
    label: string;
    value: string;
}

export interface MultiSelectProps {
    label?: string;
    error?: string;
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    variant?: 'default' | 'glass' | 'dark';
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    error,
    options,
    value,
    onChange,
    placeholder = 'Select options...',
    variant = 'default',
    rounded = 'lg',
    className = '',
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

    const toggleOption = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const removeOption = (e: React.MouseEvent, optionValue: string) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== optionValue));
    };

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
                        min-h-11.5 w-full px-3 py-2 border flex flex-wrap gap-2 cursor-pointer
                        ${roundedClasses[rounded]}
                        ${variantClasses[variant]}
                        ${isOpen ? 'ring-2 ring-purple-500 border-transparent' : ''}
                        ${error ? 'border-red-500' : ''}
                        transition-all duration-200
                    `}
                >
                    {value.length === 0 && (
                        <span className="text-gray-400 py-1">{placeholder}</span>
                    )}
                    {value.map((val) => {
                        const option = options.find((o) => o.value === val);
                        return (
                            <span
                                key={val}
                                className={`
                                    flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md
                                    ${variant === 'default' ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'}
                                `}
                            >
                                {option?.label || val}
                                <button
                                    onClick={(e) => removeOption(e, val)}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        );
                    })}
                    <div className="ml-auto flex items-center shrink-0">
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
                            const isSelected = value.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => toggleOption(option.value)}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm
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
