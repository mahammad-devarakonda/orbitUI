import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OrbitSelect, type OrbitSelectProps } from './OrbitSelect';
import { ShieldCheck, User } from 'lucide-react';

const meta: Meta<typeof OrbitSelect> = {
    title: 'Components/OrbitSelect',
    component: OrbitSelect,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrbitSelect>;

const options = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Theatre Owner', value: 'THEATRE_OWNER' },
    { label: 'User', value: 'USER' },
];

const OrbitSelectWrapper = (args: OrbitSelectProps) => {
    const [value, setValue] = useState(args.value || '');
    return (
        <div className="w-80">
            <OrbitSelect
                {...args}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <OrbitSelectWrapper {...args} />,
    args: {
        label: 'Select Role',
        options: options,
        variant: 'default',
        value: '',
    },
};

export const Glass: Story = {
    render: (args) => <OrbitSelectWrapper {...args} />,
    args: {
        label: 'Select Role',
        options: options,
        variant: 'glass',
        value: 'ADMIN',
        leftIcon: <ShieldCheck size={18} />,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

export const Dark: Story = {
    render: (args) => <OrbitSelectWrapper {...args} />,
    args: {
        label: 'Select Role',
        options: options,
        variant: 'dark',
        value: 'THEATRE_OWNER',
        leftIcon: <User size={18} />,
    },
    parameters: {
        backgrounds: { default: 'dark' },
    },
};

export const WithError: Story = {
    render: (args) => <OrbitSelectWrapper {...args} />,
    args: {
        label: 'Select Role',
        options: options,
        value: '',
        error: 'Please select a valid role',
    },
};
