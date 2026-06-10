import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
    title: 'Components/SearchBar',
    component: SearchBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        debounceMs: { control: { type: 'number', min: 0, max: 2000 } },
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
        loading: { control: 'boolean' },
        showSearchButton: { control: 'boolean' },
        disabled: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
    args: {
        debounceMs: 300,
        variant: 'default',
        size: 'md',
        rounded: 'lg',
        placeholder: 'Search for articles...',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        placeholder: 'Small search...',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        placeholder: 'Large search...',
    },
};

export const Glass: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'glass',
        placeholder: 'Frosted glass look...',
    },
};

export const Dark: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'dark',
        placeholder: 'Sleek dark theme...',
    },
};

export const Loading: Story = {
    args: {
        loading: true,
        placeholder: 'Searching API...',
    },
};

export const WithSearchButton: Story = {
    args: {
        showSearchButton: true,
        placeholder: 'Enter query...',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Locked query...',
    },
};

export const FullyRounded: Story = {
    args: {
        rounded: 'full',
        placeholder: 'Pill-shaped search...',
    },
};

export const NoRounded: Story = {
    args: {
        rounded: 'none',
        placeholder: 'Sharp edges...',
    },
};

export const DarkWithButton: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'dark',
        showSearchButton: true,
        size: 'lg',
        placeholder: 'Advanced search...',
    },
};

export const GlassLoading: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'glass',
        loading: true,
        placeholder: 'Processing...',
    },
};

export const LargeWithButton: Story = {
    args: {
        size: 'lg',
        showSearchButton: true,
        rounded: 'full',
        placeholder: 'Type to search...',
    },
};

export const CustomDebounce: Story = {
    args: {
        debounceMs: 1000,
        placeholder: 'Slow debounce (1s)...',
    },
};
