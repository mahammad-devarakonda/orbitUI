import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
    title: 'Components/TextArea',
    component: TextArea,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        error: { control: 'text' },
        autoResize: { control: 'boolean' },
        disabled: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
    args: {
        placeholder: 'Enter your message here...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Bio',
        placeholder: 'Write a short bio about yourself...',
    },
};

export const WithError: Story = {
    args: {
        label: 'Comments',
        placeholder: 'Type something...',
        error: 'Comments cannot be empty.',
    },
};

export const AutoResize: Story = {
    args: {
        label: 'Auto-resizing TextArea',
        placeholder: 'This textarea grows as you type...',
        autoResize: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled state',
        placeholder: 'Cannot type here...',
        disabled: true,
    },
};
