import React from 'react';
import { ReusableTable, useRowSelection, ThemeProvider } from './src/index';
import type { Column, ViewConfiguration } from './src/types';

interface SimpleUser {
  id: number;
  name: string;
  email: string;
}

const simpleUsers: SimpleUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
];

const columns: Column<SimpleUser>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
];

const viewConfig: ViewConfiguration<SimpleUser> = {
  id: 'simple',
  name: 'Simple View',
  visibleColumns: ['name', 'email'],
  groupBy: [],
  sortConfig: [],
  filterConfig: []
};

const SimpleTest: React.FC = () => {
  const rowSelection = useRowSelection<SimpleUser>({
    data: simpleUsers,
    mode: 'multiple',
    onSelectionChange: (selected) => {
      console.log('Selected rows:', selected);
    }
  });

  return (
    <ThemeProvider>
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        <h1>Simple Table Test</h1>
        <p>Testing the reusable table component</p>
        
        <ReusableTable
          allColumns={columns}
          data={simpleUsers}
          viewConfig={viewConfig}
          rowSelection={rowSelection}
        />
      </div>
    </ThemeProvider>
  );
};

export default SimpleTest;