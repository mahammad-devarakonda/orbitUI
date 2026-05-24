import type { Meta, StoryObj } from '@storybook/react';
import { CreateTemplate } from './CreateTemplate';
import { DEMO_TEMPLATES } from './utils';

const meta: Meta<typeof CreateTemplate> = {
  title: 'Components/DocumentManagement',
  component: CreateTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreateTemplate>;

// 1. Standard Fresh Empty Template Editor
export const EmptyCanvasEditor: Story = {
  args: {
    initialTemplate: {},
  },
  render: (args) => {
    return (
      <div className="w-screen h-screen bg-slate-150 flex flex-col">
        <CreateTemplate {...args} />
      </div>
    );
  },
};

// 2. Pre-loaded with Standard Offer Letter Preset
export const PreloadedOfferLetter: Story = {
  args: {
    initialTemplate: {
      name: 'Executive Offer Letter',
      category: 'HR Management',
      blocks: DEMO_TEMPLATES.offer.blocks,
    },
  },
  render: (args) => {
    return (
      <div className="w-screen h-screen bg-slate-150 flex flex-col">
        <CreateTemplate {...args} />
      </div>
    );
  },
};

// 3. Pre-loaded with Compensation Revision Preset
export const PreloadedCompensationHike: Story = {
  args: {
    initialTemplate: {
      name: 'Compensation Hike skeleton',
      category: 'Rewards & Benefits',
      blocks: DEMO_TEMPLATES.hike.blocks,
    },
  },
  render: (args) => {
    return (
      <div className="w-screen h-screen bg-slate-150 flex flex-col">
        <CreateTemplate {...args} />
      </div>
    );
  },
};

// 4. Custom Saved Hooks Console Logger demo
export const SaveLoggerDemo: Story = {
  args: {
    initialTemplate: {
      name: 'Promotion Announcement Certificate',
      category: 'Internal Growth',
      blocks: DEMO_TEMPLATES.promotion.blocks,
    },
    onSave: (template) => {
      console.log('Storybook Saved Template:', template);
      alert(`Storybook Saved Success!\nCheck your developer console logs for full compiled HTML strings!`);
    },
    onAutosave: (template) => {
      console.log('Storybook Autosaved Template:', template);
    },
  },
  render: (args) => {
    return (
      <div className="w-screen h-screen bg-slate-150 flex flex-col">
        <CreateTemplate {...args} />
      </div>
    );
  },
};
