import React from 'react';
import { ReusableTable, CollectionCell, CollectionConfig } from './src/index';
import type { Column } from './src/types';

// Example data structure with collection fields
interface TeamMember {
  id: number;
  name: string;
  skills: string[];        // Chip collection
  department: string;      // Radio collection  
  permissions: string[];   // Checkbox collection
  tags: string[];         // Tag collection
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    skills: ['javascript', 'react', 'typescript'],
    department: 'engineering',
    permissions: ['read', 'write'],
    tags: ['senior', 'frontend', 'team-lead']
  },
  {
    id: 2,
    name: 'Bob Smith', 
    skills: ['python', 'django', 'postgresql'],
    department: 'engineering',
    permissions: ['read', 'write', 'admin'],
    tags: ['backend', 'database-expert']
  }
];

// Define collection columns
const teamColumns: Column<TeamMember>[] = [
  { header: 'ID', accessor: 'id', sortable: true, filterable: true, dataType: 'number' },
  { header: 'Name', accessor: 'name', sortable: true, filterable: true, dataType: 'string' },
  
  // Chip Collection - Multiple visual chips
  {
    header: 'Skills',
    accessor: 'skills',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    collectionConfig: {
      type: 'chip',
      displayMode: 'chips',
      maxSelections: 5,
      chipVariant: 'filled',
      removable: true,
      searchable: true,
      options: [
        { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
        { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
        { value: 'react', label: 'React', color: '#61dafb' },
        { value: 'python', label: 'Python', color: '#3776ab' },
        { value: 'django', label: 'Django', color: '#092e20' },
        { value: 'postgresql', label: 'PostgreSQL', color: '#336791' }
      ]
    } as CollectionConfig
  },

  // Radio Collection - Single selection
  {
    header: 'Department', 
    accessor: 'department',
    sortable: true,
    filterable: true,
    dataType: 'collection',
    collectionConfig: {
      type: 'radio',
      required: true,
      clearable: false,
      options: [
        { value: 'engineering', label: 'Engineering', color: '#3b82f6' },
        { value: 'design', label: 'Design', color: '#8b5cf6' },
        { value: 'product', label: 'Product', color: '#06b6d4' },
        { value: 'marketing', label: 'Marketing', color: '#f59e0b' }
      ]
    } as CollectionConfig
  },

  // Checkbox Collection - Multiple selections with constraints
  {
    header: 'Permissions',
    accessor: 'permissions', 
    sortable: true,
    filterable: true,
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      maxSelections: 5,
      minSelections: 1,
      selectAllOption: true,
      displayMode: 'text',
      options: [
        { value: 'read', label: 'Read Access', color: '#10b981' },
        { value: 'write', label: 'Write Access', color: '#f59e0b' },
        { value: 'admin', label: 'Admin Access', color: '#ef4444' },
        { value: 'delete', label: 'Delete Access', color: '#dc2626' }
      ]
    } as CollectionConfig
  },

  // Tag Collection - User-editable tags
  {
    header: 'Tags',
    accessor: 'tags',
    sortable: true, 
    filterable: true,
    dataType: 'collection',
    collectionConfig: {
      type: 'tag',
      allowCustomValues: true,
      maxTags: 8,
      minLength: 2,
      maxLength: 20,
      duplicateAllowed: false,
      caseSensitive: false,
      separator: ',',
      displayMode: 'chips',
      placeholder: 'Add tags...',
      options: [
        { value: 'senior', label: 'Senior', color: '#059669' },
        { value: 'junior', label: 'Junior', color: '#0891b2' },
        { value: 'frontend', label: 'Frontend', color: '#3b82f6' },
        { value: 'backend', label: 'Backend', color: '#7c3aed' },
        { value: 'team-lead', label: 'Team Lead', color: '#dc2626' }
      ]
    } as CollectionConfig
  }
];

// Standalone CollectionCell usage
const StandaloneExample: React.FC = () => {
  const [skills, setSkills] = React.useState<string[]>(['javascript', 'react']);
  
  const skillsConfig: CollectionConfig = {
    type: 'chip',
    displayMode: 'chips',
    maxSelections: 3,
    options: [
      { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
      { value: 'react', label: 'React', color: '#61dafb' },
      { value: 'typescript', label: 'TypeScript', color: '#3178c6' }
    ]
  };

  return (
    <div className="p-4">
      <h3 className="mb-2 font-medium">Select Skills:</h3>
      <CollectionCell
        value={skills}
        config={skillsConfig}
        onChange={(newSkills) => setSkills(newSkills as string[])}
        aria-label="Skills selection"
      />
    </div>
  );
};

export { teamColumns, teamMembers, StandaloneExample };