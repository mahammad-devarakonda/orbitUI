import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        checked: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        variant: {
            control: 'select',
            options: ['default', 'glass', 'dark'],
        },
        colorTheme: {
            control: 'select',
            options: ['blue', 'indigo', 'purple', 'green', 'rose'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        disabled: { control: 'boolean' },
        label: { control: 'text' },
        error: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        label: 'Accept terms and conditions',
        checked: false,
        variant: 'default',
        colorTheme: 'indigo',
        size: 'md',
    },
};

export const Checked: Story = {
    args: {
        label: 'Selected Option',
        checked: true,
    },
};

export const Indeterminate: Story = {
    args: {
        label: 'Parent Category (Indeterminate)',
        checked: false,
        indeterminate: true,
    },
};

export const BlueTheme: Story = {
    args: {
        label: 'Blue Checkbox',
        checked: true,
        colorTheme: 'blue',
    },
};

export const GreenTheme: Story = {
    args: {
        label: 'Green Checkbox',
        checked: true,
        colorTheme: 'green',
    },
};

export const RoseTheme: Story = {
    args: {
        label: 'Rose Checkbox',
        checked: true,
        colorTheme: 'rose',
    },
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <Checkbox label="Small Checkbox" size="sm" checked />
            <Checkbox label="Medium Checkbox" size="md" checked />
            <Checkbox label="Large Checkbox" size="lg" checked />
        </div>
    ),
};

export const Glass: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        label: 'Glass Variant Checkbox',
        checked: true,
        variant: 'glass',
    },
};

export const Dark: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        label: 'Dark Variant Checkbox',
        checked: true,
        variant: 'dark',
    },
};

export const WithError: Story = {
    args: {
        label: 'Required selection',
        error: 'You must check this box before proceeding',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Locked Option',
        checked: true,
        disabled: true,
    },
};
