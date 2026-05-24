import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { Template } from './types';

export interface GeneratedDocumentRef {
  /** Prints the document beautifully and displays the browser save dialogue for saving as a vector PDF */
  print: () => void;
  /** Copies a stripped, formatted text-only representation of the document to the clipboard */
  copyText: () => Promise<void>;
}

export interface GeneratedDocumentProps {
  /** The document template configuration containing layout, options, titles and HTML structure */
  template: Template;
  /** Key-value pairs for variables/placeholders present in the template (e.g. { employeeName: 'John Doe' }) */
  data: Record<string, string>;
  /** Optional custom CSS classes for the outer container */
  className?: string;
  /** Optional custom filename for printing/saving */
  pdfTitle?: string;
}

export const GeneratedDocument = forwardRef<GeneratedDocumentRef, GeneratedDocumentProps>(({
  template,
  data = {},
  className = '',
  pdfTitle,
}, ref) => {
  const [currentDate, setCurrentDate] = useState('');

  // Set default localized date in case it's not provided in the props
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(today);
  }, []);

  const getMergedData = (): Record<string, string> => {
    return {
      date: currentDate,
      ...data,
    };
  };

  const mergedData = getMergedData();

  // Triggers browser print, prompting user with system Save/Print PDF dialog
  const handlePrint = () => {
    const title = pdfTitle || template.name || 'Generated Document';
    const originalTitle = document.title;
    document.title = title;

    const printStyles = document.createElement('style');
    printStyles.id = 'print-doc-standalone-styles';
    printStyles.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #standalone-printable-card, #standalone-printable-card * {
          visibility: visible !important;
        }
        #standalone-printable-card {
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
      const el = document.getElementById('print-doc-standalone-styles');
      if (el) el.remove();
      document.title = originalTitle;
    }, 1000);
  };

  // Plain-text representation copier
  const handleCopyText = async () => {
    try {
      const tempElement = document.createElement('div');
      const company = replace(template.headerOptions?.companyName);
      const subTitle = replace(template.letterTitle);
      const to = replace(template.toAddress);
      const re = replace(template.reLine);
      const sub = replace(template.subjectLine);
      const body = replace(template.contentHtml);
      const signatureName = replace(template.signatureOptions?.signerName);
      const signatureTitle = replace(template.signatureOptions?.title);

      tempElement.innerHTML = `
        ${company ? company + '\n' : ''}
        ${subTitle ? '\n' + subTitle + '\n' : ''}
        ${to ? '\n' + to + '\n' : ''}
        ${re ? re + '\n' : ''}
        ${sub ? sub + '\n' : ''}
        ${body}
        ${signatureName ? '\n\n' + signatureName : ''}
        ${signatureTitle ? signatureTitle : ''}
      `;

      const plainText = tempElement.innerText || tempElement.textContent || '';
      await navigator.clipboard.writeText(plainText.trim());
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  useImperativeHandle(ref, () => ({
    print: handlePrint,
    copyText: handleCopyText,
  }));

  // Robust substitution logic replacing all standard double curly braces template variables
  const replace = (text: string | undefined): string => {
    if (!text) return '';
    return text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
      return mergedData[key] !== undefined && mergedData[key] !== '' ? mergedData[key] : `{{${key}}}`;
    });
  };

  const showHeader = !!template.headerOptions?.companyName;
  const showDateOnly = !!(template.headerOptions?.includeDate && !showHeader);
  const compiledBodyHtml = replace(template.contentHtml);

  return (
    <div className={`flex flex-col items-center w-full min-h-0 bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm ${className}`}>
      {/* Dynamic Font Styling Declarations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;800&display=swap');

        .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif; }
        .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
        .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
        
        /* A4 Page Dimensions Scaling on smaller viewports */
        .a4-viewport-container {
          width: 100%;
          max-width: 794px;
          overflow-x: auto;
        }
        @media (max-width: 840px) {
          .a4-viewport-container {
            zoom: 0.9;
          }
        }
        @media (max-width: 640px) {
          .a4-viewport-container {
            zoom: 0.75;
          }
        }
        @media (max-width: 480px) {
          .a4-viewport-container {
            zoom: 0.6;
          }
        }
      `}</style>

      {/* 2. PRINTABLE A4 HIGH FIDELITY CONTAINER */}
      <div className="a4-viewport-container flex justify-center w-full">
        <div
          id="standalone-printable-card"
          className="w-[794px] min-h-[1122px] bg-white shadow-xl dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 p-12 relative flex flex-col justify-between transition-all"
        >

          <div className="flex-1 flex flex-col pt-4">
            {/* Header Block Section */}
            {showHeader && (
              <div className="grid grid-cols-2 gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex flex-col items-start justify-center">
                  <div className="flex items-center space-x-2.5">
                    {template.headerOptions?.logoUrl && (
                      <img
                        src={template.headerOptions.logoUrl}
                        alt="Logo"
                        className="w-16 h-16 object-contain rounded bg-slate-50 dark:bg-slate-950 p-1 border border-slate-100 dark:border-slate-800"
                      />
                    )}
                    <div className="flex flex-col">
                      <h2
                        className="text-sm font-extrabold tracking-wide uppercase text-slate-850 dark:text-white"
                        dangerouslySetInnerHTML={{ __html: replace(template.headerOptions.companyName) }}
                      />
                      {template.headerOptions.subheading && (
                        <p
                          className="text-[10px] text-slate-500 font-bold dark:text-slate-400"
                          dangerouslySetInnerHTML={{ __html: replace(template.headerOptions.subheading) }}
                        />
                      )}
                    </div>
                  </div>
                  {template.headerOptions.includeDate && (
                    <p
                      className="text-xs text-slate-500 mt-3 font-semibold dark:text-slate-400"
                      dangerouslySetInnerHTML={{ __html: replace('{{date}}') }}
                    />
                  )}
                </div>
                {template.headerOptions.includeContactInfo && (
                  <div
                    className="text-right text-[10px] leading-relaxed text-slate-450 dark:text-slate-500 flex flex-col justify-center font-medium"
                    dangerouslySetInnerHTML={{
                      __html: `
                        <p class="font-bold text-slate-650 dark:text-slate-400">Company Information</p>
                        ${template.headerOptions.address ? `<p>${replace(template.headerOptions.address)}</p>` : ''}
                        ${template.headerOptions.phone ? `<p>Phone: ${replace(template.headerOptions.phone)}</p>` : ''}
                        ${template.headerOptions.website ? `<p>Web: ${replace(template.headerOptions.website)}</p>` : ''}
                      `
                    }}
                  />
                )}
              </div>
            )}

            {showDateOnly && (
              <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <p
                  className="text-xs text-slate-500 font-semibold dark:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: replace('{{date}}') }}
                />
              </div>
            )}

            {/* Letter Layout Structures */}
            <div className="space-y-4 mb-5 pb-5 border-b border-dashed border-slate-200 dark:border-slate-800">
              {template.letterTitle && (
                <div
                  className="text-center font-extrabold tracking-wider uppercase text-slate-850 dark:text-slate-100"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}
                  dangerouslySetInnerHTML={{ __html: replace(template.letterTitle) }}
                />
              )}
              {template.toAddress && (
                <div
                  className="text-left text-sm text-slate-700 dark:text-slate-350 whitespace-pre-line leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: replace(template.toAddress) }}
                />
              )}
              {template.reLine && (
                <div
                  className="text-left text-sm text-slate-800 dark:text-slate-200 font-bold"
                  dangerouslySetInnerHTML={{ __html: replace(template.reLine) }}
                />
              )}
              {template.subjectLine && (
                <div
                  className="text-left text-sm text-slate-750 dark:text-slate-300 font-medium whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: replace(template.subjectLine) }}
                />
              )}
            </div>

            {/* Compiled HTML Document Rich Content */}
            <div className="flex-grow">
              {compiledBodyHtml ? (
                <div
                  className="prose max-w-none text-slate-700 leading-relaxed text-sm dark:text-slate-300 ql-editor"
                  style={{ fontSize: '14px', lineHeight: '1.625' }}
                  dangerouslySetInnerHTML={{ __html: compiledBodyHtml }}
                />
              ) : (
                <div className="flex items-center justify-center min-h-[250px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-sm italic text-slate-400 dark:text-slate-650">No document content loaded.</p>
                </div>
              )}
            </div>

            {/* Signature Section */}
            {template.signatureOptions?.includeSignature && (
              <div className="mt-8 flex flex-col items-start space-y-1 page-break-inside-avoid">
                <div className="h-10 flex items-end">
                  <span
                    className={`font-semibold ${template.signatureOptions.signatureStyle === 'handwritten'
                      ? 'text-slate-800 dark:text-slate-200 text-3xl pb-1'
                      : template.signatureOptions.signatureStyle === 'classic'
                        ? 'text-slate-900 dark:text-slate-200 border-b border-slate-350 dark:border-slate-700 italic pb-0.5 text-xl'
                        : 'font-mono text-sm text-slate-500'
                      }`}
                    style={template.signatureOptions.signatureStyle === 'handwritten' ? { fontFamily: "'Caveat', cursive" } : {}}
                    dangerouslySetInnerHTML={{
                      __html: template.signatureOptions.signatureStyle === 'typed'
                        ? `/s/ ${replace(template.signatureOptions.signerName)}`
                        : replace(template.signatureOptions.signerName)
                    }}
                  />
                </div>
                <p
                  className="text-xs font-bold text-slate-755 dark:text-slate-250"
                  dangerouslySetInnerHTML={{ __html: replace(template.signatureOptions.signerName) }}
                />
                <p
                  className="text-[10px] text-slate-400 dark:text-slate-550"
                  dangerouslySetInnerHTML={{ __html: replace(template.signatureOptions.title) }}
                />
              </div>
            )}
          </div>

          {/* Footer Section */}
          {template.footerOptions?.includeFooter && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-6 h-[44px] flex justify-between items-center text-[10px] text-slate-400 tracking-wider">
              <div>
                {template.footerOptions.includeDocumentName && (
                  <span
                    className="font-semibold text-slate-500 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: replace(template.footerOptions.documentName || template.name) }}
                  />
                )}
                {template.footerOptions.includeVersionNumber && template.footerOptions.version && (
                  <span className="ml-2.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-800">
                    v{template.footerOptions.version}
                  </span>
                )}
              </div>
              {template.footerOptions.includePageNumber && (
                <span className="font-semibold">Page 1 of 1</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default GeneratedDocument;
