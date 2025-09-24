# Getting Started

Welcome to Advanced Reusable Table! This guide will get you up and running in under 5 minutes.

## Prerequisites

- **React**: 18.0+ or 19.0+
- **TypeScript**: 4.5+ (recommended but not required)
- **Node.js**: 16+ for development

## Installation

### NPM
```bash
npm install advanced-reusable-table
```

### Yarn
```bash
yarn add advanced-reusable-table
```

### Peer Dependencies
The component requires React and ReactDOM as peer dependencies:

```bash
npm install react react-dom
```

## Basic Setup

### 1. Import Styles and Components

```tsx
import React from 'react';
import { ReusableTable, ThemeProvider } from 'advanced-reusable-table';
import 'advanced-reusable-table/dist/style.css';
```

### 2. Wrap with ThemeProvider

The `ThemeProvider` enables theming and provides CSS custom properties. You can use predefined themes or custom theme objects:

```tsx
function App() {
  return (
    <ThemeProvider theme="light"> {/* NEW: String theme support */}
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

**Theme Options:**
- `"dark"` (default) - Dark theme optimized for low-light environments
- `"light"` - Clean light theme for bright environments
- Custom theme objects for full customization

### 3. Define Your Data Structure

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  skills: string[];
}

const userData: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    joinDate: '2023-01-15',
    skills: ['react', 'typescript', 'nodejs']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    joinDate: '2023-03-22',
    skills: ['figma', 'css', 'design-systems']
  }
];
```

### 4. Configure Columns

```tsx
import type { Column } from 'advanced-reusable-table';

const columns: Column<User>[] = [
  {
    header: 'Name',
    accessor: 'name',
    sortable: true,
    filterable: true,
    dataType: 'string'
  },
  {
    header: 'Email',
    accessor: 'email',
    filterable: true,
    dataType: 'string'
  },
  {
    header: 'Role',
    accessor: 'role',
    filterable: true,
    dataType: 'string'
  },
  {
    header: 'Join Date',
    accessor: 'joinDate',
    sortable: true,
    filterable: true,
    dataType: 'date',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'medium'
    }
  },
  {
    header: 'Skills',
    accessor: 'skills',
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips',
      viewDisplayMode: 'inline',
      options: [
        { value: 'react', label: 'React', color: '#61dafb' },
        { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
        { value: 'nodejs', label: 'Node.js', color: '#339933' },
        { value: 'figma', label: 'Figma', color: '#f24e1e' },
        { value: 'css', label: 'CSS', color: '#1572b6' },
        { value: 'design-systems', label: 'Design Systems', color: '#8b5cf6' }
      ]
    }
  }
];
```

### 5. Create a View Configuration

```tsx
import type { ViewConfiguration } from 'advanced-reusable-table';

const defaultView: ViewConfiguration<User> = {
  id: 'default',
  name: 'All Users',
  visibleColumns: ['name', 'email', 'role', 'joinDate', 'skills'],
  groupBy: [],
  sortConfig: [
    { key: 'name', direction: 'ascending' }
  ],
  filterConfig: []
};
```

### 6. Render the Table

```tsx
function UserTable() {
  return (
    <ThemeProvider>
      <div style={{ padding: '20px' }}>
        <h1>User Management</h1>
        <ReusableTable
          allColumns={columns}
          data={userData}
          viewConfig={defaultView}
        />
      </div>
    </ThemeProvider>
  );
}
```

## Complete Example

Here's the complete working example:

```tsx
import React from 'react';
import { ReusableTable, ThemeProvider } from 'advanced-reusable-table';
import type { Column, ViewConfiguration } from 'advanced-reusable-table';
import 'advanced-reusable-table/dist/style.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  skills: string[];
}

const userData: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    joinDate: '2023-01-15',
    skills: ['react', 'typescript', 'nodejs']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    joinDate: '2023-03-22',
    skills: ['figma', 'css', 'design-systems']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Manager',
    joinDate: '2022-11-08',
    skills: ['leadership', 'strategy']
  }
];

const columns: Column<User>[] = [
  {
    header: 'Name',
    accessor: 'name',
    sortable: true,
    filterable: true,
    dataType: 'string'
  },
  {
    header: 'Email',
    accessor: 'email',
    filterable: true,
    dataType: 'string'
  },
  {
    header: 'Role',
    accessor: 'role',
    filterable: true,
    dataType: 'string'
  },
  {
    header: 'Join Date',
    accessor: 'joinDate',
    sortable: true,
    filterable: true,
    dataType: 'date',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'medium'
    }
  },
  {
    header: 'Skills',
    accessor: 'skills',
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips',
      viewDisplayMode: 'inline',
      options: [
        { value: 'react', label: 'React', color: '#61dafb' },
        { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
        { value: 'nodejs', label: 'Node.js', color: '#339933' },
        { value: 'figma', label: 'Figma', color: '#f24e1e' },
        { value: 'css', label: 'CSS', color: '#1572b6' },
        { value: 'design-systems', label: 'Design Systems', color: '#8b5cf6' },
        { value: 'leadership', label: 'Leadership', color: '#10b981' },
        { value: 'strategy', label: 'Strategy', color: '#f59e0b' }
      ]
    }
  }
];

const defaultView: ViewConfiguration<User> = {
  id: 'default',
  name: 'All Users',
  visibleColumns: ['name', 'email', 'role', 'joinDate', 'skills'],
  groupBy: [],
  sortConfig: [{ key: 'name', direction: 'ascending' }],
  filterConfig: []
};

function App() {
  return (
    <ThemeProvider theme="light"> {/* Using light theme */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>User Management</h1>
        <ReusableTable
          allColumns={columns}
          data={userData}
          viewConfig={defaultView}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

## What You Get

This basic setup provides all the latest v1.0.6 features:

✅ **Sortable columns** - Click headers to sort by name, join date  
✅ **Advanced filtering** - Filter by text, dates, and collections with `filterType` customization  
✅ **Collection display** - Skills shown as colored chips with enhanced display modes  
✅ **Responsive design** - Works on mobile and desktop  
✅ **Accessibility** - Full keyboard navigation and screen reader support  
✅ **Type safety** - Complete TypeScript integration  
✅ **String themes** - Easy light/dark theme switching  
✅ **Enhanced row selection** - Improved selection API with limits and batch operations  

## Next Steps

Now that you have a basic table running, explore these features:

### 🔧 Essential Features
- [Column Configuration](./configuration/columns.md) - Learn about all column options
- [Collection Types](./configuration/collections.md) - Checkboxes, radios, chips, and tags
- [Theming](./configuration/theming.md) - Customize colors and styling

### 🚀 Advanced Features
- [Dynamic Rendering](./configuration/dynamic-rendering.md) - Same column, different content types
- [Inline Editing](./guides/editing.md) - Add CRUD operations
- [Global Search](./guides/search.md) - Search across all columns

### 📱 Real-World Examples
- [Basic Table](./examples/basic-table.md) - Simple data display
- [Editable Table](./examples/editable-table.md) - Full CRUD operations
- [Process Plans](./examples/process-plans.md) - Mixed content showcase

## Common Issues

### Styles Not Loading
Make sure to import the CSS file:
```tsx
import 'advanced-reusable-table/dist/style.css';
```

### TypeScript Errors
Ensure your TypeScript version is 4.5+:
```bash
npm install -D typescript@latest
```

### Missing ThemeProvider
Always wrap your table with `ThemeProvider`:
```tsx
<ThemeProvider>
  <ReusableTable {...props} />
</ThemeProvider>
```

## Help & Support

- 📖 [Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/yourorg/advanced-reusable-table/issues)
- 💬 [Discussions](https://github.com/yourorg/advanced-reusable-table/discussions)
- 📧 [Email Support](mailto:support@advanced-reusable-table.dev)

Ready to build amazing tables! 🎉