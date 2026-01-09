import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'Components/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        variant: 'text',
        width: 200,
        height: 20,
    },
};

export const Circular: Story = {
    args: {
        variant: 'circular',
        width: 50,
        height: 50,
    },
};

export const Rectangular: Story = {
    args: {
        variant: 'rectangular',
        width: 300,
        height: 200,
    },
};

export const PostLoadingExample: Story = {
    render: () => (
        <div className="w-[300px] border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-2">
                    <Skeleton variant="text" width={120} height={14} />
                    <Skeleton variant="text" width={80} height={12} />
                </div>
            </div>
            <Skeleton variant="rectangular" width="100%" height={200} />
            <div className="space-y-2">
                <Skeleton variant="text" width="90%" height={14} />
                <Skeleton variant="text" width="60%" height={14} />
            </div>
        </div>
    ),
};
