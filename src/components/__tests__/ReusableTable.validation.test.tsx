/**
 * ReusableTable.validation.test.tsx
 *
 * Tests for prop validation to ensure component fails gracefully with clear error messages.
 * These tests verify the fixes for the critical issues identified in the report.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ReusableTable } from '../ReusableTable';
import { ThemeProvider } from '../ThemeProvider';
import type { Column, ViewConfiguration } from '../../types';

interface TestUser {
  id: number;
  name: string;
  email: string;
}

const validColumns: Column<TestUser>[] = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true, filterable: true },
  { header: 'Email', accessor: 'email', filterable: true },
];

const validData: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const validViewConfig: ViewConfiguration<TestUser> = {
  id: 'test-view',
  name: 'Test View',
  visibleColumns: ['id', 'name', 'email'],
  groupBy: [],
  sortConfig: [],
  filterConfig: [],
};

describe('ReusableTable - Prop Validation', () => {
  describe('allColumns validation', () => {
    it('should throw error when allColumns is not an array', () => {
      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={null as any}
              data={validData}
              viewConfig={validViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "allColumns" prop must be an array');
    });

    it('should throw error when allColumns is empty', () => {
      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={[]}
              data={validData}
              viewConfig={validViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "allColumns" prop must contain at least one column definition');
    });

    it('should throw error when column is missing header', () => {
      const invalidColumns = [
        { accessor: 'name' } as any,
      ];

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={invalidColumns}
              data={validData}
              viewConfig={validViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] Column at index 0 is missing required "header" property');
    });

    it('should throw error when column is missing accessor', () => {
      const invalidColumns = [
        { header: 'Name' } as any,
      ];

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={invalidColumns}
              data={validData}
              viewConfig={validViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] Column at index 0 is missing required "accessor" property');
    });
  });

  describe('data validation', () => {
    it('should throw error when data is not an array', () => {
      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={null as any}
              viewConfig={validViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "data" prop must be an array');
    });

    it('should render successfully with empty data array', () => {
      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={[]}
              viewConfig={validViewConfig}
            />
          </ThemeProvider>
        );
      }).not.toThrow();
    });
  });

  describe('viewConfig validation', () => {
    it('should throw error when viewConfig is not an object', () => {
      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={null as any}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig" prop is required and must be an object');
    });

    it('should throw error when viewConfig.id is missing', () => {
      const invalidViewConfig = {
        name: 'Test',
        visibleColumns: ['name'],
        groupBy: [],
        sortConfig: [],
        filterConfig: [],
      } as any;

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.id" is required and must be a string');
    });

    it('should throw error when viewConfig.name is missing', () => {
      const invalidViewConfig = {
        id: 'test',
        visibleColumns: ['name'],
        groupBy: [],
        sortConfig: [],
        filterConfig: [],
      } as any;

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.name" is required and must be a string');
    });

    it('should throw error when visibleColumns is not an array', () => {
      const invalidViewConfig = {
        id: 'test',
        name: 'Test',
        visibleColumns: 'name' as any,
        groupBy: [],
        sortConfig: [],
        filterConfig: [],
      };

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.visibleColumns" must be an array of column accessors');
    });

    it('should throw error when visibleColumns is empty', () => {
      const invalidViewConfig = {
        ...validViewConfig,
        visibleColumns: [] as any,
      };

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.visibleColumns" must contain at least one column accessor');
    });

    it('should throw error when visibleColumns references non-existent column', () => {
      const invalidViewConfig = {
        ...validViewConfig,
        visibleColumns: ['name', 'phone'] as any,
      };

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] The following columns in "viewConfig.visibleColumns" do not exist in "allColumns": "phone"');
    });

    it('should throw error when groupBy is not an array', () => {
      const invalidViewConfig = {
        ...validViewConfig,
        groupBy: 'name' as any,
      };

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.groupBy" must be an array');
    });

    it('should throw error when sortConfig is not an array', () => {
      const invalidViewConfig = {
        ...validViewConfig,
        sortConfig: null as any,
      };

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.sortConfig" must be an array');
    });

    it('should throw error when filterConfig is not an array', () => {
      const invalidViewConfig = {
        ...validViewConfig,
        filterConfig: undefined as any,
      };

      expect(() => {
        render(
          <ThemeProvider theme="light">
            <ReusableTable
              allColumns={validColumns}
              data={validData}
              viewConfig={invalidViewConfig}
            />
          </ThemeProvider>
        );
      }).toThrow('[ReusableTable] "viewConfig.filterConfig" must be an array');
    });
  });

  describe('successful render with valid props', () => {
    it('should render successfully with all valid required props', () => {
      const { container } = render(
        <ThemeProvider theme="light">
          <ReusableTable
            allColumns={validColumns}
            data={validData}
            viewConfig={validViewConfig}
          />
        </ThemeProvider>
      );

      expect(container.querySelector('table')).toBeTruthy();
    });

    it('should render column headers correctly', () => {
      const { getByText } = render(
        <ThemeProvider theme="light">
          <ReusableTable
            allColumns={validColumns}
            data={validData}
            viewConfig={validViewConfig}
          />
        </ThemeProvider>
      );

      expect(getByText('ID')).toBeTruthy();
      expect(getByText('Name')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
    });

    it('should render data rows correctly', () => {
      const { getByText } = render(
        <ThemeProvider theme="light">
          <ReusableTable
            allColumns={validColumns}
            data={validData}
            viewConfig={validViewConfig}
          />
        </ThemeProvider>
      );

      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
      expect(getByText('jane@example.com')).toBeTruthy();
    });
  });
});
