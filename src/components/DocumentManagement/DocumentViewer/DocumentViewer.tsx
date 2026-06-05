import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Tooltip,
  IconButton,
  TablePagination,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  InsertDriveFile as DocIcon,
  FolderOpen as FolderIcon,
  ArrowUpward as AscIcon,
  ArrowDownward as DescIcon,
} from '@mui/icons-material';

import type { DocumentViewerProps } from './DocumentViewer.types';
import { useDocumentViewer } from '../hooks/useDocumentViewer';
import { downloadDocument, printDocument } from '../utils/documentUtils';

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documents: initialDocuments,
  onDelete,
  onShare,
}) => {
  const viewer = useDocumentViewer(initialDocuments, {
    initialRowsPerPage: 5,
    onDeleteDocument: onDelete,
  });

  const {
    documents,
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
  } = viewer;

  const [isMetaExpanded, setIsMetaExpanded] = useState(false);

  const handlePrint = () => {
    if (selectedDocument) {
      printDocument(selectedDocument.renderedContent, selectedDocument.documentName);
    }
  };

  const handleDownload = (format: 'html' | 'pdf') => {
    if (selectedDocument) {
      downloadDocument(selectedDocument, format);
    }
  };

  const handleShareClick = () => {
    if (selectedDocument && onShare) {
      onShare(selectedDocument);
    } else if (selectedDocument) {
      alert(`Sharing details for document: ${selectedDocument.documentName}`);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
        <FolderIcon color="primary" />
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
            Document Repository
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search, sort, view metadata, print, or download generated HTML and PDF files.
          </Typography>
        </Box>
      </Box>

      {documents.length === 0 ? (
        // Empty State: No documents at all
        <Card variant="outlined" sx={{ py: 8, textAlign: 'center', borderRadius: 3 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <FolderIcon sx={{ fontSize: 50, color: 'text.disabled' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              No Documents Generated Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              Create a template and input variables to generate your first document. It will show up here in this repository explorer.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column: Explorer list */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 600 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Browse Documents
                </Typography>

                {/* Search Bar */}
                <TextField
                  placeholder="Search by name or content..."
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />,
                    }
                  }}
                />

                {/* Sort Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50', p: 1, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SortIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      Sort By:
                    </Typography>
                    <Chip
                      label="Date"
                      size="small"
                      color={sortBy === 'date' ? 'primary' : 'default'}
                      onClick={() => setSortBy('date')}
                      sx={{ height: 22, fontSize: 10, cursor: 'pointer' }}
                    />
                    <Chip
                      label="Title"
                      size="small"
                      color={sortBy === 'name' ? 'primary' : 'default'}
                      onClick={() => setSortBy('name')}
                      sx={{ height: 22, fontSize: 10, cursor: 'pointer' }}
                    />
                  </Box>
                  <Tooltip title={`Toggle Sort Order (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}>
                    <IconButton size="small" onClick={toggleSortOrder}>
                      {sortOrder === 'asc' ? <AscIcon sx={{ fontSize: 16 }} /> : <DescIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Documents List */}
                {filteredAndSortedDocuments.length === 0 ? (
                  <Box sx={{ flexGrow: 1, py: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                      No matching documents found.
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ width: '100%', flexGrow: 1, overflowY: 'auto', maxHeight: 400, p: 0 }}>
                    {paginatedDocuments.map((doc) => {
                      const isSelected = selectedDocument?.id === doc.id;
                      return (
                        <Paper
                          key={doc.id}
                          elevation={0}
                          sx={{
                            mb: 1,
                            p: 0.5,
                            border: '1px solid',
                            borderColor: isSelected ? 'primary.light' : 'divider',
                            borderRadius: 2.5,
                            bgcolor: isSelected ? 'blue.50' : 'background.paper',
                            '&:hover': {
                              bgcolor: isSelected ? 'blue.50' : 'grey.50',
                              cursor: 'pointer',
                            },
                          }}
                          onClick={() => viewer.selectDocument(doc.id)}
                        >
                          <ListItem
                            disablePadding
                            sx={{ px: 1, py: 0.5 }}
                            secondaryAction={
                              <Box>
                                <Tooltip title="Share document">
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onShare) onShare(doc);
                                      else alert(`Share document: ${doc.documentName}`);
                                    }}
                                    sx={{ mr: 0.5 }}
                                  >
                                    <ShareIcon sx={{ fontSize: 15 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete record">
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      viewer.deleteDocument(doc.id);
                                    }}
                                  >
                                    <DeleteIcon sx={{ fontSize: 15 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            }
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <DocIcon sx={{ fontSize: 16, color: isSelected ? 'primary.main' : 'text.secondary' }} />
                                  <Typography variant="body2" noWrap sx={{ maxWidth: 180, fontWeight: 'bold' }}>
                                    {doc.documentName}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 3, display: 'block' }}>
                                  {new Date(doc.generatedDate).toLocaleDateString(undefined, {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Paper>
                      );
                    })}
                  </List>
                )}
              </CardContent>

              {/* Pagination controls */}
              <Divider sx={{ mt: 'auto' }} />
              <TablePagination
                component="div"
                count={filteredAndSortedDocuments.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 20]}
                labelRowsPerPage="Rows:"
                sx={{ borderTop: 'none', bgcolor: 'grey.50' }}
              />
            </Card>
          </Grid>

          {/* Right Column: View Panel */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            {selectedDocument ? (
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                {/* Active Header Actions */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
                  <Box>
                    <Typography variant="subtitle1" noWrap sx={{ maxWidth: 280, fontWeight: 'bold' }}>
                      {selectedDocument.documentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(selectedDocument.generatedDate).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Tooltip title="Print Document">
                      <IconButton size="small" onClick={handlePrint} color="primary">
                        <PrintIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download HTML">
                      <IconButton size="small" onClick={() => handleDownload('html')} color="primary">
                        <DownloadIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleDownload('pdf')}
                      sx={{ textTransform: 'none', fontSize: 11, fontWeight: 'bold' }}
                    >
                      PDF
                    </Button>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                    <Tooltip title="Share document">
                      <IconButton size="small" onClick={handleShareClick} color="primary">
                        <ShareIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete record">
                      <IconButton size="small" onClick={() => viewer.deleteDocument(selectedDocument.id)} color="error">
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Inspect Values details */}
                {selectedDocument.values && Object.keys(selectedDocument.values).length > 0 && (
                  <Accordion
                    expanded={isMetaExpanded}
                    onChange={(_, val) => setIsMetaExpanded(val)}
                    elevation={0}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&::before': { display: 'none' },
                      borderRadius: 0,
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon color="action" sx={{ fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                          Variables Used ({Object.keys(selectedDocument.values).length})
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ py: 1, bgcolor: 'grey.50' }}>
                      <Grid container spacing={1}>
                        {Object.entries(selectedDocument.values).map(([k, v]) => (
                          <Grid size={{ xs: 6, sm: 4 }} key={k}>
                            <Box sx={{ border: '1px solid', borderColor: 'divider', p: 0.75, borderRadius: 1.5, bgcolor: 'white' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 9, display: 'block' }}>
                                {k}
                              </Typography>
                              <Typography variant="caption" noWrap sx={{ fontSize: 10, fontWeight: 'bold', display: 'block' }}>
                                {v === true ? 'Yes' : v === false ? 'No' : String(v)}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Document Sheet Container */}
                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: 'grey.100', display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      width: '100%',
                      maxWidth: '650px',
                      minHeight: '600px',
                      p: 4,
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: selectedDocument.renderedContent }} />
                  </Paper>
                </Box>
              </Card>
            ) : (
              // Selecting State: No document active
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Box sx={{ textAlign: 'center', color: 'text.secondary', p: 3 }}>
                  <DocIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Select a document from the Left Panel to view and download it.
                  </Typography>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
