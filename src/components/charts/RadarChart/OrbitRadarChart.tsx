/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

export interface OrbitRadarChartProps extends Omit<ChartContainerProps, 'children'> {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: any) => string;
  formatterOptions?: FormatterOptions;
  showGridLines?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  gridType?: 'polygon' | 'circle';
}

export const OrbitRadarChart: React.FC<OrbitRadarChartProps> = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  formatterOptions,
  showGridLines = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  gridType = 'polygon',
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
        <RechartsRadarChart
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="75%"
        >
          {showGridLines && (
            <PolarGrid
              gridType={gridType}
              stroke={gridStyle.stroke}
              opacity={0.7}
            />
          )}

          <PolarAngleAxis
            dataKey={index}
            stroke={axisStyle.stroke}
            fontSize={10}
            tick={{ fill: axisStyle.fill, fontWeight: 500 }}
          />

          <PolarRadiusAxis
            angle={30}
            stroke={axisStyle.stroke}
            fontSize={9}
            tick={{ fill: axisStyle.fill }}
            axisLine={false}
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
            const radarColor = chartColors[idx % chartColors.length] || '#0070f3';

            return (
              <Radar
                key={category}
                name={category}
                dataKey={category}
                stroke={radarColor}
                fill={radarColor}
                fillOpacity={0.25}
                strokeWidth={2}
                hide={!isVisible}
                isAnimationActive={animate}
                animationDuration={ANIMATION_CONFIG.duration}
                animationEasing={ANIMATION_CONFIG.easing}
              />
            );
          })}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default OrbitRadarChart;
