import React from 'react';

export interface TemplateColumn {
  width?: string; // e.g. "50%", "33.3%", "60%"
  content: string; // HTML string supporting variables in {{name}} style
}

export interface TableColumnConfig {
  label: string;
  key: string;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'currency' | 'number' | 'date';
}

export interface TableConfig {
  dataKey: string; // Key in raw data pointing to array (e.g. "items")
  columns: TableColumnConfig[];
}

export interface TemplateSection {
  type: 'columns' | 'table' | 'divider' | 'footer' | 'content';
  content?: string; // HTML content for 'content' or 'footer'
  columns?: TemplateColumn[]; // For 'columns'
  tableConfig?: TableConfig; // For 'table'
  className?: string; // Tailwind overrides
  style?: React.CSSProperties;
}

export interface TemplatePage {
  sections: TemplateSection[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  pageSize?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  themeColor: string;
  pages: TemplatePage[];
}

export interface CompiledSection {
  type: 'columns' | 'table' | 'divider' | 'footer' | 'content';
  content?: string; // Interpolated HTML text
  columns?: { width?: string; content: string }[]; // Interpolated columns HTML
  tableData?: {
    headers: string[];
    rows: string[][];
    alignments: ('left' | 'center' | 'right')[];
  };
  className?: string;
  style?: React.CSSProperties;
}

export interface GeneratedPage {
  pageNumber: number;
  sections: CompiledSection[];
}

export interface GeneratedDocument {
  templateId: string;
  name: string;
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  themeColor: string;
  pages: GeneratedPage[];
}
