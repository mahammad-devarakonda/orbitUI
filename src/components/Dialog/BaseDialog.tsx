import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button';

export interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showCloseButton?: boolean;
}

export const BaseDialog: React.FC<BaseDialogProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    className = '',
    showCloseButton = true,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent scrolling on the body when dialog is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
    };

    const dialogContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div
                ref={dialogRef}
                className={`
                    w-full 
                    bg-white 
                    rounded-2xl 
                    shadow-2xl 
                    transform 
                    transition-all 
                    duration-300 
                    scale-100 
                    opacity-100
                    overflow-hidden
                    flex flex-col
                    max-h-[90vh]
                    ${sizeClasses[size]} 
                    ${className}
                `}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                        {title && <h3 className="text-lg font-bold text-gray-900 leading-6">{title}</h3>}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="icon"
                                rounded="full"
                                onClick={onClose}
                                className="ml-auto text-gray-400 hover:text-gray-900 -mr-2"
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(dialogContent, document.body);
};
