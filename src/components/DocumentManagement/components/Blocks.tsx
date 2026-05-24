import React from 'react';
import type { Block, TitleBlockData, ParagraphBlockData, DividerBlockData, TableBlockData, SignatureBlockData, FooterBlockData, HeaderBlockData } from '../types';
import { useTemplateEditor } from '../context';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface BlockWrapperProps {
  block: Block;
  children: React.ReactNode;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, children }) => {
  const { selectedBlockId, selectBlock, removeBlock, moveBlock, blocks } = useTemplateEditor();
  const isSelected = selectedBlockId === block.id;

  const index = blocks.findIndex((b) => b.id === block.id);
  const isFirst = index === 0;
  const isLast = index === blocks.length - 1;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      className={`group relative my-4 rounded-xl border p-5 transition-all duration-300 ${isSelected
        ? 'border-indigo-500 bg-indigo-50/10 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/30'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
        } dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700`}
    >
      {/* Floating Action Bar */}
      <div className="absolute -top-3.5 right-4 z-10 flex items-center space-x-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, 'up');
            }}
            disabled={isFirst}
            className={`rounded p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900 ${isFirst ? 'text-slate-300 dark:text-slate-800 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400'
              }`}
            title="Move Block Up"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, 'down');
            }}
            disabled={isLast}
            className={`rounded p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900 ${isLast ? 'text-slate-300 dark:text-slate-800 cursor-not-allowed' : 'text-slate-500 dark:text-slate-400'
              }`}
            title="Move Block Down"
          >
            <ChevronDown size={14} />
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(block.id);
            }}
            className="rounded p-1 text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title="Delete Block"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Block Type Badge */}
      <div className="absolute -top-2.5 left-4 flex items-center space-x-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <span>{block.type}</span>
      </div>

      {children}
    </div>
  );
};

// 1. Header Block Component
export const HeaderBlock: React.FC<{ data: HeaderBlockData }> = ({ data }) => {
  return (
    <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-3 dark:border-slate-800">
      <div className="space-y-1.5 flex-1 pr-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {data.companyName || <span className="text-slate-300 dark:text-slate-700 italic">Enter Company Name</span>}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          {data.address || <span className="text-slate-300 dark:text-slate-700 italic">Enter Company Address</span>}
        </p>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">
          {data.dateField || 'Date: {{date}}'}
        </p>
      </div>

      {data.logoUrl ? (
        <div className="h-16 w-16 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950 flex items-center justify-center">
          <img src={data.logoUrl} alt="Logo" className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="h-16 w-16 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 dark:border-slate-800 dark:text-slate-600 bg-slate-50 dark:bg-slate-950/20">
          <span className="text-[10px] text-center px-1">No Logo</span>
        </div>
      )}
    </div>
  );
};

// 2. Title Block Component
export const TitleBlock: React.FC<{ data: TitleBlockData }> = ({ data }) => {
  const getAlignmentClass = () => {
    if (data.align === 'center') return 'text-center';
    if (data.align === 'right') return 'text-right';
    return 'text-left';
  };

  const getHeadingStyle = () => {
    if (data.level === 1) return 'text-2xl font-bold text-slate-950 dark:text-white';
    if (data.level === 3) return 'text-base font-semibold text-slate-800 dark:text-slate-300';
    return 'text-lg font-bold text-slate-900 dark:text-slate-200'; // Default level 2
  };

  return (
    <div className={`py-1 ${getAlignmentClass()}`}>
      <h3 className={getHeadingStyle()}>
        {data.text || <span className="text-slate-300 dark:text-slate-700 italic">Subheading Title</span>}
      </h3>
    </div>
  );
};

// 3. Paragraph Block Component
export const ParagraphBlock: React.FC<{ data: ParagraphBlockData }> = ({ data }) => {
  return (
    <div className="py-1">
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {data.text || <span className="text-slate-300 dark:text-slate-700 italic">Enter paragraph text here...</span>}
      </p>
    </div>
  );
};

// 4. Divider Block Component
export const DividerBlock: React.FC<{ data: DividerBlockData }> = ({ data }) => {
  const getStyleClass = () => {
    if (data.style === 'dashed') return 'border-dashed';
    if (data.style === 'dotted') return 'border-dotted';
    return 'border-solid';
  };

  return (
    <div className="py-2">
      <hr
        className={`w-full ${getStyleClass()}`}
        style={{
          borderColor: data.color || '#e2e8f0',
          borderTopWidth: `${data.thickness || 1}px`,
          borderBottomWidth: '0px',
        }}
      />
    </div>
  );
};

// 5. Signature Block Component
export const SignatureBlock: React.FC<{ data: SignatureBlockData }> = ({ data }) => {
  return (
    <div className="my-3 flex flex-col items-start space-y-1.5">
      <div className="h-10 flex items-end">
        {data.signatureStyle === 'handwritten' ? (
          <span className="font-semibold text-blue-600 dark:text-blue-400" style={{ fontFamily: "'Caveat', 'Reenie Beanie', cursive", fontSize: '1.75rem', lineHeight: '1' }}>
            {data.signerName || 'Signature'}
          </span>
        ) : data.signatureStyle === 'classic' ? (
          <span className="font-semibold text-lg text-slate-900 dark:text-slate-300 border-b border-slate-300 dark:border-slate-700 pb-0.5 italic">
            {data.signerName || 'Signature'}
          </span>
        ) : (
          <span className="font-mono text-sm text-slate-500">
            /s/ {data.signerName || 'Signature'}
          </span>
        )}

      </div>
      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{data.signerName || 'Name'}</div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500">{data.title || 'Authorized Representative'}</div>
    </div>
  );
};

// 6. Table Block Component
export const TableBlock: React.FC<{ data: TableBlockData }> = ({ data }) => {
  return (
    <div className="my-2 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            {data.headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                {h || <span className="text-slate-300 dark:text-slate-700 italic">Header {i + 1}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {data.rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300">
                  {cell || <span className="text-slate-300 dark:text-slate-700 italic">Cell</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 7. Footer Block Component
export const FooterBlock: React.FC<{ data: FooterBlockData }> = ({ data }) => {
  return (
    <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
      <div className="flex justify-between items-end mb-5">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Regards,</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white">
            {data.hrName || <span className="text-slate-300 dark:text-slate-700 italic">HR Representative</span>}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Human Resources Team</p>
        </div>
        <div className="text-right">
          <div className="h-8 flex items-end justify-end mb-1">
            <span className="font-semibold text-xl text-blue-600 dark:text-blue-400" style={{ fontFamily: "'Caveat', cursive", lineHeight: '1' }}>
              {data.hrName || 'Jane Smith'}
            </span>
          </div>

          <p className="text-[10px] font-semibold text-slate-500 border-t border-slate-200 pt-1 w-32 text-center dark:border-slate-800 dark:text-slate-400">
            {data.signatureText || 'Authorized Signature'}
          </p>
        </div>
      </div>
      {data.footerNotes && (
        <p className="text-[10px] text-slate-400 italic text-center mb-2 dark:text-slate-500 leading-normal">
          {data.footerNotes}
        </p>
      )}
      {data.contactInfo && (
        <p className="text-[10px] text-slate-400 text-center dark:text-slate-500 leading-normal">
          {data.contactInfo}
        </p>
      )}
    </div>
  );
};
