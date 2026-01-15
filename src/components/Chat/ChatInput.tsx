import React from 'react';

export interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSend,
    placeholder = 'Write a message...',
    disabled = false,
    className = '',
}) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all disabled:opacity-50"
            />
            <button
                onClick={onSend}
                disabled={disabled || !value.trim()}
                className={`
                    text-indigo-600 font-bold px-2 hover:text-indigo-700 transition-colors
                    disabled:text-gray-400 disabled:cursor-not-allowed
                `}
            >
                Send
            </button>
        </div>
    );
};
