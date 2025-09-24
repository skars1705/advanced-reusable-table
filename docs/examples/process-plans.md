# ProcessPlans: Mixed Content Showcase

Real-world example demonstrating dynamic rendering, collections, and conditional editing in a process management application.

## Overview

This example showcases the Advanced Reusable Table's most sophisticated features:

- **Dynamic Cell Rendering** - Same column displays different content types based on data
- **Mixed Content Types** - Text comments and step checklists in one column
- **Conditional Editability** - Editing permissions based on workflow state
- **Enterprise Collections** - Traditional checkbox interface for familiar UX
- **Swedish Localization** - Date formatting with locale support
- **Status Management** - Color-coded radio chips for visual status tracking

## Demo Features

### 📋 **Comments Column with Dynamic Rendering**
- **Array Data** → Traditional checkboxes for process steps
- **String Data** → Text display with emoji prefix
- **Empty Data** → Styled placeholder message

### 🏷️ **Status Management**
- **Radio Chips** - Visual status indicators with colors
- **Workflow States** - Draft, Active, Completed with appropriate colors
- **Single Selection** - Enforced business rules

### 📅 **Localized Date Display**
- **Swedish Formatting** - "3 jan. 2024" format
- **Sortable Dates** - Proper date parsing and sorting
- **Custom DatePicker** - When editing date fields

### ✏️ **Conditional Editing**
- **Status-Based** - No editing when process is completed
- **User Permissions** - Respects user access levels
- **Workflow Rules** - Enforces business logic

## Implementation

### Data Structure

```typescript
interface ProcessPlan {
  id: string;
  processName: string;
  comments: string | string[] | null;  // Mixed content types
  status: 'draft' | 'active' | 'completed';
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastModified: string;
  assignee: string;
}
```

### Sample Data

```typescript
const processPlansData: ProcessPlan[] = [
  {
    id: '1',
    processName: 'Quality Control Review',
    comments: [
      'Initial quality assessment',
      'Documentation review',
      'Final approval sign-off'
    ],
    status: 'active',
    department: 'Quality Assurance',
    priority: 'high',
    createdDate: '2024-01-15',
    lastModified: '2024-01-20',
    assignee: 'Anna Svensson'
  },
  {
    id: '2',
    processName: 'Software Deployment',
    comments: 'Deployment scheduled for next maintenance window. All systems checked.',
    status: 'draft',
    department: 'IT Operations',
    priority: 'medium',
    createdDate: '2024-01-10',
    lastModified: '2024-01-18',
    assignee: 'Erik Johansson'
  },
  {
    id: '3',
    processName: 'Budget Approval',
    comments: null,
    status: 'completed',
    department: 'Finance',
    priority: 'urgent',
    createdDate: '2023-12-20',
    lastModified: '2024-01-05',
    assignee: 'Lisa Chen'
  }
];
```

### Column Configuration

```typescript
import type { Column } from 'advanced-reusable-table';

const processPlansColumns: Column<ProcessPlan>[] = [
  {
    header: 'Process Name',
    accessor: 'processName',
    sortable: true,
    filterable: true,
    dataType: 'string',
    editable: true
  },
  
  // 🌟 DYNAMIC RENDERING SHOWCASE
  {
    header: 'Comments',
    accessor: 'comments',
    renderCell: (context) => {
      const { value, row, isEditing } = context;
      
      // Array of process steps -> Traditional checkboxes (Enterprise UX)
      if (Array.isArray(value) && value.length > 0) {
        return {
          type: 'collection',
          collectionConfig: {
            type: 'checkbox',
            inputMode: 'traditional',        // Enterprise-friendly interface
            viewDisplayMode: 'inline',
            options: value.map(step => ({
              value: step,
              label: step,
              disabled: row.status === 'completed' // Read-only when completed
            })),
            placeholder: 'Select completed steps...',
            allowEmpty: true
          },
          editable: row.status !== 'completed' // Conditional editability
        };
      }
      
      // String comment -> Text with emoji
      if (typeof value === 'string' && value.trim()) {
        return {
          type: 'text',
          content: `💬 ${value}`
        };
      }
      
      // Empty state -> Styled placeholder
      return {
        type: 'text',
        content: (
          <em style={{ 
            color: 'var(--table-color-textMuted, #6b7280)',
            fontStyle: 'italic' 
          }}>
            No comments
          </em>
        )
      };
    }
  },
  
  // 🎨 STATUS WITH COLORED RADIO CHIPS
  {
    header: 'Status',
    accessor: 'status',
    dataType: 'collection',
    collectionConfig: {
      type: 'radio',
      inputMode: 'chips',                 // Modern chip-based radio buttons
      viewDisplayMode: 'inline',
      options: [
        { 
          value: 'draft', 
          label: 'Draft', 
          color: '#6b7280',              // Gray for draft
          description: 'Process is being planned'
        },
        { 
          value: 'active', 
          label: 'Active', 
          color: '#059669',              // Green for active
          description: 'Process is currently running'
        },
        { 
          value: 'completed', 
          label: 'Completed', 
          color: '#7c3aed',              // Purple for completed
          description: 'Process has been finished'
        }
      ],
      required: true,
      clearable: false
    },
    sortable: true,
    filterable: true,
    editable: true
  },
  
  {
    header: 'Department',
    accessor: 'department',
    dataType: 'string',
    sortable: true,
    filterable: true,
    groupable: true,
    editable: true
  },
  
  // 🚨 PRIORITY WITH VISUAL HIERARCHY
  {
    header: 'Priority',
    accessor: 'priority',
    dataType: 'collection',
    collectionConfig: {
      type: 'radio',
      inputMode: 'chips',
      viewDisplayMode: 'inline',
      options: [
        { value: 'low', label: 'Low', color: '#22c55e' },        // Green
        { value: 'medium', label: 'Medium', color: '#f59e0b' },  // Amber
        { value: 'high', label: 'High', color: '#ef4444' },      // Red
        { value: 'urgent', label: 'URGENT', color: '#dc2626' }   // Dark red
      ]
    },
    sortable: true,
    filterable: true
  },
  
  // 📅 SWEDISH DATE FORMATTING
  {
    header: 'Created',
    accessor: 'createdDate',
    dataType: 'date',
    dateOptions: {
      locale: 'sv-SE',                   // Swedish locale
      dateStyle: 'medium'                // "3 jan. 2024" format
    },
    sortable: true,
    filterable: true
  },
  
  {
    header: 'Last Modified',
    accessor: 'lastModified',
    dataType: 'date',
    dateOptions: {
      locale: 'sv-SE',
      dateStyle: 'short'                 // "2024-01-20" format
    },
    sortable: true,
    filterable: true
  },
  
  {
    header: 'Assignee',
    accessor: 'assignee',
    dataType: 'string',
    sortable: true,
    filterable: true,
    editable: true
  }
];
```

### Complete Component

```tsx
import React, { useState } from 'react';
import { 
  ReusableTable, 
  ThemeProvider, 
  type ViewConfiguration,
  type Column
} from 'advanced-reusable-table';
import 'advanced-reusable-table/dist/style.css';

interface ProcessPlan {
  id: string;
  processName: string;
  comments: string | string[] | null;
  status: 'draft' | 'active' | 'completed';
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastModified: string;
  assignee: string;
}

const ProcessPlansDemo: React.FC = () => {
  const [data, setData] = useState<ProcessPlan[]>(processPlansData);
  
  // Default view configuration
  const defaultView: ViewConfiguration<ProcessPlan> = {
    id: 'process-overview',
    name: 'Process Overview',
    visibleColumns: [
      'processName', 
      'comments', 
      'status', 
      'department', 
      'priority', 
      'createdDate', 
      'assignee'
    ],
    groupBy: [],
    sortConfig: [
      { key: 'priority', direction: 'descending' },  // Urgent first
      { key: 'createdDate', direction: 'descending' } // Newest first
    ],
    filterConfig: []
  };
  
  // Handle data updates from inline editing
  const handleUpdateData = (rowIndex: number, columnId: keyof ProcessPlan, value: any) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value,
        lastModified: new Date().toISOString().split('T')[0] // Update timestamp
      };
      return newData;
    });
  };
  
  return (
    <ThemeProvider>
      <div style={{ 
        padding: '24px', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: 'var(--table-color-text, #1f2937)'
          }}>
            Process Plans Management
          </h1>
          <p style={{ 
            color: 'var(--table-color-textMuted, #6b7280)',
            fontSize: '1.125rem'
          }}>
            Showcasing dynamic rendering, mixed content types, and conditional editing
          </p>
        </div>
        
        <ReusableTable
          allColumns={processPlansColumns}
          data={data}
          viewConfig={defaultView}
          onUpdateData={handleUpdateData}
          rowSelection={{
            enabled: true,
            mode: 'multiple'
          }}
        />
        
        {/* Feature callouts */}
        <div style={{ 
          marginTop: '32px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'var(--table-color-surface, #f8fafc)',
            borderRadius: '8px',
            border: '1px solid var(--table-color-border, #e5e7eb)'
          }}>
            <h3 style={{ fontWeight: 'semibold', marginBottom: '8px' }}>
              🧠 Dynamic Rendering
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--table-color-textMuted, #6b7280)' }}>
              Comments column shows checkboxes for arrays, text for strings, and placeholders for empty data.
            </p>
          </div>
          
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'var(--table-color-surface, #f8fafc)',
            borderRadius: '8px',
            border: '1px solid var(--table-color-border, #e5e7eb)'
          }}>
            <h3 style={{ fontWeight: 'semibold', marginBottom: '8px' }}>
              🏷️ Status Management
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--table-color-textMuted, #6b7280)' }}>
              Color-coded radio chips provide clear visual status hierarchy with workflow enforcement.
            </p>
          </div>
          
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'var(--table-color-surface, #f8fafc)',
            borderRadius: '8px',
            border: '1px solid var(--table-color-border, #e5e7eb)'
          }}>
            <h3 style={{ fontWeight: 'semibold', marginBottom: '8px' }}>
              📅 Swedish Localization
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--table-color-textMuted, #6b7280)' }}>
              Dates formatted in Swedish locale (sv-SE) demonstrating internationalization support.
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProcessPlansDemo;
```

## Key Features Demonstrated

### 1. Dynamic Cell Rendering Logic

```typescript
renderCell: (context) => {
  const { value, row } = context;
  
  // Business logic determines display type
  if (Array.isArray(value)) {
    return { type: 'collection', /* checkbox config */ };
  }
  if (typeof value === 'string') {
    return { type: 'text', content: `💬 ${value}` };
  }
  return { type: 'text', content: 'No comments' };
}
```

### 2. Conditional Editability

```typescript
{
  type: 'collection',
  collectionConfig: { /* ... */ },
  editable: row.status !== 'completed'  // Business rule enforcement
}
```

### 3. Traditional Enterprise UX

```typescript
collectionConfig: {
  type: 'checkbox',
  inputMode: 'traditional',    // Familiar checkbox interface
  viewDisplayMode: 'inline',   // Show selections directly
  // ...
}
```

### 4. Visual Status Hierarchy

```typescript
options: [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'urgent', label: 'URGENT', color: '#dc2626' }
]
```

## User Experience

### Interaction Patterns

1. **View Mode**
   - Process steps display as inline chips
   - Text comments show with emoji prefix
   - Status shows as colored chip
   - Dates formatted in Swedish locale

2. **Edit Mode**
   - Click edit button or press Enter to modify
   - Process steps become traditional checkboxes
   - Status becomes radio chip selection
   - Conditional editing based on status

3. **Business Rules**
   - Completed processes become read-only
   - Status changes update last modified date
   - Priority affects sort order
   - Department enables grouping

### Accessibility Features

- **Keyboard Navigation** - Full tab and arrow key support
- **Screen Reader Support** - Proper ARIA labels and announcements
- **High Contrast** - Maintains contrast ratios in all modes
- **Focus Management** - Clear focus indicators and logical flow

## Advanced Patterns Used

### Mixed Data Type Handling

```typescript
// Handles union types elegantly
comments: string | string[] | null
```

### Locale-Specific Formatting

```typescript
dateOptions: {
  locale: 'sv-SE',           // Swedish formatting
  dateStyle: 'medium'        // "3 jan. 2024"
}
```

### Conditional Business Logic

```typescript
disabled: row.status === 'completed',
editable: row.status !== 'completed'
```

### Real-Time Data Updates

```typescript
const handleUpdateData = (rowIndex, columnId, value) => {
  // Update data with timestamp
  newData[rowIndex] = {
    ...newData[rowIndex],
    [columnId]: value,
    lastModified: new Date().toISOString().split('T')[0]
  };
};
```

## Customization Options

### Theme Integration

```tsx
const processTheme = {
  colors: {
    primary: '#1f3a8a',        // Corporate blue
    accent: '#059669',         // Success green
    warning: '#f59e0b',        // Priority amber
    error: '#dc2626'           // Urgent red
  }
};

<ThemeProvider theme={processTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

### Custom Cell Styling

```css
.process-comments-cell {
  max-width: 300px;
}

.process-comments-cell em {
  color: var(--table-color-textMuted);
  font-style: italic;
}

.priority-urgent {
  font-weight: bold;
  text-transform: uppercase;
}
```

## Performance Considerations

- **Memoized Rendering** - Dynamic render decisions cached appropriately
- **Efficient Updates** - Only modified rows re-render
- **Optimized Collections** - Traditional mode for better performance with many options
- **Localization Caching** - Date formatters memoized per locale

## Real-World Applications

This pattern works well for:

- **Project Management** - Tasks, milestones, and status tracking
- **Quality Control** - Checklists, comments, and approvals  
- **Process Documentation** - Steps, notes, and compliance tracking
- **Workflow Management** - Status transitions and approval chains
- **Content Management** - Mixed content types and editorial workflows

## Next Steps

- [Basic Table](./basic-table.md) - Simple implementation
- [Editable Table](./editable-table.md) - Full CRUD operations
- [Dynamic Rendering](../configuration/dynamic-rendering.md) - Advanced rendering patterns
- [Collection Types](../configuration/collections.md) - Collection configuration options