import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Box } from '../Box/Box'; // Assuming Box is in a sibling directory

const meta: Meta<typeof Stack> = {
    title: 'Components/Stack',
    component: Stack,
    tags: ['autodocs'],
    argTypes: {
        direction: {
            control: 'select',
            options: ['row', 'column', 'row-reverse', 'column-reverse'],
        },
        spacing: {
            control: 'text', // Allow testing both numbers and strings
        },
        alignItems: {
            control: 'select',
            options: ['start', 'center', 'end', 'stretch', 'baseline'],
        },
        justifyContent: {
            control: 'select',
            options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
        },
        wrap: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Item = ({ children }: { children: React.ReactNode }) => (
    <Box className="p-4 bg-white border border-gray-200 rounded shadow-sm text-center">
        {children}
    </Box>
);

export const Default: Story = {
    args: {
        children: (
            <>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
            </>
        ),
        spacing: 4,
    },
};

export const DirectionRow: Story = {
    args: {
        direction: 'row',
        spacing: 4,
        children: (
            <>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
            </>
        ),
    },
};

export const WithDivider: Story = {
    args: {
        direction: 'column',
        spacing: 4,
        divider: <div className="border-t border-gray-300 w-full" />,
        children: (
            <>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
            </>
        ),
    },
};

export const NestedStack: Story = {
    render: () => (
        <Stack spacing={4} className="bg-gray-50 p-4 rounded">
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="between">
                <Box className="font-bold">Header</Box>
                <Box className="text-sm text-gray-500">Subtitle</Box>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Item>Left Content</Item>
                <Item>Right Content</Item>
            </Stack>
        </Stack>
    ),
};

export const FlexWrap: Story = {
    args: {
        direction: 'row',
        spacing: 2,
        flexWrap: 'wrap',
        className: 'w-64 bg-gray-100 p-2', // Constrain width to force wrap
        children: (
            <>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Box key={i} className="p-2 bg-blue-100 border border-blue-200 rounded w-20 text-center">
                        Box {i + 1}
                    </Box>
                ))}
            </>
        ),
    },
};
