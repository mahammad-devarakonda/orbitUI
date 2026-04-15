import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    autoResize?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    autoResize,
    className = '',
    rows = 4,
    ...props
}) => {
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        if (autoResize) {
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <textarea
                className={`
                    w-full 
                    px-3 
                    py-2 
                    bg-white 
                    dark:bg-gray-800
                    border 
                    ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                    text-gray-900
                    dark:text-white
                    rounded-md 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 
                    ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
                    focus:border-transparent 
                    transition-all 
                    duration-200 
                    hover:border-gray-400 
                    dark:hover:border-gray-600
                    min-h-[100px]
                    resize-y
                    ${className}
                `}
                rows={rows}
                onInput={handleInput}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};
