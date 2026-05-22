import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SeatLayout } from './SeatLayoutEditor';
import { SeatLayoutViewer } from './SeatLayoutViewer';
import type { LayoutData } from './types';
import { createDefaultLayout } from './SeatLayoutEditor';

const meta: Meta<typeof SeatLayout> = {
    title: 'Components/SeatLayout',
    component: SeatLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SeatLayout>;

// 1. Fully Self-Contained Interactive Story (Uncontrolled Mode)
export const UncontrolledInteractive: Story = {
    args: {
        defaultValue: createDefaultLayout(10, 15),
        readOnly: false,
    },
    render: (args) => {
        return (
            <div className="p-8 bg-slate-100 dark:bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-6xl h-[750px]">
                    <SeatLayout {...args} />
                </div>
            </div>
        );
    }
};

// 2. Controlled State Mode (Managed by Parent component)
const ControlledWrapper: React.FC = () => {
    const [layout, setLayout] = useState<LayoutData>(() => createDefaultLayout(8, 12));

    return (
        <div className="p-8 bg-slate-100 dark:bg-slate-950 min-h-screen flex flex-col gap-6 items-center justify-center">
            <div className="w-full max-w-4xl p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-2">Controlled State Demo</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    The parent component owns the layout state. Total configured seats:{' '}
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                        {Object.values(layout.grid).filter((cell) => cell.type === 'seat').length}
                    </span>
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLayout(createDefaultLayout(6, 10))}
                        className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        Reset to 6x10
                    </button>
                    <button
                        onClick={() => setLayout(createDefaultLayout(10, 16))}
                        className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        Reset to 10x16
                    </button>
                </div>
            </div>
            <div className="w-full max-w-6xl h-[700px]">
                <SeatLayout value={layout} onChange={setLayout} />
            </div>
        </div>
    );
};

export const ControlledInteractive: Story = {
    render: () => <ControlledWrapper />
};

// 3. Read Only View (Viewer Mode, used for ticketing checkout pages)
const demoLayout: LayoutData = {
    dimensions: { rows: 8, cols: 12 },
    dividerRows: [3],
    dividerCols: [3, 8],
    grid: {
        '0_0': { type: 'seat', category: 'vip' },
        '0_1': { type: 'seat', category: 'vip' },
        '0_2': { type: 'seat', category: 'vip' },
        '0_4': { type: 'seat', category: 'vip' },
        '0_5': { type: 'seat', category: 'vip' },
        '0_6': { type: 'seat', category: 'vip' },
        '0_7': { type: 'seat', category: 'vip' },
        '0_9': { type: 'seat', category: 'vip' },
        '0_10': { type: 'seat', category: 'vip' },
        '0_11': { type: 'seat', category: 'vip' },

        '1_0': { type: 'seat', category: 'vip' },
        '1_1': { type: 'damaged', category: undefined },
        '1_2': { type: 'seat', category: 'vip' },
        '1_4': { type: 'seat', category: 'vip' },
        '1_5': { type: 'seat', category: 'vip' },
        '1_6': { type: 'blocked', category: undefined },
        '1_7': { type: 'seat', category: 'vip' },
        '1_9': { type: 'seat', category: 'vip' },
        '1_10': { type: 'seat', category: 'vip' },
        '1_11': { type: 'seat', category: 'vip' },

        '2_0': { type: 'wheelchair', category: undefined },
        '2_1': { type: 'wheelchair', category: undefined },
        '2_2': { type: 'seat', category: 'vip' },
        '2_4': { type: 'seat', category: 'vip' },
        '2_5': { type: 'seat', category: 'vip' },
        '2_6': { type: 'seat', category: 'vip' },
        '2_7': { type: 'seat', category: 'vip' },
        '2_9': { type: 'seat', category: 'vip' },
        '2_10': { type: 'wheelchair', category: undefined },
        '2_11': { type: 'wheelchair', category: undefined },

        '4_0': { type: 'seat', category: 'gold' },
        '4_1': { type: 'seat', category: 'gold' },
        '4_2': { type: 'seat', category: 'gold' },
        '4_4': { type: 'seat', category: 'gold' },
        '4_5': { type: 'seat', category: 'gold' },
        '4_6': { type: 'seat', category: 'gold' },
        '4_7': { type: 'seat', category: 'gold' },
        '4_9': { type: 'seat', category: 'gold' },
        '4_10': { type: 'seat', category: 'gold' },
        '4_11': { type: 'seat', category: 'gold' },

        '5_0': { type: 'seat', category: 'gold' },
        '5_1': { type: 'seat', category: 'gold' },
        '5_2': { type: 'seat', category: 'gold' },
        '5_4': { type: 'seat', category: 'gold' },
        '5_5': { type: 'seat', category: 'gold' },
        '5_6': { type: 'seat', category: 'gold' },
        '5_7': { type: 'seat', category: 'gold' },
        '5_9': { type: 'seat', category: 'gold' },
        '5_10': { type: 'seat', category: 'gold' },
        '5_11': { type: 'seat', category: 'gold' },

        '6_0': { type: 'seat', category: 'silver' },
        '6_1': { type: 'seat', category: 'silver' },
        '6_2': { type: 'seat', category: 'silver' },
        '6_4': { type: 'seat', category: 'silver' },
        '6_5': { type: 'seat', category: 'silver' },
        '6_6': { type: 'seat', category: 'silver' },
        '6_7': { type: 'seat', category: 'silver' },
        '6_9': { type: 'seat', category: 'silver' },
        '6_10': { type: 'seat', category: 'silver' },
        '6_11': { type: 'seat', category: 'silver' },

        '7_0': { type: 'seat', category: 'silver' },
        '7_1': { type: 'seat', category: 'silver' },
        '7_2': { type: 'seat', category: 'silver' },
        '7_4': { type: 'seat', category: 'silver' },
        '7_5': { type: 'seat', category: 'silver' },
        '7_6': { type: 'seat', category: 'silver' },
        '7_7': { type: 'seat', category: 'silver' },
        '7_9': { type: 'seat', category: 'silver' },
        '7_10': { type: 'seat', category: 'silver' },
        '7_11': { type: 'seat', category: 'silver' },
    }
};

export const ReadOnlyLayoutView: Story = {
    args: {
        value: demoLayout,
    },
    render: (args) => {
        return (
            <div className="p-8 bg-slate-100 dark:bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    <SeatLayoutViewer value={args.value as LayoutData} />
                </div>
            </div>
        );
    }
};

export const CustomPricingCategories: Story = {
    args: {
        defaultValue: {
            dimensions: { rows: 8, cols: 12 },
            dividerRows: [2, 5],
            dividerCols: [],
            dividerNames: {
                2: 'Front Orchestra',
                5: 'Main Mezzanine'
            },
            categories: [
                { id: 'standard', name: 'Standard Seating', color: 'bg-emerald-400 dark:bg-emerald-600' },
                { id: 'premium', name: 'Premium Club', color: 'bg-indigo-400 dark:bg-indigo-600' },
                { id: 'platinum', name: 'Platinum Suite', color: 'bg-rose-400 dark:bg-rose-600' },
            ],
            grid: {
                '0_0': { type: 'seat', category: 'platinum' },
                '0_1': { type: 'seat', category: 'platinum' },
                '0_2': { type: 'seat', category: 'platinum' },
                '0_3': { type: 'seat', category: 'platinum' },
                '3_0': { type: 'seat', category: 'premium' },
                '3_1': { type: 'seat', category: 'premium' },
                '3_2': { type: 'seat', category: 'premium' },
                '3_3': { type: 'seat', category: 'premium' },
                '6_0': { type: 'seat', category: 'standard' },
                '6_1': { type: 'seat', category: 'standard' },
                '6_2': { type: 'seat', category: 'standard' },
                '6_3': { type: 'seat', category: 'standard' },
            }
        },
        readOnly: false,
    },
    render: (args) => {
        return (
            <div className="p-8 bg-slate-100 dark:bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-6xl h-[750px]">
                    <SeatLayout {...args} />
                </div>
            </div>
        );
    }
};
