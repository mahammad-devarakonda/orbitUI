import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
    title: 'Components/Typography',
    component: Typography,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
    args: {
        children: 'OrbitUI Typography',
        variant: 'h1',
    },
};

export const TypeScale: Story = {
    render: () => (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <Typography variant="h1">Heading 1</Typography>
                <Typography variant="caption" className="mt-1">text-5xl / Extra Bold</Typography>
            </div>
            <div className="border-b pb-4">
                <Typography variant="h2">Heading 2</Typography>
                <Typography variant="caption" className="mt-1">text-4xl / Bold</Typography>
            </div>
            <div className="border-b pb-4">
                <Typography variant="h3">Heading 3</Typography>
                <Typography variant="caption" className="mt-1">text-3xl / Bold</Typography>
            </div>
            <div className="border-b pb-4">
                <Typography variant="h4">Heading 4</Typography>
                <Typography variant="caption" className="mt-1">text-2xl / Bold</Typography>
            </div>
            <div className="border-b pb-4">
                <Typography variant="h5">Heading 5</Typography>
                <Typography variant="caption" className="mt-1">text-xl / Semibold</Typography>
            </div>
            <div className="border-b pb-4">
                <Typography variant="h6">Heading 6</Typography>
                <Typography variant="caption" className="mt-1">text-lg / Semibold</Typography>
            </div>
        </div>
    ),
};

export const BodyText: Story = {
    render: () => (
        <div className="space-y-8 max-w-prose">
            <div>
                <Typography variant="overline" color="text-blue-600" className="mb-2 block">Introduction</Typography>
                <Typography variant="h3" className="mb-4">The Future of Design</Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                    Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning).
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    This is body2 text, which is slightly smaller and often used for secondary information or dense content areas where space is at a premium.
                </Typography>
            </div>
        </div>
    ),
};
