import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';

const meta: Meta<typeof Loader> = {
    title: 'Components/Loader',
    component: Loader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['spinner', 'dots', 'pulse', 'multicolor', 'orbit'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg', 'xl'],
        },
        color: {
            control: 'color',
            description: 'Custom color for non-multicolor variants',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const SocialMediaMulticolor: Story = {
    args: {
        variant: 'multicolor',
        size: 'xl',
    },
};

export const Dots: Story = {
    args: {
        variant: 'dots',
        size: 'lg',
    },
};

export const Pulse: Story = {
    args: {
        variant: 'pulse',
        size: 'lg',
    },
};

export const Orbit: Story = {
    args: {
        variant: 'orbit',
        size: 'xl',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="space-y-2">
                <p className="text-sm text-gray-500 font-mono">Variant: multicolor (Social)</p>
                <div className="flex gap-4 items-center">
                    <Loader variant="multicolor" size="sm" />
                    <Loader variant="multicolor" size="md" />
                    <Loader variant="multicolor" size="lg" />
                    <Loader variant="multicolor" size="xl" />
                </div>
            </div>


            <div className="space-y-2">
                <p className="text-sm text-gray-500 font-mono">Variant: orbit</p>
                <div className="flex gap-4 items-center">
                    <Loader variant="orbit" size="sm" />
                    <Loader variant="orbit" size="md" />
                    <Loader variant="orbit" size="lg" />
                    <Loader variant="orbit" size="xl" />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-sm text-gray-500 font-mono">Variant: dots</p>
                <div className="flex gap-4 items-center">
                    <Loader variant="dots" size="sm" />
                    <Loader variant="dots" size="md" />
                    <Loader variant="dots" size="lg" />
                    <Loader variant="dots" size="xl" />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-sm text-gray-500 font-mono">Variant: pulse</p>
                <div className="flex gap-4 items-center">
                    <Loader variant="pulse" size="sm" />
                    <Loader variant="pulse" size="md" />
                    <Loader variant="pulse" size="lg" />
                    <Loader variant="pulse" size="xl" />
                </div>
            </div>
        </div>
    ),
};
