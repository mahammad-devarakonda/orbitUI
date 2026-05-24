import React, { useState } from 'react';
import { useTemplateEditor } from '../context';
import { 
  Save, Trash2, 
  CheckCircle, RefreshCw 
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const {
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

  return (
    <div className="w-full flex items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-md px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/70 z-20">
      {/* Toolbar Left: Actions */}
      <div className="flex items-center space-x-3.5">
        {/* Save Template Button */}
        <button
          onClick={handleSaveClick}
          disabled={saveStatus === 'saving'}
          className={`flex items-center space-x-1.5 rounded-xl px-4.5 py-2 text-xs font-bold shadow-md transition-all ${
            saveStatus === 'saved'
              ? 'bg-emerald-500 text-white shadow-emerald-500/10'
              : saveStatus === 'saving'
              ? 'bg-slate-450 text-slate-100'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/10 hover:shadow-lg'
          }`}
        >
          {saveStatus === 'saving' ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : saveStatus === 'saved' ? (
            <CheckCircle size={13} />
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
            className="rounded-xl border border-rose-100 hover:border-rose-300 bg-rose-50/20 px-3.5 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:border-rose-950/40 dark:bg-rose-950/10 dark:hover:bg-rose-950/30 transition-all flex items-center space-x-1"
            title="Wipe Canvas"
          >
            <Trash2 size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Toolbar Right: Empty */}
      <div />
    </div>
  );
};
