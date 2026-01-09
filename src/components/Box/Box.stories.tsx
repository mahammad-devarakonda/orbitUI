import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
    title: 'Components/Box',
    component: Box,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
    args: {
        children: 'This is a Box',
        className: 'p-4 bg-gray-100 rounded border',
    },
};

export const SemanticElement: Story = {
    args: {
        as: 'section',
        children: 'This is a <section> Box',
        className: 'p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded',
    },
};

export const Interactive: Story = {
    args: {
        as: 'button',
        children: 'I am a Button Box',
        className: 'px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors',
        onClick: () => alert('Box Clicked!'),
    },
};
