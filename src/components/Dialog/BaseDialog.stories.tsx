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
