import React, { useState } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     * The source URL of the image
     */
    src: string;
    /**
     * Alternate text for the image
     */
    alt: string;
    /**
     * How the image should resize to fit its container
     */
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    /**
     * Border radius of the image
     */
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /**
     * Fallback image source if the main image fails to load
     */
    fallbackSrc?: string;
    /**
     * Width of the image
     */
    width?: string | number;
    /**
     * Height of the image
     */
    height?: string | number;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(({
    src,
    alt,
    fit = 'cover',
    radius = 'none',
    fallbackSrc,
    width,
    height,
    className = '',
    onError,
    ...props
}, ref) => {
    const [hasError, setHasError] = useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (!hasError && fallbackSrc) {
            setHasError(true);
        }
        if (onError) {
            onError(e);
        }
    };

    const fitClasses = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
    };

    const radiusClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

    return (
        <img
            ref={ref}
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            onError={handleError}
            className={`
                block
                ${fitClasses[fit]}
                ${radiusClasses[radius]}
                ${className}
            `}
            style={{
                width: width,
                height: height,
            }}
            {...props}
        />
    );
});

Image.displayName = 'Image';
