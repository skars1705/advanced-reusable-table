import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { CollectionOption, RadioCollectionConfig } from '../types';

export interface TraditionalRadioInputProps {
  options: CollectionOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  config: RadioCollectionConfig;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
}

/**
 * TraditionalRadioInput - Classic radio button interface with labels
 * 
 * Features:
 * - Traditional radio button + label layout
 * - Search functionality with highlighting
 * - Clear selection option (if clearable)
 * - Full accessibility with proper focus management
 * - Theme integration with CSS custom properties
 * - Validation and constraint handling
 */
export const TraditionalRadioInput: React.FC<TraditionalRadioInputProps> = ({
  options = [],
  value = '',
  onChange,
  disabled = false,
  config,
  searchQuery = '',
  onSearchChange,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  id,
}) => {
  // Local search state if not controlled
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  
  const effectiveSearchQuery = onSearchChange ? searchQuery : internalSearchQuery;
  
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

  // Calculate selection state
  const selectionState = useMemo(() => {
    const selectedOption = options.find(opt => opt.value === value);
    const isValidSelection = selectedOption && !selectedOption.disabled;
    
    return {
      hasSelection: !!value,
      selectedOption,
      isValidSelection,
      totalCount: options.length,
      filteredCount: filteredOptions.length
    };
  }, [value, options, filteredOptions.length]);

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

  // Handle radio selection
  const handleSelect = useCallback((optionValue: string) => {
    if (disabled) return;
    
    // Allow re-selecting the same value (useful for form validation)
    onChange(optionValue);
  }, [onChange, disabled]);

  // Handle clear selection
  const handleClear = useCallback(() => {
    if (disabled || !config.clearable) return;
    onChange('');
  }, [onChange, disabled, config.clearable]);

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

  // Generate accessible descriptions
  const getAriaDescription = useCallback(() => {
    const parts = [];
    
    if (selectionState.hasSelection) {
      parts.push(`${selectionState.selectedOption?.label} selected`);
    } else {
      parts.push('No option selected');
    }
    
    if (config.required) {
      parts.push('Selection is required');
    }
    if (config.clearable && selectionState.hasSelection) {
      parts.push('Selection can be cleared');
    }
    if (effectiveSearchQuery) {
      parts.push(`Filtered to ${selectionState.filteredCount} options`);
    }
    
    return parts.join('. ');
  }, [selectionState, config, effectiveSearchQuery]);

  const maxHeight = parseInt(config.maxHeight?.replace('px', '') || '300');
  const radioGroupName = id || 'radio-collection';

  return (
    <div className="traditional-radio-input w-full">
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

      {/* Action Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-surface,#1f2937)]">
        <div className="flex items-center space-x-3">
          {config.clearable && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || !selectionState.hasSelection}
              className="text-sm font-medium text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-text,#f3f4f6)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] rounded px-1"
            >
              Clear Selection
            </button>
          )}
        </div>
        
        <div className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
          {selectionState.hasSelection ? (
            <span className="text-[var(--table-color-text,#f3f4f6)]">
              {selectionState.selectedOption?.label}
            </span>
          ) : (
            'No selection'
          )}
        </div>
      </div>

      {/* Options List */}
      <div 
        className="overflow-auto"
        style={{ maxHeight: `${maxHeight}px` }}
        role="radiogroup"
        aria-label={ariaLabel || "Traditional radio options"}
        aria-describedby={ariaDescribedBy}
        aria-description={getAriaDescription()}
        aria-required={config.required}
      >
        {filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-sm text-[var(--table-color-textMuted,#9ca3af)]">
            {effectiveSearchQuery ? 'No options match your search' : 'No options available'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredOptions.map((option, index) => {
              const isSelected = value === option.value;
              const isDisabled = disabled || option.disabled;
              const optionId = `${radioGroupName}-option-${option.value}`;
              
              return (
                <label
                  key={option.value}
                  htmlFor={optionId}
                  className={`
                    flex items-start space-x-3 p-3 rounded-md transition-colors cursor-pointer
                    hover:bg-[var(--table-color-accent,#374151)] hover:bg-opacity-50
                    focus-within:bg-[var(--table-color-accent,#374151)] focus-within:bg-opacity-50
                    ${isSelected ? 'bg-[var(--table-color-primary,#6366f1)] bg-opacity-10' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Radio Button */}
                  <div className="flex-shrink-0 flex items-center h-6">
                    <input
                      id={optionId}
                      type="radio"
                      name={radioGroupName}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => !isDisabled && handleSelect(option.value)}
                      disabled={isDisabled}
                      className="h-4 w-4 text-[var(--table-color-primary,#6366f1)] bg-[var(--table-color-surface,#1f2937)] border-[var(--table-color-border,#4b5563)] focus:ring-[var(--table-color-primary,#6366f1)] focus:ring-2 disabled:opacity-50"
                      aria-describedby={option.description ? `${optionId}-desc` : undefined}
                    />
                  </div>
                  
                  {/* Label and Description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--table-color-text,#f3f4f6)] leading-6">
                      {highlightMatch(option.label, effectiveSearchQuery)}
                    </div>
                    {option.description && (
                      <div 
                        id={`${optionId}-desc`}
                        className="text-xs text-[var(--table-color-textMuted,#9ca3af)] mt-1 leading-4"
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Color Indicator */}
                  {option.color && (
                    <div className="flex-shrink-0 flex items-center h-6">
                      <div 
                        className="w-3 h-3 rounded-full border border-[var(--table-color-border,#4b5563)]"
                        style={{ backgroundColor: option.color }}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
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

export default TraditionalRadioInput;