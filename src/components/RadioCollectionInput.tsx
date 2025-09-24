import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import type { CollectionOption, RadioCollectionConfig } from '../types';

export interface RadioCollectionInputProps {
  options: CollectionOption[];
  value: string;
  onChange: (value: string) => void;
  config: RadioCollectionConfig;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
}

interface VirtualizedRadioListProps {
  options: CollectionOption[];
  value: string;
  onSelect: (optionValue: string) => void;
  disabled?: boolean;
  searchQuery: string;
  maxHeight: number;
  name: string;
}

// Virtualized list component for performance with 100+ options
const VirtualizedRadioList: React.FC<VirtualizedRadioListProps> = React.memo(({
  options,
  value,
  onSelect,
  disabled,
  searchQuery,
  maxHeight,
  name
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemHeight = 40; // Fixed item height for calculations

  // Update refs array when options change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, options.length);
  }, [options.length]);

  // Scroll handler for virtualization
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(maxHeight / itemHeight) + 5; // Buffer items
    
    setVisibleRange({
      start: Math.max(0, startIndex - 2),
      end: Math.min(options.length, startIndex + visibleCount + 2)
    });
  }, [options.length, maxHeight]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = Math.min(focusedIndex + 1, options.length - 1);
        setFocusedIndex(nextIndex);
        itemRefs.current[nextIndex]?.focus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = Math.max(focusedIndex - 1, 0);
        setFocusedIndex(prevIndex);
        itemRefs.current[prevIndex]?.focus();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          const selectedOption = options[focusedIndex];
          if (!selectedOption.disabled) {
            onSelect(selectedOption.value);
          }
        }
        break;
        
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        itemRefs.current[0]?.focus();
        break;
        
      case 'End':
        e.preventDefault();
        const lastIndex = options.length - 1;
        setFocusedIndex(lastIndex);
        itemRefs.current[lastIndex]?.focus();
        break;
    }
  }, [disabled, focusedIndex, options, onSelect]);

  const visibleOptions = options.slice(visibleRange.start, visibleRange.end);

  // Highlight search matches
  const highlightMatch = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-[var(--table-color-primary,#6366f1)] bg-opacity-25 text-[var(--table-color-text,#f3f4f6)]">
          {part}
        </mark>
      ) : part
    );
  }, []);

  return (
    <div 
      ref={containerRef}
      className="overflow-auto"
      style={{ maxHeight }}
      onScroll={options.length > 50 ? handleScroll : undefined}
      onKeyDown={handleKeyDown}
      role="radiogroup"
      aria-label="Radio options"
    >
      {/* Virtual spacer top */}
      {options.length > 50 && (
        <div style={{ height: visibleRange.start * itemHeight }} />
      )}
      
      {visibleOptions.map((option, index) => {
        const actualIndex = visibleRange.start + index;
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const isFocused = focusedIndex === actualIndex;
        
        return (
          <div
            key={option.value}
            ref={el => itemRefs.current[actualIndex] = el}
            className={`flex items-center space-x-3 px-3 py-2 hover:bg-[var(--table-color-accent,#374151)] hover:bg-opacity-50 ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${isFocused ? 'ring-2 ring-[var(--table-color-primary,#6366f1)] ring-inset' : ''}`}
            style={{ height: itemHeight }}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            tabIndex={isFocused ? 0 : -1}
            onClick={() => !isDisabled && onSelect(option.value)}
            onFocus={() => setFocusedIndex(actualIndex)}
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => !isDisabled && onSelect(option.value)}
                disabled={isDisabled}
                className="h-4 w-4 text-[var(--table-color-primary,#6366f1)] bg-[var(--table-color-surface,#1f2937)] border-[var(--table-color-border,#4b5563)] focus:ring-[var(--table-color-primary,#6366f1)] focus:ring-2 disabled:opacity-50"
                aria-describedby={option.description ? `${option.value}-desc` : undefined}
                tabIndex={-1} // Handled by parent div
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--table-color-text,#f3f4f6)]">
                {highlightMatch(option.label, searchQuery)}
              </div>
              {option.description && (
                <div 
                  id={`${option.value}-desc`}
                  className="text-xs text-[var(--table-color-textMuted,#9ca3af)]"
                >
                  {option.description}
                </div>
              )}
            </div>
            
            {option.color && (
              <div 
                className="w-3 h-3 rounded-full border border-[var(--table-color-border,#4b5563)]"
                style={{ backgroundColor: option.color }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
      
      {/* Virtual spacer bottom */}
      {options.length > 50 && (
        <div style={{ height: (options.length - visibleRange.end) * itemHeight }} />
      )}
    </div>
  );
});

VirtualizedRadioList.displayName = 'VirtualizedRadioList';

/**
 * RadioCollectionInput - Single-select radio interface for collection data
 * 
 * Features:
 * - Single-select with string state management
 * - Search functionality with debouncing and highlighting
 * - Clear selection functionality (if clearable)
 * - Virtualization for 100+ options
 * - Full accessibility with WCAG 2.1 AA compliance and keyboard navigation
 * - Theme integration with CSS custom properties
 */
export const RadioCollectionInput: React.FC<RadioCollectionInputProps> = ({
  options = [],
  value = '',
  onChange,
  config,
  searchQuery = '',
  onSearchChange,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  id,
}) => {
  // Local search state if not controlled
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  
  const effectiveSearchQuery = onSearchChange ? searchQuery : internalSearchQuery;
  
  // Generate unique name for radio group
  const radioGroupName = useMemo(() => 
    id || `radio-collection-${Math.random().toString(36).substring(2, 9)}`,
    [id]
  );
  
  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!effectiveSearchQuery.trim()) return options;
    
    const query = effectiveSearchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      (option.description && option.description.toLowerCase().includes(query))
    );
  }, [options, effectiveSearchQuery]);

  // Find selected option details
  const selectedOption = useMemo(() => 
    options.find(opt => opt.value === value),
    [options, value]
  );

  // Handle search input changes
  const handleSearchChange = useCallback((newQuery: string) => {
    if (onSearchChange) {
      onSearchChange(newQuery);
    } else {
      // Debounce internal search
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        setInternalSearchQuery(newQuery);
      }, 150);
    }
  }, [onSearchChange]);

  // Handle option selection
  const handleSelect = useCallback((optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
  }, [onChange, disabled]);

  // Handle clear selection
  const handleClear = useCallback(() => {
    if (disabled || !config.clearable) return;
    onChange('');
  }, [onChange, disabled, config.clearable]);

  // Keyboard navigation for clear action
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (config.clearable && (e.key === 'Backspace' || e.key === 'Delete') && e.ctrlKey) {
      e.preventDefault();
      handleClear();
    }
  }, [disabled, config.clearable, handleClear]);

  // Generate accessible descriptions
  const getAriaDescription = useCallback(() => {
    const parts = [];
    
    if (selectedOption) {
      parts.push(`Selected: ${selectedOption.label}`);
    } else {
      parts.push(config.required ? 'Selection required' : 'No selection');
    }
    
    if (config.clearable && value) {
      parts.push('Press Ctrl+Backspace to clear selection');
    }
    
    if (effectiveSearchQuery) {
      parts.push(`Filtered to ${filteredOptions.length} of ${options.length} options`);
    } else {
      parts.push(`${options.length} options available`);
    }
    
    return parts.join('. ');
  }, [selectedOption, value, config, filteredOptions.length, options.length, effectiveSearchQuery]);

  const maxHeight = parseInt(config.maxHeight?.replace('px', '') || '300');

  return (
    <div 
      className="radio-collection-input w-full"
      onKeyDown={handleKeyDown}
    >
      {/* Search Input */}
      {config.searchable && (
        <div className="p-3 border-b border-[var(--table-color-border,#4b5563)]">
          <input
            type="text"
            placeholder={config.placeholder || "Search options..."}
            defaultValue={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-md border border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-background,#111827)] px-3 py-2 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:border-[var(--table-color-primary,#6366f1)] focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)]"
            disabled={disabled}
            aria-label="Search radio options"
          />
        </div>
      )}

      {/* Selection Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-surface,#1f2937)]">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-[var(--table-color-text,#f3f4f6)]">
            {selectedOption ? selectedOption.label : (config.required ? 'Selection required' : 'No selection')}
          </span>
          
          {selectedOption?.color && (
            <div 
              className="w-3 h-3 rounded-full border border-[var(--table-color-border,#4b5563)]"
              style={{ backgroundColor: selectedOption.color }}
              aria-hidden="true"
            />
          )}
        </div>
        
        {config.clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-sm font-medium text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-text,#f3f4f6)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] rounded px-1"
            title="Clear selection (Ctrl+Backspace)"
          >
            Clear
          </button>
        )}
      </div>

      {/* Options List */}
      <div 
        role="radiogroup"
        aria-label={ariaLabel || "Radio collection options"}
        aria-describedby={ariaDescribedBy}
        aria-description={getAriaDescription()}
        aria-required={config.required}
      >
        {filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-sm text-[var(--table-color-textMuted,#9ca3af)]">
            {effectiveSearchQuery ? 'No options match your search' : 'No options available'}
          </div>
        ) : (
          <VirtualizedRadioList
            options={filteredOptions}
            value={value}
            onSelect={handleSelect}
            disabled={disabled}
            searchQuery={effectiveSearchQuery}
            maxHeight={maxHeight}
            name={radioGroupName}
          />
        )}
      </div>

      {/* Selection Status for Screen Readers */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {getAriaDescription()}
      </div>
    </div>
  );
};

export default RadioCollectionInput;