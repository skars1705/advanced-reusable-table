import React from 'react';
import { ReusableTable, type Column, type ViewConfiguration } from './src/index';

// Test data for skills/collection validation
interface TestPerson {
  id: number;
  name: string;
  skills: string[];
  department: string;
}

const testData: TestPerson[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    skills: ['React', 'TypeScript', 'Node.js'],
    department: 'Engineering'
  },
  {
    id: 2,
    name: 'Bob Smith',
    skills: ['Python', 'Django', 'PostgreSQL'],
    department: 'Backend'
  },
  {
    id: 3,
    name: 'Carol Davis',
    skills: ['UI/UX', 'Figma', 'CSS'],
    department: 'Design'
  }
];

const testColumns: Column<TestPerson>[] = [
  {
    accessor: 'name',
    header: 'Name',
    sortable: true,
    filterable: true,
  },
  {
    accessor: 'skills',
    header: 'Skills',
    dataType: 'collection',
    sortable: false,
    filterable: true,
    collectionConfig: {
      type: 'checkbox',
      displayMode: 'chips',
      options: [
        { value: 'React', label: 'React', color: '#61dafb' },
        { value: 'TypeScript', label: 'TypeScript', color: '#3178c6' },
        { value: 'Node.js', label: 'Node.js', color: '#339933' },
        { value: 'Python', label: 'Python', color: '#3776ab' },
        { value: 'Django', label: 'Django', color: '#092e20' },
        { value: 'PostgreSQL', label: 'PostgreSQL', color: '#336791' },
        { value: 'UI/UX', label: 'UI/UX', color: '#ff6b6b' },
        { value: 'Figma', label: 'Figma', color: '#f24e1e' },
        { value: 'CSS', label: 'CSS', color: '#1572b6' }
      ]
    }
  },
  {
    accessor: 'department',
    header: 'Department',
    sortable: true,
    filterable: true,
  }
];

const testView: ViewConfiguration<TestPerson> = {
  id: 'test-view',
  name: 'Test View',
  visibleColumns: ['name', 'skills', 'department'],
  groupBy: [],
  sortConfig: [],
  filterConfig: []
};

/**
 * React 19.1.1 Compatibility Test Component
 * 
 * This component tests the critical rendering issues:
 * 1. Skills chips should render as colored chip components (not plain text)
 * 2. Sort icons should display as proper SVG icons (not Unicode arrows)
 * 3. Filter inputs should appear as styled components (not basic HTML)
 */
export const React19CompatibilityTest: React.FC = () => {
  const handleUpdateData = (rowIndex: number, columnId: keyof TestPerson, value: any) => {
    console.log('Data update:', { rowIndex, columnId, value });
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#111827', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f3f4f6', fontSize: '2rem', marginBottom: '1rem' }}>
          React 19.1.1 Compatibility Test
        </h1>
        <div style={{ color: '#9ca3af', fontSize: '1rem' }}>
          <p>✅ Skills should show as colored chip components (not "React TypeScript")</p>
          <p>✅ Sort icons should be proper SVG icons (not ▲▼)</p>
          <p>✅ Filter inputs should be styled components (not basic HTML inputs)</p>
        </div>
      </div>
      
      <ReusableTable
        allColumns={testColumns}
        data={testData}
        viewConfig={testView}
        onUpdateData={handleUpdateData}
      />
    </div>
  );
};

export default React19CompatibilityTest;