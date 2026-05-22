/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
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

export interface OrbitLineChartProps extends Omit<ChartContainerProps, 'children'> {
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
  connectNulls?: boolean;
  curveType?: 'linear' | 'monotone' | 'step';
  animate?: boolean;
}

export const OrbitLineChart: React.FC<OrbitLineChartProps> = ({
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
  connectNulls = false,
  curveType = 'monotone',
  animate = true,
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
      // Don't allow deselecting all series
      if (activeSeries.length > 1) {
        setActiveSeries(activeSeries.filter((s) => s !== dataKey));
      } else {
        setActiveSeries(categories); // reset to all if clicking last one
      }
    } else {
      setActiveSeries([...activeSeries, dataKey]);
    }
  };

  const chartColors = colors || preset.colors;
  const gridStyle = mode === 'dark' ? GRID_LINE_CONFIG.dark : GRID_LINE_CONFIG.light;
  const axisStyle = mode === 'dark' ? AXIS_CONFIG.dark : AXIS_CONFIG.light;

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
        <RechartsLineChart
          data={data}
          margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
        >
          {showGridLines && (
            <CartesianGrid
              stroke={gridStyle.stroke}
              strokeDasharray={gridStyle.strokeDasharray}
              vertical={false}
              opacity={gridStyle.opacity}
            />
          )}

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

          {showTooltip && (
            <Tooltip
              content={
                <ChartTooltip 
                  valueFormatter={valueFormatter} 
                  formatterOptions={formatterOptions}
                />
              }
              cursor={{
                stroke: mode === 'dark' ? '#3f3f46' : '#e4e4e7',
                strokeWidth: 1.5,
                strokeDasharray: '4 4',
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
            const lineColor = chartColors[idx % chartColors.length] || '#0070f3';

            return (
              <Line
                key={category}
                name={category}
                type={curveType}
                dataKey={category}
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 1,
                  stroke: mode === 'dark' ? '#09090b' : '#ffffff',
                  fill: lineColor,
                }}
                connectNulls={connectNulls}
                hide={!isVisible}
                isAnimationActive={animate}
                animationDuration={ANIMATION_CONFIG.duration}
                animationEasing={ANIMATION_CONFIG.easing}
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default OrbitLineChart;
