import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import TableUp, { defaultCustomSelect } from 'quill-table-up';
import 'quill-table-up/index.css';
import 'quill-table-up/table-creator.css';
import { useTemplateEditor } from '../context';
import type { HeaderOptions, SignatureOptions } from '../types';
import {
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link,
  Eraser,
} from 'lucide-react';

// A4 dimensions at 96dpi
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1122;
const PAGE_PADDING_Y_PX = 32;
const PAGE_PADDING_X_PX = 48;
const REFLOW_DEBOUNCE_MS = 100;
const UNDERFLOW_SLOP_PX = 12;
const FOOTER_RESERVED_PX = 44;
const FOOTER_GAP_PX = 24;

// Quill Delta constructor
const DeltaCtor = Quill.import('delta') as any;

const registerTableUp = () => {
  const quillImports = (Quill as any).imports || {};
  if (!quillImports['modules/tableUp']) {
    Quill.register({ 'modules/tableUp': TableUp }, true);
    if (typeof (TableUp as any).register === 'function') {
      (TableUp as any).register();
    }
  }
};

const registerFormatting = () => {
  const ensureRegistered = (key: string) => {
    const quillImports = (Quill as any).imports || {};
    if (quillImports[key]) return;
    const mod = Quill.import(key);
    if (mod) Quill.register(mod as any, true);
  };

  ensureRegistered('formats/link');
  ensureRegistered('formats/list');
  ensureRegistered('formats/indent');
  ensureRegistered('formats/align');

  const Font = Quill.import('formats/font') as any;
  if (Font) {
    Font.whitelist = ['helvetica', 'arial', 'times-new-roman'];
    Quill.register(Font, true);
  }

  const SizeClass = Quill.import('attributors/class/size') as any;
  if (SizeClass) {
    SizeClass.whitelist = ['small', 'large', 'huge'];
    Quill.register(SizeClass, true);
  }
  const SizeStyle = Quill.import('attributors/style/size') as any;
  if (SizeStyle) {
    SizeStyle.whitelist = ['small', 'large', 'huge'];
    Quill.register(SizeStyle, true);
  }
  const ColorStyle = Quill.import('attributors/style/color') as any;
  if (ColorStyle) Quill.register(ColorStyle, true);
  const BackgroundStyle = Quill.import('attributors/style/background') as any;
  if (BackgroundStyle) Quill.register(BackgroundStyle, true);
};

const PICKER_CLASS_MAP: Record<string, string> = {
  'ql-font': 'font',
  'ql-size': 'size',
  'ql-color': 'color',
  'ql-background': 'background',
  'ql-align': 'align',
};

const BUTTON_CLASS_MAP: Record<string, string> = {
  'ql-undo': 'undo',
  'ql-redo': 'redo',
  'ql-bold': 'bold',
  'ql-italic': 'italic',
  'ql-underline': 'underline',
  'ql-strike': 'strike',
  'ql-link': 'link',
  'ql-clean': 'clean',
};

// Word-style floating Custom Toolbar
const CustomToolbar: React.FC<{
  toolbarId: string;
  isActive: boolean;
  pageId: string;
  applyToolbarAction: (pageId: string, action: string, value?: string) => void;
}> = ({ toolbarId, isActive, pageId, applyToolbarAction }) => {
  // const handleAction = (e: React.MouseEvent, action: string, value?: string) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   applyToolbarAction(pageId, action, value);
  // };

  return (
    <div
      id={toolbarId}
      className={`ql-toolbar ql-snow border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur px-4 py-2 w-full flex-wrap gap-2 items-center rounded-t-xl transition-all duration-300 ${isActive ? 'flex' : 'hidden'
        }`}
      onClickCapture={(e) => {
        const target = e.target as HTMLElement;
        const pickerItem = target.closest('.ql-picker-item');
        if (pickerItem) {
          const picker = pickerItem.closest('.ql-picker');
          if (!picker || picker.classList.contains('ql-table-up')) return;
          const dataValue = (pickerItem as HTMLElement).dataset.value ?? '';
          const matchedClass = Object.keys(PICKER_CLASS_MAP).find((cls) =>
            picker.classList.contains(cls)
          );
          if (matchedClass) {
            e.preventDefault();
            e.stopPropagation();
            applyToolbarAction(pageId, PICKER_CLASS_MAP[matchedClass], dataValue);
          }
          return;
        }

        const button = target.closest('button');
        if (!button) return;
        const matchedClass = Object.keys(BUTTON_CLASS_MAP).find((cls) =>
          button.classList.contains(cls)
        );
        if (matchedClass) {
          e.preventDefault();
          e.stopPropagation();
          applyToolbarAction(pageId, BUTTON_CLASS_MAP[matchedClass]);
          return;
        }

        if (button.classList.contains('ql-list') || button.classList.contains('ql-indent')) {
          const value = button.dataset.value || button.value;
          if (typeof value === 'string' && value) {
            e.preventDefault();
            e.stopPropagation();
            applyToolbarAction(pageId, button.classList.contains('ql-list') ? 'list' : 'indent', value);
          }
        }
      }}
      onChangeCapture={(e) => {
        const target = e.target as HTMLElement;
        const select = target.closest('select');
        if (!select || select.classList.contains('ql-table-up')) return;
        const matchedClass = Object.keys(PICKER_CLASS_MAP).find((cls) =>
          select.classList.contains(cls)
        );
        if (matchedClass) {
          e.preventDefault();
          e.stopPropagation();
          applyToolbarAction(pageId, PICKER_CLASS_MAP[matchedClass], (select as HTMLSelectElement).value);
        }
      }}
    >
      {/* Undo / Redo */}
      <span className="ql-formats flex items-center space-x-0.5">
        <button className="ql-undo p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Undo">
          <Undo2 size={14} className="text-slate-600 dark:text-slate-400" />
        </button>
        <button className="ql-redo p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Redo">
          <Redo2 size={14} className="text-slate-600 dark:text-slate-400" />
        </button>
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Font Family & Sizes */}
      <span className="ql-formats flex items-center space-x-1">
        <select className="ql-font border border-slate-200 dark:border-slate-850 rounded text-xs px-1 py-0.5" defaultValue="">
          <option value="">Default</option>
          <option value="helvetica">Helvetica</option>
          <option value="arial">Arial</option>
          <option value="times-new-roman">Times New Roman</option>
        </select>

        <select className="ql-size border border-slate-200 dark:border-slate-850 rounded text-xs px-1 py-0.5" defaultValue="">
          <option value="small">Small</option>
          <option value="">Normal</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Colors & Background */}
      <span className="ql-formats flex items-center space-x-1">
        <select className="ql-color" title="Text Color" />
        <select className="ql-background" title="Highlight Color" />
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Formatting styles */}
      <span className="ql-formats flex items-center space-x-0.5">
        <button className="ql-bold p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Bold"><Bold size={14} /></button>
        <button className="ql-italic p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Italic"><Italic size={14} /></button>
        <button className="ql-underline p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Underline"><Underline size={14} /></button>
        <button className="ql-strike p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Strikethrough"><Strikethrough size={14} /></button>
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Alignment */}
      <span className="ql-formats flex items-center space-x-1">
        <select className="ql-align" defaultValue="" title="Alignment">
          <option value="" />
          <option value="center" />
          <option value="right" />
          <option value="justify" />
        </select>
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Lists */}
      <span className="ql-formats flex items-center space-x-0.5">
        <button className="ql-list p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" value="bullet" type="button" title="Bullet List"><List size={14} /></button>
        <button className="ql-list p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" value="ordered" type="button" title="Numbered List"><ListOrdered size={14} /></button>
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Links & Clear Format */}
      <span className="ql-formats flex items-center space-x-0.5">
        <button className="ql-link p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Link"><Link size={14} /></button>
        <button className="ql-clean p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors" type="button" title="Clear Formatting"><Eraser size={14} /></button>
      </span>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-850" />

      {/* Table grid inserts */}
      <span className="ql-formats flex items-center">
        <select className="ql-table-up" title="Insert Table">
          <option value="" />
        </select>
      </span>
    </div>
  );
};

// Word-style Header
const LetterHeader: React.FC<{ options: HeaderOptions }> = ({ options }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 select-none border-b border-slate-200 dark:border-slate-800 pb-5">
      <div className="flex flex-col items-start justify-center">
        <div className="flex items-center space-x-2">
          {options.includeSeal && options.logoUrl && (
            <img src={options.logoUrl} alt="Logo" className="w-16 h-16 object-contain rounded-lg bg-slate-50 dark:bg-slate-950 p-1 border border-slate-100 dark:border-slate-850" />
          )}
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold tracking-wide uppercase text-slate-800 dark:text-white">
              {options.companyName}
            </h1>
            <p className="text-[10px] text-indigo-500 font-bold dark:text-indigo-400">
              {options.subheading}
            </p>
          </div>
        </div>
        {options.includeDate && (
          <p className="text-xs text-slate-500 mt-3 font-semibold dark:text-slate-400">{`{{date}}`}</p>
        )}
      </div>
      {options.includeContactInfo && (
        <div className="text-right text-[10px] leading-relaxed text-slate-400 dark:text-slate-500 flex flex-col justify-center">
          <p>{options.address}</p>
          <p>{options.phone}</p>
          <p>{options.website}</p>
        </div>
      )}
    </div>
  );
};

const SignaturePreview: React.FC<{ options: SignatureOptions }> = ({ options }) => {
  let signStyle = '';
  if (options.signatureStyle === 'handwritten') {
    signStyle = 'font-semibold text-blue-600 dark:text-blue-400 text-3xl pb-1';
  } else if (options.signatureStyle === 'classic') {
    signStyle = 'font-semibold text-xl text-slate-900 dark:text-slate-200 border-b border-slate-350 dark:border-slate-700 italic pb-0.5';
  } else {
    signStyle = 'font-mono text-sm text-slate-500';
  }

  return (
    <div className="mt-6 flex flex-col items-start space-y-1 select-none">
      <div className="h-10 flex items-end">
        <span className={signStyle} style={options.signatureStyle === 'handwritten' ? { fontFamily: "'Caveat', cursive" } : {}}>
          {options.signatureStyle === 'typed' ? `/s/ ${options.signerName}` : options.signerName}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{options.signerName}</p>
      <p className="text-[10px] text-slate-400 dark:text-slate-550">{options.title}</p>
    </div>
  );
};

const DateOnlyHeader: React.FC = () => (
  <div className="mb-6 select-none border-b border-slate-200 dark:border-slate-800 pb-2">
    <p className="text-xs text-slate-500 font-semibold dark:text-slate-400">{`{{date}}`}</p>
  </div>
);

interface PageModel {
  id: string;
  delta: any;
}

const makePageId = (): string => {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const TemplateEditorPage: React.FC = () => {
  const {
    headerOptions,
    footerOptions,
    signatureOptions,
    contentDelta,
    updateBlock,
    letterTitle,
    toAddress,
    reLine,
    subjectLine
  } = useTemplateEditor();

  const [pages, setPages] = useState<PageModel[]>(() => {
    const firstId = makePageId();
    // Safely deserialize contentDelta if provided
    let initialDelta = { ops: [{ insert: '\n' }] };
    if (contentDelta) {
      try {
        initialDelta = typeof contentDelta === 'string' ? JSON.parse(contentDelta) : contentDelta;
      } catch (e) {
        console.error('Failed to parse contentDelta', e);
      }
    }
    return [{ id: firstId, delta: initialDelta }];
  });

  const pagesRef = useRef<PageModel[]>(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const [activePageId, setActivePageId] = useState<string>(pages[0]!.id);
  const editorElByPageIdRef = useRef<Record<string, HTMLDivElement | null>>({});
  const quillByPageIdRef = useRef<Record<string, Quill>>({});

  const headerMeasureRef = useRef<HTMLDivElement | null>(null);
  const footerMeasureRef = useRef<HTMLDivElement | null>(null);
  const signatureMeasureRef = useRef<HTMLDivElement | null>(null);
  const dateMeasureRef = useRef<HTMLDivElement | null>(null);
  const letterBlocksMeasureRef = useRef<HTMLDivElement | null>(null);

  const headerHeightRef = useRef<number>(110);
  const footerHeightRef = useRef<number>(44);
  const signatureHeightRef = useRef<number>(75);
  const dateHeightRef = useRef<number>(30);
  const letterBlocksHeightRef = useRef<number>(120);
  const [layoutVersion, setLayoutVersion] = useState(0);

  const isApplyingProgrammaticallyRef = useRef(false);
  const reflowTimerRef = useRef<number | undefined>(undefined);
  const pendingReflowStartIndexRef = useRef<number>(0);
  const emitTimerRef = useRef<number | undefined>(undefined);

  const showHeader = !!headerOptions.includeSeal;
  const showDateOnly = !!(headerOptions.includeDate && !showHeader);

  const getBodyHeightPx = (pageIndex: number, totalPages: number) => {
    const innerPageHeight = A4_HEIGHT_PX - PAGE_PADDING_Y_PX * 2;
    const headerH = pageIndex === 0 && showHeader ? headerHeightRef.current : 0;
    const dateH = pageIndex === 0 && showDateOnly ? dateHeightRef.current : 0;
    const letterBlocksH = pageIndex === 0 ? letterBlocksHeightRef.current : 0;

    const isLastPage = pageIndex === totalPages - 1;
    const sigH = isLastPage && signatureOptions.includeSignature ? signatureHeightRef.current : 0;
    const safety = 4;
    const footerReserved = footerOptions.includeFooter ? FOOTER_GAP_PX + FOOTER_RESERVED_PX : 0;

    return Math.max(
      150,
      innerPageHeight - headerH - dateH - letterBlocksH - footerReserved - sigH - safety
    );
  };

  const getPageIndexById = (pageId: string) =>
    pagesRef.current.findIndex((p) => p.id === pageId);

  const getQuill = (pageId: string) => quillByPageIdRef.current[pageId] ?? null;

  const normalizeEditorScroll = (quill: Quill) => {
    const editorRoot = quill.root as HTMLElement;
    if (editorRoot.scrollTop !== 0) editorRoot.scrollTop = 0;
    const container = editorRoot.parentElement;
    if (container && container.scrollTop !== 0) container.scrollTop = 0;
  };

  const getPageDelta = (pageId: string) => {
    const q = getQuill(pageId);
    if (q) return q.getContents();
    return pagesRef.current.find((p) => p.id === pageId)?.delta ?? { ops: [{ insert: '\n' }] };
  };

  // Compile combined delta, update placeholders and HTML state in context provider
  const emitCombinedDeltaDebounced = () => {
    if (emitTimerRef.current) globalThis.clearTimeout(emitTimerRef.current);
    emitTimerRef.current = globalThis.setTimeout(() => {
      const list = pagesRef.current;
      let combined = new DeltaCtor();
      for (const p of list) {
        combined = combined.concat(asDeltaInstance(getPageDelta(p.id)));
      }

      // Convert to HTML
      const tempQuill = new Quill(document.createElement('div'));
      tempQuill.setContents(combined);
      const combinedHtml = tempQuill.root.innerHTML;

      // Update both contentHtml and contentDelta in context provider
      // We pass b_body block type to update the editor content
      updateBlock('b_body', {
        contentHtml: combinedHtml,
        contentDelta: JSON.stringify(combined),
      } as any);
    }, 150) as unknown as number;
  };

  const asDeltaInstance = (deltaLike: any) =>
    new DeltaCtor(Array.isArray(deltaLike?.ops) ? deltaLike.ops : []);

  const concatDeltas = (a: any, b: any) =>
    asDeltaInstance(a).concat(asDeltaInstance(b));

  const isEffectivelyEmptyDelta = (delta: any) => {
    const ops = delta?.ops;
    if (!Array.isArray(ops) || ops.length === 0) return true;
    if (ops.length === 1 && ops[0]?.insert === '\n') return true;
    return false;
  };

  const findMaxIndexThatFits = (quill: Quill, bodyHeightPx: number) => {
    const len = quill.getLength();
    const max = Math.max(0, len - 1);
    let low = 0;
    let high = max;
    let best = 0;

    const fits = (idx: number) => {
      const b = quill.getBounds(idx);
      if (!b) return false;
      const bottom = b.top + b.height;
      return bottom <= bodyHeightPx;
    };

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (fits(mid)) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return best;
  };

  const findSafeSplitIndex = (quill: Quill, bodyHeightPx: number) => {
    const len = quill.getLength();
    if (len <= 1) return 1;

    const fitIdx = findMaxIndexThatFits(quill, bodyHeightPx);
    const clamped = Math.min(Math.max(1, fitIdx), len - 1);

    const text = quill.getText(0, clamped);
    const lastNl = text.lastIndexOf('\n');
    const splitAt = lastNl > 0 ? lastNl + 1 : clamped;

    return Math.min(Math.max(1, splitAt), len - 1);
  };

  const scheduleReflowFrom = (pageId: string) => {
    const idx = getPageIndexById(pageId);
    const startIndex = Math.max(0, idx);
    pendingReflowStartIndexRef.current = Math.min(
      pendingReflowStartIndexRef.current ?? startIndex,
      startIndex
    );
    if (reflowTimerRef.current) globalThis.clearTimeout(reflowTimerRef.current);
    reflowTimerRef.current = globalThis.setTimeout(() => {
      const s = pendingReflowStartIndexRef.current ?? 0;
      pendingReflowStartIndexRef.current = 0;
      reflowFromIndex(s);
    }, REFLOW_DEBOUNCE_MS) as unknown as number;
  };

  const handleOverflow = (working: any[], startIndex: number): boolean => {
    let changed = false;

    for (let i = startIndex; i < working.length; i++) {
      const page = working[i];
      const q = getQuill(page.id);
      if (!q) continue;

      const bodyHeight = getBodyHeightPx(i, working.length);
      if ((q.root as HTMLElement).scrollHeight <= bodyHeight) continue;

      let guard = 0;
      while ((q.root as HTMLElement).scrollHeight > bodyHeight) {
        if (++guard > 50) break;

        const len = q.getLength();
        if (len <= 1) break;

        const splitIndex = findSafeSplitIndex(q, bodyHeight);
        if (splitIndex <= 1 || splitIndex >= len) break;

        const keep = q.getContents(0, splitIndex);
        const overflow = q.getContents(splitIndex, len - splitIndex);

        q.setContents(keep, Quill.sources.SILENT);
        normalizeEditorScroll(q);

        working[i] = { ...working[i], delta: keep };
        changed = true;

        const next = working[i + 1];
        if (next) {
          const nextDelta = getPageDelta(next.id);
          const merged = concatDeltas(overflow, nextDelta);
          const nextQ = getQuill(next.id);
          if (nextQ) {
            nextQ.setContents(merged, Quill.sources.SILENT);
            normalizeEditorScroll(nextQ);
          }
          working[i + 1] = { ...next, delta: merged };
        } else {
          working.push({ id: makePageId(), delta: overflow });
        }

        if (!working[i + 1] || !getQuill(working[i + 1].id)) break;
      }
    }
    return changed;
  };

  const handleUnderflow = (working: any[], startIndex: number): boolean => {
    let changed = false;

    for (let i = Math.max(0, startIndex - 1); i < working.length - 1; i++) {
      const cur = working[i];
      const nxt = working[i + 1];

      const curQ = getQuill(cur.id);
      const nxtQ = getQuill(nxt.id);
      if (!curQ || !nxtQ) continue;

      const bodyHeight = getBodyHeightPx(i, working.length);

      while ((curQ.root as HTMLElement).scrollHeight < bodyHeight - UNDERFLOW_SLOP_PX) {
        const nextLen = nxtQ.getLength();
        if (nextLen <= 1) break;

        const headText = nxtQ.getText(0, Math.min(nextLen, 4000));
        const firstNl = headText.indexOf('\n');
        const moveLen = firstNl >= 0 ? Math.min(firstNl + 1, nextLen - 1) : nextLen - 1;

        if (moveLen <= 0) break;

        const curBefore = curQ.getContents();
        const segment = nxtQ.getContents(0, moveLen);
        const insertAt = Math.max(0, curQ.getLength() - 1);

        curQ.updateContents(
          new DeltaCtor().retain(insertAt).concat(asDeltaInstance(segment)),
          Quill.sources.SILENT
        );

        if ((curQ.root as HTMLElement).scrollHeight > bodyHeight) {
          curQ.setContents(curBefore, Quill.sources.SILENT);
          normalizeEditorScroll(curQ);
          break;
        }

        nxtQ.deleteText(0, moveLen, Quill.sources.SILENT);
        working[i] = { ...cur, delta: curQ.getContents() };
        working[i + 1] = { ...nxt, delta: nxtQ.getContents() };
        changed = true;

        if (isEffectivelyEmptyDelta(working[i + 1].delta) && working.length > 1) {
          const removed = working[i + 1];
          working.splice(i + 1, 1);

          const removedQ = quillByPageIdRef.current[removed.id];
          if (removedQ) {
            removedQ.off('text-change');
            removedQ.off('selection-change');
            delete quillByPageIdRef.current[removed.id];
          }
          delete editorElByPageIdRef.current[removed.id];
          break;
        }
      }
    }
    return changed;
  };

  const normalizeAllEditors = (working: any[]) => {
    for (const page of working) {
      const q = getQuill(page.id);
      if (q) normalizeEditorScroll(q);
    }
  };

  const reflowFromIndex = (startIndex: number) => {
    if (startIndex < 0 || isApplyingProgrammaticallyRef.current) return;
    isApplyingProgrammaticallyRef.current = true;

    try {
      let working = [...pagesRef.current];
      const overflowChanged = handleOverflow(working, startIndex);
      const underflowChanged = handleUnderflow(working, startIndex);

      normalizeAllEditors(working);

      if (overflowChanged || underflowChanged) {
        setPages(working);
      }
      emitCombinedDeltaDebounced();
    } finally {
      isApplyingProgrammaticallyRef.current = false;
    }
  };

  const lastRangeByPageRef = useRef<Record<string, { index: number; length: number } | null>>({});

  useEffect(() => {
    registerFormatting();
    registerTableUp();
  }, []);

  // Measure letterhead dates/footers/signature heights dynamically
  useEffect(() => {
    const observers: ResizeObserver[] = [];
    const bump = () => setLayoutVersion((v) => v + 1);

    const observe = (
      el: HTMLElement | null,
      getPrev: () => number,
      setPrev: (h: number) => void
    ) => {
      if (!el) return;
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const h = entry.contentRect.height;
        const prev = getPrev();
        if (Number.isFinite(prev) && Math.abs(prev - h) < 0.5) return;
        setPrev(h);
        bump();
      });
      ro.observe(el);
      observers.push(ro);
    };

    observe(headerMeasureRef.current, () => headerHeightRef.current, (h) => { headerHeightRef.current = h; });
    observe(footerMeasureRef.current, () => footerHeightRef.current, (h) => { footerHeightRef.current = h; });
    observe(signatureMeasureRef.current, () => signatureHeightRef.current, (h) => { signatureHeightRef.current = h; });
    observe(dateMeasureRef.current, () => dateHeightRef.current, (h) => { dateHeightRef.current = h; });
    observe(letterBlocksMeasureRef.current, () => letterBlocksHeightRef.current, (h) => { letterBlocksHeightRef.current = h; });

    return () => observers.forEach((o) => o.disconnect());
  }, [footerOptions.includeFooter, signatureOptions.includeSignature, showHeader, showDateOnly, letterTitle, toAddress, reLine, subjectLine]);

  useEffect(() => {
    const first = pagesRef.current[0];
    if (!first) return;
    scheduleReflowFrom(first.id);
  }, [layoutVersion]);

  // Synchronise contentDelta preset changes from context (for loadDemo presets)
  useEffect(() => {
    if (!contentDelta) return;
    let deltaObj;
    try {
      deltaObj = typeof contentDelta === 'string' ? JSON.parse(contentDelta) : contentDelta;
    } catch (e) {
      return;
    }

    const firstId = pages[0]?.id;
    if (!firstId) return;

    const currentDeltaStr = JSON.stringify(getPageDelta(firstId));
    if (currentDeltaStr === JSON.stringify(deltaObj) && pages.length === 1) return;

    // Reset editor canvas to first page and load new preset delta
    isApplyingProgrammaticallyRef.current = true;
    const cleanId = makePageId();
    setPages([{ id: cleanId, delta: deltaObj }]);
    setActivePageId(cleanId);
    isApplyingProgrammaticallyRef.current = false;

    globalThis.setTimeout(() => scheduleReflowFrom(cleanId), 20);
  }, [contentDelta]);

  // Expose token insertion dynamically for left-pane variable clicks
  useEffect(() => {
    const handleInsertPlaceholder = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      const keyToken = `{{${customEvent.detail.key}}}`;
      const activeQ = getQuill(activePageId);
      if (activeQ) {
        activeQ.focus();
        const savedRange = lastRangeByPageRef.current[activePageId];
        const range = savedRange ?? activeQ.getSelection(true) ?? { index: activeQ.getLength() - 1, length: 0 };
        activeQ.insertText(range.index, keyToken, 'user');
        activeQ.setSelection(range.index + keyToken.length, 0, 'user');

        // Trigger reflow
        emitCombinedDeltaDebounced();
        scheduleReflowFrom(activePageId);
      }
    };

    window.addEventListener('insert-editor-placeholder', handleInsertPlaceholder);
    return () => {
      window.removeEventListener('insert-editor-placeholder', handleInsertPlaceholder);
    };
  }, [activePageId]);

  const cleanupRemovedEditors = (aliveIds: Set<string>) => {
    for (const [pageId, q] of Object.entries(quillByPageIdRef.current)) {
      if (aliveIds.has(pageId)) continue;
      q.off('text-change');
      q.off('selection-change');
      delete quillByPageIdRef.current[pageId];
      delete editorElByPageIdRef.current[pageId];
    }
  };

  const initEditor = (page: any) => {
    if (quillByPageIdRef.current[page.id]) return;
    const mountEl = editorElByPageIdRef.current[page.id];
    if (!mountEl) return;

    mountEl.innerHTML = '';
    const toolbarId = `editor-toolbar-${page.id}`;

    const quill = new Quill(mountEl, {
      theme: 'snow',
      modules: {
        toolbar: { container: `#${toolbarId}` },
        history: { userOnly: true },
        table: false,
        tableUp: {
          customSelect: defaultCustomSelect,
          customBtn: false,
        },
      },
    });

    quillByPageIdRef.current[page.id] = quill;

    isApplyingProgrammaticallyRef.current = true;
    try {
      quill.setContents(page.delta ?? { ops: [{ insert: '\n' }] }, 'silent');
      normalizeEditorScroll(quill);
    } finally {
      isApplyingProgrammaticallyRef.current = false;
    }

    // Bind Quill listeners
    quill.on('selection-change', (range) => {
      if (!range) return;
      lastRangeByPageRef.current[page.id] = range;
      setActivePageId(page.id);
    });

    quill.on('text-change', (_delta, _old, source) => {
      if (source !== Quill.sources.USER) return;
      if (isApplyingProgrammaticallyRef.current) return;
      emitCombinedDeltaDebounced();
      scheduleReflowFrom(page.id);
    });
  };

  useEffect(() => {
    const aliveIds = new Set(pages.map((p) => p.id));
    cleanupRemovedEditors(aliveIds);

    for (const page of pages) {
      initEditor(page);
    }
  }, [pages]);

  const normalizeLinkUrl = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:') || lower.startsWith('tel:')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const applyToolbarAction = (pageId: string, action: string, value?: string) => {
    const quill = quillByPageIdRef.current[pageId];
    if (!quill) return;

    const saved = lastRangeByPageRef.current[pageId];
    quill.focus();

    const range = saved ?? quill.getSelection(true) ?? { index: Math.max(0, quill.getLength() - 1), length: 0 };
    quill.setSelection(range.index, range.length, Quill.sources.SILENT);

    const toggleInline = (formatKey: 'bold' | 'italic' | 'underline' | 'strike') => {
      const current = quill.getFormat(range) as any;
      const next = !current?.[formatKey];
      if (range.length > 0) {
        quill.formatText(range.index, range.length, formatKey, next, Quill.sources.USER);
      } else {
        quill.format(formatKey, next, Quill.sources.USER);
      }
    };

    const applyInlineValue = (formatKey: 'font' | 'size' | 'color' | 'background' | 'link', nextValue: any) => {
      if (range.length > 0) {
        quill.formatText(range.index, range.length, formatKey, nextValue, Quill.sources.USER);
      } else {
        quill.format(formatKey, nextValue, Quill.sources.USER);
      }
    };

    switch (action) {
      case 'undo':
        quill.history.undo();
        break;
      case 'redo':
        quill.history.redo();
        break;
      case 'bold':
        toggleInline('bold');
        break;
      case 'italic':
        toggleInline('italic');
        break;
      case 'underline':
        toggleInline('underline');
        break;
      case 'strike':
        toggleInline('strike');
        break;
      case 'font':
        applyInlineValue('font', value || false);
        break;
      case 'size':
        applyInlineValue('size', value || false);
        break;
      case 'color':
        applyInlineValue('color', value || false);
        break;
      case 'background':
        applyInlineValue('background', value || false);
        break;
      case 'align':
        quill.formatLine(range.index, Math.max(1, range.length), 'align', value || false, Quill.sources.USER);
        break;
      case 'list': {
        const current = quill.getFormat(range) as any;
        const next = current?.list === value ? false : value || false;
        quill.formatLine(range.index, Math.max(1, range.length), 'list', next, Quill.sources.USER);
        break;
      }
      case 'indent':
        quill.formatLine(range.index, Math.max(1, range.length), 'indent', value || false, Quill.sources.USER);
        break;
      case 'link': {
        const current = quill.getFormat(range) as any;
        const existing = typeof current?.link === 'string' ? current.link : '';
        const entered = globalThis.prompt('Enter link URL', existing);
        if (entered === null) break;
        const url = normalizeLinkUrl(entered);
        applyInlineValue('link', url || false);
        break;
      }
      case 'clean':
        quill.removeFormat(range.index, Math.max(1, range.length), Quill.sources.USER);
        break;
    }

    quill.setSelection(range.index, range.length, Quill.sources.SILENT);
  };

  return (
    <div className="flex-grow flex flex-col items-center bg-slate-100 dark:bg-slate-950/40 pb-16 overflow-y-auto no-scrollbar w-full border-r border-slate-200 dark:border-slate-800">
      <style>{`
        .paged-page .ql-container { border: none !important; height: 100% !important; font-size: 14px !important; }
        .paged-page .ql-editor { padding: 0 !important; overflow: hidden !important; line-height: 1.6 !important; }
        .paged-page .ql-editor p { margin-bottom: 0.5rem !important; }
        .paged-page .ql-toolbar { display: none !important; }

        .ql-editor .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif; }
        .ql-editor .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
        .ql-editor .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }

        /* Custom printing overrides */
        @media print {
          .paged-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            page-break-after: always !important;
          }
        }
      `}</style>

      {/* stacked page formatting toolbars */}
      <div className="w-full sticky top-0 z-25 shadow-sm">
        {pages.map((p) => (
          <CustomToolbar
            key={`toolbar_${p.id}`}
            toolbarId={`editor-toolbar-${p.id}`}
            isActive={p.id === activePageId}
            pageId={p.id}
            applyToolbarAction={applyToolbarAction}
          />
        ))}
      </div>

      {/* stacked paper sheets */}
      <div className="flex flex-col items-center gap-6 w-full pt-1.5">
        {pages.map((p, pageIndex) => {
          const totalPages = pages.length;
          const bodyHeightPx = getBodyHeightPx(pageIndex, totalPages);
          const isLastPage = pageIndex === totalPages - 1;

          return (
            <div
              key={p.id}
              className="paged-page bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col"
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                padding: `${PAGE_PADDING_Y_PX}px ${PAGE_PADDING_X_PX}px`,
                boxSizing: 'border-box',
              }}
              onMouseDown={() => setActivePageId(p.id)}
            >
              {/* HEADER (Page 1 Seal logo details or Datestamp only) */}
              {pageIndex === 0 && showHeader && (
                <div ref={headerMeasureRef}>
                  <LetterHeader options={headerOptions} />
                </div>
              )}
              {pageIndex === 0 && showDateOnly && (
                <div ref={dateMeasureRef}>
                  <DateOnlyHeader />
                </div>
              )}

              {/* LETTER STRUCTURES (Page 1 Heading, To Address, Subject) */}
              {pageIndex === 0 && (
                <div
                  ref={letterBlocksMeasureRef}
                  className="space-y-4 mb-4 select-none pb-4"
                >
                  {/* Letter Title */}
                  {letterTitle && (
                    <div
                      className="text-center font-bold tracking-wide uppercase text-slate-800 dark:text-slate-100"
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}
                    >
                      {letterTitle}
                    </div>
                  )}
                  {/* To Address */}
                  {toAddress && (
                    <div className="text-left text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {toAddress}
                    </div>
                  )}
                  {/* Re Line */}
                  {reLine && (
                    <div className="text-left text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {reLine}
                    </div>
                  )}
                  {/* Subject Line */}
                  {subjectLine && (
                    <div className="text-left text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line">
                      {subjectLine}
                    </div>
                  )}
                </div>
              )}

              {/* RICH EDITING BODY AREA (Fixed height, completely unscrollable, content reflows instead) */}
              <div
                style={{
                  height: `${bodyHeightPx}px`,
                  overflow: 'hidden',
                }}
              >
                <div
                  ref={(el) => {
                    editorElByPageIdRef.current[p.id] = el;
                  }}
                />
              </div>

              {/* SIGNATURE (Last page bottom margin segment) */}
              {signatureOptions.includeSignature && isLastPage && (
                <div ref={signatureMeasureRef}>
                  <SignaturePreview options={signatureOptions} />
                </div>
              )}

              {/* COMPILING FOOTER (Page numbering Page X of Y, Title, Version) */}
              {footerOptions.includeFooter && (
                <div
                  ref={pageIndex === 0 ? footerMeasureRef : undefined}
                  className="absolute left-[48px] right-[48px] bottom-[32px] border-t border-slate-200 dark:border-slate-800 pt-2 h-[44px] flex justify-between items-center text-[10px] text-slate-400 select-none pointer-events-none"
                  style={{ boxSizing: 'border-box' }}
                >
                  <div>
                    {footerOptions.includeDocumentName && (
                      <span>{footerOptions.documentName || 'Orbit Document'}</span>
                    )}
                    {footerOptions.includeVersionNumber && footerOptions.version && (
                      <span className="ml-2 font-medium">v{footerOptions.version}</span>
                    )}
                  </div>
                  {footerOptions.includePageNumber && (
                    <span>Page {pageIndex + 1} of {totalPages}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
