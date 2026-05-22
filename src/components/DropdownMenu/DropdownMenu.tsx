import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
} from 'react';
import { Avatar } from '../Avatar/Avatar';

// ==========================================
// Types and Interfaces
// ==========================================

export interface DropdownMenuItemConfig {
    type?: 'item' | 'separator' | 'group-label';
    label?: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    shortcut?: string;
    variant?: 'default' | 'danger' | 'success';
    disabled?: boolean;
    onClick?: () => void;
}

export interface DropdownMenuHeaderConfig {
    avatar?: React.ReactNode;
    name: string;
    email?: string;
    role?: string;
}

export interface DropdownMenuProps {
    children?: React.ReactNode;
    trigger?: React.ReactNode;
    header?: DropdownMenuHeaderConfig;
    items?: DropdownMenuItemConfig[];
    align?: 'left' | 'right';
    width?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    shortcut?: string;
    variant?: 'default' | 'danger' | 'success';
}

// Context to share state between dropdown parent and sub-components
interface DropdownContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    align: 'left' | 'right';
    triggerRef: React.RefObject<HTMLDivElement | null>;
    menuRef: React.RefObject<HTMLDivElement | null>;
    focusedIndex: number;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
    itemsCount: number;
    registerItem: (ref: React.RefObject<HTMLButtonElement | null>) => number;
    unregisterItem: (index: number) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

// ==========================================
// Core Dropdown Component
// ==========================================

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    children,
    trigger,
    header,
    items,
    align = 'right',
    width = 'w-64',
    isOpen: controlledIsOpen,
    onOpenChange,
    className = '',
}) => {
    const [localIsOpen, setLocalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

    const setIsOpen = (open: boolean) => {
        setLocalIsOpen(open);
        onOpenChange?.(open);
    };

    const triggerRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    // Dynamic item registry for arrow-key navigation
    const itemRefs = useRef<React.RefObject<HTMLButtonElement | null>[]>([]);
    const [itemsCount, setItemsCount] = useState(0);

    const registerItem = (ref: React.RefObject<HTMLButtonElement | null>) => {
        const index = itemRefs.current.length;
        itemRefs.current.push(ref);
        setItemsCount(itemRefs.current.length);
        return index;
    };

    const unregisterItem = (index: number) => {
        itemRefs.current = itemRefs.current.filter((_, i) => i !== index);
        setItemsCount(itemRefs.current.length);
    };

    // Close when clicking outside of trigger or dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;

            const clickedInsideTrigger = triggerRef.current?.contains(event.target as Node);
            const clickedInsideMenu = menuRef.current?.contains(event.target as Node);

            if (!clickedInsideTrigger && !clickedInsideMenu) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle accessibility keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                    const activeElem = document.activeElement;
                    if (triggerRef.current?.contains(activeElem)) {
                        event.preventDefault();
                        setIsOpen(true);
                        setFocusedIndex(0);
                    }
                }
                return;
            }

            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    setIsOpen(false);
                    // Focus back to trigger
                    const triggerBtn = triggerRef.current?.querySelector('button');
                    triggerBtn?.focus();
                    break;

                case 'ArrowDown':
                    event.preventDefault();
                    setFocusedIndex((prev) => {
                        const next = prev + 1 >= itemRefs.current.length ? 0 : prev + 1;
                        itemRefs.current[next]?.current?.focus();
                        return next;
                    });
                    break;

                case 'ArrowUp':
                    event.preventDefault();
                    setFocusedIndex((prev) => {
                        const next = prev - 1 < 0 ? itemRefs.current.length - 1 : prev - 1;
                        itemRefs.current[next]?.current?.focus();
                        return next;
                    });
                    break;

                case 'Tab':
                    setIsOpen(false);
                    break;

                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, itemsCount]);

    // Reset focused index when closing
    useEffect(() => {
        if (!isOpen) {
            setFocusedIndex(-1);
            itemRefs.current = [];
            setItemsCount(0);
        }
    }, [isOpen]);

    const contextValue = {
        isOpen,
        setIsOpen,
        align,
        triggerRef,
        menuRef,
        focusedIndex,
        setFocusedIndex,
        itemsCount,
        registerItem,
        unregisterItem,
    };

    // Declarative rendering mode (using props/args only)
    if (items || trigger) {
        return (
            <DropdownContext.Provider value={contextValue}>
                <div className={`relative inline-block ${className}`}>
                    <DropdownMenuTrigger asChild>
                        {trigger}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent width={width}>
                        {header && (
                            <DropdownMenuHeader
                                avatar={header.avatar}
                                name={header.name}
                                email={header.email}
                                role={header.role}
                            />
                        )}

                        {items?.map((item, idx) => {
                            if (item.type === 'separator') {
                                return <DropdownMenuSeparator key={idx} />;
                            }

                            if (item.type === 'group-label') {
                                return (
                                    <div
                                        key={idx}
                                        className="px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                                    >
                                        {item.label}
                                    </div>
                                );
                            }

                            return (
                                <DropdownMenuItem
                                    key={idx}
                                    icon={item.icon}
                                    badge={item.badge}
                                    shortcut={item.shortcut}
                                    variant={item.variant}
                                    disabled={item.disabled}
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </div>
            </DropdownContext.Provider>
        );
    }

    // Compositional mode
    return (
        <DropdownContext.Provider value={contextValue}>
            <div className={`relative inline-block ${className}`}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

// ==========================================
// Reusable Visual Trigger Components
// ==========================================

export interface DropdownMenuProfileTriggerProps {
    src?: string;
    alt?: string;
    initials?: string;
    name: string;
    role?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
    className?: string;
}

export const DropdownMenuProfileTrigger: React.FC<DropdownMenuProfileTriggerProps> = ({
    src,
    alt = 'User',
    initials,
    name,
    role,
    status,
    className = '',
}) => {
    return (
        <div
            className={`
                flex items-center gap-2.5 
                px-3 py-1.5 
                rounded-full 
                hover:bg-slate-100 dark:hover:bg-slate-800/80 
                transition-all duration-200 
                border border-slate-200/50 dark:border-slate-800/60 
                bg-white/80 dark:bg-slate-900/80
                cursor-pointer 
                select-none
                shadow-sm
                hover:shadow
                ${className}
            `}
        >
            <Avatar src={src} alt={alt} initials={initials} size="sm" status={status} isBordered />
            <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                    {name}
                </span>
                {role && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {role}
                    </span>
                )}
            </div>
            <svg
                className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 transition-transform group-aria-expanded:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
};

export interface DropdownMenuButtonTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md';
}

export const DropdownMenuButtonTrigger: React.FC<DropdownMenuButtonTriggerProps> = ({
    label,
    icon,
    rightIcon,
    variant = 'outline',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl gap-2 cursor-pointer select-none';

    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98 shadow-sm',
        secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-98',
        outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-98 shadow-xs',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
    };

    return (
        <button
            type="button"
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {icon && <span className="shrink-0 text-slate-400 group-hover:text-current">{icon}</span>}
            <span>{label}</span>
            {rightIcon ? rightIcon : (
                <svg
                    className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </button>
    );
};

// ==========================================
// Sub-Components
// ==========================================

export interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
    children,
    asChild = false,
}) => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('DropdownMenuTrigger must be used inside a DropdownMenu');
    }

    const { isOpen, setIsOpen, triggerRef } = context;

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<any>;
        return (
            <div ref={triggerRef} className="contents group">
                {React.cloneElement(child, {
                    onClick: (e: React.MouseEvent) => {
                        handleToggle(e);
                        child.props.onClick?.(e);
                    },
                    'aria-haspopup': 'menu',
                    'aria-expanded': isOpen,
                })}
            </div>
        );
    }

    return (
        <div ref={triggerRef} className="inline-block group">
            <button
                type="button"
                onClick={handleToggle}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
            >
                {children}
            </button>
        </div>
    );
};

export interface DropdownMenuContentProps {
    children: React.ReactNode;
    className?: string;
    width?: string;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
    children,
    className = '',
    width = 'w-64',
}) => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('DropdownMenuContent must be used inside a DropdownMenu');
    }

    const { isOpen, align, menuRef } = context;

    if (!isOpen) return null;

    const alignmentClasses = {
        left: 'left-0 origin-top-left',
        right: 'right-0 origin-top-right',
    };

    return (
        <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
            className={`
                absolute mt-2 z-50 
                ${width} 
                ${alignmentClasses[align]} 
                rounded-2xl 
                border border-slate-200/60 dark:border-slate-800/80 
                bg-white/95 dark:bg-slate-900/95 
                backdrop-blur-md 
                p-1.5 
                shadow-[0_10px_30px_-10px_rgba(0,0,0,0.12),0_1px_3px_-1px_rgba(0,0,0,0.05)] 
                dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4),0_1px_3px_-1px_rgba(0,0,0,0.2)]
                animate-[fadeInScale_0.15s_ease-out]
                focus:outline-none
                ${className}
            `}
            style={{
                animationFillMode: 'forwards',
            }}
        >
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(-4px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}} />
            {children}
        </div>
    );
};

export interface DropdownMenuHeaderProps {
    avatar?: React.ReactNode;
    name: string;
    email?: string;
    role?: string;
    className?: string;
}

export const DropdownMenuHeader: React.FC<DropdownMenuHeaderProps> = ({
    avatar,
    name,
    email,
    role,
    className = '',
}) => {
    return (
        <div className={`flex items-center gap-3 px-3 py-3 border-b border-slate-100 dark:border-slate-800/60 mb-1.5 ${className}`}>
            {avatar && <div className="shrink-0">{avatar}</div>}
            <div className="flex flex-col min-w-0 overflow-hidden text-left">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate leading-snug">
                    {name}
                </span>
                {email && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate leading-snug">
                        {email}
                    </span>
                )}
                {role && (
                    <span className="inline-flex self-start mt-1 text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {role}
                    </span>
                )}
            </div>
        </div>
    );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
    children,
    icon,
    badge,
    shortcut,
    variant = 'default',
    className = '',
    onClick,
    disabled = false,
    ...props
}) => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('DropdownMenuItem must be used inside a DropdownMenu');
    }

    const { setIsOpen, registerItem, unregisterItem } = context;
    const ref = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const itemIdx = registerItem(ref);
        return () => {
            if (itemIdx !== -1) {
                unregisterItem(itemIdx);
            }
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        onClick?.(e);
        setIsOpen(false);
    };

    const variantStyles = {
        default: 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-50 focus:bg-slate-50 dark:focus:bg-slate-800/60 focus:text-slate-900 dark:focus:text-slate-50',
        danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-700 dark:focus:text-red-300 font-medium',
        success: 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-700 dark:hover:text-green-300 focus:bg-green-50 dark:focus:bg-green-950/20 focus:text-green-700 dark:focus:text-green-300 font-medium',
    };

    return (
        <button
            ref={ref}
            role="menuitem"
            disabled={disabled}
            onClick={handleClick}
            tabIndex={-1}
            className={`
                w-full 
                flex items-center gap-2.5 
                px-3 py-2 
                rounded-xl 
                text-sm 
                transition-all duration-150 
                ease-out 
                text-left 
                border border-transparent 
                disabled:opacity-40 
                disabled:pointer-events-none 
                focus:outline-none 
                relative
                group
                cursor-pointer
                ${variantStyles[variant]}
                ${className}
            `}
            {...props}
        >
            {icon && (
                <span className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-current group-focus:text-current transition-colors">
                    {icon}
                </span>
            )}
            <span className="flex-1 truncate">{children}</span>
            {badge && <span className="shrink-0">{badge}</span>}
            {shortcut && (
                <span className="shrink-0 ml-auto text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                    {shortcut}
                </span>
            )}
        </button>
    );
};

export const DropdownMenuSeparator: React.FC = () => {
    return (
        <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-1.5 mx-1" />
    );
};
