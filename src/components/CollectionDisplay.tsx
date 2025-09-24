import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Chip from './Chip';
import type { CollectionOption } from '../types';

export interface CollectionDisplayProps {
  /** Selected values to display */
  values: string[];
  /** Available options for label resolution */
  options: CollectionOption[];
  /** Maximum number of chips to show initially */
  maxVisible?: number;
  /** Whether to show count indicator for hidden items */
  showCount?: boolean;
  /** Layout style for chip arrangement */
  layout?: 'horizontal' | 'vertical' | 'grid';
  /** Size variant for all chips */
  size?: 'sm' | 'md' | 'lg';
  /** Whether chips are removable */
  removable?: boolean;
  /** Whether the display is disabled */
  disabled?: boolean;
  /** Callback when a chip is removed */
  onChipRemove?: (value: string) => void;
  /** Callback when a chip is clicked */
  onChipClick?: (value: string) => void;
  /** Callback when expand button is clicked */
  onExpand?: () => void;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for the collection */
  'aria-label'?: string;
  /** Whether to enable virtualization for large collections */
  virtualized?: boolean;
  /** Container height for virtualization */
  virtualHeight?: number;
}

/**
 * CollectionDisplay - Sophisticated display component for collection values
 * 
 * Features:
 * - Smart overflow handling with expand/collapse
 * - Multiple layout options (horizontal, vertical, grid)
 * - Responsive design with automatic layout switching
 * - Performance optimization for large collections
 * - Full accessibility with keyboard navigation
 * - Empty state handling with customizable messaging
 * - Integration with existing Chip component
 */
export const CollectionDisplay: React.FC<CollectionDisplayProps> = ({
  values,
  options,
  maxVisible = 3,
  showCount = true,
  layout = 'horizontal',
  size = 'md',
  removable = false,
  disabled = false,
  onChipRemove,
  onChipClick,
  onExpand,
  emptyMessage = 'No items selected',
  className = '',
  'aria-label': ariaLabel,
  virtualized = false,
  virtualHeight = 200,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Observe container width for responsive behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setContainerWidth(width);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Resolve display items from values and options
  const displayItems = useMemo(() => {
    return values.map(value => {
      const option = options.find(opt => opt.value === value);
      return {
        value,
        label: option?.label || value,
        color: option?.color,
        disabled: disabled || option?.disabled || false,
      };
    });
  }, [values, options, disabled]);

  // Determine visible and hidden items based on expansion state
  const { visibleItems, hiddenItems, shouldShowExpander } = useMemo(() => {
    if (isExpanded || values.length <= maxVisible) {
      return {
        visibleItems: displayItems,
        hiddenItems: [],
        shouldShowExpander: values.length > maxVisible,
      };
    }

    return {
      visibleItems: displayItems.slice(0, maxVisible),
      hiddenItems: displayItems.slice(maxVisible),
      shouldShowExpander: true,
    };
  }, [displayItems, isExpanded, maxVisible, values.length]);

  // Handle expand/collapse toggle
  const handleToggleExpand = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpand?.();
  }, [isExpanded, onExpand]);

  // Handle chip removal
  const handleChipRemove = useCallback((value: string) => {
    if (disabled) return;
    onChipRemove?.(value);
  }, [disabled, onChipRemove]);

  // Handle chip click
  const handleChipClick = useCallback((value: string) => {
    if (disabled) return;
    onChipClick?.(value);
  }, [disabled, onChipClick]);

  // Keyboard navigation for chips
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const chips = containerRef.current?.querySelectorAll('[data-testid^="chip-"]');
    if (!chips || chips.length === 0) return;

    const currentIndex = Array.from(chips).findIndex(chip => 
      chip === document.activeElement
    );

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (layout === 'horizontal' && event.key === 'ArrowDown') return;
        if (layout === 'vertical' && event.key === 'ArrowRight') return;
        
        const nextIndex = currentIndex < chips.length - 1 ? currentIndex + 1 : 0;
        (chips[nextIndex] as HTMLElement).focus();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (layout === 'horizontal' && event.key === 'ArrowUp') return;
        if (layout === 'vertical' && event.key === 'ArrowLeft') return;
        
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : chips.length - 1;
        (chips[prevIndex] as HTMLElement).focus();
        break;

      case 'Home':
        event.preventDefault();
        (chips[0] as HTMLElement).focus();
        break;

      case 'End':
        event.preventDefault();
        (chips[chips.length - 1] as HTMLElement).focus();
        break;
    }
  }, [layout]);

  // Determine responsive layout based on container width
  const effectiveLayout = useMemo(() => {
    if (containerWidth > 0 && containerWidth < 300 && layout === 'horizontal') {
      return 'vertical';
    }
    return layout;
  }, [containerWidth, layout]);

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2',
  }[effectiveLayout];

  // Base container classes
  const containerClasses = [
    'collection-display',
    'w-full',
    className,
    disabled && 'opacity-50 pointer-events-none',
  ].filter(Boolean).join(' ');

  // Empty state
  if (values.length === 0) {
    return (
      <div 
        ref={containerRef}
        className={`${containerClasses} flex items-center justify-center p-4 text-sm text-[var(--table-color-textMuted,#9ca3af)] italic`}
        aria-label={ariaLabel || 'Collection display - empty'}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label={ariaLabel || `Collection of ${values.length} items`}
      data-testid="collection-display"
    >
      {/* Main chip display area */}
      <div className={layoutClasses} role="list">
        {visibleItems.map((item, index) => (
          <Chip
            key={`chip-${item.value}-${index}`}
            label={item.label}
            value={item.value}
            color={item.color}
            size={size}
            removable={removable}
            disabled={item.disabled}
            onRemove={removable ? handleChipRemove : undefined}
            onClick={onChipClick ? handleChipClick : undefined}
            tabIndex={index === 0 ? 0 : -1}
            aria-posinset={index + 1}
            aria-setsize={isExpanded ? values.length : Math.min(values.length, maxVisible)}
          />
        ))}

        {/* Overflow indicator and expand button */}
        {shouldShowExpander && !isExpanded && hiddenItems.length > 0 && (
          <button
            type="button"
            className={`
              inline-flex items-center justify-center rounded-full font-medium transition-all duration-200
              px-3 py-1 text-sm gap-1.5
              bg-[var(--table-color-border,#4b5563)]/20 text-[var(--table-color-textMuted,#9ca3af)]
              border border-[var(--table-color-border,#4b5563)]/40
              hover:bg-[var(--table-color-border,#4b5563)]/30 hover:text-[var(--table-color-text,#f3f4f6)]
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--table-color-primary,#6366f1)]
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={handleToggleExpand}
            disabled={disabled}
            aria-label={`Show ${hiddenItems.length} more items`}
            data-testid="expand-button"
          >
            {showCount && (
              <span className="text-xs font-semibold">
                +{hiddenItems.length}
              </span>
            )}
            <span>more</span>
            <svg 
              className="h-3 w-3 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Collapse button when expanded */}
        {shouldShowExpander && isExpanded && (
          <button
            type="button"
            className={`
              inline-flex items-center justify-center rounded-full font-medium transition-all duration-200
              px-3 py-1 text-sm gap-1.5
              bg-[var(--table-color-border,#4b5563)]/20 text-[var(--table-color-textMuted,#9ca3af)]
              border border-[var(--table-color-border,#4b5563)]/40
              hover:bg-[var(--table-color-border,#4b5563)]/30 hover:text-[var(--table-color-text,#f3f4f6)]
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--table-color-primary,#6366f1)]
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={handleToggleExpand}
            disabled={disabled}
            aria-label="Show fewer items"
            data-testid="collapse-button"
          >
            <span>less</span>
            <svg 
              className="h-3 w-3 transition-transform rotate-180" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Total count indicator for reference */}
      {values.length > maxVisible && (
        <div className="mt-2 text-xs text-[var(--table-color-textMuted,#9ca3af)]">
          {isExpanded ? 'Showing all' : 'Showing first'} {Math.min(values.length, isExpanded ? values.length : maxVisible)} of {values.length} items
        </div>
      )}
    </div>
  );
};

export default CollectionDisplay;