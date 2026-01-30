import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect, type MultiSelectProps } from './MultiSelect';

const meta: Meta<typeof MultiSelect> = {
    title: 'Components/MultiSelect',
    component: MultiSelect,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Next.js', value: 'nextjs' },
];

const MultiSelectWrapper = (args: MultiSelectProps) => {
    const [value, setValue] = useState<string[]>(args.value || []);
    return <div className="w-80"><MultiSelect {...args} value={value} onChange={setValue} /></div>;
};

export const Default: Story = {
    render: (args) => <MultiSelectWrapper {...args} />,
    args: {
        label: 'Frameworks',
        options: options,
        value: [],
        variant: 'default',
    },
};

export const Glass: Story = {
    render: (args) => <MultiSelectWrapper {...args} />,
    args: {
        label: 'Frameworks',
        options: options,
        value: ['react', 'nextjs'],
        variant: 'glass',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

export const Dark: Story = {
    render: (args) => <MultiSelectWrapper {...args} />,
    args: {
        label: 'Frameworks',
        options: options,
        value: ['svelte'],
        variant: 'dark',
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

export const WithError: Story = {
    render: (args) => <MultiSelectWrapper {...args} />,
    args: {
        label: 'Frameworks',
        options: options,
        value: [],
        error: 'Please select at least one framework',
    },
};
