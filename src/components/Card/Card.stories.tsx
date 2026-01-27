import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: 'This is the card content.',
    },
};

export const WithHeader: Story = {
    args: {
        title: 'Card Title',
        subtitle: 'This is a subtitle for the card',
        children: 'This is the card content with a header.',
    },
};

export const FullFeatured: Story = {
    args: {
        title: 'Product Card',
        subtitle: 'Category: Electronics',
        children: (
            <div className="flex flex-col gap-4">
                <p className="text-gray-600">
                    This is a high-quality product description. It has several lines of text detail.
                </p>
                <div className="font-bold text-xl">$299.00</div>
            </div>
        ),
        footer: (
            <div className="flex  gap-2">
                <Button variant="primary" size="sm">Buy Now</Button>
            </div>
        ),
    },
};
