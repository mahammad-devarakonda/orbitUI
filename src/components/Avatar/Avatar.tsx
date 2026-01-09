import React from 'react';

export interface AvatarProps {
    src?: string;
    alt?: string;
    initials?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    status?: 'online' | 'offline' | 'busy' | 'away';
    className?: string;
    isBordered?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'User',
    initials,
    size = 'md',
    status,
    className = '',
    isBordered = false,
}) => {
    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg',
        '2xl': 'w-24 h-24 text-xl',
    };

    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        busy: 'bg-red-500',
        away: 'bg-yellow-500',
    };

    const statusSizeClasses = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5',
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className={`
                    ${sizeClasses[size]} 
                    rounded-full 
                    flex items-center justify-center 
                    overflow-hidden 
                    bg-gray-100 
                    text-gray-600 
                    font-bold
                    ${isBordered ? 'ring-2 ring-white' : ''}
                `}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>{initials || alt.charAt(0).toUpperCase()}</span>
                )}
            </div>

            {status && (
                <span
                    className={`
                        absolute bottom-0 right-0 
                        block rounded-full 
                        ring-2 ring-white 
                        ${statusColors[status]} 
                        ${statusSizeClasses[size]}
                    `}
                />
            )}
        </div>
    );
};
