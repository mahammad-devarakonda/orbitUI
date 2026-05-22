import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme } from '../theme/ChartThemeContext';
import { ChartContainer } from '../common/ChartContainer';
import type { ChartContainerProps } from '../common/ChartContainer';

export interface OrbitRadialProgressProps extends Omit<ChartContainerProps, 'children'> {
  value: number; // 0 to 100
  label?: string; // Text label underneath percentage (e.g. "Completed")
  color?: string; // Primary progress color
  trackColor?: string; // Color of the grey circular path
  size?: number | string;
  animate?: boolean;
}

export const OrbitRadialProgress: React.FC<OrbitRadialProgressProps> = ({
  value,
  label = 'Completed',
  color,
  trackColor,
  size = 200,
  animate = true,
  title,
  subtitle,
  isLoading,
  isEmpty,
  className = '',
}) => {
  const { mode, preset } = useChartTheme();

  // Clamp value between 0 and 100
  const progress = Math.min(Math.max(value, 0), 100);

  // Recharts data format: 1 item mapping raw progress and remaining track
  const chartData = [
    {
      name: 'Progress',
      value: progress,
    },
  ];

  const primaryColor = color || preset.primary;
  const secondaryColor = trackColor || (mode === 'dark' ? '#27272a' : '#f4f4f5');

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      isEmpty={isEmpty}
      height={size}
      className={className}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* HUD Center Progress Metrics */}
        {!isLoading && !isEmpty && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none z-10">
            <div className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
              {progress}%
            </div>
            {label && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1 max-w-[100px] truncate">
                {label}
              </div>
            )}
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="95%"
            barSize={12}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            {/* Background Track Circle */}
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            
            <RadialBar
              background={{ fill: secondaryColor }}
              dataKey="value"
              cornerRadius={6}
              fill={primaryColor}
              isAnimationActive={animate}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};
export default OrbitRadialProgress;
