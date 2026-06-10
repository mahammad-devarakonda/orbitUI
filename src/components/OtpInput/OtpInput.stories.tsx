import type { Meta, StoryObj } from '@storybook/react';
import { OtpInput } from './OtpInput';

const meta: Meta<typeof OtpInput> = {
    title: 'Components/OtpInput',
    component: OtpInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        length: { control: { type: 'number', min: 2, max: 12 } },
        type: {
            control: 'select',
            options: ['number', 'text', 'password'],
        },
        variant: {
            control: 'select',
            options: ['default', 'glass', 'dark'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        rounded: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg', 'full'],
        },
        gap: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
        disabled: { control: 'boolean' },
        error: { control: 'boolean' },
        success: { control: 'boolean' },
        autoFocus: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

export const Default: Story = {
    args: {
        length: 6,
        type: 'number',
        variant: 'default',
        size: 'md',
        rounded: 'lg',
        gap: 'md',
        disabled: false,
        error: false,
        success: false,
        placeholder: '•',
    },
};

export const FourDigits: Story = {
    args: {
        length: 4,
        size: 'lg',
        placeholder: '-',
    },
};

export const EightDigits: Story = {
    args: {
        length: 8,
        size: 'sm',
        placeholder: '0',
    },
};

export const PasswordMasked: Story = {
    args: {
        length: 6,
        type: 'password',
        placeholder: '∗',
    },
};

export const Glass: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'glass',
        length: 6,
        placeholder: '·',
    },
};

export const Dark: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'dark',
        length: 6,
        placeholder: '•',
    },
};

export const WithError: Story = {
    args: {
        length: 6,
        error: true,
        placeholder: '!',
    },
};

export const WithSuccess: Story = {
    args: {
        length: 6,
        success: true,
        placeholder: '✓',
    },
};

export const Disabled: Story = {
    args: {
        length: 6,
        disabled: true,
        placeholder: '-',
    },
};
