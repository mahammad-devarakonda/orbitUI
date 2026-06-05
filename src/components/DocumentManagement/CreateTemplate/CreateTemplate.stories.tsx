import type { Meta, StoryObj } from '@storybook/react';
import { CreateTemplate } from './CreateTemplate';
import { mockTemplates } from '../mockData';

const meta: Meta<typeof CreateTemplate> = {
  title: 'DocumentManagement/CreateTemplate',
  component: CreateTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CreateTemplate>;

export const EmptyTemplate: Story = {
  args: {
    initialTemplate: undefined,
    onSaveTemplate: (tpl) => console.log('Save Template:', tpl),
    onTemplateChange: (tpl) => console.log('Template Change:', tpl),
  },
};

export const OfferLetterTemplate: Story = {
  args: {
    initialTemplate: mockTemplates[0],
    onSaveTemplate: (tpl) => console.log('Save Template (Offer Letter):', tpl),
    onTemplateChange: (tpl) => console.log('Template Change (Offer Letter):', tpl),
  },
};

export const NDATemplate: Story = {
  args: {
    initialTemplate: mockTemplates[1],
    onSaveTemplate: (tpl) => console.log('Save Template (NDA):', tpl),
    onTemplateChange: (tpl) => console.log('Template Change (NDA):', tpl),
  },
};
