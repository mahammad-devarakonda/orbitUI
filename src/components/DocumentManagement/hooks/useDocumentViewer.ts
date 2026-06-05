import { useState, useCallback, useMemo, useEffect } from 'react';
import type { GeneratedDocument } from '../types/document.types';

export interface UseDocumentViewerReturn {
  documents: GeneratedDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<GeneratedDocument[]>>;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  selectedDocument: GeneratedDocument | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'date' | 'name';
  setSortBy: (by: 'date' | 'name') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  filteredAndSortedDocuments: GeneratedDocument[];
  paginatedDocuments: GeneratedDocument[];
  totalPages: number;
  selectDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
}

export const useDocumentViewer = (
  initialDocuments: GeneratedDocument[],
  options?: {
    initialRowsPerPage?: number;
    onDeleteDocument?: (id: string) => void;
  }
): UseDocumentViewerReturn => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>(initialDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options?.initialRowsPerPage || 5);

  // Initialize selected document
  useEffect(() => {
    setDocuments(initialDocuments);
    if (initialDocuments.length > 0) {
      setSelectedDocumentId((prev) => {
        // Keep selection if it still exists, else select the first one
        if (prev && initialDocuments.some((d) => d.id === prev)) return prev;
        return initialDocuments[0].id;
      });
    } else {
      setSelectedDocumentId(null);
    }
  }, [initialDocuments]);

  const selectedDocument = useMemo(() => {
    return documents.find((doc) => doc.id === selectedDocumentId) || null;
  }, [documents, selectedDocumentId]);

  // Derived state: filtering & sorting
  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.documentName.toLowerCase().includes(query) ||
          doc.renderedContent.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.documentName.localeCompare(b.documentName);
      } else {
        comparison = new Date(a.generatedDate).getTime() - new Date(b.generatedDate).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [documents, searchQuery, sortBy, sortOrder]);

  // Reset page if filtered results length is smaller than current page starting index
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredAndSortedDocuments.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredAndSortedDocuments.length, rowsPerPage, page]);

  // Derived state: paginated items
  const paginatedDocuments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedDocuments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedDocuments, page, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAndSortedDocuments.length / rowsPerPage));
  }, [filteredAndSortedDocuments.length, rowsPerPage]);

  const selectDocument = useCallback((id: string) => {
    setSelectedDocumentId(id);
  }, []);

  const deleteDocument = useCallback(
    (id: string) => {
      setDocuments((prev) => {
        const nextDocs = prev.filter((doc) => doc.id !== id);
        setSelectedDocumentId((currId) => {
          if (currId === id) {
            return nextDocs.length > 0 ? nextDocs[0].id : null;
          }
          return currId;
        });
        return nextDocs;
      });

      if (options?.onDeleteDocument) {
        options.onDeleteDocument(id);
      }
    },
    [options]
  );

  return {
    documents,
    setDocuments,
    selectedDocumentId,
    setSelectedDocumentId,
    selectedDocument,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    filteredAndSortedDocuments,
    paginatedDocuments,
    totalPages,
    selectDocument,
    deleteDocument,
  };
};
