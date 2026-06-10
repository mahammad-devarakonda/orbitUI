import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type Column } from './DataTable';
import { Button } from '../Button/Button';
import { Pencil, Plus } from 'lucide-react';

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

interface Agency {
    id: string;
    organization: string;
    agencyName: string;
    agencyType: string;
    agencyAddress: string;
    status: 'Active' | 'Inactive';
}

const sampleAgencies: Agency[] = [
    {
        id: '1',
        organization: '-',
        agencyName: 'New',
        agencyType: 'Court',
        agencyAddress: 'Richard, Winston Church, ALAB...',
        status: 'Inactive',
    },
    {
        id: '2',
        organization: 'Lco child support services',
        agencyName: 'Lco child support services',
        agencyType: 'Childsupport',
        agencyAddress: '13394 W. Trepania Road, Haywa...',
        status: 'Active',
    },
];

export const AdvancedAgencyTable: Story = {
    render: () => {
        const [search, setSearch] = useState('');
        const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
            organization: '',
            agencyName: '',
            agencyType: '',
            status: '',
        });
        const [rowsPerPage, setRowsPerPage] = useState(10);
        const [page, setPage] = useState(1);

        const handleFilterChange = (key: string, value: string | string[]) => {
            setFilterValues((prev) => ({ ...prev, [key]: value }));
            setPage(1);
        };

        const handleClearFilters = () => {
            setSearch('');
            setFilterValues({
                organization: '',
                agencyName: '',
                agencyType: '',
                status: '',
            });
            setPage(1);
        };

        const columns: Column<Agency>[] = [
            {
                header: 'Organization',
                accessor: 'organization',
            },
            {
                header: 'Agency Name',
                accessor: 'agencyName',
            },
            {
                header: 'Agency Type',
                accessor: 'agencyType',
            },
            {
                header: 'Agency Address',
                accessor: 'agencyAddress',
            },
            {
                header: 'Status',
                accessor: (row: Agency) => (
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold select-none ${
                            row.status === 'Active'
                                    ? 'bg-emerald-150 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                    >
                        {row.status}
                    </span>
                ),
            },
            {
                header: 'Action',
                accessor: (row: Agency) => (
                    <button
                        onClick={() => alert(`Editing Agency ID: ${row.id}`)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline cursor-pointer border-none bg-transparent"
                    >
                        <Pencil size={12} className="stroke-[2.5]" />
                        <span>Edit</span>
                    </button>
                ),
            },
        ];

        // Filtering logic
        const filteredData = sampleAgencies.filter((agency) => {
            // Search query matches organization, name, address, or type
            const matchesSearch =
                !search ||
                agency.organization.toLowerCase().includes(search.toLowerCase()) ||
                agency.agencyName.toLowerCase().includes(search.toLowerCase()) ||
                agency.agencyType.toLowerCase().includes(search.toLowerCase()) ||
                agency.agencyAddress.toLowerCase().includes(search.toLowerCase());

            const orgVal = filterValues.organization;
            const matchesOrg = !orgVal || 
                (Array.isArray(orgVal) ? orgVal.includes(agency.organization) : agency.organization === orgVal);

            const nameVal = filterValues.agencyName;
            const matchesName = !nameVal || 
                (Array.isArray(nameVal) ? nameVal.includes(agency.agencyName) : agency.agencyName === nameVal);

            const typeVal = filterValues.agencyType;
            const matchesType = !typeVal || 
                (Array.isArray(typeVal) ? typeVal.includes(agency.agencyType) : agency.agencyType === typeVal);

            const statusVal = filterValues.status;
            const matchesStatus = !statusVal || 
                (Array.isArray(statusVal) ? statusVal.includes(agency.status) : agency.status === statusVal);

            return matchesSearch && matchesOrg && matchesName && matchesType && matchesStatus;
        });

        // Simple paginated segment
        const totalRows = filteredData.length;
        const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
        const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

        const filterConfigs = [
            {
                key: 'organization',
                label: 'Organization',
                options: [
                    { label: 'Lco child support services', value: 'Lco child support services' },
                    { label: 'None (-)', value: '-' },
                ],
            },
            {
                key: 'agencyName',
                label: 'Agency name',
                options: [
                    { label: 'New', value: 'New' },
                    { label: 'Lco child support services', value: 'Lco child support services' },
                ],
            },
            {
                key: 'agencyType',
                label: 'Agency type',
                options: [
                    { label: 'Court', value: 'Court' },
                    { label: 'Childsupport', value: 'Childsupport' },
                ],
            },
            {
                key: 'status',
                label: 'Status',
                options: [
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' },
                ],
            },
        ];

        return (
            <div className="w-full max-w-6xl mx-auto space-y-4 font-sans">
                <DataTable
                    data={paginatedData}
                    columns={columns as any}
                    keyExtractor={(item) => item.id}
                    searchable={true}
                    searchPlaceholder="Search"
                    searchValue={search}
                    onSearchChange={setSearch}
                    headerActions={
                        <Button
                            onClick={() => alert('Add Agency clicked!')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wide shadow shadow-blue-600/10 flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-none"
                        >
                            <Plus size={14} className="stroke-[3]" />
                            <span>ADD AGENCY</span>
                        </Button>
                    }
                    filters={filterConfigs}
                    filterValues={filterValues}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(val) => {
                        setRowsPerPage(val);
                        setPage(1);
                    }}
                    totalRows={totalRows}
                    pagination={{
                        currentPage: page,
                        totalPages: totalPages,
                        onPageChange: setPage,
                    }}
                />
            </div>
        );
    },
};
