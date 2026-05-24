import React from 'react';
import { useTemplateEditor } from '../context';
import type { Block, DividerBlockData, HeaderBlockData, TitleBlockData, ParagraphBlockData, SignatureBlockData, TableBlockData, FooterBlockData } from '../types';
import { Settings, Hash, Sliders, Plus, Trash2 } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const {
    templateName,
    templateCategory,
    blocks,
    selectedBlockId,
    autosave,
    placeholders,
    setTemplateName,
    setTemplateCategory,
    updateBlock,
    selectBlock,
    toggleAutosave,
  } = useTemplateEditor();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Helper to update selected block properties
  const updateSelectedBlock = (data: Partial<Block>) => {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, data);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-50/50 border-l border-slate-200 dark:border-slate-800 dark:bg-slate-900/10 backdrop-blur-md overflow-y-auto no-scrollbar">
      {/* Properties Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
        <Settings size={15} className="text-slate-400 dark:text-slate-500 animate-spin" style={{ animationDuration: '8s' }} />
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300">
          {selectedBlock ? 'Block Properties' : 'Global Settings'}
        </h3>
      </div>

      <div className="p-4 flex-1 space-y-5">
        {/* CASE 1: NO BLOCK SELECTED -> SHOW GLOBAL CONFIG */}
        {!selectedBlock ? (
          <>
            {/* Template Info */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <Sliders size={12} className="mr-1.5 text-indigo-500" /> TEMPLATE CONFIGURATION
              </h4>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Autosave Changes</span>
                  <button
                    onClick={toggleAutosave}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      autosave ? 'bg-indigo-600' : 'bg-slate-350 dark:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        autosave ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Scanned Placeholders */}
            <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <Hash size={12} className="mr-1.5 text-indigo-500" /> ACTIVE VARIABLES
              </h4>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal">
                These variables are dynamically scanned from the editor blocks and will be replaced during document compilation.
              </p>
              {placeholders.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {placeholders.map((ph) => (
                    <span
                      key={ph}
                      className="text-[9px] font-mono font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900 px-2 py-0.5 rounded"
                    >
                      {`{{${ph}}}`}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border-2 border-dashed border-slate-100 rounded-lg dark:border-slate-800/40 bg-slate-50/20">
                  <p className="text-[10px] text-slate-400 italic">No variables found. Add standard placeholders in layout content.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* CASE 2: BLOCK IS SELECTED -> SHOW PROPERTIES SPECIFIC TO BLOCK */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Active Selection
              </span>
              <button
                onClick={() => selectBlock(null)}
                className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Back to Settings
              </button>
            </div>

            {/* HEADER BLOCK PROPERTIES */}
            {selectedBlock.type === 'header' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">HEADER DETAILS</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Company Name</label>
                    <input
                      type="text"
                      value={(selectedBlock as HeaderBlockData).companyName}
                      onChange={(e) => updateSelectedBlock({ companyName: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Company Address</label>
                    <textarea
                      value={(selectedBlock as HeaderBlockData).address}
                      onChange={(e) => updateSelectedBlock({ address: e.target.value })}
                      rows={2}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Document Title</label>
                    <input
                      type="text"
                      value={(selectedBlock as HeaderBlockData).title}
                      onChange={(e) => updateSelectedBlock({ title: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Date Format</label>
                    <input
                      type="text"
                      value={(selectedBlock as HeaderBlockData).dateField}
                      onChange={(e) => updateSelectedBlock({ dateField: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-455 uppercase dark:text-slate-400">Logo Image URL</label>
                    <input
                      type="text"
                      value={(selectedBlock as HeaderBlockData).logoUrl || ''}
                      onChange={(e) => updateSelectedBlock({ logoUrl: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TITLE BLOCK PROPERTIES */}
            {selectedBlock.type === 'title' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">TITLE CONFIGURATION</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Text Content</label>
                    <input
                      type="text"
                      value={(selectedBlock as TitleBlockData).text}
                      onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-455 uppercase dark:text-slate-400">Size / Level</label>
                    <select
                      value={(selectedBlock as TitleBlockData).level}
                      onChange={(e) => updateSelectedBlock({ level: parseInt(e.target.value, 10) as 1 | 2 | 3 })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      <option value={1}>Heading H1 (Large)</option>
                      <option value={2}>Heading H2 (Medium)</option>
                      <option value={3}>Heading H3 (Small)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Alignment</label>
                    <div className="flex bg-slate-100 rounded-lg p-0.5 dark:bg-slate-950">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => updateSelectedBlock({ align })}
                          className={`flex-1 flex justify-center py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                            (selectedBlock as TitleBlockData).align === align
                              ? 'bg-white shadow text-indigo-600 dark:bg-slate-900 dark:text-indigo-400'
                              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PARAGRAPH BLOCK PROPERTIES */}
            {selectedBlock.type === 'paragraph' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">PARAGRAPH CLAUSE</h4>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Clause Text</label>
                  <textarea
                    value={(selectedBlock as ParagraphBlockData).text}
                    onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                    rows={6}
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-y"
                  />
                </div>
              </div>
            )}

            {/* DIVIDER BLOCK PROPERTIES */}
            {selectedBlock.type === 'divider' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">LINE DIVIDER PROPERTIES</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Line Style</label>
                    <select
                      value={(selectedBlock as DividerBlockData).style}
                      onChange={(e) => updateSelectedBlock({ style: e.target.value as 'solid' | 'dashed' | 'dotted' })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      <option value="solid">Solid Line</option>
                      <option value="dashed">Dashed Line</option>
                      <option value="dotted">Dotted Line</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Thickness (px)</label>
                    <input
                      type="number"
                      value={(selectedBlock as DividerBlockData).thickness}
                      onChange={(e) => updateSelectedBlock({ thickness: parseInt(e.target.value, 10) })}
                      min={1}
                      max={10}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Line Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={(selectedBlock as DividerBlockData).color}
                        onChange={(e) => updateSelectedBlock({ color: e.target.value })}
                        className="h-7 w-7 cursor-pointer rounded border border-slate-200 bg-transparent p-0 outline-none"
                      />
                      <input
                        type="text"
                        value={(selectedBlock as DividerBlockData).color}
                        onChange={(e) => updateSelectedBlock({ color: e.target.value })}
                        className="flex-1 text-xs font-mono font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TABLE BLOCK PROPERTIES */}
            {selectedBlock.type === 'table' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">TABLE ROW BUILDER</h4>
                <div className="space-y-3">
                  {/* Headers Editor */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-455 uppercase dark:text-slate-400">Edit Column Headers</label>
                    <div className="space-y-1.5">
                      {(selectedBlock as TableBlockData).headers.map((h, i) => (
                        <div key={i} className="flex items-center space-x-1.5">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const newHeaders = [...(selectedBlock as TableBlockData).headers];
                              newHeaders[i] = e.target.value;
                              updateSelectedBlock({ headers: newHeaders });
                            }}
                            className="flex-1 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                            placeholder={`Header ${i + 1}`}
                          />
                          <button
                            onClick={() => {
                              if ((selectedBlock as TableBlockData).headers.length > 1) {
                                const newHeaders = (selectedBlock as TableBlockData).headers.filter((_, idx) => idx !== i);
                                const newRows = (selectedBlock as TableBlockData).rows.map((row) => row.filter((_, idx) => idx !== i));
                                updateSelectedBlock({ headers: newHeaders, rows: newRows });
                              }
                            }}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded dark:hover:bg-rose-950/20"
                            title="Delete Column"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const newHeaders = [...(selectedBlock as TableBlockData).headers, `New Header`];
                        const newRows = (selectedBlock as TableBlockData).rows.map((row) => [...row, 'Cell']);
                        updateSelectedBlock({ headers: newHeaders, rows: newRows });
                      }}
                      className="mt-1.5 flex items-center space-x-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Plus size={10} />
                      <span>Add Column</span>
                    </button>
                  </div>

                  {/* Rows Editor */}
                  <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800/60">
                    <label className="text-[9px] font-bold text-slate-455 uppercase dark:text-slate-400">Rows Data ({ (selectedBlock as TableBlockData).rows.length })</label>
                    <div className="space-y-2.5 max-h-[160px] overflow-y-auto no-scrollbar">
                      {(selectedBlock as TableBlockData).rows.map((row, ri) => (
                        <div key={ri} className="flex flex-col space-y-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-900">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Row {ri + 1}</span>
                            <button
                              onClick={() => {
                                const newRows = (selectedBlock as TableBlockData).rows.filter((_, idx) => idx !== ri);
                                updateSelectedBlock({ rows: newRows });
                              }}
                              className="text-rose-500 hover:text-rose-600 text-[10px]"
                              title="Delete Row"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {row.map((cell, ci) => (
                              <input
                                key={ci}
                                type="text"
                                value={cell}
                                onChange={(e) => {
                                  const newRows = [...(selectedBlock as TableBlockData).rows];
                                  newRows[ri] = [...row];
                                  newRows[ri][ci] = e.target.value;
                                  updateSelectedBlock({ rows: newRows });
                                }}
                                className="text-[10px] font-medium rounded border border-slate-200 bg-white px-1.5 py-1 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                placeholder={`Cell ${ci + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const colsCount = (selectedBlock as TableBlockData).headers.length;
                        const emptyRow = Array(colsCount).fill('Cell Data');
                        const newRows = [...(selectedBlock as TableBlockData).rows, emptyRow];
                        updateSelectedBlock({ rows: newRows });
                      }}
                      className="mt-1 flex items-center space-x-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Plus size={10} />
                      <span>Add Row</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SIGNATURE BLOCK PROPERTIES */}
            {selectedBlock.type === 'signature' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">SIGNATURE DETAILS</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Representative Name</label>
                    <input
                      type="text"
                      value={(selectedBlock as SignatureBlockData).signerName}
                      onChange={(e) => updateSelectedBlock({ signerName: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Designation Title</label>
                    <input
                      type="text"
                      value={(selectedBlock as SignatureBlockData).title}
                      onChange={(e) => updateSelectedBlock({ title: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Signature Font Style</label>
                    <select
                      value={(selectedBlock as SignatureBlockData).signatureStyle}
                      onChange={(e) => updateSelectedBlock({ signatureStyle: e.target.value as 'handwritten' | 'classic' | 'typed' })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      <option value="handwritten">Sleek Handwritten</option>
                      <option value="classic">Classic Italics</option>
                      <option value="typed">Monospace Typed (/s/)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER BLOCK PROPERTIES */}
            {selectedBlock.type === 'footer' && (
              <div className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">FOOTER INFORMATION</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">HR Manager Name</label>
                    <input
                      type="text"
                      value={(selectedBlock as FooterBlockData).hrName}
                      onChange={(e) => updateSelectedBlock({ hrName: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Sign Text</label>
                    <input
                      type="text"
                      value={(selectedBlock as FooterBlockData).signatureText || ''}
                      onChange={(e) => updateSelectedBlock({ signatureText: e.target.value })}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Footer Note / Disclaimer</label>
                    <textarea
                      value={(selectedBlock as FooterBlockData).footerNotes || ''}
                      onChange={(e) => updateSelectedBlock({ footerNotes: e.target.value })}
                      rows={3}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase dark:text-slate-400">Contact Details</label>
                    <textarea
                      value={(selectedBlock as FooterBlockData).contactInfo || ''}
                      onChange={(e) => updateSelectedBlock({ contactInfo: e.target.value })}
                      rows={2}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
