import React, { useState, useEffect, useRef } from 'react';
import { 
  Sidebar, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FileText
} from 'lucide-react';
import type { GeneratedDocument, CompiledSection } from './types';

interface DocumentViewerProps {
  documentData: GeneratedDocument;
  className?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentData,
  className = ''
}) => {
  // Viewer States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100); // percentage
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('1');

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalPages = documentData.pages.length;
  const isPortrait = documentData.orientation === 'portrait';
  
  // Aspect ratio coordinates
  const PAGE_WIDTH = 794; // approx A4 width in pixels at 96 DPI
  const PAGE_HEIGHT = 1123; // approx A4 height

  // Update page input text on page change
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Monitor fullscreen states (e.g. exit fullscreen via Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    window.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => window.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Monitor scroll in continuous mode to update page index
  useEffect(() => {
    if (viewMode !== 'continuous') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleScroll = () => {
      const scrollPosition = canvas.scrollTop + canvas.clientHeight / 2;
      let activePage = 1;

      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageEl = pageRefs.current[i];
        if (pageEl) {
          const top = pageEl.offsetTop;
          const bottom = top + pageEl.clientHeight;
          if (scrollPosition >= top && scrollPosition <= bottom) {
            activePage = i + 1;
            break;
          }
        }
      }

      if (activePage !== currentPage && activePage >= 1 && activePage <= totalPages) {
        setCurrentPage(activePage);
      }
    };

    canvas.addEventListener('scroll', handleScroll);
    return () => canvas.removeEventListener('scroll', handleScroll);
  }, [viewMode, currentPage, totalPages]);

  // Handle keypress page numbers
  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      navigateToPage(pageNum);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);

    if (viewMode === 'continuous') {
      const pageEl = pageRefs.current[pageNumber - 1];
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Zoom Operations
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);

  const handleFitWidth = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const padding = 48; // spacing around document
    const canvasWidth = canvas.clientWidth - padding;
    const scale = (canvasWidth / PAGE_WIDTH) * 100;
    setZoom(Math.round(scale));
  };

  const handleFitPage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const padding = 48;
    const canvasHeight = canvas.clientHeight - padding;
    const scale = (canvasHeight / PAGE_HEIGHT) * 100;
    setZoom(Math.round(scale));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Render Compiled Page HTML
  const renderSectionContent = (sec: CompiledSection) => {
    if (sec.type === 'content' && sec.content) {
      return (
        <div 
          className={`text-zinc-700 dark:text-zinc-350 text-xs leading-relaxed ${sec.className || ''}`}
          style={sec.style}
          dangerouslySetInnerHTML={{ __html: sec.content }}
        />
      );
    }

    if (sec.type === 'divider') {
      return (
        <hr 
          className={`border-zinc-200 dark:border-zinc-800 ${sec.className || 'my-4'}`}
          style={sec.style}
        />
      );
    }

    if (sec.type === 'columns' && sec.columns) {
      return (
        <div 
          className={`flex gap-6 w-full ${sec.className || ''}`}
          style={sec.style}
        >
          {sec.columns.map((col, idx) => (
            <div 
              key={idx} 
              className="flex-1 min-w-0"
              style={{ width: col.width }}
              dangerouslySetInnerHTML={{ __html: col.content }}
            />
          ))}
        </div>
      );
    }

    if (sec.type === 'table' && sec.tableData) {
      const { headers, rows, alignments } = sec.tableData;
      return (
        <div 
          className={`border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm ${sec.className || ''}`}
          style={sec.style}
        >
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr 
                className="text-white font-semibold text-[10px] uppercase tracking-wider"
                style={{ backgroundColor: documentData.themeColor }}
              >
                {headers.map((h, idx) => (
                  <th key={idx} className={`px-4 py-2.5 text-${alignments[idx] || 'left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                >
                  {row.map((cell, cIdx) => (
                    <td 
                      key={cIdx} 
                      className={`px-4 py-2.5 text-${alignments[cIdx] || 'left'} text-zinc-650 dark:text-zinc-350`}
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (sec.type === 'footer' && sec.content) {
      return (
        <div 
          className={`text-zinc-500 dark:text-zinc-400 text-[10px] ${sec.className || 'mt-auto'}`}
          style={sec.style}
          dangerouslySetInnerHTML={{ __html: sec.content }}
        />
      );
    }

    return null;
  };

  // Printable Content Compilation & System Print
  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Grab all stylesheet styles
    let stylesHtml = '';
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => {
      stylesHtml += el.outerHTML;
    });

    const bodyHtml = documentData.pages.map(p => {
      const pageSectionsHtml = p.sections.map(sec => {
        if (sec.type === 'content' && sec.content) {
          return `<div class="text-zinc-700 text-xs leading-relaxed ${sec.className || ''}" style="${sec.style ? Object.entries(sec.style).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(';') : ''}">${sec.content}</div>`;
        }
        if (sec.type === 'divider') {
          return `<hr class="border-zinc-200 ${sec.className || 'my-4'}" />`;
        }
        if (sec.type === 'columns' && sec.columns) {
          return `<div class="flex gap-6 w-full ${sec.className || ''}">${sec.columns.map(c => `<div style="flex: 1; width: ${c.width || '100%'}">${c.content}</div>`).join('')}</div>`;
        }
        if (sec.type === 'table' && sec.tableData) {
          const { headers, rows, alignments } = sec.tableData;
          return `
            <div class="border border-zinc-200 rounded-xl overflow-hidden ${sec.className || ''}" style="margin-top: 15px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background-color: ${documentData.themeColor}; color: white;">
                    ${headers.map((h, i) => `<th style="padding: 8px 12px; text-align: ${alignments[i] || 'left'}">${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(row => `
                    <tr style="border-bottom: 1px solid #e4e4e7;">
                      ${row.map((cell, i) => `<td style="padding: 8px 12px; text-align: ${alignments[i] || 'left'}">${cell}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
        if (sec.type === 'footer' && sec.content) {
          return `<div class="text-zinc-500 text-[10px] ${sec.className || 'mt-auto'}">${sec.content}</div>`;
        }
        return '';
      }).join('');

      return `
        <div class="print-page" style="page-break-after: always; width: 100%; box-sizing: border-box; padding: 40px; background: white; min-height: 100%;">
          <div style="display: flex; flex-direction: column; min-height: 100%; gap: 24px;">
            ${pageSectionsHtml}
          </div>
        </div>
      `;
    }).join('');

    iframeDoc.write(`
      <html>
        <head>
          <title>${documentData.name}</title>
          ${stylesHtml}
          <style>
            @media print {
              body, html { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .print-page { page-break-after: always; }
              .print-page:last-child { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          ${bodyHtml}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  // Compile PDF via html2pdf library dynamically loaded
  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    try {
      // Dynamic load html2pdf.js from CDN
      const html2pdf = await new Promise<any>((resolve, reject) => {
        if ((window as any).html2pdf) {
          resolve((window as any).html2pdf);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve((window as any).html2pdf);
        script.onerror = () => reject(new Error('Failed to load PDF library.'));
        document.head.appendChild(script);
      });

      // Construct temporary DOM tree of A4 sheets for compiler
      const compileNode = document.createElement('div');
      compileNode.style.width = `${PAGE_WIDTH}px`;
      
      const pagesHtml = documentData.pages.map(p => {
        const sectionsHtml = p.sections.map(sec => {
          if (sec.type === 'content' && sec.content) {
            return `<div class="text-zinc-700 text-xs leading-relaxed ${sec.className || ''}" style="${sec.style ? Object.entries(sec.style).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(';') : ''}">${sec.content}</div>`;
          }
          if (sec.type === 'divider') {
            return `<hr class="border-zinc-200 ${sec.className || 'my-4'}" />`;
          }
          if (sec.type === 'columns' && sec.columns) {
            return `<div class="flex gap-6 w-full ${sec.className || ''}">${sec.columns.map(c => `<div style="flex: 1; width: ${c.width || '100%'}">${c.content}</div>`).join('')}</div>`;
          }
          if (sec.type === 'table' && sec.tableData) {
            const { headers, rows, alignments } = sec.tableData;
            return `
              <div class="border border-zinc-200 rounded-xl overflow-hidden ${sec.className || ''}" style="margin-top: 15px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                  <thead>
                    <tr style="background-color: ${documentData.themeColor}; color: white;">
                      ${headers.map((h, i) => `<th style="padding: 8px 12px; text-align: ${alignments[i] || 'left'}">${h}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${rows.map(row => `
                      <tr style="border-bottom: 1px solid #e4e4e7;">
                        ${row.map((cell, i) => `<td style="padding: 8px 12px; text-align: ${alignments[i] || 'left'}">${cell}</td>`).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }
          if (sec.type === 'footer' && sec.content) {
            return `<div class="text-zinc-500 text-[10px] mt-auto" style="position: absolute; bottom: 40px; left: 40px; right: 40px;">${sec.content}</div>`;
          }
          return '';
        }).join('');

        return `
          <div class="pdf-page" style="page-break-after: always; box-sizing: border-box; width: ${PAGE_WIDTH}px; min-height: ${PAGE_HEIGHT}px; padding: 40px; background: white; display: flex; flex-direction: column; gap: 24px; position: relative;">
            ${sectionsHtml}
          </div>
        `;
      }).join('');

      compileNode.innerHTML = pagesHtml;

      const filename = `${documentData.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'px', 
          format: isPortrait ? 'a4' : 'a4', // uses standard letter sizes
          orientation: documentData.orientation 
        }
      };

      await html2pdf().from(compileNode).set(opt).save();
    } catch (err) {
      console.error(err);
      alert('Error rendering PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const zoomFactor = zoom / 100;

  return (
    <div 
      ref={viewerRef} 
      className={`h-full w-full flex flex-col bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative select-none font-sans text-zinc-900 dark:text-zinc-100 ${className}`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 z-20 shrink-0 text-zinc-800 dark:text-zinc-250">
        
        {/* Toggle Sidebar & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={showSidebar ? { color: documentData.themeColor, borderColor: `${documentData.themeColor}30`, backgroundColor: `${documentData.themeColor}15` } : undefined}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              showSidebar 
                ? '' 
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200'
            }`}
            title="Toggle Sidebar Thumbnails"
          >
            <Sidebar className="h-4 w-4" />
          </button>
          
          <div className="hidden sm:block">
            <h4 className="text-xs font-bold truncate max-w-[180px] tracking-wide text-zinc-900 dark:text-zinc-100">{documentData.name}</h4>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{documentData.pageSize} &bull; {documentData.orientation}</p>
          </div>
        </div>

        {/* Core Zoom controls */}
        <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-850 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <span 
            className="text-xs font-mono font-bold w-12 text-center"
            style={{ color: documentData.themeColor }}
          >
            {zoom}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

          {/* Quick zoom options */}
          <button
            onClick={handleZoomReset}
            className="p-1 text-[9px] font-bold px-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase transition"
            title="Reset Zoom to 100%"
          >
            100%
          </button>
          <button
            onClick={handleFitWidth}
            className="p-1 text-[9px] font-bold px-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase transition"
            title="Fit to Width"
          >
            Width
          </button>
          <button
            onClick={handleFitPage}
            className="p-1 text-[9px] font-bold px-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase transition"
            title="Fit to Page"
          >
            Page
          </button>
        </div>

        {/* Navigation & Layout mode buttons */}
        <div className="flex items-center gap-3">
          {/* Page numbers */}
          <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => navigateToPage(currentPage - 1)}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200 transition disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-lg">
              <input
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => setPageInput(String(currentPage))}
                className="w-7 h-5 bg-transparent border-0 text-center text-xs font-bold text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-0 p-0"
              />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold mx-1">/</span>
              <span className="text-xs text-zinc-650 dark:text-zinc-400 font-bold">{totalPages}</span>
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => navigateToPage(currentPage + 1)}
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200 transition disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800" />

          {/* View Mode Switcher */}
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'continuous' : 'single')}
            style={viewMode === 'single' ? { color: documentData.themeColor, borderColor: `${documentData.themeColor}30`, backgroundColor: `${documentData.themeColor}15` } : undefined}
            className={`p-2 rounded-lg border transition hidden md:block ${
              viewMode === 'single' 
                ? '' 
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200'
            }`}
            title={viewMode === 'single' ? 'Switch to Continuous Scroll' : 'Switch to Single Page View'}
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200 transition"
              title="Print Document"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className={`p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200 transition relative ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Download compiled PDF"
            >
              {isDownloading ? (
                <div 
                  className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" 
                  style={{ borderColor: documentData.themeColor, borderTopColor: 'transparent' }}
                />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-850 dark:hover:text-zinc-200 transition"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

      </div>

      {/* 2. BODY SECTION (SIDEBAR + MAIN CANVAS) */}
      <div className="flex flex-1 min-h-0 relative">
        
        {/* Sidebar thumbnails */}
        {showSidebar && (
          <div className="w-48 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 gap-4 overflow-y-auto shrink-0 z-10 transition-all duration-300">
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Page Thumbnails</span>
            
            <div className="flex flex-col gap-5">
              {documentData.pages.map((_, index) => {
                const pNum = index + 1;
                const isSelected = pNum === currentPage;
                const thumbAspect = isPortrait ? 'aspect-[1/1.414]' : 'aspect-[1.414/1]';

                return (
                  <div 
                    key={index}
                    onClick={() => navigateToPage(pNum)}
                    className="group flex flex-col gap-1.5 items-center cursor-pointer select-none"
                  >
                    <div 
                      className={`w-full bg-zinc-50 dark:bg-zinc-950/40 border rounded-lg overflow-hidden flex items-center justify-center p-2 relative shadow-sm transition duration-200 ${thumbAspect} ${
                        isSelected 
                          ? '' 
                          : 'border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-350 dark:group-hover:border-zinc-700 hover:shadow-md'
                      }`}
                      style={isSelected ? { borderColor: documentData.themeColor, boxShadow: `0 0 0 2px ${documentData.themeColor}20` } : undefined}
                    >
                      {/* Document Symbol */}
                      <FileText 
                        className={`h-6 w-6 transition ${isSelected ? '' : 'text-zinc-450 dark:text-zinc-650 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'}`} 
                        style={isSelected ? { color: documentData.themeColor } : undefined}
                      />
                      
                      {/* Sub-label */}
                      <div className="absolute bottom-1 right-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[8px] font-extrabold px-1 rounded text-zinc-500 dark:text-zinc-400">
                        {pNum}
                      </div>
                    </div>
                    <span 
                      className={`text-[10px] font-bold transition ${
                        isSelected ? 'font-extrabold' : 'text-zinc-500 dark:text-zinc-450 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                      }`}
                      style={isSelected ? { color: documentData.themeColor } : undefined}
                    >
                      Page {pNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Canvas Scroll Area */}
        <div 
          ref={canvasRef}
          className="flex-grow bg-zinc-100/70 dark:bg-zinc-950/40 p-8 overflow-auto flex flex-col items-center gap-8 scroll-smooth"
        >
          {viewMode === 'continuous' ? (
            // Render ALL pages in list (continuous layout)
            documentData.pages.map((p, index) => {
              const pNum = index + 1;
              return (
                <div
                  key={index}
                  ref={el => { pageRefs.current[index] = el; }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-10 flex flex-col shadow-2xl relative transition-transform origin-top select-text"
                  style={{
                    width: `${PAGE_WIDTH}px`,
                    minHeight: `${PAGE_HEIGHT}px`,
                    transform: `scale(${zoomFactor})`,
                    marginBottom: `${(zoomFactor - 1) * PAGE_HEIGHT}px` // offsets container size for CSS scales
                  }}
                >
                  {/* Floating Page watermarks */}
                  <div className="absolute top-3 right-5 text-[9px] font-bold text-zinc-350 dark:text-zinc-650 pointer-events-none select-none tracking-wider uppercase">
                    Page {pNum} of {totalPages}
                  </div>

                  <div className="flex-grow flex flex-col gap-6">
                    {p.sections.map((sec, sIdx) => (
                      <React.Fragment key={sIdx}>
                        {renderSectionContent(sec)}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Render ACTIVE page only (single page view layout)
            <div
              ref={el => { pageRefs.current[currentPage - 1] = el; }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-10 flex flex-col shadow-2xl relative transition-transform origin-top select-text"
              style={{
                width: `${PAGE_WIDTH}px`,
                minHeight: `${PAGE_HEIGHT}px`,
                transform: `scale(${zoomFactor})`,
                marginBottom: `${(zoomFactor - 1) * PAGE_HEIGHT}px`
              }}
            >
              <div className="absolute top-3 right-5 text-[9px] font-bold text-zinc-350 dark:text-zinc-650 pointer-events-none select-none tracking-wider uppercase">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex-grow flex flex-col gap-6">
                {documentData.pages[currentPage - 1].sections.map((sec, sIdx) => (
                  <React.Fragment key={sIdx}>
                    {renderSectionContent(sec)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Dynamic Action Loading Overlay */}
      {isDownloading && (
        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center gap-3 shadow-xl max-w-xs text-center">
            <div className="relative">
              <div 
                className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin" 
                style={{ borderColor: documentData.themeColor, borderTopColor: 'transparent' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-4 w-4 animate-pulse" style={{ color: documentData.themeColor }} />
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-100">Compiling High-Quality PDF</h5>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-450 mt-1">Exporting document pages and applying layout vector styling...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
