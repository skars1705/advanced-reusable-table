# Basic Table Example

Simple data table implementation showing core features with minimal configuration.

## Overview

This example demonstrates the fundamental table features:
- Column sorting and filtering
- Basic data types (string, number, date)
- Responsive design
- Accessibility features

Perfect for getting started or when you need a straightforward data display.

## Implementation

### Data Structure

```typescript
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
}
```

### Sample Data

```typescript
const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    department: 'Engineering',
    salary: 95000,
    joinDate: '2022-03-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    department: 'Marketing',
    salary: 75000,
    joinDate: '2021-08-22',
    isActive: true
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol.williams@company.com',
    department: 'Sales',
    salary: 82000,
    joinDate: '2023-01-10',
    isActive: false
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@company.com',
    department: 'Engineering',
    salary: 105000,
    joinDate: '2020-11-05',
    isActive: true
  }
];
```

### Column Configuration

```typescript
import type { Column } from 'advanced-reusable-table';

const columns: Column<Employee>[] = [
  {
    header: 'Name',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    align: 'left'
  },
  {
    header: 'Email',
    accessor: 'email',
    dataType: 'string',
    filterable: true,
    align: 'left'
  },
  {
    header: 'Department',
    accessor: 'department',
    dataType: 'string',
    sortable: true,
    filterable: true,
    groupable: true,
    align: 'left'
  },
  {
    header: 'Salary',
    accessor: 'salary',
    dataType: 'currency',
    currencyOptions: {
      locale: 'en-US',
      currency: 'USD'
    },
    sortable: true,
    filterable: true,
    align: 'right'
  },
  {
    header: 'Join Date',
    accessor: 'joinDate',
    dataType: 'date',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'medium'
    },
    sortable: true,
    filterable: true
  },
  {
    header: 'Active',
    accessor: 'isActive',
    cellType: 'checkbox',
    align: 'center',
    sortable: true
  }
];
```

### View Configuration

```typescript
import type { ViewConfiguration } from 'advanced-reusable-table';

const defaultView: ViewConfiguration<Employee> = {
  id: 'employee-overview',
  name: 'Employee Overview',
  visibleColumns: ['name', 'email', 'department', 'salary', 'joinDate', 'isActive'],
  groupBy: [],
  sortConfig: [
    { key: 'name', direction: 'ascending' }
  ],
  filterConfig: []
};
```

### Complete Component

```tsx
import React from 'react';
import { ReusableTable, ThemeProvider } from 'advanced-reusable-table';
import type { Column, ViewConfiguration } from 'advanced-reusable-table';
import 'advanced-reusable-table/dist/style.css';

const BasicTableExample: React.FC = () => {
  return (
    <ThemeProvider>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Employee Directory</h1>
        
        <ReusableTable
          allColumns={columns}
          data={employees}
          viewConfig={defaultView}
        />
      </div>
    </ThemeProvider>
  );
};

export default BasicTableExample;
```

## Features Included

### ✅ Column Sorting
- Click any header to sort
- Multi-column sorting with Shift+click
- Sort indicators show direction and order

### ✅ Advanced Filtering
- **String columns**: Contains, equals, starts with, ends with
- **Currency columns**: =, !=, >, <, >=, <=, between
- **Date columns**: Is, before, after, date range
- **Boolean columns**: True/false filtering

### ✅ Responsive Design
- Horizontal scrolling on mobile devices
- Adaptive column widths
- Touch-friendly interface

### ✅ Accessibility
- Full keyboard navigation
- Screen reader support
- ARIA labels and descriptions
- High contrast support

## Usage Patterns

### Department Grouping

```typescript
const groupedView: ViewConfiguration<Employee> = {
  id: 'by-department',
  name: 'By Department',
  visibleColumns: ['name', 'email', 'salary', 'joinDate', 'isActive'],
  groupBy: ['department'],    // Group by department
  sortConfig: [
    { key: 'department', direction: 'ascending' },
    { key: 'salary', direction: 'descending' }
  ],
  filterConfig: []
};
```

### Filtered Views

Create pre-filtered views for common scenarios:

```typescript
const activeEmployeesView: ViewConfiguration<Employee> = {
  id: 'active-only',
  name: 'Active Employees',
  visibleColumns: ['name', 'email', 'department', 'salary', 'joinDate'],
  groupBy: [],
  sortConfig: [{ key: 'name', direction: 'ascending' }],
  filterConfig: [
    {
      key: 'isActive',
      value: 'true',
      operator: 'equals'
    }
  ]
};

const engineeringView: ViewConfiguration<Employee> = {
  id: 'engineering-team',
  name: 'Engineering Team',
  visibleColumns: ['name', 'email', 'salary', 'joinDate'],
  groupBy: [],
  sortConfig: [{ key: 'salary', direction: 'descending' }],
  filterConfig: [
    {
      key: 'department',
      value: 'Engineering',
      operator: 'equals'
    }
  ]
};
```

## Styling

### Custom Department Colors

```tsx
const departmentColors = {
  'Engineering': '#3b82f6',    // Blue
  'Marketing': '#8b5cf6',      // Purple
  'Sales': '#22c55e',          // Green
  'Finance': '#f59e0b',        // Amber
  'HR': '#ef4444'              // Red
};

// Custom cell renderer for department
{
  header: 'Department',
  accessor: 'department',
  dataType: 'string',
  cell: (employee) => (
    <span 
      style={{
        backgroundColor: departmentColors[employee.department] || '#6b7280',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500'
      }}
    >
      {employee.department}
    </span>
  )
}
```

### Salary Highlighting

```tsx
{
  header: 'Salary',
  accessor: 'salary',
  dataType: 'currency',
  currencyOptions: { locale: 'en-US', currency: 'USD' },
  cell: (employee) => {
    const salary = employee.salary;
    const isHighSalary = salary >= 100000;
    
    return (
      <span 
        style={{
          color: isHighSalary ? 'var(--table-color-success)' : 'inherit',
          fontWeight: isHighSalary ? 'semibold' : 'normal'
        }}
      >
        ${salary.toLocaleString()}
      </span>
    );
  }
}
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicTableExample } from './BasicTableExample';

describe('BasicTableExample', () => {
  it('renders employee data correctly', () => {
    render(<BasicTableExample />);
    
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice.johnson@company.com')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
  
  it('sorts by name when header clicked', () => {
    render(<BasicTableExample />);
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    // Verify sorting indicator appears
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  });
  
  it('filters by department', async () => {
    render(<BasicTableExample />);
    
    // Open department filter
    const departmentFilter = screen.getByLabelText(/filter department/i);
    fireEvent.click(departmentFilter);
    
    // Enter filter value
    const filterInput = screen.getByPlaceholderText(/filter by department/i);
    fireEvent.change(filterInput, { target: { value: 'Engineering' } });
    
    // Verify only engineering employees shown
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('David Brown')).toBeInTheDocument();
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
  });
});
```

## Common Variations

### Read-Only Table

```tsx
const readOnlyColumns = columns.map(col => ({
  ...col,
  editable: false  // Disable all editing
}));
```

### Compact Layout

```tsx
const compactTheme = {
  spacing: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  typography: {
    fontSize: {
      sm: '0.75rem',
      md: '0.875rem'
    }
  }
};
```

### Mobile-Optimized

```tsx
const mobileColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Dept', accessor: 'department' },  // Shortened header
  { header: 'Status', accessor: 'isActive', cellType: 'toggle' }
];
```

## Next Steps

- [Editable Table](./editable-table.md) - Add CRUD operations
- [Process Plans](./process-plans.md) - Dynamic rendering showcase
- [Advanced Performance](../advanced/performance.md) - Optimize for large datasets
- [Theming Guide](../configuration/theming.md) - Custom styling options