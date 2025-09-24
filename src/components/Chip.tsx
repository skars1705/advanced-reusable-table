import React, { forwardRef, useCallback } from 'react';
import { XIcon } from './icons/XIcon';

export interface ChipProps {
  /** The text content displayed in the chip */
  label: string;
  /** The value associated with this chip */
  value: string;
  /** Optional background color for the chip */
  color?: string;
  /** Whether the chip can be removed */
  removable?: boolean;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Size variant of the chip */
  size?: 'sm' | 'md' | 'lg';
  /** Callback when the chip is removed */
  onRemove?: (value: string) => void;
  /** Callback when the chip is clicked */
  onClick?: (value: string) => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Additional CSS classes */
  className?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}

/**
 * Chip - Interactive badge component for displaying selected values
 * 
 * Features:
 * - Multiple size variants (sm, md, lg)
 * - Custom color support with theme integration
 * - Removable functionality with keyboard support
 * - Full accessibility with ARIA attributes
 * - Hover and focus states with smooth transitions
 * - Theme-aware styling with CSS custom properties
 */
const ChipComponent = forwardRef<HTMLDivElement, ChipProps>(({
  label,
  value,
  color,
  removable = false,
  disabled = false,
  size = 'md',
  onRemove,
  onClick,
  'aria-label': ariaLabel,
  className = '',
  tabIndex = 0,
  ...props
}, ref) => {
  // Handle chip click
  const handleClick = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    onClick?.(value);
  }, [disabled, onClick, value]);

  // Handle remove button click
  const handleRemove = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    onRemove?.(value);
  }, [disabled, onRemove, value]);

  // Handle keyboard interactions
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (onClick) {
          onClick(value);
        } else if (removable && onRemove) {
          onRemove(value);
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (removable && onRemove) {
          event.preventDefault();
          onRemove(value);
        }
        break;
      case 'Escape':
        // Allow parent to handle escape
        break;
    }
  }, [disabled, onClick, onRemove, removable, value]);

  // Handle remove button keyboard interactions
  const handleRemoveKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        onRemove?.(value);
        break;
    }
  }, [disabled, onRemove, value]);

  // Size-based styling
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2'
  }[size];

  // Remove button size
  const removeButtonSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }[size];

  // Base classes with theme integration
  const baseClasses = [
    // Layout and spacing
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200',
    sizeClasses,
    
    // Interactive states
    !disabled && (onClick || removable) && 'cursor-pointer',
    !disabled && 'hover:scale-105',
    disabled && 'opacity-50 cursor-not-allowed',
    
    // Focus states
    !disabled && 'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--table-color-primary,#6366f1)]',
    
    // Custom class
    className
  ].filter(Boolean).join(' ');

  // Color styling - support both theme colors and custom colors
  const colorStyles: React.CSSProperties = {};
  if (color) {
    // Custom color provided
    colorStyles.backgroundColor = `${color}20`; // 20% opacity
    colorStyles.color = color;
    colorStyles.borderColor = `${color}40`; // 40% opacity border
  }

  // Default theme-based styling if no custom color
  const defaultColorClasses = !color ? [
    'bg-[var(--table-color-primary,#6366f1)]/10',
    'text-[var(--table-color-primary,#6366f1)]',
    'border border-[var(--table-color-primary,#6366f1)]/20',
    !disabled && 'hover:bg-[var(--table-color-primary,#6366f1)]/20',
    !disabled && 'hover:border-[var(--table-color-primary,#6366f1)]/30'
  ].filter(Boolean).join(' ') : '';

  const finalClasses = `${baseClasses} ${defaultColorClasses}`;

  return (
    <div
      ref={ref}
      className={finalClasses}
      style={color ? colorStyles : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : tabIndex}
      role={onClick ? 'button' : 'listitem'}
      aria-label={ariaLabel || `${label} chip${removable ? ', removable' : ''}`}
      aria-disabled={disabled}
      data-testid={`chip-${value}`}
      {...props}
    >
      {/* Chip label */}
      <span className="truncate max-w-[150px]" title={label}>
        {label}
      </span>

      {/* Remove button */}
      {removable && !disabled && (
        <button
          type="button"
          className={`
            ml-1 flex-shrink-0 rounded-full p-0.5 transition-colors
            hover:bg-current/20 focus:outline-none focus:bg-current/20
            ${removeButtonSize}
          `}
          onClick={handleRemove}
          onKeyDown={handleRemoveKeyDown}
          tabIndex={-1}
          aria-label={`Remove ${label}`}
          data-testid={`chip-remove-${value}`}
        >
          <XIcon className="h-full w-full" />
        </button>
      )}
    </div>
  );
});

// Set displayName for React 19.1.1 compatibility - v1.0.3 fix
ChipComponent.displayName = 'Chip';

// Export with proper naming
export const Chip = ChipComponent;
export default ChipComponent;