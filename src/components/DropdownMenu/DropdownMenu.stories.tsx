import type { Meta, StoryObj } from '@storybook/react';
import {
    DropdownMenu,
    DropdownMenuProfileTrigger,
    DropdownMenuButtonTrigger,
} from './DropdownMenu';
import { Avatar } from '../Avatar/Avatar';
import {
    User,
    Settings,
    LogOut,
    Plus,
    Tv,
    Shield,
    Ticket,
} from 'lucide-react';

const meta: Meta<typeof DropdownMenu> = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        align: {
            control: 'select',
            options: ['left', 'right'],
            description: 'Aligns the dropdown card content relative to the trigger.',
        },
        width: {
            control: 'text',
            description: 'Custom tailwind width class for the dropdown menu card.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

// ==========================================
// 1. Basic Options Dropdown
// ==========================================
export const Default: Story = {
    args: {
        align: 'left',
        width: 'w-48',
        trigger: <DropdownMenuButtonTrigger label="Options Menu" variant="outline" />,
        items: [
            {
                label: 'View Profile',
                icon: <User className="w-4 h-4" />,
                onClick: () => alert('Viewing profile...'),
            },
            {
                label: 'Settings',
                icon: <Settings className="w-4 h-4" />,
                onClick: () => alert('Opening settings...'),
            },
            { type: 'separator' },
            {
                label: 'Delete Account',
                icon: <LogOut className="w-4 h-4" />,
                variant: 'danger',
                onClick: () => alert('Confirm deletion?'),
            },
        ],
    },
};

// ==========================================
// 2. Profile Dropdown (Cinephoriax Header configuration)
// ==========================================
export const ProfileDropdown: Story = {
    args: {
        align: 'right',
        width: 'w-64',
        trigger: (
            <DropdownMenuProfileTrigger
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                name="Sarah Jenkins"
                role="Theater Manager"
                status="online"
            />
        ),
        header: {
            avatar: (
                <Avatar
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                    alt="Sarah Jenkins"
                    size="sm"
                />
            ),
            name: 'Sarah Jenkins',
            email: 's.jenkins@cinephoriax.com',
            role: 'Manager',
        },
        items: [
            {
                label: 'My Profile',
                icon: <User className="w-4 h-4" />,
                onClick: () => alert('Navigating to profile...'),
            },
            {
                label: 'Booking History',
                icon: <Ticket className="w-4 h-4" />,
                onClick: () => alert('Opening bookings...'),
            },
            {
                label: 'Account Settings',
                icon: <Settings className="w-4 h-4" />,
                onClick: () => alert('Opening account settings...'),
            },
            { type: 'separator' },
            { type: 'group-label', label: 'Management' },
            {
                label: 'Theater Screens',
                icon: <Tv className="w-4 h-4" />,
                badge: (
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        Active
                    </span>
                ),
                onClick: () => alert('Opening screens management...'),
            },
            {
                label: 'Access Control',
                icon: <Shield className="w-4 h-4" />,
                onClick: () => alert('Opening access permissions...'),
            },
            { type: 'separator' },
            {
                label: 'Sign Out',
                icon: <LogOut className="w-4 h-4" />,
                variant: 'danger',
                onClick: () => alert('Signing out of Cinephoriax...'),
            },
        ],
    },
};

// ==========================================
// 3. Dense Menu with Shortcuts & Badges
// ==========================================
export const ShortcutsAndBadges: Story = {
    args: {
        align: 'left',
        width: 'w-56',
        trigger: (
            <DropdownMenuButtonTrigger
                label="Quick Create"
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
            />
        ),
        items: [
            {
                label: 'Add New Movie',
                shortcut: '⌥N',
                onClick: () => alert('Add movie clicked'),
            },
            {
                label: 'Add Screening',
                shortcut: '⌘S',
                badge: (
                    <span className="text-[9px] font-bold bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 px-1.5 py-0.5 rounded">
                        New
                    </span>
                ),
                onClick: () => alert('Add screening clicked'),
            },
            {
                label: 'Add Concession Room',
                shortcut: '⌥C',
                onClick: () => alert('Add concessions clicked'),
            },
            { type: 'separator' },
            {
                label: 'Duplicate Layout',
                shortcut: '⌘D',
                disabled: true,
            },
        ],
    },
};
