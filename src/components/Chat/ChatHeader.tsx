import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { Typography } from '../Typography/Typography';

export interface ChatHeaderProps {
    userName: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
    statusText?: string;
    className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    userName,
    avatar,
    status,
    statusText,
    className = '',
}) => {
    // Determine status text if not provided
    const displayStatusText = statusText || (status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : status);

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <Avatar size="md" src={avatar} status={status} />
            <div>
                <Typography variant="body1" weight="bold">
                    {userName}
                </Typography>
                {displayStatusText && (
                    <Typography
                        variant="caption"
                        className={status === 'online' ? 'text-green-500' : 'text-gray-400'}
                    >
                        {displayStatusText}
                    </Typography>
                )}
            </div>
        </div>
    );
};
