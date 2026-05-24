import React, { useState, useEffect } from 'react';
import { useTemplateEditor } from '../context';
import { getPlaceholderLabel } from '../utils';
import { Printer, RefreshCw, FileText, Sparkles } from 'lucide-react';

export const PreviewPanel: React.FC = () => {
  const {
    placeholders,
    customVariables,
    headerOptions,
    footerOptions,
    signatureOptions,
    contentHtml,
    letterTitle,
    toAddress,
    reLine,
    subjectLine
  } = useTemplateEditor();

  const [highlightVariables, setHighlightVariables] = useState(true);

  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return {
      employeeName: 'Rahul Sharma',
      designation: 'Software Engineer',
      salary: '₹6,50,000 per annum',
      joiningDate: '10 June 2026',
      department: 'Engineering',
      date: today,
      companyName: 'ABC Technologies Pvt. Ltd.',
      signature: 'Human Resources Team',
      workLocation: 'Hyderabad',
      employmentType: 'Full-Time',
      address: 'Flat No. 302, Green Residency\nMadhapur, Hyderabad – 500081',
    };
  });

  // Initialize placeholder default values when they change or open
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const defaults: Record<string, string> = {
      employeeName: 'Rahul Sharma',
      designation: 'Software Engineer',
      salary: '₹6,50,000 per annum',
      joiningDate: '10 June 2026',
      department: 'Engineering',
      date: today,
      companyName: 'ABC Technologies Pvt. Ltd.',
      signature: 'Human Resources Team',
      workLocation: 'Hyderabad',
      employmentType: 'Full-Time',
      address: 'Flat No. 302, Green Residency\nMadhapur, Hyderabad – 500081',
    };

    const hasNew = placeholders.some((ph) => formValues[ph] === undefined);
    if (hasNew) {
      setFormValues((prev) => {
        const next = { ...prev };
        placeholders.forEach((ph) => {
          if (next[ph] === undefined) {
            next[ph] = defaults[ph] || '';
          }
        });
        return next;
      });
    }
  }, [placeholders]);

  const handleInputChange = (key: string, val: string) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetForm = () => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const defaults: Record<string, string> = {
      employeeName: 'Rahul Sharma',
      designation: 'Software Engineer',
      salary: '₹6,50,000 per annum',
      joiningDate: '10 June 2026',
      department: 'Engineering',
      date: today,
      companyName: 'ABC Technologies Pvt. Ltd.',
      signature: 'Human Resources Team',
      workLocation: 'Hyderabad',
      employmentType: 'Full-Time',
      address: 'Flat No. 302, Green Residency\nMadhapur, Hyderabad – 500081',
    };

    const initialValues: Record<string, string> = {};
    placeholders.forEach((ph) => {
      initialValues[ph] = defaults[ph] || '';
    });
    setFormValues(initialValues);
  };

  const triggerBrowserPrint = () => {
    const printStyles = document.createElement('style');
    printStyles.id = 'print-doc-styles';
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-preview-card, #printable-preview-card * {
          visibility: visible !important;
        }
        #printable-preview-card {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          border: none !important;
          background: white !important;
        }
      }
    `;
    document.head.appendChild(printStyles);
    window.print();
    setTimeout(() => {
      const el = document.getElementById('print-doc-styles');
      if (el) el.remove();
    }, 1000);
  };

  // Dynamic variable placeholder replaces
  const replace = (t: string) => {
    if (!t) return '';
    return t.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
      const val = formValues[key] !== undefined && formValues[key] !== '' ? formValues[key] : `{{${key}}}`;
      if (highlightVariables && formValues[key] !== undefined && formValues[key] !== '') {
        return `<span class="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 px-1.5 py-0.5 rounded font-bold transition-all">${val}</span>`;
      }
      return val;
    });
  };

  const renderCompiledDocument = () => {
    const showHeader = !!headerOptions.includeSeal;
    const showDateOnly = !!(headerOptions.includeDate && !showHeader);

    const compiledBodyHtml = replace(contentHtml);

    return (
      <div className="flex-1 flex flex-col justify-between h-full">
        <div>
          {/* HEADER (Page 1) */}
          {showHeader && (
            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center space-x-2">
                  {headerOptions.includeSeal && headerOptions.logoUrl && (
                    <img
                      src={headerOptions.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 object-contain rounded bg-slate-50 dark:bg-slate-950 p-1 border border-slate-100 dark:border-slate-800"
                    />
                  )}
                  <div className="flex flex-col">
                    <h2
                      className="text-sm font-extrabold tracking-wide uppercase text-slate-800 dark:text-white"
                      dangerouslySetInnerHTML={{ __html: replace(headerOptions.companyName) }}
                    />
                    <p className="text-[10px] text-indigo-500 font-bold dark:text-indigo-400">
                      {headerOptions.subheading || 'Official Document Header'}
                    </p>
                  </div>
                </div>
                {headerOptions.includeDate && (
                  <p className="text-xs text-slate-500 mt-3 font-semibold dark:text-slate-400">
                    {replace('{{date}}')}
                  </p>
                )}
              </div>
              {headerOptions.includeContactInfo && (
                <div
                  className="text-right text-[10px] leading-relaxed text-slate-400 dark:text-slate-500 flex flex-col justify-center"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <p>${replace(headerOptions.address)}</p>
                      <p>${replace(headerOptions.phone)}</p>
                      <p>${replace(headerOptions.website)}</p>
                    `
                  }}
                />
              )}
            </div>
          )}

          {showDateOnly && (
            <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <p className="text-xs text-slate-500 font-semibold dark:text-slate-400">{replace('{{date}}')}</p>
            </div>
          )}

          {/* LETTER STRUCTURES */}
          <div className="space-y-4 mb-4 select-none border-b border-dashed border-slate-150 dark:border-slate-800 pb-4">
            {/* Letter Title */}
            {letterTitle && (
              <div
                className="text-center font-bold tracking-wide uppercase text-slate-800 dark:text-slate-100"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}
                dangerouslySetInnerHTML={{ __html: replace(letterTitle) }}
              />
            )}
            {/* To Address */}
            {toAddress && (
              <div
                className="text-left text-sm text-slate-700 dark:text-slate-350 whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{ __html: replace(toAddress) }}
              />
            )}
            {/* Re Line */}
            {reLine && (
              <div
                className="text-left text-sm text-slate-700 dark:text-slate-300 font-medium"
                dangerouslySetInnerHTML={{ __html: replace(reLine) }}
              />
            )}
            {/* Subject Line */}
            {subjectLine && (
              <div
                className="text-left text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: replace(subjectLine) }}
              />
            )}
          </div>

          {/* DOCUMENT BODY */}
          <div
            className="prose max-w-none text-slate-700 leading-relaxed text-sm dark:text-slate-300 ql-editor"
            style={{ fontSize: '14px', lineHeight: '1.6' }}
            dangerouslySetInnerHTML={{ __html: compiledBodyHtml }}
          />

          {/* SIGNATURE */}
          {signatureOptions.includeSignature && (
            <div className="mt-8 flex flex-col items-start space-y-1">
              <div className="h-10 flex items-end">
                <span
                  className={`font-semibold ${signatureOptions.signatureStyle === 'handwritten'
                    ? 'text-blue-600 dark:text-blue-400 text-3xl pb-1'
                    : signatureOptions.signatureStyle === 'classic'
                      ? 'text-slate-900 dark:text-slate-200 border-b border-slate-350 dark:border-slate-700 italic pb-0.5 text-xl'
                      : 'font-mono text-sm text-slate-500'
                    }`}
                  style={signatureOptions.signatureStyle === 'handwritten' ? { fontFamily: "'Caveat', cursive" } : {}}
                >
                  {signatureOptions.signatureStyle === 'typed'
                    ? `/s/ ${replace(signatureOptions.signerName)}`
                    : replace(signatureOptions.signerName)}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {replace(signatureOptions.signerName)}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-550">
                {replace(signatureOptions.title)}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {footerOptions.includeFooter && (
          <div
            className="border-t border-slate-200 dark:border-slate-800 pt-3 h-[44px] flex justify-between items-center text-[10px] text-slate-400"
          >
            <div>
              {footerOptions.includeDocumentName && (
                <span>{replace(footerOptions.documentName || '') || 'Orbit Document'}</span>
              )}
              {footerOptions.includeVersionNumber && footerOptions.version && (
                <span className="ml-2 font-medium">v{footerOptions.version}</span>
              )}
            </div>
            {footerOptions.includePageNumber && (
              <span>Page 1 of 1</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row h-full min-h-0 bg-slate-50 dark:bg-slate-950">
      <style>{`
        /* Dynamic compiled fonts */
        .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif; }
        .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
        .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
      `}</style>

      {/* 1. LEFT SIDE: Dynamic Forms */}
      <div className="w-full md:w-[320px] bg-white border-r border-slate-200 p-5 dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full overflow-y-auto no-scrollbar">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250">REPLACE PLACEHOLDERS</h4>
            <p className="text-[10px] text-slate-500 mt-0.5 dark:text-slate-400">Fill variable fields to see live values.</p>
          </div>
          <button
            onClick={handleResetForm}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            title="Reload Presets"
          >
            <RefreshCw size={10} />
            <span>Defaults</span>
          </button>
        </div>

        {placeholders.length > 0 ? (
          <div className="flex-grow space-y-4 py-4 overflow-y-auto no-scrollbar">
            {placeholders.map((key) => {
              const customVar = customVariables?.find((v) => v.key === key);
              const label = customVar ? customVar.label : getPlaceholderLabel(key);

              if (customVar?.type === 'dropdown' && customVar.options) {
                return (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase dark:text-slate-450 tracking-wider">
                      {label}
                    </label>
                    <select
                      value={formValues[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none hover:border-slate-355 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:bg-slate-950 transition-colors cursor-pointer"
                    >
                      <option value="">-- Select {label} --</option>
                      {customVar.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (customVar?.type === 'date') {
                return (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase dark:text-slate-455 tracking-wider">
                      {label}
                    </label>
                    <input
                      type="date"
                      value={formValues[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none hover:border-slate-355 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:bg-slate-950 transition-colors"
                    />
                  </div>
                );
              }

              if (customVar?.type === 'number') {
                return (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase dark:text-slate-455 tracking-wider">
                      {label}
                    </label>
                    <input
                      type="number"
                      value={formValues[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none hover:border-slate-355 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:bg-slate-950 transition-colors"
                      placeholder={`Enter numeric ${label}`}
                    />
                  </div>
                );
              }

              return (
                <div key={key} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-455 uppercase dark:text-slate-455 tracking-wider">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={formValues[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none hover:border-slate-355 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:bg-slate-950 transition-colors"
                    placeholder={`Enter ${label}`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="flex flex-col items-center space-y-2.5 p-4 rounded-xl border border-dashed border-slate-250 bg-slate-50/40 dark:border-slate-800/80 dark:bg-slate-950/20">
              <FileText size={24} className="text-slate-400 dark:text-slate-650" />
              <span className="text-[10px] leading-normal text-slate-500 dark:text-slate-400 italic">
                No variables detected. Add placeholders like {"{{employeeName}}"} in your paginated sheet content.
              </span>
            </div>
          </div>
        )}

        {/* Highlight & Print Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-450 cursor-pointer select-none">
            <span>Highlight Variables</span>
            <input
              type="checkbox"
              checked={highlightVariables}
              onChange={() => setHighlightVariables(!highlightVariables)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
          </label>

          <button
            onClick={triggerBrowserPrint}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all"
          >
            <Printer size={13} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Printable A4 Live Document Preview */}
      <div className="flex-grow overflow-y-auto bg-slate-100 p-8 dark:bg-slate-950/40 flex justify-center items-start min-h-0">
        <div
          id="printable-preview-card"
          className="w-[794px] min-h-[1122px] bg-white shadow-xl dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-12 relative flex flex-col justify-between transition-all"
        >
          {/* Header watermark */}
          <div className="absolute top-4 left-4 text-[9px] font-bold text-slate-350 dark:text-slate-700 tracking-wider uppercase select-none pointer-events-none print:hidden flex items-center space-x-1">
            <Sparkles size={10} className="text-indigo-400" />
            <span>High-Fidelity Preview Mode</span>
          </div>

          <div className="flex-1 flex flex-col pt-4">
            {contentHtml ? (
              renderCompiledDocument()
            ) : (
              <div className="flex-grow flex items-center justify-center min-h-[500px]">
                <p className="text-sm italic text-slate-400">Write in the document template editor to see dynamic outputs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PreviewPanel;
