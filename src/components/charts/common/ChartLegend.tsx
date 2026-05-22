/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface ChartLegendProps {
  payload?: any[];
  onClick?: (dataKey: string) => void;
  activeSeries?: string[];
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  payload,
  onClick,
  activeSeries,
  align = 'left',
  className = '',
}) => {

  if (!payload || payload.length === 0) return null;

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium ${alignmentClasses[align]} ${className}`}>
      {payload.map((item, index) => {
        const { value, color, dataKey, id } = item;
        const key = dataKey || id || value;
        const isMuted = activeSeries && activeSeries.length > 0 && !activeSeries.includes(key);

        return (
          <button
            key={`${key}-${index}`}
            type="button"
            onClick={() => onClick && onClick(key)}
            className={`
              flex items-center gap-1.5 py-1 px-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60
              transition-all duration-200 select-none cursor-pointer
              ${isMuted ? 'opacity-40 line-through text-zinc-400 dark:text-zinc-500' : 'opacity-100 text-zinc-700 dark:text-zinc-300'}
            `}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-all duration-200"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize">{value}</span>
          </button>
        );
      })}
    </div>
  );
};
export default ChartLegend;
