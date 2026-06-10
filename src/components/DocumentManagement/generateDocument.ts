import type { DocumentTemplate, GeneratedDocument, GeneratedPage, CompiledSection } from './types';

// Helper to resolve nested object paths like "customer.address.city"
export function getNestedValue(obj: any, path: string): any {
  if (!obj) return '';
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return '';
    }
    current = current[part];
  }
  return current !== undefined && current !== null ? current : '';
}

// Format utilities
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('en-US').format(val);
};

export const formatDate = (val: string | Date | number): string => {
  if (!val) return '';
  const date = new Date(val);
  if (isNaN(date.getTime())) return String(val);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Main interpolation function
export function interpolateString(text: string, data: any, templateContext: any): string {
  if (!text) return '';
  return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const trimmed = key.trim();
    // First check data
    let val = getNestedValue(data, trimmed);
    // If not found, check templateContext
    if (val === '' && templateContext) {
      val = getNestedValue(templateContext, trimmed);
    }
    // Return formatting if it's a date or a number under specific conditions, otherwise string
    return val !== undefined && val !== null ? String(val) : '';
  });
}

interface GenerateDocumentOptions {
  template: DocumentTemplate;
  data: Record<string, any>;
}

export function generateDocument({ template, data }: GenerateDocumentOptions): GeneratedDocument {
  // 1. Enrich data with automated calculations
  const enrichedData = { ...data };

  // Calculate table items if available
  if (Array.isArray(enrichedData.items)) {
    let computedSubtotal = 0;
    enrichedData.items = enrichedData.items.map((item: any) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const total = qty * price;
      computedSubtotal += total;

      return {
        ...item,
        total,
        // pre-formatted values for templates to use directly
        _formattedUnitPrice: formatCurrency(price),
        _formattedTotal: formatCurrency(total),
        _formattedQuantity: formatNumber(qty)
      };
    });

    if (enrichedData.subtotal === undefined) {
      enrichedData.subtotal = computedSubtotal;
    }

    const taxRate = Number(enrichedData.taxRate) || 0;
    if (enrichedData.taxAmount === undefined) {
      enrichedData.taxAmount = computedSubtotal * (taxRate / 100);
    }

    if (enrichedData.totalDue === undefined) {
      enrichedData.totalDue = computedSubtotal + (Number(enrichedData.taxAmount) || 0);
    }
  }

  // Auto-format numerical variables in the data payload
  const currencyKeys = ['subtotal', 'taxAmount', 'totalDue', 'amountPaid', 'balanceDue', 'salary', 'compensation', 'price'];
  currencyKeys.forEach(k => {
    if (enrichedData[k] !== undefined && typeof enrichedData[k] === 'number') {
      enrichedData[`_raw_${k}`] = enrichedData[k];
      enrichedData[k] = formatCurrency(enrichedData[k]);
    }
  });

  const dateKeys = ['invoiceDate', 'dueDate', 'date', 'startDate', 'endDate', 'createdDate'];
  dateKeys.forEach(k => {
    if (enrichedData[k] !== undefined && (typeof enrichedData[k] === 'string' || typeof enrichedData[k] === 'number' || enrichedData[k] instanceof Date)) {
      enrichedData[`_raw_${k}`] = enrichedData[k];
      enrichedData[k] = formatDate(enrichedData[k]);
    }
  });

  // 2. Prepare Context (includes template fields like themeColor)
  const templateContext = {
    themeColor: template.themeColor,
    pageSize: template.pageSize || 'A4',
    orientation: template.orientation || 'portrait'
  };

  // 3. Compile Pages and Sections
  const pages: GeneratedPage[] = template.pages.map((page, pageIdx) => {
    const sections: CompiledSection[] = page.sections.map(sec => {
      const compiled: CompiledSection = {
        type: sec.type,
        className: sec.className,
        style: sec.style
      };

      if (sec.type === 'content' || sec.type === 'footer') {
        compiled.content = interpolateString(sec.content || '', enrichedData, templateContext);
      } else if (sec.type === 'divider') {
        // Divider has no dynamic text
      } else if (sec.type === 'columns' && sec.columns) {
        compiled.columns = sec.columns.map(col => ({
          width: col.width,
          content: interpolateString(col.content, enrichedData, templateContext)
        }));
      } else if (sec.type === 'table' && sec.tableConfig) {
        const tConf = sec.tableConfig;
        const rawRows = getNestedValue(enrichedData, tConf.dataKey);
        const rowsArray = Array.isArray(rawRows) ? rawRows : [];

        const headers = tConf.columns.map(c => c.label);
        const alignments = tConf.columns.map(c => c.align || 'left');

        const rows = rowsArray.map((rowItem: any) => {
          return tConf.columns.map(c => {
            const val = getNestedValue(rowItem, c.key);
            if (val === '') return '';

            // Format based on config
            if (c.format === 'currency' && typeof val === 'number') {
              return formatCurrency(val);
            }
            if (c.format === 'number' && typeof val === 'number') {
              return formatNumber(val);
            }
            if (c.format === 'date' && (typeof val === 'string' || typeof val === 'number' || val instanceof Date)) {
              return formatDate(val);
            }

            // Fallback: check formatted properties if computed
            if (c.key === 'unitPrice' && rowItem._formattedUnitPrice) return rowItem._formattedUnitPrice;
            if (c.key === 'total' && rowItem._formattedTotal) return rowItem._formattedTotal;
            if (c.key === 'quantity' && rowItem._formattedQuantity) return rowItem._formattedQuantity;

            return String(val);
          });
        });

        compiled.tableData = {
          headers,
          rows,
          alignments
        };
      }

      return compiled;
    });

    return {
      pageNumber: pageIdx + 1,
      sections
    };
  });

  return {
    templateId: template.id,
    name: template.name,
    pageSize: template.pageSize || 'A4',
    orientation: template.orientation || 'portrait',
    themeColor: template.themeColor,
    pages
  };
}
