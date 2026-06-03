import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
    decorators: [
        (Story) => (
            <div className="p-8 md:p-12 w-full max-w-2xl mx-auto bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl shadow-sm transition-colors duration-250">
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: { control: { type: 'number', min: 0, max: 100 } },
        max: { control: { type: 'number' } },
        min: { control: { type: 'number' } },
        buffer: { control: { type: 'number', min: 0, max: 100 } },
        size: {
            control: { type: 'select' },
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        variant: {
            control: { type: 'select' },
            options: [
                'primary',
                'secondary',
                'success',
                'warning',
                'danger',
                'info',
                'gradient-indigo',
                'gradient-sunset',
                'gradient-ocean',
            ],
        },
        rounded: {
            control: { type: 'select' },
            options: ['none', 'sm', 'md', 'lg', 'full'],
        },
        valuePosition: {
            control: { type: 'select' },
            options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'inside', 'tooltip'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// 1. Basic Default
export const Default: Story = {
    args: {
        value: 45,
        label: 'Downloading assets...',
        showValue: true,
        variant: 'primary',
        size: 'md',
    },
};

// 2. Sizes Stack
export const SizingPresets: Story = {
    render: () => (
        <div className="flex flex-col gap-6 w-full">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Size comparison (xs to xl)</h4>
            </div>
            <div className="flex flex-col gap-5">
                <ProgressBar value={75} size="xs" label="Extra Small (xs)" showValue valuePosition="top-right" />
                <ProgressBar value={75} size="sm" label="Small (sm)" showValue valuePosition="top-right" />
                <ProgressBar value={75} size="md" label="Medium (md)" showValue valuePosition="top-right" />
                <ProgressBar value={75} size="lg" label="Large (lg - with inside value support)" showValue valuePosition="inside" />
                <ProgressBar value={75} size="xl" label="Extra Large (xl - with inside value support)" showValue valuePosition="inside" />
            </div>
        </div>
    ),
};

// 3. Color & Gradient Showcase (with Glow toggle on by default)
export const ColorVariantsAndGlow: Story = {
    render: () => (
        <div className="flex flex-col gap-6 w-full">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Theme Colors & Ambient Glow</h4>
                <p className="text-xs text-gray-500">Premium gradients and solids featuring custom ambient matching shadows.</p>
            </div>
            <div className="flex flex-col gap-6 py-2">
                <ProgressBar value={60} variant="primary" label="Primary Theme" glow showValue />
                <ProgressBar value={40} variant="success" label="Success Theme" glow showValue />
                <ProgressBar value={85} variant="warning" label="Warning Theme" glow showValue />
                <ProgressBar value={50} variant="danger" label="Danger Theme" glow showValue />
                <ProgressBar value={70} variant="info" label="Info Theme" glow showValue />
                <ProgressBar value={90} variant="gradient-indigo" label="Indigo Nebula Gradient" glow showValue />
                <ProgressBar value={75} variant="gradient-sunset" label="Sunset Flare Gradient" glow showValue />
                <ProgressBar value={80} variant="gradient-ocean" label="Deep Ocean Gradient" glow showValue />
            </div>
        </div>
    ),
};

// 4. Striped, Animated, and Indeterminate states
export const VisualEffectsAndAnimations: Story = {
    render: () => (
        <div className="flex flex-col gap-6 w-full">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Transitions & Patterns</h4>
                <p className="text-xs text-gray-500">Striped overlays, flowing speed cycles, and smooth Framer-Motion loading animations.</p>
            </div>
            <div className="flex flex-col gap-6">
                <ProgressBar value={65} variant="gradient-indigo" label="Striped (Static)" striped animated={false} showValue />
                <ProgressBar value={65} variant="gradient-indigo" label="Striped & Running (Animated)" striped animated showValue />
                <ProgressBar variant="gradient-ocean" label="Indeterminate (Infinite loading cycle)" indeterminate striped showValue />
            </div>
        </div>
    ),
};

// 5. Buffer Loading Showcase
export const BufferingState: Story = {
    args: {
        value: 35,
        buffer: 70,
        label: 'Video buffer stream playback',
        showValue: true,
        valuePosition: 'top-right',
        variant: 'gradient-ocean',
        size: 'sm',
        glow: true,
    },
};

// 6. Label & Value Placements
export const ValuePlacements: Story = {
    render: () => (
        <div className="flex flex-col gap-6 w-full">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Percentage Labels Positioning</h4>
                <p className="text-xs text-gray-500">Flexible layouts including inside-bar, outside boundaries, and active-edge tooltips.</p>
            </div>
            <div className="flex flex-col gap-8 py-4">
                <ProgressBar value={40} valuePosition="top-left" label="Top Left Placement" showValue size="sm" />
                <ProgressBar value={50} valuePosition="top-right" label="Top Right Placement" showValue size="sm" />
                <ProgressBar value={60} valuePosition="bottom-left" label="Bottom Left Placement" showValue size="sm" />
                <ProgressBar value={70} valuePosition="bottom-right" label="Bottom Right Placement" showValue size="sm" />
                <ProgressBar value={80} valuePosition="inside" label="Inside Placement" showValue size="xl" />
                <ProgressBar value={55} variant="gradient-sunset" valuePosition="tooltip" label="Interactive Floating Tooltip Badge" showValue size="sm" glow />
            </div>
        </div>
    ),
};

// 7. Interactive Realtime Demonstration
const InteractiveProgressDemo = () => {
    const [progress, setProgress] = useState(10);
    const [buffer, setBuffer] = useState(25);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev >= 100 ? 0 : prev + Math.floor(Math.random() * 15) + 5;
                setBuffer(Math.min(100, Math.floor(next + Math.random() * 20 + 10)));
                return Math.min(100, next);
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Real-Time Progression Simulator</h4>
                <p className="text-xs text-gray-500">Demonstrates fluid spring motion animations as value jumps occur automatically.</p>
            </div>
            <div className="flex flex-col gap-8">
                <ProgressBar
                    value={progress}
                    buffer={buffer}
                    variant="gradient-sunset"
                    label="Streaming and Decompressing..."
                    showValue
                    valuePosition="tooltip"
                    size="sm"
                    glow
                />

                <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        Live Progress State: <strong className="text-gray-900 dark:text-white tabular-nums">{progress}%</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                        Buffer pre-fetch: <strong className="text-gray-900 dark:text-white tabular-nums">{buffer}%</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};

export const LiveInteractiveDemo: Story = {
    render: () => <InteractiveProgressDemo />,
};

// 8. Glassmorphic Track Preview
export const GlassmorphismTracks: Story = {
    render: () => (
        <div className="flex flex-col gap-6 w-full p-6 bg-gradient-to-br from-indigo-900 via-gray-900 to-slate-900 border border-slate-800 rounded-xl text-white">
            <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Glassmorphism Overlay Track</h4>
                <p className="text-xs text-slate-400">Blended semi-transparent glass track designed for ambient dark/hero pages.</p>
            </div>
            <div className="flex flex-col gap-6 py-2">
                <ProgressBar value={40} variant="gradient-sunset" label="Sunset Flare (Glass Track)" glassmorphism glow showValue />
                <ProgressBar value={75} variant="gradient-ocean" label="Deep Ocean (Glass Track)" glassmorphism glow showValue />
            </div>
        </div>
    ),
};
