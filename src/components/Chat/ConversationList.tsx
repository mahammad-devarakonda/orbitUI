import React from 'react';
import { Typography } from '../Typography/Typography';

export interface ConversationListProps {
    title?: string;
    loading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
    className?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    title,
    loading = false,
    loadingText = 'Loading conversations...',
    children,
    className = '',
}) => {
    return (
        <div className={`flex flex-col h-full ${className}`}>
            {title && (
                <div className="p-4 border-b border-gray-100">
                    <Typography
                        variant="h5"
                        className="font-bold italic text-indigo-600"
                    >
                        {title}
                    </Typography>
                </div>
            )}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">
                        {loadingText}
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};
