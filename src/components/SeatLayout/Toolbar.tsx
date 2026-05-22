import React, { useState } from 'react';
import { useSeatLayoutEditor } from './context';
import type { SeatType, PricingCategory } from './types';
import { Stack } from '../Stack';
import { Typography } from '../Typography/Typography';
import { Input } from '../Input/Input';
import { Square, Footprints, Ban, AlertTriangle } from 'lucide-react';

const presetColors = [
    { name: 'Silver', value: 'bg-slate-300 dark:bg-slate-500' },
    { name: 'Gold', value: 'bg-yellow-300 dark:bg-yellow-500' },
    { name: 'VIP', value: 'bg-amber-400 dark:bg-amber-500' },
    { name: 'Emerald', value: 'bg-emerald-400 dark:bg-emerald-500' },
    { name: 'Indigo', value: 'bg-indigo-400 dark:bg-indigo-500' },
    { name: 'Rose', value: 'bg-rose-400 dark:bg-rose-500' },
    { name: 'Purple', value: 'bg-purple-400 dark:bg-purple-500' },
];

export const Toolbar: React.FC = () => {
    const {
        layout,
        readOnly,
        activeCategory,
        activeType,
        categories,
        setActiveCategory,
        setActiveType,
        updateDimensions,
        toggleDividerRow,
        toggleDividerCol,
        addCategory,
        removeCategory,
        updateDividerName
    } = useSeatLayoutEditor();

    const [newCatName, setNewCatName] = useState('');
    const [selectedColor, setSelectedColor] = useState('bg-slate-300 dark:bg-slate-500');

    const handleAddCategory = () => {
        if (!newCatName.trim() || readOnly) return;
        const id = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
        const newCat: PricingCategory = {
            id,
            name: newCatName.trim(),
            color: selectedColor
        };
        addCategory(newCat);
        setNewCatName('');
        // Automatically select the newly created category
        setActiveCategory(id);
        setActiveType('seat');
    };

    const seatTypes = [
        { id: 'seat', name: 'Normal Seat', icon: Square, color: 'text-slate-500 dark:text-slate-400' },
        { id: 'aisle', name: 'Walking Path', icon: Footprints, color: 'text-blue-500 dark:text-blue-400' },
        { id: 'blocked', name: 'Blocked Seat', icon: Ban, color: 'text-slate-800 dark:text-slate-200' },
        { id: 'damaged', name: 'Damaged Seat', icon: AlertTriangle, color: 'text-red-500 dark:text-red-400' },
    ];

    const handleDimChange = (type: 'rows' | 'cols', value: string) => {
        if (!layout || readOnly) return;
        const num = parseInt(value) || 1;
        updateDimensions(
            type === 'rows' ? num : layout.dimensions.rows,
            type === 'cols' ? num : layout.dimensions.cols
        );
    };

    return (
        <Stack className="p-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-72 space-y-6 overflow-y-auto h-full shrink-0 custom-scrollbar select-none">
            {/* Dimensions Section */}
            <Stack className="space-y-3">
                <Typography
                    variant="caption"
                    weight="extrabold"
                    className="uppercase tracking-[0.2em] text-[10px] text-slate-400 dark:text-slate-500"
                >
                    Grid Dimensions
                </Typography>
                <Stack direction="row" spacing={3}>
                    <Input
                        label="Rows"
                        type="number"
                        min="1"
                        max="30"
                        value={layout?.dimensions.rows.toString() || '10'}
                        onChange={(e) => handleDimChange('rows', e.target.value)}
                        disabled={readOnly}
                        className="flex-1"
                    />
                    <Input
                        label="Cols"
                        type="number"
                        min="1"
                        max="40"
                        value={layout?.dimensions.cols.toString() || '15'}
                        onChange={(e) => handleDimChange('cols', e.target.value)}
                        disabled={readOnly}
                        className="flex-1"
                    />
                </Stack>
            </Stack>

            {/* Pricing Categories */}
            <Stack className="space-y-3">
                <Typography
                    variant="caption"
                    weight="extrabold"
                    className="uppercase tracking-[0.2em] text-[10px] text-slate-400 dark:text-slate-500"
                >
                    Pricing Categories
                </Typography>
                <Stack className="space-y-1.5">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id && activeType === 'seat';
                        const isDefault = ['silver', 'gold', 'vip'].includes(cat.id);
                        return (
                            <div
                                key={cat.id}
                                className="group/cat relative"
                            >
                                <div
                                    onClick={() => {
                                        if (readOnly) return;
                                        setActiveCategory(cat.id);
                                        setActiveType('seat');
                                    }}
                                    className={`flex items-center space-x-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border pr-8
                                        ${
                                            isActive
                                                ? 'bg-white dark:bg-slate-800 shadow-md border-purple-200 dark:border-purple-800 ring-1 ring-purple-100 dark:ring-transparent scale-[1.02]'
                                                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                                        }`}
                                >
                                    {cat.color.startsWith('bg-') ? (
                                        <div className={`w-5 h-5 rounded-lg ${cat.color} border border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700`} />
                                    ) : (
                                        <div
                                            className="w-5 h-5 rounded-lg border border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                    )}
                                    <Typography
                                        variant="body2"
                                        weight={isActive ? 'bold' : 'medium'}
                                        className="capitalize text-slate-700 dark:text-slate-200 truncate flex-1"
                                    >
                                        {cat.name}
                                    </Typography>
                                </div>
                                {!readOnly && !isDefault && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCategory(cat.id);
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/cat:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer border-none bg-transparent"
                                        title="Delete Category"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </Stack>

                {/* Create Custom Category Form */}
                {!readOnly && (
                    <Stack className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <Typography variant="caption" weight="extrabold" className="uppercase tracking-[0.15em] text-[9px] text-slate-400">
                            Create Custom Category
                        </Typography>
                        <Stack className="space-y-2">
                            <Input
                                placeholder="Category name (e.g. Platinum, Regular)"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                className="w-full text-xs"
                            />
                            
                            <Stack className="space-y-1">
                                <Typography variant="caption" className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">
                                    Select Color
                                </Typography>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    {presetColors.map((colorObj) => {
                                        const isSelected = selectedColor === colorObj.value;
                                        return (
                                            <button
                                                key={colorObj.value}
                                                type="button"
                                                onClick={() => setSelectedColor(colorObj.value)}
                                                className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-200 border border-transparent shadow-sm hover:scale-110 ${colorObj.value}
                                                    ${isSelected ? 'ring-2 ring-purple-600 ring-offset-1 dark:ring-offset-slate-900 scale-105' : 'opacity-80 hover:opacity-100'}`}
                                                title={colorObj.name}
                                            />
                                        );
                                    })}
                                    {/* Custom Hex Color Picker */}
                                    <label
                                        className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden hover:scale-110 shadow-sm relative
                                            ${!presetColors.some(c => c.value === selectedColor) ? 'ring-2 ring-purple-600 ring-offset-1 dark:ring-offset-slate-900 scale-105' : ''}`}
                                        style={{ backgroundColor: !presetColors.some(c => c.value === selectedColor) ? selectedColor : '#ffffff' }}
                                        title="Pick Custom Color"
                                    >
                                        <input
                                            type="color"
                                            value={selectedColor.startsWith('#') ? selectedColor : '#a855f7'}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold pointer-events-none">+</span>
                                    </label>
                                </div>
                            </Stack>

                            <button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={!newCatName.trim()}
                                className="w-full py-1.5 px-3 text-[10px] uppercase tracking-wider font-extrabold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:text-slate-400 disabled:dark:text-slate-600 rounded-xl transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed text-center border-none"
                            >
                                Add Category
                            </button>
                        </Stack>
                    </Stack>
                )}
            </Stack>

            {/* Special Seat Types */}
            <Stack className="space-y-3">
                <Typography
                    variant="caption"
                    weight="extrabold"
                    className="uppercase tracking-[0.2em] text-[10px] text-slate-400 dark:text-slate-500"
                >
                    Special Seat Types
                </Typography>
                <Stack className="space-y-1.5">
                    {seatTypes.map((type) => {
                        const isNormalSeat = type.id === 'seat';
                        const isActive = activeType === type.id && (!isNormalSeat || !activeCategory);

                        return (
                            <div
                                key={type.id}
                                onClick={() => {
                                    if (readOnly) return;
                                    setActiveType(type.id as SeatType);
                                    if (isNormalSeat) {
                                        setActiveCategory('');
                                    }
                                }}
                                className={`flex items-center space-x-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border
                                    ${
                                        isActive
                                            ? 'bg-white dark:bg-slate-800 shadow-md border-purple-200 dark:border-purple-800 ring-1 ring-purple-100 dark:ring-transparent scale-[1.02]'
                                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 shadow-sm ${type.color}`}>
                                    <type.icon size={14} />
                                </div>
                                <Typography
                                    variant="body2"
                                    weight={isActive ? 'bold' : 'medium'}
                                    className="text-slate-700 dark:text-slate-200"
                                >
                                    {type.name}
                                </Typography>
                            </div>
                        );
                    })}
                </Stack>
            </Stack>

            {/* Stage Dividers */}
            <Stack className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Typography
                    variant="caption"
                    weight="extrabold"
                    className="uppercase tracking-[0.2em] text-[10px] text-slate-400 dark:text-slate-500"
                >
                    Stage Dividers
                </Typography>
                <Typography variant="caption" className="leading-relaxed text-slate-500 dark:text-slate-400">
                    Toggle rows to act as stage dividers. Dividers split pricing sections visually and aren't lettered.
                </Typography>

                {layout ? (
                    <>
                        <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-0.5">
                            {Array.from({ length: layout.dimensions.rows }).map((_, r) => {
                                const dividerRows = layout.dividerRows || [];
                                const isDivider = dividerRows.includes(r);

                                let currentLetterCode = 65;
                                let label = '';
                                for (let idx = 0; idx <= r; idx++) {
                                    const isRowDiv = dividerRows.includes(idx);
                                    if (idx === r) {
                                        if (isRowDiv) {
                                            label = 'Divider';
                                        } else {
                                            let tempCode = currentLetterCode - 65;
                                            const repeatCount = Math.floor(tempCode / 26) + 1;
                                            const letter = String.fromCharCode(65 + (tempCode % 26));
                                            label = `Row ${letter.repeat(repeatCount)}`;
                                        }
                                    } else if (!isRowDiv) {
                                        currentLetterCode++;
                                    }
                                }

                                return (
                                    <button
                                        key={`toggle_div_${r}`}
                                        onClick={() => toggleDividerRow(r)}
                                        disabled={readOnly}
                                        className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl border text-center transition-all duration-300 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                                            ${
                                                isDivider
                                                    ? 'bg-purple-600 border-purple-600 text-white shadow-purple-100 dark:shadow-none scale-[1.03]'
                                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 hover:text-slate-800'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {layout.dividerRows && layout.dividerRows.length > 0 && (
                            <Stack className="space-y-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <Typography
                                    variant="caption"
                                    weight="bold"
                                    className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
                                >
                                    Stage / Section Names
                                </Typography>
                                <Stack className="space-y-2">
                                    {layout.dividerRows.map((r) => {
                                        let currentLetterCode = 65;
                                        let rowLabel = '';
                                        for (let idx = 0; idx <= r; idx++) {
                                            const isRowDiv = layout.dividerRows!.includes(idx);
                                            if (idx === r) {
                                                if (isRowDiv) {
                                                    const letter = String.fromCharCode(65 + (currentLetterCode - 65));
                                                    rowLabel = `Row ${letter}`;
                                                }
                                            } else if (!isRowDiv) {
                                                currentLetterCode++;
                                            }
                                        }
                                        return (
                                            <Stack key={`name_div_${r}`} direction="row" alignItems="center" spacing={2} className="w-full">
                                                <Typography variant="caption" className="w-14 text-slate-500 font-bold shrink-0 text-[10px]">
                                                    {rowLabel || `Row ${r + 1}`}
                                                </Typography>
                                                <Input
                                                    placeholder="e.g. Balcony, Front"
                                                    value={layout.dividerNames?.[r] || ''}
                                                    onChange={(e) => updateDividerName(r, e.target.value)}
                                                    disabled={readOnly}
                                                    className="flex-1 text-xs"
                                                />
                                            </Stack>
                                        );
                                    })}
                                </Stack>
                            </Stack>
                        )}
                    </>
                ) : (
                    <Typography variant="caption" className="text-slate-400">
                        No layout initialized.
                    </Typography>
                )}
            </Stack>

            {/* Column Dividers */}
            <Stack className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Typography
                    variant="caption"
                    weight="extrabold"
                    className="uppercase tracking-[0.2em] text-[10px] text-slate-400 dark:text-slate-500"
                >
                    Column Dividers
                </Typography>
                <Typography variant="caption" className="leading-relaxed text-slate-500 dark:text-slate-400">
                    Toggle columns to act as vertical dividers. Column dividers create space between seats.
                </Typography>

                {layout ? (
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-0.5">
                        {Array.from({ length: layout.dimensions.cols }).map((_, c) => {
                            const dividerCols = layout.dividerCols || [];
                            const isDivider = dividerCols.includes(c);

                            let currentColNumber = 1;
                            let label = '';
                            for (let idx = 0; idx <= c; idx++) {
                                const isColDiv = dividerCols.includes(idx);
                                if (idx === c) {
                                    if (isColDiv) {
                                        label = 'Divider';
                                    } else {
                                        label = `Col ${currentColNumber}`;
                                    }
                                } else if (!isColDiv) {
                                    currentColNumber++;
                                }
                            }

                            return (
                                <button
                                    key={`toggle_div_col_${c}`}
                                    onClick={() => toggleDividerCol(c)}
                                    disabled={readOnly}
                                    className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl border text-center transition-all duration-300 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                                        ${
                                            isDivider
                                                ? 'bg-purple-600 border-purple-600 text-white shadow-purple-100 dark:shadow-none scale-[1.03]'
                                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 hover:text-slate-800'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <Typography variant="caption" className="text-slate-400">
                        No layout initialized.
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};

export default Toolbar;
