// Orbit UI Charting System Design Tokens and Theme Configuration

export type ChartThemeName = 'default' | 'vercel' | 'stripe' | 'linear' | 'tremor';

export interface ChartColorPreset {
  primary: string;
  gradients: string[][];
  colors: string[];
  mutedColors: string[];
}

export const CHART_PRESETS: Record<ChartThemeName, ChartColorPreset> = {
  default: {
    primary: '#0070f3', // Orbit Blue
    gradients: [
      ['#0070f3', '#00dfd8'], // Blue to Cyan
      ['#7928ca', '#ff0080'], // Purple to Pink
      ['#ff4e00', '#ec9f05'], // Orange to Yellow
      ['#10b981', '#059669'], // Emerald
      ['#f59e0b', '#d97706'], // Amber
    ],
    colors: [
      '#0070f3', // Blue
      '#7928ca', // Purple
      '#ff4e00', // Orange
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#6366f1', // Indigo
    ],
    mutedColors: [
      'rgba(0, 112, 243, 0.15)',
      'rgba(121, 40, 202, 0.15)',
      'rgba(255, 78, 0, 0.15)',
      'rgba(16, 185, 129, 0.15)',
      'rgba(245, 158, 11, 0.15)',
      'rgba(236, 72, 153, 0.15)',
      'rgba(99, 102, 241, 0.15)',
    ],
  },
  vercel: {
    primary: '#000000', // Black/White
    gradients: [
      ['#000000', '#4a4a4a'], // Graphite
      ['#888888', '#e5e5e5'], // Soft Gray
      ['#22c55e', '#4ade80'], // Green
      ['#ef4444', '#f87171'], // Red
      ['#3b82f6', '#60a5fa'], // Blue
    ],
    colors: [
      '#000000', // Pure Black (rendered dark/light context)
      '#666666', // Mid Gray
      '#888888', // Light Gray
      '#111111', // Dark Gray
      '#a1a1aa', // Zinc
      '#71717a', // Slate
    ],
    mutedColors: [
      'rgba(0, 0, 0, 0.08)',
      'rgba(102, 102, 102, 0.08)',
      'rgba(136, 136, 136, 0.08)',
      'rgba(17, 17, 17, 0.08)',
      'rgba(161, 161, 170, 0.08)',
      'rgba(113, 113, 122, 0.08)',
    ],
  },
  stripe: {
    primary: '#635bff', // Stripe Blurple
    gradients: [
      ['#635bff', '#80e9ff'], // Blurple to Light Cyan
      ['#ff5d8f', '#ffb7b2'], // Hot Pink to Pale Peach
      ['#3ecf8e', '#a2f5d0'], // Stripe Green
      ['#f3a935', '#fce38a'], // Orange Yellow
      ['#7f5af0', '#2cb67d'], // Purple Green
    ],
    colors: [
      '#635bff', // Blurple
      '#0a85ea', // Sky Blue
      '#3ecf8e', // Stripe Green
      '#ff5d8f', // Rose Pink
      '#f3a935', // Orange
      '#7f5af0', // Purple
    ],
    mutedColors: [
      'rgba(99, 91, 255, 0.15)',
      'rgba(10, 133, 234, 0.15)',
      'rgba(62, 207, 142, 0.15)',
      'rgba(255, 93, 143, 0.15)',
      'rgba(243, 169, 53, 0.15)',
      'rgba(127, 90, 240, 0.15)',
    ],
  },
  linear: {
    primary: '#5e6ad2', // Linear Indigo
    gradients: [
      ['#5e6ad2', '#b4b9e6'], // Cool Indigo
      ['#f48c06', '#ffba08'], // Amber Flame
      ['#00f5d4', '#7b2cbf'], // Cyan to Purple
      ['#e63946', '#f1faee'], // Red Coral
      ['#2a9d8f', '#e9c46a'], // Teal/Gold
    ],
    colors: [
      '#5e6ad2', // Linear Indigo
      '#f48c06', // Linear Amber
      '#00f5d4', // Linear Cyan
      '#e63946', // Coral
      '#2a9d8f', // Teal
      '#7b2cbf', // Violet
    ],
    mutedColors: [
      'rgba(94, 106, 210, 0.15)',
      'rgba(244, 140, 6, 0.15)',
      'rgba(0, 245, 212, 0.15)',
      'rgba(230, 57, 70, 0.15)',
      'rgba(42, 157, 143, 0.15)',
      'rgba(123, 44, 191, 0.15)',
    ],
  },
  tremor: {
    primary: '#3b82f6', // Tremor Blue
    gradients: [
      ['#3b82f6', '#93c5fd'], // Blue
      ['#10b981', '#6ee7b7'], // Emerald
      ['#8b5cf6', '#c4b5fd'], // Violet
      ['#f43f5e', '#fda4af'], // Rose
      ['#f59e0b', '#fde047'], // Amber
    ],
    colors: [
      '#3b82f6', // Blue
      '#10b981', // Emerald
      '#8b5cf6', // Violet
      '#f43f5e', // Rose
      '#f59e0b', // Amber
      '#06b6d4', // Cyan
    ],
    mutedColors: [
      'rgba(59, 130, 246, 0.15)',
      'rgba(16, 185, 129, 0.15)',
      'rgba(139, 92, 246, 0.15)',
      'rgba(244, 63, 94, 0.15)',
      'rgba(245, 158, 11, 0.15)',
      'rgba(6, 182, 212, 0.15)',
    ],
  },
};

export const GRID_LINE_CONFIG = {
  light: {
    stroke: '#e4e4e7', // Zinc 200
    strokeDasharray: '3 3',
    opacity: 0.8,
  },
  dark: {
    stroke: '#27272a', // Zinc 800
    strokeDasharray: '3 3',
    opacity: 0.8,
  },
};

export const AXIS_CONFIG = {
  light: {
    stroke: '#a1a1aa', // Zinc 400
    tickLine: false,
    axisLine: false,
    fontSize: 11,
    fill: '#71717a', // Zinc 600
    dy: 10,
    dx: 0,
  },
  dark: {
    stroke: '#52525b', // Zinc 600
    tickLine: false,
    axisLine: false,
    fontSize: 11,
    fill: '#a1a1aa', // Zinc 400
    dy: 10,
    dx: 0,
  },
};

export const ANIMATION_CONFIG = {
  duration: 800,
  easing: 'ease-out' as const,
};
