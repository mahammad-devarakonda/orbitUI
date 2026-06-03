import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from './Drawer';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

const meta: Meta<typeof Drawer> = {
    title: 'Components/Drawer',
    component: Drawer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger>
                <Button>Open Profile Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>User Profile Settings</DrawerTitle>
                </DrawerHeader>
                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    <p className="text-sm text-gray-500">
                        Update your personal workspace credentials, billing information, and email preferences here.
                    </p>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Name</label>
                        <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email</label>
                        <Input placeholder="john.doe@example.com" />
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    <DrawerClose>
                        <Button variant="primary">Save Changes</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const Placements: Story = {
    render: () => {
        const [dir, setDir] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
        const [isOpen, setIsOpen] = useState(false);

        const openDrawer = (direction: 'left' | 'right' | 'top' | 'bottom') => {
            setDir(direction);
            setIsOpen(true);
        };

        return (
            <div className="flex flex-wrap gap-4 justify-center items-center">
                <Button onClick={() => openDrawer('left')} variant="outline">Left Drawer</Button>
                <Button onClick={() => openDrawer('right')} variant="outline">Right Drawer</Button>
                <Button onClick={() => openDrawer('top')} variant="outline">Top Drawer</Button>
                <Button onClick={() => openDrawer('bottom')} variant="outline">Bottom Drawer</Button>

                <Drawer isOpen={isOpen} onOpenChange={setIsOpen} direction={dir}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Drawer - {dir.toUpperCase()}</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <p className="text-sm text-gray-500">
                                This panel slid in smoothly from the {dir} side of the viewport!
                            </p>
                        </div>
                        <DrawerFooter>
                            <DrawerClose>
                                <Button variant="primary">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'full'>('md');
        const [isOpen, setIsOpen] = useState(false);

        const openDrawer = (s: 'sm' | 'md' | 'lg' | 'full') => {
            setSize(s);
            setIsOpen(true);
        };

        return (
            <div className="flex flex-wrap gap-4 justify-center items-center">
                <Button onClick={() => openDrawer('sm')} variant="outline">Small (380px)</Button>
                <Button onClick={() => openDrawer('md')} variant="outline">Medium (480px)</Button>
                <Button onClick={() => openDrawer('lg')} variant="outline">Large (640px)</Button>
                <Button onClick={() => openDrawer('full')} variant="outline">Full Screen</Button>

                <Drawer isOpen={isOpen} onOpenChange={setIsOpen} size={size}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Size: {size.toUpperCase()}</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <p className="text-sm text-gray-500">
                                This drawer size is pre-configured as "{size}".
                            </p>
                        </div>
                        <DrawerFooter>
                            <DrawerClose>
                                <Button variant="primary">Okay</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        );
    },
};
