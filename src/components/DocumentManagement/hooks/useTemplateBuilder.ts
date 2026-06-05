import { useState, useCallback, useEffect } from 'react';
import type { DocumentTemplate, TemplateVariable } from '../types/document.types';
import { validateTemplate } from '../utils/documentUtils';

export interface UseTemplateBuilderReturn {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  content: string;
  setContent: (content: string) => void;
  variables: TemplateVariable[];
  setVariables: (variables: TemplateVariable[]) => void;
  errors: string[];
  addVariable: (variable: TemplateVariable) => boolean;
  updateVariable: (oldName: string, updatedVariable: TemplateVariable) => boolean;
  deleteVariable: (name: string) => void;
  validate: () => boolean;
  getTemplate: () => DocumentTemplate;
}

export const useTemplateBuilder = (initialTemplate?: Partial<DocumentTemplate>): UseTemplateBuilderReturn => {
  const [name, setName] = useState(initialTemplate?.name || '');
  const [description, setDescription] = useState(initialTemplate?.description || '');
  const [category, setCategory] = useState(initialTemplate?.category || '');
  const [content, setContent] = useState(initialTemplate?.content || '');
  const [variables, setVariables] = useState<TemplateVariable[]>(initialTemplate?.variables || []);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialTemplate) {
      if (initialTemplate.name !== undefined) setName(initialTemplate.name);
      if (initialTemplate.description !== undefined) setDescription(initialTemplate.description);
      if (initialTemplate.category !== undefined) setCategory(initialTemplate.category);
      if (initialTemplate.content !== undefined) setContent(initialTemplate.content);
      if (initialTemplate.variables !== undefined) setVariables(initialTemplate.variables);
    }
  }, [initialTemplate]);

  const addVariable = useCallback((variable: TemplateVariable): boolean => {
    let success = true;
    setVariables((prev) => {
      const exists = prev.some((v) => v.name.toLowerCase() === variable.name.toLowerCase());
      if (exists) {
        success = false;
        return prev;
      }
      return [...prev, variable];
    });
    return success;
  }, []);

  const updateVariable = useCallback((oldName: string, updatedVariable: TemplateVariable): boolean => {
    let success = true;
    setVariables((prev) => {
      // If variable name changed, check that new name doesn't collide with another variable
      if (oldName.toLowerCase() !== updatedVariable.name.toLowerCase()) {
        const nameCollision = prev.some((v) => v.name.toLowerCase() === updatedVariable.name.toLowerCase());
        if (nameCollision) {
          success = false;
          return prev;
        }
      }
      return prev.map((v) => (v.name.toLowerCase() === oldName.toLowerCase() ? updatedVariable : v));
    });
    return success;
  }, []);

  const deleteVariable = useCallback((varName: string) => {
    setVariables((prev) => prev.filter((v) => v.name.toLowerCase() !== varName.toLowerCase()));
  }, []);

  const validate = useCallback((): boolean => {
    const currentTemplate: Partial<DocumentTemplate> = {
      name,
      description,
      category,
      content,
      variables,
    };
    const validation = validateTemplate(currentTemplate);
    setErrors(validation.errors);
    return validation.valid;
  }, [name, description, category, content, variables]);

  const getTemplate = useCallback((): DocumentTemplate => {
    return {
      id: initialTemplate?.id || `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      description,
      category,
      content,
      variables,
    };
  }, [initialTemplate?.id, name, description, category, content, variables]);

  return {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    content,
    setContent,
    variables,
    setVariables,
    errors,
    addVariable,
    updateVariable,
    deleteVariable,
    validate,
    getTemplate,
  };
};
