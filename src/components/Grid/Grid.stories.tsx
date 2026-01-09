import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { Box } from '../Box/Box';

const meta: Meta<typeof Grid> = {
    title: 'Components/Grid',
    component: Grid,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Grid>;

// Styled wrapper for demo purposes using our new Box component
const DemoBox = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <Box className={`p-4 rounded-lg bg-blue-100 border border-blue-200 text-blue-800 font-medium text-center ${className}`}>
        {children}
    </Box>
);

export const BasicGrid: Story = {
    args: {
        cols: 3,
        gap: 4,
        children: (
            <>
                <DemoBox>1</DemoBox>
                <DemoBox>2</DemoBox>
                <DemoBox>3</DemoBox>
                <DemoBox>4</DemoBox>
                <DemoBox>5</DemoBox>
                <DemoBox>6</DemoBox>
            </>
        ),
    },
};

export const WithSpanning: Story = {
    render: () => (
        <Grid cols={3} gap={4}>
            <Grid.Item colSpan={2}>
                <DemoBox className="bg-purple-100 border-purple-200 text-purple-800 h-full flex items-center justify-center">
                    Span 2 Cols
                </DemoBox>
            </Grid.Item>
            <DemoBox>1</DemoBox>
            <DemoBox>2</DemoBox>
            <DemoBox>3</DemoBox>
            <Grid.Item colSpan={3}>
                <DemoBox className="bg-green-100 border-green-200 text-green-800">
                    Full Width Span (3 Cols)
                </DemoBox>
            </Grid.Item>
        </Grid>
    ),
};

export const DashboardLayout: Story = {
    render: () => (
        <Grid cols={4} gap={4}>
            {/* Sidebar */}
            <Grid.Item colSpan={1} rowSpan={2}>
                <div className="bg-gray-100 h-[300px] rounded-lg p-4">Sidebar</div>
            </Grid.Item>

            {/* Header / Stats */}
            <Grid.Item colSpan={3}>
                <Grid cols={3} gap={4}>
                    <DemoBox>Stat 1</DemoBox>
                    <DemoBox>Stat 2</DemoBox>
                    <DemoBox>Stat 3</DemoBox>
                </Grid>
            </Grid.Item>

            {/* Main Content */}
            <Grid.Item colSpan={3}>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-[200px] flex items-center justify-center text-gray-400">
                    Main Content Area
                </div>
            </Grid.Item>
        </Grid>
    ),
};
