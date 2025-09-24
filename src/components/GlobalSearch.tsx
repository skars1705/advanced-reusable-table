import React from 'react';
import { XIcon } from './icons/XIcon';
import { useThemeClasses } from './ThemeProvider';

export interface GlobalSearchProps {
  searchTerm: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'compact';
  showResultsCount?: boolean;
  resultsCount?: number;
  'aria-describedby'?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search...',
  className = '',
  variant = 'default',
  showResultsCount = false,
  resultsCount = 0,
  'aria-describedby': ariaDescribedBy,
}) => {
  const themeClasses = useThemeClasses();
  
  // Variant-specific sizing
  const sizeClasses = {
    default: {
      container: '',
      input: 'py-2 pl-10 pr-10 text-sm',
      icon: 'h-4 w-4',
      iconPadding: 'pl-3',
      clearPadding: 'pr-3',
    },
    compact: {
      container: '',
      input: 'py-1.5 pl-8 pr-8 text-xs',
      icon: 'h-3 w-3',
      iconPadding: 'pl-2.5',
      clearPadding: 'pr-2.5',
    },
  };
  
  const variantClasses = sizeClasses[variant];
  const searchInputId = `global-search-${Math.random().toString(36).substr(2, 9)}`;
  const resultsId = showResultsCount ? `${searchInputId}-results` : undefined;

  return (
    <div className={`relative ${variantClasses.container} ${className}`}>
      <div className="relative">
        <input
          id={searchInputId}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] ${variantClasses.input} text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition-colors`}
          aria-label="Global search"
          aria-describedby={[ariaDescribedBy, resultsId].filter(Boolean).join(' ') || undefined}
          role="searchbox"
        />
        
        {/* Search Icon */}
        <div className={`absolute inset-y-0 left-0 ${variantClasses.iconPadding} flex items-center pointer-events-none`}>
          <svg 
            className={`${variantClasses.icon} text-[var(--table-color-textMuted,#9ca3af)]`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            role="img"
            aria-label="Search"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className={`absolute inset-y-0 right-0 ${variantClasses.clearPadding} flex items-center text-[var(--table-color-textMuted,#9ca3af)] hover:text-[var(--table-color-text,#f3f4f6)] focus:text-[var(--table-color-text,#f3f4f6)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] rounded-[var(--table-border-radius,0.375rem)]`}
            aria-label="Clear search"
            type="button"
          >
            <XIcon className={variantClasses.icon} />
          </button>
        )}
      </div>
      
      {/* Search Results Count */}
      {showResultsCount && searchTerm && (
        <div 
          id={resultsId}
          className={`mt-1 ${variant === 'compact' ? 'text-xs' : 'text-xs'} text-[var(--table-color-textMuted,#9ca3af)]`}
          role="status"
          aria-live="polite"
        >
          {resultsCount === 0 ? 'No results found' : 
           resultsCount === 1 ? '1 result found' : 
           `${resultsCount.toLocaleString()} results found`}
        </div>
      )}
      
      {/* Default search hint when no results count shown */}
      {!showResultsCount && searchTerm && (
        <div className={`mt-1 ${variant === 'compact' ? 'text-xs' : 'text-xs'} text-[var(--table-color-textMuted,#9ca3af)]`}>
          Searching across columns
        </div>
      )}
    </div>
  );
};

// Export prop types for better TypeScript integration
export type GlobalSearchVariant = 'default' | 'compact';