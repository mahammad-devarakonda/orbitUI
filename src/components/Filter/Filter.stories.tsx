import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Filter, type FilterProps, type FilterConfig } from './Filter';
import type { Range } from 'react-date-range';

const meta: Meta<typeof Filter> = {
    title: 'Components/Filter',
    component: Filter,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Filter>;

const sampleFilters: FilterConfig[] = [
    {
        key: 'status',
        label: 'Status',
        options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
        ],
        type: 'select',
    },
    {
        key: 'role',
        label: 'Role',
        options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
            { label: 'Manager', value: 'manager' },
        ],
        type: 'select',
    },
    {
        key: 'createdDate',
        label: 'Created Date',
        type: 'date',
    },
];

const FilterWrapper = (args: Omit<FilterProps, 'filterValues' | 'onFilterChange' | 'onClearFilters'>) => {
    const [filterValues, setFilterValues] = useState<Record<string, string | string[] | Range | undefined>>({
        status: '',
        role: [],
        createdDate: undefined,
    });

    const handleFilterChange = (key: string, value: string | string[] | Range | undefined) => {
        setFilterValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilterValues({
            status: '',
            role: [],
            createdDate: undefined,
        });
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
            <Filter
                {...args}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showCustomRanges={true}
            />
            <div className="mt-4 text-xs text-slate-500">
                Active values: {JSON.stringify(filterValues)}
            </div>
        </div>
    );
};

export const Default: Story = {
    render: (args) => <FilterWrapper {...args} />,
    args: {
        filters: sampleFilters,
    },
};
