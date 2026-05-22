import React from 'react';

export interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  height?: number | string;
  className?: string;
  headerActions?: React.ReactNode;
  
  // Segmented filters support
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  isLoading = false,
  isEmpty = false,
  height = 350,
  className = '',
  headerActions,
  filters,
  activeFilter,
  onFilterChange,
  children,
}) => {


  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  // Modern grid skeleton loader
  const renderSkeleton = () => (
    <div 
      className="w-full flex flex-col justify-between animate-pulse" 
      style={{ height: containerHeight }}
    >
      <div className="flex justify-between items-baseline mb-6">
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-48" />
          <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-32" />
        </div>
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-40" />
      </div>
      <div className="flex-1 flex gap-4 items-end pb-4 border-b border-zinc-100 dark:border-zinc-800">
        {[...Array(8)].map((_, i) => {
          const heights = ['h-24', 'h-48', 'h-36', 'h-56', 'h-32', 'h-64', 'h-40', 'h-52'];
          return (
            <div 
              key={i} 
              className={`flex-1 ${heights[i % heights.length]} bg-zinc-100 dark:bg-zinc-900 rounded-t-md`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-3 px-2">
        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-12" />
        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-12" />
        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-12" />
        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-12" />
      </div>
    </div>
  );

  // Modern minimal illustration for empty state
  const renderEmptyState = () => (
    <div 
      className="w-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
      style={{ height: containerHeight }}
    >
      <svg
        className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4 stroke-1.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v16.5m0 0a1.5 1.5 0 001.5 1.5h16.5M5.25 18.75h16.5M16.5 9l-3.75 3.75L10.5 10.5 5.25 15.75"
        />
      </svg>
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        No Data Available
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px]">
        There is currently no metric data matching the selected date ranges.
      </p>
    </div>
  );

  return (
    <div className={`w-full flex flex-col font-sans ${className}`}>
      {/* Header section */}
      {(title || subtitle || headerActions || filters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            {/* Segmented Filter Control */}
            {filters && filters.length > 0 && (
              <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40">
                {filters.map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => onFilterChange && onFilterChange(filter)}
                      className={`
                        px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 select-none cursor-pointer
                        ${isActive 
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }
                      `}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            )}
            
            {headerActions}
          </div>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="relative w-full flex-1">
        {isLoading ? (
          renderSkeleton()
        ) : isEmpty ? (
          renderEmptyState()
        ) : (
          <div className="w-full" style={{ height: containerHeight }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
export default ChartContainer;
