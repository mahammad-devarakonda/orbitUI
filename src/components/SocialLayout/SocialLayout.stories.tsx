import type { Meta, StoryObj } from '@storybook/react';
import { SocialLayout } from './SocialLayout';

const meta: Meta<typeof SocialLayout> = {
    title: 'Layout/SocialLayout',
    component: SocialLayout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SocialLayout>;

// --- Mock Components for Slots ---

const SidebarDemo = () => (
    <div className="flex flex-col h-full bg-white">
        <div className="p-6 mb-8 text-2xl font-bold font-serif xl:block hidden">Bondly</div>
        <div className="p-6 mb-8 text-2xl font-bold xl:hidden block text-center">B</div>

        <nav className="flex-1 px-3 space-y-4">
            {['Home', 'Search', 'Explore', 'Messages', 'Notifications', 'Create'].map((item) => (
                <div key={item} className="flex items-center p-3 rounded-xl hover:bg-gray-100 transition-all group cursor-pointer">
                    <div className="w-6 h-6 bg-gray-200 rounded group-hover:bg-pink-500 transition-colors" />
                    <span className="ml-4 xl:block hidden font-medium">{item}</span>
                </div>
            ))}
        </nav>

        <div className="p-3 mb-4">
            <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600" />
                <span className="ml-4 xl:block hidden font-medium">Profile</span>
            </div>
        </div>
    </div>
);

const MobileFooterDemo = () => (
    <div className="flex items-center justify-around h-14 w-full bg-white">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-6 h-6 bg-gray-200 rounded-full" />
        ))}
    </div>
);

const MockFeed = () => (
    <div className="space-y-12">
        <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white border-2 border-white" />
                </div>
                <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="aspect-[4/5] w-full bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center text-gray-300">
                <span className="text-sm">Image Placeholder</span>
            </div>
            <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="w-6 h-6 rounded-full bg-gray-200" />
            </div>
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
        </div>
    </div>
);

// --- Stories ---

export const Default: Story = {
    args: {
        sidebar: <SidebarDemo />,
        footer: <MobileFooterDemo />,
        children: <MockFeed />,
    },
};

export const MinimalShell: Story = {
    args: {
        sidebar: <div className="p-4 text-center font-bold">Menu</div>,
        children: <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">Main Content Slot</div>,
    },
};
