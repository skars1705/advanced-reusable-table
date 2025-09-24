import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GlobalSearch } from '../GlobalSearch';
import { ThemeProvider } from '../ThemeProvider';

// Mock the ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('GlobalSearch - Core Functionality', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Search...');
    });

    it('displays custom placeholder', () => {
      renderWithTheme(
        <GlobalSearch {...defaultProps} placeholder="Search products..." />
      );
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('placeholder', 'Search products...');
    });

    it('displays search term value', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} searchTerm="test query" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('test query');
    });

    it('calls onSearchChange when user types', async () => {
      const mockOnSearchChange = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(
        <GlobalSearch {...defaultProps} onSearchChange={mockOnSearchChange} />
      );
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      // Check that onSearchChange was called for each character
      expect(mockOnSearchChange).toHaveBeenCalledWith('t');
      expect(mockOnSearchChange).toHaveBeenCalledWith('e');
      expect(mockOnSearchChange).toHaveBeenCalledWith('s');
      expect(mockOnSearchChange).toHaveBeenCalledWith('t');
      expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
    });

    it('shows search icon', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} />);
      
      const searchIcon = screen.getByRole('img', { name: 'Search' });
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Clear Button Functionality', () => {
    it('shows clear button when search term is not empty', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} searchTerm="test" />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toBeInTheDocument();
    });

    it('hides clear button when search term is empty', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} searchTerm="" />);
      
      const clearButton = screen.queryByRole('button', { name: 'Clear search' });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('clears search when clear button is clicked', async () => {
      const mockOnSearchChange = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test query" 
          onSearchChange={mockOnSearchChange} 
        />
      );
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      await user.click(clearButton);
      
      expect(mockOnSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('Variant Prop', () => {
    it('applies default variant styles by default', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('py-2', 'pl-10', 'pr-10', 'text-sm');
    });

    it('applies compact variant styles', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} variant="compact" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('py-1.5', 'pl-8', 'pr-8', 'text-xs');
    });

    it('uses correct icon sizes for default variant', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} variant="default" />);
      
      const searchIcon = screen.getByRole('img', { name: 'Search' });
      expect(searchIcon).toHaveClass('h-4', 'w-4');
    });

    it('uses correct icon sizes for compact variant', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} variant="compact" />);
      
      const searchIcon = screen.getByRole('img', { name: 'Search' });
      expect(searchIcon).toHaveClass('h-3', 'w-3');
    });
  });

  describe('Results Count Display', () => {
    it('shows results count when enabled and search term exists', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test" 
          showResultsCount={true}
          resultsCount={5}
        />
      );
      
      const resultsStatus = screen.getByRole('status');
      expect(resultsStatus).toHaveTextContent('5 results found');
    });

    it('shows singular result text for one result', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test" 
          showResultsCount={true}
          resultsCount={1}
        />
      );
      
      const resultsStatus = screen.getByRole('status');
      expect(resultsStatus).toHaveTextContent('1 result found');
    });

    it('shows no results text when count is zero', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test" 
          showResultsCount={true}
          resultsCount={0}
        />
      );
      
      const resultsStatus = screen.getByRole('status');
      expect(resultsStatus).toHaveTextContent('No results found');
    });

    it('shows default hint when results count is disabled', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test" 
          showResultsCount={false}
        />
      );
      
      expect(screen.getByText('Searching across columns')).toBeInTheDocument();
    });

    it('hides results count when search term is empty', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="" 
          showResultsCount={true}
          resultsCount={5}
        />
      );
      
      const resultsStatus = screen.queryByRole('status');
      expect(resultsStatus).not.toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('applies theme CSS custom properties', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass(
        'bg-[var(--table-color-surface,#1f2937)]',
        'border-[var(--table-color-border,#4b5563)]',
        'text-[var(--table-color-text,#f3f4f6)]',
        'placeholder-[var(--table-color-textMuted,#9ca3af)]',
        'focus:ring-[var(--table-color-primary,#6366f1)]',
        'focus:border-[var(--table-color-primary,#6366f1)]'
      );
    });

    it('applies theme styles to search icon', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} />);
      
      const searchIcon = screen.getByRole('img', { name: 'Search' });
      expect(searchIcon).toHaveClass('text-[var(--table-color-textMuted,#9ca3af)]');
    });

    it('applies theme styles to clear button', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} searchTerm="test" />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toHaveClass(
        'text-[var(--table-color-textMuted,#9ca3af)]',
        'hover:text-[var(--table-color-text,#f3f4f6)]',
        'focus:text-[var(--table-color-text,#f3f4f6)]'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          aria-describedby="search-help"
          searchTerm="test"
          showResultsCount={true}
          resultsCount={5}
        />
      );
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('role', 'searchbox');
      expect(input).toHaveAttribute('aria-label', 'Global search');
      
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('search-help');
    });

    it('associates results status with input', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test"
          showResultsCount={true}
          resultsCount={5}
        />
      );
      
      const input = screen.getByRole('searchbox');
      const resultsStatus = screen.getByRole('status');
      
      const describedBy = input.getAttribute('aria-describedby');
      const resultsId = resultsStatus.getAttribute('id');
      
      expect(describedBy).toContain(resultsId!);
    });

    it('has aria-live region for results count', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test"
          showResultsCount={true}
          resultsCount={5}
        />
      );
      
      const resultsStatus = screen.getByRole('status');
      expect(resultsStatus).toHaveAttribute('aria-live', 'polite');
    });

    it('clear button has accessible name', () => {
      renderWithTheme(<GlobalSearch {...defaultProps} searchTerm="test" />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports focus and blur', async () => {
      const user = userEvent.setup();
      renderWithTheme(<GlobalSearch {...defaultProps} />);
      
      const input = screen.getByRole('searchbox');
      
      await user.tab();
      expect(input).toHaveFocus();
      
      await user.tab();
      expect(input).not.toHaveFocus();
    });

    it('clear button is focusable with keyboard', async () => {
      const user = userEvent.setup();
      renderWithTheme(<GlobalSearch {...defaultProps} searchTerm="test" />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      
      await user.tab();
      await user.tab(); // First tab goes to input, second to clear button
      
      expect(clearButton).toHaveFocus();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = renderWithTheme(
        <GlobalSearch {...defaultProps} className="custom-search-class" />
      );
      
      const outerDiv = container.querySelector('.custom-search-class');
      expect(outerDiv).toBeInTheDocument();
      expect(outerDiv).toHaveClass('relative', 'custom-search-class');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined resultsCount gracefully', () => {
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm="test"
          showResultsCount={true}
        />
      );
      
      const resultsStatus = screen.getByRole('status');
      expect(resultsStatus).toHaveTextContent('No results found');
    });

    it('handles empty string search term', () => {
      const mockOnSearchChange = vi.fn();
      renderWithTheme(
        <GlobalSearch 
          {...defaultProps} 
          searchTerm=""
          onSearchChange={mockOnSearchChange}
        />
      );
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('');
      
      const clearButton = screen.queryByRole('button', { name: 'Clear search' });
      expect(clearButton).not.toBeInTheDocument();
    });

    it('handles very large search terms', () => {
      const longSearchTerm = 'a'.repeat(1000);
      renderWithTheme(
        <GlobalSearch {...defaultProps} searchTerm={longSearchTerm} />
      );
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue(longSearchTerm);
    });
  });
});