import React from 'react';
import { 
  Column, 
  CellRenderContext, 
  CellRenderDecision, 
  CollectionConfig,
  createMixedContentRenderer,
  createConditionalEditRenderer 
} from './src/index';

// Example data types
interface Task {
  id: string;
  name: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignees?: string[];
  priority: 'low' | 'medium' | 'high';
  details: string | string[]; // Mixed content: string or array
}

// Example usage of dynamic cell rendering
export const dynamicTaskColumns: Column<Task>[] = [
  { 
    header: 'Task Name', 
    accessor: 'name', 
    sortable: true, 
    filterable: true 
  },
  
  // Example 1: Mixed content renderer (similar to ProcessPlans)
  {
    header: 'Task Details',
    accessor: 'details',
    sortable: true,
    filterable: true,
    // Dynamic rendering based on data type
    renderCell: createMixedContentRenderer([
      {
        // Complex tasks with multiple steps
        condition: (context) => Array.isArray(context.value) && context.value.length > 0,
        render: (context) => ({
          type: 'collection',
          collectionConfig: {
            type: 'checkbox',
            inputMode: 'traditional',
            viewDisplayMode: 'inline',
            options: [
              { value: 'review-code', label: 'Review Code' },
              { value: 'write-tests', label: 'Write Tests' },
              { value: 'update-docs', label: 'Update Documentation' },
              { value: 'deploy-staging', label: 'Deploy to Staging' }
            ]
          } as CollectionConfig,
          editable: context.row.status !== 'completed'
        })
      },
      {
        // Simple text description
        condition: (context) => typeof context.value === 'string' && context.value.trim(),
        render: (context) => ({
          type: 'text',
          content: React.createElement('span', {
            className: 'text-blue-300'
          }, context.value as string),
          editable: context.row.status !== 'completed'
        })
      }
    ])
  },
  
  // Example 2: Conditional editing based on status
  {
    header: 'Assignees',
    accessor: 'assignees',
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      options: [
        { value: 'alice', label: 'Alice Johnson' },
        { value: 'bob', label: 'Bob Smith' },
        { value: 'charlie', label: 'Charlie Brown' }
      ]
    } as CollectionConfig,
    renderCell: createConditionalEditRenderer(
      // Base renderer (uses column defaults)
      (context) => ({ 
        type: 'collection', 
        collectionConfig: context.column.collectionConfig! 
      }),
      // Editable condition
      (context) => context.row.status !== 'completed'
    )
  },
  
  // Example 3: Custom dynamic renderer with status-based styling
  {
    header: 'Priority',
    accessor: 'priority',
    sortable: true,
    filterable: true,
    renderCell: (context: CellRenderContext<Task>): CellRenderDecision => {
      const { value, row } = context;
      
      // Different rendering based on status and priority
      if (row.status === 'completed') {
        return {
          type: 'text',
          content: React.createElement('span', {
            className: 'text-gray-500 line-through'
          }, `${value} (completed)`),
          editable: false
        };
      }
      
      const priorityColors = {
        low: 'text-green-300 bg-green-500/20',
        medium: 'text-yellow-300 bg-yellow-500/20', 
        high: 'text-red-300 bg-red-500/20'
      };
      
      return {
        type: 'custom',
        content: React.createElement('span', {
          className: `px-2 py-1 rounded-full text-xs font-medium ${priorityColors[value as keyof typeof priorityColors]}`
        }, value),
        editable: row.status !== 'completed'
      };
    }
  },
  
  // Example 4: Return React node directly
  {
    header: 'Status',
    accessor: 'status',
    renderCell: (context) => {
      const statusIcons = {
        'todo': '⭕',
        'in-progress': '🔄', 
        'completed': '✅'
      };
      
      // Returning React node directly (gets wrapped in custom decision)
      return React.createElement('div', {
        className: 'flex items-center space-x-2'
      }, [
        React.createElement('span', { key: 'icon' }, statusIcons[context.value as keyof typeof statusIcons]),
        React.createElement('span', { key: 'text' }, context.value)
      ]);
    }
  }
];

// Example data
export const sampleTasks: Task[] = [
  {
    id: '1',
    name: 'Build user authentication',
    status: 'in-progress',
    assignees: ['alice', 'bob'],
    priority: 'high',
    details: ['review-code', 'write-tests', 'deploy-staging'] // Array -> collection
  },
  {
    id: '2', 
    name: 'Fix navigation bug',
    status: 'todo',
    assignees: ['charlie'],
    priority: 'medium',
    details: 'Simple bug fix in navbar component' // String -> text
  },
  {
    id: '3',
    name: 'Setup CI/CD pipeline',
    status: 'completed',
    assignees: ['alice'],
    priority: 'low',
    details: [] // Empty array -> fallback
  }
];

/* 
Usage in your component:

<ReusableTable<Task>
  allColumns={dynamicTaskColumns}
  data={sampleTasks}
  viewConfig={defaultView}
  onUpdateData={handleDataUpdate}
/>

This demonstrates:
1. Mixed content rendering (array vs string)
2. Conditional editing based on row state
3. Custom styling based on multiple data points
4. Direct React node returns
5. Helper functions for common patterns
*/