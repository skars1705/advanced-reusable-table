import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import CheckboxCollectionInput from './CheckboxCollectionInput';
import RadioCollectionInput from './RadioCollectionInput';
import TraditionalCheckboxInput from './TraditionalCheckboxInput';
import TraditionalRadioInput from './TraditionalRadioInput';
import CollectionDisplay from './CollectionDisplay';
import DropdownChipSelector from './DropdownChipSelector';
import { PencilIcon } from './icons/PencilIcon';
import type { 
  CollectionConfig, 
  CollectionOption, 
  CollectionValue,
  CollectionValidationResult,
  CheckboxCollectionConfig,
  RadioCollectionConfig,
  ChipCollectionConfig,
  TagCollectionConfig,
  CollectionType
} from '../types';
import { normalizeCollectionType } from '../types';

// Collection cell props interface
export interface CollectionCellProps<T> {
  value: string | string[] | null | undefined;
  config: CollectionConfig;
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onValidationChange?: (result: CollectionValidationResult) => void;
  /** Initial editing mode - 'display' shows chips, 'input' shows input controls */
  initialMode?: 'display' | 'input';
  /** Whether to show edit button in display mode */
  showEditButton?: boolean;
  /** Callback when edit mode changes */
  onModeChange?: (mode: 'display' | 'input') => void;
}

// Utility functions for collection data management
export const CollectionUtils = {
  /**
   * Normalize collection value to proper type based on config
   */
  normalizeValue<T extends CollectionConfig>(
    value: string | string[] | null | undefined, 
    config: T
  ): any {
    const normalizedType = normalizeCollectionType(config.type);
    if (normalizedType === 'radio') {
      return (Array.isArray(value) ? value[0] : value) || '';
    }
    
    if (Array.isArray(value)) {
      return value;
    }
    
    if (typeof value === 'string' && value.length > 0) {
      return [value];
    }
    
    return [];
  },

  /**
   * Get resolved options from static array or dynamic function
   */
  getResolvedOptions(config: CollectionConfig): CollectionOption[] {
    if (typeof config.options === 'function') {
      try {
        return config.options();
      } catch (error) {
        console.error('Failed to resolve dynamic collection options:', error);
        return [];
      }
    }
    return config.options || [];
  },

  /**
   * Validate collection value against configuration rules
   */
  validateValue<T extends CollectionConfig>(
    value: any, 
    config: T, 
    options: CollectionOption[]
  ): CollectionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const normalizedType = normalizeCollectionType(config.type);
    if (normalizedType === 'radio') {
      const stringValue = value as string;
      const radioConfig = config as RadioCollectionConfig;
      
      if (radioConfig.required && (!stringValue || stringValue.length === 0)) {
        errors.push('Selection is required');
      }
      
      if (stringValue && !options.some(opt => opt.value === stringValue)) {
        errors.push(`Invalid selection: ${stringValue}`);
      }
    } else {
      const arrayValue = value as string[];
      
      switch (normalizedType) {
        case 'checkbox':
          const checkboxConfig = config as CheckboxCollectionConfig;
          if (checkboxConfig.minSelections && arrayValue.length < checkboxConfig.minSelections) {
            errors.push(`Minimum ${checkboxConfig.minSelections} selection(s) required`);
          }
          if (checkboxConfig.maxSelections && arrayValue.length > checkboxConfig.maxSelections) {
            errors.push(`Maximum ${checkboxConfig.maxSelections} selection(s) allowed`);
          }
          break;
          
        case 'chip':
          const chipConfig = config as ChipCollectionConfig;
          if (chipConfig.maxSelections && arrayValue.length > chipConfig.maxSelections) {
            errors.push(`Maximum ${chipConfig.maxSelections} selection(s) allowed`);
          }
          break;
          
        case 'tag':
          const tagConfig = config as TagCollectionConfig;
          if (tagConfig.maxTags && arrayValue.length > tagConfig.maxTags) {
            errors.push(`Maximum ${tagConfig.maxTags} tag(s) allowed`);
          }
          
          // Validate individual tag constraints
          arrayValue.forEach(tag => {
            if (tagConfig.minLength && tag.length < tagConfig.minLength) {
              errors.push(`Tag "${tag}" must be at least ${tagConfig.minLength} characters`);
            }
            if (tagConfig.maxLength && tag.length > tagConfig.maxLength) {
              errors.push(`Tag "${tag}" must not exceed ${tagConfig.maxLength} characters`);
            }
          });
          
          // Check for duplicates if not allowed
          if (!tagConfig.duplicateAllowed) {
            const caseSensitive = tagConfig.caseSensitive !== false;
            const normalized = arrayValue.map(tag => caseSensitive ? tag : tag.toLowerCase());
            const unique = new Set(normalized);
            if (unique.size !== arrayValue.length) {
              errors.push('Duplicate tags are not allowed');
            }
          }
          break;
      }
      
      // Validate that all values exist in options (except for tags with custom values)
      if (normalizedType !== 'tag' || !(config as TagCollectionConfig).allowCustomValues) {
        arrayValue.forEach(val => {
          if (!options.some(opt => opt.value === val)) {
            errors.push(`Invalid option: ${val}`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  },

  /**
   * Format collection value for display
   */
  formatDisplayValue(
    value: string | string[], 
    config: CollectionConfig, 
    options: CollectionOption[]
  ): string {
    const normalizedValue = this.normalizeValue(value, config);
    const normalizedType = normalizeCollectionType(config.type);
    
    if (normalizedType === 'radio') {
      const stringValue = normalizedValue as string;
      const option = options.find(opt => opt.value === stringValue);
      return option ? option.label : stringValue;
    }
    
    const arrayValue = normalizedValue as string[];
    if (arrayValue.length === 0) {
      return '';
    }
    
    if (config.displayMode === 'text') {
      const labels = arrayValue.map(val => {
        const option = options.find(opt => opt.value === val);
        return option ? option.label : val;
      });
      return labels.join(', ');
    }
    
    if (config.displayMode === 'full') {
      const labels = arrayValue.map(val => {
        const option = options.find(opt => opt.value === val);
        return option ? option.label : val;
      });
      return labels.join(', ');
    }
    
    if (config.displayMode === 'compact') {
      if (arrayValue.length <= 2) {
        const labels = arrayValue.map(val => {
          const option = options.find(opt => opt.value === val);
          return option ? option.label : val;
        });
        return labels.join(', ');
      }
      return `${arrayValue.length} selected`;
    }
    
    return `${arrayValue.length} selected`;
  },

  /**
   * Generate unique ID for collection components
   */
  generateId(prefix: string = 'collection'): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  },

  /**
   * Filter options based on search query
   */
  filterOptions(options: CollectionOption[], searchQuery: string): CollectionOption[] {
    if (!searchQuery.trim()) {
      return options;
    }
    
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      (option.description && option.description.toLowerCase().includes(query))
    );
  },

  /**
   * Smart mode detection for automatic display mode selection
   */
  getSmartDisplayMode(
    optionCount: number, 
    selectedCount: number,
    config: CollectionConfig
  ): 'inline' | 'dropdown' {
    const threshold = config.inlineThreshold || 3;
    
    // Always use inline for small selections
    if (selectedCount <= 2) return 'inline';
    
    // Use dropdown for large option sets or many selections
    if (optionCount > 10 || selectedCount > threshold) return 'dropdown';
    
    return 'inline';
  },

  /**
   * Get effective input mode with smart defaults
   */
  getEffectiveInputMode(config: CollectionConfig): 'traditional' | 'chips' {
    // Default to chips mode if not specified
    return config.inputMode || 'chips';
  },

  /**
   * Get effective view display mode with smart defaults
   */
  getEffectiveViewDisplayMode(
    config: CollectionConfig,
    selectedValues: string | string[],
    options: CollectionOption[]
  ): 'inline' | 'dropdown' | 'traditional' {
    // Handle legacy displayMode mapping
    if (config.displayMode === 'chips' && !config.viewDisplayMode) {
      // Use inline for legacy chips mode
      config.viewDisplayMode = 'inline';
    } else if (config.displayMode === 'compact' && !config.viewDisplayMode) {
      // Use inline for compact mode but with limited chip display
      config.viewDisplayMode = 'inline';
    } else if (config.displayMode === 'full' && !config.viewDisplayMode) {
      // Use inline for full mode with all chips shown
      config.viewDisplayMode = 'inline';
    }
    
    const viewDisplayMode = config.viewDisplayMode || 'auto';
    
    if (viewDisplayMode === 'auto') {
      const normalizedValues = this.normalizeValue(selectedValues, config);
      const selectedCount = Array.isArray(normalizedValues) ? normalizedValues.length : (normalizedValues ? 1 : 0);
      
      return this.getSmartDisplayMode(options.length, selectedCount, config);
    }
    
    return viewDisplayMode;
  },

  /**
   * Get maximum visible chips for inline display
   */
  getMaxVisibleChips(config: CollectionConfig): number {
    // Handle legacy displayMode
    if (config.displayMode === 'compact') {
      return 2; // Show max 2 chips in compact mode
    } else if (config.displayMode === 'full') {
      return 999; // Show all chips in full mode
    }
    return config.maxVisibleInline || 5;
  }
};

/**
 * CollectionCell - Base component for collection data types
 * 
 * Handles checkbox, radio, chip, and tag collections with:
 * - Type-safe data management
 * - Validation and error handling  
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Theme integration with CSS custom properties
 * - Performance optimization for large option lists
 */
export const CollectionCell = <T,>({
  value,
  config,
  onChange,
  disabled = false,
  readOnly = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onValidationChange,
  initialMode = 'display',
  showEditButton = true,
  onModeChange,
}: CollectionCellProps<T>) => {
  // Component state
  const [editMode, setEditMode] = useState<'display' | 'input'>(initialMode);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState<any>(() => 
    CollectionUtils.normalizeValue(value, config)
  );
  
  // Refs for accessibility and interaction management
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Generate stable IDs for accessibility
  const componentId = useMemo(() => CollectionUtils.generateId('collection'), []);
  const listId = `${componentId}-list`;
  const descriptionId = `${componentId}-description`;
  
  // Resolve options and apply search filtering
  const resolvedOptions = useMemo(() => CollectionUtils.getResolvedOptions(config), [config]);
  const filteredOptions = useMemo(() => {
    return config.searchable ? 
      CollectionUtils.filterOptions(resolvedOptions, searchQuery) : 
      resolvedOptions;
  }, [resolvedOptions, searchQuery, config.searchable]);
  
  // Validation
  const validationResult = useMemo(() => 
    CollectionUtils.validateValue(internalValue as any, config as any, resolvedOptions),
    [internalValue, config, resolvedOptions]
  );
  
  // Update internal value when prop value changes
  useEffect(() => {
    const newValue = CollectionUtils.normalizeValue(value, config);
    setInternalValue(newValue);
  }, [value, config]);
  
  // Report validation changes
  useEffect(() => {
    onValidationChange?.(validationResult);
  }, [validationResult, onValidationChange]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Handle mode switching
  const handleModeChange = useCallback((newMode: 'display' | 'input') => {
    if (disabled) return;
    
    setEditMode(newMode);
    setIsOpen(newMode === 'input');
    onModeChange?.(newMode);
    
    // Clear search when switching modes
    if (newMode === 'display') {
      setSearchQuery('');
    }
  }, [disabled, onModeChange]);

  // Handle edit button click
  const handleEditClick = useCallback(() => {
    handleModeChange('input');
  }, [handleModeChange]);

  // Handle save/cancel actions
  const handleSave = useCallback(() => {
    handleModeChange('display');
  }, [handleModeChange]);

  const handleCancel = useCallback(() => {
    // Reset to original value
    const originalValue = CollectionUtils.normalizeValue(value, config);
    setInternalValue(originalValue);
    handleModeChange('display');
  }, [value, config, handleModeChange]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || readOnly) return;
    
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (editMode === 'display' && !readOnly) {
          handleModeChange('input');
        } else if (editMode === 'input' && !isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Space':
        if (editMode === 'display' && !readOnly) {
          event.preventDefault();
          handleModeChange('input');
        } else if (!isOpen) {
          event.preventDefault();
          setIsOpen(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
          inputRef.current?.focus();
        } else if (editMode === 'input') {
          handleCancel();
        }
        break;
      case 'Tab':
        // Allow natural tab behavior, auto-save on tab out from input mode
        if (editMode === 'input' && isOpen) {
          setTimeout(() => handleSave(), 0);
        }
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        if (isOpen) {
          event.preventDefault();
          // TODO: Implement option navigation in future milestones
        }
        break;
    }
  };
  
  // Handle value changes
  const handleValueChange = (newValue: string | string[]) => {
    if (disabled || readOnly) return;
    
    const normalizedValue = CollectionUtils.normalizeValue(newValue, config);
    setInternalValue(normalizedValue);
    onChange(normalizedValue as any);
  };

  // Handle chip removal in display mode
  const handleChipRemove = useCallback((valueToRemove: string) => {
    if (disabled || readOnly) return;
    
    const normalizedType = normalizeCollectionType(config.type);
    let newValue: string | string[];
    if (normalizedType === 'radio') {
      newValue = '';
    } else {
      const currentArray = Array.isArray(internalValue) ? internalValue : [internalValue].filter(Boolean);
      newValue = currentArray.filter((v: string) => v !== valueToRemove);
    }
    
    handleValueChange(newValue);
  }, [disabled, readOnly, config.type, internalValue, handleValueChange]);
  
  // Determine effective display modes using smart defaults
  const effectiveInputMode = useMemo(() => 
    CollectionUtils.getEffectiveInputMode(config),
    [config]
  );
  
  const effectiveViewDisplayMode = useMemo(() => 
    CollectionUtils.getEffectiveViewDisplayMode(config, internalValue, resolvedOptions),
    [config, internalValue, resolvedOptions]
  );
  
  const maxVisibleChips = useMemo(() => 
    CollectionUtils.getMaxVisibleChips(config),
    [config]
  );

  // Format display value
  const displayValue = useMemo(() => 
    CollectionUtils.formatDisplayValue(internalValue, config, resolvedOptions),
    [internalValue, config, resolvedOptions]
  );
  
  // Generate ARIA attributes
  const ariaAttributes = {
    'aria-label': ariaLabel || `${config.type} collection`,
    'aria-describedby': [ariaDescribedBy, descriptionId].filter(Boolean).join(' '),
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox' as const,
    'aria-invalid': !validationResult.isValid,
    'aria-readonly': readOnly,
    'aria-disabled': disabled,
    'aria-controls': isOpen ? listId : undefined,
  };
  
  // Base CSS classes with theme integration
  const baseClasses = [
    'collection-cell',
    'relative w-full',
    className,
    disabled && 'collection-cell--disabled',
    readOnly && 'collection-cell--readonly', 
    !validationResult.isValid && 'collection-cell--invalid',
    isOpen && 'collection-cell--open'
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      ref={containerRef}
      className={baseClasses}
      data-collection-type={config.type}
      data-edit-mode={editMode}
    >
      {editMode === 'display' ? (
        // Display mode - show chips with optional edit button
        <div className="collection-cell__display">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              {effectiveViewDisplayMode === 'dropdown' ? (
                // Dropdown display mode - collapsed with dropdown selector
                <DropdownChipSelector
                  values={Array.isArray(internalValue) ? internalValue : (internalValue ? [internalValue] : [])}
                
                  options={resolvedOptions}
                  placeholder={config.placeholder || `Select ${config.type} options...`}
                  onSelectionChange={!readOnly && !disabled ? handleValueChange : undefined}
                  disabled={disabled || readOnly}
                  maxHeight={parseInt(config.maxHeight?.replace('px', '') || '300')}
                  searchable={config.searchable}
                  aria-label={ariaLabel || `${config.type} collection dropdown`}
                  controlled={true}
                  initialOpen={false}
                />
              ) : effectiveViewDisplayMode === 'traditional' ? (
                // Traditional display mode - checkbox/radio list
                <div className="traditional-collection-display">
                  {normalizeCollectionType(config.type) === 'checkbox' ? (
                    <TraditionalCheckboxInput
                      value={internalValue || []}
                      options={resolvedOptions}
                      config={config as CheckboxCollectionConfig}
                      onChange={!readOnly && !disabled ? handleValueChange : undefined}
                      disabled={disabled || readOnly}
                      aria-label={ariaLabel || `${config.type} collection traditional display`}
                    />
                  ) : normalizeCollectionType(config.type) === 'radio' ? (
                    <TraditionalRadioInput
                      value={internalValue || ''}
                      options={resolvedOptions}
                      config={config as RadioCollectionConfig}
                      onChange={!readOnly && !disabled ? handleValueChange : undefined}
                      disabled={disabled || readOnly}
                      aria-label={ariaLabel || `${config.type} collection traditional display`}
                    />
                  ) : (
                    // Fallback to chip display for other types
                    <CollectionDisplay
                      values={Array.isArray(internalValue) ? internalValue : (internalValue ? [internalValue] : [])}
                    
                      options={resolvedOptions}
                      maxVisible={maxVisibleChips}
                      showCount={true}
                      layout="horizontal"
                      size="sm"
                      removable={!readOnly && !disabled}
                      disabled={disabled}
                      onChipRemove={handleChipRemove}
                      emptyMessage={config.placeholder || `No ${config.type} selections`}
                      aria-label={ariaLabel || `${config.type} collection display`}
                    />
                  )}
                </div>
              ) : (
                // Inline display mode - traditional chip display
                <CollectionDisplay
                  values={Array.isArray(internalValue) ? internalValue : (internalValue ? [internalValue] : [])}
                
                  options={resolvedOptions}
                  maxVisible={maxVisibleChips}
                  showCount={true}
                  layout="horizontal"
                  size="sm"
                  removable={!readOnly && !disabled}
                  disabled={disabled}
                  onChipRemove={handleChipRemove}
                  emptyMessage={config.placeholder || `No ${config.type} selections`}
                  aria-label={ariaLabel || `${config.type} collection display`}
                />
              )}
            </div>
            
            {/* Edit button - only show for inline mode or when dropdown is not interactive */}
            {showEditButton && !readOnly && !disabled && effectiveViewDisplayMode === 'inline' && (
              <button
                type="button"
                className="flex-shrink-0 p-1.5 rounded-[var(--table-border-radius,0.375rem)] text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-text,#f3f4f6)] hover:bg-[var(--table-color-surface,#1f2937)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:ring-offset-1"
                onClick={handleEditClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-label={`Edit ${config.type} collection`}
                data-testid="edit-button"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        // Input mode - show traditional input interface
        <div className="collection-cell__input-mode">
          {/* Main input/display area */}
          <div
            ref={inputRef}
            className="collection-cell__input flex min-h-[2.5rem] w-full cursor-pointer items-center justify-between rounded-[var(--table-border-radius,0.375rem)] border border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-surface,#1f2937)] px-3 py-2 text-sm text-[var(--table-color-text,#f3f4f6)] transition-colors hover:border-[var(--table-color-primary,#6366f1)] focus-within:border-[var(--table-color-primary,#6366f1)] focus-within:ring-2 focus-within:ring-[var(--table-color-primary,#6366f1)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--table-color-background,#111827)]"
            tabIndex={disabled || readOnly ? -1 : 0}
            role="combobox"
            onKeyDown={handleKeyDown}
            onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
            {...ariaAttributes}
          >
            {/* Display value or placeholder */}
            <span className={displayValue ? 'text-[var(--table-color-text,#f3f4f6)]' : 'text-[var(--table-color-textMuted,#9ca3af)]'}>
              {displayValue || config.placeholder || `Select ${config.type} options...`}
            </span>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Save button */}
              <button
                type="button"
                className="p-1 rounded text-xs font-medium bg-[var(--table-color-primary,#6366f1)] text-white hover:bg-[var(--table-color-primary,#6366f1)]/80 transition-colors"
                onClick={handleSave}
                title="Save changes"
              >
                ✓
              </button>
              
              {/* Cancel button */}
              <button
                type="button"
                className="p-1 rounded text-xs font-medium bg-[var(--table-color-border,#4b5563)] text-[var(--table-color-textMuted,#9ca3af)] hover:bg-[var(--table-color-border,#4b5563)]/80 transition-colors"
                onClick={handleCancel}
                title="Cancel changes"
              >
                ✕
              </button>
              
              {/* Dropdown indicator */}
              <svg
                className={`h-4 w-4 transition-transform text-[var(--table-color-textMuted,#9ca3af)] ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Interactive dropdown content */}
          {isOpen && (
            <div 
              id={listId}
              ref={listRef}
              className="collection-cell__dropdown absolute z-50 mt-1 w-full rounded-md border border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-surface,#1f2937)] shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Checkbox Collection Input */}
              {normalizeCollectionType(config.type) === 'checkbox' && (
                effectiveInputMode === 'traditional' ? (
                  <TraditionalCheckboxInput
                    options={resolvedOptions}
                    value={internalValue as string[]}
                    onChange={handleValueChange}
                    config={config as CheckboxCollectionConfig}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    disabled={disabled}
                    aria-label={`${config.type} collection options`}
                    aria-describedby={descriptionId}
                    id={`${componentId}-input`}
                  />
                ) : (
                  <CheckboxCollectionInput
                    options={resolvedOptions}
                    value={internalValue as string[]}
                    onChange={handleValueChange}
                    config={config as CheckboxCollectionConfig}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    disabled={disabled}
                    aria-label={`${config.type} collection options`}
                    aria-describedby={descriptionId}
                    id={`${componentId}-input`}
                  />
                )
              )}
              
              {/* Radio Collection Input */}
              {normalizeCollectionType(config.type) === 'radio' && (
                effectiveInputMode === 'traditional' ? (
                  <TraditionalRadioInput
                    options={resolvedOptions}
                    value={internalValue as string}
                    onChange={handleValueChange}
                    config={config as RadioCollectionConfig}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    disabled={disabled}
                    aria-label={`${config.type} collection options`}
                    aria-describedby={descriptionId}
                    id={`${componentId}-input`}
                  />
                ) : (
                  <RadioCollectionInput
                    options={resolvedOptions}
                    value={internalValue as string}
                    onChange={handleValueChange}
                    config={config as RadioCollectionConfig}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    disabled={disabled}
                    aria-label={`${config.type} collection options`}
                    aria-describedby={descriptionId}
                    id={`${componentId}-input`}
                  />
                )
              )}
              
              {/* Chip and Tag Collections - Placeholder for future implementation */}
              {(normalizeCollectionType(config.type) === 'chip' || normalizeCollectionType(config.type) === 'tag') && (
                <div className="p-4 text-center text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                  <div className="mb-2 font-medium text-[var(--table-color-text,#f3f4f6)]">
                    {config.type.charAt(0).toUpperCase() + config.type.slice(1)} Collection
                  </div>
                  <div>
                    {filteredOptions.length} option(s) available
                    {config.searchable && searchQuery && ` (filtered by "${searchQuery}")`}
                  </div>
                  <div className="mt-2 text-xs italic">
                    Input mode: {effectiveInputMode} | Display mode: {effectiveViewDisplayMode}
                  </div>
                  <div className="text-xs italic">
                    {config.type.charAt(0).toUpperCase() + config.type.slice(1)} input implementation coming in future milestone
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Validation errors */}
      {!validationResult.isValid && (
        <div 
          id={descriptionId}
          className="mt-1 text-xs text-[var(--table-color-error,#ef4444)]"
          role="alert"
          aria-live="polite"
        >
          {validationResult.errors.join(', ')}
        </div>
      )}
    </div>
  );
};

export default CollectionCell;