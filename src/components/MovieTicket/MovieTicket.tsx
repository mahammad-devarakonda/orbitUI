import React from 'react';
import { QrCode, Phone, ChevronDown } from 'lucide-react';

export interface MovieTicketProps {
    movieTitle: string;
    posterUrl: string;
    language: string;
    format: string; // e.g., 2D, 3D
    location: string;
    date: string; // Show date
    time: string; // Show time
    screen: string;
    seats: string;
    rating?: string; // e.g., UA, U, 13+
    duration?: string; // e.g., 2h 35m
    bookingId?: string;
    transactionId?: string;
    price?: string;
    bookingDate?: string;
    qrCodeUrl?: string; // Optional URL for QR code image
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
    onCancelBooking?: () => void;
    onContactSupport?: () => void;
    className?: string;
}

const TicketSlashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 9a3 3 0 0 1 0-6h20a3 3 0 0 1 0 6 2 2 0 0 0 0 6 3 3 0 0 1 0 6H2a3 3 0 0 1 0-6 2 2 0 0 0 0-6Z" />
        <line x1="2" y1="22" x2="22" y2="2" />
    </svg>
);

export const MovieTicket: React.FC<MovieTicketProps> = ({
    movieTitle,
    posterUrl,
    language,
    format,
    location,
    date,
    time,
    screen,
    seats,
    rating,
    bookingId = 'WHL6CTF',
    price = '₹350.00',
    qrCodeUrl,
    onCancelBooking = () => alert('Cancel booking initiated'),
    onContactSupport = () => alert('Connecting to support...'),
    className = '',
}) => {
    // Determine ticket count based on seats list
    const ticketCount = seats ? seats.split(',').filter(Boolean).length : 1;

    return (
        <div className={`relative w-full max-w-[360px] bg-white border border-gray-200/80 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden font-sans text-gray-800 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)] ${className}`}>

            {/* Top Section - Poster and Main Info */}
            <div className="p-6 pb-4 flex gap-4 items-start relative justify-between">
                <div className="flex gap-4 items-start flex-grow">
                    {/* Poster */}
                    <div className="w-[84px] h-[120px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 flex-shrink-0">
                        <img
                            src={posterUrl}
                            alt={movieTitle}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Movie Info */}
                    <div className="flex-grow min-w-0 pt-0.5">
                        <h2 className="text-base font-extrabold text-gray-950 leading-tight tracking-tight break-words">
                            {movieTitle} {rating ? `(${rating})` : ''}
                        </h2>

                        <p className="text-[11px] font-bold text-gray-400 mt-2 tracking-wide uppercase">
                            {language}, {format}
                        </p>

                        <p className="text-[11px] font-semibold text-gray-600 mt-1">
                            {date} | {time}
                        </p>

                        <p className="text-[11px] text-gray-500 mt-1 leading-snug font-medium line-clamp-2">
                            {location}
                        </p>
                    </div>
                </div>

                {/* Vertical M-Ticket Badge */}
                <div className="text-[9px] font-extrabold text-gray-400/80 tracking-[0.25em] [writing-mode:vertical-lr] text-center self-center pl-3 border-l border-dashed border-gray-150 h-16 flex items-center justify-center select-none shrink-0">
                    e-Ticket
                </div>
            </div>

            {/* Perforation Line with Side Notches */}
            <div className="relative flex items-center justify-between my-1">
                {/* Left Notch */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-[#f3f4f6] rounded-r-full border-y border-r border-gray-200/80 -ml-[1px] z-20"></div>
                {/* Dashed Separator */}
                <div className="w-full border-t border-dashed border-gray-200/80 mx-5"></div>
                {/* Right Notch */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-[#f3f4f6] rounded-l-full border-y border-l border-gray-200/80 -mr-[1px] z-20"></div>
            </div>

            {/* Bottom Section - QR, Details & Actions */}
            <div className="pt-2 pb-0">
                {/* Details Container */}
                <div className="mx-6 p-4 bg-gray-50/80 border border-gray-100 rounded-2xl flex gap-4 items-center">
                    {/* QR Code */}
                    <div className="w-20 h-20 bg-white border border-gray-200/60 rounded-xl flex items-center justify-center p-1.5 flex-shrink-0">
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                        ) : (
                            <QrCode size={40} className="text-gray-300" strokeWidth={1.5} />
                        )}
                    </div>

                    {/* Booking Details */}
                    <div className="flex-grow flex flex-col items-center justify-center text-center pr-2">
                        <span className="text-[10px] text-gray-400 font-extrabold tracking-wider uppercase">
                            {ticketCount} Ticket(s)
                        </span>
                        <span className="text-base font-extrabold text-gray-900 mt-0.5 tracking-tight uppercase">
                            {screen}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase mt-0.5 tracking-wide">
                            {seats}
                        </span>
                        <span className="text-xs font-extrabold text-gray-900 mt-2 tracking-wide">
                            BOOKING ID: {bookingId}
                        </span>
                        <span className="text-[9px] text-gray-400 font-semibold mt-1 hover:text-gray-600 cursor-pointer select-none transition-colors">
                            Tap to see more
                        </span>
                    </div>
                </div>

                {/* Caption Text */}
                <p className="text-[10px] text-gray-400 font-medium text-center px-6 mt-3 leading-normal max-w-[320px] mx-auto">
                    A confirmation is sent on e-mail/SMS/WhatsApp within 15 minutes of booking.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-around mt-4 pt-3 pb-3 border-t border-gray-100 mx-6">
                    <button
                        onClick={onCancelBooking}
                        className="flex-1 flex flex-col items-center gap-1.5 py-1 text-gray-500 hover:text-red-500 active:scale-95 transition-all outline-none"
                    >
                        <TicketSlashIcon className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 tracking-wide">Cancel booking</span>
                    </button>

                    <div className="h-6 w-px bg-gray-150"></div>

                    <button
                        onClick={onContactSupport}
                        className="flex-1 flex flex-col items-center gap-1.5 py-1 text-gray-500 hover:text-blue-500 active:scale-95 transition-all outline-none"
                    >
                        <Phone size={20} className="text-gray-400 hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 tracking-wide">Contact support</span>
                    </button>
                </div>
            </div>

            {/* Total Amount Footer Ribbon */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100 rounded-b-[2rem]">
                <span className="text-xs text-gray-500 font-bold tracking-wider uppercase">Total Amount</span>
                <div className="flex items-center gap-1 cursor-pointer select-none group">
                    <span className="text-sm font-extrabold text-gray-900 group-hover:text-gray-700 transition-colors">{price}</span>
                    <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
            </div>

        </div>
    );
};

