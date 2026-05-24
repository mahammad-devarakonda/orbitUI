/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Block, BlockType, Template, CustomVariable, HeaderOptions, FooterOptions, SignatureOptions } from './types';
import { compileBlockHTML, DEMO_TEMPLATES } from './utils';
import Quill from 'quill';

export interface TemplateEditorContextType {
  templateName: string;
  templateCategory: string;
  blocks: Block[];
  selectedBlockId: string | null;
  activeTab: 'edit' | 'preview';
  autosave: boolean;
  canUndo: boolean;
  canRedo: boolean;
  placeholders: string[];
  customVariables: CustomVariable[];
  headerOptions: HeaderOptions;
  footerOptions: FooterOptions;
  signatureOptions: SignatureOptions;
  contentHtml: string;
  contentDelta: string;
  letterTitle: string;
  toAddress: string;
  reLine: string;
  subjectLine: string;
  setTemplateName: (name: string) => void;
  setTemplateCategory: (category: string) => void;
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, data: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  selectBlock: (id: string | null) => void;
  setActiveTab: (tab: 'edit' | 'preview') => void;
  toggleAutosave: () => void;
  undo: () => void;
  redo: () => void;
  loadDemo: (type: 'offer' | 'hike' | 'promotion' | 'experience') => void;
  saveTemplate: () => void;
  clearCanvas: () => void;
  addCustomVariable: (variable: CustomVariable) => void;
  removeCustomVariable: (key: string) => void;
  setHeaderOptions: (opts: HeaderOptions) => void;
  setFooterOptions: (opts: FooterOptions) => void;
  setSignatureOptions: (opts: SignatureOptions) => void;
  setContentDelta: (delta: string) => void;
  setContentHtml: (html: string) => void;
  setLetterTitle: (title: string) => void;
  setToAddress: (address: string) => void;
  setReLine: (re: string) => void;
  setSubjectLine: (sub: string) => void;
}

const TemplateEditorContext = createContext<TemplateEditorContextType | undefined>(undefined);

const defaultHeaderOptions: HeaderOptions = {
  companyName: '',
  subheading: '',
  logoUrl: '',
  address: '',
  phone: '',
  website: '',
  includeSeal: false,
  includeContactInfo: false,
  includeDate: false,
};

const defaultFooterOptions: FooterOptions = {
  includeFooter: false,
  includeDocumentName: false,
  includeVersionNumber: false,
  includePageNumber: false,
  documentName: '',
  version: '',
};

const defaultSignatureOptions: SignatureOptions = {
  includeSignature: false,
  signerName: '',
  title: '',
  signatureStyle: 'handwritten',
};

const defaultInitialBodyHtml = '';

export const TemplateEditorProvider: React.FC<{
  children: React.ReactNode;
  initialTemplate?: Partial<Template>;
  presets?: Record<string, any>;
  onSave?: (template: Template) => void;
  onAutosave?: (template: Template) => void;
}> = ({ children, initialTemplate, presets: _presets = {}, onSave, onAutosave }) => {
  // Helper to convert legacy blocks to template options on initialization
  const parseInitialTemplate = () => {
    let parsedHeader = { ...defaultHeaderOptions };
    let parsedFooter = { ...defaultFooterOptions };
    let parsedSignature = { ...defaultSignatureOptions };
    let parsedLetterTitle = '';
    let parsedToAddress = '';
    let parsedReLine = '';
    let parsedSubjectLine = '';
    let parsedBodyHtml = '';

    if (initialTemplate?.blocks && initialTemplate.blocks.length > 0) {
      initialTemplate.blocks.forEach((block: any) => {
        if (block.type === 'header') {
          parsedHeader = {
            companyName: block.companyName || '',
            subheading: 'block',
            logoUrl: block.logoUrl || '',
            address: block.address || '',
            phone: '+91 40 4488 9900',
            website: 'www.orbit.tech',
            includeSeal: true,
            includeContactInfo: true,
            includeDate: true,
          };
          parsedLetterTitle = block.title || '';
        } else if (block.type === 'footer') {
          parsedFooter = {
            includeFooter: true,
            includeDocumentName: true,
            includeVersionNumber: true,
            includePageNumber: true,
            documentName: initialTemplate.name || '',
            version: '1.0.0',
          };
        } else if (block.type === 'signature') {
          parsedSignature = {
            includeSignature: true,
            signerName: block.signerName || '',
            title: block.title || '',
            signatureStyle: block.signatureStyle || 'handwritten',
          };
        } else {
          // Compile other blocks into body content
          parsedBodyHtml += compileBlockHTML(block);
        }
      });

      if (initialTemplate.name?.toLowerCase().includes('offer')) {
        parsedLetterTitle = 'Offer Letter';
        parsedToAddress = 'To,\n{{employeeName}},\n{{address}}';
        parsedReLine = 'Re: Offer of Employment';
        parsedSubjectLine = 'Sub: {{employeeName}} | {{department}}';
      } else if (initialTemplate.name?.toLowerCase().includes('hike')) {
        parsedLetterTitle = 'COMPENSATION ADJUSTMENT LETTER';
        parsedToAddress = 'To,\n{{employeeName}},\n{{address}}';
        parsedReLine = 'Re: Compensation Increment & Appraisal Review';
        parsedSubjectLine = 'Sub: {{employeeName}} | {{department}}';
      } else if (initialTemplate.name?.toLowerCase().includes('promotion')) {
        parsedLetterTitle = 'LETTER OF PROMOTION';
        parsedToAddress = 'To,\n{{employeeName}},\n{{address}}';
        parsedReLine = 'Re: Promotion to {{designation}}';
        parsedSubjectLine = 'Sub: {{employeeName}} | {{department}}';
      } else if (initialTemplate.name?.toLowerCase().includes('experience')) {
        parsedLetterTitle = 'TO WHOMSOEVER IT MAY CONCERN';
        parsedToAddress = 'To,\n{{employeeName}},\n{{address}}';
        parsedReLine = 'Re: Certificate of Employment & Experience';
        parsedSubjectLine = 'Sub: {{employeeName}} | {{department}}';
      }
    }

    return {
      headerOptions: initialTemplate?.headerOptions || parsedHeader,
      footerOptions: initialTemplate?.footerOptions || parsedFooter,
      signatureOptions: initialTemplate?.signatureOptions || parsedSignature,
      letterTitle: initialTemplate?.letterTitle || parsedLetterTitle,
      toAddress: initialTemplate?.toAddress || parsedToAddress,
      reLine: initialTemplate?.reLine || parsedReLine,
      subjectLine: initialTemplate?.subjectLine || parsedSubjectLine,
      contentHtml: initialTemplate?.contentHtml || parsedBodyHtml || defaultInitialBodyHtml,
    };
  };

  const defaults = parseInitialTemplate();

  const [templateName, setTemplateNameState] = useState(initialTemplate?.name || 'Untitled Document');
  const [templateCategory, setTemplateCategoryState] = useState(initialTemplate?.category || 'General');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [autosave, setAutosave] = useState(true);

  // Custom manual variables state
  const [customVariables, setCustomVariables] = useState<CustomVariable[]>(initialTemplate?.customVariables || []);

  // Page layout state models
  const [headerOptions, setHeaderOptions] = useState<HeaderOptions>(defaults.headerOptions);
  const [footerOptions, setFooterOptions] = useState<FooterOptions>(defaults.footerOptions);
  const [signatureOptions, setSignatureOptions] = useState<SignatureOptions>(defaults.signatureOptions);

  // Structured Letter Body Elements
  const [letterTitle, setLetterTitle] = useState(defaults.letterTitle);
  const [toAddress, setToAddress] = useState(defaults.toAddress);
  const [reLine, setReLine] = useState(defaults.reLine);
  const [subjectLine, setSubjectLine] = useState(defaults.subjectLine);

  // Unified document editors content delta & HTML
  const [contentHtml, setContentHtml] = useState<string>(defaults.contentHtml);

  const [contentDelta, setContentDelta] = useState<string>(() => {
    if (initialTemplate?.contentDelta) return initialTemplate.contentDelta;
    // Compile defaults HTML to standard Quill delta
    const tempQuill = new Quill(document.createElement('div'));
    tempQuill.root.innerHTML = defaults.contentHtml;
    return JSON.stringify(tempQuill.getContents());
  });

  // Backward compatibility adapter: expose blocks matching types.ts signatures
  const blocks: Block[] = [
    {
      id: 'b_body',
      type: 'body',
      content: contentHtml,
    } as any,
  ];

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [placeholders, setPlaceholders] = useState<string[]>([]);

  // Scan and parse dynamic curly braces variables in the editor content dynamically
  useEffect(() => {
    const placeholdersSet = new Set<string>();
    const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
    let match;

    // Scan body HTML
    while ((match = regex.exec(contentHtml)) !== null) {
      placeholdersSet.add(match[1]);
    }

    // Scan Header & Letter Structures
    [
      headerOptions.companyName,
      headerOptions.address,
      letterTitle,
      toAddress,
      reLine,
      subjectLine
    ].forEach((t) => {
      while ((match = regex.exec(t)) !== null) {
        placeholdersSet.add(match[1]);
      }
    });

    // Scan Footer / Signatures
    [footerOptions.documentName || '', signatureOptions.signerName, signatureOptions.title].forEach((t) => {
      while ((match = regex.exec(t)) !== null) {
        placeholdersSet.add(match[1]);
      }
    });

    setPlaceholders(Array.from(placeholdersSet));
  }, [contentHtml, headerOptions, footerOptions, signatureOptions, letterTitle, toAddress, reLine, subjectLine]);

  const setTemplateName = (name: string) => setTemplateNameState(name);
  const setTemplateCategory = (category: string) => setTemplateCategoryState(category);
  const toggleAutosave = () => setAutosave((prev) => !prev);
  const selectBlock = (id: string | null) => setSelectedBlockId(id);

  // Mocks for structural layout methods to maintain absolute backward compatibility
  const addBlock = () => { };
  const removeBlock = () => { };
  const moveBlock = () => { };
  const undo = () => { };
  const redo = () => { };

  // Custom Variable Creator methods
  const addCustomVariable = (variable: CustomVariable) => {
    setCustomVariables((prev) => {
      if (prev.some((v) => v.key === variable.key)) return prev;
      return [...prev, variable];
    });
  };

  const removeCustomVariable = (key: string) => {
    setCustomVariables((prev) => prev.filter((v) => v.key !== key));
  };

  // Adapter method: Called by Quill editor page state to sync live updates
  const updateBlock = (_id: string, data: Partial<Block>) => {
    if (data && 'contentHtml' in data) {
      setContentHtml((data as any).contentHtml);
    }
    if (data && 'contentDelta' in data) {
      setContentDelta((data as any).contentDelta);
    }
  };

  // Clears A4 page workspace and resets all structural settings to clean defaults
  const clearCanvas = () => {
    setContentHtml('');
    const emptyDelta = { ops: [{ insert: '\n' }] };
    setContentDelta(JSON.stringify(emptyDelta));
    
    // Reset all structured letter properties
    setLetterTitle('');
    setToAddress('');
    setReLine('');
    setSubjectLine('');
    
    // Reset options
    setHeaderOptions(defaultHeaderOptions);
    setFooterOptions(defaultFooterOptions);
    setSignatureOptions(defaultSignatureOptions);
    
    // Reset template info
    setTemplateNameState('Untitled Document');
    setTemplateCategoryState('General');
    
    // Clear all custom variables
    setCustomVariables([]);
  };

  // Convert old pre-existing block presets into the paginated editor values
  const loadDemo = (type: 'offer' | 'hike' | 'promotion' | 'experience') => {
    const demo = DEMO_TEMPLATES[type];
    if (!demo) return;

    setTemplateNameState(demo.name);
    setTemplateCategoryState(demo.category);

    let compiledBodyHtml = '';
    let parsedHeader: HeaderOptions = { ...defaultHeaderOptions };
    let parsedFooter: FooterOptions = { ...defaultFooterOptions };
    let parsedSignature: SignatureOptions = { ...defaultSignatureOptions };

    demo.blocks.forEach((block: any) => {
      if (block.type === 'header') {
        parsedHeader = {
          companyName: block.companyName,
          subheading: block.subheading,
          logoUrl: block.logoUrl || '',
          address: block.address,
          phone: block.phone,
          website: block.website,
          includeSeal: block.includeSeal,
          includeContactInfo: block.includeContactInfo,
          includeDate: block.includeDate,
        };
      } else if (block.type === 'footer') {
        parsedFooter = {
          includeFooter: true,
          includeDocumentName: true,
          includeVersionNumber: true,
          includePageNumber: true,
          documentName: demo.name,
          version: demo.version,
        };
      } else if (block.type === 'signature') {
        parsedSignature = {
          includeSignature: true,
          signerName: block.signerName,
          title: block.title,
          signatureStyle: block.signatureStyle || 'handwritten',
        };
      } else {
        // Body blocks compile to a single HTML content area
        compiledBodyHtml += compileBlockHTML(block);
      }
    });

    if (type === 'offer') {
      setLetterTitle('Offer Letter');
      setToAddress('To,\n{{employeeName}},\n{{address}}');
      setReLine('Re: Offer of Employment');
      setSubjectLine('Sub: {{employeeName}} | {{department}}');
    } else if (type === 'hike') {
      setLetterTitle('COMPENSATION ADJUSTMENT LETTER');
      setToAddress('To,\n{{employeeName}},\n{{address}}');
      setReLine('Re: Compensation Increment & Appraisal Review');
      setSubjectLine('Sub: {{employeeName}} | {{department}}');
    } else if (type === 'promotion') {
      setLetterTitle('LETTER OF PROMOTION');
      setToAddress('To,\n{{employeeName}},\n{{address}}');
      setReLine('Re: Promotion to {{designation}}');
      setSubjectLine('Sub: {{employeeName}} | {{department}}');
    } else if (type === 'experience') {
      setLetterTitle('TO WHOMSOEVER IT MAY CONCERN');
      setToAddress('To,\n{{employeeName}},\n{{address}}');
      setReLine('Re: Certificate of Employment & Experience');
      setSubjectLine('Sub: {{employeeName}} | {{department}}');
    }

    setHeaderOptions(parsedHeader);
    setFooterOptions(parsedFooter);
    setSignatureOptions(parsedSignature);
    setContentHtml(compiledBodyHtml);

    // Convert compiled body HTML to standard Quill delta format
    const tempQuill = new Quill(document.createElement('div'));
    tempQuill.root.innerHTML = compiledBodyHtml;
    setContentDelta(JSON.stringify(tempQuill.getContents()));
  };

  const saveTemplate = useCallback(() => {
    const finalizedTemplate: Template = {
      id: initialTemplate?.id || 'tpl_' + Math.random().toString(36).substr(2, 9),
      name: templateName,
      category: templateCategory,
      headerOptions,
      footerOptions,
      signatureOptions,
      letterTitle,
      toAddress,
      reLine,
      subjectLine,
      contentHtml,
      contentDelta,
      placeholders,
      customVariables,
      createdAt: initialTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(finalizedTemplate);
    }
  }, [initialTemplate, templateName, templateCategory, headerOptions, footerOptions, signatureOptions, letterTitle, toAddress, reLine, subjectLine, contentHtml, contentDelta, placeholders, customVariables, onSave]);

  // Debounced autosave routine
  useEffect(() => {
    if (!autosave || !onAutosave) return;

    const delayDebounceFn = setTimeout(() => {
      const finalizedTemplate: Template = {
        id: initialTemplate?.id || 'tpl_' + Math.random().toString(36).substr(2, 9),
        name: templateName,
        category: templateCategory,
        headerOptions,
        footerOptions,
        signatureOptions,
        letterTitle,
        toAddress,
        reLine,
        subjectLine,
        contentHtml,
        contentDelta,
        placeholders,
        customVariables,
        createdAt: initialTemplate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAutosave(finalizedTemplate);
    }, 4000);

    return () => clearTimeout(delayDebounceFn);
  }, [contentHtml, contentDelta, templateName, templateCategory, headerOptions, footerOptions, signatureOptions, letterTitle, toAddress, reLine, subjectLine, autosave, onAutosave, initialTemplate, placeholders, customVariables]);

  return (
    <TemplateEditorContext.Provider
      value={{
        templateName,
        templateCategory,
        blocks,
        selectedBlockId,
        activeTab,
        autosave,
        placeholders,
        customVariables,
        headerOptions,
        footerOptions,
        signatureOptions,
        contentHtml,
        contentDelta,
        letterTitle,
        toAddress,
        reLine,
        subjectLine,
        canUndo: false,
        canRedo: false,
        setTemplateName,
        setTemplateCategory,
        addBlock,
        updateBlock,
        removeBlock,
        moveBlock,
        selectBlock,
        setActiveTab,
        toggleAutosave,
        undo,
        redo,
        loadDemo,
        saveTemplate,
        clearCanvas,
        addCustomVariable,
        removeCustomVariable,
        setHeaderOptions,
        setFooterOptions,
        setSignatureOptions,
        setContentDelta,
        setContentHtml,
        setLetterTitle,
        setToAddress,
        setReLine,
        setSubjectLine,
      }}
    >
      {children}
    </TemplateEditorContext.Provider>
  );
};

export const useTemplateEditor = () => {
  const context = useContext(TemplateEditorContext);
  if (!context) {
    throw new Error('useTemplateEditor must be used within a TemplateEditorProvider');
  }
  return context;
};
