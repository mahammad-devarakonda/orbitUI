import type { Meta, StoryObj } from '@storybook/react';
import { GenerateDocument } from './GenerateDocument';
import { mockTemplates } from '../mockData';

const meta: Meta<typeof GenerateDocument> = {
  title: 'DocumentManagement/GenerateDocument',
  component: GenerateDocument,
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
type Story = StoryObj<typeof GenerateDocument>;

export const OfferLetterGenerator: Story = {
  args: {
    template: mockTemplates[0],
    onGenerate: (doc) => {
      console.log('Document Generated successfully!', doc);
      alert(`Document "${doc.documentName}" generated! Check console for details.`);
    },
  },
};

export const NDAGenerator: Story = {
  args: {
    template: mockTemplates[1],
    onGenerate: (doc) => {
      console.log('Document Generated successfully!', doc);
      alert(`Document "${doc.documentName}" generated! Check console for details.`);
    },
  },
};
