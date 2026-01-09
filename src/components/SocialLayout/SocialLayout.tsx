import React from 'react';

export interface SocialLayoutProps {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    className?: string;
}

export const SocialLayout: React.FC<SocialLayoutProps> = ({
    sidebar,
    header,
    children,
    footer,
    maxWidth = '935px',
    className = '',
}) => {
    return (
        <div className={`flex flex-col md:flex-row h-screen bg-white ${className}`}>
            {/* Sidebar Container - Desktop */}
            {sidebar && (
                <aside className="hidden md:flex flex-col fixed left-0 h-screen border-r border-gray-200 transition-all duration-300 xl:w-64 w-20 z-50 bg-white">
                    {sidebar}
                </aside>
            )}

            {/* Main Content Area */}
            <main
                className={`
                    flex-1 bg-white overflow-y-auto min-w-0
                    ${sidebar ? 'md:ml-20 xl:ml-64' : ''}
                `}
            >
                {header && (
                    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 md:hidden">
                        {header}
                    </header>
                )}

                <div className="mx-auto px-4 md:px-8 py-8" style={{ maxWidth }}>
                    {children}
                </div>
            </main>

            {footer && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                    {footer}
                </nav>
            )}
        </div>
    );
};
