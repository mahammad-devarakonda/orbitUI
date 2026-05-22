/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from '../theme/ChartThemeContext';
import { AXIS_CONFIG, GRID_LINE_CONFIG, ANIMATION_CONFIG } from '../theme/theme';
import { ChartContainer } from '../common/ChartContainer';
import type { ChartContainerProps } from '../common/ChartContainer';
import { ChartTooltip } from '../common/ChartTooltip';
import { ChartLegend } from '../common/ChartLegend';
import { formatChartValue } from '../utils/formatters';
import type { FormatterOptions } from '../utils/formatters';

export interface OrbitBarChartProps extends Omit<ChartContainerProps, 'children'> {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: any) => string;
  formatterOptions?: FormatterOptions;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  layout?: 'horizontal' | 'vertical';
  stack?: boolean;
  animate?: boolean;
  barRadius?: number;
}

export const OrbitBarChart: React.FC<OrbitBarChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  formatterOptions,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  showLegend = true,
  showTooltip = true,
  layout = 'horizontal',
  stack = false,
  animate = true,
  barRadius = 4,
  title,
  subtitle,
  isLoading,
  isEmpty,
  height,
  filters,
  activeFilter,
  onFilterChange,
  headerActions,
  className = '',
}) => {
  const { mode, preset } = useChartTheme();
  
  // Interactive series toggling
  const [activeSeries, setActiveSeries] = useState<string[]>(categories);

  useEffect(() => {
    setActiveSeries(categories);
  }, [categories]);

  const handleLegendClick = (dataKey: string) => {
    if (activeSeries.includes(dataKey)) {
      if (activeSeries.length > 1) {
        setActiveSeries(activeSeries.filter((s) => s !== dataKey));
      } else {
        setActiveSeries(categories);
      }
    } else {
      setActiveSeries([...activeSeries, dataKey]);
    }
  };

  const chartColors = colors || preset.colors;
  const gridStyle = mode === 'dark' ? GRID_LINE_CONFIG.dark : GRID_LINE_CONFIG.light;
  const axisStyle = mode === 'dark' ? AXIS_CONFIG.dark : AXIS_CONFIG.light;

  const isHorizontal = layout === 'horizontal';

  // Dynamic bar radius based on layout and stack state
  const getRadius = (idx: number, total: number): [number, number, number, number] => {
    if (!stack) {
      return isHorizontal 
        ? [barRadius, barRadius, 0, 0] 
        : [0, barRadius, barRadius, 0];
    }
    // For stacked charts, only the top-most visible item should be rounded.
    // However, Recharts dynamic rendering is simpler if we just apply it to all
    // or standardise. Standard: apply it slightly to the top edges.
    const isLast = idx === total - 1;
    if (isLast) {
      return isHorizontal 
        ? [barRadius, barRadius, 0, 0] 
        : [0, barRadius, barRadius, 0];
    }
    return [0, 0, 0, 0];
  };

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      isEmpty={isEmpty || !data || data.length === 0}
      height={height}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
      headerActions={headerActions}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 12, right: 12, left: isHorizontal ? -16 : 0, bottom: 0 }}
        >
          {showGridLines && (
            <CartesianGrid
              stroke={gridStyle.stroke}
              strokeDasharray={gridStyle.strokeDasharray}
              vertical={!isHorizontal}
              horizontal={isHorizontal}
              opacity={gridStyle.opacity}
            />
          )}

          {isHorizontal ? (
            <XAxis
              dataKey={index}
              hide={!showXAxis}
              stroke={axisStyle.stroke}
              fontSize={axisStyle.fontSize}
              tickLine={axisStyle.tickLine}
              axisLine={axisStyle.axisLine}
              tick={{ fill: axisStyle.fill }}
              dy={axisStyle.dy}
            />
          ) : (
            <XAxis
              type="number"
              hide={!showXAxis}
              stroke={axisStyle.stroke}
              fontSize={axisStyle.fontSize}
              tickLine={axisStyle.tickLine}
              axisLine={axisStyle.axisLine}
              tick={{ fill: axisStyle.fill }}
              tickFormatter={(val) => 
                valueFormatter 
                  ? valueFormatter(val) 
                  : formatChartValue(val, formatterOptions || { type: 'compact' })
              }
            />
          )}

          {isHorizontal ? (
            <YAxis
              hide={!showYAxis}
              stroke={axisStyle.stroke}
              fontSize={axisStyle.fontSize}
              tickLine={axisStyle.tickLine}
              axisLine={axisStyle.axisLine}
              tick={{ fill: axisStyle.fill }}
              dx={axisStyle.dx}
              tickFormatter={(val) => 
                valueFormatter 
                  ? valueFormatter(val) 
                  : formatChartValue(val, formatterOptions || { type: 'compact' })
              }
            />
          ) : (
            <YAxis
              dataKey={index}
              type="category"
              hide={!showYAxis}
              stroke={axisStyle.stroke}
              fontSize={axisStyle.fontSize}
              tickLine={axisStyle.tickLine}
              axisLine={axisStyle.axisLine}
              tick={{ fill: axisStyle.fill }}
            />
          )}

          {showTooltip && (
            <Tooltip
              content={
                <ChartTooltip 
                  valueFormatter={valueFormatter} 
                  formatterOptions={formatterOptions}
                />
              }
              cursor={{
                fill: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              }}
            />
          )}

          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              content={
                <ChartLegend
                  activeSeries={activeSeries}
                  onClick={handleLegendClick}
                />
              }
            />
          )}

          {categories.map((category, idx) => {
            const isVisible = activeSeries.includes(category);
            const barColor = chartColors[idx % chartColors.length] || '#0070f3';

            return (
              <Bar
                key={category}
                name={category}
                dataKey={category}
                fill={barColor}
                radius={getRadius(idx, activeSeries.length)}
                stackId={stack ? 'stacked' : undefined}
                hide={!isVisible}
                isAnimationActive={animate}
                animationDuration={ANIMATION_CONFIG.duration}
                animationEasing={ANIMATION_CONFIG.easing}
                maxBarSize={isHorizontal ? 60 : 36}
              />
            );
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default OrbitBarChart;
