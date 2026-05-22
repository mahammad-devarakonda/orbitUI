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
import { formatChartValue } from '../utils/formatters';
import type { FormatterOptions } from '../utils/formatters';

export interface OrbitDonutChartProps extends Omit<ChartContainerProps, 'children'> {
  data: any[];
  category: string;
  index: string;
  colors?: string[];
  valueFormatter?: (value: any) => string;
  formatterOptions?: FormatterOptions;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  innerRadius?: number | string;
  outerRadius?: number | string;
  
  // Center HUD options
  centerLabel?: string;
  centerValue?: string | number;
  showCenterHUD?: boolean;
}

export const OrbitDonutChart: React.FC<OrbitDonutChartProps> = ({
  data,
  category,
  index,
  colors,
  valueFormatter,
  formatterOptions,
  showLegend = true,
  showTooltip = true,
  animate = true,
  innerRadius = '65%',
  outerRadius = '80%',
  centerLabel = 'Total',
  centerValue,
  showCenterHUD = true,
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
  
  const [activeSeries, setActiveSeries] = useState<string[]>([]);
  const [hoveredSlice, setHoveredSlice] = useState<any | null>(null);

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

  // Calculate default total of all visible items
  const totalValue = filteredData.reduce((acc, curr) => acc + (Number(curr[category]) || 0), 0);

  const displayTotal = valueFormatter 
    ? valueFormatter(totalValue)
    : formatChartValue(totalValue, formatterOptions || { type: 'compact' });

  // Custom HUD display content based on hover state
  const hudLabel = hoveredSlice ? String(hoveredSlice[index]) : centerLabel;
  const hudValue = hoveredSlice 
    ? (valueFormatter ? valueFormatter(hoveredSlice[category]) : formatChartValue(hoveredSlice[category], formatterOptions))
    : (centerValue !== undefined ? centerValue : displayTotal);

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
      <div className="relative w-full h-full">
        {/* Center HUD Elements */}
        {showCenterHUD && !isLoading && !isEmpty && data && data.length > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none z-10">
            <div className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 max-w-[90px] sm:max-w-[120px] truncate mx-auto">
              {hudLabel}
            </div>
            <div className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-0.5 sm:mt-1 tabular-nums">
              {hudValue}
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            {showTooltip && !showCenterHUD && (
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
              onMouseEnter={(_, idx) => {
                if (showCenterHUD) setHoveredSlice(filteredData[idx]);
              }}
              onMouseLeave={() => {
                if (showCenterHUD) setHoveredSlice(null);
              }}
            >
              {filteredData.map((entry, idx) => {
                const rawIdx = data.findIndex(item => item[index] === entry[index]);
                const sliceColor = chartColors[rawIdx !== -1 ? rawIdx % chartColors.length : idx % chartColors.length];

                return (
                  <Cell 
                    key={`cell-${idx}`} 
                    fill={sliceColor} 
                    stroke={mode === 'dark' ? '#09090b' : '#ffffff'}
                    strokeWidth={2}
                    className="focus:outline-none"
                  />
                );
              })}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};
export default OrbitDonutChart;
