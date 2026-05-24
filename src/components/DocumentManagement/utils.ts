import type { Block, BlockType } from './types';

// Helper to generate unique IDs
export const generateId = (): string => {
  return 'block_' + Math.random().toString(36).substr(2, 9);
};

// Extracts unique placeholder names from a template's blocks (e.g. {{employeeName}} -> employeeName)
export const extractPlaceholders = (blocks: Block[]): string[] => {
  const placeholdersSet = new Set<string>();
  const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;

  blocks.forEach((block) => {
    let match;
    let titleMatch;
    let pMatch;
    let sigMatch;
    let tableMatch;

    switch (block.type) {
      case 'header':
        [block.companyName, block.address, block.title, block.dateField].forEach((text) => {
          while ((match = regex.exec(text)) !== null) {
            placeholdersSet.add(match[1]);
          }
        });
        break;
      case 'body':
        while ((match = regex.exec(block.content)) !== null) {
          placeholdersSet.add(match[1]);
        }
        break;
      case 'footer':
        [block.signatureText || '', block.hrName, block.footerNotes || '', block.contactInfo || ''].forEach((text) => {
          while ((match = regex.exec(text)) !== null) {
            placeholdersSet.add(match[1]);
          }
        });
        break;
      case 'title':
        while ((titleMatch = regex.exec(block.text)) !== null) {
          placeholdersSet.add(titleMatch[1]);
        }
        break;
      case 'paragraph':
        while ((pMatch = regex.exec(block.text)) !== null) {
          placeholdersSet.add(pMatch[1]);
        }
        break;
      case 'signature':
        [block.title, block.signerName].forEach((text) => {
          while ((sigMatch = regex.exec(text)) !== null) {
            placeholdersSet.add(sigMatch[1]);
          }
        });
        break;
      case 'table':
        block.headers.forEach((h) => {
          while ((tableMatch = regex.exec(h)) !== null) {
            placeholdersSet.add(tableMatch[1]);
          }
        });
        block.rows.forEach((row) => {
          row.forEach((cell) => {
            while ((tableMatch = regex.exec(cell)) !== null) {
              placeholdersSet.add(tableMatch[1]);
            }
          });
        });
        break;
      default:
        break;
    }
  });

  return Array.from(placeholdersSet);
};


// Return standard placeholder details for helper chips
export const getPlaceholderLabel = (placeholder: string): string => {
  const map: Record<string, string> = {
    employeeName: 'Employee Name 👤',
    date: 'Current Date 📅',
    salary: 'Salary / CTC 💰',
    designation: 'Designation / Role 💼',
    signature: 'HR Signature ✍️',
    joiningDate: 'Joining Date 📅',
    department: 'Department 🏢',
    companyName: 'Company Name 🏢',
  };
  return map[placeholder] || `${placeholder}`;
};

// Generates default structure and attributes for any block type
export const getDefaultBlockData = (type: BlockType): Block => {
  const id = generateId();
  switch (type) {
    case 'header':
      return {
        id,
        type: 'header',
        companyName: 'Orbit Technologies Pvt Ltd',
        address: '123 Tech Corridor, HITEC City, Hyderabad, India',
        title: 'LETTER OF APPOINTMENT',
        dateField: 'Date: {{date}}',
        logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&q=80',
      };
    case 'body':
      return {
        id,
        type: 'body',
        content: `<div>Dear <strong>{{employeeName}}</strong>,</div><div><br></div><div>We are pleased to offer you the role of <strong>{{designation}}</strong> in our <strong>{{department}}</strong> department at Orbit Technologies Pvt Ltd.</div><div><br></div><div>Your annual gross salary (CTC) will be <strong>{{salary}}</strong>. Your schedule joining date is <strong>{{joiningDate}}</strong>.</div><div><br></div><div>Please review the terms and conditions outlined in the properties panel to finalize your acceptance of this document.</div>`,
      };
    case 'footer':
      return {
        id,
        type: 'footer',
        hrName: 'Jane Smith',
        signatureText: 'Authorized HR Signatory',
        footerNotes: 'This document is electronically generated and requires no physical signature under normal circumstances.',
        contactInfo: 'Email: hr@orbit.tech | Web: www.orbit.tech | Phone: +91 40 1234 5678',
      };
    case 'title':
      return {
        id,
        type: 'title',
        text: 'Document Subheading',
        align: 'left',
        level: 2,
      };
    case 'paragraph':
      return {
        id,
        type: 'paragraph',
        text: 'Enter a custom paragraph text here. You can click on this block and configure its details in the properties panel on the right.',
      };
    case 'divider':
      return {
        id,
        type: 'divider',
        style: 'solid',
        color: '#cbd5e1', // slate-300
        thickness: 1,
      };
    case 'signature':
      return {
        id,
        type: 'signature',
        title: 'Authorized Signature',
        signerName: 'Jane Smith',
        signatureStyle: 'handwritten',
      };
    case 'table':
      return {
        id,
        type: 'table',
        headers: ['Component', 'Monthly (INR)', 'Annually (INR)'],
        rows: [
          ['Basic Salary', '₹35,000', '₹4,20,000'],
          ['House Rent Allowance (HRA)', '₹14,000', '₹1,68,000'],
          ['Special Allowance', '₹21,000', '₹2,52,000'],
          ['Total CTC', '₹70,000', '₹8,40,000'],
        ],
      };
  }
};

// Replaces double bracket placeholders with custom values, highlighting them with stylish badges if requested
export const replacePlaceholders = (
  text: string,
  values: Record<string, string>,
  highlight: boolean = false
): string => {
  return text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_match, key) => {
    const val = values[key] !== undefined && values[key] !== '' ? values[key] : `{{${key}}}`;
    if (highlight && values[key] !== undefined && values[key] !== '') {
      return `<span class="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-semibold border border-indigo-100 dark:border-indigo-900 transition-colors">${val}</span>`;
    }
    return val;
  });
};

// Compiles a block into visual standard HTML (for rendering in preview / exports)
export const compileBlockHTML = (block: Block, placeholderValues: Record<string, string> = {}): string => {
  const replace = (t: string) => replacePlaceholders(t, placeholderValues, false);

  switch (block.type) {
    case 'header': {
      const company = replace(block.companyName);
      const address = replace(block.address);
      const title = replace(block.title);
      const date = replace(block.dateField);
      return `
        <div class="flex items-start justify-between border-b pb-6 mb-6" style="border-color: #e2e8f0;">
          <div class="space-y-1">
            <h1 class="text-xl font-bold tracking-tight text-slate-900" style="margin: 0; font-size: 1.5rem;">${company}</h1>
            <p class="text-sm text-slate-500" style="margin: 0; font-size: 0.875rem;">${address}</p>
            <div class="text-sm text-slate-500 mt-2" style="font-size: 0.875rem;">${date}</div>
          </div>
          ${
            block.logoUrl
              ? `<img src="${block.logoUrl}" alt="Logo" class="h-16 w-16 object-contain rounded" style="max-height: 4rem; max-width: 4rem;" />`
              : ''
          }
        </div>
        <div class="text-center my-6">
          <h2 class="text-lg font-bold tracking-wide uppercase text-slate-800" style="margin: 0; font-size: 1.125rem; border-bottom: 2px solid #64748b; display: inline-block; padding-bottom: 2px;">${title}</h2>
        </div>
      `;
    }

    case 'body': {
      return `<div class="prose max-w-none text-slate-700 leading-relaxed space-y-4" style="line-height: 1.625; color: #334155;">${replace(block.content)}</div>`;
    }

    case 'title': {
      const text = replace(block.text);
      const levelClass = block.level === 1 ? 'text-2xl font-bold' : block.level === 3 ? 'text-lg font-semibold' : 'text-xl font-bold';
      return `<div class="text-${block.align} my-4"><span class="${levelClass} text-slate-800">${text}</span></div>`;
    }

    case 'paragraph': {
      const text = replace(block.text);
      return `<p class="text-slate-600 leading-relaxed my-3" style="line-height: 1.625;">${text}</p>`;
    }

    case 'divider': {
      const styleType = block.style;
      const thickness = block.thickness || 1;
      const color = block.color || '#cbd5e1';
      return `<hr class="my-6" style="border-top: ${thickness}px ${styleType} ${color}; border-bottom: 0; margin-top: 1.5rem; margin-bottom: 1.5rem;" />`;
    }

    case 'table': {
      const headersHTML = block.headers
        .map((h) => `<th class="px-4 py-2 border-b bg-slate-50 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider" style="border-bottom: 2px solid #e2e8f0; background-color: #f8fafc; padding: 0.5rem 1rem;">${replace(h)}</th>`)
        .join('');

      const rowsHTML = block.rows
        .map(
          (row) =>
            `<tr class="hover:bg-slate-50/50" style="border-bottom: 1px solid #f1f5f9;">${row
              .map((cell) => `<td class="px-4 py-3 text-sm text-slate-600" style="padding: 0.75rem 1rem;">${replace(cell)}</td>`)
              .join('')}</tr>`
        )
        .join('');

      return `
        <div class="my-6 overflow-x-auto" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
          <table class="min-w-full table-auto border-collapse" style="width: 100%;">
            <thead>
              <tr>${headersHTML}</tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </div>
      `;
    }

    case 'signature': {
      const title = replace(block.title);
      const name = replace(block.signerName);
      let signMock = '';

      if (block.signatureStyle === 'handwritten') {
        signMock = `<span style="font-family: 'Reenie Beanie', 'Caveat', 'Great Vibes', cursive; font-size: 2.25rem; color: #1e3a8a; font-style: italic;">${name}</span>`;
      } else if (block.signatureStyle === 'classic') {
        signMock = `<span style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #0f172a; border-bottom: 1px double #94a3b8; font-style: italic; padding-bottom: 2px;">${name}</span>`;
      } else {
        signMock = `<span style="font-family: monospace; font-size: 1.25rem; color: #475569;">/s/ ${name}</span>`;
      }

      return `
        <div class="my-8 flex flex-col items-start space-y-1" style="margin-top: 2rem; margin-bottom: 2rem;">
          <div class="h-12 flex items-end mb-2">${signMock}</div>
          <div class="text-sm font-bold text-slate-700" style="font-size: 0.875rem;">${name}</div>
          <div class="text-xs text-slate-500" style="font-size: 0.75rem;">${title}</div>
        </div>
      `;
    }

    case 'footer': {
      const signText = replace(block.signatureText || '');
      const hr = replace(block.hrName);
      const notes = replace(block.footerNotes || '');
      const contact = replace(block.contactInfo || '');

      return `
        <div class="mt-12 pt-6 border-t" style="border-top: 1px solid #e2e8f0; margin-top: 3rem; padding-top: 1.5rem;">
          <div class="flex justify-between items-end mb-6">
            <div>
              <p class="text-sm text-slate-600 font-medium mb-1" style="margin: 0 0 0.25rem 0;">Regards,</p>
              <p class="text-sm font-bold text-slate-800" style="margin: 0;">${hr}</p>
              <p class="text-xs text-slate-500" style="margin: 0;">Human Resources Team</p>
            </div>
            <div class="text-right flex flex-col items-end">
              <div class="h-10 flex items-end justify-end mb-1">
                <span style="font-family: 'Caveat', cursive; font-size: 1.75rem; color: #2563eb; line-height: 1;">${hr}</span>
              </div>
              <p class="text-xs font-semibold text-slate-600 border-t pt-1 w-40 text-center" style="border-top: 1px solid #cbd5e1; margin: 0; font-size: 0.75rem;">${signText}</p>
            </div>
          </div>
          ${
            notes
              ? `<p class="text-xs text-slate-400 italic text-center mb-4 leading-normal" style="font-size: 0.75rem; color: #94a3b8; margin: 0 0 1rem 0;">${notes}</p>`
              : ''
          }
          ${
            contact
              ? `<p class="text-xs text-slate-400 text-center leading-normal" style="font-size: 0.75rem; color: #94a3b8; margin: 0;">${contact}</p>`
              : ''
          }
        </div>
      `;
    }

    default:
      return '';
  }
};

// Preset demo templates to make the template editor incredibly useful from day one
export const DEMO_TEMPLATES: Record<string, { name: string; category: string; version?: string; blocks: Block[] }> = {
  offer: {
    name: 'Standard Offer Letter',
    category: 'HR Operations',
    version: '1.0.2',
    blocks: [
      {
        id: 'b_header',
        type: 'header',
        companyName: 'ABC Technologies Pvt. Ltd.',
        address: '5th Floor, Tech Park, Hyderabad, Telangana – 500081',
        title: 'Offer Letter',
        dateField: 'Date: {{date}}',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
      },
      {
        id: 'b_salutation',
        type: 'body',
        content: `<div>Dear <strong>Rahul</strong>,</div><div><br></div><div>We are pleased to offer you the position of <strong>{{designation}}</strong> at <strong>{{companyName}}</strong>. Based on your skills and experience, we believe you will be a valuable addition to our organization.</div><div><br></div><div>Your employment details are as follows:</div>`,
      },
      {
        id: 'b_table',
        type: 'table',
        headers: ['Details', 'Information'],
        rows: [
          ['Designation', '{{designation}}'],
          ['Department', '{{department}}'],
          ['Joining Date', '{{joiningDate}}'],
          ['Work Location', '{{workLocation}}'],
          ['Employment Type', '{{employmentType}}'],
          ['Annual CTC', '{{salary}}'],
        ],
      },
      {
        id: 'b_terms',
        type: 'body',
        content: `<div><strong>Terms & Conditions:</strong></div><ul><li>You will initially be on a probation period of 6 months from your date of joining.</li><li>You are expected to comply with all company policies, rules, and regulations.</li><li>Any confidential information obtained during employment must not be disclosed to external parties.</li><li>Either party may terminate employment by providing 30 days written notice.</li></ul><div><br></div><div>Please confirm your acceptance of this offer by signing and returning a copy of this letter.</div><div><br></div><div>We are excited to welcome you to the team and look forward to working with you.</div>`,
      },
      {
        id: 'b_signature',
        type: 'signature',
        title: 'Human Resources Team',
        signerName: 'Jane Smith',
        signatureStyle: 'handwritten',
      },
      {
        id: 'b_footer',
        type: 'footer',
        hrName: 'Jane Smith',
        signatureText: 'Authorized Signature',
        footerNotes: 'This document contains confidential information intended solely for the recipient.',
        contactInfo: 'Email: hr@abctech.com | Phone: +91 98765 43210',
      },
    ],
  },
  hike: {
    name: 'Annual Compensation Increment',
    category: 'Comp & Benefits',
    version: '1.1.0',
    blocks: [
      {
        id: 'b_header_hike',
        type: 'header',
        companyName: 'Orbit Technologies Pvt Ltd',
        address: 'Plot 42, Silicon Valley Phase II, Madhapur, Hyderabad, Telangana, 500081',
        title: 'COMPENSATION ADJUSTMENT LETTER',
        dateField: 'Date: {{date}}',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
      },
      {
        id: 'b_body_hike',
        type: 'body',
        content: `<div>Dear <strong>{{employeeName}}</strong>,</div><div><br></div><div>As part of our annual performance appraisal process, we review the contributions and milestones achieved by our team members. In recognition of your dedicated services, high quality of outputs, and performance as a <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department, we are extremely pleased to revise your compensation structure.</div><div><br></div><div>Effective from the next payroll cycle, your revised annual Gross Cost to Company (CTC) will be adjusted to <strong>{{salary}}</strong>.</div>`,
      },
      {
        id: 'b_div_hike',
        type: 'divider',
        style: 'dashed',
        color: '#94a3b8',
        thickness: 1,
      },
      {
        id: 'b_concl_hike',
        type: 'body',
        content: `<div>All other terms and conditions of your original employment contract remain unchanged. We appreciate your efforts, commitment, and alignment with our company values. We look forward to your continued contribution to the company's growth in the coming years.</div><div><br></div><div>Congratulations on your well-deserved reward!</div>`,
      },
      {
        id: 'b_footer_hike',
        type: 'footer',
        hrName: 'Jane Smith',
        signatureText: 'Manager - Talent Operations',
        footerNotes: 'Salary revisions are strictly confidential between you and the management. Please ensure confidentiality protocols are maintained.',
        contactInfo: 'Email: connect@orbit.tech | Web: www.orbit.tech',
      },
    ],
  },
  promotion: {
    name: 'Promotion Letter',
    category: 'Career Growth',
    version: '2.0.1',
    blocks: [
      {
        id: 'b_header_prm',
        type: 'header',
        companyName: 'Orbit Technologies Pvt Ltd',
        address: 'Plot 42, Silicon Valley Phase II, Madhapur, Hyderabad, Telangana, 500081',
        title: 'LETTER OF PROMOTION',
        dateField: 'Date: {{date}}',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
      },
      {
        id: 'b_body_prm',
        type: 'body',
        content: `<div>Dear <strong>{{employeeName}}</strong>,</div><div><br></div><div>We are immensely pleased to congratulate you on your promotion to the position of <strong>{{designation}}</strong> within the <strong>{{department}}</strong> division, effective from <strong>{{joiningDate}}</strong>.</div><div><br></div><div>This promotion is in recognition of your superior dedication, technical leadership, and ownership demonstrated in driving key critical projects to completion. Your revised annual compensation (CTC) associated with this role will be updated to <strong>{{salary}}</strong>.</div><div><br></div><div>In this new capacity, you will be taking on expanded responsibilities, mentoring junior peers, and playing a larger role in shaping team roadmap execution. We are confident that you will excel in this leadership role and continue to scale new heights.</div>`,
      },
      {
        id: 'b_sig_prm',
        type: 'signature',
        title: 'VP Engineering & Operations',
        signerName: 'Alexander Cross',
        signatureStyle: 'classic',
      },
      {
        id: 'b_footer_prm',
        type: 'footer',
        hrName: 'Jane Smith',
        signatureText: 'Authorized Signatory',
        footerNotes: 'For Orbit Technologies Pvt Ltd.',
        contactInfo: 'Email: admissions@orbit.tech | Web: www.orbit.tech',
      },
    ],
  },
  experience: {
    name: 'Experience Certificate',
    category: 'Exits & Operations',
    version: '1.0.0',
    blocks: [
      {
        id: 'b_header_exp',
        type: 'header',
        companyName: 'Orbit Technologies Pvt Ltd',
        address: 'Plot 42, Silicon Valley Phase II, Madhapur, Hyderabad, Telangana, 500081',
        title: 'TO WHOMSOEVER IT MAY CONCERN',
        dateField: 'Date: {{date}}',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
      },
      {
        id: 'b_body_exp',
        type: 'body',
        content: `<div>This is to certify that <strong>{{employeeName}}</strong> was employed with Orbit Technologies Pvt Ltd as a <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department.</div><div><br></div><div>The employment dates were from <strong>{{joiningDate}}</strong> to <strong>{{date}}</strong>.</div><div><br></div><div>During their tenure, we found {{employeeName}} to be extremely professional, diligent, and solution-driven. They consistently met all deliverables on time and played a vital role in our system migrations. Their conduct during the employment was highly exemplary.</div><div><br></div><div>We wish them the absolute best in all their future endeavors.</div>`,
      },
      {
        id: 'b_sig_exp',
        type: 'signature',
        title: 'Head of People Operations',
        signerName: 'Jane Smith',
        signatureStyle: 'classic',
      },
    ],
  },
};
