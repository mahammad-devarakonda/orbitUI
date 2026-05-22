/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useChartTheme } from '../theme/ChartThemeContext';
import { formatChartValue } from '../utils/formatters';
import type { FormatterOptions } from '../utils/formatters';

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
  valueFormatter?: (value: any) => string;
  formatterOptions?: FormatterOptions;
  labelFormatter?: (label: any) => string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  valueFormatter,
  formatterOptions,
  labelFormatter,
}) => {
  const { mode } = useChartTheme();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div className={`
      backdrop-blur-md rounded-xl border p-3.5 shadow-2xl transition-all duration-200 min-w-[180px]
      ${mode === 'dark' 
        ? 'bg-zinc-950/85 border-zinc-800/80 text-zinc-100' 
        : 'bg-white/90 border-zinc-200/80 text-zinc-800'
      }
    `}>
      {formattedLabel && (
        <div className="mb-2 text-xs font-semibold tracking-wide uppercase text-zinc-400 dark:text-zinc-500">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((item, idx) => {
          const color = item.color || item.payload?.fill || '#0070f3';
          const name = item.name || item.dataKey;
          const rawValue = item.value;
          
          const displayValue = valueFormatter 
            ? valueFormatter(rawValue)
            : formatChartValue(rawValue, formatterOptions);

          return (
            <div key={`${name}-${idx}`} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium text-zinc-600 dark:text-zinc-300 capitalize">
                  {name}
                </span>
              </div>
              <span className="font-semibold text-zinc-900 dark:text-white tabular-nums">
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChartTooltip;
