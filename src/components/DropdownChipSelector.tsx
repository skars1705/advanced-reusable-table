import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Chip from './Chip';
import type { CollectionOption } from '../types';

export interface DropdownChipSelectorProps {
  /** Selected values to display and manage */
  values: string[];
  /** Available options for selection */
  options: CollectionOption[];
  /** Placeholder text when no values selected */
  placeholder?: string;
  /** Callback when selection changes */
  onSelectionChange?: (values: string[]) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Maximum height for the dropdown content */
  maxHeight?: number;
  /** Whether to show search input in dropdown */
  searchable?: boolean;
  /** Callback when dropdown state changes */
  onDropdownToggle?: (isOpen: boolean) => void;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Whether dropdown is controlled (for CollectionCell integration) */
  controlled?: boolean;
  /** Initial open state for controlled mode */
  initialOpen?: boolean;
}

/**
 * DropdownChipSelector - Collapsed chip display with expandable selection dropdown
 * 
 * Features:
 * - Collapsed "N selected" trigger chip with dropdown indicator
 * - Expandable dropdown with selected chips (removable)
 * - Available options for additional selections
 * - Search functionality within dropdown
 * - Full accessibility with keyboard navigation
 * - Click-outside-to-close behavior
 * - Smooth animations and transitions
 */
export const DropdownChipSelector: React.FC<DropdownChipSelectorProps> = ({
  values,
  options,
  placeholder = 'Select items...',
  onSelectionChange,
  disabled = false,
  maxHeight = 300,
  searchable = false,
  onDropdownToggle,
  className = '',
  'aria-label': ariaLabel,
  controlled = false,
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Refs for DOM management
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);
  
  // Resolve display information for selected values
  const selectedItems = useMemo(() => {
    return values.map(value => {
      const option = options.find(opt => opt.value === value);
      return {
        value,
        label: option?.label || value,
        color: option?.color,
      };
    });
  }, [values, options]);
  
  // Filter available options (excluding already selected and applying search)
  const availableOptions = useMemo(() => {
    const unselected = options.filter(opt => !values.includes(opt.value) && !opt.disabled);
    
    if (!searchQuery.trim()) return unselected;
    
    const query = searchQuery.toLowerCase();
    return unselected.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      (option.description && option.description.toLowerCase().includes(query))
    );
  }, [options, values, searchQuery]);
  
  // Handle dropdown toggle
  const handleToggleDropdown = useCallback(() => {
    if (disabled) return;
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setFocusedIndex(-1);
    setSearchQuery('');
    
    onDropdownToggle?.(newIsOpen);
    
    // Focus management
    if (newIsOpen) {
      // Focus search input if available, otherwise focus dropdown
      setTimeout(() => {
        if (searchable && searchInputRef.current) {
          searchInputRef.current.focus();
        } else if (optionsListRef.current) {
          optionsListRef.current.focus();
        }
      }, 0);
    }
  }, [disabled, isOpen, onDropdownToggle, searchable]);
  
  // Handle item removal
  const handleRemoveItem = useCallback((valueToRemove: string) => {
    if (disabled) return;
    
    const newValues = values.filter(v => v !== valueToRemove);
    onSelectionChange?.(newValues);
  }, [disabled, values, onSelectionChange]);
  
  // Handle item addition
  const handleAddItem = useCallback((valueToAdd: string) => {
    if (disabled) return;
    
    const newValues = [...values, valueToAdd];
    onSelectionChange?.(newValues);
    
    // Clear search and reset focus
    setSearchQuery('');
    setFocusedIndex(-1);
  }, [disabled, values, onSelectionChange]);
  
  // Handle click outside to close
  useEffect(() => {
    if (!isOpen || controlled) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
        onDropdownToggle?.(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, controlled, onDropdownToggle]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          handleToggleDropdown();
        } else if (focusedIndex >= 0 && availableOptions[focusedIndex]) {
          handleAddItem(availableOptions[focusedIndex].value);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          onDropdownToggle?.(false);
          triggerRef.current?.focus();
        }
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          handleToggleDropdown();
        } else {
          setFocusedIndex(prev => 
            prev < availableOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        }
        break;
        
      case 'Tab':
        // Allow natural tab behavior, close dropdown
        if (isOpen) {
          setTimeout(() => {
            setIsOpen(false);
            onDropdownToggle?.(false);
          }, 0);
        }
        break;
    }
  }, [disabled, isOpen, focusedIndex, availableOptions, handleToggleDropdown, handleAddItem, onDropdownToggle]);
  
  // Generate trigger display text
  const triggerText = useMemo(() => {
    if (values.length === 0) return placeholder;
    if (values.length === 1) return selectedItems[0].label;
    return `${values.length} selected`;
  }, [values.length, selectedItems, placeholder]);
  
  // Generate ARIA attributes
  const ariaAttributes = {
    'aria-label': ariaLabel || `Dropdown chip selector with ${values.length} items selected`,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox' as const,
    'aria-controls': isOpen ? 'dropdown-content' : undefined,
  };
  
  return (
    <div className={`dropdown-chip-selector relative ${className}`}>
      {/* Trigger Chip */}
      <button
        ref={triggerRef}
        type="button"
        className={`
          inline-flex items-center justify-between w-full min-w-0 px-3 py-1.5 rounded-full 
          text-sm font-medium transition-all duration-200 cursor-pointer
          ${values.length > 0 
            ? 'bg-[var(--table-color-primary,#6366f1)] text-white'
            : 'bg-[var(--table-color-border,#4b5563)]/20 text-[var(--table-color-textMuted,#9ca3af)]'
          }
          ${!disabled && 'hover:opacity-80'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--table-color-primary,#6366f1)]
        `}
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...ariaAttributes}
      >
        {/* Trigger Text */}
        <span className="truncate mr-2">{triggerText}</span>
        
        {/* Dropdown Indicator */}
        <svg 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Content */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          id="dropdown-content"
          className={`
            absolute z-50 mt-2 w-full min-w-[300px] rounded-md border 
            border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-surface,#1f2937)] 
            shadow-lg transform transition-all duration-200 ease-out
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-[var(--table-color-border,#4b5563)]">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search available options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-[var(--table-color-border,#4b5563)] bg-[var(--table-color-background,#111827)] px-3 py-2 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:border-[var(--table-color-primary,#6366f1)] focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)]"
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
          
          {/* Selected Items Section */}
          {values.length > 0 && (
            <div className="p-3 border-b border-[var(--table-color-border,#4b5563)]">
              <div className="text-xs font-medium text-[var(--table-color-textMuted,#9ca3af)] mb-2">
                Selected ({values.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedItems.map((item) => (
                  <Chip
                    key={item.value}
                    label={item.label}
                    value={item.value}
                    color={item.color}
                    size="sm"
                    removable={!disabled}
                    onRemove={!disabled ? handleRemoveItem : undefined}
                    tabIndex={-1}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Available Options Section */}
          <div 
            ref={optionsListRef}
            className="max-h-48 overflow-y-auto"
            role="listbox"
            aria-label="Available options"
            tabIndex={!searchable ? 0 : -1}
            onKeyDown={!searchable ? handleKeyDown : undefined}
          >
            {availableOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                {searchQuery ? 'No options match your search' : 'All options selected'}
              </div>
            ) : (
              <>
                <div className="p-3 pb-2">
                  <div className="text-xs font-medium text-[var(--table-color-textMuted,#9ca3af)]">
                    Available ({availableOptions.length})
                  </div>
                </div>
                <div className="pb-2">
                  {availableOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-left text-sm
                        transition-colors hover:bg-[var(--table-color-accent,#374151)] hover:bg-opacity-50
                        focus:bg-[var(--table-color-accent,#374151)] focus:bg-opacity-50 focus:outline-none
                        ${focusedIndex === index ? 'bg-[var(--table-color-accent,#374151)] bg-opacity-50' : ''}
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => !option.disabled && handleAddItem(option.value)}
                      disabled={option.disabled}
                      role="option"
                      aria-selected={false}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[var(--table-color-text,#f3f4f6)]">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-xs text-[var(--table-color-textMuted,#9ca3af)] mt-0.5">
                            {option.description}
                          </div>
                        )}
                      </div>
                      
                      {option.color && (
                        <div 
                          className="w-3 h-3 rounded-full border border-[var(--table-color-border,#4b5563)] ml-2"
                          style={{ backgroundColor: option.color }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownChipSelector;