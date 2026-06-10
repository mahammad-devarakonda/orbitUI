import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export interface DashboardWidget {
  id: string;
  title: string;
  subtitle?: string;
  colSpan?: 1 | 2 | 3 | 4 | 'full';
  rowSpan?: 1 | 2 | 3;
  content: React.ReactNode;
  onRemove?: () => void;
  headerActions?: React.ReactNode;
}

interface DashboardGridProps {
  items: DashboardWidget[];
  onLayoutChange: (items: DashboardWidget[]) => void;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  onLayoutChange,
  className = '',
  cols = 3,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragEnabledMap, setDragEnabledMap] = useState<Record<string, boolean>>({});

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Create a generic preview or handle opacity changes
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null);
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '1';
    setDragEnabledMap({});
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (!draggedId || draggedId === targetId) return;

    const dragIndex = items.findIndex((item) => item.id === draggedId);
    const hoverIndex = items.findIndex((item) => item.id === targetId);

    if (dragIndex !== -1 && hoverIndex !== -1 && dragIndex !== hoverIndex) {
      const updatedItems = [...items];
      const [removed] = updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, removed);
      onLayoutChange(updatedItems);
    }
  };

  const enableDrag = (id: string) => {
    setDragEnabledMap((prev) => ({ ...prev, [id]: true }));
  };

  const disableDrag = (id: string) => {
    setDragEnabledMap((prev) => ({ ...prev, [id]: false }));
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    widgetId: string,
    startColSpan: number,
    startRowSpan: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const colChange = Math.round(dx / 280);
      const rowChange = Math.round(dy / 200);

      const nextColSpan = Math.max(1, Math.min(cols, startColSpan + colChange)) as 1 | 2 | 3 | 4 | 'full';
      const nextRowSpan = Math.max(1, Math.min(3, startRowSpan + rowChange)) as 1 | 2 | 3;

      const widget = items.find((w) => w.id === widgetId);
      if (widget && (widget.colSpan !== nextColSpan || widget.rowSpan !== nextRowSpan)) {
        const updatedItems = items.map((item) => {
          if (item.id === widgetId) {
            return {
              ...item,
              colSpan: nextColSpan === cols ? 'full' : (nextColSpan as any),
              rowSpan: nextRowSpan,
            };
          }
          return item;
        });
        onLayoutChange(updatedItems);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };


  // Columns layout mapping
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4',
    full: 'col-span-full',
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
  };

  return (
    <div
      className={`grid ${colsClasses[cols]} gap-6 w-full auto-rows-auto ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {items.map((widget) => {
          const isDraggingThis = draggedId === widget.id;
          const dragEnabled = !!dragEnabledMap[widget.id];

          return (
            <motion.div
              key={widget.id}
              layoutId={widget.id}
              layout
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
                mass: 0.8,
              }}
              className={`
                group relative flex flex-col rounded-2xl border bg-white dark:bg-slate-900 
                border-slate-100 dark:border-slate-900/60 shadow-sm overflow-hidden 
                transition-shadow hover:shadow-md
                ${colSpanClasses[widget.colSpan || 1]}
                ${rowSpanClasses[widget.rowSpan || 1]}
                ${isDraggingThis ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950 opacity-40 border-dashed shadow-inner' : ''}
              `}
            >
              <div
                className="w-full h-full flex flex-col"
                draggable={dragEnabled}
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onDragOver={(e) => handleDragOver(e, widget.id)}
                onDragEnter={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
              >
                {/* Premium Drag and Drop Header */}
                <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-900/60 select-none bg-slate-50/50 dark:bg-slate-900/50 ${draggedId ? 'pointer-events-none select-none' : ''}`}>
                  <div className="flex items-center space-x-2.5">
                    {/* Drag Grabber Icon */}
                    <div
                      onMouseEnter={() => enableDrag(widget.id)}
                      onMouseLeave={() => disableDrag(widget.id)}
                      onMouseDown={() => enableDrag(widget.id)}
                      onMouseUp={() => disableDrag(widget.id)}
                      className="p-1 rounded cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition shrink-0"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
                        {widget.title}
                      </h3>
                      {widget.subtitle && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
                          {widget.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {widget.headerActions}
                    {widget.onRemove && (
                      <button
                        onClick={widget.onRemove}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
                        title="Hide widget"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Widget Body Content */}
                <div className={`flex-grow p-6 ${draggedId ? 'pointer-events-none select-none' : ''}`}>
                  {widget.content}
                </div>

                {/* Drag-to-Resize Handle */}
                <div
                  className={`absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 select-none hover:text-slate-650 dark:hover:text-slate-200 transition text-slate-300 dark:text-slate-700 ${draggedId ? 'pointer-events-none' : ''}`}
                  onMouseDown={(e) => {
                    const currentColSpan = widget.colSpan === 'full' ? cols : (widget.colSpan || 1);
                    handleResizeStart(e, widget.id, currentColSpan, widget.rowSpan || 1);
                  }}
                  title="Drag to resize"
                >
                  <svg className="w-2.5 h-2.5 fill-none stroke-current" viewBox="0 0 10 10" strokeWidth="1.5">
                    <line x1="8" y1="2" x2="2" y2="8" />
                    <line x1="8" y1="5" x2="5" y2="8" />
                  </svg>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
