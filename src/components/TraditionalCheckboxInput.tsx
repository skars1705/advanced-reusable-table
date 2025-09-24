import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { CollectionOption, CheckboxCollectionConfig } from '../types';

export interface TraditionalCheckboxInputProps {
  options: CollectionOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  config: CheckboxCollectionConfig;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
}

/**
 * TraditionalCheckboxInput - Classic checkbox interface with labels
 * 
 * Features:
 * - Traditional checkbox + label layout
 * - Search functionality with highlighting
 * - Select All / Clear All bulk operations
 * - Full accessibility with proper focus management
 * - Theme integration with CSS custom properties
 * - Validation and constraint handling
 */
export const TraditionalCheckboxInput: React.FC<TraditionalCheckboxInputProps> = ({
  options = [],
  value = [],
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
    const availableOptions = filteredOptions.filter(opt => !opt.disabled);
    const selectedFromAvailable = value.filter(val => 
      availableOptions.some(opt => opt.value === val)
    );
    
    return {
      isAllSelected: availableOptions.length > 0 && selectedFromAvailable.length === availableOptions.length,
      isIndeterminate: selectedFromAvailable.length > 0 && selectedFromAvailable.length < availableOptions.length,
      selectedCount: value.length,
      totalCount: options.length,
      filteredCount: filteredOptions.length
    };
  }, [value, filteredOptions, options.length]);

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

  // Handle individual option toggle
  const handleToggle = useCallback((optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    // Check max selections constraint
    if (config.maxSelections && newValue.length > config.maxSelections) {
      return;
    }
    
    onChange(newValue);
  }, [value, onChange, disabled, config.maxSelections]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (disabled) return;
    
    const availableOptions = filteredOptions.filter(opt => !opt.disabled);
    const availableValues = availableOptions.map(opt => opt.value);
    
    // Merge with existing selections not in filtered results
    const existingUnfiltered = value.filter(val =>
      !filteredOptions.some(opt => opt.value === val)
    );
    
    const newValue = [...existingUnfiltered, ...availableValues];
    
    // Respect max selections limit
    if (config.maxSelections && newValue.length > config.maxSelections) {
      const limited = newValue.slice(0, config.maxSelections);
      onChange(limited);
    } else {
      onChange(newValue);
    }
  }, [value, filteredOptions, onChange, disabled, config.maxSelections]);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    if (disabled) return;
    onChange([]);
  }, [onChange, disabled]);

  // Memoized highlighted options for performance
  const highlightedOptions = useMemo(() => {
    return filteredOptions.map(option => ({
      ...option,
      highlightedLabel: effectiveSearchQuery.trim() ? (() => {
        const query = effectiveSearchQuery;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = option.label.split(regex);
        
        return parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-[var(--table-color-primary,#6366f1)] bg-opacity-25 text-[var(--table-color-text,#f3f4f6)]">
              {part}
            </mark>
          ) : part
        );
      })() : option.label
    }));
  }, [filteredOptions, effectiveSearchQuery]);

  // Generate accessible descriptions
  const getAriaDescription = useCallback(() => {
    const parts = [
      `${selectionState.selectedCount} of ${selectionState.totalCount} options selected`,
    ];
    
    if (config.maxSelections) {
      parts.push(`Maximum ${config.maxSelections} selections allowed`);
    }
    if (config.minSelections) {
      parts.push(`Minimum ${config.minSelections} selections required`);
    }
    if (effectiveSearchQuery) {
      parts.push(`Filtered to ${selectionState.filteredCount} options`);
    }
    
    return parts.join('. ');
  }, [selectionState, config, effectiveSearchQuery]);

  const maxHeight = parseInt(config.maxHeight?.replace('px', '') || '300');

  return (
    <div className="traditional-checkbox-input w-full">
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
            aria-label="Search checkbox options"
          />
        </div>
      )}

      {/* Bulk Actions Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-surface,#1f2937)]">
        <div className="flex items-center space-x-3">
          {config.selectAllOption !== false && (
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={disabled || filteredOptions.filter(opt => !opt.disabled).length === 0}
              className="text-sm font-medium text-[var(--table-color-primary,#6366f1)] hover:text-[var(--table-color-primary,#6366f1)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] rounded px-1"
            >
              Select All
            </button>
          )}
          
          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled || selectionState.selectedCount === 0}
            className="text-sm font-medium text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-text,#f3f4f6)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] rounded px-1"
          >
            Clear All
          </button>
        </div>
        
        <div className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
          {selectionState.selectedCount} selected
          {config.maxSelections && ` / ${config.maxSelections} max`}
        </div>
      </div>

      {/* Options List */}
      <div 
        className="overflow-auto"
        style={{ maxHeight: `${maxHeight}px` }}
        role="group"
        aria-label={ariaLabel || "Traditional checkbox options"}
        aria-describedby={ariaDescribedBy}
        aria-description={getAriaDescription()}
      >
        {filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-sm text-[var(--table-color-textMuted,#9ca3af)]">
            {effectiveSearchQuery ? 'No options match your search' : 'No options available'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {highlightedOptions.map((option, index) => {
              const isSelected = value.includes(option.value);
              const isDisabled = disabled || option.disabled;
              const optionId = `${id}-option-${option.value}`;
              
              return (
                <label
                  key={option.value}
                  htmlFor={optionId}
                  className={`
                    flex items-start space-x-3 p-3 rounded-md transition-colors cursor-pointer
                    hover:bg-[var(--table-color-accent,#374151)] hover:bg-opacity-50
                    focus-within:bg-[var(--table-color-accent,#374151)] focus-within:bg-opacity-50
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0 flex items-center h-6">
                    <input
                      id={optionId}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => !isDisabled && handleToggle(option.value)}
                      disabled={isDisabled}
                      className="h-4 w-4 text-[var(--table-color-primary,#6366f1)] bg-[var(--table-color-surface,#1f2937)] border-[var(--table-color-border,#4b5563)] rounded focus:ring-[var(--table-color-primary,#6366f1)] focus:ring-2 disabled:opacity-50"
                      aria-describedby={option.description ? `${optionId}-desc` : undefined}
                    />
                  </div>
                  
                  {/* Label and Description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--table-color-text,#f3f4f6)] leading-6">
                      {option.highlightedLabel}
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

export default TraditionalCheckboxInput;