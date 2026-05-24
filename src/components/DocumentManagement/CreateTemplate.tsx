import React from 'react';
import { TemplateEditorProvider, useTemplateEditor } from './context';
import { SidebarFields } from './components/SidebarFields';
import { TemplateCanvas } from './components/TemplateCanvas';
import { PreviewPanel } from './components/PreviewPanel';
import type { Template } from './types';

interface CreateTemplateProps {
  initialTemplate?: Partial<Template>;
  onSave?: (template: Template) => void;
  onAutosave?: (template: Template) => void;
}

// Inner builder component to split visual modes based on activeTab state
const TemplateBuilderInner: React.FC = () => {
  const { activeTab } = useTemplateEditor();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950">
      {/* 2. Layout Workspace Grid */}
      <div className="flex-grow flex min-h-0 relative">
        {activeTab === 'edit' ? (
          <>
            {/* Left Sidebar Layout Blocks */}
            <div className="w-[280px] flex-shrink-0 hidden md:block">
              <SidebarFields />
            </div>

            {/* Center Paper Canvas Workspace */}
            <TemplateCanvas />
          </>
        ) : (
          /* Live Interactive Preview Workspace */
          <PreviewPanel />
        )}
      </div>
    </div>
  );
};

export const CreateTemplate: React.FC<CreateTemplateProps> = ({
  initialTemplate,
  onSave,
  onAutosave,
}) => {
  return (
    <TemplateEditorProvider
      initialTemplate={initialTemplate}
      onSave={onSave}
      onAutosave={onAutosave}
    >
      <div className="w-full h-full flex flex-col text-slate-800 dark:text-slate-250 select-none overflow-hidden" style={{ minHeight: '640px' }}>
        <TemplateBuilderInner />
      </div>
    </TemplateEditorProvider>
  );
};
export default CreateTemplate;
