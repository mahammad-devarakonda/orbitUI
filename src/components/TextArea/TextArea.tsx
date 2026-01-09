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
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize) {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
        props.onChange?.(e);
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                className={`
                    w-full 
                    px-3 
                    py-2 
                    bg-white 
                    border 
                    ${error ? 'border-red-500' : 'border-gray-300'} 
                    rounded-md 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-2 
                    ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
                    focus:border-transparent 
                    transition-all 
                    duration-200 
                    hover:border-gray-400 
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
