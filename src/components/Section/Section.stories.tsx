import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import { Button } from '../Button/Button';

const meta: Meta<typeof Section> = {
    title: 'Components/Section',
    component: Section,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Section>;

const sampleContent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Task Analytics</h3>
            <p className="text-sm text-gray-500">Track task distribution, pending closures, and developer milestones.</p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Product Backlog</h3>
            <p className="text-sm text-gray-500">Prioritize roadmap features, active sprints, and bug registers.</p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Team Velocity</h3>
            <p className="text-sm text-gray-500">Analyze sprint outputs, resource utilization, and burndown timelines.</p>
        </div>
    </div>
);

export const Default: Story = {
    args: {
        title: 'Project Roadmap',
        subtitle: 'Review features, milestone schedules, and task assignments for this sprint.',
        children: sampleContent,
        padding: 'md',
        width: 'lg',
    },
};

export const HeaderActions: Story = {
    args: {
        title: 'Developer Activity Log',
        subtitle: 'Real-time telemetry showing code checkins, test metrics, and pipeline logs.',
        actions: (
            <div className="flex gap-2">
                <Button variant="outline" size="sm">Export CSV</Button>
                <Button variant="primary" size="sm">Sync Logs</Button>
            </div>
        ),
        children: sampleContent,
        padding: 'md',
        width: 'lg',
    },
};

export const FlatBackground: Story = {
    args: {
        title: 'System Health Summary',
        subtitle: 'Realtime node health indices, network load levels, and database latency registers.',
        bgAccent: 'flat',
        children: sampleContent,
        padding: 'lg',
        width: 'lg',
    },
};

export const CardAccent: Story = {
    args: {
        title: 'Billing Credentials',
        subtitle: 'Modify subscription tier levels, workspace invoices, and active payment details.',
        bgAccent: 'card',
        children: sampleContent,
        padding: 'none',
        width: 'md',
    },
};

export const GradientAccent: Story = {
    args: {
        title: 'Premium Analytics Deck',
        subtitle: 'Access premium enterprise charts, revenue conversions, and global traffic metrics.',
        bgAccent: 'gradient',
        borderBottom: true,
        children: sampleContent,
        padding: 'lg',
        width: 'lg',
    },
};
