import React from 'react';
import { Typography } from '../Typography/Typography';

export interface ChatMessageProps {
    text: string;
    isOwn?: boolean;
    time?: string;
    className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    text,
    isOwn = false,
    time,
    className = '',
}) => {
    return (
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} ${className}`}>
            <div
                className={`
                    max-w-[80%] md:max-w-xs p-3 rounded-2xl shadow-sm text-sm
                    ${isOwn
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}
                `}
            >
                {text}
            </div>
            {time && (
                <Typography variant="caption" className="mt-1 text-gray-400 text-[10px]">
                    {time}
                </Typography>
            )}
        </div>
    );
};
