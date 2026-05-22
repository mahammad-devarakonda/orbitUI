/* eslint-disable react-refresh/only-export-components */
import React from 'react';

interface ChartGradientsProps {
  idPrefix: string;
  gradients?: string[][];
  colors?: string[];
  opacityStart?: number;
  opacityEnd?: number;
}

/**
 * ChartGradients renders a list of SVG linearGradient definitions inside Recharts <defs>.
 * This enables soft premium gradients for Area charts, Bar charts, and Line glows.
 */
export const ChartGradients: React.FC<ChartGradientsProps> = ({
  idPrefix,
  gradients,
  colors,
  opacityStart = 0.4,
  opacityEnd = 0.0,
}) => {
  // If absolute start/end gradient pairs are provided
  if (gradients && gradients.length > 0) {
    return (
      <>
        {gradients.map((pair, index) => {
          const startColor = pair[0] || '#0070f3';
          const endColor = pair[1] || 'rgba(0, 0, 0, 0)';
          return (
            <linearGradient
              key={`${idPrefix}-grad-${index}`}
              id={`${idPrefix}-grad-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={startColor} stopOpacity={opacityStart} />
              <stop offset="100%" stopColor={endColor} stopOpacity={opacityEnd} />
            </linearGradient>
          );
        })}
      </>
    );
  }

  // If a list of flat colors is provided, generate a fade-to-transparent gradient for each color
  if (colors && colors.length > 0) {
    return (
      <>
        {colors.map((color, index) => {
          return (
            <linearGradient
              key={`${idPrefix}-fade-${index}`}
              id={`${idPrefix}-fade-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={opacityStart} />
              <stop offset="100%" stopColor={color} stopOpacity={opacityEnd} />
            </linearGradient>
          );
        })}
      </>
    );
  }

  return null;
};

/**
 * Helper to get the fill url string based on gradient presence
 */
export const getChartFillUrl = (idPrefix: string, index: number, hasGradients: boolean): string => {
  return `url(#${idPrefix}-${hasGradients ? 'grad' : 'fade'}-${index})`;
};
