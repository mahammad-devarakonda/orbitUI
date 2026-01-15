import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { Typography } from '../Typography/Typography';

export interface ConversationItemProps {
    id: string;
    userName: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
    isActive?: boolean;
    lastMessage?: string;
    time?: string;
    onClick?: () => void;
    className?: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
    id,
    userName,
    avatar,
    status,
    isActive = false,
    lastMessage,
    time,
    onClick,
    className = '',
}) => {
    return (
        <div
            id={id}
            onClick={onClick}
            className={`
                p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors 
                ${isActive ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''}
                ${className}
            `}
        >
            <div className="relative">
                <Avatar size="lg" src={avatar} status={status} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <Typography
                        variant="body2"
                        weight="semibold"
                        className="truncate text-gray-900"
                    >
                        {userName}
                    </Typography>
                    {time && (
                        <Typography variant="caption" className="text-gray-400">
                            {time}
                        </Typography>
                    )}
                </div>
                {lastMessage && (
                    <Typography variant="caption" className="text-gray-500 truncate block">
                        {lastMessage}
                    </Typography>
                )}
            </div>
        </div>
    );
};
