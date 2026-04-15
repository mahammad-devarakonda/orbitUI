import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Mail, Lock, Eye, CheckCircle, Info } from 'lucide-react';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        shadow: { control: 'boolean' },
        focusRing: { control: 'boolean' },
        focusRingColor: { control: 'color' },
        variant: {
            control: 'select',
            options: ['default', 'glass', 'dark'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        label: 'Small Input',
        placeholder: 'Small size',
        leftIcon: <Search />,
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        label: 'Large Input',
        placeholder: 'Large size',
        leftIcon: <Mail />,
    },
};

export const Glass: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'glass',
        label: 'Glass Variant',
        placeholder: 'Type something...',
        helperText: 'Using backdrop-blur and translucency',
        leftIcon: <CheckCircle />
    },
};

export const Dark: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'dark',
        label: 'Dark Variant',
        placeholder: 'Dark mode input',
        leftIcon: <Lock />,
    },
};

export const WithError: Story = {
    args: {
        label: 'Email',
        placeholder: 'Enter email',
        error: 'Invalid email address',
        defaultValue: "invalid-email",
        leftIcon: <Mail />,
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        helperText: 'Must be at least 8 characters long',
        leftIcon: <Lock />,
        rightIcon: <Eye className="cursor-pointer" />,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Input',
        placeholder: 'Cannot type here',
        disabled: true,
        leftIcon: <Info />,
        defaultValue: 'Read only value',
    },
};

export const Required: Story = {
    args: {
        label: 'Username',
        placeholder: 'Enter username',
        required: true,
    },
};
