import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { addHours, startOfToday } from 'date-fns';

const meta: Meta<typeof Calendar> = {
    title: 'Components/Calendar',
    component: Calendar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const today = startOfToday();

export const Default: Story = {
    args: {
        events: [
            {
                id: '1',
                title: 'Morning Sync',
                start: addHours(today, 9),
                end: addHours(today, 10),
                description: 'Daily team synchronization meeting',
                color: 'blue',
            },
            {
                id: '2',
                title: 'Design Review',
                start: addHours(today, 11),
                end: addHours(today, 12.5),
                description: 'Reviewing the new UI kit components',
                color: 'purple',
            },
            {
                id: '3',
                title: 'Lunch Break',
                start: addHours(today, 13),
                end: addHours(today, 14),
                color: 'green',
            },
            {
                id: '4',
                title: 'Product Strategy',
                start: addHours(today, 15),
                end: addHours(today, 17),
                description: 'Discussing the roadmap for Q3',
                color: 'blue',
            },
        ],
    },
};

export const Empty: Story = {
    args: {
        events: [],
    },
};
export const LargeModal: Story = {
    args: {
        events: [],
        modalSize: 'xl',
    },
};
