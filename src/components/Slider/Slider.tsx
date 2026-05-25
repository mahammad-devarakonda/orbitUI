import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SliderProps {
  /** Optional title for the slider section */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional "see all" label and click handler */
  seeAll?: { label?: string; onClick: () => void };
  /** Children elements/cards to render in the slider */
  children: React.ReactNode;
  /** Additional CSS classes for the outer wrapper */
  className?: string;
  /** Additional CSS classes for the horizontal scroll container */
  containerClassName?: string;
  /** Whether to show the navigation chevrons */
  showControls?: boolean;
  /** Whether to show dot page indicators below the track */
  showDots?: boolean;
  /**
   * When true, chevron clicks advance by a full "page" of visible cards
   * rather than 75% of the container width.
   */
  snapToPage?: boolean;
  /**
   * Gap (in px) between cards. Must match the gap applied to child cards
   * so page-snapping math stays accurate. Defaults to 16.
   */
  gap?: number;
}

export const Slider: React.FC<SliderProps> = ({
  title,
  subtitle,
  seeAll,
  children,
  className = '',
  containerClassName = '',
  showControls = true,
  showDots = true,
  snapToPage = true,
  gap = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ─── helpers ──────────────────────────────────────────────────────────────

  /** Width of the first rendered card child (used for page-snap maths). */
  const getCardWidth = useCallback((): number => {
    const el = containerRef.current?.firstElementChild as HTMLElement | null;
    return el ? el.offsetWidth : 200;
  }, []);

  /** How many full cards are visible at once. */
  const getVisibleCount = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 1;
    const cw = getCardWidth();
    return Math.max(1, Math.floor((container.clientWidth + gap) / (cw + gap)));
  }, [gap, getCardWidth]);

  const updateState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // scroll boundary flags
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);

    // current page & total pages
    const cw = getCardWidth();
    const vis = getVisibleCount();
    const pageWidth = (cw + gap) * vis;
    const pages = Math.ceil(
      (container.children.length) / vis
    );
    setTotalPages(pages);
    setCurrentPage(Math.round(scrollLeft / pageWidth));
  }, [gap, getCardWidth, getVisibleCount]);

  // ─── effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateState();
    container.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);

    return () => {
      container.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [children, updateState]);

  // ─── scroll actions ────────────────────────────────────────────────────────

  const scrollToPage = (page: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cw = getCardWidth();
    const vis = getVisibleCount();
    container.scrollTo({
      left: page * (cw + gap) * vis,
      behavior: 'smooth',
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    if (snapToPage) {
      const delta = direction === 'left' ? -1 : 1;
      const nextPage = Math.min(
        Math.max(0, currentPage + delta),
        totalPages - 1
      );
      scrollToPage(nextPage);
    } else {
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollTo({
        left:
          container.scrollLeft +
          (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth',
      });
    }
  };

  // ─── render ───────────────────────────────────────────────────────────────

  const childArray = React.Children.toArray(children).filter(Boolean);

  return (
    <div className={`w-full select-none ${className}`}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {(title || subtitle || seeAll) && (
        <div className="flex items-end justify-between mb-3 px-1">
          <div>
            {title && (
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm mt-0.5 text-gray-500">{subtitle}</p>
            )}
          </div>

          {seeAll && (
            <button
              onClick={seeAll.onClick}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0 ml-4"
            >
              {seeAll.label ?? 'See all'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}



      {/* ── Slider ─────────────────────────────────────────────────────────── */}
      <div className="relative group/slider w-full">

        {/* Left button */}
        {showControls && (
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={[
              'absolute left-[-18px] top-1/2 -translate-y-[calc(50%+8px)] z-10',
              'flex items-center justify-center w-9 h-9 rounded-full',
              'border border-gray-200 bg-white text-gray-700 shadow-sm',
              'transition-all duration-200',
              'hover:bg-gray-50 active:scale-95',
              canScrollLeft
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            ].join(' ')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Track */}
        <div
          ref={containerRef}
          style={{ gap: `${gap}px` }}
          className={[
            'flex overflow-x-auto scroll-smooth',
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
            'snap-x snap-mandatory pb-4 px-1',
            containerClassName,
          ].join(' ')}
        >
          {childArray.map((child, i) => (
            <div key={i} className="flex-none snap-start">
              {child}
            </div>
          ))}
        </div>

        {/* Right button */}
        {showControls && (
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={[
              'absolute right-[-18px] top-1/2 -translate-y-[calc(50%+8px)] z-10',
              'flex items-center justify-center w-9 h-9 rounded-full',
              'border border-gray-200 bg-white text-gray-700 shadow-sm',
              'transition-all duration-200',
              'hover:bg-gray-50 active:scale-95',
              canScrollRight
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            ].join(' ')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Dot indicators ─────────────────────────────────────────────────── */}
      {showDots && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={[
                'rounded-full transition-all duration-200',
                i === currentPage
                  ? 'w-4 h-1.5 bg-gray-500'
                  : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;