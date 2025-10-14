/**
 * BasicTableExample.tsx
 *
 * A minimal, working example of the ReusableTable component.
 * This demonstrates the EXACT structure required to get the table working.
 *
 * Copy-paste ready - just import and use!
 */

import React, { useState } from 'react';
import { ReusableTable, ThemeProvider, Column, ViewConfiguration } from '@shaun1705/advanced-reusable-table';

// ============================================
// 1. DEFINE YOUR DATA TYPE
// ============================================
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

// ============================================
// 2. CREATE SAMPLE DATA
// ============================================
const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 32, isActive: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28, isActive: false },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, isActive: true },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', age: 35, isActive: true },
];

const BasicTableExample: React.FC = () => {
  // ============================================
  // 3. DEFINE YOUR STATE
  // ============================================
  const [data, setData] = useState<User[]>(sampleData);

  // ============================================
  // 4. DEFINE ALL COLUMNS
  // ============================================
  // CRITICAL: Each column MUST have 'header' and 'accessor'
  // The 'accessor' MUST match a key in your User type
  const allColumns: Column<User>[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      filterable: true,
      dataType: 'number',
      align: 'right',
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      filterable: true,
      dataType: 'string',
      editable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
      filterable: true,
      dataType: 'string',
      editable: true,
    },
    {
      header: 'Age',
      accessor: 'age',
      sortable: true,
      filterable: true,
      dataType: 'number',
      editable: true,
      align: 'right',
    },
    {
      header: 'Active',
      accessor: 'isActive',
      sortable: true,
      filterable: true,
      cellType: 'toggle',
      editable: true,
    },
  ];

  // ============================================
  // 5. DEFINE VIEW CONFIGURATION
  // ============================================
  // CRITICAL: All properties are REQUIRED
  // - visibleColumns: array of accessors (must match Column.accessor values)
  // - groupBy: array for grouping (empty array [] if no grouping)
  // - sortConfig: array for default sorting (empty array [] if no sorting)
  // - filterConfig: array for default filters (empty array [] if no filters)
  const viewConfig: ViewConfiguration<User> = {
    id: 'default-view',
    name: 'Default View',
    visibleColumns: ['id', 'name', 'email', 'age', 'isActive'], // MUST match Column accessors
    groupBy: [], // No grouping
    sortConfig: [], // No initial sorting
    filterConfig: [], // No initial filters
  };

  // ============================================
  // 6. DEFINE UPDATE HANDLER (Optional)
  // ============================================
  const handleUpdateData = (rowIndex: number, columnId: keyof User, value: any) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value,
      };
      return newData;
    });
  };

  // ============================================
  // 7. RENDER THE TABLE
  // ============================================
  return (
    <ThemeProvider theme="light">
      <div style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1rem', color: '#1f2937' }}>Basic Table Example</h1>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
          This demonstrates the minimal required props for ReusableTable.
        </p>

        <ReusableTable<User>
          allColumns={allColumns}
          data={data}
          viewConfig={viewConfig}
          onUpdateData={handleUpdateData}
        />

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1f2937' }}>Tips:</h3>
          <ul style={{ color: '#4b5563', paddingLeft: '1.5rem' }}>
            <li>Double-click cells to edit (for editable columns)</li>
            <li>Click column headers to sort</li>
            <li>Use filter inputs below headers to filter data</li>
            <li>Toggle the "Active" switch to see live updates</li>
          </ul>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default BasicTableExample;

// ============================================
// COMMON PITFALLS TO AVOID
// ============================================
/**
 * ❌ WRONG: Missing required viewConfig properties
 * const viewConfig = {
 *   visibleColumns: ['name', 'email']  // Missing id, name, groupBy, etc.
 * };
 *
 * ✅ CORRECT: All properties present
 * const viewConfig = {
 *   id: 'my-view',
 *   name: 'My View',
 *   visibleColumns: ['name', 'email'],
 *   groupBy: [],
 *   sortConfig: [],
 *   filterConfig: []
 * };
 */

/**
 * ❌ WRONG: Accessor doesn't match data property
 * const columns = [
 *   { header: 'Name', accessor: 'userName' }  // But data has 'name', not 'userName'
 * ];
 *
 * ✅ CORRECT: Accessor matches data property exactly
 * const columns = [
 *   { header: 'Name', accessor: 'name' }  // Matches User['name']
 * ];
 */

/**
 * ❌ WRONG: visibleColumns references non-existent column
 * const viewConfig = {
 *   visibleColumns: ['name', 'username']  // 'username' not in allColumns
 * };
 *
 * ✅ CORRECT: Only reference columns that exist in allColumns
 * const viewConfig = {
 *   visibleColumns: ['name', 'email']  // Both exist in allColumns
 * };
 */
