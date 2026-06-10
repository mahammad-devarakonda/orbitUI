import React from 'react';
import type { DocumentTemplate } from './types';
import { getNestedValue, formatCurrency, formatNumber, formatDate } from './generateDocument';

interface TemplatePreviewProps {
  template: DocumentTemplate;
  sampleData: Record<string, any>;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  sampleData,
  className = ''
}) => {
  // Enrich data for interpolation (e.g. math for items)
  const enrichedData = { ...sampleData };
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
        _formattedUnitPrice: formatCurrency(price),
        _formattedTotal: formatCurrency(total),
        _formattedQuantity: formatNumber(qty)
      };
    });

    if (enrichedData.subtotal === undefined) enrichedData.subtotal = computedSubtotal;
    const taxRate = Number(enrichedData.taxRate) || 0;
    if (enrichedData.taxAmount === undefined) enrichedData.taxAmount = computedSubtotal * (taxRate / 100);
    if (enrichedData.totalDue === undefined) enrichedData.totalDue = computedSubtotal + (Number(enrichedData.taxAmount) || 0);
  }

  // Currency auto-formatting
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

  // Highlight placeholders in strings
  const highlightInterpolation = (text: string): string => {
    if (!text) return '';
    let result = '';
    let lastIndex = 0;
    const regex = /\{\{([^}]+)\}\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      const key = match[1];
      const trimmed = key.trim();

      // Check if we are inside a tag attribute/property (between '<' and '>')
      const beforeText = text.substring(0, matchIndex);
      const lastLessThan = beforeText.lastIndexOf('<');
      const lastGreaterThan = beforeText.lastIndexOf('>');
      const isInsideTag = lastLessThan > lastGreaterThan;

      let val = getNestedValue(enrichedData, trimmed);
      if (val === '' && template) {
        if (trimmed === 'themeColor') val = template.themeColor;
        if (trimmed === 'pageSize') val = template.pageSize || 'A4';
        if (trimmed === 'orientation') val = template.orientation || 'portrait';
      }

      const isEmpty = val === undefined || val === null || val === '';
      const resolvedVal = !isEmpty ? String(val) : trimmed;

      let replacement = '';
      if (isInsideTag) {
        // Return raw variable value to not break style or tag attributes
        replacement = resolvedVal;
      } else {
        if (!isEmpty) {
          replacement = `<span class="inline-block border-b-2 px-1 rounded-sm font-semibold cursor-help relative group" style="border-color: ${template.themeColor}; background-color: ${template.themeColor}12; color: ${template.themeColor}" title="Mapped: ${trimmed}">${resolvedVal}</span>`;
        } else {
          replacement = `<span class="inline-block border border-dashed border-rose-400 bg-rose-50/80 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 px-1.5 rounded-sm font-mono text-xs cursor-help font-semibold" title="Empty variable: ${trimmed}">${trimmed}</span>`;
        }
      }

      result += text.substring(lastIndex, matchIndex) + replacement;
      lastIndex = regex.lastIndex;
    }
    result += text.substring(lastIndex);
    return result;
  };

  const isPortrait = (template.orientation || 'portrait') === 'portrait';
  const pageAspectClass = isPortrait ? 'aspect-[1/1.414]' : 'aspect-[1.414/1]';

  return (
    <div className={`flex flex-col items-center gap-8 py-6 w-full ${className}`}>
      {/* Visual Helper Banner */}
      <div className="w-full max-w-4xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div 
            className="h-9 w-9 rounded-lg text-white flex items-center justify-center font-bold shadow-md"
            style={{ backgroundColor: template.themeColor }}
          >
            T
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Template Layout Preview</h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Interactive structural map. Mapped data is highlighted in <span className="font-bold" style={{ color: template.themeColor }}>Theme Color</span>. Unresolved variables highlight in <span className="text-rose-500 font-bold">Red</span>.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-650 dark:text-zinc-350">
            {template.pageSize || 'A4'}
          </span>
          <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-650 dark:text-zinc-350 capitalize">
            {template.orientation || 'portrait'}
          </span>
        </div>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col gap-10 w-full items-center">
        {template.pages.map((page, idx) => (
          <div
            key={idx}
            className={`w-full max-w-[800px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-8 relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${pageAspectClass}`}
          >
            {/* Watermark Page Number Indicator */}
            <div className="absolute top-2 right-4 text-[10px] font-bold text-zinc-350 dark:text-zinc-650 pointer-events-none select-none uppercase tracking-widest">
              Template Layout Map &bull; Page {idx + 1}
            </div>

            {/* Sections Flow */}
            <div className="flex-grow flex flex-col gap-6">
              {page.sections.map((sec, secIdx) => {
                // Compile content
                if (sec.type === 'content') {
                  const html = highlightInterpolation(sec.content || '');
                  return (
                    <div
                      key={secIdx}
                      className={`text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs ${sec.className || ''}`}
                      style={sec.style}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }

                if (sec.type === 'divider') {
                  return (
                    <hr
                      key={secIdx}
                      className={`border-zinc-200 dark:border-zinc-800 ${sec.className || 'my-2'}`}
                      style={sec.style}
                    />
                  );
                }

                if (sec.type === 'columns' && sec.columns) {
                  return (
                    <div
                      key={secIdx}
                      className={`flex gap-6 w-full ${sec.className || ''}`}
                      style={sec.style}
                    >
                      {sec.columns.map((col, colIdx) => {
                        const html = highlightInterpolation(col.content);
                        return (
                          <div
                            key={colIdx}
                            className="flex-1 min-w-0"
                            style={{ width: col.width }}
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        );
                      })}
                    </div>
                  );
                }

                if (sec.type === 'table' && sec.tableConfig) {
                  const tConf = sec.tableConfig;
                  const itemsList = getNestedValue(enrichedData, tConf.dataKey) || [];
                  const resolvedItems = Array.isArray(itemsList) ? itemsList : [];

                  return (
                    <div
                      key={secIdx}
                      className={`border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm ${sec.className || ''}`}
                      style={sec.style}
                    >
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr
                            className="text-white font-semibold text-[10px] uppercase tracking-wider"
                            style={{ backgroundColor: template.themeColor }}
                          >
                            {tConf.columns.map((col, cIdx) => (
                              <th
                                key={cIdx}
                                className={`px-4 py-2 text-${col.align || 'left'}`}
                              >
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {resolvedItems.length === 0 ? (
                            <tr>
                              <td
                                colSpan={tConf.columns.length}
                                className="px-4 py-6 text-center text-zinc-400 dark:text-zinc-500 italic bg-zinc-50/50 dark:bg-zinc-850/50"
                              >
                                Mapped table rows list ({tConf.dataKey}) is empty. Add items in data editor to populate.
                              </td>
                            </tr>
                          ) : (
                            resolvedItems.map((item: any, rowIdx: number) => (
                              <tr
                                key={rowIdx}
                                className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                              >
                                {tConf.columns.map((col, cIdx) => {
                                  const rawVal = getNestedValue(item, col.key);
                                  
                                  // Highlighted format values
                                  let finalHtml = '';
                                  if (col.format === 'currency' && typeof rawVal === 'number') {
                                    finalHtml = highlightInterpolation(`{{items.${rowIdx}.${col.key}}}`);
                                  } else if (col.format === 'number' && typeof rawVal === 'number') {
                                    finalHtml = highlightInterpolation(`{{items.${rowIdx}.${col.key}}}`);
                                  } else if (col.format === 'date' && rawVal) {
                                    finalHtml = highlightInterpolation(`{{items.${rowIdx}.${col.key}}}`);
                                  } else {
                                    // Raw string placeholder or pre-formatted field
                                    const pathName = `items.${rowIdx}.${col.key}`;
                                    finalHtml = highlightInterpolation(`{{${pathName}}}`);
                                  }

                                  return (
                                    <td
                                      key={cIdx}
                                      className={`px-4 py-2.5 text-${col.align || 'left'} font-mono text-[11px] text-zinc-650 dark:text-zinc-350`}
                                      dangerouslySetInnerHTML={{ __html: finalHtml }}
                                    />
                                  );
                                })}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                if (sec.type === 'footer') {
                  const html = highlightInterpolation(sec.content || '');
                  return (
                    <div
                      key={secIdx}
                      className={`text-zinc-500 dark:text-zinc-400 text-[10px] ${sec.className || 'mt-auto'}`}
                      style={sec.style}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
