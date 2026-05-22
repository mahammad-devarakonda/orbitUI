/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  ComposedChart as RechartsComposedChart,
  Line,
  Bar,
  Area,
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
import { ChartGradients, getChartFillUrl } from '../utils/gradients';
import { formatChartValue } from '../utils/formatters';
import type { FormatterOptions } from '../utils/formatters';

export interface ComposedSeriesConfig {
  key: string;
  color?: string;
  stackId?: string;
}

export interface OrbitComposedChartProps extends Omit<ChartContainerProps, 'children'> {
  data: any[];
  index: string;
  areas?: ComposedSeriesConfig[];
  bars?: ComposedSeriesConfig[];
  lines?: ComposedSeriesConfig[];
  valueFormatter?: (value: any) => string;
  formatterOptions?: FormatterOptions;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

export const OrbitComposedChart: React.FC<OrbitComposedChartProps> = ({
  data,
  index,
  areas = [],
  bars = [],
  lines = [],
  valueFormatter,
  formatterOptions,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  showLegend = true,
  showTooltip = true,
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

  // Create list of all categories to manage toggling
  const categories = React.useMemo(() => [
    ...areas.map((a) => a.key),
    ...bars.map((b) => b.key),
    ...lines.map((l) => l.key),
  ], [areas, bars, lines]);

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

  const chartColors = preset.colors;
  const gridStyle = mode === 'dark' ? GRID_LINE_CONFIG.dark : GRID_LINE_CONFIG.light;
  const axisStyle = mode === 'dark' ? AXIS_CONFIG.dark : AXIS_CONFIG.light;
  const uniqueId = React.useId().replace(/[^a-zA-Z0-9]/g, '');

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
        <RechartsComposedChart
          data={data}
          margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
        >
          <defs>
            <ChartGradients
              idPrefix={uniqueId}
              gradients={preset.gradients}
              colors={chartColors}
              opacityStart={mode === 'dark' ? 0.22 : 0.12}
              opacityEnd={0.0}
            />
          </defs>

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

          {/* 1. Areas */}
          {areas.map((series, idx) => {
            const isVisible = activeSeries.includes(series.key);
            const strokeColor = series.color || chartColors[idx % chartColors.length] || '#0070f3';
            
            const hasGradients = preset.gradients && preset.gradients.length > idx;
            const fillUrl = getChartFillUrl(uniqueId, idx, hasGradients);

            return (
              <Area
                key={series.key}
                name={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={strokeColor}
                strokeWidth={2}
                fill={fillUrl}
                activeDot={{
                  r: 5,
                  strokeWidth: 1,
                  stroke: mode === 'dark' ? '#09090b' : '#ffffff',
                  fill: strokeColor,
                }}
                stackId={series.stackId}
                hide={!isVisible}
                isAnimationActive={animate}
                animationDuration={ANIMATION_CONFIG.duration}
              />
            );
          })}

          {/* 2. Bars */}
          {bars.map((series, idx) => {
            const isVisible = activeSeries.includes(series.key);
            // Offset indexing to ensure unique color presets
            const colorIdx = (areas.length + idx) % chartColors.length;
            const barColor = series.color || chartColors[colorIdx] || '#10b981';

            return (
              <Bar
                key={series.key}
                name={series.key}
                dataKey={series.key}
                fill={barColor}
                radius={[4, 4, 0, 0]}
                stackId={series.stackId}
                hide={!isVisible}
                isAnimationActive={animate}
                animationDuration={ANIMATION_CONFIG.duration}
                maxBarSize={45}
              />
            );
          })}

          {/* 3. Lines */}
          {lines.map((series, idx) => {
            const isVisible = activeSeries.includes(series.key);
            const colorIdx = (areas.length + bars.length + idx) % chartColors.length;
            const lineColor = series.color || chartColors[colorIdx] || '#ff4e00';

            return (
              <Line
                key={series.key}
                name={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: mode === 'dark' ? '#09090b' : '#ffffff',
                  fill: lineColor,
                }}
                hide={!isVisible}
                isAnimationActive={animate}
                animationDuration={ANIMATION_CONFIG.duration}
              />
            );
          })}
        </RechartsComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default OrbitComposedChart;
