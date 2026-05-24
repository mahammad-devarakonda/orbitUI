import type { Meta, StoryObj } from '@storybook/react';
import { GeneratedDocument } from './GeneratedDocument';
import type { Template } from './types';

const meta: Meta<typeof GeneratedDocument> = {
  title: 'Components/DocumentManagement/GeneratedDocument',
  component: GeneratedDocument,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GeneratedDocument>;

// Helper to construct a template from the demo options
const mockOfferTemplate: Template = {
  id: 'tpl_offer_demo',
  name: 'Standard Offer Letter',
  category: 'HR Operations',
  headerOptions: {
    companyName: 'Orbit Technologies Pvt. Ltd.',
    subheading: 'Official Offer of Employment',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    address: 'Plot 42, Silicon Valley Phase II, Madhapur, Hyderabad, Telangana, 500081',
    phone: '+91 40 4488 9900',
    website: 'www.orbit.tech',
    includeSeal: true,
    includeContactInfo: true,
    includeDate: true,
  },
  footerOptions: {
    includeFooter: true,
    includeDocumentName: true,
    includeVersionNumber: true,
    includePageNumber: true,
    documentName: 'Offer Letter - Orbit Technologies',
    version: '1.0.2',
  },
  signatureOptions: {
    includeSignature: true,
    signerName: 'Jane Smith',
    title: 'Head of People Operations',
    signatureStyle: 'handwritten',
  },
  letterTitle: 'Offer Letter',
  toAddress: 'To,\n{{employeeName}},\n{{address}}',
  reLine: 'Re: Offer of Employment',
  subjectLine: 'Sub: Appointment for the position of {{designation}}',
  contentHtml: `<div>Dear <strong>{{employeeName}}</strong>,</div><div><br></div><div>We are pleased to offer you the position of <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department at <strong>Orbit Technologies Pvt. Ltd.</strong> based on your qualifications and professional experience.</div><div><br></div><div>Your annual gross salary (CTC) will be <strong>{{salary}}</strong>. Your scheduled joining date is <strong>{{joiningDate}}</strong> and your primary work location will be <strong>{{workLocation}}</strong> under a <strong>{{employmentType}}</strong> engagement.</div><div><br></div><div><strong>Terms & Conditions:</strong></div><ul><li>You will initially be on a probation period of 6 months from your date of joining.</li><li>You are expected to comply with all company policies, rules, and regulations.</li><li>Any confidential information obtained during employment must not be disclosed to external parties.</li><li>Either party may terminate employment by providing 30 days written notice.</li></ul><div><br></div><div>Please confirm your acceptance of this offer by signing and returning a copy of this letter.</div><div><br></div><div>We are excited to welcome you to our growing engineering team and look forward to scaling new heights together!</div>`,
  contentDelta: '',
  placeholders: ['employeeName', 'designation', 'salary', 'joiningDate', 'department', 'workLocation', 'employmentType', 'address'],
  createdAt: new Date().toISOString(),
};

const mockHikeTemplate: Template = {
  id: 'tpl_hike_demo',
  name: 'Annual Compensation Increment',
  category: 'Comp & Benefits',
  headerOptions: {
    companyName: 'Orbit Technologies Pvt. Ltd.',
    subheading: 'Annual Performance Appraisal',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    address: 'Plot 42, Silicon Valley Phase II, Madhapur, Hyderabad, Telangana, 500081',
    phone: '+91 40 4488 9900',
    website: 'www.orbit.tech',
    includeSeal: true,
    includeContactInfo: true,
    includeDate: true,
  },
  footerOptions: {
    includeFooter: true,
    includeDocumentName: true,
    includeVersionNumber: true,
    includePageNumber: true,
    documentName: 'Compensation Review Statement',
    version: '1.1.0',
  },
  signatureOptions: {
    includeSignature: true,
    signerName: 'Alexander Cross',
    title: 'VP of Engineering & HR',
    signatureStyle: 'classic',
  },
  letterTitle: 'COMPENSATION ADJUSTMENT LETTER',
  toAddress: 'To,\n{{employeeName}},\n{{address}}',
  reLine: 'Re: Compensation Increment & Performance Review',
  subjectLine: 'Sub: Revision of Annual Cost to Company (CTC)',
  contentHtml: `<div>Dear <strong>{{employeeName}}</strong>,</div><div><br></div><div>As part of our annual performance appraisal process, we review the contributions and milestones achieved by our team members. In recognition of your dedicated services, high quality of outputs, and performance as a <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department, we are extremely pleased to revise your compensation structure.</div><div><br></div><div>Effective from the next payroll cycle, your revised annual Gross Cost to Company (CTC) will be adjusted to <strong>{{salary}}</strong>.</div><div><br></div><hr style="border-top: 1px dashed #cbd5e1; margin: 1.5rem 0;" /><div>All other terms and conditions of your original employment contract remain unchanged. We appreciate your efforts, commitment, and alignment with our company values. We look forward to your continued contribution to the company's growth in the coming years.</div><div><br></div><div>Congratulations on your well-deserved reward!</div>`,
  contentDelta: '',
  placeholders: ['employeeName', 'designation', 'salary', 'department', 'address'],
  createdAt: new Date().toISOString(),
};

// 1. Offer Letter Story with standard mock data
export const EmployeeOfferLetter: Story = {
  args: {
    template: mockOfferTemplate,
    data: {
      employeeName: 'Rahul Sharma',
      designation: 'Senior Frontend Architect',
      salary: '₹18,50,000 per annum',
      joiningDate: '15 June 2026',
      department: 'Product & Design',
      workLocation: 'Hyderabad Hub',
      employmentType: 'Full-Time Permanent',
      address: 'Flat No. 302, Green Residency\nMadhapur, Hyderabad – 500081',
    },
  },
  render: (args) => {
    return (
      <div className="w-full max-w-[900px] p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl">
        <GeneratedDocument {...args} />
      </div>
    );
  },
};

// 2. Hike Letter Story with high-fidelity inputs
export const CompensationAppraisal: Story = {
  args: {
    template: mockHikeTemplate,
    data: {
      employeeName: 'Sneha Reddy',
      designation: 'Staff Software Engineer',
      salary: '₹24,00,000 per annum',
      department: 'Cloud Platform Engineering',
      address: 'Plot 104, Cyber Towers Lane\nKondapur, Hyderabad – 500084',
    },
  },
  render: (args) => {
    return (
      <div className="w-full max-w-[900px] p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl">
        <GeneratedDocument {...args} />
      </div>
    );
  },
};

// 3. Compact Minimal Render without top Action Bar
export const MinimalWithoutActions: Story = {
  args: {
    template: mockOfferTemplate,
    data: {
      employeeName: 'Ananya Sen',
      designation: 'UX Design Intern',
      salary: '₹45,000 per month',
      joiningDate: '01 July 2026',
      department: 'User Experience Research',
      workLocation: 'Remote (India)',
      employmentType: 'Internship (6 Months)',
      address: 'Sector 5, Salt Lake City\nKolkata, West Bengal – 700091',
    },
  },
  render: (args) => {
    return (
      <div className="w-full max-w-[900px] p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl">
        <GeneratedDocument {...args} />
      </div>
    );
  },
};
