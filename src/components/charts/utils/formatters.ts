/**
 * Utility functions for formatting values on chart axes and tooltips.
 */

export type FormatterType = 'number' | 'currency' | 'percent' | 'compact' | 'none';

export interface FormatterOptions {
  type?: FormatterType;
  currency?: string;
  decimals?: number;
}

/**
 * Formats a raw number value based on specified formatting options.
 */
export const formatChartValue = (
  value: number | string | undefined | null,
  options: FormatterOptions = {}
): string => {
  if (value === undefined || value === null) return '';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return String(value);

  const { type = 'number', currency = 'USD', decimals = 2 } = options;

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: decimals,
      }).format(numValue);

    case 'percent':
      // Assumes 1 is 1% if already scaled, or standard 0.01 is 1%?
      // Typically dashboards represent percentage directly as "95" meaning 95%.
      // Let's standardise: if the value is <= 1 and has high decimals, it could be decimal ratio.
      // But usually Recharts works with raw numbers like 95. We will append '%'.
      return `${numValue.toFixed(numValue % 1 === 0 ? 0 : decimals)}%`;

    case 'compact':
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      }).format(numValue);

    case 'number':
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: numValue % 1 === 0 ? 0 : decimals,
      }).format(numValue);

    case 'none':
    default:
      return String(value);
  }
};

/**
 * Preset shorthand formatters
 */
export const formatters = {
  currency: (val: number, curr = 'USD', dec = 0) => formatChartValue(val, { type: 'currency', currency: curr, decimals: dec }),
  percent: (val: number, dec = 1) => formatChartValue(val, { type: 'percent', decimals: dec }),
  compact: (val: number) => formatChartValue(val, { type: 'compact' }),
  number: (val: number, dec = 0) => formatChartValue(val, { type: 'number', decimals: dec }),
};
