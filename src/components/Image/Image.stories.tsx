import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
    title: 'Components/Image',
    component: Image,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        fit: {
            control: 'select',
            options: ['contain', 'cover', 'fill', 'none', 'scale-down'],
        },
        radius: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg', 'full'],
        },
        width: { control: 'text' },
        height: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
    args: {
        src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop',
        alt: 'Scenic mountain landscape',
        width: '300px',
        height: '200px',
        fit: 'cover',
        radius: 'none',
    },
};

export const RoundedFull: Story = {
    args: {
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        alt: 'Avatar',
        width: '100px',
        height: '100px',
        fit: 'cover',
        radius: 'full',
    },
};

export const Fallback: Story = {
    args: {
        src: 'invalid-url',
        fallbackSrc: 'https://via.placeholder.com/300x200?text=Fallback+Image',
        alt: 'Broken image with fallback',
        width: '300px',
        height: '200px',
        fit: 'contain',
        radius: 'md',
    },
};

export const ObjectFitContain: Story = {
    args: {
        src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000&auto=format&fit=crop',
        alt: 'Contained image',
        width: '300px',
        height: '300px',
        fit: 'contain',
        className: 'bg-gray-100',
    },
};
