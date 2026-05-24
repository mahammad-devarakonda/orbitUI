export type BlockType =
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'paragraph'
  | 'divider'
  | 'signature'
  | 'table';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeaderBlockData extends BaseBlock {
  type: 'header';
  logoUrl?: string;
  companyName: string;
  address: string;
  title: string;
  dateField: string;
}

export interface BodyBlockData extends BaseBlock {
  type: 'body';
  content: string; // HTML content containing {{placeholders}}
}

export interface FooterBlockData extends BaseBlock {
  type: 'footer';
  signatureText?: string;
  hrName: string;
  footerNotes?: string;
  contactInfo?: string;
}

export interface TitleBlockData extends BaseBlock {
  type: 'title';
  text: string;
  align: 'left' | 'center' | 'right';
  level: 1 | 2 | 3;
}

export interface ParagraphBlockData extends BaseBlock {
  type: 'paragraph';
  text: string;
}

export interface DividerBlockData extends BaseBlock {
  type: 'divider';
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number; // in pixels
}

export interface SignatureBlockData extends BaseBlock {
  type: 'signature';
  title: string; // e.g. "Authorized Signature"
  signerName: string;
  signatureStyle: 'handwritten' | 'classic' | 'typed';
}

export interface TableBlockData extends BaseBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export type Block =
  | HeaderBlockData
  | BodyBlockData
  | FooterBlockData
  | TitleBlockData
  | ParagraphBlockData
  | DividerBlockData
  | SignatureBlockData
  | TableBlockData;

export interface Template {
  id: string;
  name: string;
  category: string;
  headerOptions: HeaderOptions;
  footerOptions: FooterOptions;
  signatureOptions: SignatureOptions;
  letterTitle: string;   // e.g. "OFFER OF EMPLOYMENT"
  toAddress: string;     // e.g. "To,\n{{employeeName}},\nBangalore"
  reLine: string;        // e.g. "Re: Appointment as {{designation}}" (regarding/client line)
  subjectLine: string;   // e.g. "Sub: {{employeeName}} | {{department}}" (actual subject)
  contentHtml: string;   // Compiled document HTML
  contentDelta: string;  // Serialized Quill Delta JSON string
  placeholders: string[]; // List of unique placeholders found e.g. ["employeeName", "date"]
  customVariables?: CustomVariable[]; // Manual user-created variables
  createdAt: string;
  updatedAt?: string;
  blocks?: any[]; // Legacy blocks support
}

export interface HeaderOptions {
  companyName: string;
  subheading: string;    // Custom subheading e.g. "Official Template Header"
  logoUrl?: string;
  address: string;
  phone: string;
  website: string;
  includeSeal: boolean;
  includeContactInfo: boolean;
  includeDate: boolean;
}

export interface FooterOptions {
  includeFooter: boolean;
  includeDocumentName: boolean;
  includeVersionNumber: boolean;
  includePageNumber: boolean;
  documentName?: string;
  version?: string;
}

export interface SignatureOptions {
  includeSignature: boolean;
  signerName: string;
  title: string;
  signatureStyle: 'handwritten' | 'classic' | 'typed';
}

export type VariableType = 'text' | 'number' | 'date' | 'dropdown';

export interface CustomVariable {
  key: string;
  label: string;
  type: VariableType;
  options?: string[];
}

