import type { Meta, StoryObj } from '@storybook/react';
import { BaseDialog } from './BaseDialog';
import { Button } from '../Button/Button';
import { useState } from 'react';
import { Input } from '../Input/Input';

const meta: Meta<typeof BaseDialog> = {
    title: 'Components/BaseDialog',
    component: BaseDialog,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseDialog>;

const DialogWrapper = (args: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="h-screen flex items-center justify-center p-4">
            <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
            <BaseDialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Dialog Title',
        children: (
            <div className="space-y-4">
                <p className="text-gray-600">
                    This is a basic dialog box. You can put any content here.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => { }}>Cancel</Button>
                    <Button onClick={() => { }}>Confirm</Button>
                </div>
            </div>
        ),
    },
};

export const WithForm: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Edit Profile',
        size: 'md',
        children: (
            <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                        JD
                    </div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                </div>
                <Input label="Username" defaultValue="johndoe" />
                <Input label="Bio" defaultValue="Frontend Developer" />
                <div className="pt-4 flex justify-end gap-2">
                    <Button variant="secondary">Cancel</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>
        ),
    },
};

export const LargeSize: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Terms of Service',
        size: 'lg',
        children: (
            <div className="space-y-4 h-[300px] overflow-y-auto pr-2">
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        ),
    },
};

export const CustomDimensions: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Custom Dimensions',
        width: '800px',
        height: '600px',
        children: (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
                    This dialog has a custom width of 800px and height of 600px.
                </p>
            </div>
        ),
    },
};

export const SmallSize: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Small Dialog (sm)',
        size: 'sm',
        children: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                    This is a small dialog box (max-w-sm).
                </p>
            </div>
        ),
    },
};

export const MediumSize: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Medium Dialog (md) - 50% Screen',
        size: 'md',
        children: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                    This dialog takes up exactly half (50%) of the screen width on desktop viewports.
                </p>
            </div>
        ),
    },
};

export const ExtraLargeSize: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Extra Large Dialog (xl) - 95% Screen',
        size: 'xl',
        children: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                    This dialog covers 90% to 95% of the screen width to maximize work area.
                </p>
            </div>
        ),
    },
};

export const RoundedNone: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Sharp Corners Dialog (rounded: none)',
        rounded: 'none',
        children: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                    This dialog has sharp, non-rounded corners (rounded-none).
                </p>
            </div>
        ),
    },
};

export const RoundedLarge: Story = {
    render: (args) => <DialogWrapper {...args} />,
    args: {
        title: 'Custom Rounded Dialog (rounded: lg)',
        rounded: 'lg',
        children: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                    This dialog has custom rounded corners (rounded-lg).
                </p>
            </div>
        ),
    },
};

