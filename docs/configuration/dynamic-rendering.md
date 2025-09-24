# Dynamic Cell Rendering

Advanced guide to dynamic cell rendering - same column, different content types based on row data. Perfect for mixed content scenarios and conditional display logic.

## Overview

Dynamic rendering allows a single column to display different content types based on the actual data in each row. This is powerful for:

- **Mixed Content**: Process plans with both text comments and step checklists
- **Conditional Display**: Different UI based on data availability or user permissions
- **Progressive Enhancement**: Start simple, add complexity as needed
- **Type-Safe Flexibility**: Maintain TypeScript safety while handling diverse data

## Basic Concept

Instead of a fixed `dataType`, use `renderCell` to decide what to render for each row:

```typescript
{
  header: 'Comments',
  accessor: 'comments',
  renderCell: (context) => {
    const { value, row, isEditing } = context;
    
    // Array of steps -> Collection
    if (Array.isArray(value)) {
      return {
        type: 'collection',
        collectionConfig: { /* ... */ }
      };
    }
    
    // String comment -> Text
    if (typeof value === 'string') {
      return { type: 'text', content: value };
    }
    
    // No data -> Placeholder
    return { type: 'text', content: 'No comments' };
  }
}
```

## Render Context

The `CellRenderContext` provides all the information needed for smart decisions:

```typescript
interface CellRenderContext<T> {
  value: any;           // The actual cell value
  row: T;               // Complete row data
  rowIndex: number;     // Row position
  column: Column<T>;    // Column configuration
  isEditing: boolean;   // Current editing state
}
```

## Render Decision Types

Return a `CellRenderDecision` to specify what to display:

```typescript
interface CellRenderDecision {
  type: 'text' | 'collection' | 'checkbox' | 'toggle' | 'date' | 'datetime' | 'currency' | 'number' | 'custom';
  content?: React.ReactNode;
  props?: Record<string, any>;
  collectionConfig?: CollectionConfig;
  editable?: boolean;
}
```

## Common Patterns

### Mixed Content Types

Handle different data types in the same column:

```typescript
{
  header: 'Content',
  accessor: 'content',
  renderCell: (context) => {
    const { value } = context;
    
    // Array of items -> Collection
    if (Array.isArray(value) && value.length > 0) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: value.map(item => ({
            value: item.id,
            label: item.name
          }))
        }
      };
    }
    
    // Numeric value -> Currency
    if (typeof value === 'number') {
      return {
        type: 'currency',
        props: {
          currencyOptions: { locale: 'en-US', currency: 'USD' }
        }
      };
    }
    
    // Date string -> Date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return {
        type: 'date',
        props: {
          dateOptions: { locale: 'en-US', dateStyle: 'medium' }
        }
      };
    }
    
    // Default to text
    return {
      type: 'text',
      content: String(value || 'No data')
    };
  }
}
```

### Conditional Editability

Enable editing based on row state or user permissions:

```typescript
{
  header: 'Status',
  accessor: 'status',
  renderCell: (context) => {
    const { value, row } = context;
    
    // Only editable if not completed and user has permissions
    const canEdit = row.status !== 'completed' && row.userCanEdit;
    
    return {
      type: 'collection',
      collectionConfig: {
        type: 'radio',
        inputMode: 'chips',
        options: statusOptions
      },
      editable: canEdit
    };
  }
}
```

### Progressive Data Types

Display becomes more sophisticated as data becomes available:

```typescript
{
  header: 'Progress',
  accessor: 'progress',
  renderCell: (context) => {
    const { value, row } = context;
    
    // Detailed progress data -> Collection
    if (value && Array.isArray(value.steps)) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          inputMode: 'traditional',
          options: value.steps.map(step => ({
            value: step.id,
            label: step.description,
            disabled: step.locked
          }))
        }
      };
    }
    
    // Simple percentage -> Custom progress bar
    if (typeof value === 'number') {
      return {
        type: 'custom',
        content: (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
            <span className="progress-text">{value}%</span>
          </div>
        )
      };
    }
    
    // No progress data
    return {
      type: 'text',
      content: 'Not started'
    };
  }
}
```

## ProcessPlans Example

Real-world example handling mixed content in process management:

```typescript
interface ProcessPlan {
  id: string;
  name: string;
  comments: string | string[] | null;
  status: 'draft' | 'active' | 'completed';
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const processPlansColumns: Column<ProcessPlan>[] = [
  {
    header: 'Process Name',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true
  },
  {
    header: 'Comments',
    accessor: 'comments',
    renderCell: (context) => {
      const { value, row, isEditing } = context;
      
      // Array of process steps -> Traditional checkboxes
      if (Array.isArray(value) && value.length > 0) {
        return {
          type: 'collection',
          collectionConfig: {
            type: 'checkbox',
            inputMode: 'traditional',     // Enterprise-friendly
            viewDisplayMode: 'inline',
            options: value.map(step => ({
              value: step,
              label: step
            })),
            placeholder: 'Select completed steps...'
          },
          editable: row.status !== 'completed'
        };
      }
      
      // String comment -> Text with emoji
      if (typeof value === 'string' && value.trim()) {
        return {
          type: 'text',
          content: `💬 ${value}`
        };
      }
      
      // Empty state
      return {
        type: 'text',
        content: <em style={{ color: '#6b7280' }}>No comments</em>
      };
    }
  },
  {
    header: 'Status',
    accessor: 'status',
    renderCell: (context) => {
      const { value, row } = context;
      
      return {
        type: 'collection',
        collectionConfig: {
          type: 'radio',
          inputMode: 'chips',
          viewDisplayMode: 'inline',
          options: [
            { value: 'draft', label: 'Draft', color: '#6b7280' },
            { value: 'active', label: 'Active', color: '#059669' },
            { value: 'completed', label: 'Completed', color: '#7c3aed' }
          ]
        },
        editable: true
      };
    }
  },
  {
    header: 'Priority',
    accessor: 'priority',
    renderCell: (context) => {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'radio',
          inputMode: 'chips',
          options: [
            { value: 'low', label: 'Low', color: '#22c55e' },
            { value: 'medium', label: 'Medium', color: '#f59e0b' },
            { value: 'high', label: 'High', color: '#ef4444' },
            { value: 'urgent', label: 'Urgent', color: '#dc2626' }
          ]
        }
      };
    }
  }
];
```

## Advanced Patterns

### Type-Safe Dynamic Rendering

Use TypeScript to ensure type safety in dynamic rendering:

```typescript
interface UserData {
  id: string;
  name: string;
  metadata: string | number | UserSkill[] | null;
}

interface UserSkill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

const isSkillArray = (value: any): value is UserSkill[] => 
  Array.isArray(value) && value.every(item => 
    typeof item === 'object' && 'id' in item && 'name' in item
  );

{
  header: 'Metadata',
  accessor: 'metadata',
  renderCell: (context) => {
    const { value } = context;
    
    // Type-safe skill array handling
    if (isSkillArray(value)) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: value.map(skill => ({
            value: skill.id,
            label: `${skill.name} (${skill.level})`,
            color: getSkillLevelColor(skill.level)
          }))
        }
      };
    }
    
    // Numeric metadata
    if (typeof value === 'number') {
      return { type: 'number' };
    }
    
    // String metadata
    if (typeof value === 'string') {
      return { type: 'text', content: value };
    }
    
    return { type: 'text', content: 'No metadata' };
  }
}
```

### Context-Aware Rendering

Use row context to make sophisticated display decisions:

```typescript
{
  header: 'Actions',
  accessor: 'actions',
  renderCell: (context) => {
    const { row, value } = context;
    
    // Show different actions based on user role
    if (row.userRole === 'admin') {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: [
            { value: 'edit', label: 'Edit' },
            { value: 'delete', label: 'Delete' },
            { value: 'archive', label: 'Archive' },
            { value: 'permissions', label: 'Manage Permissions' }
          ]
        }
      };
    }
    
    // Limited actions for regular users
    if (row.userRole === 'user' && row.ownerId === row.currentUserId) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: [
            { value: 'edit', label: 'Edit' },
            { value: 'archive', label: 'Archive' }
          ]
        }
      };
    }
    
    // No actions available
    return {
      type: 'text',
      content: <span style={{ color: '#9ca3af' }}>No actions</span>
    };
  }
}
```

### Nested Data Rendering

Handle complex nested data structures:

```typescript
interface ProjectData {
  id: string;
  name: string;
  tasks: {
    completed: string[];
    pending: string[];
    blocked: string[];
  };
}

{
  header: 'Task Status',
  accessor: 'tasks',
  renderCell: (context) => {
    const { value } = context;
    
    if (!value || typeof value !== 'object') {
      return { type: 'text', content: 'No tasks' };
    }
    
    const allTasks = [
      ...value.completed?.map(task => ({ id: task, label: task, status: 'completed' })) || [],
      ...value.pending?.map(task => ({ id: task, label: task, status: 'pending' })) || [],
      ...value.blocked?.map(task => ({ id: task, label: task, status: 'blocked' })) || []
    ];
    
    if (allTasks.length === 0) {
      return { type: 'text', content: 'No tasks' };
    }
    
    return {
      type: 'collection',
      collectionConfig: {
        type: 'checkbox',
        inputMode: 'traditional',
        viewDisplayMode: 'auto',
        options: allTasks.map(task => ({
          value: task.id,
          label: task.label,
          color: getStatusColor(task.status),
          disabled: task.status === 'blocked'
        }))
      }
    };
  }
}
```

## Performance Optimization

### Memoized Decisions

Cache expensive rendering decisions:

```typescript
const memoizedRenderCell = useCallback((context: CellRenderContext<MyData>) => {
  const { value, row } = context;
  
  // Expensive calculation only when dependencies change
  const options = useMemo(() => 
    calculateComplexOptions(value, row), 
    [value, row.id, row.version]
  );
  
  return {
    type: 'collection',
    collectionConfig: {
      type: 'checkbox',
      options
    }
  };
}, []);

{
  header: 'Complex Data',
  accessor: 'complexData',
  renderCell: memoizedRenderCell
}
```

### Utility Functions

Create reusable rendering utilities:

```typescript
// Utility functions for common patterns
export const createMixedContentRenderer = <T>(
  patterns: {
    [key: string]: (value: any, row: T) => CellRenderDecision;
  },
  fallback: (value: any, row: T) => CellRenderDecision
) => {
  return (context: CellRenderContext<T>): CellRenderDecision => {
    const { value, row } = context;
    
    for (const [pattern, handler] of Object.entries(patterns)) {
      if (matchesPattern(value, pattern)) {
        return handler(value, row);
      }
    }
    
    return fallback(value, row);
  };
};

// Usage
const commentRenderer = createMixedContentRenderer({
  'array': (value) => ({ 
    type: 'collection', 
    collectionConfig: { type: 'checkbox', options: value.map(...) }
  }),
  'string': (value) => ({ 
    type: 'text', 
    content: `💬 ${value}`
  })
}, (value) => ({ 
  type: 'text', 
  content: 'No data' 
}));
```

## Error Handling

Handle rendering errors gracefully:

```typescript
{
  header: 'Dynamic Content',
  accessor: 'content',
  renderCell: (context) => {
    try {
      const { value, row } = context;
      
      // Your complex rendering logic here
      return complexRenderingLogic(value, row);
      
    } catch (error) {
      console.error('Rendering error:', error);
      
      // Fallback to safe display
      return {
        type: 'text',
        content: (
          <span style={{ color: '#ef4444' }}>
            Rendering error: {error.message}
          </span>
        )
      };
    }
  }
}
```

## Testing Dynamic Rendering

Test different scenarios comprehensively:

```typescript
describe('Dynamic Comments Column', () => {
  const mockRenderCell = /* your renderCell function */;
  
  it('renders array as collection', () => {
    const context = {
      value: ['Step 1', 'Step 2', 'Step 3'],
      row: mockRow,
      rowIndex: 0,
      column: mockColumn,
      isEditing: false
    };
    
    const result = mockRenderCell(context);
    
    expect(result.type).toBe('collection');
    expect(result.collectionConfig?.options).toHaveLength(3);
  });
  
  it('renders string as text', () => {
    const context = {
      value: 'This is a comment',
      row: mockRow,
      rowIndex: 0,
      column: mockColumn,
      isEditing: false
    };
    
    const result = mockRenderCell(context);
    
    expect(result.type).toBe('text');
    expect(result.content).toContain('This is a comment');
  });
  
  it('handles null/undefined gracefully', () => {
    const context = {
      value: null,
      row: mockRow,
      rowIndex: 0,
      column: mockColumn,
      isEditing: false
    };
    
    const result = mockRenderCell(context);
    
    expect(result.type).toBe('text');
    expect(result.content).toContain('No comments');
  });
});
```

## Best Practices

### Decision Logic
- Keep rendering logic simple and predictable
- Use early returns for clarity
- Handle null/undefined values gracefully
- Provide meaningful fallbacks

### Performance
- Memoize expensive calculations
- Avoid creating new objects on every render
- Use React.memo for complex custom content
- Consider server-side rendering for static content

### Type Safety
- Use TypeScript type guards
- Define clear interfaces for expected data shapes
- Validate data structure before rendering
- Provide type-safe utility functions

### User Experience
- Ensure consistent interaction patterns
- Provide clear visual feedback for different content types
- Maintain accessibility across all render types
- Test with screen readers

### Maintainability
- Document complex rendering logic
- Extract reusable patterns into utilities
- Keep column definitions focused
- Use descriptive variable names

## Next Steps

- [Collection Data Types](./collections.md) - Deep dive into collection configurations
- [Theming](./theming.md) - Style dynamic content consistently
- [Inline Editing](../guides/editing.md) - Handle editing across different content types
- [Performance](../advanced/performance.md) - Optimize rendering performance