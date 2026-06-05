import type { DocumentTemplate, GeneratedDocument, TemplateVariable } from '../types/document.types';

/**
 * Replaces all occurrences of {{variableName}} in the content with their actual values.
 * Formats data according to the variable type (date, currency, boolean).
 */
export const replaceTemplateVariables = (
  content: string,
  variables: TemplateVariable[],
  values: Record<string, any>
): string => {
  let result = content || '';
  if (!variables || variables.length === 0) return result;

  variables.forEach((variable) => {
    const rawValue = values[variable.name];
    let displayValue = '';

    if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
      switch (variable.type) {
        case 'currency': {
          const num = parseFloat(rawValue);
          if (!isNaN(num)) {
            displayValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(num);
          } else {
            displayValue = String(rawValue);
          }
          break;
        }
        case 'date': {
          try {
            const date = new Date(rawValue);
            if (!isNaN(date.getTime())) {
              const day = String(date.getDate()).padStart(2, '0');
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const month = months[date.getMonth()];
              const year = date.getFullYear();
              displayValue = `${day}-${month}-${year}`;
            } else {
              displayValue = String(rawValue);
            }
          } catch {
            displayValue = String(rawValue);
          }
          break;
        }
        case 'boolean': {
          displayValue = rawValue === true || rawValue === 'true' ? 'Yes' : 'No';
          break;
        }
        default:
          displayValue = String(rawValue);
          break;
      }
    } else {
      // If we don't have a value, leave it blank or default to empty string
      displayValue = '';
    }

    // Escape regex characters in the variable name
    const escapedName = variable.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`{{\\s*${escapedName}\\s*}}`, 'g');
    result = result.replace(regex, displayValue);
  });

  return result;
};

/**
 * Validates template metadata and variables structure.
 * Checks for empty fields, invalid names, and unclosed placeholders.
 */
export const validateTemplate = (
  template: Partial<DocumentTemplate>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!template.name?.trim()) {
    errors.push('Template Name is required.');
  }
  if (!template.category?.trim()) {
    errors.push('Category is required.');
  }

  const varNames = new Set<string>();
  
  if (template.variables) {
    template.variables.forEach((variable, index) => {
      if (!variable.name?.trim()) {
        errors.push(`Variable at position ${index + 1} must have a name.`);
      } else {
        if (!/^[a-zA-Z0-9_]+$/.test(variable.name)) {
          errors.push(`Variable name "${variable.name}" is invalid. Use alphanumeric characters and underscores only.`);
        }
        if (varNames.has(variable.name)) {
          errors.push(`Variable name "${variable.name}" is duplicated.`);
        }
        varNames.add(variable.name);
      }

      if (variable.type === 'dropdown' && (!variable.dropdownOptions || variable.dropdownOptions.length === 0)) {
        errors.push(`Dropdown variable "${variable.name || index + 1}" must have at least one option.`);
      }
    });
  }

  // Scan content for placeholders e.g. {{variableName}}
  if (template.content) {
    const placeholderRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    let match;
    const contentPlaceholders = new Set<string>();
    
    while ((match = placeholderRegex.exec(template.content)) !== null) {
      contentPlaceholders.add(match[1]);
    }

    contentPlaceholders.forEach((placeholder) => {
      if (!varNames.has(placeholder)) {
        errors.push(`Placeholder "{{${placeholder}}}" in content is not defined in the variables list.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generates a standard GeneratedDocument output given a template and variable answers.
 */
export const generateDocument = (
  template: DocumentTemplate,
  values: Record<string, any>,
  documentName?: string
): GeneratedDocument => {
  const renderedContent = replaceTemplateVariables(template.content, template.variables, values);
  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    templateId: template.id,
    documentName: documentName || `${template.name} - Generated`,
    generatedDate: new Date().toISOString(),
    values,
    renderedContent,
  };
};

/**
 * Downloads a generated document as HTML, or triggers Print-to-PDF if PDF is chosen.
 */
export const downloadDocument = (document: GeneratedDocument, format: 'html' | 'pdf') => {
  if (format === 'html') {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${document.documentName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
    }
    .metadata {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      font-size: 0.9em;
      color: #666;
    }
    .metadata h1 {
      margin: 0 0 10px 0;
      color: #111;
      font-size: 2em;
    }
    .content {
      white-space: pre-wrap;
      font-size: 1.05em;
    }
  </style>
</head>
<body>
  <div class="metadata">
    <h1>${document.documentName}</h1>
    <p><strong>Generated Date:</strong> ${new Date(document.generatedDate).toLocaleString()}</p>
    <p><strong>Template ID:</strong> ${document.templateId}</p>
  </div>
  <div class="content">${document.renderedContent}</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.documentName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.html`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Print/PDF route
    printDocument(document.renderedContent, document.documentName);
  }
};

/**
 * Spawns a print browser window containing the rendered content.
 */
export const printDocument = (renderedContent: string, title: string = 'Document') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Failed to open print window. Please disable pop-up blockers.');
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 30px;
      margin: 0;
      background-color: #fff;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div>${renderedContent}</div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.close();
      }, 300);
    };
  </script>
</body>
</html>`);

  printWindow.document.close();
};
