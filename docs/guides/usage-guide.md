# Complete Usage Guide

This comprehensive guide demonstrates how to use the Advanced Reusable Table component with practical examples for common scenarios.

## Table of Contents

- [Basic Setup](#basic-setup)
- [Data Types Examples](#data-types-examples)
- [Collection Data Types](#collection-data-types)
- [Dynamic Cell Rendering](#dynamic-cell-rendering)
- [Filtering & Sorting](#filtering--sorting)
- [Inline Editing](#inline-editing)
- [Row Selection](#row-selection)
- [Grouping & Views](#grouping--views)
- [Theming & Customization](#theming--customization)
- [Performance Optimization](#performance-optimization)
- [Real-World Applications](#real-world-applications)

---

## Basic Setup

### Installation

```bash
npm install @shaun1705/advanced-reusable-table
```

### Essential Imports

```tsx
import React from 'react';
import { ReusableTable, ThemeProvider } from '@shaun1705/advanced-reusable-table';
import type { Column, ViewConfiguration } from '@shaun1705/advanced-reusable-table';
import '@shaun1705/advanced-reusable-table/dist/style.css';
```

### Minimal Example

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

const columns: Column<User>[] = [
  { header: 'Name', accessor: 'name', sortable: true, filterable: true },
  { header: 'Email', accessor: 'email', filterable: true }
];

const viewConfig: ViewConfiguration<User> = {
  id: 'default',
  name: 'All Users',
  visibleColumns: ['name', 'email'],
  groupBy: [],
  sortConfig: [],
  filterConfig: []
};

function BasicTable() {
  return (
    <ThemeProvider>
      <ReusableTable
        allColumns={columns}
        data={users}
        viewConfig={viewConfig}
      />
    </ThemeProvider>
  );
}
```

---

## Data Types Examples

### String Columns

```tsx
interface Product {
  name: string;
  description: string;
  category: string;
}

const stringColumns: Column<Product>[] = [
  {
    header: 'Product Name',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    editable: true
  },
  {
    header: 'Description',
    accessor: 'description',
    dataType: 'string',
    filterable: true,
    align: 'left'
  },
  {
    header: 'Category',
    accessor: 'category',
    dataType: 'string',
    filterable: true,
    groupable: true
  }
];
```

**Available string filters:**
- Contains, Does Not Contain, Equals, Starts With, Ends With, Is Empty

### Number Columns

```tsx
interface Analytics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

const numberColumns: Column<Analytics>[] = [
  {
    header: 'Page Views',
    accessor: 'views',
    dataType: 'number',
    sortable: true,
    filterable: true,
    align: 'right'
  },
  {
    header: 'Click Rate',
    accessor: 'clicks',
    dataType: 'number',
    sortable: true,
    filterable: true,
    align: 'right',
    cell: (item) => `${(item.clicks / item.views * 100).toFixed(2)}%`
  }
];
```

**Number filter operators:**
- `=`, `!=`, `>`, `<`, `>=`, `<=`, `between`, `isEmpty`
- Range input: `20><50`, `>100`, `<=50`

### Currency Columns

```tsx
interface Financial {
  amount: number;
  budget: number;
  spent: number;
}

const currencyColumns: Column<Financial>[] = [
  {
    header: 'Budget',
    accessor: 'budget',
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
    header: 'Revenue (EUR)',
    accessor: 'amount',
    dataType: 'currency',
    currencyOptions: {
      locale: 'de-DE',
      currency: 'EUR'
    },
    sortable: true,
    align: 'right'
  }
];
```

### Date & DateTime Columns

```tsx
interface Event {
  name: string;
  eventDate: string;        // '2023-12-25'
  createdAt: string;        // '2023-12-25T10:30:00Z'
  lastModified: string;
}

const dateColumns: Column<Event>[] = [
  {
    header: 'Event Date',
    accessor: 'eventDate',
    dataType: 'date',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'medium'
    },
    sortable: true,
    filterable: true
  },
  {
    header: 'Created',
    accessor: 'createdAt',
    dataType: 'datetime',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'short',
      timeStyle: 'short'
    },
    sortable: true,
    filterable: true
  },
  {
    header: 'Last Modified',
    accessor: 'lastModified',
    dataType: 'datetime',
    dateOptions: {
      locale: 'sv-SE',
      dateStyle: 'medium',
      timeStyle: 'medium'
    },
    sortable: true
  }
];
```

**Date filter operators:**
- Is, Is Not, Is Before, Is After, Date Range, Is Empty

---

## Collection Data Types

### Checkbox Collections

For multiple selections with traditional checkboxes or modern chips.

```tsx
interface UserPermissions {
  userId: string;
  name: string;
  permissions: string[];
}

const checkboxColumn: Column<UserPermissions> = {
  header: 'Permissions',
  accessor: 'permissions',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkbox',
    inputMode: 'traditional',        // or 'chips'
    viewDisplayMode: 'inline',       // or 'dropdown' or 'auto'
    options: [
      { value: 'read', label: 'Read Access', description: 'View data and reports' },
      { value: 'write', label: 'Write Access', description: 'Create and modify data' },
      { value: 'delete', label: 'Delete Access', description: 'Remove data permanently' },
      { value: 'admin', label: 'Admin Access', description: 'Full system control' }
    ],
    searchable: true,
    maxSelections: 4,
    minSelections: 1,
    selectAllOption: true
  }
};
```

### Radio Collections

For single selection with visual indicators.

```tsx
interface TaskStatus {
  taskId: string;
  title: string;
  status: string;
}

const radioColumn: Column<TaskStatus> = {
  header: 'Status',
  accessor: 'status',
  dataType: 'collection',
  collectionConfig: {
    type: 'radio',
    inputMode: 'chips',
    viewDisplayMode: 'inline',
    options: [
      { value: 'todo', label: 'To Do', color: '#6b7280' },
      { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
      { value: 'review', label: 'Under Review', color: '#8b5cf6' },
      { value: 'completed', label: 'Completed', color: '#22c55e' }
    ],
    required: true,
    clearable: false
  }
};
```

### Chip Collections

Modern chip-based interface for skills, technologies, or tags.

```tsx
interface Developer {
  name: string;
  skills: string[];
  technologies: string[];
}

const skillsColumn: Column<Developer> = {
  header: 'Skills',
  accessor: 'skills',
  dataType: 'collection',
  collectionConfig: {
    type: 'chip',
    chipVariant: 'filled',
    removable: true,
    viewDisplayMode: 'auto',
    inlineThreshold: 4,
    maxVisibleInline: 6,
    options: [
      { value: 'react', label: 'React', color: '#61dafb' },
      { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
      { value: 'angular', label: 'Angular', color: '#dd1b16' },
      { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
      { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
      { value: 'nodejs', label: 'Node.js', color: '#339933' },
      { value: 'python', label: 'Python', color: '#3776ab' },
      { value: 'golang', label: 'Go', color: '#00add8' }
    ],
    searchable: true,
    maxSelections: 8,
    placeholder: 'Search and select skills...'
  }
};
```

### Tag Collections

User-created tags with validation.

```tsx
interface Article {
  title: string;
  tags: string[];
  customLabels: string[];
}

const tagsColumn: Column<Article> = {
  header: 'Tags',
  accessor: 'tags',
  dataType: 'collection',
  collectionConfig: {
    type: 'tag',
    allowCustomValues: true,
    viewDisplayMode: 'auto',
    options: [
      { value: 'urgent', label: 'Urgent', color: '#ef4444' },
      { value: 'important', label: 'Important', color: '#f59e0b' },
      { value: 'feature', label: 'Feature', color: '#8b5cf6' },
      { value: 'bug', label: 'Bug', color: '#ef4444' },
      { value: 'enhancement', label: 'Enhancement', color: '#22c55e' }
    ],
    maxTags: 5,
    minLength: 2,
    maxLength: 15,
    duplicateAllowed: false,
    caseSensitive: false,
    separator: ',',
    placeholder: 'Add custom tags...'
  }
};
```

### Dynamic Collection Options

Generate options based on context or external data.

```tsx
// Dynamic options based on user role
const getDepartmentOptions = (userRole: string): CollectionOption[] => {
  const allDepartments = [
    { value: 'engineering', label: 'Engineering', color: '#3b82f6' },
    { value: 'design', label: 'Design', color: '#8b5cf6' },
    { value: 'marketing', label: 'Marketing', color: '#f59e0b' },
    { value: 'sales', label: 'Sales', color: '#22c55e' },
    { value: 'hr', label: 'Human Resources', color: '#ef4444' }
  ];
  
  if (userRole === 'admin') {
    return allDepartments;
  }
  
  // Regular users can only access their own department
  return allDepartments.filter(dept => 
    getCurrentUserDepartments().includes(dept.value)
  );
};

const dynamicColumn: Column<User> = {
  header: 'Accessible Departments',
  accessor: 'departments',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkbox',
    options: () => getDepartmentOptions(getCurrentUserRole()),
    searchable: true,
    inputMode: 'chips'
  }
};
```

---

## Dynamic Cell Rendering

Use `renderCell` for columns that need different content types based on data.

### Mixed Content Example

```tsx
interface ProcessStep {
  stepId: string;
  name: string;
  comments: string | string[]; // Either text comment or array of checkboxes
  status: string;
}

const dynamicColumn: Column<ProcessStep> = {
  header: 'Comments',
  accessor: 'comments',
  renderCell: (context) => {
    const { value, row, isEditing } = context;
    
    // Array of process steps - show as checkboxes
    if (Array.isArray(value) && value.length > 0) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          inputMode: 'traditional',
          viewDisplayMode: 'inline',
          options: value.map(step => ({ 
            value: step, 
            label: step,
            description: `Process step: ${step}`
          }))
        },
        editable: !row.isLocked
      };
    }
    
    // Text comment - show as editable text
    if (typeof value === 'string' && value.trim()) {
      return { 
        type: 'text', 
        content: `💬 ${value}`,
        editable: !row.isLocked
      };
    }
    
    // Empty state - show placeholder
    return { 
      type: 'text', 
      content: '— No comments —',
      editable: !row.isLocked
    };
  }
};
```

### Conditional Rendering Based on Status

```tsx
interface Order {
  orderId: string;
  status: 'pending' | 'shipped' | 'delivered';
  trackingNumber?: string;
  actions: string[];
}

const actionsColumn: Column<Order> = {
  header: 'Available Actions',
  accessor: 'actions',
  renderCell: (context) => {
    const { row } = context;
    
    // Different actions based on order status
    switch (row.status) {
      case 'pending':
        return {
          type: 'collection',
          collectionConfig: {
            type: 'checkbox',
            inputMode: 'chips',
            options: [
              { value: 'cancel', label: 'Cancel Order', color: '#ef4444' },
              { value: 'modify', label: 'Modify Order', color: '#f59e0b' },
              { value: 'ship', label: 'Ship Now', color: '#22c55e' }
            ]
          },
          editable: true
        };
        
      case 'shipped':
        return {
          type: 'collection',
          collectionConfig: {
            type: 'radio',
            inputMode: 'chips',
            options: [
              { value: 'track', label: 'Track Package', color: '#3b82f6' },
              { value: 'return', label: 'Initiate Return', color: '#f59e0b' }
            ]
          },
          editable: true
        };
        
      case 'delivered':
        return {
          type: 'text',
          content: '✅ Order Complete',
          editable: false
        };
        
      default:
        return { type: 'text', content: '—', editable: false };
    }
  }
};
```

### Performance Optimization for Dynamic Rendering

```tsx
import { createMixedContentRenderer, memoizeCellDecision } from '@shaun1705/advanced-reusable-table';

// Create reusable renderer with rules
const mixedRenderer = createMixedContentRenderer<ProcessStep>([
  {
    condition: (context) => Array.isArray(context.value) && context.value.length > 0,
    render: (context) => ({
      type: 'collection',
      collectionConfig: {
        type: 'checkbox',
        options: (context.value as string[]).map(step => ({ value: step, label: step }))
      }
    })
  },
  {
    condition: (context) => typeof context.value === 'string' && context.value.trim(),
    render: (context) => ({ type: 'text', content: `💬 ${context.value}` })
  }
]);

// Memoize for performance
const memoizedRenderer = memoizeCellDecision(mixedRenderer);

const optimizedColumn: Column<ProcessStep> = {
  header: 'Comments',
  accessor: 'comments',
  renderCell: memoizedRenderer
};
```

---

## Filtering & Sorting

### Advanced Filtering Examples

```tsx
function FilteringExample() {
  const [viewConfig, setViewConfig] = useState<ViewConfiguration<User>>({
    id: 'filtered-view',
    name: 'Filtered Users',
    visibleColumns: ['name', 'email', 'role', 'joinDate', 'skills'],
    groupBy: [],
    sortConfig: [],
    filterConfig: [
      {
        key: 'role',
        operator: 'contains',
        value: 'admin'
      },
      {
        key: 'joinDate',
        operator: 'isAfter',
        value: '2023-01-01'
      },
      {
        key: 'skills',
        operator: 'containsAny',
        value: 'react,typescript'  // Comma-separated for multiple values
      }
    ]
  });

  return (
    <ReusableTable
      allColumns={columns}
      data={userData}
      viewConfig={viewConfig}
    />
  );
}
```

### Multi-Column Sorting

```tsx
const sortedViewConfig: ViewConfiguration<User> = {
  id: 'sorted-view',
  name: 'Sorted Users',
  visibleColumns: ['name', 'department', 'joinDate'],
  groupBy: [],
  sortConfig: [
    { key: 'department', direction: 'ascending' },   // Primary sort
    { key: 'joinDate', direction: 'descending' },    // Secondary sort
    { key: 'name', direction: 'ascending' }          // Tertiary sort
  ],
  filterConfig: []
};
```

### Programmatic Filter Management

```tsx
function FilterControls() {
  const [filters, setFilters] = useState<FilterConfig<User>[]>([]);
  
  const addFilter = (key: keyof User, operator: FilterOperator, value: string) => {
    setFilters(prev => [
      ...prev.filter(f => f.key !== key), // Remove existing filter for this column
      { key, operator, value }
    ]);
  };
  
  const removeFilter = (key: keyof User) => {
    setFilters(prev => prev.filter(f => f.key !== key));
  };
  
  const clearAllFilters = () => {
    setFilters([]);
  };
  
  return (
    <div>
      <button onClick={() => addFilter('role', 'equals', 'admin')}>
        Show Admins Only
      </button>
      <button onClick={() => addFilter('joinDate', 'isAfter', '2023-01-01')}>
        Show Recent Hires
      </button>
      <button onClick={clearAllFilters}>
        Clear All Filters
      </button>
      
      <ReusableTable
        allColumns={columns}
        data={userData}
        viewConfig={{
          ...baseViewConfig,
          filterConfig: filters
        }}
      />
    </div>
  );
}
```

---

## Inline Editing

### Basic Inline Editing

```tsx
function EditableTable() {
  const [data, setData] = useState(initialUserData);
  
  const handleUpdate = (rowIndex: number, columnId: keyof User, value: any) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value
      };
      return newData;
    });
    
    // Optional: Save to server
    saveToServer(newData[rowIndex]);
  };
  
  const editableColumns: Column<User>[] = [
    {
      header: 'Name',
      accessor: 'name',
      dataType: 'string',
      editable: true,
      sortable: true,
      filterable: true
    },
    {
      header: 'Email',
      accessor: 'email',
      dataType: 'string',
      editable: true,
      filterable: true
    },
    {
      header: 'Active',
      accessor: 'isActive',
      cellType: 'toggle',
      editable: true,
      align: 'center'
    },
    {
      header: 'Salary',
      accessor: 'salary',
      dataType: 'currency',
      currencyOptions: { locale: 'en-US', currency: 'USD' },
      editable: true,
      align: 'right'
    }
  ];
  
  return (
    <ReusableTable
      allColumns={editableColumns}
      data={data}
      viewConfig={viewConfig}
      onUpdateData={handleUpdate}
    />
  );
}
```

### Conditional Editing with Validation

```tsx
interface EditableUser extends User {
  isLocked: boolean;
  canEditSalary: boolean;
}

const conditionalColumns: Column<EditableUser>[] = [
  {
    header: 'Name',
    accessor: 'name',
    dataType: 'string',
    renderCell: (context) => ({
      type: 'text',
      content: context.value,
      editable: !context.row.isLocked
    })
  },
  {
    header: 'Salary',
    accessor: 'salary',
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
    renderCell: (context) => ({
      type: 'currency',
      props: { currencyOptions: { locale: 'en-US', currency: 'USD' } },
      editable: !context.row.isLocked && context.row.canEditSalary
    })
  }
];

function ValidatedEditTable() {
  const [data, setData] = useState<EditableUser[]>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleUpdate = (rowIndex: number, columnId: keyof EditableUser, value: any) => {
    // Validation
    const user = data[rowIndex];
    const validationErrors: Record<string, string> = {};
    
    if (columnId === 'salary' && typeof value === 'number') {
      if (value < 0) {
        validationErrors[`${rowIndex}-${String(columnId)}`] = 'Salary cannot be negative';
        setErrors(prev => ({ ...prev, ...validationErrors }));
        return;
      }
      if (value > 1000000) {
        validationErrors[`${rowIndex}-${String(columnId)}`] = 'Salary cannot exceed $1,000,000';
        setErrors(prev => ({ ...prev, ...validationErrors }));
        return;
      }
    }
    
    // Clear errors for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${rowIndex}-${String(columnId)}`];
      return newErrors;
    });
    
    // Update data
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  };
  
  return (
    <div>
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <h4>Validation Errors:</h4>
          <ul>
            {Object.entries(errors).map(([key, error]) => (
              <li key={key} className="text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <ReusableTable
        allColumns={conditionalColumns}
        data={data}
        viewConfig={viewConfig}
        onUpdateData={handleUpdate}
      />
    </div>
  );
}
```

---

## Row Selection

### Basic Row Selection

```tsx
function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState<Set<User>>(new Set());
  
  const isAllSelected = selectedRows.size === userData.length && userData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < userData.length;
  
  const selectRow = (row: User) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(row)) {
        newSet.delete(row);
      } else {
        newSet.add(row);
      }
      return newSet;
    });
  };
  
  const selectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(userData));
    }
  };
  
  const clearSelection = () => {
    setSelectedRows(new Set());
  };
  
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <span>Selected: {selectedRows.size} of {userData.length}</span>
        <button 
          onClick={clearSelection}
          disabled={selectedRows.size === 0}
          className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Clear Selection
        </button>
        <button 
          onClick={() => {
            // Bulk action example
            const selectedUserIds = Array.from(selectedRows).map(user => user.id);
            console.log('Performing bulk action on:', selectedUserIds);
          }}
          disabled={selectedRows.size === 0}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Bulk Action
        </button>
      </div>
      
      <ReusableTable
        allColumns={columns}
        data={userData}
        viewConfig={viewConfig}
        rowSelection={{
          selectedRows,
          isAllSelected,
          isIndeterminate,
          selectRow,
          selectAll,
          clearSelection
        }}
      />
    </div>
  );
}
```

### Using the Selection Hook

```tsx
import { useTableSelection } from '@shaun1705/advanced-reusable-table';

function HookedSelectionTable() {
  const selection = useTableSelection({
    data: userData,
    mode: 'multiple',
    initialSelection: new Set()
  });
  
  const handleBulkDelete = () => {
    const selectedIds = Array.from(selection.selectedRows).map(user => user.id);
    // Perform bulk delete
    console.log('Deleting users:', selectedIds);
  };
  
  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={handleBulkDelete}
          disabled={selection.selectedRows.size === 0}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected ({selection.selectedRows.size})
        </button>
      </div>
      
      <ReusableTable
        allColumns={columns}
        data={userData}
        viewConfig={viewConfig}
        rowSelection={selection}
      />
    </div>
  );
}
```

---

## Grouping & Views

### Multi-Level Grouping

```tsx
const groupedViewConfig: ViewConfiguration<Employee> = {
  id: 'grouped-view',
  name: 'Employees by Department & Role',
  visibleColumns: ['name', 'email', 'salary', 'joinDate'],
  groupBy: ['department', 'role'], // Multi-level grouping
  sortConfig: [
    { key: 'department', direction: 'ascending' },
    { key: 'role', direction: 'ascending' },
    { key: 'name', direction: 'ascending' }
  ],
  filterConfig: []
};

function GroupedTable() {
  return (
    <ReusableTable
      allColumns={employeeColumns}
      data={employeeData}
      viewConfig={groupedViewConfig}
    />
  );
}
```

### View Management

```tsx
function MultiViewTable() {
  const [currentView, setCurrentView] = useState<ViewConfiguration<User>>(defaultView);
  
  const views: ViewConfiguration<User>[] = [
    {
      id: 'all-users',
      name: 'All Users',
      visibleColumns: ['name', 'email', 'role', 'joinDate'],
      groupBy: [],
      sortConfig: [{ key: 'name', direction: 'ascending' }],
      filterConfig: []
    },
    {
      id: 'admins-only',
      name: 'Administrators',
      visibleColumns: ['name', 'email', 'permissions', 'lastLogin'],
      groupBy: [],
      sortConfig: [{ key: 'lastLogin', direction: 'descending' }],
      filterConfig: [
        { key: 'role', operator: 'equals', value: 'admin' }
      ]
    },
    {
      id: 'by-department',
      name: 'By Department',
      visibleColumns: ['name', 'email', 'role', 'joinDate'],
      groupBy: ['department'],
      sortConfig: [
        { key: 'department', direction: 'ascending' },
        { key: 'name', direction: 'ascending' }
      ],
      filterConfig: []
    }
  ];
  
  return (
    <div>
      <div className="mb-4">
        <label className="mr-2">View:</label>
        <select 
          value={currentView.id}
          onChange={(e) => {
            const view = views.find(v => v.id === e.target.value);
            if (view) setCurrentView(view);
          }}
          className="px-3 py-1 border rounded"
        >
          {views.map(view => (
            <option key={view.id} value={view.id}>
              {view.name}
            </option>
          ))}
        </select>
      </div>
      
      <ReusableTable
        allColumns={columns}
        data={userData}
        viewConfig={currentView}
      />
    </div>
  );
}
```

---

## Theming & Customization

### Custom Theme

```tsx
import { TableTheme } from '@shaun1705/advanced-reusable-table';

const darkTheme: TableTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: '#334155',
    accent: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: '0.5rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};

function ThemedTable() {
  return (
    <ThemeProvider theme={darkTheme}>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

### CSS Custom Properties Override

```css
/* Custom theme using CSS variables */
.my-table-theme {
  --table-color-primary: #059669;
  --table-color-secondary: #0d9488;
  --table-color-background: #f0fdfa;
  --table-color-surface: #ffffff;
  --table-color-text: #134e4a;
  --table-color-textMuted: #6b7280;
  --table-color-border: #d1fae5;
  --table-border-radius: 0.75rem;
}
```

```tsx
function CustomStyledTable() {
  return (
    <div className="my-table-theme">
      <ThemeProvider>
        <ReusableTable {...props} />
      </ThemeProvider>
    </div>
  );
}
```

---

## Performance Optimization

### Large Dataset Handling

```tsx
import { useMemo } from 'react';

function LargeDataTable() {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return largeDataset.map(item => ({
      ...item,
      calculatedField: expensiveCalculation(item)
    }));
  }, [largeDataset]);
  
  // Memoize column definitions
  const memoizedColumns = useMemo(() => [
    {
      header: 'Name',
      accessor: 'name' as const,
      sortable: true,
      filterable: true
    },
    {
      header: 'Complex Data',
      accessor: 'complexData' as const,
      cell: React.memo(({ item }) => (
        <ExpensiveComponent data={item.complexData} />
      ))
    }
  ], []);
  
  return (
    <ReusableTable
      allColumns={memoizedColumns}
      data={processedData}
      viewConfig={viewConfig}
    />
  );
}
```

### Server-Side Operations

```tsx
function ServerSideTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewConfig, setViewConfig] = useState<ViewConfiguration<User>>(defaultView);
  
  // Fetch data when view config changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: 1,
          pageSize: 50,
          sortBy: viewConfig.sortConfig.map(s => `${String(s.key)}:${s.direction}`),
          filters: viewConfig.filterConfig.map(f => `${String(f.key)}:${f.operator}:${f.value}`)
        };
        
        const response = await fetch('/api/users?' + new URLSearchParams(params));
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [viewConfig]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <ReusableTable
      allColumns={columns}
      data={data}
      viewConfig={viewConfig}
    />
  );
}
```

---

## Real-World Applications

### User Management System

```tsx
interface SystemUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  department: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  profileImage?: string;
}

const userManagementColumns: Column<SystemUser>[] = [
  {
    header: 'User',
    accessor: 'fullName',
    dataType: 'string',
    sortable: true,
    filterable: true,
    cell: (user) => (
      <div className="flex items-center space-x-3">
        <img 
          src={user.profileImage || '/default-avatar.png'}
          alt={user.fullName}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div className="font-medium">{user.fullName}</div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
      </div>
    )
  },
  {
    header: 'Contact',
    accessor: 'email',
    dataType: 'string',
    filterable: true,
    editable: true
  },
  {
    header: 'Department',
    accessor: 'department',
    dataType: 'string',
    filterable: true,
    groupable: true,
    editable: true
  },
  {
    header: 'Role',
    accessor: 'role',
    dataType: 'string',
    filterable: true,
    editable: true,
    cell: (user) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        user.role === 'admin' ? 'bg-red-100 text-red-800' :
        user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {user.role}
      </span>
    )
  },
  {
    header: 'Permissions',
    accessor: 'permissions',
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'traditional',
      viewDisplayMode: 'auto',
      options: [
        { value: 'users.read', label: 'View Users', description: 'Can view user profiles' },
        { value: 'users.write', label: 'Edit Users', description: 'Can modify user data' },
        { value: 'users.delete', label: 'Delete Users', description: 'Can remove users' },
        { value: 'reports.read', label: 'View Reports', description: 'Can access reports' },
        { value: 'settings.write', label: 'System Settings', description: 'Can modify system settings' }
      ],
      searchable: true,
      maxSelections: 10,
      selectAllOption: true
    }
  },
  {
    header: 'Status',
    accessor: 'isActive',
    cellType: 'toggle',
    editable: true,
    align: 'center'
  },
  {
    header: 'Last Login',
    accessor: 'lastLogin',
    dataType: 'datetime',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'short',
      timeStyle: 'short'
    },
    sortable: true,
    filterable: true
  }
];
```

### E-commerce Product Catalog

```tsx
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  imageUrl: string;
  createdAt: string;
}

const productColumns: Column<Product>[] = [
  {
    header: 'Product',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    cell: (product) => (
      <div className="flex items-center space-x-3">
        <img 
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {product.description}
          </div>
        </div>
      </div>
    )
  },
  {
    header: 'Price',
    accessor: 'price',
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
    sortable: true,
    filterable: true,
    editable: true,
    align: 'right'
  },
  {
    header: 'Category',
    accessor: 'category',
    dataType: 'string',
    filterable: true,
    groupable: true,
    editable: true
  },
  {
    header: 'Tags',
    accessor: 'tags',
    dataType: 'collection',
    collectionConfig: {
      type: 'tag',
      allowCustomValues: true,
      viewDisplayMode: 'auto',
      options: [
        { value: 'featured', label: 'Featured', color: '#f59e0b' },
        { value: 'sale', label: 'On Sale', color: '#ef4444' },
        { value: 'new', label: 'New Arrival', color: '#22c55e' },
        { value: 'bestseller', label: 'Best Seller', color: '#8b5cf6' }
      ],
      maxTags: 8,
      placeholder: 'Add product tags...'
    }
  },
  {
    header: 'Stock',
    accessor: 'stockQuantity',
    dataType: 'number',
    sortable: true,
    filterable: true,
    editable: true,
    align: 'right',
    cell: (product) => (
      <div className="text-right">
        <div className={`font-medium ${
          product.stockQuantity > 50 ? 'text-green-600' :
          product.stockQuantity > 10 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {product.stockQuantity}
        </div>
        <div className="text-xs text-gray-500">
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>
    )
  },
  {
    header: 'Rating',
    accessor: 'rating',
    dataType: 'number',
    sortable: true,
    align: 'center',
    cell: (product) => (
      <div className="flex items-center justify-center">
        <span className="text-yellow-400">★</span>
        <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
      </div>
    )
  }
];
```

This comprehensive usage guide covers the most common scenarios and advanced features of the Advanced Reusable Table component. For complete API documentation, see the [Complete API Reference](../api/complete-api-reference.md).