/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useChartTheme } from '../theme/ChartThemeContext';
import { OrbitLineChart } from '../LineChart/OrbitLineChart';

export interface OrbitAnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  
  // Trend Metrics
  change?: number; // e.g. +12.5 or -4.2
  changeLabel?: string; // e.g. "from last month"
  
  // Controls
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  isLoading?: boolean;
  
  // Sparkline specific
  sparklineData?: any[];
  sparklineCategory?: string;
  sparklineColor?: string;
  
  // General
  children?: React.ReactNode;
  className?: string;
}

export const OrbitAnalyticsCard: React.FC<OrbitAnalyticsCardProps> = ({
  title,
  value,
  description,
  change,
  changeLabel,
  filters,
  activeFilter,
  onFilterChange,
  isLoading = false,
  sparklineData,
  sparklineCategory,
  sparklineColor,
  children,
  className = '',
}) => {
  const { mode } = useChartTheme();

  const isPositive = change !== undefined && change >= 0;
  const trendColor = isPositive 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : 'text-rose-600 dark:text-rose-400';
  
  const trendBg = isPositive 
    ? 'bg-emerald-50 dark:bg-emerald-950/30' 
    : 'bg-rose-50 dark:bg-rose-950/30';

  return (
    <div className={`
      rounded-2xl border p-6 font-sans transition-all duration-300 shadow-sm
      ${mode === 'dark' 
        ? 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-zinc-950/50' 
        : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-100/50'
      }
      ${className}
    `}>
      {/* Top Title and Actions Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-400 dark:text-zinc-500">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {/* Filter segment control inside card */}
        {filters && filters.length > 0 && !isLoading && (
          <div className="inline-flex p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200/30 dark:border-zinc-800/30 shrink-0">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onFilterChange && onFilterChange(filter)}
                  className={`
                    px-2.5 py-0.5 text-[10px] font-semibold rounded transition-all duration-200 select-none cursor-pointer
                    ${isActive 
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-sm' 
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
      </div>

      {/* Main Metric Value & Trend Info */}
      <div className="flex flex-wrap items-baseline gap-3 mt-4">
        <div className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 tabular-nums">
          {isLoading ? (
            <div className="h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>

        {change !== undefined && !isLoading && (
          <div className={`flex items-center gap-1 py-0.5 px-2 rounded-full text-xs font-semibold ${trendColor} ${trendBg}`}>
            {isPositive ? (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-current rotate-180" viewBox="0 0 24 24">
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
              </svg>
            )}
            <span>{isPositive ? '+' : ''}{change}%</span>
            {changeLabel && (
              <span className="text-[10px] opacity-75 font-normal ml-0.5">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Inner Chart Content */}
      <div className="mt-6 w-full">
        {isLoading ? (
          <div className="w-full h-[120px] bg-zinc-100 dark:bg-zinc-900/60 rounded-xl animate-pulse flex items-center justify-center">
            <div className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">Loading metrics...</div>
          </div>
        ) : sparklineData && sparklineCategory ? (
          // Mini borderless sparkline
          <div className="h-[60px] -mx-4 -mb-2">
            <OrbitLineChart
              data={sparklineData}
              index="x" // standard index mapping for sparkline lists
              categories={[sparklineCategory]}
              colors={[sparklineColor || (isPositive ? '#10b981' : '#f43f5e')]}
              showXAxis={false}
              showYAxis={false}
              showGridLines={false}
              showLegend={false}
              showTooltip={true}
              height={60}
              animate={true}
            />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
export default OrbitAnalyticsCard;
