import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type Column } from './DataTable';
import { Avatar } from '../Avatar/Avatar';


const meta: Meta<typeof DataTable> = {
    title: 'Components/DataTable',
    component: DataTable,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

const sampleData: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'Active' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Pending' },
];

const columns: Column<User>[] = [
    {
        header: 'User',
        accessor: (row: User) => (
            <div className="flex items-center gap-3">
                <Avatar src={`https://ui-avatars.com/api/?name=${row.name}&background=random`} alt={row.name} size="sm" />
                <span className="font-medium">{row.name}</span>
            </div>
        ),
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    {
        header: 'Status',
        accessor: (row: User) => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : row.status === 'Inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
            >
                {row.status}
            </span>
        ),
    },
];

export const Default: Story = {
    args: {
        data: sampleData,
        columns: columns as any,
        keyExtractor: (item: any) => item.id,
    },
};

export const Loading: Story = {
    args: {
        data: [],
        columns: columns as any,
        keyExtractor: (item: any) => item.id,
        isLoading: true,
    },
};

export const WithPagination: Story = {
    args: {
        data: sampleData,
        columns: columns as any,
        keyExtractor: (item: any) => item.id,
        pagination: {
            currentPage: 1,
            totalPages: 5,
            onPageChange: (page) => console.log('Page changed to:', page),
        },
    },
};

export const Empty: Story = {
    args: {
        data: [],
        columns: columns as any,
        keyExtractor: (item: any) => item.id,
        emptyMessage: 'No users found.',
    },
};
