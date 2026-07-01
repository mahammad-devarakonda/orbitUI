import type { Meta, StoryObj } from '@storybook/react';
import { MovieTicket } from './MovieTicket';

const meta: Meta<typeof MovieTicket> = {
    title: 'Components/MovieTicket',
    component: MovieTicket,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MovieTicket>;

export const Detailed: Story = {
    args: {
        movieTitle: 'Dilwale Dulhania Le Jayenge',
        posterUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Dilwale_Dulhania_Le_Jayenge_poster.jpg',
        language: 'Hindi',
        format: '2D',
        location: 'Maratha Mandir; Mumbai Central',
        date: 'Tue, 01 Nov',
        time: '11:30 AM',
        screen: 'SCREEN 1',
        seats: 'DRESS CI - F7',
        rating: 'U',
        duration: '3h 10m',
        bookingId: 'WHL6CTF',
        transactionId: 'TXN_ID_992182741',
        price: 'Rs.34.54',
        bookingDate: 'Oct 28, 2026',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WHL6CTF',
        onCancelBooking: () => alert('Booking cancellation initiated...'),
        onContactSupport: () => alert('Calling support line...'),
    },
};

