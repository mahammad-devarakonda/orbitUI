import React, { useState } from 'react';

export interface AppLayoutProps {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    sidebarWidth?: string;
    collapsedWidth?: string;
    isCollapsible?: boolean;
    isCollapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    layoutVariant?: 'sidebar-first' | 'header-first';
    className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    sidebar,
    header,
    children,
    footer,
    sidebarWidth = '260px',
    collapsedWidth = '72px',
    isCollapsible = false,
    isCollapsed: controlledCollapsed,
    onCollapse,
    layoutVariant = 'sidebar-first',
    className = '',
}) => {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const handleToggleCollapse = () => {
        const newState = !isCollapsed;
        setInternalCollapsed(newState);
        onCollapse?.(newState);
    };

    const currentSidebarWidth = isCollapsed ? collapsedWidth : sidebarWidth;

    const renderHeader = () => (
        <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 shrink-0 z-20">
            {sidebar && (
                <button
                    className="mr-4 p-2 md:hidden text-gray-500 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(true)}
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
    );

    const renderSidebar = () => (
        <>
            {/* Sidebar Desktop */}
            <aside
                className={`
                    hidden md:flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative
                `}
                style={{ width: currentSidebarWidth }}
            >
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {sidebar}
                </div>

                {isCollapsible && (
                    <button
                        onClick={handleToggleCollapse}
                        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 focus:outline-none z-30"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg
                            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-100 flex justify-end">
                        <button
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {sidebar}
                    </div>
                </div>
            </div>
        </>
    );

    const renderFooter = () => footer && (
        <footer className="h-14 border-t border-gray-200 bg-white px-4 flex items-center shrink-0">
            {footer}
        </footer>
    );

    const mainContent = (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
            {layoutVariant === 'sidebar-first' && renderHeader()}

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
            </main>

            {renderFooter()}
        </div>
    );

    if (layoutVariant === 'header-first') {
        return (
            <div className={`flex flex-col h-screen bg-gray-50 overflow-hidden ${className}`}>
                {renderHeader()}
                <div className="flex flex-1 overflow-hidden">
                    {sidebar && renderSidebar()}
                    {mainContent}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen bg-gray-50 overflow-hidden ${className}`}>
            {sidebar && renderSidebar()}
            {mainContent}
        </div>
    );
};
