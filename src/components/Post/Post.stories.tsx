import type { Meta, StoryObj } from '@storybook/react';
import { Post } from './Post';

const meta: Meta<typeof Post> = {
    title: 'Components/Post',
    component: Post,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Post>;

export const Default: Story = {
    args: {
        username: 'space_explorer',
        profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        postImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=600&fit=crop',
        likesCount: 1420,
        caption: 'The vastness of space is breathtaking. Just look at this view of Earth! 🌍✨ #space #orbit #earth',
        location: 'International Space Station',
        isLiked: false,
        isBookmarked: false,
    },
};

export const Liked: Story = {
    args: {
        ...Default.args,
        username: 'travel_goals',
        profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        postImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=600&fit=crop',
        likesCount: 8521,
        caption: 'Waking up to this view was a dream. Can you guess where this is? 🏔️🛶',
        location: 'Banff, Canada',
        isLiked: true,
    },
};

export const Bookmarked: Story = {
    args: {
        ...Default.args,
        username: 'tech_ninja',
        profilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
        postImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop',
        likesCount: 420,
        caption: 'Coding session tonight. Productivity is at its peak! 💻☕ #code #react #orbitui',
        isBookmarked: true,
    },
};

export const NoLocation: Story = {
    args: {
        ...Default.args,
        username: 'minimalist_vibes',
        caption: 'Simplicity is the ultimate sophistication.',
        location: undefined,
    },
};

