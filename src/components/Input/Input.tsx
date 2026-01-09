import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
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
                    className={`
                        w-full 
                        ${leftIcon ? 'pl-10' : 'px-3'} 
                        ${rightIcon ? 'pr-10' : 'px-3'} 
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
};
