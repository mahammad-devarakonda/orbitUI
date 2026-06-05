import type { DocumentTemplate } from '../types/document.types';

export interface CreateTemplateProps {
  /**
   * Pre-loads an existing template for editing.
   */
  initialTemplate?: DocumentTemplate;
  /**
   * Callback fired when the user clicks the Save button and the template is valid.
   */
  onSaveTemplate?: (template: DocumentTemplate) => void;
  /**
   * Callback fired whenever the template name, content, or variables change.
   */
  onTemplateChange?: (template: DocumentTemplate) => void;
  /**
   * Optional custom list of categories to choose from.
   */
  categories?: string[];
}
