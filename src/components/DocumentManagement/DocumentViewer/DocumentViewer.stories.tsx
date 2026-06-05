import type { Meta, StoryObj } from '@storybook/react';
import { DocumentViewer } from './DocumentViewer';
import { mockDocuments } from '../mockData';
import type { GeneratedDocument } from '../types/document.types';

const meta: Meta<typeof DocumentViewer> = {
  title: 'DocumentManagement/DocumentViewer',
  component: DocumentViewer,
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
type Story = StoryObj<typeof DocumentViewer>;

// Helper to generate 25 mock documents
const generateLargeDataset = (): GeneratedDocument[] => {
  const dataset: GeneratedDocument[] = [];
  const candidates = [
    'Alice Smith', 'Bob Johnson', 'Charlie Brown', 'David Lee', 'Emma Davis',
    'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Isabella Taylor', 'Jack Anderson',
    'Katherine Thomas', 'Liam Jackson', 'Mia White', 'Noah Harris', 'Olivia Martin',
    'Paul Clark', 'Quinn Rodriguez', 'Ryan Lewis', 'Sophia Walker', 'Thomas Hall',
    'Ursula Allen', 'Victor Young', 'Wendy Hernandez', 'Xavier King', 'Yvonne Wright'
  ];

  for (let i = 0; i < 25; i++) {
    const candidateName = candidates[i];
    const generatedDaysAgo = 25 - i;
    const date = new Date(Date.now() - generatedDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    if (i % 2 === 0) {
      dataset.push({
        id: `mock_large_doc_${i}`,
        templateId: 'tpl_offer_letter',
        documentName: `${candidateName} - Offer Letter`,
        generatedDate: date,
        values: {
          employeeName: candidateName,
          joiningDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          salary: 95000 + i * 2000,
          designation: i % 4 === 0 ? 'Senior Software Engineer' : 'Software Engineer',
          department: 'Engineering',
          managerName: 'Jane Smith',
        },
        renderedContent: `<div style="font-family: inherit; max-width: 600px; margin: auto; padding: 10px; line-height: 1.5;">
          <h3 style="color: #0070f3; text-align: center;">OFFER OF EMPLOYMENT</h3>
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>We are pleased to offer you employment at Orbit Technologies as a <strong>${i % 4 === 0 ? 'Senior Software Engineer' : 'Software Engineer'}</strong>.</p>
          <p>Your base compensation package will be <strong>$${(95000 + i * 2000).toLocaleString()}</strong> per annum, and your manager will be <strong>Jane Smith</strong>.</p>
          <p style="margin-top: 30px;">Date of generation: ${new Date(date).toLocaleDateString()}</p>
        </div>`,
      });
    } else {
      dataset.push({
        id: `mock_large_doc_${i}`,
        templateId: 'tpl_nda',
        documentName: `Orbit UI vs ${candidateName} - NDA`,
        generatedDate: date,
        values: {
          effectiveDate: date.split('T')[0],
          firstParty: 'Orbit UI Inc.',
          secondParty: candidateName,
          governingState: i % 3 === 0 ? 'California' : 'Delaware',
        },
        renderedContent: `<div style="font-family: inherit; max-width: 600px; margin: auto; padding: 10px; line-height: 1.5;">
          <h3 style="text-align: center;">MUTUAL NON-DISCLOSURE AGREEMENT</h3>
          <p>This agreement is entered into between <strong>Orbit UI Inc.</strong> and <strong>${candidateName}</strong>.</p>
          <p>Effective Date: <strong>${new Date(date).toLocaleDateString()}</strong></p>
          <p>Governing Jurisdiction: State of <strong>${i % 3 === 0 ? 'California' : 'Delaware'}</strong></p>
        </div>`,
      });
    }
  }
  return dataset;
};

export const SingleDocument: Story = {
  args: {
    documents: [mockDocuments[0]],
    onDelete: (id) => console.log('Deleted document ID:', id),
    onShare: (doc) => console.log('Share document:', doc),
  },
};

export const MultipleDocuments: Story = {
  args: {
    documents: mockDocuments,
    onDelete: (id) => console.log('Deleted document ID:', id),
    onShare: (doc) => console.log('Share document:', doc),
  },
};

export const LargeDataset: Story = {
  args: {
    documents: generateLargeDataset(),
    onDelete: (id) => console.log('Deleted document ID:', id),
    onShare: (doc) => console.log('Share document:', doc),
  },
};
