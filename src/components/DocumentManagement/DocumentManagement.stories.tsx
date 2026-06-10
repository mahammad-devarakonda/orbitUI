import type { Meta, StoryObj } from '@storybook/react';
import { DocumentViewer } from './DocumentViewer';
import { TemplatePreview } from './TemplatePreview';
import { DocumentManagementShowcase } from './Showcase';
import { generateDocument } from './generateDocument';
import type { DocumentTemplate } from './types';

// Mock template and data specifically for stories
const mockStoryTemplate: DocumentTemplate = {
  id: 'story-invoice',
  name: 'Standard Invoice Story',
  pageSize: 'A4',
  orientation: 'portrait',
  themeColor: '#000000ff', // Sky blue
  pages: [
    {
      sections: [
        {
          type: 'content',
          content: `
            <div style="font-family: sans-serif; padding-bottom: 20px;">
              <h1 style="color: {{themeColor}}; font-size: 28px; margin: 0 0 5px 0; font-weight: 800;">{{companyName}}</h1>
              <p style="font-size: 11px; color: #64748b; margin: 0;">{{companyAddress}} &bull; {{companyEmail}}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <h3 style="font-size: 16px; color: #1e293b; margin: 0 0 10px 0;">Billing Confirmation</h3>
              <p style="font-size: 12px; color: #334155; line-height: 1.6;">
                Dear <strong style="color: #0f172a;">{{customerName}}</strong>,<br/>
                We hereby confirm receipt of order reference <strong>{{invoiceNumber}}</strong>. Your services have been successfully provisioned.
              </p>
            </div>
          `
        },
        {
          type: 'table',
          tableConfig: {
            dataKey: 'items',
            columns: [
              { label: 'Description', key: 'description' },
              { label: 'Qty', key: 'quantity', align: 'center', format: 'number' },
              { label: 'Unit Price', key: 'unitPrice', align: 'right', format: 'currency' },
              { label: 'Total', key: 'total', align: 'right', format: 'currency' }
            ]
          }
        },
        {
          type: 'content',
          className: 'mt-6',
          content: `
            <div style="text-align: right; font-size: 12px; margin-top: 20px; font-weight: 500;">
              <div>Subtotal: <strong>{{subtotal}}</strong></div>
              <div>Tax ({{taxRate}}%): <strong>{{taxAmount}}</strong></div>
              <div style="font-size: 14px; font-weight: 800; color: {{themeColor}}; margin-top: 5px;">Total Due: {{totalDue}}</div>
            </div>
          `
        },
        {
          type: 'footer',
          content: `
            <div style="text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 80px;">
              Thank you for choosing {{companyName}}! For support, email {{companyEmail}}.
            </div>
          `
        }
      ]
    }
  ]
};

const mockStoryData = {
  companyName: 'Orbit Academy',
  companyAddress: 'Suite 900, Component Blvd, Orbit City',
  companyEmail: 'support@orbit-ui.org',
  customerName: 'Alice Smith',
  invoiceNumber: 'STORY-001',
  taxRate: 10,
  items: [
    { description: 'Premium React Layouts Pack Bundle', quantity: 2, unitPrice: 299 },
    { description: 'Storybook Extended Integration Workshop', quantity: 1, unitPrice: 500 }
  ]
};

const compiledDoc = generateDocument({
  template: mockStoryTemplate,
  data: mockStoryData
});

// Meta for stories
const meta: Meta = {
  title: 'Components/DocumentManagement',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Viewer: StoryObj<typeof DocumentViewer> = {
  render: () => (
    <div style={{ height: '700px', width: '100%' }}>
      <DocumentViewer documentData={compiledDoc} />
    </div>
  ),
};

export const Preview: StoryObj<typeof TemplatePreview> = {
  render: () => (
    <TemplatePreview template={mockStoryTemplate} sampleData={mockStoryData} />
  ),
};

export const DashboardShowcase: StoryObj<typeof DocumentManagementShowcase> = {
  render: () => (
    <div style={{ minHeight: '800px', width: '100%' }}>
      <DocumentManagementShowcase />
    </div>
  ),
};
