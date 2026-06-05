import React, { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Grid,
  Divider,
  Paper,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Refresh as ResetIcon,
  Description as DocIcon,
  FileDownloadDone as DoneIcon,
} from '@mui/icons-material';

import type { GenerateDocumentProps } from './GenerateDocument.types';
import { replaceTemplateVariables, generateDocument, downloadDocument, printDocument } from '../utils/documentUtils';

export const GenerateDocument: React.FC<GenerateDocumentProps> = ({
  template,
  onGenerate,
}) => {
  // Initialize default form values from template variables
  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (template && template.variables) {
      template.variables.forEach((variable) => {
        defaults[variable.name] = variable.defaultValue !== undefined ? variable.defaultValue : '';
      });
    }
    defaults.documentName = template ? `${template.name} - Generated` : '';
    return defaults;
  }, [template]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  // Watch form values for live preview rendering
  const formValues = watch();

  // Reset form if template prop changes
  useEffect(() => {
    reset(defaultValues);
  }, [template, reset, defaultValues]);

  const onSubmit = (data: Record<string, any>) => {
    const { documentName, ...variableValues } = data;
    const generatedDoc = generateDocument(template, variableValues, documentName);
    if (onGenerate) {
      onGenerate(generatedDoc);
    }
  };

  const previewContent = useMemo(() => {
    if (!template) return '';
    const { documentName, ...variableValues } = formValues;
    return replaceTemplateVariables(template.content, template.variables, variableValues);
  }, [template, formValues]);

  const handlePrint = () => {
    const { documentName } = formValues;
    printDocument(previewContent, documentName || 'Document');
  };

  const handleDownload = (format: 'html' | 'pdf') => {
    const { documentName, ...variableValues } = formValues;
    const currentDoc = generateDocument(template, variableValues, documentName || 'Document');
    downloadDocument(currentDoc, format);
  };

  if (!template) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="warning">No template provided for document generation.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
            <DocIcon color="primary" /> Document Generator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the template variables on the left. The live document preview on the right will update in real-time.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Input Form */}
        <Grid size={{ xs: 12, md: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card variant="outlined" sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 500 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {template.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Category: <strong>{template.category}</strong>
                  </Typography>
                  {template.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {template.description}
                    </Typography>
                  )}
                </Box>

                <Divider />

                <Controller
                  name="documentName"
                  control={control}
                  rules={{ required: 'Document Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Output Document Name"
                      size="small"
                      fullWidth
                      error={!!errors.documentName}
                      helperText={errors.documentName ? String(errors.documentName.message) : undefined}
                      placeholder="e.g., John Doe - Offer Letter"
                    />
                  )}
                />

                <Typography variant="subtitle2" sx={{ mt: 1, mb: -1, fontWeight: 'bold' }}>
                  Template Variables
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 380, pr: 0.5 }}>
                  {template.variables.map((variable) => {
                    const validationRules: any = {};
                    if (variable.required) {
                      validationRules.required = `${variable.name} is required`;
                    }
                    if (variable.type === 'email') {
                      validationRules.pattern = {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      };
                    }

                    return (
                      <Box key={variable.name}>
                        <Controller
                          name={variable.name}
                          control={control}
                          rules={validationRules}
                          render={({ field: { value, onChange, ...rest } }) => {
                            if (variable.type === 'boolean') {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={!!value}
                                      onChange={(e) => onChange(e.target.checked)}
                                      {...rest}
                                    />
                                  }
                                  label={
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {variable.name} {variable.required && <span style={{ color: 'red' }}>*</span>}
                                      </Typography>
                                      {variable.description && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                          {variable.description}
                                        </Typography>
                                      )}
                                    </Box>
                                  }
                                />
                              );
                            }

                            if (variable.type === 'dropdown') {
                              return (
                                <FormControl size="small" fullWidth error={!!errors[variable.name]}>
                                  <InputLabel id={`label-${variable.name}`}>
                                    {variable.name} {variable.required && '*'}
                                  </InputLabel>
                                  <Select
                                    labelId={`label-${variable.name}`}
                                    value={value || ''}
                                    label={`${variable.name} ${variable.required ? '*' : ''}`}
                                    onChange={onChange}
                                    {...rest}
                                  >
                                    {variable.dropdownOptions?.map((opt) => (
                                      <MenuItem key={opt} value={opt}>
                                        {opt}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {errors[variable.name] && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                      {errors[variable.name]?.message as string}
                                    </Typography>
                                  )}
                                </FormControl>
                              );
                            }

                            // Text, Number, Date, Email, Currency
                            let typeInput = 'text';
                            let inputAdornment = undefined;
                            let shrinkLabel = undefined;

                            if (variable.type === 'number') {
                              typeInput = 'number';
                            } else if (variable.type === 'date') {
                              typeInput = 'date';
                              shrinkLabel = true;
                            } else if (variable.type === 'email') {
                              typeInput = 'email';
                            } else if (variable.type === 'currency') {
                              typeInput = 'number';
                              inputAdornment = (
                                <InputAdornment position="start">
                                  <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 'bold' }}>
                                    $
                                  </Typography>
                                </InputAdornment>
                              );
                            }

                            return (
                              <TextField
                                {...rest}
                                value={value || ''}
                                onChange={onChange}
                                label={variable.name}
                                size="small"
                                type={typeInput}
                                fullWidth
                                required={variable.required}
                                error={!!errors[variable.name]}
                                helperText={(errors[variable.name]?.message as string) || variable.description}
                                slotProps={{
                                  inputLabel: shrinkLabel ? { shrink: true } : undefined,
                                  input: inputAdornment
                                    ? { startAdornment: inputAdornment, style: { fontSize: 13 } }
                                    : { style: { fontSize: 13 } }
                                }}
                              />
                            );
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>

              <Divider sx={{ mt: 'auto' }} />

              <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'space-between', bgcolor: 'grey.50' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<ResetIcon />}
                  onClick={() => reset(defaultValues)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<DoneIcon />}
                  sx={{ textTransform: 'none', px: 3, borderRadius: 2 }}
                >
                  Generate Document
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>

        {/* Right Column: Live Document Preview */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', minHeight: 500, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Live Document Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Print Document">
                  <IconButton size="small" onClick={handlePrint} color="primary">
                    <PrintIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download as HTML">
                  <IconButton size="small" onClick={() => handleDownload('html')} color="primary">
                    <DownloadIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download as PDF">
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleDownload('pdf')}
                    sx={{ textTransform: 'none', fontSize: 11, fontWeight: 'bold' }}
                  >
                    PDF
                  </Button>
                </Tooltip>
              </Box>
            </Box>

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
                {template.content.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                ) : (
                  <Box sx={{ display: 'flex', height: '100%', minHeight: 500, alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      [Template contains no content structure. Start editing your template.]
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
