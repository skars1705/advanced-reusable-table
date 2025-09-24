// Collection Display Modes Demonstration
// This file showcases all the flexible collection display combinations

import React from 'react';
import { ReusableTable } from './src/components/ReusableTable';
import type { Column } from './src/types';

interface CollectionModeExample {
  id: number;
  name: string;
  // Traditional input + inline display (small lists)
  traditionalInline: string[];
  // Traditional input + dropdown display (large lists)
  traditionalDropdown: string[];
  // Traditional input + auto display mode
  traditionalAuto: string[];
  // Chip input + inline display (modern look)
  chipInline: string[];
  // Chip input + dropdown display (clean interface)
  chipDropdown: string[];
  // Radio selection + inline display
  radioSelection: string;
}

const sampleData: CollectionModeExample[] = [
  {
    id: 1,
    name: 'Example 1',
    traditionalInline: ['option1', 'option2'],
    traditionalDropdown: ['perm1', 'perm2', 'perm3', 'perm4', 'perm5'],
    traditionalAuto: ['skill1', 'skill2'],
    chipInline: ['tag1', 'tag2'],
    chipDropdown: ['cat1', 'cat2', 'cat3', 'cat4'],
    radioSelection: 'engineering'
  },
  {
    id: 2,
    name: 'Example 2',
    traditionalInline: ['option1'],
    traditionalDropdown: ['perm1', 'perm2'],
    traditionalAuto: ['skill1', 'skill2', 'skill3', 'skill4', 'skill5'],
    chipInline: ['tag1', 'tag2', 'tag3'],
    chipDropdown: ['cat1', 'cat2'],
    radioSelection: 'design'
  }
];

const columns: Column<CollectionModeExample>[] = [
  { header: 'ID', accessor: 'id', sortable: true, filterable: true, dataType: 'number' },
  { header: 'Name', accessor: 'name', sortable: true, filterable: true, dataType: 'string' },
  
  // Traditional input + inline display (small lists)
  {
    header: 'Traditional + Inline',
    accessor: 'traditionalInline',
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'traditional', // Traditional checkboxes
      viewDisplayMode: 'inline', // Show directly in cells
      maxSelections: 3,
      searchable: true,
      placeholder: 'Select options...',
      inlineThreshold: 5,
      options: [
        { value: 'option1', label: 'Option 1', color: '#3b82f6' },
        { value: 'option2', label: 'Option 2', color: '#8b5cf6' },
        { value: 'option3', label: 'Option 3', color: '#06b6d4' }
      ]
    }
  },
  
  // Traditional input + dropdown display (large lists)
  {
    header: 'Traditional + Dropdown',
    accessor: 'traditionalDropdown',
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'traditional', // Traditional checkboxes
      viewDisplayMode: 'dropdown', // Collapse into selector
      maxSelections: 10,
      searchable: true,
      placeholder: 'Select permissions...',
      inlineThreshold: 2,
      options: [
        { value: 'perm1', label: 'Permission 1', color: '#10b981' },
        { value: 'perm2', label: 'Permission 2', color: '#f59e0b' },
        { value: 'perm3', label: 'Permission 3', color: '#ef4444' },
        { value: 'perm4', label: 'Permission 4', color: '#8b5cf6' },
        { value: 'perm5', label: 'Permission 5', color: '#6b7280' }
      ]
    }
  },
  
  // Traditional input + auto display mode
  {
    header: 'Traditional + Auto',
    accessor: 'traditionalAuto',
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'traditional', // Traditional checkboxes
      viewDisplayMode: 'auto', // Smart detection
      maxSelections: 8,
      searchable: true,
      placeholder: 'Select skills...',
      inlineThreshold: 3,
      maxVisibleInline: 4,
      options: [
        { value: 'skill1', label: 'Skill 1', color: '#f7df1e' },
        { value: 'skill2', label: 'Skill 2', color: '#3178c6' },
        { value: 'skill3', label: 'Skill 3', color: '#61dafb' },
        { value: 'skill4', label: 'Skill 4', color: '#4fc08d' },
        { value: 'skill5', label: 'Skill 5', color: '#339933' }
      ]
    }
  },
  
  // Chip input + inline display (modern look)
  {
    header: 'Chip + Inline',
    accessor: 'chipInline',
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips', // Modern chip input
      viewDisplayMode: 'inline', // Show directly in cells
      maxSelections: 5,
      searchable: true,
      placeholder: 'Select tags...',
      inlineThreshold: 4,
      options: [
        { value: 'tag1', label: 'Tag 1', color: '#059669' },
        { value: 'tag2', label: 'Tag 2', color: '#0891b2' },
        { value: 'tag3', label: 'Tag 3', color: '#3b82f6' },
        { value: 'tag4', label: 'Tag 4', color: '#7c3aed' }
      ]
    }
  },
  
  // Chip input + dropdown display (clean interface)
  {
    header: 'Chip + Dropdown',
    accessor: 'chipDropdown',
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips', // Modern chip input
      viewDisplayMode: 'dropdown', // Collapse selections
      maxSelections: 6,
      searchable: true,
      placeholder: 'Select categories...',
      inlineThreshold: 2,
      options: [
        { value: 'cat1', label: 'Category 1', color: '#dc2626' },
        { value: 'cat2', label: 'Category 2', color: '#ea580c' },
        { value: 'cat3', label: 'Category 3', color: '#ca8a04' },
        { value: 'cat4', label: 'Category 4', color: '#65a30d' }
      ]
    }
  },
  
  // Radio selection + inline display
  {
    header: 'Radio + Inline',
    accessor: 'radioSelection',
    dataType: 'collection',
    editable: true,
    collectionConfig: {
      type: 'radio',
      inputMode: 'traditional', // Traditional radio buttons
      viewDisplayMode: 'inline', // Show directly in cells
      required: true,
      placeholder: 'Select department...',
      options: [
        { value: 'engineering', label: 'Engineering', color: '#3b82f6' },
        { value: 'design', label: 'Design', color: '#8b5cf6' },
        { value: 'product', label: 'Product', color: '#06b6d4' },
        { value: 'marketing', label: 'Marketing', color: '#f59e0b' }
      ]
    }
  }
];

/**
 * # Collection Display Modes Demo
 * 
 * This demo showcases all possible combinations of:
 * 
 * ## Input Modes:
 * - **Traditional**: Classic checkbox/radio interfaces with labels
 * - **Chips**: Modern chip-based selection interface
 * 
 * ## Display Modes:
 * - **Inline**: Selected values show as chips directly in table cells
 * - **Dropdown**: Selected values collapse into an expandable selector
 * - **Auto**: Smart detection that switches based on selection count
 * 
 * ## Mode Combinations Demonstrated:
 * 1. Traditional + Inline (ProcessPlans.Aktivitetslista style)
 * 2. Traditional + Dropdown (Large permission lists)
 * 3. Traditional + Auto (Skills with smart switching)
 * 4. Chip + Inline (Modern tag interface)
 * 5. Chip + Dropdown (Clean category selection)
 * 6. Radio + Inline (Single selection display)
 * 
 * ## Key Features:
 * - **Accessibility**: WCAG 2.1 AA compliance across all modes
 * - **Performance**: Optimized rendering with minimal re-renders
 * - **Theming**: Consistent styling using CSS custom properties
 * - **Responsive**: Works seamlessly across device sizes
 * - **Interactive**: Click-to-edit functionality in all modes
 * 
 * ## Usage Guidelines:
 * - Use **Traditional + Inline** for small, enterprise-style lists
 * - Use **Traditional + Dropdown** for large permission/role lists
 * - Use **Traditional + Auto** for variable-size skill sets
 * - Use **Chip + Inline** for modern, tag-like interfaces
 * - Use **Chip + Dropdown** for clean category selection
 * - Use **Radio + Inline** for single-choice displays
 */
const CollectionModeDemo: React.FC = () => {
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Collection Display Modes Demo
        </h1>
        
        <div className="mb-8 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Mode Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-blue-400">Traditional Input Modes:</h3>
              <ul className="ml-4 space-y-1 text-gray-300">
                <li>• Traditional + Inline (small lists)</li>
                <li>• Traditional + Dropdown (large lists)</li>
                <li>• Traditional + Auto (smart switching)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-purple-400">Modern Chip Modes:</h3>
              <ul className="ml-4 space-y-1 text-gray-300">
                <li>• Chip + Inline (tag interface)</li>
                <li>• Chip + Dropdown (clean selection)</li>
                <li>• Radio + Inline (single choice)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <ReusableTable<CollectionModeExample>
          allColumns={columns}
          data={sampleData}
          viewConfig={{
            id: 'demo',
            name: 'Collection Demo',
            visibleColumns: columns.map(c => c.accessor),
            groupBy: [],
            sortConfig: [],
            filterConfig: []
          }}
          onUpdateData={(rowIndex, columnId, value) => {
            console.log('Data updated:', { rowIndex, columnId, value });
          }}
        />
      </div>
    </div>
  );
};

export default CollectionModeDemo;