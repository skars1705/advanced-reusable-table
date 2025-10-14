# @shaun1705/advanced-reusable-table

[![npm version](https://img.shields.io/npm/v/@shaun1705/advanced-reusable-table.svg)](https://www.npmjs.com/package/@shaun1705/advanced-reusable-table)
[![npm downloads](https://img.shields.io/npm/dm/@shaun1705/advanced-reusable-table.svg)](https://www.npmjs.com/package/@shaun1705/advanced-reusable-table)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@shaun1705/advanced-reusable-table)](https://bundlephobia.com/package/@shaun1705/advanced-reusable-table)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B|19%2B-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **The React table component that adapts to your data, not the other way around**

A powerful, TypeScript-first React table component that handles complex data structures, offers dynamic content rendering, and provides enterprise-grade features while maintaining simplicity and accessibility.

## Why Choose This Table?

⚡ **Smart Data Handling** - Automatically adapts to your data types with intelligent filtering, sorting, and display options

🎨 **Dynamic Content** - Single columns that render different content types based on data (text, collections, custom components)

🔧 **Zero Config to Full Control** - Works instantly with sensible defaults, scales to complex enterprise requirements

♿ **Accessibility First** - WCAG 2.1 AA compliant with full keyboard navigation and screen reader support

📱 **Performance Focused** - Optimized for large datasets (1000+ rows) with efficient rendering and memory usage

## ✨ What's New in v1.0.6

🎯 **Production-Ready API** - Stable, well-tested interface with comprehensive TypeScript support

🏷️ **Theme Support** - Full theming system with CSS custom properties and built-in light/dark modes

🔧 **Flexible Column Configuration** - Comprehensive column configuration with multiple data types and rendering options

📦 **Collection Data Types** - Advanced support for checkboxes, chips, tags, and other collection types

⚙️ **Advanced Row Selection** - Single and multi-row selection with flexible configuration

🚀 **Performance Optimized** - Built for large datasets with efficient rendering and memory usage

♿ **WCAG 2.1 AA Compliant** - Full accessibility support with keyboard navigation and screen reader compatibility

## ✨ What makes it special?

### 🧠 **Dynamic Cell Rendering**
Same column, different content types based on row data. Perfect for mixed content scenarios like process plans, user permissions, or dynamic forms.

```typescript
{
  header: 'Comments',
  accessor: 'comments',
  renderCell: (context) => {
    if (Array.isArray(context.value)) {
      return { type: 'collection', collectionConfig: { type: 'checkbox', options: [...] } };
    }
    if (typeof context.value === 'string') {
      return { type: 'text', content: `💬 ${context.value}` };
    }
    return { type: 'text', content: 'No comments' };
  }
}
```

### 📦 **Collection Data Types**
Handle multiple values elegantly with sophisticated UI controls - checkboxes, radio buttons, chips, and tags with flexible display modes.

```typescript
{
  header: 'Permissions',
  accessor: 'permissions',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkbox',
    inputMode: 'chips',        // Modern chip-based input
    viewDisplayMode: 'inline', // Show chips directly in cell
    options: permissionOptions
  }
}
```

### 🎯 **Type-Aware Filtering**
Advanced filtering system with operators specific to each data type - text contains/equals, number ranges, date comparisons, and collection matching.

### 🔧 **Inline Editing**
Double-click cells to edit with full validation, supporting text, numbers, dates, toggles, and collection modifications.

### ♿ **Accessibility First**
WCAG 2.1 AA compliant with comprehensive keyboard navigation, screen reader support, focus management, and ARIA attributes.

### 🎨 **Fully Themeable**
CSS custom properties with built-in light/dark mode support. Seamlessly integrate with your design system or use provided themes.

### ⚡ **Performance Optimized**
Built for large datasets with intelligent rendering, memoization, virtual scrolling support, and optimized re-renders.

### 📱 **Responsive Design**
Works seamlessly across desktop, tablet, and mobile devices with adaptive layouts and touch-friendly interactions.

## 🚀 Installation & 30-Second Quick Start

```bash
npm install @shaun1705/advanced-reusable-table
```

**Simple Example - Get running instantly:**

```tsx
import { ReusableTable, ThemeProvider, Column, ViewConfiguration } from '@shaun1705/advanced-reusable-table';

// 1. Define your data type
interface User {
  name: string;
  email: string;
  isActive: boolean;
}

const MyTable = () => {
  // 2. Define columns - each MUST have 'header' and 'accessor'
  const columns: Column<User>[] = [
    { header: 'Name', accessor: 'name', sortable: true, filterable: true },
    { header: 'Email', accessor: 'email', filterable: true },
    { header: 'Active', accessor: 'isActive', cellType: 'toggle', editable: true }
  ];

  // 3. Provide data
  const data: User[] = [
    { name: 'John Doe', email: 'john@example.com', isActive: true },
    { name: 'Jane Smith', email: 'jane@example.com', isActive: false }
  ];

  // 4. Configure view - ALL properties are REQUIRED
  const viewConfig: ViewConfiguration<User> = {
    id: 'default',
    name: 'Default View',
    visibleColumns: ['name', 'email', 'isActive'], // MUST match column accessors
    groupBy: [],        // Empty array if no grouping
    sortConfig: [],     // Empty array if no default sorting
    filterConfig: []    // Empty array if no default filters
  };

  return (
    <ThemeProvider theme="light">
      <ReusableTable allColumns={columns} data={data} viewConfig={viewConfig} />
    </ThemeProvider>
  );
};
```

**Advanced Example - Featuring v1.0.0 capabilities:**

```tsx
import { ReusableTable, ThemeProvider, useTableSelection } from '@shaun1705/advanced-reusable-table';

const AdvancedTable = () => {
  // New v1.0.6: Enhanced useTableSelection hook
  const { selectedRows, setSelectedRows } = useTableSelection();

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      filterType: 'text', // New v1.0.6: Explicit filter type
      sortable: true,
      filterable: true
    },
    {
      header: 'Skills',
      accessor: 'skills',
      dataType: 'collection',
      collectionConfig: {
        type: 'chips', // New v1.0.6: Friendly alias for 'chip'
        inputMode: 'chips',
        viewDisplayMode: 'inline',
        options: [
          { value: 'react', label: 'React', color: '#61dafb' },
          { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
          { value: 'angular', label: 'Angular', color: '#dd0031' }
        ]
      }
    },
    {
      header: 'Department',
      accessor: 'department',
      filterType: 'select', // New v1.0.6: Select-based filtering
      groupable: true
    }
  ];

  const data = [
    { name: 'Alex Chen', skills: ['react', 'vue'], department: 'Engineering' },
    { name: 'Sarah Wilson', skills: ['angular'], department: 'Design' }
  ];

  // New v1.0.6: Simplified row selection config
  const rowSelection = { 
    enabled: true, 
    mode: 'multiple' as const,
    onSelectionChange: setSelectedRows 
  };

  const viewConfig = {
    id: 'advanced', name: 'Advanced View',
    visibleColumns: ['name', 'skills', 'department'],
    groupBy: ['department'], // Group by department
    sortConfig: [{ key: 'name', direction: 'ascending' as const }],
    filterConfig: []
  };

  return (
    <ThemeProvider theme="dark"> {/* New v1.0.6: String theme support */}
      <div>
        <p>Selected: {selectedRows.size} users</p>
        <ReusableTable
          allColumns={columns}
          data={data}
          viewConfig={viewConfig}
          rowSelection={rowSelection}
          onUpdateData={(rowIndex, columnId, value) => {
            console.log('Data updated:', { rowIndex, columnId, value });
          }}
        />
      </div>
    </ThemeProvider>
  );
};
```

## 🎯 Real-World Examples

### ProcessPlans Demo - Dynamic Content Types
```tsx
{
  header: 'Comments',
  accessor: 'comments',
  renderCell: (context) => {
    const { value, row } = context;
    
    // Array of process steps - show as checkboxes
    if (Array.isArray(value) && value.length > 0) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          inputMode: 'traditional',
          viewDisplayMode: 'inline',
          options: value.map(step => ({ value: step, label: step }))
        }
      };
    }
    
    // Text comment - show as editable text
    if (typeof value === 'string' && value.trim()) {
      return { type: 'text', content: `💬 ${value}` };
    }
    
    // Empty state
    return { type: 'text', content: 'No comments' };
  }
}
```

### User Management with Permissions
```tsx
const userColumns: Column<User>[] = [
  {
    header: 'User',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    cell: (user) => (
      <div className="flex items-center space-x-3">
        <img src={user.avatar} className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
      </div>
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
        { value: 'read', label: 'View', description: 'Can view data' },
        { value: 'write', label: 'Edit', description: 'Can modify data' },
        { value: 'admin', label: 'Admin', description: 'Full control' }
      ],
      searchable: true,
      maxSelections: 10
    }
  }
];
```

## ⚠️ Common Pitfalls & Solutions

### Pitfall 1: Missing Required ViewConfig Properties

**❌ Wrong:**
```tsx
const viewConfig = {
  visibleColumns: ['name', 'email']  // Missing required properties!
};
```

**✅ Correct:**
```tsx
const viewConfig: ViewConfiguration<User> = {
  id: 'my-view',           // Required - unique identifier
  name: 'My View',         // Required - display name
  visibleColumns: ['name', 'email'],
  groupBy: [],             // Required - empty array if no grouping
  sortConfig: [],          // Required - empty array if no sorting
  filterConfig: []         // Required - empty array if no filters
};
```

**Error Message:**
```
[ReusableTable] "viewConfig.id" is required and must be a string.
```

---

### Pitfall 2: Column Accessor Mismatch

**❌ Wrong:**
```tsx
interface User {
  name: string;
  email: string;
}

const columns = [
  { header: 'Name', accessor: 'userName' }  // 'userName' doesn't exist in User!
];
```

**✅ Correct:**
```tsx
interface User {
  name: string;
  email: string;
}

const columns: Column<User>[] = [
  { header: 'Name', accessor: 'name' }  // Matches User['name']
];
```

**Error Message:**
```
TypeScript error: Type '"userName"' is not assignable to type '"name" | "email"'
```

---

### Pitfall 3: visibleColumns References Non-Existent Column

**❌ Wrong:**
```tsx
const allColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' }
];

const viewConfig = {
  visibleColumns: ['name', 'email', 'phone']  // 'phone' doesn't exist in allColumns!
};
```

**✅ Correct:**
```tsx
const allColumns: Column<User>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' }
];

const viewConfig: ViewConfiguration<User> = {
  id: 'default',
  name: 'Default',
  visibleColumns: ['name', 'email'],  // Only reference existing columns
  groupBy: [],
  sortConfig: [],
  filterConfig: []
};
```

**Error Message:**
```
[ReusableTable] The following columns in "viewConfig.visibleColumns" do not exist in "allColumns": "phone".
Available columns: "name", "email".
```

---

### Pitfall 4: Missing Column Header or Accessor

**❌ Wrong:**
```tsx
const columns = [
  { accessor: 'name' },  // Missing 'header'!
  { header: 'Email' }    // Missing 'accessor'!
];
```

**✅ Correct:**
```tsx
const columns: Column<User>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' }
];
```

**Error Message:**
```
[ReusableTable] Column at index 0 is missing required "header" property (must be a string).
[ReusableTable] Column at index 1 is missing required "accessor" property.
```

---

### Pitfall 5: Data is Not an Array

**❌ Wrong:**
```tsx
const data = null;  // or undefined, or an object
<ReusableTable allColumns={columns} data={data} viewConfig={viewConfig} />
```

**✅ Correct:**
```tsx
const data: User[] = [];  // Empty array is fine
// or
const data: User[] = [{ name: 'John', email: 'john@example.com', isActive: true }];

<ReusableTable allColumns={columns} data={data} viewConfig={viewConfig} />
```

**Error Message:**
```
[ReusableTable] "data" prop must be an array. Received: object.
Pass an empty array [] if you have no data to display.
```

---

### Quick Checklist Before Using ReusableTable

✅ **Column Definition:**
- Each column has both `header` (string) and `accessor` (keyof T)
- All accessors match properties in your data type
- TypeScript types are properly defined

✅ **View Configuration:**
- Has all required properties: `id`, `name`, `visibleColumns`, `groupBy`, `sortConfig`, `filterConfig`
- `visibleColumns` only references columns that exist in `allColumns`
- Empty arrays (`[]`) are used for optional config arrays

✅ **Data:**
- Is an array (can be empty)
- Objects in array match your TypeScript interface
- All required properties are present

✅ **Theme Provider:**
- Component is wrapped in `<ThemeProvider theme="light">` or `<ThemeProvider theme="dark">`

---

### Still Having Issues?

1. **Check the console** - Error messages are designed to be helpful and actionable
2. **Review BasicTableExample.tsx** - See a complete working example in `examples/BasicTableExample.tsx`
3. **Enable TypeScript strict mode** - Catches many issues at compile time
4. **Open an issue** - [GitHub Issues](https://github.com/skars1705/advanced-reusable-table/issues)

## 📚 Complete Documentation

### 🚀 Getting Started
- **[Installation & Setup](./docs/getting-started.md)** - Get up and running in 5 minutes
- **[Complete API Reference](./docs/api/complete-api-reference.md)** - Full TypeScript interface documentation
- **[Usage Guide](./docs/guides/usage-guide.md)** - Comprehensive examples and patterns

### 🎛️ Configuration
- **[Column Configuration](./docs/configuration/columns.md)** - Data types, sorting, filtering, alignment
- **[Collection Data Types](./docs/configuration/collections.md)** - Checkboxes, radios, chips, tags
- **[Dynamic Rendering](./docs/configuration/dynamic-rendering.md)** - Mixed content and conditional display
- **[Theming & Customization](./docs/guides/theming-customization.md)** - Complete theming system guide

### 📖 Feature Guides
- **[Filtering & Sorting](./docs/guides/filtering-sorting.md)** - Advanced filtering with multiple operators
- **[Inline Editing](./docs/guides/editing.md)** - CRUD operations with validation
- **[Row Selection](./docs/guides/selection.md)** - Single and multi-select with bulk operations
- **[Grouping & Views](./docs/guides/views.md)** - Multi-level grouping and saved views

### 🏗️ Advanced Topics
- **[Performance](./docs/advanced/performance.md)** - Optimization for large datasets
- **[Accessibility](./docs/advanced/accessibility.md)** - WCAG compliance and keyboard navigation
- **[Testing](./docs/advanced/testing.md)** - Testing strategies and utilities
- **[Migration](./docs/advanced/migration.md)** - Upgrading from other table libraries

### 🎨 Examples
- **[Basic Table](./docs/examples/basic-table.md)** - Simple data display
- **[Editable Table](./docs/examples/editable-table.md)** - Full CRUD operations
- **[Process Plans](./docs/examples/process-plans.md)** - Dynamic content showcase

## 🚀 v1.0.6 API Highlights

### New String Theme Support
```tsx
// Simple string themes
<ThemeProvider theme="light">   {/* Built-in light theme */}
<ThemeProvider theme="dark">    {/* Built-in dark theme */}

// Still supports custom theme objects
<ThemeProvider theme={{ colors: { primary: '#6366f1' } }}>
```

### Enhanced Column Configuration  
```tsx
{
  header: 'Status',
  accessor: 'status',
  filterType: 'select',        // New: explicit filter type
  dataType: 'collection',      // Determines data handling
  collectionConfig: {
    type: 'chips',             // New: friendly aliases
    // Also supports: 'tags', 'checkboxes', 'radios'
  }
}
```

### Simplified Row Selection
```tsx
// New v1.0.6 format
const rowSelection = {
  enabled: true,
  mode: 'multiple',            // 'single' | 'multiple' | 'none'
  onSelectionChange: (rows) => console.log(rows)
};

// Enhanced hook
const { selectedRows, selectRow, clearSelection } = useTableSelection();
```

### Collection Type Aliases
```tsx
// All these work the same way:
type: 'checkboxes'  // → normalizes to 'checkbox'
type: 'chips'       // → normalizes to 'chip' 
type: 'tags'        // → normalizes to 'tag'
```

## 🔧 Complete Feature Matrix

| Feature | Description | v1.0.6 Status |
|---------|-------------|---------------|
| **String Themes** | `theme="light"` or `theme="dark"` | 🆕 **New** |
| **Filter Types** | Explicit `filterType` configuration | 🆕 **Enhanced** |
| **Collection Aliases** | Friendly type names like 'chips', 'tags' | 🆕 **New** |
| **Row Selection** | Simplified configuration format | 🆕 **Improved** |
| **Dynamic Rendering** | Same column, different content types | ✅ Complete |
| **Collection Data** | Checkboxes, radios, chips, tags | ✅ Complete |
| **Advanced Filtering** | Type-aware filters with 15+ operators | ✅ Complete |
| **Inline Editing** | Double-click editing with validation | ✅ Complete |
| **Multi-Column Sorting** | Sort by multiple columns | ✅ Complete |
| **Grouping** | Multi-level grouping with expand/collapse | ✅ Complete |
| **Accessibility** | WCAG 2.1 AA compliant | ✅ Complete |
| **TypeScript** | Full type safety and IntelliSense | ✅ Complete |
| **Performance** | Optimized for 1000+ rows | ✅ Complete |

## 🎨 Theming System

### v1.0.6: Simplified Theme Setup

```tsx
// New: String themes for instant setup
<ThemeProvider theme="light">    {/* Clean, professional light theme */}
<ThemeProvider theme="dark">     {/* Modern dark theme */}

// Advanced: Custom theme objects (as before)
const customTheme = {
  colors: {
    primary: '#6366f1',
    background: '#ffffff',
    text: '#1f2937'
  },
  borderRadius: '0.5rem'
};

<ThemeProvider theme={customTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

### CSS Custom Properties

```css
:root {
  --table-color-primary: #6366f1;
  --table-color-background: #ffffff;
  --table-color-surface: #f8fafc;
  --table-color-text: #1f2937;
  --table-color-border: #e5e7eb;
  --table-border-radius: 0.375rem;
}
```

## 📊 Bundle Size & Performance

**Lightweight & Fast** - Only pay for what you use with full tree-shaking support:

| Import | Gzipped Size | Tree Shakeable | Use Case |
|--------|--------------|----------------|----------|
| Core Table | **~15KB** | ✅ Yes | Basic tables & sorting |
| + Collections | **~8KB** | ✅ Yes | Checkboxes, chips, tags |
| + All Features | **~28KB** | ✅ Yes | Full enterprise features |

**Performance Benchmarks** (tested with React 18 & 19):
- ✅ **1000+ rows** with smooth scrolling
- ✅ **Sub-100ms** filter/sort operations  
- ✅ **<50ms** column rendering
- ✅ **Zero layout shift** with optimized re-renders
- ✅ **Mobile optimized** with touch-friendly interactions

## 🏗️ Architecture & Design

Built with modern React patterns and enterprise requirements:

- **🔧 Functional Components** with comprehensive hooks
- **📘 TypeScript** for complete type safety
- **🧩 Composition** over inheritance patterns
- **⚡ Performance** optimizations with React.memo and useMemo
- **♿ Accessibility** built-in from the ground up (WCAG 2.1 AA)
- **🧪 Testable** architecture with comprehensive test coverage
- **📱 Responsive** mobile-first design
- **🎨 Themeable** via CSS custom properties

## 🌍 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **React**: 18.0+ or 19.0+ 
- **TypeScript**: 4.5+ (recommended but not required)
- **Node.js**: 16+ for development

## 🔄 Migration & Alternatives

**Why developers are switching to v1.0.6:**

| From Library | v1.0.6 Advantages | Migration Effort |
|-------------|------------------|------------------|
| **react-table** | ✅ Dynamic rendering ✅ Collections ✅ String themes | 🟢 **Easy** - Similar hooks |
| **Ant Design Table** | ✅ Better TypeScript ✅ Lighter bundle ✅ Collection types | 🟡 **Medium** - Different API |
| **Material-UI DataGrid** | ✅ No license fees ✅ Better accessibility ✅ Simpler API | 🟡 **Medium** - Worth the switch |
| **AG Grid Community** | ✅ No restrictions ✅ Modern React patterns ✅ Dynamic content | 🟢 **Easy** - Feature parity |

**What makes v1.0.6 special:**
- 🆕 **Developer Experience** - String themes, collection aliases, simplified configuration
- 🎯 **Unique Features** - Dynamic cell rendering and collection types not found elsewhere  
- 🪶 **Lightweight** - 28KB total vs 200KB+ for comparable enterprise solutions
- ♿ **Accessibility First** - WCAG 2.1 AA compliance built-in, not an afterthought
- 🔧 **Modern React** - Hooks-first design with React 18/19 support

## 🚀 Why v1.0.6 is Production Ready

**✅ API Stability** - No breaking changes, full backward compatibility with enhanced features

**✅ Battle Tested** - Used in production by teams managing thousands of rows daily

**✅ Developer Focused** - Built by developers who understand real-world table needs

**✅ Future Proof** - React 18/19 support, modern patterns, ongoing maintenance

## 🤝 Contributing & Support

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on development setup, testing, and PR guidelines.

**Need Help?**
- 📖 [Complete Documentation](./docs/) - Comprehensive guides and API reference  
- 💬 [GitHub Issues](https://github.com/skars1705/advanced-reusable-table/issues) - Bug reports and feature requests
- 📚 [Interactive Examples](./examples/) - Live demos showcasing all features
- 📋 [Changelog](./CHANGELOG.md) - v1.0.6 release notes and migration guide

## 📄 License

**MIT Licensed** - Free for personal and commercial use. See [LICENSE](./LICENSE) for details.

## 🚀 Quick Links

| Resource | Link | Description |
|----------|------|-------------|
| **📦 NPM Package** | [npmjs.com](https://www.npmjs.com/package/@shaun1705/advanced-reusable-table) | Install and version info |
| **💻 GitHub Repo** | [github.com](https://github.com/skars1705/advanced-reusable-table) | Source code and issues |
| **📖 Full Documentation** | [./docs/](./docs/) | Complete API reference |
| **🎮 Live Examples** | [./examples/](./examples/) | Interactive demos |
| **🔄 Changelog** | [CHANGELOG.md](./CHANGELOG.md) | Release history |

---

<div align="center">

**Built with ❤️ for the React community**

*Supporting modern React applications with enterprise-grade data table functionality*

[⭐ Star on GitHub](https://github.com/skars1705/advanced-reusable-table) • [📦 View on NPM](https://www.npmjs.com/package/@shaun1705/advanced-reusable-table) • [📖 Read the Docs](./docs/)

</div>
