import React, { useRef, useEffect, useCallback } from 'react';
import type { BodyBlockData } from '../types';
import { useTemplateEditor } from '../context';
import { getPlaceholderLabel } from '../utils';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface BodyBlockProps {
  data: BodyBlockData;
}

// Convert raw text with {{placeholder}} to visual HTML badges
const rawToVisualBadges = (html: string): string => {
  if (!html) return '';
  return html.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    const label = getPlaceholderLabel(key);
    return `<span class="mx-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-default select-none dark:bg-indigo-950/80 dark:text-indigo-400 dark:border-indigo-900/60" contenteditable="false" data-placeholder="${key}">${label}</span>`;
  });
};

// Convert visual HTML badges back to raw text {{placeholder}}
const visualBadgesToRaw = (html: string): string => {
  if (!html) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const badges = tempDiv.querySelectorAll('span[data-placeholder]');
  badges.forEach((badge) => {
    const placeholder = badge.getAttribute('data-placeholder');
    if (placeholder) {
      badge.replaceWith(`{{${placeholder}}}`);
    }
  });

  return tempDiv.innerHTML;
};

export const BodyBlock: React.FC<BodyBlockProps> = ({ data }) => {
  const { updateBlock } = useTemplateEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Initialize and synchronise editor content when data from store/props changes
  useEffect(() => {
    const visualHTML = rawToVisualBadges(data.content);
    if (editorRef.current && editorRef.current.innerHTML !== visualHTML) {
      editorRef.current.innerHTML = visualHTML;
    }
  }, [data.content]);

  // Save selection range for placeholder insertion
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Ensure selection is inside our editor
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range;
      }
    }
  }, []);

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      const rawHTML = visualBadgesToRaw(currentHTML);
      updateBlock(data.id, { content: rawHTML });
      saveSelection();
    }
  }, [data.id, updateBlock, saveSelection]);

  const executeCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
      document.execCommand(command, false, value);
      handleEditorInput();
    }
  };

  // Inserts a custom placeholder as an atomic visual badge
  const insertPlaceholder = useCallback((key: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      const label = getPlaceholderLabel(key);
      const badgeHTML = `<span class="mx-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-default select-none dark:bg-indigo-950/80 dark:text-indigo-400 dark:border-indigo-900/60" contenteditable="false" data-placeholder="${key}">${label}</span>&nbsp;`;

      let range = savedRangeRef.current;
      const sel = window.getSelection();

      if (sel) {
        if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
          // If no range is selected or it is outside, move cursor to the end of editor
          range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // collapse to end
        }

        sel.removeAllRanges();
        sel.addRange(range);
        range.deleteContents();

        // Create document fragment to insert
        const el = document.createElement('div');
        el.innerHTML = badgeHTML;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        
        range.insertNode(frag);

        if (lastNode) {
          const newRange = document.createRange();
          newRange.setStartAfter(lastNode);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
          savedRangeRef.current = newRange;
        }
      }

      handleEditorInput();
    }
  }, [handleEditorInput]);

  // Expose placeholder insertion globally for Left Panel clicks
  useEffect(() => {
    const handleInsertPlaceholderEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string }>;
      insertPlaceholder(customEvent.detail.key);
    };

    window.addEventListener('insert-editor-placeholder', handleInsertPlaceholderEvent);
    return () => {
      window.removeEventListener('insert-editor-placeholder', handleInsertPlaceholderEvent);
    };
  }, [insertPlaceholder]);

  return (
    <div className="w-full space-y-2">
      {/* Editor Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2.5 dark:border-slate-800">
        <button
          onClick={() => executeCommand('bold')}
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>
        <button
          onClick={() => executeCommand('italic')}
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>
        <button
          onClick={() => executeCommand('underline')}
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline size={15} />
        </button>
        
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        
        <button
          onClick={() => executeCommand('insertUnorderedList')}
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title="Bullet List"
        >
          <List size={15} />
        </button>
        <button
          onClick={() => executeCommand('insertOrderedList')}
          onMouseDown={(e) => e.preventDefault()}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Quick Insert Actions */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1.5">Insert:</span>
          {['employeeName', 'designation', 'salary', 'joiningDate'].map((p) => (
            <button
              key={p}
              onClick={() => insertPlaceholder(p)}
              onMouseDown={(e) => e.preventDefault()}
              className="rounded bg-indigo-50 border border-indigo-100 text-[10px] font-semibold text-indigo-700 px-1.5 py-0.5 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:border-indigo-900/60 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-all"
            >
              {p === 'employeeName' ? 'Name 👤' : p === 'designation' ? 'Role 💼' : p === 'salary' ? 'Salary 💰' : 'Date 📅'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        onBlur={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className="min-h-[160px] max-h-[380px] overflow-y-auto px-1 py-1 text-sm leading-relaxed text-slate-700 outline-none focus:ring-0 dark:text-slate-300 prose prose-slate max-w-none"
        style={{
          minHeight: '160px',
        }}
      />
    </div>

  );
};

