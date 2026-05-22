/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from '../theme/ChartThemeContext';
import { ANIMATION_CONFIG } from '../theme/theme';
import { ChartContainer } from '../common/ChartContainer';
import type { ChartContainerProps } from '../common/ChartContainer';
import { ChartTooltip } from '../common/ChartTooltip';
import { ChartLegend } from '../common/ChartLegend';
import type { FormatterOptions } from '../utils/formatters';

export interface OrbitPieChartProps extends Omit<ChartContainerProps, 'children'> {
  data: any[];
  category: string; // The field that holds the values
  index: string;    // The field that holds the labels/names
  colors?: string[];
  valueFormatter?: (value: any) => string;
  formatterOptions?: FormatterOptions;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  innerRadius?: number | string;
  outerRadius?: number | string;
}

export const OrbitPieChart: React.FC<OrbitPieChartProps> = ({
  data,
  category,
  index,
  colors,
  valueFormatter,
  formatterOptions,
  showLegend = true,
  showTooltip = true,
  animate = true,
  innerRadius = 0,
  outerRadius = '80%',
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
  
  // Legend state
  const [activeSeries, setActiveSeries] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveSeries(data.map((item) => String(item[index])));
    }
  }, [data, index]);

  const handleLegendClick = (dataKey: string) => {
    if (activeSeries.includes(dataKey)) {
      if (activeSeries.length > 1) {
        setActiveSeries(activeSeries.filter((s) => s !== dataKey));
      } else {
        setActiveSeries(data.map((item) => String(item[index])));
      }
    } else {
      setActiveSeries([...activeSeries, dataKey]);
    }
  };

  const chartColors = colors || preset.colors;
  const filteredData = data ? data.filter((item) => activeSeries.includes(String(item[index]))) : [];

  // Adapt the Recharts payload structure for the custom legend
  const legendPayload = data 
    ? data.map((item, idx) => ({
        value: item[index],
        color: chartColors[idx % chartColors.length],
        dataKey: item[index],
        id: item[index],
      }))
    : [];

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
        <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
                  payload={legendPayload}
                  activeSeries={activeSeries}
                  onClick={handleLegendClick}
                />
              }
            />
          )}

          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey={category}
            nameKey={index}
            isAnimationActive={animate}
            animationDuration={ANIMATION_CONFIG.duration}
            animationEasing={ANIMATION_CONFIG.easing}
          >
            {filteredData.map((entry, idx) => {
              // Track actual index in raw data to preserve color mapping consistency
              const rawIdx = data.findIndex(item => item[index] === entry[index]);
              const sliceColor = chartColors[rawIdx !== -1 ? rawIdx % chartColors.length : idx % chartColors.length];

              return (
                <Cell 
                  key={`cell-${idx}`} 
                  fill={sliceColor} 
                  stroke={mode === 'dark' ? '#09090b' : '#ffffff'}
                  strokeWidth={2}
                />
              );
            })}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default OrbitPieChart;
