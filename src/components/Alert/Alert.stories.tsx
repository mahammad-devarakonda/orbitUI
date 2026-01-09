import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
    title: 'Components/Alert',
    component: Alert,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['info', 'success', 'warning', 'error'],
        },
        onClose: { action: 'closed' },
    },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    args: {
        children: 'This is a standard info alert with some basic information.',
        variant: 'info',
    },
};

export const Success: Story = {
    args: {
        title: 'Payment Successful',
        children: 'Your payment has been successfully processed. A receipt has been sent to your email.',
        variant: 'success',
        onClose: () => { },
    },
};

export const Error: Story = {
    args: {
        title: 'Connection Failed',
        children: 'Could not connect to the server. Please check your internet connection and try again.',
        variant: 'error',
        onClose: () => { },
    },
};

export const Warning: Story = {
    args: {
        title: 'Storage Full',
        children: 'You are running low on storage space. Some features may not work as expected.',
        variant: 'warning',
    },
};

export const Info: Story = {
    args: {
        title: 'New Feature',
        children: 'We have updated our privacy policy. Please review the changes.',
        variant: 'info',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-4 max-w-2xl">
            <Alert variant="success" title="Success">
                Operation completed successfully.
            </Alert>
            <Alert variant="error" title="Error" onClose={() => { }}>
                Something went wrong. Please try again later.
            </Alert>
            <Alert variant="warning" title="Warning">
                This action cannot be undone.
            </Alert>
            <Alert variant="info" title="Info">
                System will be under maintenance tonight.
            </Alert>
        </div>
    ),
};
