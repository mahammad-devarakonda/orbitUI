import React from 'react';
import { TemplateEditorPage } from './TemplateEditorPage';

export const TemplateCanvas: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col min-h-0 relative">
      <TemplateEditorPage />
    </div>
  );
};
export default TemplateCanvas;
