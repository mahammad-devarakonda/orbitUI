import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';
import { TimelineItem } from './TimelineItem';
import { 
  Check, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Play, 
  Info,
  User,
  ArrowRight
} from 'lucide-react';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const DefaultVertical: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <Timeline align="left">
        <TimelineItem
          status="success"
          timestamp="June 15, 2026 - 10:00 AM"
          title="Project Initiated"
          description="Design phase completed and assets exported from Figma."
          icon={<Check size={16} />}
        />
        <TimelineItem
          status="success"
          timestamp="June 16, 2026 - 2:30 PM"
          title="Repository Setup"
          description="Setup core configurations, tailwind v4 styling, and folder structure."
          icon={<Check size={16} />}
        />
        <TimelineItem
          status="primary"
          active={true}
          timestamp="June 17, 2026 - 11:30 AM"
          title="Feature Development"
          description="Implementing the high-fidelity Timeline component with responsive layouts and Framer Motion."
          icon={<Clock size={16} />}
        />
        <TimelineItem
          status="default"
          timestamp="June 18, 2026"
          title="QA and Review"
          description="Validate component accessibility, theme compatibility, and interactive states."
        />
        <TimelineItem
          status="default"
          timestamp="June 20, 2026"
          title="Production Deploy"
          description="Publish package to registry and deploy storybook docs."
          icon={<Sparkles size={16} />}
        />
      </Timeline>
    </div>
  ),
};

export const AlternateAlignment: Story = {
  render: () => (
    <div className="w-full max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Release Roadmap</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Milestones and targets for Q3/Q4 launches</p>
      </div>
      <Timeline align="alternate">
        <TimelineItem
          status="success"
          timestamp="Phase 1 - Complete"
          title="Core Architecture"
          description="Implement base layout containers, theme system, and utility helpers."
          icon={<Check size={16} />}
        />
        <TimelineItem
          status="success"
          timestamp="Phase 2 - Complete"
          title="Typography & Forms"
          description="Release Button, Input, Select, MultiSelect, and Typography components."
          icon={<Check size={16} />}
        />
        <TimelineItem
          status="info"
          active={true}
          timestamp="Phase 3 - In Progress"
          title="Navigation & Display"
          description="Build Stepper, Drawer, Breadcrumbs, and Timeline component suite."
          icon={<Play size={16} />}
        />
        <TimelineItem
          status="warning"
          timestamp="Phase 4 - Planning"
          title="Charts & Analytics"
          description="Integrate Line, Bar, Pie, Radar, and Heatmap visualization options."
          icon={<AlertTriangle size={16} />}
        />
        <TimelineItem
          status="default"
          timestamp="Phase 5 - Future"
          title="Interactive Dashboards"
          description="Combine widgets into pre-packaged grid systems and analytics cards."
          icon={<Sparkles size={16} />}
        />
      </Timeline>
    </div>
  ),
};

export const HorizontalTimeline: Story = {
  render: () => (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Order Delivery Tracking</h3>
        <p className="text-xs text-slate-400">Order ID: #ORB-984723</p>
      </div>
      <Timeline mode="horizontal">
        <TimelineItem
          status="success"
          timestamp="09:12 AM"
          title="Ordered"
          description="Payment confirmed"
          icon={<Check size={14} />}
        />
        <TimelineItem
          status="success"
          timestamp="10:30 AM"
          title="Processing"
          description="Item packaged"
          icon={<Check size={14} />}
        />
        <TimelineItem
          status="primary"
          active={true}
          timestamp="01:15 PM"
          title="In Transit"
          description="Left local hub"
          icon={<Clock size={14} />}
        />
        <TimelineItem
          status="default"
          timestamp="Pending"
          title="Out for Delivery"
          description="Nearest delivery agent"
        />
        <TimelineItem
          status="default"
          timestamp="Pending"
          title="Delivered"
          description="Drop-off confirmed"
        />
      </Timeline>
    </div>
  ),
};

export const StatusColors: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <Timeline align="left">
        <TimelineItem
          status="default"
          timestamp="Status: Default"
          title="Default Status Event"
          description="Used for inactive, pending, or low priority logs."
        />
        <TimelineItem
          status="primary"
          timestamp="Status: Primary"
          title="Primary Status Event"
          description="Indicates important milestones or active highlight events."
          icon={<Sparkles size={16} />}
        />
        <TimelineItem
          status="success"
          timestamp="Status: Success"
          title="Success Status Event"
          description="Used for successfully completed items, checkpoints, or orders."
          icon={<Check size={16} />}
        />
        <TimelineItem
          status="info"
          timestamp="Status: Info"
          title="Info Status Event"
          description="Highlights informational details, tips, or non-blocking logs."
          icon={<Info size={16} />}
        />
        <TimelineItem
          status="warning"
          timestamp="Status: Warning"
          title="Warning Status Event"
          description="Warns of potential blockers, upcoming expirations, or delays."
          icon={<AlertTriangle size={16} />}
        />
        <TimelineItem
          status="danger"
          timestamp="Status: Danger"
          title="Danger Status Event"
          description="Indicates failures, security exceptions, or system crashes."
          icon={<AlertTriangle size={16} />}
        />
      </Timeline>
    </div>
  ),
};

export const RichInteractiveCards: Story = {
  render: () => (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800/80">
      <Timeline align="left">
        <TimelineItem
          status="success"
          timestamp="2 hours ago"
          title="Deployment Successful"
          icon={<Check size={16} />}
        >
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Build #1.2.4 successfully built in 48s and deployed to production server.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 font-mono">
                SHA: f8c07e2
              </span>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded font-medium">
                PROD
              </span>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline transition-colors mt-2">
              View Deployment Logs <ArrowRight size={12} />
            </button>
          </div>
        </TimelineItem>

        <TimelineItem
          status="warning"
          timestamp="1 day ago"
          title="Security Advisory"
          icon={<AlertTriangle size={16} />}
        >
          <div className="space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Outdated dependency <span className="font-semibold text-rose-500">npm-registry-client</span> has a vulnerability. Recommend upgrading package to version 8.6.0.
            </p>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={14} />
              <div>
                <h4 className="text-xs font-semibold text-red-800 dark:text-red-400">Critical vulnerability detected</h4>
                <p className="text-[11px] text-red-700 dark:text-red-500/80 mt-0.5">CVSS score: 7.8 (High Risk)</p>
              </div>
            </div>
          </div>
        </TimelineItem>

        <TimelineItem
          status="primary"
          active={true}
          timestamp="June 17, 2026"
          title="Assignee Updated"
          icon={<User size={16} />}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              MD
            </div>
            <div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">Mahammad Devarakonda</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Lead Frontend Engineer</p>
            </div>
            <span className="ml-auto text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded font-medium">
              Owner
            </span>
          </div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};
