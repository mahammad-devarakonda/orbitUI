import React from 'react';
import { Typography } from '../Typography/Typography';

export interface EmptyChatStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({
    title = 'Your Messages',
    description = 'Select a chat from the sidebar or search for a contact to start messaging.',
    icon = '💬',
    className = '',
}) => {
    return (
        <div className={`h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center ${className}`}>
            <div className="text-6xl mb-4 opacity-50">{icon}</div>
            <Typography variant="h6" className="text-gray-600">
                {title}
            </Typography>
            <Typography variant="body2" className="mt-2 text-gray-500 max-w-xs">
                {description}
            </Typography>
        </div>
    );
};
