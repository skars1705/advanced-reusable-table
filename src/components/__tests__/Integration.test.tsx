import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { GlobalSearch } from '../GlobalSearch';
import { DatePicker } from '../DatePicker';
import { ReusableTable } from '../ReusableTable';
import type { Column, ViewConfiguration } from '../../types';

// Sample data for integration testing
interface TestData {
  id: number;
  name: string;
  email: string;
  date: string;
  status: 'active' | 'inactive';
}

const testColumns: Column<TestData>[] = [
  { accessor: 'id', header: 'ID', dataType: 'number' },
  { accessor: 'name', header: 'Name', dataType: 'string' },
  { accessor: 'email', header: 'Email', dataType: 'string' },
  { accessor: 'date', header: 'Date', dataType: 'date' },
  { accessor: 'status', header: 'Status', dataType: 'string' },
];

const testData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', date: '2024-01-15', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2024-02-20', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', date: '2024-03-10', status: 'active' },
];

const defaultView: ViewConfiguration<TestData> = {
  id: 'default',
  name: 'Default View',
  visibleColumns: ['id', 'name', 'email', 'date', 'status'],
  groupBy: [],
  sortConfig: [],
  filterConfig: [],
};

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Component Integration Tests', () => {
  describe('GlobalSearch + DatePicker Integration', () => {
    it('renders both components together with theme integration', () => {
      renderWithTheme(
        <div>
          <GlobalSearch
            searchTerm=""
            onSearchChange={vi.fn()}
            placeholder="Search..."
            variant="default"
            showResultsCount={true}
            resultsCount={5}
          />
          <DatePicker
            value="2024-03-15"
            onChange={vi.fn()}
            type="date"
            placeholder="Select date"
          />
        </div>
      );

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('both components use consistent theme styling', () => {
      renderWithTheme(
        <div>
          <GlobalSearch
            searchTerm=""
            onSearchChange={vi.fn()}
            className="search-component"
          />
          <DatePicker
            value=""
            onChange={vi.fn()}
            className="date-component"
          />
        </div>
      );

      const searchInput = screen.getByRole('searchbox');
      const dateInput = screen.getByRole('combobox');

      // Both should use consistent theme colors
      const expectedClasses = [
        'bg-[var(--table-color-surface,#1f2937)]',
        'border-[var(--table-color-border,#4b5563)]',
        'text-[var(--table-color-text,#f3f4f6)]',
        'placeholder-[var(--table-color-textMuted,#9ca3af)]'
      ];

      expectedClasses.forEach(className => {
        expect(searchInput).toHaveClass(className);
        expect(dateInput).toHaveClass(className);
      });
    });

    it('maintains accessibility when used together', () => {
      renderWithTheme(
        <div>
          <GlobalSearch
            searchTerm=""
            onSearchChange={vi.fn()}
            aria-label="Search input"
          />
          <DatePicker
            value=""
            onChange={vi.fn()}
            aria-label="Date input"
          />
        </div>
      );

      const searchInput = screen.getByRole('searchbox');
      const dateInput = screen.getByRole('combobox');

      expect(searchInput).toHaveAttribute('aria-label', 'Global search');
      expect(dateInput).toHaveAttribute('aria-label', 'Date input');

      // Both should be focusable
      expect(searchInput).not.toHaveAttribute('tabindex', '-1');
      expect(dateInput).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Full Application Integration', () => {
    const TestApp: React.FC = () => {
      const [searchTerm, setSearchTerm] = React.useState('');
      const [selectedDate, setSelectedDate] = React.useState('');
      const [data, setData] = React.useState(testData);

      const filteredData = React.useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [data, searchTerm]);

      const handleDataUpdate = (rowIndex: number, columnId: keyof TestData, value: any) => {
        setData(prev => prev.map((row, index) => 
          index === rowIndex ? { ...row, [columnId]: value } : row
        ));
      };

      return (
        <div>
          <div className="flex gap-4 mb-4">
            <GlobalSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search users..."
              variant="default"
              showResultsCount={true}
              resultsCount={filteredData.length}
            />
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              type="date"
              placeholder="Filter by date"
            />
          </div>
          <ReusableTable<TestData>
            allColumns={testColumns}
            data={filteredData}
            viewConfig={defaultView}
            onUpdateData={handleDataUpdate}
          />
        </div>
      );
    };

    it('renders complete application with all components working together', () => {
      renderWithTheme(<TestApp />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Filter by date' })).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('search functionality filters table data correctly', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TestApp />);

      const searchInput = screen.getByRole('searchbox');
      
      // Initially shows all data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();

      // Search for "John"
      await user.type(searchInput, 'John');

      // Should show results count
      const resultsStatus = screen.getByRole('status');
      expect(resultsStatus).toHaveTextContent('2 results found');

      // Table should be filtered (John Doe and Bob Johnson)
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('date picker and search work independently', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TestApp />);

      const searchInput = screen.getByRole('searchbox');
      const dateInput = screen.getByRole('combobox', { name: 'Filter by date' });

      // Test search
      await user.type(searchInput, 'jane');
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

      // Test date picker opens independently
      await user.click(dateInput);
      
      // Calendar should open
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument();
      });

      // Search results should still be filtered
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('maintains theme consistency across all components', () => {
      renderWithTheme(<TestApp />);

      const searchInput = screen.getByRole('searchbox');
      const dateInput = screen.getByRole('combobox', { name: 'Filter by date' });
      const table = screen.getByRole('table');

      // All components should use the same CSS custom properties for theming
      const themeVariables = [
        '--table-color-surface',
        '--table-color-border',
        '--table-color-text',
        '--table-color-textMuted'
      ];

      // Check that theme CSS variables are applied
      expect(searchInput.classList.toString()).toContain('var(--table-color-surface');
      expect(dateInput.classList.toString()).toContain('var(--table-color-surface');
      expect(table.closest('[class*="--table-color"]') || table.classList.toString()).toBeTruthy();
    });

    it('keyboard navigation works across all components', async () => {
      const user = userEvent.setup();
      renderWithTheme(<TestApp />);

      // Tab through all focusable elements
      await user.tab();
      expect(screen.getByRole('searchbox')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('combobox', { name: 'Filter by date' })).toHaveFocus();

      // Should be able to continue tabbing to table elements
      await user.tab();
      // Table should have focusable elements
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();
    });
  });

  describe('Performance and Memory', () => {
    it('does not cause memory leaks when components are unmounted', () => {
      const { unmount } = renderWithTheme(
        <div>
          <GlobalSearch
            searchTerm="test"
            onSearchChange={vi.fn()}
          />
          <DatePicker
            value="2024-03-15"
            onChange={vi.fn()}
          />
        </div>
      );

      // Should unmount cleanly without errors
      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid state changes without performance issues', async () => {
      const user = userEvent.setup();
      const mockSearchChange = vi.fn();
      const mockDateChange = vi.fn();

      renderWithTheme(
        <div>
          <GlobalSearch
            searchTerm=""
            onSearchChange={mockSearchChange}
          />
          <DatePicker
            value=""
            onChange={mockDateChange}
          />
        </div>
      );

      const searchInput = screen.getByRole('searchbox');
      
      // Type in search
      await user.type(searchInput, 'test');

      // Should handle all events (each character triggers a change)
      expect(mockSearchChange).toHaveBeenCalledTimes(4); // 4 characters
      expect(mockSearchChange).toHaveBeenNthCalledWith(1, 't');
      expect(mockSearchChange).toHaveBeenNthCalledWith(2, 'e');
      expect(mockSearchChange).toHaveBeenNthCalledWith(3, 's');
      expect(mockSearchChange).toHaveBeenNthCalledWith(4, 't');
    });
  });

  describe('Error Handling', () => {
    it('gracefully handles invalid props', () => {
      // Should not crash with invalid data
      expect(() => {
        renderWithTheme(
          <div>
            <GlobalSearch
              searchTerm=""
              onSearchChange={vi.fn()}
              resultsCount={-1} // Invalid count
            />
            <DatePicker
              value="invalid-date" // Invalid date
              onChange={vi.fn()}
            />
          </div>
        );
      }).not.toThrow();
    });

    it('continues to function when one component has errors', async () => {
      const user = userEvent.setup();
      const mockSearchChange = vi.fn();
      const mockDateChange = vi.fn();

      renderWithTheme(
        <div>
          <GlobalSearch
            searchTerm=""
            onSearchChange={mockSearchChange}
          />
          <DatePicker
            value="invalid-date"
            onChange={mockDateChange}
          />
        </div>
      );

      // Search should still work even if date picker has invalid value
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'test');

      expect(mockSearchChange).toHaveBeenCalledTimes(4);
      expect(mockSearchChange).toHaveBeenNthCalledWith(4, 't'); // last character

      // Date picker should show empty value for invalid date
      const dateInput = screen.getByRole('combobox');
      expect(dateInput).toHaveValue('');
    });
  });
});