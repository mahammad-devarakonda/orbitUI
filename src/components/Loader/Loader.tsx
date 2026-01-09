import React from 'react';

export interface LoaderProps {

    variant?: 'spinner' | 'dots' | 'pulse' | 'multicolor' | 'orbit';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    color?: string;
    colors?: string[];
}

export const Loader: React.FC<LoaderProps> = ({
    variant = 'spinner',
    size = 'md',
    className = '',
    color,
    colors,
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const dotSize = {
        sm: 'w-1 h-1',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
    };

    const containerSize = sizeClasses[size];

    const defaultGradientClass = 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600';

    if (variant === 'dots') {
        const dSize = dotSize[size];

        const hasCustomColors = !!color || !!colors?.length;

        const getDotStyle = (index: number) => {
            if (!hasCustomColors) return {};
            const specificColor = colors?.[index] || color;
            return specificColor ? { backgroundColor: specificColor } : {};
        };

        const getDotClass = () => {
            return hasCustomColors ? '' : defaultGradientClass;
        };

        return (
            <div className={`flex items-center justify-center gap-1 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`${dSize} rounded-full animate-bounce ${getDotClass()}`}
                        style={{
                            ...getDotStyle(i),
                            animationDelay: i === 0 ? '-0.3s' : i === 1 ? '-0.15s' : '0s'
                        }}
                    />
                ))}
            </div>
        );
    }

    // 3. Pulse
    if (variant === 'pulse') {
        const bgClass = color ? '' : defaultGradientClass;
        return (
            <div className={`relative flex items-center justify-center ${containerSize} ${className}`}>
                <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${bgClass}`}
                    style={color ? { backgroundColor: color } : {}}
                />
                <span
                    className={`relative inline-flex rounded-full h-3/4 w-3/4 ${bgClass}`}
                    style={color ? { backgroundColor: color } : {}}
                />
            </div>
        );
    }

    // 4. Multicolor (Social Media / Instagram-like)
    // NOTE: 'spinner' without color now looks identical to this, but keeping it for backward compatibility/explicit usage
    if (variant === 'multicolor') {
        return (
            <div className={`${containerSize} relative ${className}`}>
                <div className={`absolute inset-0 rounded-full ${defaultGradientClass} animate-spin`}>
                    <div className="absolute inset-[3px] bg-white rounded-full"></div>
                </div>
            </div>
        );
    }

    // 5. Orbit (Two rings rotating oppositely)
    if (variant === 'orbit') {
        if (color) {
            return (
                <div className={`relative ${containerSize} ${className}`}>
                    <div
                        className="absolute inset-0 rounded-full border-2 border-t-transparent border-b-transparent animate-spin"
                        style={{ borderColor: color, borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                    />
                    <div
                        className="absolute inset-1 rounded-full border-2 border-l-transparent border-r-transparent animate-spin-reverse opacity-75"
                        style={{ borderColor: color, borderLeftColor: 'transparent', borderRightColor: 'transparent', animationDirection: 'reverse', animationDuration: '1.5s' }}
                    />
                </div>
            );
        }

        // Gradient Orbit
        return (
            <div className={`relative ${containerSize} ${className}`}>
                <div className={`absolute inset-0 rounded-full ${defaultGradientClass} animate-spin`}>
                    <div className="absolute inset-[2px] bg-white rounded-full"></div>
                    {/* Mask to simulate gaps for orbit effect? 
                         A full ring orbit is just a spinning ring. 
                         The original orbit had gaps (border-transparent).
                         To replicate breaks in the gradient, we can use a white blocker or mask.
                         For simplicity and coolness, we'll stick to full rings or maybe adding a transparent gradient mask if supported.
                         Let's do two eccentric full rings for now, one smaller.
                     */}
                </div>
                <div className={`absolute inset-1 rounded-full ${defaultGradientClass} animate-spin-reverse opacity-75`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
                    <div className="absolute inset-[2px] bg-white rounded-full"></div>
                </div>
            </div>
        );
    }

    return null;
};
