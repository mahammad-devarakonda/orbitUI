import type { Meta, StoryObj } from '@storybook/react';
import { SeatLayoutViewer } from './SeatLayoutViewer';
import type { LayoutData } from './types';

const meta: Meta<typeof SeatLayoutViewer> = {
    title: 'Components/SeatLayoutViewer',
    component: SeatLayoutViewer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SeatLayoutViewer>;

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
        '1_1': { type: 'seat', category: 'vip' },
        '1_2': { type: 'seat', category: 'vip' },
        '1_4': { type: 'seat', category: 'vip' },
        '1_5': { type: 'seat', category: 'vip' },
        '1_6': { type: 'blocked', category: 'vip' },
        '1_7': { type: 'seat', category: 'vip' },
        '1_9': { type: 'seat', category: 'vip' },
        '1_10': { type: 'seat', category: 'vip' },
        '1_11': { type: 'seat', category: 'vip' },

        '2_0': { type: 'seat', category: 'vip' },
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

export const DefaultViewer: Story = {
    args: {
        value: demoLayout,
    },
    render: (args) => {
        return (
            <div className="p-8 bg-slate-100 dark:bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    <SeatLayoutViewer {...args} />
                </div>
            </div>
        );
    }
};
