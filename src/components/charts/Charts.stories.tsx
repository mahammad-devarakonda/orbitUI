/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartThemeProvider, useChartTheme } from './theme/ChartThemeContext';
import { OrbitLineChart } from './LineChart/OrbitLineChart';
import { OrbitAreaChart } from './AreaChart/OrbitAreaChart';
import { OrbitBarChart } from './BarChart/OrbitBarChart';
import { OrbitPieChart } from './PieChart/OrbitPieChart';
import { OrbitDonutChart } from './DonutChart/OrbitDonutChart';
import { OrbitRadarChart } from './RadarChart/OrbitRadarChart';
import { OrbitRadialProgress } from './RadialProgress/OrbitRadialProgress';
import { OrbitHeatMap } from './HeatMap/OrbitHeatMap';
import { OrbitComposedChart } from './ComposedChart/OrbitComposedChart';
import { OrbitAnalyticsCard } from './AnalyticsCard/OrbitAnalyticsCard';

// ----------------------------------------------------
// High-Fidelity Mock SaaS Datasets
// ----------------------------------------------------

const mrrData = [
  { month: 'Jan', revenue: 45000, expenses: 24000 },
  { month: 'Feb', revenue: 52000, expenses: 26000 },
  { month: 'Mar', revenue: 61000, expenses: 28000 },
  { month: 'Apr', revenue: 58000, expenses: 31000 },
  { month: 'May', revenue: 71000, expenses: 30000 },
  { month: 'Jun', revenue: 84000, expenses: 34000 },
  { month: 'Jul', revenue: 99000, expenses: 38000 },
  { month: 'Aug', revenue: 95000, expenses: 37000 },
  { month: 'Sep', revenue: 112000, expenses: 42000 },
];

const trafficData = [
  { date: '05-14', desktop: 1420, mobile: 820 },
  { date: '05-15', desktop: 1650, mobile: 940 },
  { date: '05-16', desktop: 1890, mobile: 1100 },
  { date: '05-17', desktop: 1540, mobile: 890 },
  { date: '05-18', desktop: 2100, mobile: 1300 },
  { date: '05-19', desktop: 2420, mobile: 1420 },
  { date: '05-20', desktop: 2890, mobile: 1650 },
];

const salesData = [
  { category: 'Laptops', sales: 12000, profit: 4200 },
  { category: 'Phones', sales: 18500, profit: 5800 },
  { category: 'Tablets', sales: 9400, profit: 2100 },
  { category: 'Monitors', sales: 7200, profit: 1800 },
  { category: 'Keyboards', sales: 3100, profit: 900 },
];

const channelData = [
  { channel: 'Organic', users: 4830 },
  { channel: 'Paid Search', users: 2940 },
  { channel: 'Referral', users: 1820 },
  { channel: 'Social Media', users: 1430 },
  { channel: 'Direct Traffic', users: 2150 },
];

const locationData = [
  { region: 'US-East', instances: 42 },
  { region: 'US-West', instances: 28 },
  { region: 'EU-West', instances: 35 },
  { region: 'AP-East', instances: 19 },
];

const skillData = [
  { subject: 'React', Senior: 95, Mid: 70, Junior: 35 },
  { subject: 'TypeScript', Senior: 90, Mid: 65, Junior: 20 },
  { subject: 'Node.js', Senior: 80, Mid: 60, Junior: 40 },
  { subject: 'CSS/Tailwind', Senior: 85, Mid: 75, Junior: 50 },
  { subject: 'GraphQL', Senior: 70, Mid: 45, Junior: 15 },
  { subject: 'Testing', Senior: 75, Mid: 50, Junior: 10 },
];

const heatmapData = [
  { x: 'W1', y: 'Mon', value: 45 }, { x: 'W1', y: 'Tue', value: 20 }, { x: 'W1', y: 'Wed', value: 80 }, { x: 'W1', y: 'Thu', value: 12 }, { x: 'W1', y: 'Fri', value: 95 },
  { x: 'W2', y: 'Mon', value: 30 }, { x: 'W2', y: 'Tue', value: 65 }, { x: 'W2', y: 'Wed', value: 40 }, { x: 'W2', y: 'Thu', value: 75 }, { x: 'W2', y: 'Fri', value: 18 },
  { x: 'W3', y: 'Mon', value: 90 }, { x: 'W3', y: 'Tue', value: 15 }, { x: 'W3', y: 'Wed', value: 110 }, { x: 'W3', y: 'Thu', value: 40 }, { x: 'W3', y: 'Fri', value: 85 },
  { x: 'W4', y: 'Mon', value: 5 },  { x: 'W4', y: 'Tue', value: 50 }, { x: 'W4', y: 'Wed', value: 35 }, { x: 'W4', y: 'Thu', value: 90 }, { x: 'W4', y: 'Fri', value: 60 },
];

const composedData = [
  { month: 'Jan', signups: 120, conversions: 45, totalRevenue: 15000 },
  { month: 'Feb', signups: 160, conversions: 62, totalRevenue: 18000 },
  { month: 'Mar', signups: 210, conversions: 80, totalRevenue: 24000 },
  { month: 'Apr', signups: 190, conversions: 75, totalRevenue: 22000 },
  { month: 'May', signups: 260, conversions: 110, totalRevenue: 31000 },
  { month: 'Jun', signups: 320, conversions: 145, totalRevenue: 42000 },
];

const sparklineMock = [
  { x: 1, y: 35 }, { x: 2, y: 48 }, { x: 3, y: 40 }, { x: 4, y: 65 }, { x: 5, y: 55 }, { x: 6, y: 72 }, { x: 7, y: 88 }
];

const sparklineMockDown = [
  { x: 1, y: 85 }, { x: 2, y: 72 }, { x: 3, y: 78 }, { x: 4, y: 54 }, { x: 5, y: 60 }, { x: 6, y: 41 }, { x: 7, y: 32 }
];

// Helper to render responsive knobs
const meta: Meta = {
  title: 'Components/Charts',
  decorators: [
    (Story) => (
      <ChartThemeProvider defaultPreset="default" defaultMode="auto">
        <div className="p-8 max-w-4xl mx-auto space-y-12 bg-zinc-50 dark:bg-zinc-950/80 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 min-h-screen">
          {/* Header Theme Switch Demo */}
          <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6 mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Orbit UI Analytics Hub</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Enterprise charting library for highly scalable metric dashboards.</p>
            </div>
            <PresetThemeSwitcher />
          </div>
          <Story />
        </div>
      </ChartThemeProvider>
    ),
  ],
};

export default meta;

// Theme Switcher for Storybook Knobs Demonstration
const PresetThemeSwitcher: React.FC = () => {
  const { presetName, setPresetName, mode, setMode } = useChartTheme();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={presetName}
        onChange={(e) => setPresetName(e.target.value as any)}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
      >
        <option value="default">Orbit Default</option>
        <option value="vercel">Vercel (Mono)</option>
        <option value="stripe">Stripe (Blurple)</option>
        <option value="linear">Linear (Cool)</option>
        <option value="tremor">Tremor (Vibrant)</option>
      </select>

      <button
        type="button"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200/30 dark:border-zinc-800/30 text-zinc-800 dark:text-zinc-200 cursor-pointer"
      >
        Mode: {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
};

// ----------------------------------------------------
// 1. OrbitLineChart Story
// ----------------------------------------------------
export const LineChart: StoryObj = {
  render: () => {
    const [filter, setFilter] = useState('1M');
    return (
      <OrbitLineChart
        title="Revenue & Runway Trends"
        subtitle="Monthly SaaS Recurring Revenue vs Running Operational Expenses"
        data={mrrData}
        index="month"
        categories={['revenue', 'expenses']}
        filters={['1W', '1M', '3M', 'YTD']}
        activeFilter={filter}
        onFilterChange={setFilter}
        formatterOptions={{ type: 'currency', currency: 'USD', decimals: 0 }}
      />
    );
  },
};

// ----------------------------------------------------
// 2. OrbitAreaChart Story
// ----------------------------------------------------
export const AreaChart: StoryObj = {
  render: () => {
    return (
      <OrbitAreaChart
        title="Dashboard Visitor Traffic"
        subtitle="Daily unique traffic sessions divided by client browser categories"
        data={trafficData}
        index="date"
        categories={['desktop', 'mobile']}
        formatterOptions={{ type: 'number' }}
      />
    );
  },
};

// ----------------------------------------------------
// 3. OrbitBarChart Story
// ----------------------------------------------------
export const BarChart: StoryObj = {
  render: () => {
    return (
      <OrbitBarChart
        title="Hardware Sales Performance"
        subtitle="Quarterly gross sales volume vs accrued profit shares"
        data={salesData}
        index="category"
        categories={['sales', 'profit']}
        barRadius={6}
        formatterOptions={{ type: 'currency', decimals: 0 }}
      />
    );
  },
};

// ----------------------------------------------------
// 4. OrbitPieChart Story
// ----------------------------------------------------
export const PieChart: StoryObj = {
  render: () => {
    return (
      <OrbitPieChart
        title="User Acquisition Channels"
        subtitle="Distribution share of total registered SaaS users"
        data={channelData}
        category="users"
        index="channel"
        outerRadius="80%"
        height={320}
      />
    );
  },
};

// ----------------------------------------------------
// 5. OrbitDonutChart Story
// ----------------------------------------------------
export const DonutChart: StoryObj = {
  render: () => {
    return (
      <OrbitDonutChart
        title="Cloud Operations Distribution"
        subtitle="Active server instance count allocated across regional data nodes"
        data={locationData}
        category="instances"
        index="region"
        centerLabel="Instances"
        height={320}
      />
    );
  },
};

// ----------------------------------------------------
// 6. OrbitRadarChart Story
// ----------------------------------------------------
export const RadarChart: StoryObj = {
  render: () => {
    return (
      <OrbitRadarChart
        title="Team Skill Mapping"
        subtitle="Comparative skill matrices between Senior, Mid-Level, and Junior Developers"
        data={skillData}
        index="subject"
        categories={['Senior', 'Mid', 'Junior']}
        height={360}
      />
    );
  },
};

// ----------------------------------------------------
// 7. OrbitRadialProgress Story
// ----------------------------------------------------
export const RadialProgress: StoryObj = {
  render: () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OrbitRadialProgress
          title="Conversion Optimization"
          subtitle="Funnel checkout click-through"
          value={78}
          label="Checkouts"
          size={180}
        />
        <OrbitRadialProgress
          title="Server Health Status"
          subtitle="CPU cores current loading"
          value={42}
          label="CPU Load"
          size={180}
        />
        <OrbitRadialProgress
          title="Monthly Goal Progress"
          subtitle="SaaS quota revenue targets"
          value={94}
          label="Goal Met"
          size={180}
        />
      </div>
    );
  },
};

// ----------------------------------------------------
// 8. OrbitHeatMap Story
// ----------------------------------------------------
export const HeatMap: StoryObj = {
  render: () => {
    return (
      <OrbitHeatMap
        title="Developer Contribution Matrix"
        subtitle="Daily Git activity volume logged across core engineering repositories"
        data={heatmapData}
        xKey="x"
        yKey="y"
        valueKey="value"
        valueFormatter={(val) => `${val} commits`}
        height={240}
      />
    );
  },
};

// ----------------------------------------------------
// 9. OrbitComposedChart Story
// ----------------------------------------------------
export const ComposedChart: StoryObj = {
  render: () => {
    return (
      <OrbitComposedChart
        title="Composite Product Conversions"
        subtitle="Total site signups and successful conversions matched with gross revenue rates"
        data={composedData}
        index="month"
        areas={[{ key: 'totalRevenue', stackId: 'a' }]}
        bars={[{ key: 'signups' }]}
        lines={[{ key: 'conversions' }]}
        formatterOptions={{ type: 'number' }}
      />
    );
  },
};

// ----------------------------------------------------
// 10. OrbitAnalyticsCard (SaaS Hub Mockup) Story
// ----------------------------------------------------
export const AnalyticsCard: StoryObj = {
  render: () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">Premium SaaS Widget Grid</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <OrbitAnalyticsCard
            title="Monthly Recurring Revenue"
            value="$145,290"
            change={14.8}
            changeLabel="from last month"
            sparklineData={sparklineMock}
            sparklineCategory="y"
          />

          <OrbitAnalyticsCard
            title="Active Subscribers"
            value="8,420"
            change={8.3}
            changeLabel="vs last week"
            sparklineData={sparklineMock}
            sparklineCategory="y"
          />

          <OrbitAnalyticsCard
            title="API Failure Rates"
            value="0.04%"
            change={-12.5}
            changeLabel="vs yesterday"
            sparklineData={sparklineMockDown}
            sparklineCategory="y"
          />
        </div>

        {/* Analytics Card wrapping a full interactive chart */}
        <OrbitAnalyticsCard
          title="Core Operations Statistics"
          value="$14,502"
          description="Detailed analytical records for general operations"
        >
          <div className="h-[220px]">
            <OrbitAreaChart
              data={trafficData}
              index="date"
              categories={['desktop', 'mobile']}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              height={220}
            />
          </div>
        </OrbitAnalyticsCard>
      </div>
    );
  },
};
