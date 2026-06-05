import { useState, useCallback, useMemo, useEffect } from 'react';
import type { DocumentTemplate, GeneratedDocument } from '../types/document.types';
import { replaceTemplateVariables, generateDocument } from '../utils/documentUtils';

export interface UseDocumentGeneratorReturn {
  values: Record<string, any>;
  setValues: (values: Record<string, any>) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  errors: Record<string, string>;
  updateValue: (name: string, value: any) => void;
  reset: () => void;
  validate: () => boolean;
  generate: () => GeneratedDocument | null;
  previewContent: string;
}

export const useDocumentGenerator = (
  template: DocumentTemplate,
  onGenerate?: (document: GeneratedDocument) => void
): UseDocumentGeneratorReturn => {
  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (template && template.variables) {
      template.variables.forEach((variable) => {
        defaults[variable.name] = variable.defaultValue !== undefined ? variable.defaultValue : '';
      });
    }
    return defaults;
  }, [template]);

  const [values, setValues] = useState<Record<string, any>>(defaultValues);
  const [documentName, setDocumentName] = useState(template ? `${template.name} - Generated` : '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset values when template changes
  useEffect(() => {
    setValues(defaultValues);
    setDocumentName(template ? `${template.name} - Generated` : '');
    setErrors({});
  }, [template, defaultValues]);

  const updateValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(defaultValues);
    setDocumentName(template ? `${template.name} - Generated` : '');
    setErrors({});
  }, [defaultValues, template]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (template && template.variables) {
      template.variables.forEach((variable) => {
        const val = values[variable.name];
        if (variable.required && (val === undefined || val === null || val === '')) {
          newErrors[variable.name] = 'This field is required';
        } else if (val) {
          if (variable.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            newErrors[variable.name] = 'Invalid email address';
          }
          if (variable.type === 'number' && isNaN(Number(val))) {
            newErrors[variable.name] = 'Must be a number';
          }
        }
      });
    }

    if (!documentName?.trim()) {
      newErrors.documentName = 'Document name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [template, values, documentName]);

  const generate = useCallback((): GeneratedDocument | null => {
    if (!validate()) return null;
    const doc = generateDocument(template, values, documentName);
    if (onGenerate) {
      onGenerate(doc);
    }
    return doc;
  }, [template, values, documentName, validate, onGenerate]);

  const previewContent = useMemo(() => {
    if (!template) return '';
    return replaceTemplateVariables(template.content, template.variables, values);
  }, [template, values]);

  return {
    values,
    setValues,
    documentName,
    setDocumentName,
    errors,
    updateValue,
    reset,
    validate,
    generate,
    previewContent,
  };
};
