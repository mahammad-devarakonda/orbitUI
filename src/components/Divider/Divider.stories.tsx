import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
    title: 'Components/Divider',
    component: Divider,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
    args: {
        orientation: 'horizontal',
    },
};

export const WithText: Story = {
    args: {
        children: 'OR',
        orientation: 'horizontal',
    },
};

export const AlignLeft: Story = {
    args: {
        children: 'Section Header',
        align: 'left',
        orientation: 'horizontal',
    },
};

export const AlignRight: Story = {
    args: {
        children: 'End of Content',
        align: 'right',
        orientation: 'horizontal',
    },
};

export const Dashed: Story = {
    args: {
        variant: 'dashed',
        children: 'Dashed Divider',
    },
};

export const Dotted: Story = {
    args: {
        variant: 'dotted',
        children: 'Dotted Divider',
    },
};

export const GradientFade: Story = {
    args: {
        gradient: true,
    },
};

export const GradientWithText: Story = {
    args: {
        gradient: true,
        children: 'Premium Accent',
    },
};

export const Vertical: Story = {
    render: () => (
        <div className="flex h-5 items-center space-x-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Profile</span>
            <Divider orientation="vertical" />
            <span>Settings</span>
            <Divider orientation="vertical" variant="dashed" />
            <span>Billing</span>
            <Divider orientation="vertical" gradient />
            <span>Logout</span>
        </div>
    ),
};
