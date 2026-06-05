import type { DocumentTemplate, GeneratedDocument } from '../types/document.types';

export interface GenerateDocumentProps {
  /**
   * The template metadata and content schema.
   */
  template: DocumentTemplate;
  /**
   * Callback triggered when the document is validated and generated.
   */
  onGenerate?: (document: GeneratedDocument) => void;
}
