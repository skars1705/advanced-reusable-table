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

## ✨ What's New in v1.0.9

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
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: context.value.map(v => ({ value: v, label: v }))
        }
      };
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
    options: [
      { value: 'read', label: 'View', description: 'Can view data' },
      { value: 'write', label: 'Edit', description: 'Can modify data' },
      { value: 'admin', label: 'Admin', description: 'Full control' }
    ]
  }
}
```

### 🎯 **Type-Aware Filtering**
Advanced filtering system with operators specific to each data type - text contains/equals, number ranges, date comparisons, and collection matching. All configured through `viewConfig.filterConfig`.

### 🔧 **Inline Editing**
Double-click cells to edit with full validation, supporting text, numbers, dates, toggles, and collection modifications. Updates handled through the `onUpdateData` callback.

### ♿ **Accessibility First**
WCAG 2.1 AA compliant with comprehensive keyboard navigation, screen reader support, focus management, and ARIA attributes.

### 🎨 **Fully Themeable**
CSS custom properties with built-in light/dark mode support. Seamlessly integrate with your design system or use provided themes via `ThemeProvider`.

### ⚡ **Performance Optimized**
Built for large datasets with intelligent rendering, memoization, virtual scrolling support, and optimized re-renders.

### 📱 **Responsive Design**
Works seamlessly across desktop, tablet, and mobile devices with adaptive layouts and touch-friendly interactions.

## 🚀 Installation & Quick Start

```bash
npm install @shaun1705/advanced-reusable-table
```

### Minimal Example - Simplest possible usage:

```tsx
import { ReusableTable, ThemeProvider, Column } from '@shaun1705/advanced-reusable-table';

interface User {
  name: string;
  email: string;
}

const MinimalTable = () => {
  const columns: Column<User>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' }
  ];

  const data: User[] = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' }
  ];

  return (
    <ThemeProvider theme="light">
      <ReusableTable allColumns={columns} data={data} />
    </ThemeProvider>
  );
};
```

**That's it!** No `viewConfig` required - the component auto-generates sensible defaults.

---

### Basic Example - With viewConfig for more control:

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

  // 4. Configure view - defines visible columns, sorting, filtering, grouping
  const viewConfig: ViewConfiguration<User> = {
    id: 'default',
    name: 'Default View',
    visibleColumns: ['name', 'email', 'isActive'],
    groupBy: [],        // Column keys to group by
    sortConfig: [],     // Initial sort configuration
    filterConfig: []    // Initial filter configuration
  };

  return (
    <ThemeProvider theme="light">
      <ReusableTable
        allColumns={columns}
        data={data}
        viewConfig={viewConfig}
      />
    </ThemeProvider>
  );
};
```

### Advanced Example - Full feature showcase:

```tsx
import {
  ReusableTable,
  ThemeProvider,
  useTableSelection,
  Column,
  ViewConfiguration
} from '@shaun1705/advanced-reusable-table';

interface Developer {
  name: string;
  skills: string[];
  department: string;
}

const AdvancedTable = () => {
  const data: Developer[] = [
    { name: 'Alex Chen', skills: ['react', 'vue'], department: 'Engineering' },
    { name: 'Sarah Wilson', skills: ['angular'], department: 'Design' }
  ];

  // Row selection hook - requires data and mode arguments
  const selection = useTableSelection<Developer>({
    data: data,
    mode: 'multiple'
  });

  const columns: Column<Developer>[] = [
    {
      header: 'Developer',
      accessor: 'name',
      filterType: 'text',
      sortable: true,
      filterable: true
    },
    {
      header: 'Skills',
      accessor: 'skills',
      dataType: 'collection',
      collectionConfig: {
        type: 'chips',
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
      filterType: 'select',
      groupable: true
    }
  ];

  // Row selection configuration
  const rowSelection = {
    enabled: true,
    mode: 'multiple' as const,
    onSelectionChange: (rows: Developer[]) => {
      console.log('Selected rows:', rows);
    }
  };

  // View configuration - controls all table behavior
  const viewConfig: ViewConfiguration<Developer> = {
    id: 'advanced',
    name: 'Advanced View',
    visibleColumns: ['name', 'skills', 'department'],
    groupBy: ['department'],
    sortConfig: [{ key: 'name', direction: 'ascending' as const }],
    filterConfig: []
  };

  return (
    <ThemeProvider theme="dark">
      <div>
        <p>Selected: {selection.selectedCount} developers</p>
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

## 📋 Component API

### Core Props

The `ReusableTable` component accepts only 5 props:

```typescript
interface ReusableTableProps<T extends object> {
  allColumns: Column<T>[];           // All column definitions
  data: T[];                         // Data to display
  viewConfig?: ViewConfiguration<T>; // View configuration (optional, auto-generated if not provided)
  onUpdateData?: (rowIndex: number, columnId: keyof T, value: any) => void;  // Edit callback
  rowSelection?: RowSelectionProp<T>; // Row selection config (optional)
}
```

#### `allColumns` (required)

Array of column definitions. Each column configures how data is displayed and interacted with:

```typescript
interface Column<T> {
  header: string;                    // Column header text (required)
  accessor: keyof T;                 // Data key (required)

  // Display configuration
  dataType?: 'string' | 'number' | 'currency' | 'date' | 'datetime' | 'collection';
  align?: 'left' | 'center' | 'right';
  cell?: (item: T) => React.ReactNode;  // Custom cell renderer

  // Feature toggles
  sortable?: boolean;                // Enable sorting
  filterable?: boolean;              // Enable filtering
  groupable?: boolean;               // Enable grouping
  editable?: boolean;                // Enable inline editing

  // Filter configuration
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'collection';

  // Type-specific options
  cellType?: 'checkbox' | 'toggle';
  currencyOptions?: { locale: string; currency: string };
  dateOptions?: { locale: string; dateStyle?: string; timeStyle?: string };
  collectionConfig?: CollectionConfig;

  // Dynamic rendering
  renderCell?: (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode;
}
```

#### `data` (required)

Array of data objects matching your type definition. Can be empty array `[]`.

#### `viewConfig` (optional, auto-generated if not provided)

Configuration that controls which columns are visible, sorting, filtering, and grouping. If not provided, the component will auto-generate a default view configuration showing all columns.

```typescript
interface ViewConfiguration<T> {
  id?: string;                        // Unique view identifier (optional)
  name?: string;                      // Display name (optional)
  visibleColumns?: (keyof T)[];       // Which columns to show (optional, defaults to all columns)
  groupBy?: (keyof T)[];              // Columns to group by (optional, defaults to empty array)
  sortConfig?: SortConfig<T>[];       // Initial sorting (optional, defaults to empty array)
  filterConfig?: FilterConfig<T>[];   // Initial filters (optional, defaults to empty array)
}
```

**Note:** All properties of `ViewConfiguration` are optional. If you omit `viewConfig` entirely, the component uses sensible defaults with all columns visible.

#### `onUpdateData` (optional)

Callback for inline editing:

```typescript
onUpdateData?: (rowIndex: number, columnId: keyof T, value: any) => void
```

#### `rowSelection` (optional)

Row selection configuration:

```typescript
// New format (recommended)
interface RowSelectionConfig {
  enabled: boolean;
  mode: 'single' | 'multiple' | 'none';
  maxSelections?: number;
  onSelectionChange?: (selectedRows: any[]) => void;
}

// Usage
const rowSelection = {
  enabled: true,
  mode: 'multiple',
  onSelectionChange: (rows) => console.log('Selected:', rows)
};
```

## 🎯 Real-World Examples

### Dynamic Content Types with renderCell

The `renderCell` function enables the same column to display different content types based on row data:

```typescript
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

```typescript
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

### Configuring Sorting and Filtering via viewConfig

All table features are configured through `viewConfig`, not props:

```typescript
const viewConfig: ViewConfiguration<Product> = {
  id: 'products-view',
  name: 'Products',
  visibleColumns: ['name', 'price', 'category', 'inStock'],

  // Group by category
  groupBy: ['category'],

  // Sort by price descending, then name ascending
  sortConfig: [
    { key: 'price', direction: 'descending' },
    { key: 'name', direction: 'ascending' }
  ],

  // Filter to show only in-stock items over $100
  filterConfig: [
    { key: 'inStock', operator: 'equals', value: 'true' },
    { key: 'price', operator: 'gte', value: '100' }
  ]
};
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
const columns: Column<User>[] = [
  { header: 'Name', accessor: 'name' }  // Matches User['name']
];
```

### Pitfall 3: visibleColumns References Non-Existent Column

**❌ Wrong:**
```tsx
const allColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' }
];

const viewConfig = {
  visibleColumns: ['name', 'email', 'phone']  // 'phone' doesn't exist!
};
```

**✅ Correct:**
```tsx
const viewConfig: ViewConfiguration<User> = {
  id: 'default',
  name: 'Default',
  visibleColumns: ['name', 'email'],  // Only reference existing columns
  groupBy: [],
  sortConfig: [],
  filterConfig: []
};
```

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

## 🎨 Theming System

### Simple Theme Setup

```tsx
// Built-in themes
<ThemeProvider theme="light">    {/* Clean, professional light theme */}
<ThemeProvider theme="dark">     {/* Modern dark theme */}

// Custom theme object
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

## 🔧 Complete Feature Matrix

| Feature | How It Works | Status |
|---------|-------------|--------|
| **Dynamic Rendering** | Configure via `column.renderCell` | ✅ Complete |
| **Collection Data** | Configure via `column.collectionConfig` | ✅ Complete |
| **Advanced Filtering** | Configure via `viewConfig.filterConfig` | ✅ Complete |
| **Inline Editing** | Enable via `column.editable` + `onUpdateData` | ✅ Complete |
| **Multi-Column Sorting** | Configure via `viewConfig.sortConfig` | ✅ Complete |
| **Grouping** | Configure via `viewConfig.groupBy` | ✅ Complete |
| **Row Selection** | Configure via `rowSelection` prop | ✅ Complete |
| **Theming** | Configure via `ThemeProvider` | ✅ Complete |
| **Accessibility** | WCAG 2.1 AA compliant | ✅ Complete |
| **TypeScript** | Full type safety and IntelliSense | ✅ Complete |
| **Performance** | Optimized for 1000+ rows | ✅ Complete |

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

## 🔄 Server-Side Rendering (SSR) Support

**✅ Full SSR Compatibility** - Works seamlessly with Next.js, Remix, and other SSR frameworks (v1.0.11+)

### Next.js App Router

The component works out-of-the-box with Next.js 13+ App Router:

```tsx
// app/users/page.tsx
import { ReusableTable, ThemeProvider, Column } from '@shaun1705/advanced-reusable-table';

interface User {
  name: string;
  email: string;
}

export default function UsersPage() {
  const columns: Column<User>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' }
  ];

  const data: User[] = [
    { name: 'John Doe', email: 'john@example.com' }
  ];

  return (
    <ThemeProvider theme="light">
      <ReusableTable allColumns={columns} data={data} />
    </ThemeProvider>
  );
}
```

### Next.js Pages Router

Works with both SSR and SSG:

```tsx
// pages/users.tsx
import { ReusableTable, ThemeProvider, Column } from '@shaun1705/advanced-reusable-table';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchUsers(); // Your data fetching logic
  return { props: { data } };
};

export default function UsersPage({ data }) {
  const columns: Column<User>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' }
  ];

  return (
    <ThemeProvider theme="light">
      <ReusableTable allColumns={columns} data={data} />
    </ThemeProvider>
  );
}
```

### SSR Compatibility Notes

- **v1.0.11+**: Full SSR support with stable ID generation (no hydration mismatches)
- **v1.0.10 and earlier**: Required client-side only rendering (see workaround below)

#### Workaround for v1.0.10 and Earlier

If using v1.0.10 or earlier, use dynamic import with SSR disabled:

```tsx
import dynamic from 'next/dynamic';

const ReusableTable = dynamic(
  () => import('@shaun1705/advanced-reusable-table').then(mod => mod.ReusableTable),
  { ssr: false }
) as typeof import('@shaun1705/advanced-reusable-table').ReusableTable;
```

**Recommendation**: Upgrade to v1.0.11+ for full SSR support without workarounds.

## 🔄 Migration & Alternatives

**Why developers are switching to this table:**

| From Library | Advantages | Migration Effort |
|-------------|-----------|------------------|
| **react-table** | ✅ Dynamic rendering ✅ Collections ✅ Simpler API | 🟢 **Easy** - Similar patterns |
| **Ant Design Table** | ✅ Better TypeScript ✅ Lighter bundle ✅ Collection types | 🟡 **Medium** - Different API |
| **Material-UI DataGrid** | ✅ No license fees ✅ Better accessibility ✅ Simpler API | 🟡 **Medium** - Worth the switch |
| **AG Grid Community** | ✅ No restrictions ✅ Modern React patterns ✅ Dynamic content | 🟢 **Easy** - Feature parity |

**What makes this table special:**
- 🎯 **Unique Features** - Dynamic cell rendering and collection types not found elsewhere
- 🪶 **Lightweight** - 28KB total vs 200KB+ for comparable enterprise solutions
- ♿ **Accessibility First** - WCAG 2.1 AA compliance built-in, not an afterthought
- 🔧 **Modern React** - Hooks-first design with React 18/19 support
- 🎨 **Simple API** - Configure everything through 5 props, not dozens

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

## 🤝 Contributing & Support

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on development setup, testing, and PR guidelines.

**Need Help?**
- 📖 [Complete Documentation](./docs/) - Comprehensive guides and API reference
- 💬 [GitHub Issues](https://github.com/skars1705/advanced-reusable-table/issues) - Bug reports and feature requests
- 📚 [Interactive Examples](./examples/) - Live demos showcasing all features
- 📋 [Changelog](./CHANGELOG.md) - Release notes and migration guides

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
