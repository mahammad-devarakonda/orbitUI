import React from 'react';

export interface InboxLayoutProps {
    list: React.ReactNode;
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    isChatActive?: boolean;
    onBack?: () => void;
    listWidth?: string;
    className?: string;
}

export const InboxLayout: React.FC<InboxLayoutProps> = ({
    list,
    header,
    children,
    footer,
    isChatActive = false,
    onBack,
    listWidth = '350px',
    className = '',
}) => {
    return (
        <div className={`flex h-screen bg-white overflow-hidden ${className}`}>
            {/* Left Column: Conversation List */}
            <aside
                className={`
                    flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300
                    ${isChatActive ? 'hidden md:flex' : 'flex w-full md:w-auto'}
                `}
                style={{ width: isChatActive ? listWidth : (window.innerWidth < 768 ? '100%' : listWidth) }}
            >
                <div className="flex flex-col w-full h-full">
                    {list}
                </div>
            </aside>

            {/* Right Column: Active Conversation */}
            <main
                className={`
                    flex-1 flex flex-col min-w-0 bg-white transition-all duration-300
                    ${!isChatActive ? 'hidden md:flex' : 'flex w-full'}
                `}
            >
                {/* Mobile Header with Back Button */}
                {(header || onBack) && (
                    <header className="flex h-16 items-center px-4 border-b border-gray-100 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="mr-3 p-2 md:hidden text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Go back"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div className="flex-1 min-w-0">
                            {header}
                        </div>
                    </header>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                </div>

                {/* Input Area */}
                {footer && (
                    <footer className="p-4 bg-white border-t border-gray-100 shrink-0">
                        {footer}
                    </footer>
                )}
            </main>
        </div>
    );
};
