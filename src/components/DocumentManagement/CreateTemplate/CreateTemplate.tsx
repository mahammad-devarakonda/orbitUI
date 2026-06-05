import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Chip,
  Tooltip,
  Grid,
  Paper,
  Alert,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Code as CodeIcon,
  Close as CloseIcon,
  Input as InputIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

import type { CreateTemplateProps } from './CreateTemplate.types';
import { useTemplateBuilder } from '../hooks/useTemplateBuilder';
import type { TemplateVariable, VariableType } from '../types/document.types';

export const CreateTemplate: React.FC<CreateTemplateProps> = ({
  initialTemplate,
  onSaveTemplate,
  onTemplateChange,
  categories = ['HR', 'Legal', 'Finance', 'Operations', 'Other'],
}) => {
  const builder = useTemplateBuilder(initialTemplate);
  const {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    content,
    setContent,
    variables,
    addVariable,
    deleteVariable,
    validate,
    getTemplate,
    errors,
  } = builder;

  // Dialog State (Main Template Form)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Dynamic Variable Sub-form State
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState<VariableType>('text');
  const [newVarRequired, setNewVarRequired] = useState(true);
  const [newVarDefaultValue, setNewVarDefaultValue] = useState('');
  const [newVarDropdownOptions, setNewVarDropdownOptions] = useState('');
  const [newVarDescription, setNewVarDescription] = useState('');
  const [addFieldValidationError, setAddFieldValidationError] = useState('');

  // Sample values typed by the user in the dynamically rendered fields
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});

  // Reference to template body text area
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync state if initialTemplate is provided or changed
  useEffect(() => {
    if (initialTemplate) {
      setIsDialogOpen(true);
    }
  }, [initialTemplate]);

  // Sync dynamic form values when variables list changes
  useEffect(() => {
    const updatedValues = { ...dynamicValues };
    variables.forEach((variable) => {
      if (updatedValues[variable.name] === undefined) {
        updatedValues[variable.name] = variable.defaultValue !== undefined ? variable.defaultValue : '';
      }
    });
    setDynamicValues(updatedValues);
  }, [variables]);

  // Fire parent change callback on modification
  useEffect(() => {
    if (onTemplateChange) {
      onTemplateChange(getTemplate());
    }
  }, [name, description, category, content, variables, onTemplateChange]);

  // Insert template placeholder {{variable}} at current editor cursor
  const insertAtCursor = (varName: string) => {
    const placeholder = `{{${varName}}}`;
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback: append to content
      setContent(content + placeholder);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const replacement = placeholder;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    setContent(newValue);

    // Refocus and place cursor after inserted placeholder
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + placeholder.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleOpenCreateDialog = () => {
    // Reset state for new template
    setName('');
    setDescription('');
    setCategory(categories[0] || 'HR');
    setContent('');
    // Clear variables
    builder.setVariables([]);
    setDynamicValues({});
    setIsAddFieldOpen(false);
    setAddFieldValidationError('');
    setIsDialogOpen(true);
  };

  const handleAddFieldClick = () => {
    setIsAddFieldOpen(!isAddFieldOpen);
    // Reset new field form states
    setNewVarName('');
    setNewVarType('text');
    setNewVarRequired(true);
    setNewVarDefaultValue('');
    setNewVarDropdownOptions('');
    setNewVarDescription('');
    setAddFieldValidationError('');
  };

  const handleSaveDynamicField = () => {
    const trimmedName = newVarName.trim();
    if (!trimmedName) {
      setAddFieldValidationError('Field name is required.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
      setAddFieldValidationError('Field name must be alphanumeric with no spaces (e.g. employeeName).');
      return;
    }

    const optionsArray = newVarType === 'dropdown'
      ? newVarDropdownOptions.split(',').map((o) => o.trim()).filter((o) => o.length > 0)
      : undefined;

    if (newVarType === 'dropdown' && (!optionsArray || optionsArray.length === 0)) {
      setAddFieldValidationError('Dropdown list must contain at least one option.');
      return;
    }

    let defaultVal: any = newVarDefaultValue;
    if (newVarType === 'boolean') {
      defaultVal = newVarDefaultValue === 'true' || newVarDefaultValue === 'Yes' || newVarDefaultValue === 'on';
    } else if (newVarType === 'number') {
      const parsed = parseFloat(newVarDefaultValue);
      defaultVal = !isNaN(parsed) ? parsed : '';
    }

    const newVariable: TemplateVariable = {
      name: trimmedName,
      type: newVarType,
      required: newVarRequired,
      defaultValue: defaultVal,
      dropdownOptions: optionsArray,
      description: newVarDescription.trim() || undefined,
    };

    const added = addVariable(newVariable);
    if (added) {
      // Clear inline form
      setNewVarName('');
      setNewVarType('text');
      setNewVarRequired(true);
      setNewVarDefaultValue('');
      setNewVarDropdownOptions('');
      setNewVarDescription('');
      setAddFieldValidationError('');
      setIsAddFieldOpen(false);
    } else {
      setAddFieldValidationError(`A field with name "${trimmedName}" already exists.`);
    }
  };

  const handleSaveTemplateSubmit = () => {
    const isValid = validate();
    if (isValid && onSaveTemplate) {
      onSaveTemplate(getTemplate());
      setIsDialogOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '350px',
        p: 4,
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      }}
    >
      {/* Premium Empty State / Action Page */}
      <Card
        elevation={0}
        sx={{
          maxWidth: 550,
          width: '100%',
          textAlign: 'center',
          p: 5,
          borderRadius: 6,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.15)',
          },
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            mb: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            color: 'primary.main',
          }}
        >
          <CodeIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary', letterSpacing: '-0.5px' }}>
          Document Template Builder
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: '400px', mx: 'auto', lineHeight: 1.6 }}>
          Define custom structures, insert rich-text placeholders, and generate professional documents with automated binding.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{
            px: 4,
            py: 1.8,
            borderRadius: 3.5,
            textTransform: 'none',
            fontSize: '15px',
            fontWeight: 700,
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
            background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)',
              boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.4)',
            },
          }}
        >
          {initialTemplate ? 'Edit Template' : 'Create Template'}
        </Button>
      </Card>

      {/* Main Dialog Form */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 5,
            boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 0.8,
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                display: 'flex',
              }}
            >
              <CodeIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {initialTemplate ? 'Edit Document Template' : 'Create Document Template'}
            </Typography>
          </Box>
          <IconButton onClick={() => setIsDialogOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Please correct the following template errors:</Typography>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {errors.map((err, idx) => (
                  <li key={idx}><Typography variant="caption">{err}</Typography></li>
                ))}
              </ul>
            </Alert>
          )}

          <Grid container spacing={4}>
            {/* Left Hand Column: Template Details & Content Editor */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Template Metadata
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      label="Template Name"
                      fullWidth
                      required
                      placeholder="e.g. Employee Offer Letter"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth required>
                      <InputLabel id="dialog-cat-select-label">Category</InputLabel>
                      <Select
                        labelId="dialog-cat-select-label"
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{ borderRadius: 3 }}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Describe the purpose of this template..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Template Content
                  </Typography>
                  <Tooltip title="Placeholders are written using double brackets like {{variable_name}}">
                    <IconButton size="small">
                      <HelpIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TextField
                  id="template-body-textarea"
                  inputRef={textareaRef}
                  label="Body Text"
                  fullWidth
                  multiline
                  required
                  rows={10}
                  placeholder="Write the document content here. You can insert dynamic fields at the cursor using the 'Insert' buttons on the right side."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      style: {
                        fontFamily: 'Consolas, Monaco, monospace',
                        fontSize: 13,
                        lineHeight: 1.5,
                      },
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Box>
            </Grid>

            {/* Right Hand Column: Dynamic Fields Builder & Live Dynamic Form Preview */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: 'grey.50',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header and Add Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    Dynamic Fields Builder
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddFieldClick}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Add Field
                  </Button>
                </Box>

                {/* Add Field Sub-form (Collapsible) */}
                <Collapse in={isAddFieldOpen}>
                  <Card sx={{ p: 2.5, mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Configure New Field
                    </Typography>

                    {addFieldValidationError && (
                      <Alert severity="error" sx={{ mb: 2, py: 0.5, borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ display: 'block' }}>{addFieldValidationError}</Typography>
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        size="small"
                        label="Field Name"
                        required
                        placeholder="e.g. employeeName"
                        value={newVarName}
                        onChange={(e) => setNewVarName(e.target.value)}
                        helperText="Must be letters/numbers with no spaces."
                        slotProps={{ formHelperText: { style: { fontSize: 10 } } }}
                      />

                      <FormControl size="small" fullWidth>
                        <InputLabel id="new-var-type-label">Field Type</InputLabel>
                        <Select
                          labelId="new-var-type-label"
                          value={newVarType}
                          label="Field Type"
                          onChange={(e) => setNewVarType(e.target.value as VariableType)}
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="date">Date</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="currency">Currency</MenuItem>
                          <MenuItem value="boolean">Boolean (Yes/No)</MenuItem>
                          <MenuItem value="dropdown">Dropdown List</MenuItem>
                        </Select>
                      </FormControl>

                      {newVarType === 'dropdown' && (
                        <TextField
                          size="small"
                          label="Dropdown Options"
                          required
                          placeholder="Option 1, Option 2, Option 3"
                          value={newVarDropdownOptions}
                          onChange={(e) => setNewVarDropdownOptions(e.target.value)}
                          helperText="Separate options with commas."
                          slotProps={{ formHelperText: { style: { fontSize: 10 } } }}
                        />
                      )}

                      <TextField
                        size="small"
                        label="Default Value"
                        placeholder="Optional default..."
                        value={newVarDefaultValue}
                        onChange={(e) => setNewVarDefaultValue(e.target.value)}
                      />

                      <TextField
                        size="small"
                        label="Help/Description"
                        placeholder="Help text for the input..."
                        value={newVarDescription}
                        onChange={(e) => setNewVarDescription(e.target.value)}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newVarRequired}
                            onChange={(e) => setNewVarRequired(e.target.checked)}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">Required field</Typography>}
                      />

                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                        <Button size="small" onClick={() => setIsAddFieldOpen(false)} sx={{ textTransform: 'none' }}>
                          Cancel
                        </Button>
                        <Button size="small" variant="contained" onClick={handleSaveDynamicField} sx={{ textTransform: 'none' }}>
                          Save Field
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Collapse>

                {/* Rendered Inputs List */}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600, textTransform: 'uppercase' }}>
                  Interactive Form Preview & Rendered Fields
                </Typography>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '420px', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {variables.length === 0 ? (
                    <Box
                      sx={{
                        py: 6,
                        px: 2,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No fields have been created yet.
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Click "Add Field" to define dynamic placeholders.
                      </Typography>
                    </Box>
                  ) : (
                    variables.map((variable) => (
                      <Paper
                        elevation={0}
                        key={variable.name}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                          position: 'relative',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'indigo.750' }}>
                              {`{{${variable.name}}}`}
                            </Typography>
                            {variable.required && (
                              <Chip label="Required" size="small" color="error" variant="outlined" sx={{ height: 16, fontSize: 8 }} />
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Insert placeholder into editor at cursor">
                              <IconButton
                                size="small"
                                onClick={() => insertAtCursor(variable.name)}
                                color="primary"
                              >
                                <InputIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete field">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => deleteVariable(variable.name)}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* DYNAMIC FIELD COMPONENT RENDERING */}
                        <Box>
                          {variable.type === 'boolean' ? (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!dynamicValues[variable.name]}
                                  onChange={(e) =>
                                    setDynamicValues((prev) => ({ ...prev, [variable.name]: e.target.checked }))
                                  }
                                />
                              }
                              label={
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                  {variable.description || variable.name}
                                </Typography>
                              }
                            />
                          ) : variable.type === 'dropdown' ? (
                            <FormControl size="small" fullWidth>
                              <InputLabel id={`input-select-${variable.name}`}>{variable.description || variable.name}</InputLabel>
                              <Select
                                labelId={`input-select-${variable.name}`}
                                value={dynamicValues[variable.name] || ''}
                                label={variable.description || variable.name}
                                onChange={(e) =>
                                  setDynamicValues((prev) => ({ ...prev, [variable.name]: e.target.value }))
                                }
                                sx={{ borderRadius: 2 }}
                              >
                                {variable.dropdownOptions?.map((opt) => (
                                  <MenuItem key={opt} value={opt} sx={{ fontSize: 12 }}>
                                    {opt}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              label={variable.description || variable.name}
                              size="small"
                              type={
                                variable.type === 'number'
                                  ? 'number'
                                  : variable.type === 'date'
                                  ? 'date'
                                  : variable.type === 'email'
                                  ? 'email'
                                  : 'text'
                              }
                              fullWidth
                              value={dynamicValues[variable.name] || ''}
                              onChange={(e) =>
                                setDynamicValues((prev) => ({ ...prev, [variable.name]: e.target.value }))
                              }
                              slotProps={{
                                inputLabel: variable.type === 'date' ? { shrink: true } : undefined,
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                '& input': { fontSize: 12 },
                              }}
                            />
                          )}
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid', borderColor: 'divider', gap: 1.5 }}>
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="text"
            sx={{ textTransform: 'none', borderRadius: 2.5, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTemplateSubmit}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2.5,
              px: 4,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
            }}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
