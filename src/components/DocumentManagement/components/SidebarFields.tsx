import React, { useState } from 'react';
import { useTemplateEditor } from '../context';
import type { CustomVariable, VariableType, HeaderOptions, FooterOptions, SignatureOptions } from '../types';
import {
  FileText, CreditCard, Signature as SigIcon, FolderHeart, ChevronRight, FileCode,
  Plus, Trash2, Copy, Check, Save, RefreshCw,
} from 'lucide-react';

export const SidebarFields: React.FC = () => {
  const {
    customVariables,
    addCustomVariable,
    removeCustomVariable,
    headerOptions,
    setHeaderOptions,
    footerOptions,
    setFooterOptions,
    signatureOptions,
    setSignatureOptions,
    letterTitle,
    setLetterTitle,
    toAddress,
    setToAddress,
    reLine,
    setReLine,
    subjectLine,
    setSubjectLine,
    activeTab,
    saveTemplate,
    clearCanvas,
  } = useTemplateEditor();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSaveClick = () => {
    setSaveStatus('saving');
    saveTemplate();
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const [activeAccordion, setActiveAccordion] = useState<
    'header' | 'footer' | 'signature' | 'customVars' | 'bodyContent' | ''
  >('header');

  // Custom variable creator state
  const [varName, setVarName] = useState('');
  const [varType, setVarType] = useState<VariableType>('text');
  const [varOptions, setVarOptions] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handlePlaceholderClick = (key: string) => {
    // Dispatch a custom event to insert placeholder at cursor selection inside Quill paginated editor
    const event = new CustomEvent('insert-editor-placeholder', {
      detail: { key },
    });
    window.dispatchEvent(event);
  };

  const handleAddCustomVar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!varName.trim()) return;

    // Convert e.g. "Annual Bonus" -> "annualBonus"
    const key = varName.trim()
      .replace(/\s+(.)/g, (_, group) => group.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/^(.)/, (_, group) => group.toLowerCase())
      .replace(/[^a-zA-Z0-9]/g, '');

    const newVar: CustomVariable = {
      key,
      label: varName.trim(),
      type: varType,
      options: varType === 'dropdown' ? varOptions.split(',').map((o) => o.trim()).filter(Boolean) : undefined,
    };

    addCustomVariable(newVar);
    setVarName('');
    setVarOptions('');
  };

  const handleCopyToken = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`{{${key}}}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const updateHeaderOptions = (data: Partial<HeaderOptions>) => {
    setHeaderOptions({ ...headerOptions, ...data });
  };

  const updateFooterOptions = (data: Partial<FooterOptions>) => {
    setFooterOptions({ ...footerOptions, ...data });
  };

  const updateSignatureOptions = (data: Partial<SignatureOptions>) => {
    setSignatureOptions({ ...signatureOptions, ...data });
  };

  return (
    <div className="w-full flex flex-col h-full bg-slate-50/50 border-r border-slate-200 dark:border-slate-800 dark:bg-slate-900/10 backdrop-blur-md">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-400 dark:text-slate-550 flex items-center space-x-1.5">
          <span>Document management</span>
        </h3>
      </div>

      {/* Accordion Tabs */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">

        {/* TAB 1: LETTERHEAD OPTIONS */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'header' ? '' : 'header')}
            className="w-full px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <FileCode className="text-violet-500" size={13} />
              <span>LETTERHEAD SETTINGS</span>
            </span>
            <ChevronRight
              size={14}
              className={`transform transition-transform duration-200 text-slate-400 ${activeAccordion === 'header' ? 'rotate-90' : ''}`}
            />
          </button>
          {activeAccordion === 'header' && (
            <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <span>Include Letterhead Seal</span>
                <input
                  type="checkbox"
                  checked={headerOptions.includeSeal}
                  onChange={(e) => updateHeaderOptions({ includeSeal: e.target.checked })}
                  className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
              </label>

              {headerOptions.includeSeal && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Company Name</label>
                    <input
                      type="text"
                      value={headerOptions.companyName}
                      onChange={(e) => updateHeaderOptions({ companyName: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Subheading</label>
                    <input
                      type="text"
                      value={headerOptions.subheading || ''}
                      onChange={(e) => updateHeaderOptions({ subheading: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-455">Logo / Seal URL</label>
                    <input
                      type="text"
                      value={headerOptions.logoUrl}
                      onChange={(e) => updateHeaderOptions({ logoUrl: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <span>Show Contact Info</span>
                    <input
                      type="checkbox"
                      checked={headerOptions.includeContactInfo}
                      onChange={(e) => updateHeaderOptions({ includeContactInfo: e.target.checked })}
                      className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                  </label>

                  {headerOptions.includeContactInfo && (
                    <div className="space-y-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Office Address</label>
                        <textarea
                          value={headerOptions.address}
                          onChange={(e) => updateHeaderOptions({ address: e.target.value })}
                          rows={2}
                          className="w-full text-[11px] rounded border border-slate-250 bg-white px-2 py-1 outline-none resize-none dark:border-slate-800 dark:bg-slate-950"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Phone</label>
                        <input
                          type="text"
                          value={headerOptions.phone}
                          onChange={(e) => updateHeaderOptions({ phone: e.target.value })}
                          className="w-full text-[11px] rounded border border-slate-250 bg-white px-2 py-1 outline-none dark:border-slate-800 dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none border-t border-slate-100 dark:border-slate-800/60 pt-2">
                <span>Display Date Stamp</span>
                <input
                  type="checkbox"
                  checked={headerOptions.includeDate}
                  onChange={(e) => updateHeaderOptions({ includeDate: e.target.checked })}
                  className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
              </label>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'bodyContent' ? '' : 'bodyContent')}
            className="w-full px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <FileText className="text-indigo-500" size={13} />
              <span>BODY CONTENT</span>
            </span>
            <ChevronRight
              size={14}
              className={`transform transition-transform duration-200 text-slate-400 ${activeAccordion === 'bodyContent' ? 'rotate-90' : ''}`}
            />
          </button>
          {activeAccordion === 'bodyContent' && (
            <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-455">Letter Title / Heading</label>
                <input
                  type="text"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  placeholder="e.g. OFFER OF EMPLOYMENT"
                  className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-455">To Address Block</label>
                <textarea
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="To,&#10;{{employeeName}},&#10;{{department}}"
                  rows={3}
                  className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-y"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-455">Re: Line <span className="normal-case text-slate-400 font-normal">(Regarding / Client)</span></label>
                <input
                  type="text"
                  value={reLine}
                  onChange={(e) => setReLine(e.target.value)}
                  placeholder="e.g. Re: Appointment as {{designation}}"
                  className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-455">Subject Line</label>
                <textarea
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  placeholder="e.g. Sub: {{employeeName}} | {{department}}"
                  rows={2}
                  className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 2: SIGNATURE SETTINGS */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'signature' ? '' : 'signature')}
            className="w-full px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <SigIcon className="text-amber-500" size={13} />
              <span>SIGNATURE SECTION</span>
            </span>
            <ChevronRight
              size={14}
              className={`transform transition-transform duration-200 text-slate-400 ${activeAccordion === 'signature' ? 'rotate-90' : ''}`}
            />
          </button>
          {activeAccordion === 'signature' && (
            <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <span>Include Signature Area</span>
                <input
                  type="checkbox"
                  checked={signatureOptions.includeSignature}
                  onChange={(e) => updateSignatureOptions({ includeSignature: e.target.checked })}
                  className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
              </label>

              {signatureOptions.includeSignature && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Signatory Manager</label>
                    <input
                      type="text"
                      value={signatureOptions.signerName}
                      onChange={(e) => updateSignatureOptions({ signerName: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Official Designation</label>
                    <input
                      type="text"
                      value={signatureOptions.title}
                      onChange={(e) => updateSignatureOptions({ title: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Signature Style</label>
                    <select
                      value={signatureOptions.signatureStyle}
                      onChange={(e) => updateSignatureOptions({ signatureStyle: e.target.value as any })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <option value="handwritten">Cursive Caveat ✍️</option>
                      <option value="classic">Serif Classic ✒️</option>
                      <option value="typed">Monospace Typed 💻</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* TAB 3: FOOTER SETTINGS */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'footer' ? '' : 'footer')}
            className="w-full px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <FolderHeart className="text-rose-500" size={13} />
              <span>PAGE FOOTERS</span>
            </span>
            <ChevronRight
              size={14}
              className={`transform transition-transform duration-200 text-slate-400 ${activeAccordion === 'footer' ? 'rotate-90' : ''}`}
            />
          </button>
          {activeAccordion === 'footer' && (
            <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-3">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <span>Enable Page Footers</span>
                <input
                  type="checkbox"
                  checked={footerOptions.includeFooter}
                  onChange={(e) => updateFooterOptions({ includeFooter: e.target.checked })}
                  className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
              </label>

              {footerOptions.includeFooter && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Footer Document Name</label>
                    <input
                      type="text"
                      value={footerOptions.documentName || ''}
                      onChange={(e) => updateFooterOptions({ documentName: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-450">Document Version</label>
                    <input
                      type="text"
                      value={footerOptions.version || ''}
                      onChange={(e) => updateFooterOptions({ version: e.target.value })}
                      className="w-full text-xs rounded border border-slate-250 bg-slate-50/50 px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-650 dark:text-slate-400 cursor-pointer select-none">
                    <span>Include Document Name</span>
                    <input
                      type="checkbox"
                      checked={footerOptions.includeDocumentName}
                      onChange={(e) => updateFooterOptions({ includeDocumentName: e.target.checked })}
                      className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-650 dark:text-slate-400 cursor-pointer select-none">
                    <span>Include Version Tag</span>
                    <input
                      type="checkbox"
                      checked={footerOptions.includeVersionNumber}
                      onChange={(e) => updateFooterOptions({ includeVersionNumber: e.target.checked })}
                      className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-655 dark:text-slate-400 cursor-pointer select-none">
                    <span>Include Page Numbering</span>
                    <input
                      type="checkbox"
                      checked={footerOptions.includePageNumber}
                      onChange={(e) => updateFooterOptions({ includePageNumber: e.target.checked })}
                      className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                  </label>
                </>
              )}
            </div>
          )}
        </div>

        {/* TAB 4: CUSTOM VARIABLES */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'customVars' ? '' : 'customVars')}
            className="w-full px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <CreditCard className="text-emerald-500" size={13} />
              <span>CUSTOM VARIABLES</span>
            </span>
            <ChevronRight
              size={14}
              className={`transform transition-transform duration-200 text-slate-400 ${activeAccordion === 'customVars' ? 'rotate-90' : ''}`}
            />
          </button>
          {activeAccordion === 'customVars' && (
            <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-3.5">
              {/* Creator Form */}
              <form onSubmit={handleAddCustomVar} className="space-y-2.5 p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Create Custom Variable</span>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-400">Variable Label</label>
                  <input
                    type="text"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    placeholder="e.g. Monthly HRA"
                    className="w-full text-xs rounded border border-slate-250 bg-white px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-400">Input Type</label>
                  <select
                    value={varType}
                    onChange={(e) => setVarType(e.target.value as VariableType)}
                    className="w-full text-xs rounded border border-slate-250 bg-white px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <option value="text">Text Option 📝</option>
                    <option value="number">Numeric Option 🔢</option>
                    <option value="date">Calendar Date 📅</option>
                    <option value="dropdown">Dropdown List ☰</option>
                  </select>
                </div>

                {varType === 'dropdown' && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase dark:text-slate-400">List Options (comma-separated)</label>
                    <input
                      type="text"
                      value={varOptions}
                      onChange={(e) => setVarOptions(e.target.value)}
                      placeholder="e.g. Meets, Exceeds, Outstanding"
                      className="w-full text-xs rounded border border-slate-250 bg-white px-2 py-1 outline-none focus:border-indigo-500 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-300"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!varName.trim()}
                  className="w-full flex items-center justify-center space-x-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={12} />
                  <span>Register Variable</span>
                </button>
              </form>

              {/* Custom Variables List */}
              <div className="space-y-2 pt-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Variables</span>
                {customVariables.length > 0 ? (
                  <div className="space-y-2">
                    {customVariables.map((v) => (
                      <div
                        key={v.key}
                        onClick={() => handlePlaceholderClick(v.key)}
                        className="flex items-center justify-between p-2 rounded-lg border border-indigo-150 bg-indigo-50/10 hover:bg-indigo-50/30 dark:border-indigo-950/40 dark:bg-indigo-950/5 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors group"
                        title="Click to insert at editor selection"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{v.label}</span>
                            <span className="text-[8px] font-semibold bg-indigo-100 text-indigo-700 px-1 rounded uppercase tracking-wide dark:bg-indigo-950 dark:text-indigo-400">
                              {v.type === 'dropdown' ? 'list' : v.type}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-indigo-500 block truncate mt-0.5">{`{{${v.key}}}`}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={(e) => handleCopyToken(e, v.key)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Copy Token"
                          >
                            {copiedKey === v.key ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomVariable(v.key);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete Variable"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic text-center p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">No custom variables created yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Actions */}
      <div className="p-4 border-t border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/40 flex flex-col gap-2.5">
        {/* Save Template Button */}
        <button
          onClick={handleSaveClick}
          disabled={saveStatus === 'saving'}
          className={`w-full flex items-center justify-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer ${
            saveStatus === 'saved'
              ? 'bg-emerald-500 text-white shadow-emerald-500/10'
              : saveStatus === 'saving'
              ? 'bg-slate-450 text-slate-100 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/10 hover:shadow-lg'
          }`}
        >
          {saveStatus === 'saving' ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : saveStatus === 'saved' ? (
            <Check size={13} />
          ) : (
            <Save size={13} />
          )}
          <span>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Template'}
          </span>
        </button>

        {/* Clear Canvas / Reset */}
        {activeTab === 'edit' && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the canvas? Your existing layout blocks will be wiped.')) {
                clearCanvas();
              }
            }}
            className="w-full flex items-center justify-center space-x-2 rounded-xl border border-rose-100 hover:border-rose-300 bg-rose-50/20 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:border-rose-950/40 dark:bg-rose-950/10 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            title="Wipe Canvas"
          >
            <Trash2 size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default SidebarFields;
