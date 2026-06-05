import type { DocumentTemplate, GeneratedDocument } from './types/document.types';

export const mockTemplates: DocumentTemplate[] = [
  {
    id: 'tpl_offer_letter',
    name: 'Offer Letter Template',
    description: 'Standard employee offer letter with variables for compensation, designation, and dates.',
    category: 'HR',
    content: `<div style="font-family: inherit; max-width: 650px; margin: auto; padding: 20px; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="color: #0070f3; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Orbit Technologies Private Limited</h2>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 0.85em;">100 Innovation Way, Tech District, CA 94043</p>
  </div>
  
  <p style="text-align: right; font-weight: bold; margin-bottom: 20px;">Date: {{joiningDate}}</p>
  
  <p>To,<br>
  <strong>{{employeeName}}</strong><br>
  Candidate Address Line 1</p>
  
  <p><strong>Subject: Offer of Employment - {{designation}}</strong></p>
  
  <p>Dear {{employeeName}},</p>
  
  <p>With reference to your application and subsequent interviews, we are pleased to offer you the position of <strong>{{designation}}</strong> in the <strong>{{department}}</strong> department at Orbit Technologies.</p>
  
  <p>Your joining date is scheduled to be <strong>{{joiningDate}}</strong>. You will be reporting directly to <strong>{{managerName}}</strong>, who will guide you during your onboarding and integration into the team.</p>
  
  <h3 style="color: #111; border-bottom: 1px solid #eaeaea; padding-bottom: 5px; margin-top: 25px;">Compensation & Benefits</h3>
  <p>Your annual base compensation package will be <strong>{{salary}}</strong>, subject to statutory deductions and tax regulations. This position is eligible for standard company benefits, including health insurance, paid leave, and performance-based incentives, as outlined in our company handbook.</p>
  
  <h3 style="color: #111; border-bottom: 1px solid #eaeaea; padding-bottom: 5px; margin-top: 25px;">Terms of Employment</h3>
  <p>By signing this offer letter, you acknowledge and agree that your employment is "at-will," meaning that either you or Orbit Technologies may terminate the employment relationship at any time, for any reason or no reason, with or without notice.</p>
  
  <p>Please review and sign this offer letter within 5 business days to confirm your acceptance. We look forward to welcome you to the Orbit family!</p>
  
  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div>
      <p style="margin-bottom: 50px;">Sincerely,</p>
      <p><strong>Orbit Technologies HR Team</strong></p>
    </div>
    <div style="text-align: right;">
      <p style="margin-bottom: 50px;">Accepted By:</p>
      <p style="border-top: 1px dashed #999; display: inline-block; width: 180px; text-align: center; padding-top: 5px;">{{employeeName}} (Signature)</p>
    </div>
  </div>
</div>`,
    variables: [
      {
        name: 'employeeName',
        type: 'text',
        required: true,
        description: 'Full name of the candidate',
        defaultValue: 'John Doe',
      },
      {
        name: 'joiningDate',
        type: 'date',
        required: true,
        description: 'First working day of the candidate',
        defaultValue: '2026-07-01',
      },
      {
        name: 'salary',
        type: 'currency',
        required: true,
        description: 'Annual gross compensation package (USD)',
        defaultValue: 120000,
      },
      {
        name: 'designation',
        type: 'dropdown',
        required: true,
        description: 'Job role in the company',
        defaultValue: 'Software Engineer',
        dropdownOptions: ['Software Engineer', 'Senior Software Engineer', 'Product Manager', 'UX Designer', 'QA Analyst'],
      },
      {
        name: 'department',
        type: 'text',
        required: true,
        description: 'Assigned business group',
        defaultValue: 'Engineering',
      },
      {
        name: 'managerName',
        type: 'text',
        required: false,
        description: 'Reporting manager name',
        defaultValue: 'Jane Smith',
      },
    ],
  },
  {
    id: 'tpl_nda',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Mutual non-disclosure agreement to protect proprietary information between two parties.',
    category: 'Legal',
    content: `<div style="font-family: inherit; max-width: 650px; margin: auto; padding: 20px; line-height: 1.6; text-align: justify;">
  <h2 style="text-align: center; color: #333;">MUTUAL NON-DISCLOSURE AGREEMENT</h2>
  <p>This Mutual Non-Disclosure Agreement (the "Agreement") is entered into and made effective as of <strong>{{effectiveDate}}</strong> (the "Effective Date"), by and between:</p>
  
  <p><strong>First Party:</strong> {{firstParty}}</p>
  <p>AND</p>
  <p><strong>Second Party:</strong> {{secondParty}}</p>
  
  <p>The parties wish to explore a business relationship of mutual interest and, in connection with this exploration, may disclose to each other certain proprietary, confidential, or trade secret information. The parties agree to the following terms:</p>
  
  <h3 style="font-size: 1.1em; color: #111; margin-top: 20px;">1. Confidential Information</h3>
  <p>"Confidential Information" refers to any proprietary information, technical data, trade secrets, or know-how, including but not limited to research, product plans, products, services, customers, markets, software, developments, inventions, processes, designs, drawings, engineering, or marketing strategies, disclosed by one party to the other, either directly or indirectly, in writing or orally.</p>
  
  <h3 style="font-size: 1.1em; color: #111; margin-top: 20px;">2. Obligations of Non-Disclosure</h3>
  <p>Each party agrees to hold all Confidential Information in confidence. The receiving party will limit dissemination of the disclosing party's Confidential Information to those employees or contractors who have a clear "need to know" and are bound by similar confidentiality duties. The receiving party will not copy, reproduce, or reverse-engineer any Confidential Information, nor disclose it to any third party without explicit written consent.</p>
  
  <h3 style="font-size: 1.1em; color: #111; margin-top: 20px;">3. Governing Law</h3>
  <p>This Agreement and any dispute arising under it shall be governed by and construed in accordance with the laws of the State of <strong>{{governingState}}</strong>, without regard to its principles of conflicts of law.</p>
  
  <div style="margin-top: 50px; display: flex; justify-content: space-between;">
    <div>
      <p style="border-top: 1px solid #aaa; width: 220px; padding-top: 5px;">For {{firstParty}}</p>
      <p>Name: Representative 1</p>
      <p>Title: Authorized Signatory</p>
    </div>
    <div style="text-align: right;">
      <p style="border-top: 1px solid #aaa; width: 220px; padding-top: 5px; display: inline-block;">For {{secondParty}}</p>
      <br>
      <p>Name: Representative 2</p>
      <p>Title: Authorized Signatory</p>
    </div>
  </div>
</div>`,
    variables: [
      {
        name: 'effectiveDate',
        type: 'date',
        required: true,
        description: 'Agreement start date',
        defaultValue: '2026-06-03',
      },
      {
        name: 'firstParty',
        type: 'text',
        required: true,
        description: 'Company or Individual initiating disclosures',
        defaultValue: 'Orbit UI Inc.',
      },
      {
        name: 'secondParty',
        type: 'text',
        required: true,
        description: 'Company or Individual receiving disclosures',
        defaultValue: 'Acme Corporation',
      },
      {
        name: 'governingState',
        type: 'text',
        required: true,
        description: 'Legal state jurisdiction',
        defaultValue: 'California',
      },
    ],
  },
];

export const mockDocuments: GeneratedDocument[] = [
  {
    id: 'doc_1',
    templateId: 'tpl_offer_letter',
    documentName: 'John Doe - Offer Letter',
    generatedDate: '2026-06-01T10:00:00.000Z',
    values: {
      employeeName: 'John Doe',
      joiningDate: '2026-07-01',
      salary: 125000,
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      managerName: 'Jane Smith',
    },
    renderedContent: `<div style="font-family: inherit; max-width: 650px; margin: auto; padding: 20px; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="color: #0070f3; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Orbit Technologies Private Limited</h2>
    <p style="color: #666; margin: 5px 0 0 0; font-size: 0.85em;">100 Innovation Way, Tech District, CA 94043</p>
  </div>
  
  <p style="text-align: right; font-weight: bold; margin-bottom: 20px;">Date: 01-Jul-2026</p>
  
  <p>To,<br>
  <strong>John Doe</strong><br>
  Candidate Address Line 1</p>
  
  <p><strong>Subject: Offer of Employment - Senior Software Engineer</strong></p>
  
  <p>Dear John Doe,</p>
  
  <p>With reference to your application and subsequent interviews, we are pleased to offer you the position of <strong>Senior Software Engineer</strong> in the <strong>Engineering</strong> department at Orbit Technologies.</p>
  
  <p>Your joining date is scheduled to be <strong>01-Jul-2026</strong>. You will be reporting directly to <strong>Jane Smith</strong>, who will guide you during your onboarding and integration into the team.</p>
  
  <h3 style="color: #111; border-bottom: 1px solid #eaeaea; padding-bottom: 5px; margin-top: 25px;">Compensation & Benefits</h3>
  <p>Your annual base compensation package will be <strong>$125,000</strong>, subject to statutory deductions and tax regulations. This position is eligible for standard company benefits, including health insurance, paid leave, and performance-based incentives, as outlined in our company handbook.</p>
  
  <h3 style="color: #111; border-bottom: 1px solid #eaeaea; padding-bottom: 5px; margin-top: 25px;">Terms of Employment</h3>
  <p>By signing this offer letter, you acknowledge and agree that your employment is "at-will," meaning that either you or Orbit Technologies may terminate the employment relationship at any time, for any reason or no reason, with or without notice.</p>
  
  <p>Please review and sign this offer letter within 5 business days to confirm your acceptance. We look forward to welcome you to the Orbit family!</p>
  
  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div>
      <p style="margin-bottom: 50px;">Sincerely,</p>
      <p><strong>Orbit Technologies HR Team</strong></p>
    </div>
    <div style="text-align: right;">
      <p style="margin-bottom: 50px;">Accepted By:</p>
      <p style="border-top: 1px dashed #999; display: inline-block; width: 180px; text-align: center; padding-top: 5px;">John Doe (Signature)</p>
    </div>
  </div>
</div>`,
  },
  {
    id: 'doc_2',
    templateId: 'tpl_nda',
    documentName: 'Orbit UI vs Acme Corp - NDA',
    generatedDate: '2026-06-02T15:30:00.000Z',
    values: {
      effectiveDate: '2026-06-03',
      firstParty: 'Orbit UI Inc.',
      secondParty: 'Acme Corporation',
      governingState: 'California',
    },
    renderedContent: `<div style="font-family: inherit; max-width: 650px; margin: auto; padding: 20px; line-height: 1.6; text-align: justify;">
  <h2 style="text-align: center; color: #333;">MUTUAL NON-DISCLOSURE AGREEMENT</h2>
  <p>This Mutual Non-Disclosure Agreement (the "Agreement") is entered into and made effective as of <strong>03-Jun-2026</strong> (the "Effective Date"), by and between:</p>
  
  <p><strong>First Party:</strong> Orbit UI Inc.</p>
  <p>AND</p>
  <p><strong>Second Party:</strong> Acme Corporation</p>
  
  <p>The parties wish to explore a business relationship of mutual interest and, in connection with this exploration, may disclose to each other certain proprietary, confidential, or trade secret information. The parties agree to the following terms:</p>
  
  <h3 style="font-size: 1.1em; color: #111; margin-top: 20px;">1. Confidential Information</h3>
  <p>"Confidential Information" refers to any proprietary information, technical data, trade secrets, or know-how, including but not limited to research, product plans, products, services, customers, markets, software, developments, inventions, processes, designs, drawings, engineering, or marketing strategies, disclosed by one party to the other, either directly or indirectly, in writing or orally.</p>
  
  <h3 style="font-size: 1.1em; color: #111; margin-top: 20px;">2. Obligations of Non-Disclosure</h3>
  <p>Each party agrees to hold all Confidential Information in confidence. The receiving party will limit dissemination of the disclosing party's Confidential Information to those employees or contractors who have a clear "need to know" and are bound by similar confidentiality duties. The receiving party will not copy, reproduce, or reverse-engineer any Confidential Information, nor disclose it to any third party without explicit written consent.</p>
  
  <h3 style="font-size: 1.1em; color: #111; margin-top: 20px;">3. Governing Law</h3>
  <p>This Agreement and any dispute arising under it shall be governed by and construed in accordance with the laws of the State of <strong>California</strong>, without regard to its principles of conflicts of law.</p>
  
  <div style="margin-top: 50px; display: flex; justify-content: space-between;">
    <div>
      <p style="border-top: 1px solid #aaa; width: 220px; padding-top: 5px;">For Orbit UI Inc.</p>
      <p>Name: Representative 1</p>
      <p>Title: Authorized Signatory</p>
    </div>
    <div style="text-align: right;">
      <p style="border-top: 1px solid #aaa; width: 220px; padding-top: 5px; display: inline-block;">For Acme Corporation</p>
      <br>
      <p>Name: Representative 2</p>
      <p>Title: Authorized Signatory</p>
    </div>
  </div>
</div>`,
  },
];
