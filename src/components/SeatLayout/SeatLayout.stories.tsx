import type { Meta, StoryObj } from '@storybook/react';
import { SeatLayout } from './SeatLayoutEditor';
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
