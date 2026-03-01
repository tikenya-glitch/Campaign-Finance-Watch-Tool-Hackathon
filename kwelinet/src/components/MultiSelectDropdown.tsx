import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface MultiSelectProps {
    label: string;
    options: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

export default function MultiSelectDropdown({ label, options, selectedValues, onChange, placeholder }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [wrapperRef]);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    const toggleOption = (option: string) => {
        if (selectedValues.includes(option)) {
            onChange(selectedValues.filter(v => v !== option));
        } else {
            onChange([...selectedValues, option]);
        }
    };

    const isAllSelected = selectedValues.length === options.length && options.length > 0;

    const toggleAll = () => {
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    };

    const displayText = selectedValues.length === 0
        ? (placeholder || label)
        : selectedValues.length === options.length
            ? `All ${label}s`
            : selectedValues.length <= 2
                ? selectedValues.join(', ')
                : `${selectedValues.length} selected`;

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white border border-slate-300 p-2 rounded text-sm text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[42px]"
            >
                <span className="truncate pr-2 font-medium">{displayText}</span>
                <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-80 flex flex-col">
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50 rounded-t-md">
                        <Search size={14} className="text-slate-400" />
                        <input
                            type="text"
                            className="w-full outline-none text-sm bg-transparent"
                            placeholder="Type to search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="overflow-y-auto p-1 flex-1">
                        {searchTerm === '' && (
                            <div
                                className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer text-sm font-bold border-b border-slate-100 mb-1"
                                onClick={toggleAll}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isAllSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                    {isAllSelected && <Check size={12} className="text-white stroke-[3]" />}
                                </div>
                                Select All
                            </div>
                        )}
                        {filteredOptions.length === 0 ? (
                            <div className="p-4 text-sm text-slate-500 text-center">No results found</div>
                        ) : (
                            filteredOptions.map(opt => {
                                const isSelected = selectedValues.includes(opt);
                                return (
                                    <div
                                        key={opt}
                                        className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors rounded-sm"
                                        onClick={() => toggleOption(opt)}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                            {isSelected && <Check size={12} className="text-white stroke-[3]" />}
                                        </div>
                                        <span className={`truncate ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
