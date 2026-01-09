import React from 'react';

export interface AlertProps {
    /**
     * The type of the alert, determining its color and icon.
     */
    variant?: 'success' | 'error' | 'warning' | 'info';
    /**
     * Optional bold title at the start of the alert.
     */
    title?: string;
    /**
     * The main content of the alert.
     */
    children: React.ReactNode;
    /**
     * Optional callback for closing the alert. If provided, a close button will appear.
     */
    onClose?: () => void;
    /**
     * Additional CSS classes.
     */
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    variant = 'info',
    title,
    children,
    onClose,
    className = '',
}) => {
    // Styling configurations
    const variantStyles = {
        success: {
            container: 'bg-green-50 text-green-900 border-green-200',
            iconColor: 'text-green-600',
            closeHover: 'hover:bg-green-100 text-green-600',
            Icon: () => (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
        error: {
            container: 'bg-red-50 text-red-900 border-red-200',
            iconColor: 'text-red-600',
            closeHover: 'hover:bg-red-100 text-red-600',
            Icon: () => (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        warning: {
            container: 'bg-yellow-50 text-yellow-900 border-yellow-200',
            iconColor: 'text-yellow-600',
            closeHover: 'hover:bg-yellow-100 text-yellow-600',
            Icon: () => (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        info: {
            container: 'bg-blue-50 text-blue-900 border-blue-200',
            iconColor: 'text-blue-600',
            closeHover: 'hover:bg-blue-100 text-blue-600',
            Icon: () => (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const styles = variantStyles[variant];
    const Icon = styles.Icon;

    return (
        <div
            role="alert"
            className={`flex p-4 rounded-lg border ${styles.container} ${className}`}
        >
            <div className={`shrink-0 ${styles.iconColor}`}>
                <Icon />
            </div>
            <div className="ml-3 text-sm flex-1">
                {title && <span className="font-semibold block mb-1">{title}</span>}
                <div className="leading-relaxed">{children}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center transition-colors ${styles.closeHover}`}
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
