/**
 * COMPREHENSIVE USAGE EXAMPLES
 * 
 * This file demonstrates all the correct ways to use the Advanced Reusable Table
 * component after the fixes have been applied. Use these patterns in your projects.
 */

import React, { useState, useCallback } from 'react';
import { 
  ReusableTable, 
  useRowSelection, 
  useTableSelection,
  useSimpleTableSelection,
  ThemeProvider,
  type Column,
  type ViewConfiguration,
  type SelectionMode,
} from '@shaun1705/advanced-reusable-table';

// Import CSS - this is now bundled automatically, but you can import explicitly if needed
// import '@shaun1705/advanced-reusable-table/dist/style.css';

// Sample data interface
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  skills: string[];
  isActive: boolean;
  startDate: string;
}

const employees: Employee[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@company.com',
    department: 'Engineering',
    salary: 95000,
    skills: ['React', 'TypeScript', 'Node.js'],
    isActive: true,
    startDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@company.com',
    department: 'Design',
    salary: 75000,
    skills: ['Figma', 'Adobe XD', 'CSS'],
    isActive: true,
    startDate: '2021-08-20',
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@company.com',
    department: 'Engineering',
    salary: 110000,
    skills: ['Python', 'Django', 'PostgreSQL'],
    isActive: false,
    startDate: '2020-03-10',
  },
];

// Column definitions
const columns: Column<Employee>[] = [
  { 
    header: 'Name', 
    accessor: 'name', 
    sortable: true, 
    filterable: true 
  },
  { 
    header: 'Email', 
    accessor: 'email', 
    sortable: true, 
    filterable: true 
  },
  { 
    header: 'Department', 
    accessor: 'department', 
    sortable: true, 
    filterable: true 
  },
  { 
    header: 'Salary', 
    accessor: 'salary', 
    sortable: true, 
    filterable: true, 
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
    align: 'right'
  },
  { 
    header: 'Skills', 
    accessor: 'skills', 
    dataType: 'collection',
    collectionConfig: {
      type: 'chip',
      options: [
        { value: 'React', label: 'React', color: '#61dafb' },
        { value: 'TypeScript', label: 'TypeScript', color: '#3178c6' },
        { value: 'Node.js', label: 'Node.js', color: '#339933' },
        { value: 'Python', label: 'Python', color: '#3776ab' },
        { value: 'Django', label: 'Django', color: '#092e20' },
        { value: 'PostgreSQL', label: 'PostgreSQL', color: '#336791' },
        { value: 'Figma', label: 'Figma', color: '#f24e1e' },
        { value: 'Adobe XD', label: 'Adobe XD', color: '#ff61f6' },
        { value: 'CSS', label: 'CSS', color: '#1572b6' },
      ]
    }
  },
  { 
    header: 'Active', 
    accessor: 'isActive', 
    cellType: 'toggle',
    editable: true
  },
  { 
    header: 'Start Date', 
    accessor: 'startDate', 
    sortable: true, 
    filterable: true, 
    dataType: 'date',
    dateOptions: { locale: 'en-US', dateStyle: 'medium' }
  },
];

const defaultViewConfig: ViewConfiguration<Employee> = {
  id: 'default',
  name: 'All Employees',
  visibleColumns: ['name', 'email', 'department', 'salary', 'skills', 'isActive', 'startDate'],
  groupBy: [],
  sortConfig: [{ key: 'name', direction: 'ascending' }],
  filterConfig: [],
};

/**
 * EXAMPLE 1: Basic Usage with Simple Row Selection
 * ✅ Most common use case - just works out of the box
 */
export const BasicUsageExample: React.FC = () => {
  // ✅ FIXED: Use 'mode' parameter (not 'selectionMode')
  const rowSelection = useRowSelection<Employee>({
    data: employees,
    mode: 'multiple', // ✅ Correct parameter name
    onSelectionChange: (selected) => {
      console.log('Selected employees:', selected.map(emp => emp.name));
    },
  });

  const handleDataUpdate = useCallback((rowIndex: number, columnId: keyof Employee, value: any) => {
    console.log('Update employee data:', { rowIndex, columnId, value });
    // In real app: updateEmployeeInDatabase(employees[rowIndex].id, { [columnId]: value });
  }, []);

  return (
    <ThemeProvider>
      <div className="p-6 bg-[var(--table-color-background)] min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-text)]">
          Basic Usage Example
        </h2>
        
        {/* ✅ FIXED: Direct prop spreading - no complex workarounds needed */}
        <ReusableTable<Employee>
          allColumns={columns}
          data={employees}
          viewConfig={defaultViewConfig}
          onUpdateData={handleDataUpdate}
          rowSelection={rowSelection} // ✅ Direct usage!
        />
        
        <div className="mt-4 p-4 bg-[var(--table-color-surface)] rounded-lg">
          <h3 className="font-medium text-[var(--table-color-text)]">Selection Status:</h3>
          <p className="text-[var(--table-color-textMuted)]">
            {rowSelection.selectedRowsArray.length} of {employees.length} employees selected
          </p>
          {rowSelection.selectedRowsArray.length > 0 && (
            <p className="text-sm text-[var(--table-color-textMuted)] mt-1">
              Selected: {rowSelection.selectedRowsArray.map(emp => emp.name).join(', ')}
            </p>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * EXAMPLE 2: Enhanced Usage with useTableSelection
 * ✅ Advanced features like max selection, batch operations
 */
export const EnhancedUsageExample: React.FC = () => {
  const tableSelection = useTableSelection<Employee>({
    data: employees,
    mode: 'multiple',
    maxSelection: 2, // Limit selection to 2 employees
    onSelectionChange: (selected) => {
      console.log('Enhanced selection changed:', selected);
    },
    onMaxSelectionReached: () => {
      alert('Maximum of 2 employees can be selected!');
    },
    enableBatch: true, // Enable batch operations for performance
  });

  const handleDataUpdate = useCallback((rowIndex: number, columnId: keyof Employee, value: any) => {
    console.log('Enhanced update:', { rowIndex, columnId, value });
  }, []);

  const handleBulkActivate = () => {
    // Example of using enhanced selection features
    console.log('Bulk activating employees:', tableSelection.selectedData);
  };

  const selectionSummary = tableSelection.getSelectionSummary();

  return (
    <ThemeProvider>
      <div className="p-6 bg-[var(--table-color-background)] min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-text)]">
          Enhanced Usage Example
        </h2>
        
        <div className="mb-4 flex gap-4">
          <button
            onClick={handleBulkActivate}
            disabled={tableSelection.selectedCount === 0}
            className="px-4 py-2 bg-[var(--table-color-primary)] text-white rounded-md disabled:opacity-50"
          >
            Bulk Activate Selected ({tableSelection.selectedCount})
          </button>
          
          <button
            onClick={tableSelection.clearSelection}
            disabled={tableSelection.selectedCount === 0}
            className="px-4 py-2 bg-[var(--table-color-error)] text-white rounded-md disabled:opacity-50"
          >
            Clear Selection
          </button>
        </div>

        <ReusableTable<Employee>
          allColumns={columns}
          data={employees}
          viewConfig={defaultViewConfig}
          onUpdateData={handleDataUpdate}
          rowSelection={tableSelection} // ✅ Enhanced selection with limits
        />
        
        <div className="mt-4 p-4 bg-[var(--table-color-surface)] rounded-lg">
          <h3 className="font-medium text-[var(--table-color-text)] mb-2">Enhanced Selection Status:</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[var(--table-color-textMuted)]">Selected:</span>
              <span className="ml-2 text-[var(--table-color-text)]">{selectionSummary.selected}</span>
            </div>
            <div>
              <span className="text-[var(--table-color-textMuted)]">Total:</span>
              <span className="ml-2 text-[var(--table-color-text)]">{selectionSummary.total}</span>
            </div>
            <div>
              <span className="text-[var(--table-color-textMuted)]">Percentage:</span>
              <span className="ml-2 text-[var(--table-color-text)]">{selectionSummary.percentage}%</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-[var(--table-color-textMuted)]">Can select more:</span>
            <span className="ml-2 text-[var(--table-color-text)]">
              {tableSelection.canSelectMore ? 'Yes' : 'No (limit reached)'}
            </span>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * EXAMPLE 3: Simple One-Liner Usage
 * ✅ For when you just need basic selection with minimal code
 */
export const SimpleUsageExample: React.FC = () => {
  const handleDataUpdate = useCallback((rowIndex: number, columnId: keyof Employee, value: any) => {
    console.log('Simple update:', { rowIndex, columnId, value });
  }, []);

  // ✅ One-liner for basic multiple selection
  const simpleSelection = useSimpleTableSelection(employees, 'single');

  return (
    <ThemeProvider>
      <div className="p-6 bg-[var(--table-color-background)] min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-text)]">
          Simple One-Liner Example
        </h2>
        
        <ReusableTable<Employee>
          allColumns={columns}
          data={employees}
          viewConfig={defaultViewConfig}
          onUpdateData={handleDataUpdate}
          rowSelection={simpleSelection} // ✅ One-liner usage
        />
        
        <div className="mt-4 p-4 bg-[var(--table-color-surface)] rounded-lg">
          <p className="text-[var(--table-color-textMuted)]">
            Single selection mode with minimal setup
            {simpleSelection.selectedCount > 0 && (
              <span className="ml-2 text-[var(--table-color-text)]">
                - Selected: {simpleSelection.selectedData[0]?.name}
              </span>
            )}
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * EXAMPLE 4: Different Selection Modes
 * ✅ Demonstrates all three selection modes
 */
export const SelectionModesExample: React.FC = () => {
  const [mode, setMode] = useState<SelectionMode>('multiple');

  const rowSelection = useRowSelection<Employee>({
    data: employees,
    mode,
    onSelectionChange: (selected) => {
      console.log(`${mode} selection:`, selected);
    },
  });

  const handleDataUpdate = useCallback((rowIndex: number, columnId: keyof Employee, value: any) => {
    console.log('Mode example update:', { rowIndex, columnId, value });
  }, []);

  return (
    <ThemeProvider>
      <div className="p-6 bg-[var(--table-color-background)] min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-text)]">
          Selection Modes Example
        </h2>
        
        <div className="mb-4 flex gap-4">
          <label className="flex items-center gap-2 text-[var(--table-color-text)]">
            <input
              type="radio"
              name="mode"
              checked={mode === 'none'}
              onChange={() => setMode('none')}
              className="text-[var(--table-color-primary)]"
            />
            No Selection
          </label>
          <label className="flex items-center gap-2 text-[var(--table-color-text)]">
            <input
              type="radio"
              name="mode"
              checked={mode === 'single'}
              onChange={() => setMode('single')}
              className="text-[var(--table-color-primary)]"
            />
            Single Selection
          </label>
          <label className="flex items-center gap-2 text-[var(--table-color-text)]">
            <input
              type="radio"
              name="mode"
              checked={mode === 'multiple'}
              onChange={() => setMode('multiple')}
              className="text-[var(--table-color-primary)]"
            />
            Multiple Selection
          </label>
        </div>

        <ReusableTable<Employee>
          allColumns={columns}
          data={employees}
          viewConfig={defaultViewConfig}
          onUpdateData={handleDataUpdate}
          rowSelection={mode === 'none' ? undefined : rowSelection}
        />
        
        <div className="mt-4 p-4 bg-[var(--table-color-surface)] rounded-lg">
          <p className="text-[var(--table-color-textMuted)]">
            Current mode: <span className="text-[var(--table-color-text)] font-medium">{mode}</span>
            {mode !== 'none' && (
              <span className="ml-4">
                Selected: {rowSelection.selectedCount} employees
              </span>
            )}
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * EXAMPLE 5: Advanced Patterns - Custom Theme
 * ✅ Shows how to apply custom theming
 */
export const CustomThemeExample: React.FC = () => {
  const rowSelection = useRowSelection<Employee>({
    data: employees,
    mode: 'multiple',
  });

  const handleDataUpdate = useCallback((rowIndex: number, columnId: keyof Employee, value: any) => {
    console.log('Custom theme update:', { rowIndex, columnId, value });
  }, []);

  const customTheme = {
    colors: {
      primary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div className="p-6 bg-[var(--table-color-background)] min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-text)]">
          Custom Theme Example
        </h2>
        
        <ReusableTable<Employee>
          allColumns={columns}
          data={employees}
          viewConfig={defaultViewConfig}
          onUpdateData={handleDataUpdate}
          rowSelection={rowSelection}
        />
        
        <div className="mt-4 p-4 bg-[var(--table-color-surface)] rounded-lg border border-[var(--table-color-primary)] border-opacity-20">
          <p className="text-[var(--table-color-textMuted)]">
            This table uses a custom purple theme with cyan accents.
            The theme system uses CSS custom properties for easy customization.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
};

/**
 * MIGRATION GUIDE
 * 
 * If you were using the component with workarounds, here's how to migrate:
 */

// ❌ OLD (BROKEN) WAY:
/*
const userRowSelection = useRowSelection<DemoUser>({
  data: users,
  selectionMode: 'multiple', // ❌ Wrong parameter name
  onSelectionChange: (selectedRows) => {
    console.log('Selected users:', selectedRows);
  },
});

// Complex workaround needed:
<ReusableTable
  // ... other props
  rowSelection={{
    ...userRowSelection.selectionState,
    selectRow: userRowSelection.toggleRowSelection,
    selectAll: userRowSelection.toggleAllSelection,
    clearSelection: userRowSelection.clearSelection,
  }}
/>
*/

// ✅ NEW (FIXED) WAY:
/*
const userRowSelection = useRowSelection<DemoUser>({
  data: users,
  mode: 'multiple', // ✅ Correct parameter name
  onSelectionChange: (selectedRows) => {
    console.log('Selected users:', selectedRows);
  },
});

// Direct usage - no workarounds needed:
<ReusableTable
  // ... other props
  rowSelection={userRowSelection} // ✅ That's it!
/>
*/

export default {
  BasicUsageExample,
  EnhancedUsageExample,
  SimpleUsageExample,
  SelectionModesExample,
  CustomThemeExample,
};