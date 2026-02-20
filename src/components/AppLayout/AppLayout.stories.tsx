import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './AppLayout';

const meta: Meta<typeof AppLayout> = {
    title: 'Layout/AppLayout',
    component: AppLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

const SidebarContent = () => (
    <div className="p-4 space-y-4">
        <div className="h-8 w-32 bg-indigo-100 rounded animate-pulse" />
        <nav className="space-y-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-full bg-gray-50 rounded" />
            ))}
        </nav>
    </div>
);

const HeaderContent = () => (
    <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="h-8 w-24 bg-indigo-600 rounded" />
        </div>
    </div>
);

const MainContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <div className="h-4 w-1/2 bg-gray-100 rounded mb-4" />
                <div className="h-40 w-full bg-gray-50 rounded" />
            </div>
        ))}
    </div>
);

const FooterContent = () => (
    <div className="text-sm text-gray-500 w-full text-center">
        © 2024 OrbitUI Toolkit. All rights reserved.
    </div>
);

export const Default: Story = {
    args: {
        sidebar: <SidebarContent />,
        header: <HeaderContent />,
        children: <MainContent />,
    },
};

export const WithFooter: Story = {
    args: {
        sidebar: <SidebarContent />,
        header: <HeaderContent />,
        children: <MainContent />,
        footer: <FooterContent />,
    },
};

export const CollapsibleSidebar: Story = {
    args: {
        sidebar: <SidebarContent />,
        header: <HeaderContent />,
        children: <MainContent />,
        isCollapsible: true,
    },
};

export const HeaderFirst: Story = {
    args: {
        sidebar: <SidebarContent />,
        header: <HeaderContent />,
        children: <MainContent />,
        layoutVariant: 'header-first',
    },
};

export const HeaderFirstCollapsible: Story = {
    args: {
        sidebar: <SidebarContent />,
        header: <HeaderContent />,
        children: <MainContent />,
        layoutVariant: 'header-first',
        isCollapsible: true,
    },
};

export const CustomWidths: Story = {
    args: {
        sidebar: <SidebarContent />,
        header: <HeaderContent />,
        children: <MainContent />,
        sidebarWidth: '320px',
        collapsedWidth: '80px',
        isCollapsible: true,
    },
};
