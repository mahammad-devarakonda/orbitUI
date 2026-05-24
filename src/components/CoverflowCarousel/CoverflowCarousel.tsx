import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CoverflowCarouselProps {
  /** Array of React elements to render as carousel items */
  items: ReactNode[];
  /** Initial active slide index */
  initialIndex?: number;
  /** Callback fired when the active index changes */
  onIndexChange?: (index: number) => void;
  /** Additional CSS classes for the container */
  className?: string;
  /** Height of the carousel container (e.g. "h-[400px]", "h-96") */
  heightClass?: string;
  /** Whether to auto-play the carousel */
  autoPlay?: boolean;
  /** Interval in milliseconds for auto-play */
  autoPlayInterval?: number;
}

export const CoverflowCarousel: React.FC<CoverflowCarouselProps> = ({
  items,
  initialIndex = 0,
  onIndexChange,
  className = "",
  heightClass = "h-[450px]",
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(activeIndex);
    }
  }, [activeIndex, onIndexChange]);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, handleNext]);

  return (
    <div className={`relative w-full overflow-hidden py-10 flex flex-col items-center justify-center ${className}`}>
      {/* Cards Container */}
      <div className={`relative w-full max-w-6xl ${heightClass} flex justify-center items-center perspective-1000`}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => {
            // Calculate distance from active index to handle infinite wrap-around visually
            let offset = index - activeIndex;
            if (offset > items.length / 2) offset -= items.length;
            if (offset < -items.length / 2) offset += items.length;

            const isCenter = offset === 0;
            const zIndex = 50 - Math.abs(offset);

            // Adjust scale based on distance from center
            const scale = isCenter ? 1 : Math.max(0.7, 1 - Math.abs(offset) * 0.15);

            // Adjust horizontal translation
            // Center is 0, adjacent is ~30%, next is ~50%
            const translateX = isCenter ? "0%" : `${Math.sign(offset) * (40 + Math.abs(offset) * 15)}%`;

            // Brightness dims the inactive cards to give focus to the center
            const opacity = Math.abs(offset) > 2 ? 0 : 1;
            const brightness = isCenter ? 1 : 0.3;

            if (opacity === 0) return null;

            return (
              <motion.div
                key={index}
                className="absolute w-[85%] md:w-[65%] lg:w-[55%] h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                style={{ zIndex }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: translateX,
                  scale,
                  opacity,
                  filter: `brightness(${brightness})`,
                  zIndex,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                onClick={() => {
                  if (!isCenter) setActiveIndex(index);
                }}
              >
                {item}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation & Pagination */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? "w-8 bg-gray-300" : "w-1.5 bg-gray-600 hover:bg-gray-400"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
