import React from 'react';
import { Star, Clock, Info, CreditCard, Calendar, QrCode } from 'lucide-react';

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
    rating?: string; // e.g., UA, 13+
    duration?: string; // e.g., 2h 35m
    bookingId?: string;
    transactionId?: string;
    price?: string;
    bookingDate?: string;
    qrCodeUrl?: string; // Optional URL for QR code image
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
    className?: string;
}

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
    rating = 'UA',
    duration = '2h 15m',
    bookingId = 'BK928374',
    transactionId = 'TXN123456789',
    price = '₹350.00',
    bookingDate = 'Oct 30, 2026',
    qrCodeUrl,
    isFavorite = false,
    onFavoriteToggle,
    className = '',
}) => {
    return (
        <div className={`relative max-w-[420px] bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden font-sans border border-white/5 transition-all duration-500 group text-white ${className}`}>

            {/* Film Strip Side Decorators */}
            <div className="absolute top-0 bottom-0 left-2 w-1 flex flex-col justify-around py-4 opacity-20 transition-opacity">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-white rounded-sm"></div>
                ))}
            </div>
            <div className="absolute top-0 bottom-0 right-2 w-1 flex flex-col justify-around py-4 opacity-20 transition-opacity">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-white rounded-sm"></div>
                ))}
            </div>

            {/* Top Section - Poster and Main Info */}
            <div className="relative p-8 pb-6 ml-4 mr-4 bg-gradient-to-b from-white/10 to-transparent">
                <div className="flex gap-6">
                    {/* Poster */}
                    <div className="w-28 h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500">
                        <img
                            src={posterUrl}
                            alt={movieTitle}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-grow pt-1">
                        <div className="flex justify-between items-start">
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-rose-600 rounded-md text-[9px] font-black tracking-tighter uppercase whitespace-nowrap">
                                        {format}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {language}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black leading-tight tracking-tight line-clamp-2">
                                    {movieTitle}
                                </h2>
                            </div>
                            <button
                                onClick={onFavoriteToggle}
                                className={`p-2.5 rounded-2xl transition-all duration-300 ${isFavorite ? 'text-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'text-white/20 hover:bg-white/5 hover:text-white/40'}`}
                            >
                                <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Rating and Duration */}
                        <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                                <Info size={12} className="text-gray-500" />
                                <span>{rating}</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                                <Clock size={12} className="text-gray-500" />
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Show Details Section */}
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Location</p>
                        <p className="text-xs font-bold text-gray-200 line-clamp-1">{location}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Date & Time</p>
                        <p className="text-xs font-bold text-gray-200">{date} <span className="text-gray-500 mx-1">@</span> {time}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Screen</p>
                        <p className="text-sm font-black text-white">{screen}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Seats</p>
                        <p className="text-sm font-black text-white uppercase">{seats}</p>
                    </div>
                </div>
            </div>

            {/* Perforation Line (Enhanced Dark Mode) */}
            <div className="relative flex items-center justify-between ml-4 mr-4">
                <div className="w-10 h-10 bg-[#0a0a0a] rounded-full -ml-[36px] border border-white/5 shadow-[inset_-8px_0_12px_rgba(0,0,0,0.5)] z-10"></div>
                <div className="flex-grow h-[1px] border-t-2 border-dashed border-white/10 mx-2"></div>
                <div className="w-10 h-10 bg-[#0a0a0a] rounded-full -mr-[36px] border border-white/5 shadow-[inset_8px_0_12px_rgba(0,0,0,0.5)] z-10"></div>
            </div>

            {/* Bottom Section - Coding/Scanning/Payment */}
            <div className="p-8 pt-6 ml-4 mr-4 bg-gradient-to-t from-white/5 to-transparent flex gap-6">
                {/* QR Code Placeholder */}
                <div className="w-24 h-24 bg-white/[0.03] rounded-2xl flex items-center justify-center border border-white/10 transition-all relative overflow-hidden p-2">
                    {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain invert" />
                    ) : (
                        <QrCode size={48} className="text-white/10 transition-all" strokeWidth={1} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Booking Info */}
                <div className="flex-grow space-y-4 pt-1">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Booking ID</p>
                            <p className="text-[11px] font-mono font-bold text-gray-300">{bookingId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Total Paid</p>
                            <p className="text-sm font-black text-green-400">{price}</p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <CreditCard size={10} className="text-gray-500" />
                            <p className="text-[9px] font-bold text-gray-500 line-clamp-1">{transactionId}</p>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <Calendar size={10} className="text-gray-500" />
                            <p className="text-[9px] font-bold text-gray-500 uppercase">{bookingDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical M-TICKET Badge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] text-[8px] font-black text-white/5 tracking-[0.8em] px-1 uppercase select-none transition-colors">
                ELECTRONIC • ADMIT ONE • M-TICKET
            </div>

            {/* Gloss Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-30 transition-opacity duration-700"></div>
        </div>
    );
};
