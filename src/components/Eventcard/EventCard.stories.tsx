import type { Meta, StoryObj } from '@storybook/react';
import EventCard from './EventCard';
import { Slider } from '../Slider';
const meta: Meta<typeof EventCard> = {
    title: 'Cards/EventCard',
    component: EventCard,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    argTypes: {
        gradientFrom: { control: 'text' },
        gradientTo: { control: 'text' },
        onClick: { action: 'clicked' },
    },
};

export default meta;
type Story = StoryObj<typeof EventCard>;

// ─── Single card stories ──────────────────────────────────────────────────────

export const Default: Story = {
    args: {
        title: 'Music Shows',
        countText: '45+ Events',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-fuchsia-500',
        gradientTo: 'to-violet-700',
    },
};

export const AmusementPark: Story = {
    args: {
        title: 'Amusement Park',
        countText: '15+ Events',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-600',
    },
};

export const Kids: Story = {
    args: {
        title: 'Kids',
        countText: '10+ Events',
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-amber-400',
        gradientTo: 'to-orange-500',
    },
};

export const CustomSize: Story = {
    args: {
        title: 'Food & Drinks',
        countText: '20+ Events',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-yellow-500',
        gradientTo: 'to-amber-700',
        className: 'w-72 md:w-80',
    },
};

// ─── Grid layout ─────────────────────────────────────────────────────────────

const allEvents = [
    {
        title: 'Amusement Park',
        countText: '15+ Events',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-600',
    },
    {
        title: 'Theatre Shows',
        countText: '9 Events',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-sky-600',
        gradientTo: 'to-indigo-900',
    },
    {
        title: 'Kids',
        countText: '10+ Events',
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-amber-400',
        gradientTo: 'to-orange-500',
    },
    {
        title: 'Adventure & Fun',
        countText: '7 Events',
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-teal-500',
        gradientTo: 'to-emerald-700',
    },
    {
        title: 'Music Shows',
        countText: '45+ Events',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-fuchsia-500',
        gradientTo: 'to-violet-700',
    },
    {
        title: 'Comedy Shows',
        countText: '12 Events',
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?q=80&w=600&auto=format&fit=crop',
        gradientFrom: 'from-red-500',
        gradientTo: 'to-rose-700',
    },
];

export const GridLayout: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl max-w-3xl">
            {allEvents.map((event, i) => (
                <EventCard
                    key={i}
                    {...event}
                    onClick={() => alert(`Clicked: ${event.title}`)}
                />
            ))}
        </div>
    ),
};

// ─── Inside Slider ────────────────────────────────────────────────────────────

export const InsideSlider: Story = {
    render: () => (
        <div className="w-full max-w-5xl px-8 py-10 bg-gray-50 rounded-3xl shadow-inner">
            <Slider
                title="The Best Of Live Events"
                subtitle="Explore the most exciting events happening near you"
                seeAll={{ label: 'See all events', onClick: () => alert('See all') }}
                showDots
                snapToPage
                gap={16}
            >
                {allEvents.map((event, i) => (
                    <EventCard
                        key={i}
                        {...event}
                        onClick={() => alert(`Clicked: ${event.title}`)}
                    />
                ))}
            </Slider>
        </div>
    ),
};