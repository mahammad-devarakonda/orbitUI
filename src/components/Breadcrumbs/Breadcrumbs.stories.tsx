import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
import { Folder, User, Settings } from 'lucide-react';

const meta: Meta<typeof Breadcrumbs> = {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

const baseItems = [
    { label: 'Home', href: '#' },
    { label: 'Documents', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'OrbitUI', href: '#' },
];

export const Default: Story = {
    args: {
        items: baseItems,
    },
};

export const ShowHomeIcon: Story = {
    args: {
        items: [
            { label: 'Home', href: '#' },
            { label: 'Documents', href: '#' },
            { label: 'Projects', href: '#' },
            { label: 'OrbitUI' }
        ],
        showHomeIcon: true,
    },
};

export const WithIcons: Story = {
    args: {
        items: [
            { label: 'Dashboard', href: '#', icon: Folder },
            { label: 'Users', href: '#', icon: User },
            { label: 'Settings', href: '#', icon: Settings },
            { label: 'Profile Settings' },
        ],
        showHomeIcon: true,
    },
};

export const CustomSeparator: Story = {
    args: {
        items: baseItems,
        separator: <span className="text-gray-400 dark:text-gray-600 font-light mx-1 select-none">/</span>,
    },
};

export const Collapsed: Story = {
    args: {
        items: [
            { label: 'Home', href: '#' },
            { label: 'Workspace', href: '#' },
            { label: 'Projects', href: '#' },
            { label: 'Frontend', href: '#' },
            { label: 'Libraries', href: '#' },
            { label: 'OrbitUI', href: '#' },
            { label: 'Breadcrumbs' },
        ],
        maxItems: 4,
        showHomeIcon: true,
    },
};

export const Interactive: Story = {
    args: {
        items: baseItems,
        onItemClick: (item, index) => {
            console.log(`Clicked item: ${JSON.stringify(item)} at index ${index}`);
        },
    },
};
