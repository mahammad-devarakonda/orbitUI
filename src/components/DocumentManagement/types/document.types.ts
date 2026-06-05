export type VariableType = 'text' | 'number' | 'date' | 'email' | 'currency' | 'boolean' | 'dropdown';

export interface TemplateVariable {
  name: string; // The variable placeholder, e.g., "employeeName" (will match {{employeeName}})
  type: VariableType;
  required: boolean;
  defaultValue?: any;
  dropdownOptions?: string[]; // Used when type is 'dropdown'
  description?: string; // Optional field description/label
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string; // E.g., 'HR', 'Legal', etc., as a flexible string
  content: string; // Rich text / markdown / HTML template content with placeholders like {{employeeName}}
  variables: TemplateVariable[];
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  documentName: string;
  generatedDate: string; // ISO date string
  values: Record<string, any>; // The input values mapped by variable name
  renderedContent: string; // The template content with placeholders replaced by actual values
}
