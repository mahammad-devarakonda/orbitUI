import React from 'react';

export interface ChatBodyProps {
    children: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
    className?: string;
}

export const ChatBody: React.FC<ChatBodyProps> = ({
    children,
    loading = false,
    loadingText = 'Loading messages...',
    className = '',
}) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [children]);

    return (
        <div className={`p-4 md:p-6 space-y-4 flex flex-col flex-1 overflow-y-auto ${className}`}>
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 italic py-10">
                    {loadingText}
                </div>
            ) : (
                <>
                    {children}
                    <div ref={scrollRef} />
                </>
            )}
        </div>
    );
};
