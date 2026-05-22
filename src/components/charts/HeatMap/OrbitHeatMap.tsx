/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from '../theme/ChartThemeContext';
import { AXIS_CONFIG } from '../theme/theme';
import { ChartContainer } from '../common/ChartContainer';
import type { ChartContainerProps } from '../common/ChartContainer';
import { ChartTooltip } from '../common/ChartTooltip';

export interface HeatMapData {
  x: string | number;
  y: string | number;
  value: number;
  [key: string]: any;
}

export interface OrbitHeatMapProps extends Omit<ChartContainerProps, 'children'> {
  data: HeatMapData[];
  xKey?: string;
  yKey?: string;
  valueKey?: string;
  colors?: string[]; // Shade colors from low to high intensity (e.g. ['#e4e4e7', '#c2f3fc', '#06b6d4', '#0891b2'])
  valueFormatter?: (value: any) => string;
  showTooltip?: boolean;
}

export const OrbitHeatMap: React.FC<OrbitHeatMapProps> = ({
  data,
  xKey = 'x',
  yKey = 'y',
  valueKey = 'value',
  colors,
  valueFormatter,
  showTooltip = true,
  title,
  subtitle,
  isLoading,
  isEmpty,
  height = 240,
  filters,
  activeFilter,
  onFilterChange,
  headerActions,
  className = '',
}) => {
  const { mode, preset } = useChartTheme();
  
  const axisStyle = mode === 'dark' ? AXIS_CONFIG.dark : AXIS_CONFIG.light;

  // Extract unique X and Y values to scale axes properly
  const xValues = Array.from(new Set(data.map((d: any) => d[xKey])));
  const yValues = Array.from(new Set(data.map((d: any) => d[yKey])));

  // Calculate value ranges for color interpolation
  const values = data.map((d: any) => Number(d[valueKey]) || 0);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 100);

  // Set default color scale matching active theme preset
  const defaultColors = colors || (mode === 'dark' 
    ? ['#18181b', '#27272a', preset.primary] // dark base
    : ['#f4f4f5', '#e4e4e7', preset.primary] // light base
  );

  // Interpolate color based on value intensity
  const getCellColor = (val: number): string => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    
    // Low value
    if (ratio <= 0.1) return defaultColors[0] || '#f4f4f5';
    // Mid value
    if (ratio <= 0.5) return defaultColors[1] || '#e4e4e7';
    // High value
    return defaultColors[2] || preset.primary;
  };

  const renderCellShape = (props: any) => {
    const { cx, cy, payload } = props;
    const value = payload[valueKey];
    const cellColor = getCellColor(value);
    
    const size = 18; // Fixed elegant size for square grid tile

    return (
      <rect
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        rx={3}
        fill={cellColor}
        className="transition-all duration-300 hover:scale-110 hover:stroke-zinc-400 dark:hover:stroke-zinc-500"
        strokeWidth={1}
        stroke="transparent"
      />
    );
  };

  // Convert category strings to continuous scales for Scatter mapping
  const formattedData: (HeatMapData & { xVal: number; yVal: number })[] = data.map((item) => ({
    ...item,
    // Scatter needs numerical coordinates. We map indices of distinct x/y labels.
    xVal: xValues.indexOf(item[xKey]),
    yVal: yValues.indexOf(item[yKey]),
  }));

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
        <ScatterChart margin={{ top: 12, right: 12, bottom: 0, left: 16 }}>
          <XAxis
            type="number"
            dataKey="xVal"
            name="X Label"
            domain={[0, xValues.length - 1]}
            ticks={Array.from({ length: xValues.length }, (_, i) => i)}
            tickFormatter={(idx) => String(xValues[idx] || '')}
            stroke={axisStyle.stroke}
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tick={{ fill: axisStyle.fill }}
            dy={axisStyle.dy}
          />

          <YAxis
            type="number"
            dataKey="yVal"
            name="Y Label"
            domain={[0, yValues.length - 1]}
            ticks={Array.from({ length: yValues.length }, (_, i) => i)}
            tickFormatter={(idx) => String(yValues[idx] || '')}
            stroke={axisStyle.stroke}
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tick={{ fill: axisStyle.fill }}
            dx={axisStyle.dx}
          />

          <ZAxis type="number" dataKey={valueKey} domain={[minVal, maxVal]} />

          {showTooltip && (
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: mode === 'dark' ? '#27272a' : '#e4e4e7' }}
              content={
                <ChartTooltip
                  labelFormatter={() => ''} // Tooltip handles values beautifully directly
                  valueFormatter={valueFormatter}
                />
              }
            />
          )}

          <Scatter
            data={formattedData}
            shape={renderCellShape}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCellColor(entry[valueKey])} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
export default OrbitHeatMap;
