import React from 'react';

export interface EventCardProps {
    /** Event title displayed prominently */
    title: string;
    /** Short descriptor e.g. "15+ Events" */
    countText: string;
    /** Image URL for the card background */
    image: string;
    /** Tailwind gradient start class e.g. "from-blue-500" */
    gradientFrom: string;
    /** Tailwind gradient end class e.g. "to-purple-600" */
    gradientTo: string;
    /** Optional click handler */
    onClick?: () => void;
    /** Card width — defaults to responsive "w-52 md:w-56" */
    className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
    title,
    countText,
    image,
    gradientFrom,
    gradientTo,
    onClick,
    className = 'w-52 md:w-56',
}) => {
    return (
        <div
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
            className={`relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] group ${className}`}
        >
            {/* Background image */}
            <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Colour overlay */}
            <div
                className={`absolute inset-0 opacity-45 mix-blend-multiply bg-gradient-to-tr ${gradientFrom} ${gradientTo}`}
            />

            {/* Readability gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

            {/* Text */}
            <div className="absolute inset-0 p-5 flex flex-col justify-start text-white select-none">
                <span className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight max-w-[85%] break-words drop-shadow-sm">
                    {title}
                </span>
                <span className="text-xs md:text-sm font-semibold tracking-wide text-white/90 drop-shadow-sm mt-1">
                    {countText}
                </span>
            </div>
        </div>
    );
};

export default EventCard;