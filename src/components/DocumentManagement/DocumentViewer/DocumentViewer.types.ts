import type { GeneratedDocument } from '../types/document.types';

export interface DocumentViewerProps {
  /**
   * List of generated documents.
   */
  documents: GeneratedDocument[];
  /**
   * Callback fired when a document is deleted.
   */
  onDelete?: (id: string) => void;
  /**
   * Callback fired when sharing a document.
   */
  onShare?: (document: GeneratedDocument) => void;
}
