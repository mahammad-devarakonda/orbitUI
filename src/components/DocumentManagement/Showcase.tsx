import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  FileSpreadsheet, 
  Award,
  Edit3, 
  Code, 
  Eye, 
  Plus, 
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import type { DocumentTemplate } from './types';
import { generateDocument } from './generateDocument';
import { TemplatePreview } from './TemplatePreview';
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

const CONTRACT_TEMPLATE: DocumentTemplate = {
  id: 'contract',
  name: 'Standard Employment Agreement',
  pageSize: 'A4',
  orientation: 'portrait',
  themeColor: '#18181b', // Zinc 900
  pages: [
    {
      sections: [
        {
          type: 'content',
          content: `
            <div class="text-center space-y-3 mb-10">
              <h1 class="text-2xl font-black uppercase tracking-widest text-zinc-900">EMPLOYMENT AGREEMENT</h1>
              <p class="text-xs text-zinc-500 font-medium">DATED AS OF {{startDate}}</p>
            </div>
            
            <div class="space-y-4 text-xs text-zinc-700 leading-relaxed font-medium">
              <p>
                This Employment Agreement (the "Agreement") is entered into and made effective as of <span class="font-bold text-zinc-900">{{startDate}}</span>, by and between:
              </p>
              
              <div class="pl-6 border-l-2 border-zinc-200 space-y-1 my-3 bg-zinc-50/50 p-2.5 rounded-r-lg">
                <div><span class="font-bold text-zinc-900">Employer:</span> {{companyName}}, located at {{companyAddress}} (the "Company")</div>
                <div><span class="font-bold text-zinc-900">Employee:</span> {{employeeName}}, residing at {{employeeAddress}} (the "Employee")</div>
              </div>

              <p class="my-4">
                WHEREAS, the Company desires to employ the Employee, and the Employee desires to accept employment with the Company, under the terms and conditions outlined below.
              </p>

              <h3 class="text-sm font-bold text-zinc-900 uppercase tracking-wide mt-6 border-b border-zinc-100 pb-1.5">1. Position & Duties</h3>
              <p>
                The Employee shall serve in the role of <span class="font-bold text-zinc-900">{{jobTitle}}</span>. The Employee will report directly to <span class="font-bold text-zinc-900">{{managerName}}</span> and perform duties consistent with this position, alongside other responsibilities assigned by management.
              </p>

              <h3 class="text-sm font-bold text-zinc-900 uppercase tracking-wide mt-6 border-b border-zinc-100 pb-1.5">2. Compensation & Benefits</h3>
              <p>
                For all services rendered under this Agreement, the Company shall pay the Employee a starting base salary of <span class="font-bold text-zinc-900">{{salary}}</span> per annum, paid in regular installments in compliance with standard company payroll routines.
              </p>
            </div>
          `
        }
      ]
    },
    {
      sections: [
        {
          type: 'content',
          content: `
            <div class="space-y-4 text-xs text-zinc-700 leading-relaxed font-medium">
              <h3 class="text-sm font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-1.5">3. Term & Termination</h3>
              <p>
                Employment under this Agreement is "at-will," meaning that either the Company or the Employee may terminate the employment relationship at any time, for any reason, with or without cause, subject to a notification period of <span class="font-bold text-zinc-900">{{noticePeriod}}</span> days.
              </p>

              <h3 class="text-sm font-bold text-zinc-900 uppercase tracking-wide mt-6 border-b border-zinc-100 pb-1.5">4. Governing Law</h3>
              <p>
                This agreement shall be governed by, construed, and enforced in accordance with the laws of the State of <span class="font-bold text-zinc-900">{{governingLaw}}</span>.
              </p>

              <h3 class="text-sm font-bold text-zinc-900 uppercase tracking-wide mt-10 border-b border-zinc-100 pb-1.5">5. Execution & Signatures</h3>
              <p class="mb-8">
                IN WITNESS WHEREOF, the parties hereto have executed this Employment Agreement as of the date first written above.
              </p>
            </div>
          `
        },
        {
          type: 'columns',
          className: 'mt-12',
          columns: [
            {
              width: '50%',
              content: `
                <div class="space-y-4">
                  <p class="text-xs font-bold text-zinc-800">For the Company:</p>
                  <div class="h-10 border-b border-zinc-300 w-3/4"></div>
                  <div class="text-[10px] text-zinc-500 font-medium">
                    <span class="font-bold text-zinc-700">{{managerName}}</span><br/>
                    Title: Authorized Representative<br/>
                    Date: __________________
                  </div>
                </div>
              `
            },
            {
              width: '50%',
              content: `
                <div class="space-y-4">
                  <p class="text-xs font-bold text-zinc-800">By the Employee:</p>
                  <div class="h-10 border-b border-zinc-300 w-3/4"></div>
                  <div class="text-[10px] text-zinc-500 font-medium">
                    <span class="font-bold text-zinc-700">{{employeeName}}</span><br/>
                    Title: {{jobTitle}}<br/>
                    Date: __________________
                  </div>
                </div>
              `
            }
          ]
        },
        {
          type: 'footer',
          content: `
            <div class="text-center text-[9px] text-zinc-400 border-t border-zinc-100 pt-4 mt-20 font-medium">
              Employment Agreement &bull; Confidential &bull; Page 2 of 2
            </div>
          `
        }
      ]
    }
  ]
};

const CERTIFICATE_TEMPLATE: DocumentTemplate = {
  id: 'certificate',
  name: 'Certificate of Achievement',
  pageSize: 'A4',
  orientation: 'landscape',
  themeColor: '#b45309', // Amber 700 (Golden theme)
  pages: [
    {
      sections: [
        {
          type: 'content',
          content: `
            <div class="border-[12px] border-double p-12 text-center flex flex-col justify-between items-center h-full rounded-2xl" style="border-color: {{themeColor}}">
              
              <div class="space-y-2 max-w-2xl mx-auto">
                <span class="text-[10px] font-black uppercase tracking-[0.3em]" style="color: {{themeColor}}">ORBIT UI TOOLKIT ACADEMY</span>
                <h1 class="text-4xl font-extrabold tracking-wide text-zinc-900 mt-2 font-serif uppercase">CERTIFICATE OF ACHIEVEMENT</h1>
                <p class="text-xs text-zinc-450 italic">This accolade is proudly presented to</p>
              </div>

              <div class="my-6 max-w-md mx-auto">
                <h2 class="text-3xl font-black tracking-tight border-b-2 border-zinc-200 pb-2 font-serif text-zinc-800" style="color: {{themeColor}}">
                  {{recipientName}}
                </h2>
                <p class="text-xs text-zinc-500 font-medium mt-3 leading-relaxed">
                  for successfully demonstrating professional skills in the category of <br/>
                  <span class="font-extrabold text-zinc-800">{{courseName}}</span>.<br/>
                  Awarded on this day, <span class="font-bold text-zinc-800">{{awardDate}}</span>.
                </p>
              </div>

              <div class="flex justify-between items-end w-full max-w-lg mt-8 text-center text-xs font-semibold">
                <div class="w-1/3 flex flex-col items-center">
                  <div class="w-3/4 border-b border-zinc-300 pb-1 italic font-serif text-zinc-650">{{instructorName}}</div>
                  <span class="text-[9px] text-zinc-450 font-medium mt-1">Lead Program Instructor</span>
                </div>
                
                <div class="w-1/3 flex justify-center pb-2">
                  <div class="h-14 w-14 rounded-full border-4 border-amber-500/30 flex items-center justify-center bg-amber-50 font-black text-amber-600 text-[10px] tracking-wider shadow-inner select-none rotate-12">
                    SEAL
                  </div>
                </div>

                <div class="w-1/3 flex flex-col items-center">
                  <div class="w-3/4 border-b border-zinc-300 pb-1 italic font-serif text-zinc-650">{{directorName}}</div>
                  <span class="text-[9px] text-zinc-450 font-medium mt-1">Academy Director</span>
                </div>
              </div>

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
  const [activeTemplateId, setActiveTemplateId] = useState<string>('invoice');
  const [templateSchema, setTemplateSchema] = useState<DocumentTemplate>(INVOICE_TEMPLATE);
  const [sampleData, setSampleData] = useState<Record<string, any>>(INITIAL_DATA_MAP.invoice);
  
  const [previewMode, setPreviewMode] = useState<'preview' | 'viewer'>('viewer');
  const [editorTab, setEditorTab] = useState<'fields' | 'schema'>('fields');
  const [rawSchemaText, setRawSchemaText] = useState<string>('');
  const [schemaError, setSchemaError] = useState<string>('');

  // Synchronize template schema and sample data on template switch
  useEffect(() => {
    let t: DocumentTemplate;
    if (activeTemplateId === 'invoice') t = INVOICE_TEMPLATE;
    else if (activeTemplateId === 'contract') t = CONTRACT_TEMPLATE;
    else t = CERTIFICATE_TEMPLATE;

    setTemplateSchema(t);
    setSampleData(INITIAL_DATA_MAP[activeTemplateId]);
    setRawSchemaText(JSON.stringify(t, null, 2));
    setSchemaError('');
  }, [activeTemplateId]);

  // Handle manual field updates
  const handleFieldChange = (key: string, val: any) => {
    setSampleData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Handle nested items table editing
  const handleItemChange = (idx: number, field: string, value: any) => {
    if (!Array.isArray(sampleData.items)) return;
    const items = [...sampleData.items];
    
    // Ensure numerical types for computation fields
    const parsedVal = (field === 'quantity' || field === 'unitPrice') ? Number(value) : value;
    items[idx] = { ...items[idx], [field]: parsedVal };

    setSampleData(prev => ({ ...prev, items }));
  };

  const handleAddItem = () => {
    if (!Array.isArray(sampleData.items)) return;
    const items = [...sampleData.items, { description: 'New custom service item', quantity: 1, unitPrice: 0 }];
    setSampleData(prev => ({ ...prev, items }));
  };

  const handleRemoveItem = (idx: number) => {
    if (!Array.isArray(sampleData.items)) return;
    const items = sampleData.items.filter((_, i) => i !== idx);
    setSampleData(prev => ({ ...prev, items }));
  };

  // Compile schema updates
  const handleSchemaUpdate = (text: string) => {
    setRawSchemaText(text);
    try {
      const parsed = JSON.parse(text);
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.pages)) {
        throw new Error('Template must include id, name, and pages array.');
      }
      setTemplateSchema(parsed);
      setSchemaError('');
    } catch (err: any) {
      setSchemaError(err.message || 'Invalid JSON syntax.');
    }
  };

  // Compile active data payload
  const compiledDocument = generateDocument({
    template: templateSchema,
    data: sampleData
  });

  return (
    <div className="h-full w-full flex flex-col lg:flex-row gap-6 pr-2 bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-800 dark:text-zinc-100">
      
      {/* LEFT COMPONENT: CONTROL PANEL */}
      <div className="w-full lg:w-[420px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col min-h-0 overflow-hidden">
        
        {/* Templates Selector */}
        <div className="p-5 border-b border-zinc-150 dark:border-zinc-850 shrink-0">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">Document Templates</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'invoice', label: 'Invoice', icon: FileSpreadsheet, activeColor: '#4f46e5' },
              { id: 'contract', label: 'Agreement', icon: FileCheck, activeColor: '#18181b' },
              { id: 'certificate', label: 'Award', icon: Award, activeColor: '#b45309' }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = activeTemplateId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTemplateId(item.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border font-semibold text-xs tracking-wide transition duration-150 cursor-pointer ${
                    isSelected 
                      ? 'text-white shadow-md border-transparent' 
                      : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-850'
                  }`}
                  style={isSelected ? { backgroundColor: item.activeColor } : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-150 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/20 shrink-0">
          <button
            onClick={() => setEditorTab('fields')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 tracking-wide transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
              editorTab === 'fields'
                ? 'border-zinc-950 dark:border-zinc-50 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Variable Inputs
          </button>
          
          <button
            onClick={() => setEditorTab('schema')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 tracking-wide transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
              editorTab === 'schema'
                ? 'border-zinc-950 dark:border-zinc-50 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-white'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            Template JSON
          </button>
        </div>

        {/* Dynamic Editor Panel Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: VARIABLE INPUTS FORM */}
          {editorTab === 'fields' && (
            <div className="space-y-5">
              
              {/* Context variables info */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-850 rounded-xl p-3 flex gap-2.5 items-start">
                <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 dark:text-zinc-450 leading-relaxed font-medium">
                  Update these fields to watch the placeholders populate in real-time. Text values render instantly.
                </p>
              </div>

              {/* Form inputs rendered dynamically based on selected template fields */}
              {Object.keys(sampleData)
                .filter(key => key !== 'items' && !key.startsWith('_'))
                .map(key => {
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                  
                  const value = sampleData[key];
                  const isNumber = typeof value === 'number';

                  return (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wide text-zinc-450 dark:text-zinc-500 block">
                        {label}
                      </label>
                      
                      <input
                        type={isNumber ? 'number' : 'text'}
                        value={value}
                        onChange={(e) => handleFieldChange(key, isNumber ? Number(e.target.value) : e.target.value)}
                        className="w-full text-xs font-medium bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:border-zinc-500 dark:focus:border-zinc-400 focus:outline-none text-zinc-800 dark:text-zinc-100 transition duration-150"
                        placeholder={`Enter ${label.toLowerCase()}...`}
                      />
                    </div>
                  );
                })}

              {/* Special Line Items Grid for Invoice template */}
              {activeTemplateId === 'invoice' && Array.isArray(sampleData.items) && (
                <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-850">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
                      Line Items list
                    </span>
                    <button
                      onClick={handleAddItem}
                      className="px-2.5 py-1 text-[10px] font-extrabold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-750 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {sampleData.items.map((item, index) => (
                      <div 
                        key={index}
                        className="bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-2 relative"
                      >
                        {/* Remove item button */}
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-red-500 transition rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>

                        <div className="space-y-1 pr-6">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg px-2 py-1 text-zinc-850 dark:text-zinc-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg px-2 py-1 text-zinc-850 dark:text-zinc-100"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase">Unit Price ($)</label>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              className="w-full text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg px-2 py-1 text-zinc-850 dark:text-zinc-100"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: RAW SCHEMA JSON EDITOR */}
          {editorTab === 'schema' && (
            <div className="h-full flex flex-col space-y-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                <span>Advanced JSON Layout Editor. Updates render instantly on typing.</span>
              </div>

              <textarea
                value={rawSchemaText}
                onChange={(e) => handleSchemaUpdate(e.target.value)}
                className="w-full flex-grow h-[350px] font-mono text-[10px] leading-relaxed bg-zinc-950 border border-zinc-850 rounded-xl p-3.5 text-zinc-350 focus:outline-none focus:ring-1 focus:ring-zinc-800 overflow-auto whitespace-pre resize-none"
              />

              {schemaError ? (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-xl text-[10px] leading-relaxed font-bold">
                  Error: {schemaError}
                </div>
              ) : (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-[10px] leading-relaxed font-bold">
                  ✓ JSON structure compiled successfully.
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* RIGHT COMPONENT: MAIN RENDER CANVAS */}
      <div className="flex-grow flex flex-col min-h-0 bg-zinc-100/50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/40 rounded-2xl p-5 shadow-inner">
        
        {/* Toggle between preview maps (TemplatePreview) and compiled output reader (DocumentViewer) */}
        <div className="flex items-center justify-between shrink-0 mb-4 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-1">
            <button
              onClick={() => setPreviewMode('viewer')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-150 flex items-center gap-1.5 cursor-pointer ${
                previewMode === 'viewer'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Document Viewer
            </button>
            
            <button
              onClick={() => setPreviewMode('preview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition duration-150 flex items-center gap-1.5 cursor-pointer ${
                previewMode === 'preview'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Template Preview
            </button>
          </div>

          <div className="px-3 py-1 bg-white/70 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-lg hidden sm:block">
            <span className="text-[10px] font-bold text-zinc-500">
              Template: <span className="font-extrabold" style={{ color: templateSchema.themeColor }}>{templateSchema.name}</span>
            </span>
          </div>
        </div>

        {/* View container area */}
        <div className="flex-1 min-h-0 relative flex items-center justify-center">
          {previewMode === 'preview' ? (
            <div className="h-full w-full overflow-y-auto pr-1">
              <TemplatePreview
                template={templateSchema}
                sampleData={sampleData}
              />
            </div>
          ) : (
            <DocumentViewer
              documentData={compiledDocument}
            />
          )}
        </div>

      </div>

    </div>
  );
};
