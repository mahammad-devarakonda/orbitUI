import React, { useState } from 'react';

export interface AppLayoutProps {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    sidebarWidth?: string;
    className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    sidebar,
    header,
    children,
    footer,
    sidebarWidth = '260px',
    className = '',
}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={`flex h-screen bg-gray-50 overflow-hidden ${className}`}>
            {/* Sidebar Desktop */}
            {sidebar && (
                <div
                    className="hidden md:flex flex-col h-full bg-white border-r border-gray-200"
                    style={{ width: sidebarWidth }}
                >
                    {sidebar}
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {sidebar && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            {sidebar && (
                <div
                    className={`
                        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 md:hidden
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {sidebar}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 shrink-0">
                    {sidebar && (
                        <button
                            className="mr-4 p-2 md:hidden text-gray-500 hover:bg-gray-100 rounded-md"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    )}
                    <div className="flex-1 flex items-center justify-between">
                        {header}
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>

                {/* Footer */}
                {footer && (
                    <footer className="h-14 border-t border-gray-200 bg-white px-4 flex items-center shrink-0">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
};
