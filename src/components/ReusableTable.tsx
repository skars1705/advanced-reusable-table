import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { Column, SortConfig, FilterConfig, FilterOperator, StringFilterOperator, NumberFilterOperator, DisplayRow, GroupHeaderRow, ViewConfiguration, DateFilterOperator, CollectionFilterOperator, RowSelectionState, RowSelectionConfig, CellRenderContext, CellRenderDecision } from '../types';
import { useTable } from '../hooks/useTable';
import { SortIcon } from './icons/SortIcon';
import { SortUpIcon } from './icons/SortUpIcon';
import { SortDownIcon } from './icons/SortDownIcon';
import { StringOperatorLabels, NumberOperatorLabels, DateOperatorLabels, CollectionOperatorLabels } from '../types';
import { Pagination } from './Pagination';
import { ToggleSwitch } from './ToggleSwitch';
import { FilterIcon } from './icons/FilterIcon';
import { DatePicker } from './DatePicker';
import { CollectionCell } from './CollectionCell';
import { resolveCellRenderer } from '../utils/cellRenderUtils';
import { useStableId } from '../utils/useStableId';

// Enhanced row selection type that supports both old and new formats
type RowSelectionProp<T> = 
  | (RowSelectionState<T> & {
      selectRow: (row: T) => void;
      selectAll: () => void;
      clearSelection: () => void;
    })
  | RowSelectionConfig;

interface ReusableTableProps<T extends object> {
  allColumns: Column<T>[];
  data: T[];
  viewConfig?: ViewConfiguration<T>;
  onUpdateData?: (rowIndex: number, columnId: keyof T, value: any) => void;
  rowSelection?: RowSelectionProp<T>;
}

/**
 * Helper function to create a default ViewConfiguration from column definitions.
 * Extracts all column accessor keys and creates a sensible default view.
 */
const createDefaultViewConfig = <T extends object>(
  allColumns: Column<T>[]
): ViewConfiguration<T> => {
  return {
    id: 'default-view',
    name: 'Default View',
    visibleColumns: allColumns.map(col => col.accessor),
    groupBy: [],
    sortConfig: [],
    filterConfig: [],
  };
};

const SortIndicator = ({ direction, sortOrder }: { direction?: 'ascending' | 'descending', sortOrder?: number }) => {
    return (
        <div className="inline-flex items-center space-x-1">
            {direction === 'ascending' && <SortUpIcon />}
            {direction === 'descending' && <SortDownIcon />}
            {!direction && <SortIcon />}
            {sortOrder && <span className="text-xs font-bold text-indigo-400">{sortOrder}</span>}
        </div>
    );
};

// Parser function to detect operators from keyboard input
const parseOperatorFromInput = (input: string, isNumeric: boolean) => {
    if (!input.trim()) return null;
    
    if (isNumeric) {
        // Range operators (20><50, 20<>50, or 20..50)  
        // Only parse if it looks like a complete range (ends with space or multiple digits)
        const rangeMatch = input.match(/^(\d+\.?\d*)\s*(><|<>|\.\.)\s*(\d+\.?\d*)\s*$/);
        if (rangeMatch) {
            console.log('Range matched:', rangeMatch);
            return {
                operator: 'between' as NumberFilterOperator,
                value: rangeMatch[1],
                secondValue: rangeMatch[3]
            };
        }
        
        // Comparison operators - only parse if there's a value after the operator
        if (input.startsWith('>=') && input.length > 2 && input.slice(2).trim()) {
            return { operator: 'gte' as NumberFilterOperator, value: input.slice(2).trim(), secondValue: '' };
        }
        if (input.startsWith('<=') && input.length > 2 && input.slice(2).trim()) {
            return { operator: 'lte' as NumberFilterOperator, value: input.slice(2).trim(), secondValue: '' };
        }
        if (input.startsWith('!=') && input.length > 2 && input.slice(2).trim()) {
            return { operator: 'neq' as NumberFilterOperator, value: input.slice(2).trim(), secondValue: '' };
        }
        if (input.startsWith('>') && !input.startsWith('>=') && input.length > 1 && input.slice(1).trim()) {
            return { operator: 'gt' as NumberFilterOperator, value: input.slice(1).trim(), secondValue: '' };
        }
        if (input.startsWith('<') && !input.startsWith('<=') && input.length > 1 && input.slice(1).trim()) {
            return { operator: 'lt' as NumberFilterOperator, value: input.slice(1).trim(), secondValue: '' };
        }
        if (input.startsWith('=') && input.length > 1 && input.slice(1).trim()) {
            return { operator: 'eq' as NumberFilterOperator, value: input.slice(1).trim(), secondValue: '' };
        }
    }
    
    // For strings, just return the input as-is for now
    return null;
};

// Function to get display text for current filter
const getFilterDisplayText = (operator: FilterOperator, value: string, secondValue?: string, columnHeader?: string) => {
    if (operator === 'isEmpty') return `${columnHeader} is empty`;
    if (operator === 'between' && secondValue) return `${value} to ${secondValue}`;
    if (operator === 'dateRange' && secondValue) return `${value} to ${secondValue}`;
    
    const operatorText = {
        // String operators
        'contains': 'contains',
        'doesNotContain': 'does not contain',
        'equals': 'equals',
        'startsWith': 'starts with',
        'endsWith': 'ends with',
        // Number operators  
        'eq': '=',
        'neq': '≠',
        'gt': '>',
        'lt': '<',
        'gte': '≥',
        'lte': '≤',
        // Date operators
        'is': 'is',
        'isNot': 'is not',
        'isBefore': 'is before',
        'isAfter': 'is after'
    }[operator] || operator;
    
    return `${operatorText} ${value}`;
};

const FilterControl = <T,>({ column, filter, onFilterChange }: {
    column: Column<T>;
    filter?: FilterConfig<T>;
    onFilterChange: (key: keyof T, operator: FilterOperator, value: string, secondValue?: string, forceRemove?: boolean) => void;
}) => {
    const defaultStringOp: StringFilterOperator = 'contains';
    const defaultNumberOp: NumberFilterOperator = 'eq';
    const defaultDateOp: DateFilterOperator = 'is';
    const defaultCollectionOp: CollectionFilterOperator = 'contains';

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const parseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Determine filter type - use explicit filterType if provided, otherwise infer from dataType
    const effectiveFilterType = column.filterType || (() => {
        switch (column.dataType) {
            case 'number':
            case 'currency':
                return 'number';
            case 'date':
                return 'date';
            case 'datetime':
                return 'date'; // datetime uses date filter with datetime controls
            case 'collection':
                return 'collection';
            default:
                return 'text';
        }
    })();
    
    const isNumeric = effectiveFilterType === 'number' || column.dataType === 'currency';
    const isDate = effectiveFilterType === 'date' || column.dataType === 'date';
    const isDateTime = column.dataType === 'datetime';
    const isCollection = effectiveFilterType === 'collection' || column.dataType === 'collection';
    const isSelect = effectiveFilterType === 'select';
    const isBoolean = effectiveFilterType === 'boolean';
    const currentOperator = filter?.operator || (
        isNumeric ? defaultNumberOp : 
        (isDate || isDateTime) ? defaultDateOp : 
        isCollection ? defaultCollectionOp : 
        defaultStringOp
    );
    const currentValue = filter?.value || '';
    const currentSecondValue = filter?.secondValue || '';
    const isRangeFilter = currentOperator === 'between' || currentOperator === 'dateRange';
    const isEmptyFilter = currentOperator === 'isEmpty';
    const isFilterActive = !!currentValue || !!currentSecondValue || isEmptyFilter;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            // Clean up timeout on unmount
            if (parseTimeoutRef.current) {
                clearTimeout(parseTimeoutRef.current);
            }
        };
    }, []);

    const handleOperatorSelect = (selectedOperator: FilterOperator) => {
        if (selectedOperator === 'isEmpty') {
            // For isEmpty, we don't need any values
            onFilterChange(column.accessor, selectedOperator, '', '');
        } else if (selectedOperator === 'between' || selectedOperator === 'dateRange') {
            // For range operators, always create the filter even with empty values to show both inputs
            onFilterChange(column.accessor, selectedOperator, currentValue, currentSecondValue);
        } else {
            onFilterChange(column.accessor, selectedOperator, currentValue, currentSecondValue);
        }
        setIsPopoverOpen(false);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        console.log('Raw input from event:', input);
        console.log('Input length:', input.length);
        
        // Clear any existing timeout
        if (parseTimeoutRef.current) {
            clearTimeout(parseTimeoutRef.current);
        }
        
        // First, always update with the raw input (no parsing yet)
        console.log('Setting raw input without parsing:', currentOperator, input);
        onFilterChange(column.accessor, currentOperator, input, currentSecondValue);
        
        // Check if this looks like it could be a range operation
        const couldBeRange = isNumeric && (input.includes('<>') || input.includes('><') || input.includes('..'));
        
        if (couldBeRange) {
            // Debounce the parsing for potential ranges to let user finish typing
            parseTimeoutRef.current = setTimeout(() => {
                console.log('Timeout triggered, checking for parsing:', input);
                const parsed = parseOperatorFromInput(input, isNumeric);
                console.log('Delayed parsing result:', parsed);
                
                if (parsed) {
                    console.log('Applying delayed parsing:', parsed.operator, parsed.value, parsed.secondValue);
                    onFilterChange(column.accessor, parsed.operator, parsed.value, parsed.secondValue);
                }
            }, 1000); // Wait 1 second after user stops typing
        } else {
            // For non-range operations, parse immediately
            const parsed = parseOperatorFromInput(input, isNumeric);
            if (parsed) {
                console.log('Immediate parsing for non-range:', parsed.operator, parsed.value, parsed.secondValue);
                onFilterChange(column.accessor, parsed.operator, parsed.value, parsed.secondValue);
            }
        }
    };

    const handleSecondValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(column.accessor, currentOperator, currentValue, e.target.value);
    };

    // DatePicker compatible handlers
    const handleDatePickerValueChange = (value: string) => {
        onFilterChange(column.accessor, currentOperator, value, currentSecondValue);
    };

    const handleDatePickerSecondValueChange = (value: string) => {
        onFilterChange(column.accessor, currentOperator, currentValue, value);
    };

    const handleClearFilter = () => {
        onFilterChange(column.accessor, currentOperator, '', '', true);
    };

    const operators = isNumeric 
        ? Object.entries(NumberOperatorLabels)
        : (isDate || isDateTime)
        ? Object.entries(DateOperatorLabels)
        : isCollection
        ? Object.entries(CollectionOperatorLabels)
        : isBoolean
        ? [['equals', 'Equals'], ['isEmpty', 'Is Empty']]
        : isSelect
        ? [['equals', 'Equals'], ['doesNotContain', 'Does Not Equal'], ['isEmpty', 'Is Empty']]
        : Object.entries(StringOperatorLabels);
    
    // Get current filter display text
    const filterDisplayText = isFilterActive 
        ? getFilterDisplayText(currentOperator, currentValue, currentSecondValue, column.header)
        : null;
    
    return (
        <div className="relative" ref={filterRef}>
            {/* Display current filter status */}
            {filterDisplayText && (
                <div className="mb-1 px-2 py-1 text-xs text-indigo-300 bg-indigo-500/10 rounded border border-indigo-500/20">
                    {column.header}: {filterDisplayText}
                </div>
            )}
            
            {isEmptyFilter ? (
                // For isEmpty filter, just show the operator with a clear button
                <div className="relative">
                    <div className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200 flex items-center justify-between">
                        <span className="text-indigo-300">Is Empty</span>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={handleClearFilter}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                                title="Clear filter"
                            >
                                ✕
                            </button>
                            <button 
                                onClick={() => setIsPopoverOpen(prev => !prev)}
                                className="text-indigo-400 transition-colors"
                                aria-label="Select filter operator"
                            >
                                <FilterIcon />
                            </button>
                        </div>
                    </div>
                </div>
            ) : isRangeFilter ? (
                // For range filters (between, dateRange), show two inputs
                <div className="space-y-1">
                    <div className="relative">
                        {(isDate || isDateTime) ? (
                            <>
                                <DatePicker
                                    value={currentValue}
                                    onChange={handleDatePickerValueChange}
                                    type={isDate ? 'date' : 'datetime-local'}
                                    placeholder={`From...`}
                                    className="pr-16"
                                    aria-label={`Filter from value for ${column.header}`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                                    <button 
                                        onClick={handleClearFilter}
                                        className="text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-error,#ef4444)] transition-colors"
                                        title="Clear filter"
                                    >
                                        ✕
                                    </button>
                                    <button 
                                        onClick={() => setIsPopoverOpen(prev => !prev)}
                                        className={`transition-colors ${isFilterActive ? 'text-[var(--table-color-primary,#6366f1)]' : 'text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-primary,#6366f1)]'}`}
                                        aria-label="Select filter operator"
                                    >
                                        <FilterIcon />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={currentValue}
                                    onChange={handleValueChange}
                                    placeholder={isNumeric ? `From... (or try 20<>50, 20><50)` : `From...`}
                                    className="w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-1 pl-2 pr-16 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Filter from value for ${column.header}`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                                    <button 
                                        onClick={handleClearFilter}
                                        className="text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-error,#ef4444)] transition-colors"
                                        title="Clear filter"
                                    >
                                        ✕
                                    </button>
                                    <button 
                                        onClick={() => setIsPopoverOpen(prev => !prev)}
                                        className={`transition-colors ${isFilterActive ? 'text-[var(--table-color-primary,#6366f1)]' : 'text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-primary,#6366f1)]'}`}
                                        aria-label="Select filter operator"
                                    >
                                        <FilterIcon />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    {(isDate || isDateTime) ? (
                        <DatePicker
                            value={currentSecondValue}
                            onChange={handleDatePickerSecondValueChange}
                            type={isDate ? 'date' : 'datetime-local'}
                            placeholder={`To...`}
                            aria-label={`Filter to value for ${column.header}`}
                        />
                    ) : (
                        <input
                            type="text"
                            value={currentSecondValue}
                            onChange={handleSecondValueChange}
                            placeholder={`To...`}
                            className="w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-1 px-2 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Filter to value for ${column.header}`}
                        />
                    )}
                </div>
            ) : isBoolean ? (
                // For boolean filters, show a select dropdown
                <div className="relative">
                    <select
                        value={currentValue}
                        onChange={(e) => onFilterChange(column.accessor, currentOperator, e.target.value, '')}
                        className="w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-1 px-2 pr-8 text-sm text-[var(--table-color-text,#f3f4f6)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Filter boolean value for ${column.header}`}
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                        {isFilterActive && (
                            <button 
                                onClick={handleClearFilter}
                                className="text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-error,#ef4444)] transition-colors"
                                title="Clear filter"
                            >
                                ✕
                            </button>
                        )}
                        <button 
                            onClick={() => setIsPopoverOpen(prev => !prev)}
                            className={`transition-colors ${isFilterActive ? 'text-[var(--table-color-primary,#6366f1)]' : 'text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-primary,#6366f1)]'}`}
                            aria-label="Select filter operator"
                        >
                            <FilterIcon />
                        </button>
                    </div>
                </div>
            ) : (
                // For regular filters, show single input with clear button
                <div className="relative">
                    {(isDate || isDateTime) ? (
                        <>
                            <DatePicker
                                value={currentValue}
                                onChange={handleDatePickerValueChange}
                                type={isDate ? 'date' : 'datetime-local'}
                                placeholder={`Filter...`}
                                className="pr-16"
                                aria-label={`Filter value for ${column.header}`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                                {isFilterActive && (
                                    <button 
                                        onClick={handleClearFilter}
                                        className="text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-error,#ef4444)] transition-colors"
                                        title="Clear filter"
                                    >
                                        ✕
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsPopoverOpen(prev => !prev)}
                                    className={`transition-colors ${isFilterActive ? 'text-[var(--table-color-primary,#6366f1)]' : 'text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-primary,#6366f1)]'}`}
                                    aria-label="Select filter operator"
                                >
                                    <FilterIcon />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={currentValue}
                                onChange={handleValueChange}
                                placeholder={isNumeric ? `Filter... (try >50, <=100, 20<>50, 20><50)` : `Filter...`}
                                className="w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-1 pl-2 pr-16 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Filter value for ${column.header}`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
                                {isFilterActive && (
                                    <button 
                                        onClick={handleClearFilter}
                                        className="text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-error,#ef4444)] transition-colors"
                                        title="Clear filter"
                                    >
                                        ✕
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsPopoverOpen(prev => !prev)}
                                    className={`transition-colors ${isFilterActive ? 'text-[var(--table-color-primary,#6366f1)]' : 'text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-primary,#6366f1)]'}`}
                                    aria-label="Select filter operator"
                                >
                                    <FilterIcon />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
            
            {isPopoverOpen && (
                <div className="absolute z-20 mt-1 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                    {operators.map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => handleOperatorSelect(value as FilterOperator)}
                            className={`w-full text-left px-3 py-1.5 text-sm ${currentOperator === value ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-gray-700'} transition-colors`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const downloadCSV = (
    data: any[],
    visibleColumns: Column<any>[],
    locale: string,
    filename: string = 'data.csv'
) => {
  if (!data.length || !visibleColumns.length) return;

  const headers = visibleColumns.map(c => c.header);
  const exportLocale = locale === 'default' ? undefined : locale;

  const formatValue = (value: any, column: Column<any>): string => {
    if (value === null || value === undefined) return '';
    if ((column.dataType === 'number' || column.dataType === 'currency') && typeof value === 'number') {
      return value.toLocaleString(exportLocale);
    }
    if (column.dataType === 'date' && typeof value === 'string') {
        try {
            return new Date(value).toLocaleDateString(exportLocale || undefined, { timeZone: 'UTC' });
        } catch {
            return value;
        }
    }
    if (column.dataType === 'datetime' && typeof value === 'string') {
        try {
            return new Date(value).toLocaleString(exportLocale || undefined, { timeZone: 'UTC' });
        } catch {
            return value;
        }
    }
    if (column.dataType === 'collection') {
        const collectionValue = Array.isArray(value) ? value : (value ? [value] : []);
        return collectionValue.join(', ');
    }
    return String(value);
  };

  const sanitize = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      visibleColumns.map(col => {
        const rawValue = row[col.accessor];
        const formattedValue = col.cellType ? (rawValue ? 'true' : 'false') : formatValue(rawValue, col);
        return sanitize(formattedValue);
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Dynamic cell renderer component
const DynamicCell = <T extends object>({
  context,
  isEditing,
  editValue,
  onEditChange,
  onEditKeyDown,
  onEditBlur,
  onUpdateData,
  originalRowIndex
}: {
  context: CellRenderContext<T>;
  isEditing: boolean;
  editValue: any;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEditBlur: () => void;
  onUpdateData?: (rowIndex: number, columnId: keyof T, value: any) => void;
  originalRowIndex: number;
}) => {
  const { column, value: cellValue, row: item } = context;
  
  // Resolve how this cell should be rendered
  const decision = useMemo(() => {
    const result = resolveCellRenderer(context);
    // If it's a React node, wrap it in a decision
    if (React.isValidElement(result) || typeof result === 'string' || typeof result === 'number') {
      return {
        type: 'custom' as const,
        content: result as React.ReactNode,
        editable: column.editable
      };
    }
    return result as CellRenderDecision;
  }, [context]);
  
  // Handle editing mode
  if (isEditing) {
    if (decision.type === 'date' || decision.type === 'datetime') {
      return (
        <DatePicker
          value={decision.type === 'datetime' && typeof editValue === 'string' ? editValue.slice(0, 16) : editValue}
          onChange={(value) => onEditChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
          type={decision.type === 'date' ? 'date' : 'datetime-local'}
          className="w-full"
        />
      );
    } else {
      return (
        <input
          type={decision.type === 'number' || decision.type === 'currency' ? 'number' : 'text'}
          value={editValue}
          onChange={onEditChange}
          onKeyDown={onEditKeyDown}
          onBlur={onEditBlur}
          autoFocus
          className="w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-primary,#6366f1)] rounded-[var(--table-border-radius,0.375rem)] py-1 px-2 text-sm text-[var(--table-color-text,#f3f4f6)] outline-none"
        />
      );
    }
  }
  
  // Handle display mode based on decision
  switch (decision.type) {
    case 'checkbox':
      return onUpdateData ? (
        <input 
          type="checkbox" 
          checked={!!cellValue} 
          onChange={(e) => onUpdateData(originalRowIndex, column.accessor, e.target.checked)} 
          className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500" 
        />
      ) : (
        <span>{cellValue ? 'Yes' : 'No'}</span>
      );
      
    case 'toggle':
      return onUpdateData ? (
        <ToggleSwitch 
          id={`toggle-${String(column.accessor)}-${originalRowIndex}`} 
          isChecked={!!cellValue} 
          onChange={(isChecked) => onUpdateData(originalRowIndex, column.accessor, isChecked)} 
        />
      ) : (
        <span>{cellValue ? 'On' : 'Off'}</span>
      );
      
    case 'collection':
      return decision.collectionConfig ? (
        <CollectionCell
          value={cellValue as string | string[]}
          config={decision.collectionConfig}
          onChange={(newValue) => onUpdateData?.(originalRowIndex, column.accessor, newValue as T[keyof T])}
          disabled={!decision.editable || !onUpdateData}
          initialMode="display"
          showEditButton={decision.editable && !!onUpdateData}
          key={`collection-cell-${originalRowIndex}-${String(column.accessor)}`}
        />
      ) : (
        <span>{Array.isArray(cellValue) ? cellValue.join(', ') : String(cellValue || '')}</span>
      );
      
    case 'currency':
      if (typeof cellValue === 'number' && decision.props?.currencyOptions) {
        return (
          <span>
            {new Intl.NumberFormat(decision.props.currencyOptions.locale, {
              style: 'currency',
              currency: decision.props.currencyOptions.currency,
            }).format(cellValue)}
          </span>
        );
      }
      return <span>{String(cellValue || '')}</span>;
      
    case 'date':
    case 'datetime':
      if (typeof cellValue === 'string' && decision.props?.dateOptions) {
        try {
          return (
            <span>
              {new Intl.DateTimeFormat(decision.props.dateOptions.locale, {
                dateStyle: decision.props.dateOptions.dateStyle,
                timeStyle: decision.props.dateOptions.timeStyle,
                timeZone: 'UTC',
              }).format(new Date(cellValue))}
            </span>
          );
        } catch {
          return <span>{cellValue}</span>;
        }
      }
      return <span>{String(cellValue || '')}</span>;
      
    case 'custom':
      return <>{decision.content}</>;
      
    case 'text':
    case 'number':
    default:
      return <>{decision.content ?? (cellValue as React.ReactNode)}</>;
  }
};


// Helper function to detect row selection format
const isNewRowSelectionFormat = (rowSelection: any): rowSelection is RowSelectionConfig => {
  return rowSelection && typeof rowSelection.enabled === 'boolean' && typeof rowSelection.mode === 'string';
};

export const ReusableTable = <T extends object>({
  allColumns,
  data,
  viewConfig: userViewConfig,
  onUpdateData,
  rowSelection,
}: ReusableTableProps<T>) => {

  // ==========================================
  // PROP VALIDATION - Fail fast with clear error messages
  // ==========================================

  // Validate allColumns
  if (!Array.isArray(allColumns)) {
    throw new Error(
      '[ReusableTable] "allColumns" prop must be an array. ' +
      'Received: ' + (typeof allColumns) + '. ' +
      'Example: [{ header: "Name", accessor: "name", sortable: true }]'
    );
  }

  if (allColumns.length === 0) {
    throw new Error(
      '[ReusableTable] "allColumns" prop must contain at least one column definition. ' +
      'Received an empty array. ' +
      'Example: [{ header: "Name", accessor: "name", sortable: true }]'
    );
  }

  // Validate that all columns have required properties
  allColumns.forEach((col, index) => {
    if (!col || typeof col !== 'object') {
      throw new Error(
        `[ReusableTable] Column at index ${index} is not a valid object. ` +
        'Each column must have at minimum: { header: string, accessor: keyof T }'
      );
    }
    if (!col.header || typeof col.header !== 'string') {
      throw new Error(
        `[ReusableTable] Column at index ${index} is missing required "header" property (must be a string). ` +
        `Received: ${JSON.stringify(col)}`
      );
    }
    if (col.accessor === undefined || col.accessor === null) {
      throw new Error(
        `[ReusableTable] Column at index ${index} is missing required "accessor" property. ` +
        `Column header: "${col.header}". The accessor must match a key in your data object.`
      );
    }
  });

  // Validate data
  if (!Array.isArray(data)) {
    throw new Error(
      '[ReusableTable] "data" prop must be an array. ' +
      'Received: ' + (typeof data) + '. ' +
      'Pass an empty array [] if you have no data to display.'
    );
  }

  // Create default viewConfig if not provided
  const viewConfig = useMemo(() => {
    if (!userViewConfig) {
      console.warn(
        '[ReusableTable] No viewConfig provided. Using auto-generated default with all columns visible. ' +
        'For production use, please provide an explicit viewConfig prop.'
      );
      return createDefaultViewConfig(allColumns);
    }
    return {
      id: userViewConfig.id || 'default-view',
      name: userViewConfig.name || 'Default View',
      visibleColumns: userViewConfig.visibleColumns || allColumns.map(col => col.accessor),
      groupBy: userViewConfig.groupBy || [],
      sortConfig: userViewConfig.sortConfig || [],
      filterConfig: userViewConfig.filterConfig || [],
    };
  }, [userViewConfig, allColumns]);

  // Validate viewConfig structure only if user provided it explicitly
  if (userViewConfig) {
    if (typeof userViewConfig !== 'object') {
      throw new Error(
        '[ReusableTable] "viewConfig" prop must be an object. ' +
        'Received: ' + (typeof userViewConfig) + '. ' +
        'Example: { id: "default", name: "Default View", visibleColumns: ["name"], groupBy: [], sortConfig: [], filterConfig: [] }'
      );
    }

    if (userViewConfig.id && typeof userViewConfig.id !== 'string') {
      throw new Error(
        '[ReusableTable] "viewConfig.id" must be a string. ' +
        'Received: ' + (typeof userViewConfig.id)
      );
    }

    if (userViewConfig.name && typeof userViewConfig.name !== 'string') {
      throw new Error(
        '[ReusableTable] "viewConfig.name" must be a string. ' +
        'Received: ' + (typeof userViewConfig.name)
      );
    }

    if (userViewConfig.visibleColumns && !Array.isArray(userViewConfig.visibleColumns)) {
      throw new Error(
        '[ReusableTable] "viewConfig.visibleColumns" must be an array of column accessors. ' +
        'Received: ' + (typeof userViewConfig.visibleColumns) + '. ' +
        'Example: ["name", "email", "status"]'
      );
    }

    if (userViewConfig.visibleColumns && userViewConfig.visibleColumns.length === 0) {
      throw new Error(
        '[ReusableTable] "viewConfig.visibleColumns" must contain at least one column accessor. ' +
        'Received an empty array. At least one column must be visible.'
      );
    }

    // Validate that groupBy, sortConfig, filterConfig are arrays if provided
    if (userViewConfig.groupBy && !Array.isArray(userViewConfig.groupBy)) {
      throw new Error(
        '[ReusableTable] "viewConfig.groupBy" must be an array. ' +
        'Received: ' + (typeof userViewConfig.groupBy) + '. ' +
        'Pass an empty array [] if you do not want grouping.'
      );
    }

    if (userViewConfig.sortConfig && !Array.isArray(userViewConfig.sortConfig)) {
      throw new Error(
        '[ReusableTable] "viewConfig.sortConfig" must be an array. ' +
        'Received: ' + (typeof userViewConfig.sortConfig) + '. ' +
        'Pass an empty array [] for no initial sorting.'
      );
    }

    if (userViewConfig.filterConfig && !Array.isArray(userViewConfig.filterConfig)) {
      throw new Error(
        '[ReusableTable] "viewConfig.filterConfig" must be an array. ' +
        'Received: ' + (typeof userViewConfig.filterConfig) + '. ' +
        'Pass an empty array [] for no initial filters.'
      );
    }
  }

  // Validate that all visibleColumns exist in allColumns
  const columnAccessors = new Set(allColumns.map(c => c.accessor));
  const missingColumns = viewConfig.visibleColumns?.filter(key => !columnAccessors.has(key)) || [];

  if (missingColumns.length > 0) {
    throw new Error(
      '[ReusableTable] The following columns in "viewConfig.visibleColumns" do not exist in "allColumns": ' +
      missingColumns.map(k => `"${String(k)}"`).join(', ') + '. ' +
      'Available columns: ' + Array.from(columnAccessors).map(k => `"${String(k)}"`).join(', ') + '. ' +
      'Make sure all visibleColumns accessors match an accessor in your allColumns array.'
    );
  }

  const displayedColumns = useMemo(() => {
    const columnMap = new Map(allColumns.map(c => [c.accessor, c]));
    const visibleColumnKeys = viewConfig.visibleColumns || allColumns.map(col => col.accessor);
    // Map and filter in one pass - only keep columns that exist in the map
    return visibleColumnKeys
      .map(key => columnMap.get(key))
      .filter((col): col is Column<T> => col !== undefined);
  }, [allColumns, viewConfig.visibleColumns]);

  // Process row selection based on format
  const processedRowSelection = useMemo(() => {
    if (!rowSelection) return undefined;
    
    if (isNewRowSelectionFormat(rowSelection)) {
      // New format: { enabled: true, mode: 'multiple' }
      if (!rowSelection.enabled) return undefined;
      
      // For new format, we need to create a minimal selection state
      // This is a placeholder - in a real implementation, you'd want to use a selection hook
      return {
        selectedRows: new Set<T>(),
        isAllSelected: false,
        isIndeterminate: false,
        selectRow: (row: T) => {
          rowSelection.onSelectionChange?.([]);
        },
        selectAll: () => {
          rowSelection.onSelectionChange?.(data);
        },
        clearSelection: () => {
          rowSelection.onSelectionChange?.([]);
        },
      };
    }
    
    // Old format: full RowSelectionState with methods
    return rowSelection;
  }, [rowSelection, data]);

  // Determine if row selection is enabled
  const isRowSelectionEnabled = useMemo(() => {
    if (!rowSelection) return false;
    if (isNewRowSelectionFormat(rowSelection)) {
      return rowSelection.enabled;
    }
    return true; // Old format assumes enabled
  }, [rowSelection]);

  const {
    paginatedItems,
    originalItems,
    handleSort,
    handleFilterChange,
    getSortDirection,
    getSortOrder,
    filters,
    clearFilters,
    pagination,
    toggleGroup,
    collapsedGroups,
  } = useTable<T>({
    data,
    allColumns,
    initialSort: viewConfig.sortConfig || [],
    initialFilters: viewConfig.filterConfig || [],
    initialPageSize: 10,
    groupByKeys: viewConfig.groupBy || [],
  });

  const [exportLocale, setExportLocale] = useState('default');
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: keyof T } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [showFilters, setShowFilters] = useState(true);
  const showFiltersToggleId = useStableId('show-filters-toggle', viewConfig?.id);

  const handleExport = () => {
    downloadCSV(originalItems, displayedColumns, exportLocale, 'table-export.csv');
  };
  
  const getFilterForKey = (key: keyof T) => filters.find(f => f.key === key);

  const getAlignmentClass = (column: Column<T>): string => {
    if (column.align) return `text-${column.align}`;
    if (column.dataType === 'number' || column.dataType === 'currency') return 'text-right';
    return 'text-left';
  };

  const handleCellDoubleClick = (item: T, column: Column<T>) => {
    if (column.editable && onUpdateData) {
      const originalRowIndex = data.findIndex(d => d === item);
      if(originalRowIndex === -1) return;

      setEditingCell({ rowIndex: originalRowIndex, columnId: column.accessor });
      setEditValue(data[originalRowIndex][column.accessor]);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  
  const saveEdit = () => {
    if (editingCell && onUpdateData) {
        const column = allColumns.find(c => c.accessor === editingCell.columnId);
        let valueToSave: any = editValue;
        if (column?.dataType === 'number' || column?.dataType === 'currency') {
            valueToSave = parseFloat(editValue);
            if (isNaN(valueToSave)) { // Handle invalid number input
              valueToSave = data[editingCell.rowIndex][editingCell.columnId]; // Revert to original
            }
        } else if (column?.dataType === 'datetime' && editValue) {
            valueToSave = new Date(editValue).toISOString();
        }
        onUpdateData(editingCell.rowIndex, editingCell.columnId, valueToSave);
        setEditingCell(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        saveEdit();
    } else if (e.key === 'Escape') {
        setEditingCell(null);
    }
  };

  const handleToggleAll = (column: Column<T>, isChecked: boolean) => {
    if (onUpdateData) {
      paginatedItems.forEach(row => {
        if ('isGroupHeader' in row) return;
        const item = row as T;
        const originalRowIndex = data.findIndex(d => d === item);
        if (originalRowIndex !== -1) {
          onUpdateData(originalRowIndex, column.accessor, isChecked);
        }
      });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        {/* Left-side controls */}
        <div className="flex items-center gap-4">
            <label htmlFor={showFiltersToggleId} className="flex items-center cursor-pointer text-sm text-gray-300 group">
                <span className="mr-2 group-hover:text-white transition-colors">Show Filters</span>
                <div className="relative">
                <input 
                    id={showFiltersToggleId} 
                    type="checkbox" 
                    className="sr-only" 
                    checked={showFilters} 
                    onChange={() => setShowFilters(prev => !prev)} 
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${showFilters ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showFilters ? 'translate-x-4' : ''}`}></div>
                </div>
            </label>
            {filters.length > 0 && (
                <button onClick={clearFilters} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-300 bg-red-500/20 hover:bg-red-500/30 transition-colors">
                Clear Filters ({filters.length})
                </button>
            )}
        </div>
        
        {/* Right-side controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-md border border-gray-600 bg-gray-700 shadow-sm">
            <button onClick={handleExport} className="px-4 py-2 border-r border-gray-600 text-sm font-medium text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors rounded-l-md">
              Export CSV
            </button>
            <select value={exportLocale} onChange={(e) => setExportLocale(e.target.value)} className="appearance-none bg-transparent py-2 pl-3 pr-8 border-none text-sm font-medium text-gray-200 focus:ring-2 focus:ring-offset-0 focus:ring-offset-gray-700 focus:ring-indigo-500 outline-none rounded-r-md" aria-label="Export format locale">
              <option value="default" className="bg-gray-800">Browser Default</option>
              <option value="sv-SE" className="bg-gray-800">Swedish (1 234,56)</option>
              <option value="de-DE" className="bg-gray-800">German (1.234,56)</option>
              <option value="en-IN" className="bg-gray-800">Indian (1,234.56)</option>
              <option value="en-US" className="bg-gray-800">US (1,234.56)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {processedRowSelection && (
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={processedRowSelection.isAllSelected}
                    ref={el => { if (el) { el.indeterminate = processedRowSelection.isIndeterminate; } }}
                    onChange={processedRowSelection.selectAll}
                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
              )}
              {displayedColumns.map((column, index) => {
                const dataItems = paginatedItems.filter(item => !('isGroupHeader' in item)) as T[];
                const isCheckAllColumn = column.cellType === 'checkbox' && onUpdateData;
                const visibleItems = dataItems.map(item => !!item[column.accessor]);
                const isAllChecked = visibleItems.length > 0 && visibleItems.every(Boolean);
                const isIndeterminate = visibleItems.some(Boolean) && !isAllChecked;

                return (
                  <th key={index} scope="col" className={`px-6 py-3 ${getAlignmentClass(column)} text-xs font-medium text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-700/50 transition-colors' : ''}`} onClick={(e) => column.sortable && handleSort(column.accessor, e.shiftKey)} aria-sort={column.sortable ? (getSortDirection(column.accessor) || 'none') : undefined}>
                    <div className="flex items-center justify-between">
                      {isCheckAllColumn ? (
                        <div className="flex items-center">
                          <input type="checkbox" ref={el => { if (el) { el.indeterminate = isIndeterminate; } }} checked={isAllChecked} onChange={e => handleToggleAll(column, e.target.checked)} className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500" />
                          <span className="ml-2">{column.header}</span>
                        </div>
                      ) : (
                        column.header
                      )}
                      {column.sortable && (<SortIndicator direction={getSortDirection(column.accessor)} sortOrder={getSortOrder(column.accessor)} />)}
                    </div>
                  </th>
                );
              })}
            </tr>
            {showFilters && (
              <tr>
                {processedRowSelection && (
                  <th className="px-2 py-2"></th>
                )}
                {displayedColumns.map((column, index) => (
                  <th key={index} className="px-2 py-2 text-left align-top">
                    {column.filterable && (<FilterControl<T> column={column} filter={getFilterForKey(column.accessor)} onFilterChange={handleFilterChange} />)}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((row: DisplayRow<T>) => {
                if ('isGroupHeader' in row) {
                    const groupHeader = row as GroupHeaderRow<T>;
                    const isCollapsed = collapsedGroups.has(groupHeader.path);
                    const column = allColumns.find(c => c.accessor === groupHeader.groupKey);

                    return (
                        <tr key={groupHeader.path} className="bg-gray-800/70 hover:bg-gray-800 transition-colors">
                            {rowSelection && <td className="px-6 py-4"></td>}
                            <td colSpan={displayedColumns.length} className="px-4 py-2 font-medium text-indigo-300" style={{ paddingLeft: `${groupHeader.level * 1.5 + 1}rem` }}>
                                <button onClick={() => toggleGroup(groupHeader.path)} className="w-full text-left flex items-center space-x-2 focus:outline-none">
                                    <svg className={`w-5 h-5 transform transition-transform ${isCollapsed ? '-rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    <span>
                                      <span className="font-normal text-gray-400">{column?.header || String(groupHeader.groupKey)}:</span> {String(groupHeader.groupValue)}
                                    </span>
                                    <span className="text-xs font-normal bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{groupHeader.count}</span>
                                </button>
                            </td>
                        </tr>
                    );
                }
                
                const item = row as T;
                const originalRowIndex = data.findIndex(d => d === item);
                return (
                  <tr key={originalRowIndex} className="hover:bg-gray-800/60 transition-colors">
                    {processedRowSelection && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={processedRowSelection.selectedRows.has(item)}
                          onChange={() => processedRowSelection.selectRow(item)}
                          className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    )}
                    {displayedColumns.map((column, colIndex) => {
                      const isEditing = editingCell?.rowIndex === originalRowIndex && editingCell?.columnId === column.accessor;
                      const cellValue = item[column.accessor];

                      // Create render context
                      const renderContext: CellRenderContext<T> = {
                        value: cellValue,
                        row: item,
                        rowIndex: originalRowIndex,
                        column,
                        isEditing
                      };

                      return (
                        <td key={colIndex} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${getAlignmentClass(column)}`} onDoubleClick={() => handleCellDoubleClick(item, column)}>
                          <DynamicCell<T>
                            context={renderContext}
                            isEditing={isEditing}
                            editValue={editValue}
                            onEditChange={handleEditChange}
                            onEditKeyDown={handleEditKeyDown}
                            onEditBlur={saveEdit}
                            onUpdateData={onUpdateData}
                            originalRowIndex={originalRowIndex}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={displayedColumns.length} className="text-center px-6 py-10 text-gray-500">No data matches your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination pagination={pagination} />
    </div>
  );
};