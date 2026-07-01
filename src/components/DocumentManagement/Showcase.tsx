import React from 'react';
import type { DocumentTemplate } from './types';
import { generateDocument } from './generateDocument';
import { DocumentViewer } from './DocumentViewer';


// MOCK TEMPLATES DATA DEFINITIONS
const INVOICE_TEMPLATE: DocumentTemplate = {
  id: 'invoice',
  name: 'Corporate Service Invoice',
  pageSize: 'A4',
  orientation: 'portrait',
  themeColor: '#4f46e5', // Indigo
  pages: [
    {
      sections: [
        {
          type: 'columns',
          columns: [
            {
              width: '60%',
              content: `
                <div class="space-y-1">
                  <h1 class="text-3xl font-black tracking-tight" style="color: {{themeColor}}">{{companyName}}</h1>
                  <p class="text-xs text-zinc-500 font-medium leading-relaxed">
                    {{companyAddress}}<br/>
                    Phone: {{companyPhone}} | Email: {{companyEmail}}
                  </p>
                </div>
              `
            },
            {
              width: '40%',
              content: `
                <div class="text-right space-y-1.5">
                  <h2 class="text-xl font-black text-zinc-800 uppercase tracking-widest">INVOICE</h2>
                  <div class="text-xs text-zinc-500 font-medium inline-block text-left border border-zinc-150 bg-zinc-50/50 p-2 rounded-xl">
                    <div><span class="font-bold text-zinc-700">Invoice #:</span> {{invoiceNumber}}</div>
                    <div><span class="font-bold text-zinc-700">Date:</span> {{invoiceDate}}</div>
                    <div><span class="font-bold text-zinc-700">Due Date:</span> {{dueDate}}</div>
                  </div>
                </div>
              `
            }
          ]
        },
        { type: 'divider', className: 'my-6 border-zinc-200' },
        {
          type: 'columns',
          columns: [
            {
              width: '50%',
              content: `
                <div class="space-y-1">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Bill To:</span>
                  <h3 class="text-xs font-extrabold text-zinc-900">{{customerName}}</h3>
                  <p class="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    {{customerAddress}}<br/>
                    Email: {{customerEmail}}
                  </p>
                </div>
              `
            },
            {
              width: '50%',
              content: `
                <div class="space-y-1 text-right">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Payment Routing:</span>
                  <p class="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    Bank: {{bankName}}<br/>
                    Account #: {{accountNumber}}<br/>
                    SWIFT: {{swiftCode}}
                  </p>
                </div>
              `
            }
          ]
        },
        {
          type: 'table',
          tableConfig: {
            dataKey: 'items',
            columns: [
              { label: 'Item / Service details', key: 'description', align: 'left' },
              { label: 'Quantity', key: 'quantity', align: 'center', format: 'number' },
              { label: 'Unit Price', key: 'unitPrice', align: 'right', format: 'currency' },
              { label: 'Total Amount', key: 'total', align: 'right', format: 'currency' }
            ]
          },
          className: 'mt-6'
        },
        {
          type: 'columns',
          className: 'mt-8',
          columns: [
            {
              width: '55%',
              content: `
                <div class="space-y-1.5">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Terms & Conditions</span>
                  <p class="text-[9px] text-zinc-500 leading-relaxed font-medium">{{termsAndConditions}}</p>
                </div>
              `
            },
            {
              width: '45%',
              content: `
                <div class="bg-zinc-50/50 border border-zinc-150 rounded-2xl p-4 ml-auto max-w-[280px]">
                  <div class="grid grid-cols-2 text-xs gap-y-2 font-medium">
                    <span class="text-zinc-500">Subtotal:</span>
                    <span class="text-right text-zinc-800 font-bold">{{subtotal}}</span>
                    
                    <span class="text-zinc-500">Tax ({{taxRate}}%):</span>
                    <span class="text-right text-zinc-800 font-bold">{{taxAmount}}</span>
                    
                    <div class="col-span-2 border-t border-zinc-200 my-1"></div>
                    
                    <span class="text-xs font-extrabold text-zinc-900">Total Due:</span>
                    <span class="text-right text-sm font-black" style="color: {{themeColor}}">{{totalDue}}</span>
                  </div>
                </div>
              `
            }
          ]
        },
        {
          type: 'footer',
          content: `
            <div class="text-center text-[9px] text-zinc-400 border-t border-zinc-150 pt-4 mt-20 font-medium">
              Thank you for choosing {{companyName}} for your services. If you have any inquiries regarding this statement, please contact us at {{companyEmail}}.
            </div>
          `
        }
      ]
    }
  ]
};


// INITIAL SAMPLE DATA MAPS
const INITIAL_DATA_MAP: Record<string, any> = {
  invoice: {
    companyName: 'Orbit Engineering Inc.',
    companyAddress: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
    companyPhone: '+1 (415) 555-0199',
    companyEmail: 'billing@orbit-design.io',
    invoiceNumber: 'INV-2026-0042',
    invoiceDate: '2026-06-01',
    dueDate: '2026-06-30',
    customerName: 'Acme Laboratories LLC',
    customerAddress: '450 Science Parkway, Building B, Boston, MA 02108',
    customerEmail: 'ap@acmelabs.com',
    bankName: 'Silicon Valley Founders Bank',
    accountNumber: 'SVB-9080-1123-445',
    swiftCode: 'SVBUSS33XXX',
    taxRate: 8.5,
    termsAndConditions: 'Payment is due within 30 days of receipt. Overdue balances are subject to a 1.5% compounding fee per month. Standard service level agreements apply.',
    items: [
      { description: 'Orbit UI Design System Library (Enterprise License)', quantity: 1, unitPrice: 2499.00 },
      { description: 'Custom Component Seating Designer Module Integration', quantity: 24, unitPrice: 150.00 },
      { description: 'High-Fidelity PDF & Document Management Hook setup', quantity: 12, unitPrice: 125.00 },
      { description: 'Extended Premium Support & Cloud Deployment Sync (1 Year)', quantity: 1, unitPrice: 999.00 }
    ]
  },
  contract: {
    startDate: '2026-07-01',
    companyName: 'Orbit Design Systems Inc.',
    companyAddress: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
    employeeName: 'Sarah Jenkins',
    employeeAddress: '782 Pine Street, Apt 3C, San Francisco, CA 94109',
    jobTitle: 'Senior Frontend Architect',
    managerName: 'Devon Carter',
    salary: 145000,
    noticePeriod: 30,
    governingLaw: 'California'
  },
  certificate: {
    recipientName: 'Jonathan Davis',
    courseName: 'Advanced Component Design & Micro-Animations',
    awardDate: '2026-06-09',
    instructorName: 'Sarah Jenkins',
    directorName: 'Marcus Aurelius'
  }
};

export const DocumentManagementShowcase: React.FC = () => {
  const compiledDocument = generateDocument({
    template: INVOICE_TEMPLATE,
    data: INITIAL_DATA_MAP.invoice
  });

  return (
    <div className="h-full w-full bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-800 dark:text-zinc-100">
      <DocumentViewer documentData={compiledDocument} />
    </div>
  );
};

