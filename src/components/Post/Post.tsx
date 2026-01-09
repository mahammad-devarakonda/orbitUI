import React from 'react';
import { Button } from '../Button/Button';

export interface PostProps {
    username: string;
    profilePic: string;
    postImage: string;
    likesCount: number;
    caption: string;
    location?: string;
    isLiked?: boolean;
    isBookmarked?: boolean;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
    onBookmark?: () => void;
}

export const Post: React.FC<PostProps> = ({
    username,
    profilePic,
    postImage,
    likesCount,
    caption,
    location,
    isLiked = false,
    isBookmarked = false,
    onLike,
    onComment,
    onShare,
    onBookmark,
}) => {
    return (
        <div className="group relative max-w-[420px] mx-auto bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50">
            {/* Main Image with Floating Options */}
            <div className="relative w-full aspect-4/5 bg-gray-100 overflow-hidden">
                <img
                    src={postImage}
                    alt="Post content"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating More Options Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        rounded="full"
                        className="bg-black/20 backdrop-blur-md text-white hover:bg-black/40 border-none"
                    >
                        <svg aria-label="More options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="6" cy="12" r="1.5"></circle>
                            <circle cx="18" cy="12" r="1.5"></circle>
                        </svg>
                    </Button>
                </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5">
                {/* User & Actions Row */}
                <div className="flex items-center justify-between mb-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={profilePic}
                                alt={username}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm leading-tight hover:text-indigo-600 cursor-pointer transition-colors">
                                {username}
                            </span>
                            {location && (
                                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                                    {location}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            rounded="full"
                            onClick={onLike}
                            className={`transition-colors ${isLiked ? 'text-rose-500 hover:bg-rose-50' : 'text-gray-400 hover:text-rose-500'}`}
                        >
                            {isLiked ? (
                                <svg aria-label="Unlike" fill="currentColor" height="26" role="img" viewBox="0 0 48 48" width="26">
                                    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 14.9 17.8 29.1 23.9 30.2h.2c6.1-1.1 23.9-15.3 23.9-30.2 0-8-6-14.5-13.4-14.5z"></path>
                                </svg>
                            ) : (
                                <svg aria-label="Like" fill="currentColor" height="26" role="img" viewBox="0 0 24 24" width="26">
                                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.252.342.392.545.517.545s.265-.203.517-.545a4.21 4.21 0 0 1 3.675-1.941m0-2a6.21 6.21 0 0 0-5.292 2.768 6.21 6.21 0 0 0-5.292-2.768 6.989 6.989 0 0 0-6.708 7.218c0 4.19 2.923 6.64 5.642 9.066 2.057 1.838 4.19 3.744 5.358 5.485.474-.707 2.112-2.298 5.358-5.188 2.308-2.053 5.358-4.706 5.358-9.363a6.989 6.989 0 0 0-6.708-7.218Z"></path>
                                </svg>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            rounded="full"
                            onClick={onComment}
                            className="text-gray-400 hover:text-indigo-500"
                        >
                            <svg aria-label="Comment" fill="currentColor" height="26" role="img" viewBox="0 0 24 24" width="26">
                                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            rounded="full"
                            onClick={onShare}
                            className="text-gray-400 hover:text-indigo-500"
                        >
                            <svg aria-label="Share Post" fill="currentColor" height="26" role="img" viewBox="0 0 24 24" width="26">
                                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* Caption & Likes */}
                <div className="space-y-3">
                    <p className="text-gray-800 text-sm leading-relaxed">
                        {caption}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <span className="font-semibold text-xs text-gray-500">
                            {likesCount.toLocaleString()} Likes
                        </span>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                rounded="full"
                                onClick={onBookmark}
                                className={`transition-colors ${isBookmarked ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                {isBookmarked ? (
                                    <svg aria-label="Remove" fill="currentColor" height="22" role="img" viewBox="0 0 24 24" width="22">
                                        <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.89l-7.313 6.837A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                                    </svg>
                                ) : (
                                    <svg aria-label="Save" fill="currentColor" height="22" role="img" viewBox="0 0 24 24" width="22">
                                        <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.89l-7.313 6.837A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                    </svg>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Minimal Comment input */}
                    <div className="relative mt-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="w-full text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-200 transition-all"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Button variant="ghost" size="sm" className="text-indigo-500 font-bold px-2 py-0 h-auto hover:bg-transparent hover:text-indigo-700 min-w-0">Post</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
