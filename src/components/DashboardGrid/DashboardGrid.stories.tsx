import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardGrid, type DashboardWidget } from './DashboardGrid';
import { ChartThemeProvider } from '../charts/theme/ChartThemeContext';
import { OrbitAnalyticsCard } from '../charts/AnalyticsCard/OrbitAnalyticsCard';
import { OrbitAreaChart } from '../charts/AreaChart/OrbitAreaChart';
import { OrbitPieChart } from '../charts/PieChart/OrbitPieChart';

const meta: Meta<typeof DashboardGrid> = {
  title: 'Components/DashboardGrid',
  component: DashboardGrid,
  decorators: [
    (Story) => (
      <ChartThemeProvider defaultPreset="default" defaultMode="auto">
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Interactive Dashboard Grid</h1>
            <p className="text-xs text-slate-500 mt-1">
              Drag widgets by their handle (<span className="font-mono">::</span>) to rearrange. Add, remove, or reset layout dynamically.
            </p>
          </div>
          <Story />
        </div>
      </ChartThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DashboardGrid>;


const trafficData = [
  { date: '06-01', desktop: 1200, mobile: 600 },
  { date: '06-02', desktop: 1400, mobile: 700 },
  { date: '06-03', desktop: 1100, mobile: 800 },
  { date: '06-04', desktop: 1600, mobile: 900 },
  { date: '06-05', desktop: 1800, mobile: 1100 },
  { date: '06-06', desktop: 2100, mobile: 1300 },
];

const categoryData = [
  { name: 'SaaS Subscriptions', value: 4500 },
  { name: 'Professional Services', value: 2500 },
  { name: 'Training & Audits', value: 1200 },
];

export const DefaultDashboard: Story = {
  render: () => {
    const createWidgets = (onRemove: (id: string) => void): DashboardWidget[] => [
      {
        id: 'widget-kpi-1',
        title: 'Monthly Revenue target',
        subtitle: 'SaaS recurring revenue totals',
        colSpan: 1,
        content: (
          <OrbitAnalyticsCard
            title="SaaS MRR"
            value="$45,290"
            change={12.4}
            changeLabel="from last month"
            className="border-none p-0 bg-transparent shadow-none"
          />
        ),
        onRemove: () => onRemove('widget-kpi-1'),
      },
      {
        id: 'widget-kpi-2',
        title: 'Conversion Rate Optimization',
        subtitle: 'Funnel signup conversions',
        colSpan: 1,
        content: (
          <OrbitAnalyticsCard
            title="Checkout Success"
            value="3.84%"
            change={0.4}
            changeLabel="vs yesterday"
            className="border-none p-0 bg-transparent shadow-none font-bold"
          />
        ),
        onRemove: () => onRemove('widget-kpi-2'),
      },
      {
        id: 'widget-pie',
        title: 'Sales Categories',
        subtitle: 'Distribution of gross sales',
        colSpan: 1,
        content: (
          <div className="h-[180px] flex items-center justify-center">
            <OrbitPieChart
              data={categoryData}
              category="value"
              index="name"
              outerRadius="75%"
              height={180}
            />
          </div>
        ),
        onRemove: () => onRemove('widget-pie'),
      },
      {
        id: 'widget-chart',
        title: 'Customer Acquisition Trends',
        subtitle: 'Unique visitor sessions per channel',
        colSpan: 2,
        content: (
          <div className="h-[200px]">
            <OrbitAreaChart
              data={trafficData}
              index="date"
              categories={['desktop', 'mobile']}
              height={200}
            />
          </div>
        ),
        onRemove: () => onRemove('widget-chart'),
      },
      {
        id: 'widget-quick-links',
        title: 'Admin Shortcuts',
        subtitle: 'Most visited services',
        colSpan: 1,
        content: (
          <div className="space-y-3 font-sans">
            <a href="#" className="block p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 transition text-xs font-semibold">
              🚀 Deploy New Cluster Server
            </a>
            <a href="#" className="block p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 transition text-xs font-semibold">
              🔑 Rotate Root Security Keys
            </a>
            <a href="#" className="block p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 transition text-xs font-semibold">
              📊 Download Financial Auditing
            </a>
          </div>
        ),
        onRemove: () => onRemove('widget-quick-links'),
      },
    ];

    const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const removeWidget = (id: string) => {
      setWidgets((prev) => prev.filter((w) => w.id !== id));
    };

    if (!isInitialized) {
      setWidgets(createWidgets(removeWidget));
      setIsInitialized(true);
    }

    const handleReset = () => {
      setWidgets(createWidgets(removeWidget));
    };

    return (
      <div className="space-y-6">
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer shadow"
          >
            Reset Layout
          </button>
        </div>
        <DashboardGrid items={widgets} onLayoutChange={setWidgets} cols={3} />
      </div>
    );
  },
};
