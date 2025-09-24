# Collection Data Types

Complete guide to handling multiple values in table cells with checkboxes, radio buttons, chips, and tags.

## Overview

Collections allow you to handle multiple values elegantly in a single cell. Perfect for:
- User permissions and roles
- Skills and technologies
- Categories and tags
- Process steps and checkpoints
- Multi-select data

## Collection Types

### Checkbox Collections
Multiple selection with traditional checkboxes or modern chip interface.

```typescript
{
  header: 'Permissions',
  accessor: 'permissions',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkbox',
    inputMode: 'traditional',        // or 'chips'
    viewDisplayMode: 'inline',       // or 'dropdown'
    options: [
      { value: 'read', label: 'Read Access', description: 'View data' },
      { value: 'write', label: 'Write Access', description: 'Modify data' },
      { value: 'admin', label: 'Admin Access', description: 'Full control' }
    ],
    maxSelections: 5,
    minSelections: 1,
    selectAllOption: true,
    searchable: true
  }
}
```

### Radio Collections
Single selection with radio buttons or colorful chips.

```typescript
{
  header: 'Priority',
  accessor: 'priority',
  dataType: 'collection',
  collectionConfig: {
    type: 'radio',
    inputMode: 'chips',              // Modern chip-based radio buttons
    viewDisplayMode: 'inline',
    options: [
      { value: 'low', label: 'Low', color: '#22c55e' },
      { value: 'medium', label: 'Medium', color: '#f59e0b' },
      { value: 'high', label: 'High', color: '#ef4444' },
      { value: 'urgent', label: 'Urgent', color: '#dc2626' }
    ],
    required: true,
    clearable: false
  }
}
```

### Chip Collections
Pure chip-based interface for modern applications.

```typescript
{
  header: 'Technologies',
  accessor: 'technologies',
  dataType: 'collection',
  collectionConfig: {
    type: 'chip',
    chipVariant: 'filled',           // 'filled' | 'outlined' | 'soft'
    removable: true,
    options: [
      { value: 'react', label: 'React', color: '#61dafb' },
      { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
      { value: 'angular', label: 'Angular', color: '#dd1b16' }
    ],
    maxSelections: 10,
    searchable: true
  }
}
```

### Tag Collections
User-created tags with validation.

```typescript
{
  header: 'Custom Tags',
  accessor: 'customTags',
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
    options: [
      { value: 'important', label: 'Important' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'review', label: 'Needs Review' }
    ]
  }
}
```

## Input Modes

Control how users interact with collections during editing.

### Traditional Mode
Classic HTML inputs (checkboxes/radio buttons) in a vertical list.

```typescript
{
  type: 'checkbox',
  inputMode: 'traditional',
  options: permissionOptions
}
```

**Best for:**
- Enterprise applications
- Familiar user experience
- Screen reader compatibility
- Long option lists

### Chips Mode
Modern chip-based interface with search and filtering.

```typescript
{
  type: 'checkbox',
  inputMode: 'chips',
  options: skillOptions,
  searchable: true
}
```

**Best for:**
- Modern applications
- Visual appeal
- Limited space
- Tech-savvy users

## Display Modes

Control how selected values are shown when not editing.

### Inline Display
Show chips directly in the table cell.

```typescript
{
  viewDisplayMode: 'inline',
  maxVisibleInline: 3,              // Show max 3 chips before "+"
  inlineThreshold: 5                // Switch to dropdown after 5 selections
}
```

### Dropdown Display
Show a summary with expandable details.

```typescript
{
  viewDisplayMode: 'dropdown'
}
```

### Auto Display
Automatically choose between inline and dropdown based on content.

```typescript
{
  viewDisplayMode: 'auto',
  inlineThreshold: 3,               // Switch to dropdown after 3 selections
  maxVisibleInline: 5               // Max chips shown inline before "+"
}
```

## Configuration Examples

### Enterprise Permissions
Traditional checkboxes for familiar enterprise UX.

```typescript
const permissionsConfig: CheckboxCollectionConfig = {
  type: 'checkbox',
  inputMode: 'traditional',
  viewDisplayMode: 'inline',
  options: [
    { 
      value: 'users.read', 
      label: 'View Users', 
      description: 'Can view user profiles and basic information' 
    },
    { 
      value: 'users.write', 
      label: 'Edit Users', 
      description: 'Can modify user profiles and settings' 
    },
    { 
      value: 'users.delete', 
      label: 'Delete Users', 
      description: 'Can permanently remove user accounts' 
    },
    { 
      value: 'admin.settings', 
      label: 'Admin Settings', 
      description: 'Can modify system-wide settings' 
    }
  ],
  selectAllOption: true,
  searchable: true,
  maxSelections: 10,
  minSelections: 1
};
```

### Modern Skills Selection
Colorful chips for tech skills.

```typescript
const skillsConfig: ChipCollectionConfig = {
  type: 'chip',
  chipVariant: 'filled',
  removable: true,
  viewDisplayMode: 'auto',
  inlineThreshold: 4,
  options: [
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
    { value: 'nodejs', label: 'Node.js', color: '#339933' },
    { value: 'python', label: 'Python', color: '#3776ab' },
    { value: 'golang', label: 'Go', color: '#00add8' },
    { value: 'rust', label: 'Rust', color: '#000000' },
    { value: 'docker', label: 'Docker', color: '#2496ed' },
    { value: 'kubernetes', label: 'Kubernetes', color: '#326ce5' }
  ],
  searchable: true,
  maxSelections: 8,
  placeholder: 'Search and select skills...'
};
```

### Status Selection
Single choice with visual indicators.

```typescript
const statusConfig: RadioCollectionConfig = {
  type: 'radio',
  inputMode: 'chips',
  viewDisplayMode: 'inline',
  options: [
    { 
      value: 'todo', 
      label: 'To Do', 
      color: '#6b7280',
      description: 'Not yet started'
    },
    { 
      value: 'in_progress', 
      label: 'In Progress', 
      color: '#f59e0b',
      description: 'Currently working on this'
    },
    { 
      value: 'review', 
      label: 'Under Review', 
      color: '#8b5cf6',
      description: 'Awaiting feedback'
    },
    { 
      value: 'completed', 
      label: 'Completed', 
      color: '#22c55e',
      description: 'Finished and approved'
    }
  ],
  required: true,
  clearable: false
};
```

### Custom Tags
User-generated content with validation.

```typescript
const tagsConfig: TagCollectionConfig = {
  type: 'tag',
  allowCustomValues: true,
  viewDisplayMode: 'auto',
  options: [
    { value: 'urgent', label: 'Urgent', color: '#ef4444' },
    { value: 'important', label: 'Important', color: '#f59e0b' },
    { value: 'blocked', label: 'Blocked', color: '#6b7280' },
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
  placeholder: 'Add tags...'
};
```

## Dynamic Options

Generate options based on context or data.

### Function-Based Options

```typescript
const getDepartmentOptions = (): CollectionOption[] => {
  return departments.map(dept => ({
    value: dept.id,
    label: dept.name,
    color: dept.color,
    disabled: !dept.active
  }));
};

{
  type: 'checkbox',
  options: getDepartmentOptions, // Function reference
  searchable: true
}
```

### Context-Dependent Options

```typescript
{
  header: 'Available Courses',
  accessor: 'courses',
  renderCell: (context) => {
    const { row } = context;
    const availableCourses = getCoursesForUser(row.userId);
    
    return {
      type: 'collection',
      collectionConfig: {
        type: 'checkbox',
        options: availableCourses,
        inputMode: 'chips'
      }
    };
  }
}
```

## Filtering Collections

Collections support advanced filtering operators:

- **Contains**: Has specific values
- **Does Not Contain**: Lacks specific values
- **Contains Any**: Has at least one of the specified values
- **Contains All**: Has all of the specified values
- **Is Empty**: No selections made

```typescript
// Users can filter by:
// "Skills contains React"
// "Permissions contains any of [admin, write]"
// "Tags is empty"
```

## Validation

### Built-in Validation

```typescript
const validatedConfig: CheckboxCollectionConfig = {
  type: 'checkbox',
  options: skillOptions,
  maxSelections: 5,        // Maximum allowed selections
  minSelections: 2,        // Minimum required selections
  required: true           // At least one selection required
};
```

### Custom Validation

```typescript
const customValidationConfig = {
  type: 'checkbox',
  options: permissionOptions,
  onChange: (value: string[], item: any) => {
    // Custom validation logic
    if (value.includes('admin') && !value.includes('read')) {
      throw new Error('Admin permission requires read permission');
    }
    
    if (value.length > 3 && !item.isPremiumUser) {
      throw new Error('Free users can only select up to 3 permissions');
    }
  }
};
```

## Performance Optimization

### Large Option Lists

For 100+ options, enable virtualization and search:

```typescript
const largeListConfig = {
  type: 'checkbox',
  options: allSkillsOptions,     // 500+ options
  searchable: true,               // Enable search filtering
  virtualized: true,              // Enable virtualization
  maxHeight: '300px',             // Limit dropdown height
  placeholder: 'Search skills...'
};
```

### Memoization

```typescript
const memoizedOptions = useMemo(() => 
  expensiveOptionsCalculation(), [dependencies]
);

const optimizedConfig = {
  type: 'checkbox',
  options: memoizedOptions,
  searchable: true
};
```

## Accessibility Features

Collections are built with accessibility in mind:

### Keyboard Navigation
- **Tab**: Navigate between collections
- **Arrow Keys**: Move within options
- **Space/Enter**: Toggle selections
- **Escape**: Close dropdown/cancel editing

### Screen Reader Support
- Proper ARIA labels and descriptions
- Selection count announcements
- Clear instructions for interaction

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus restoration after interaction

## Real-World Examples

### User Management System

```typescript
const userColumns = [
  {
    header: 'User',
    accessor: 'name',
    dataType: 'string' as const
  },
  {
    header: 'Roles',
    accessor: 'roles',
    dataType: 'collection' as const,
    collectionConfig: {
      type: 'checkbox' as const,
      inputMode: 'traditional',
      viewDisplayMode: 'inline',
      options: [
        { value: 'user', label: 'User', description: 'Basic user access' },
        { value: 'moderator', label: 'Moderator', description: 'Can moderate content' },
        { value: 'admin', label: 'Administrator', description: 'Full system access' }
      ],
      selectAllOption: true,
      maxSelections: 3
    }
  },
  {
    header: 'Departments',
    accessor: 'departments',
    dataType: 'collection' as const,
    collectionConfig: {
      type: 'chip' as const,
      chipVariant: 'soft',
      options: departmentOptions,
      searchable: true,
      viewDisplayMode: 'auto'
    }
  }
];
```

### Project Management

```typescript
const projectColumns = [
  {
    header: 'Status',
    accessor: 'status',
    dataType: 'collection' as const,
    collectionConfig: {
      type: 'radio' as const,
      inputMode: 'chips',
      options: [
        { value: 'planning', label: 'Planning', color: '#8b5cf6' },
        { value: 'active', label: 'Active', color: '#22c55e' },
        { value: 'on_hold', label: 'On Hold', color: '#f59e0b' },
        { value: 'completed', label: 'Completed', color: '#6b7280' }
      ]
    }
  },
  {
    header: 'Technologies',
    accessor: 'technologies',
    dataType: 'collection' as const,
    collectionConfig: {
      type: 'checkbox' as const,
      inputMode: 'chips',
      options: techStackOptions,
      maxSelections: 8,
      searchable: true
    }
  },
  {
    header: 'Tags',
    accessor: 'tags',
    dataType: 'collection' as const,
    collectionConfig: {
      type: 'tag' as const,
      allowCustomValues: true,
      maxTags: 5,
      options: commonTagOptions
    }
  }
];
```

## Best Practices

### Option Design
- Use clear, descriptive labels
- Provide helpful descriptions for complex options
- Choose meaningful colors that convey status/category
- Keep option lists focused and relevant

### Performance
- Use virtualization for 100+ options
- Implement search for large lists
- Memoize expensive option calculations
- Consider server-side filtering for very large datasets

### User Experience
- Choose appropriate input modes for your users
- Use auto display mode for varying content lengths
- Provide clear validation messages
- Include helpful placeholder text

### Data Structure
- Use consistent value formats (kebab-case, camelCase)
- Ensure values are unique within each collection
- Consider sorting options logically (alphabetical, priority)
- Plan for localization if needed

## Next Steps

- [Dynamic Rendering](./dynamic-rendering.md) - Collections in dynamic columns
- [Filtering & Sorting](../guides/filtering-sorting.md) - Advanced collection filtering
- [Theming](./theming.md) - Customize collection appearance
- [Performance](../advanced/performance.md) - Optimization for large datasets