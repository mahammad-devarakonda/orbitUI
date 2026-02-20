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
        movieTitle: 'Bahubali',
        posterUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg',
        language: 'Telugu',
        format: '2D',
        location: 'Maratha Mandir: Mumbai Central',
        date: 'Tue, 01 Nov',
        time: '11:30 am',
        screen: 'SCREEN 1',
        seats: 'DRESS CI - F7',
        rating: 'U',
        duration: '3h 10m',
        bookingId: 'ORB20239180',
        transactionId: 'TXN_ID_992182741',
        price: '₹350.00',
        bookingDate: 'Oct 28, 2026',
        isFavorite: true,
    },
};

export const SciFiPremium: Story = {
    args: {
        movieTitle: 'Interstellar',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        language: 'ENGLISH',
        format: 'IMAX 70MM',
        location: 'PVR: ICON, Phoenix Palladium',
        date: 'Fri, 12 Nov',
        time: '09:00 pm',
        screen: 'IMAX 1',
        seats: 'PRO-KING: H12',
        rating: 'UA',
        duration: '2h 49m',
        bookingId: 'BK_INT_2901',
        transactionId: 'TXN_G_PAY_7718',
        price: '₹850.00',
        bookingDate: 'Nov 05, 2026',
        isFavorite: false,
    },
};

export const WithQRCode: Story = {
    args: {
        ...Detailed.args,
        movieTitle: 'The Dark Knight',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        qrCodeUrl: 'https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_1280.png',
        bookingId: 'GOTHAM_KNIGHT_2',
        price: '₹420.69',
    },
};
