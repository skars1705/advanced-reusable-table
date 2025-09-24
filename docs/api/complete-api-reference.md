# Complete API Reference

This comprehensive API reference documents all interfaces, types, and configuration options for the Advanced Reusable Table component.

## Table of Contents

- [Core Components](#core-components)
- [Main Interfaces](#main-interfaces)
- [Column Configuration](#column-configuration)
- [Data Types & Filtering](#data-types--filtering)
- [Collection System](#collection-system)
- [View Configuration](#view-configuration)
- [Theme System](#theme-system)
- [Cell Rendering](#cell-rendering)
- [Row Selection](#row-selection)
- [Hooks](#hooks)
- [Utility Functions](#utility-functions)

---

## Core Components

### ReusableTable\<T\>

The main table component that provides sorting, filtering, pagination, grouping, and inline editing.

```typescript
interface ReusableTableProps<T extends object> {
  allColumns: Column<T>[];
  data: T[];
  viewConfig: ViewConfiguration<T>;
  onUpdateData?: (rowIndex: number, columnId: keyof T, value: any) => void;
  rowSelection?: RowSelectionState<T> & {
    selectRow: (row: T) => void;
    selectAll: () => void;
    clearSelection: () => void;
  };
}
```

**Props:**
- `allColumns` - Array of column definitions
- `data` - Array of data objects to display
- `viewConfig` - View configuration defining visible columns, sorting, filtering, and grouping
- `onUpdateData?` - Callback for inline editing operations
- `rowSelection?` - Row selection configuration and handlers

**Example:**
```tsx
<ReusableTable
  allColumns={columns}
  data={userData}
  viewConfig={defaultView}
  onUpdateData={handleUpdate}
  rowSelection={{
    selectedRows: new Set(),
    isAllSelected: false,
    isIndeterminate: false,
    selectRow: handleSelectRow,
    selectAll: handleSelectAll,
    clearSelection: handleClearSelection
  }}
/>
```

### ThemeProvider

Provides theme context and CSS custom properties for styling. Now supports both predefined string themes and custom theme objects.

```typescript
interface ThemeProviderProps {
  theme?: ThemeConfig; // Accepts 'light' | 'dark' | Partial<TableTheme>
  children: React.ReactNode;
}

type ThemeConfig = PredefinedTheme | Partial<TableTheme>;
type PredefinedTheme = 'light' | 'dark';
```

**Examples:**

**Using predefined themes:**
```tsx
// Dark theme (default)
<ThemeProvider theme="dark">
  <ReusableTable {...props} />
</ThemeProvider>

// Light theme
<ThemeProvider theme="light">
  <ReusableTable {...props} />
</ThemeProvider>

// Default (no theme prop = dark)
<ThemeProvider>
  <ReusableTable {...props} />
</ThemeProvider>
```

**Using custom theme objects:**
```tsx
<ThemeProvider theme={{
  colors: {
    primary: '#3b82f6',
    background: '#1e293b'
  }
}}>
  <ReusableTable {...props} />
</ThemeProvider>
```

---

## Main Interfaces

### Column\<T\>

Complete column configuration interface with all supported options.

```typescript
interface Column<T> {
  // Basic Configuration
  header: string;                    // Display name for the column
  accessor: keyof T;                 // Property key from your data object
  
  // Behavior Options
  sortable?: boolean;                // Enable sorting (default: false)
  filterable?: boolean;              // Enable column filtering (default: false)
  editable?: boolean;                // Enable inline editing (default: false)
  groupable?: boolean;               // Allow grouping by this column (default: false)
  
  // Data Types
  dataType?: 'string' | 'number' | 'currency' | 'date' | 'datetime' | 'collection';
  
  // Filter Configuration (NEW in v1.0.6)
  filterType?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'collection';
  
  // Type-Specific Options
  currencyOptions?: CurrencyOptions; // Currency formatting options
  dateOptions?: DateOptions;         // Date formatting options
  collectionConfig?: CollectionConfig; // Collection behavior configuration
  
  // Display Options
  align?: 'left' | 'center' | 'right'; // Text alignment (auto by data type)
  cellType?: 'checkbox' | 'toggle';  // Special cell types
  
  // Custom Rendering
  cell?: (item: T) => React.ReactNode; // Simple custom cell renderer
  renderCell?: (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode; // Dynamic renderer
}
```

### CurrencyOptions

```typescript
interface CurrencyOptions {
  locale: string;   // e.g., 'en-US', 'en-GB', 'de-DE'
  currency: string; // e.g., 'USD', 'EUR', 'GBP'
}
```

**Supported Locales:**
- `en-US` - $1,234.56
- `en-GB` - £1,234.56  
- `de-DE` - 1.234,56 €
- `fr-FR` - 1 234,56 €
- `ja-JP` - ¥1,235
- `sv-SE` - 1 234,56 kr

### DateOptions

```typescript
interface DateOptions {
  locale: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}
```

**Date Style Examples:**
- `short` - 1/1/23
- `medium` - Jan 1, 2023
- `long` - January 1, 2023
- `full` - Sunday, January 1, 2023

---

## Data Types & Filtering

### Filter Type Configuration (NEW in v1.0.6)

The `filterType` property on columns allows you to customize how filtering is handled independently from the `dataType`. This provides more flexibility in filtering behavior.

**Filter Types:**
- `'text'` - Standard text filtering with contains, equals, etc.
- `'number'` - Numeric filtering with equals, greater than, less than, etc.
- `'date'` - Date-specific filtering with date pickers and ranges
- `'boolean'` - Simple true/false filtering
- `'select'` - Dropdown selection from predefined options
- `'collection'` - Multi-value filtering for array/collection data

**Examples:**

```typescript
// Override default filtering behavior
{
  header: 'Status Code',
  accessor: 'statusCode', 
  dataType: 'number',      // Display as number
  filterType: 'select',    // But filter as dropdown selection
  filterable: true
}

// Date column with text filtering  
{
  header: 'Created Date',
  accessor: 'createdDate',
  dataType: 'date',        // Display as formatted date
  filterType: 'text',      // But allow text-based filtering
  filterable: true
}

// Collection with boolean filtering
{
  header: 'Has Permissions', 
  accessor: 'permissions',
  dataType: 'collection',  // Display as chips
  filterType: 'boolean',   // But filter as has/doesn't have
  filterable: true
}
```

**Default Behavior:** When `filterType` is not specified, it defaults to match the `dataType`:
- `string` → `text`
- `number`/`currency` → `number` 
- `date`/`datetime` → `date`
- `collection` → `collection`

### Filter Operators by Data Type

#### String Filters
```typescript
type StringFilterOperator = 
  | 'contains' 
  | 'doesNotContain' 
  | 'equals' 
  | 'startsWith' 
  | 'endsWith' 
  | 'isEmpty';
```

#### Number Filters
```typescript
type NumberFilterOperator = 
  | 'eq'      // equals
  | 'neq'     // not equals
  | 'gt'      // greater than
  | 'lt'      // less than
  | 'gte'     // greater than or equal
  | 'lte'     // less than or equal
  | 'between' // range filter
  | 'isEmpty';
```

**Range Input Examples:**
- `20><50` or `20<>50` - between 20 and 50
- `>25` - greater than 25
- `<=100` - less than or equal to 100

#### Date Filters
```typescript
type DateFilterOperator = 
  | 'is' 
  | 'isNot' 
  | 'isBefore' 
  | 'isAfter' 
  | 'dateRange' 
  | 'isEmpty';
```

#### Collection Filters
```typescript
type CollectionFilterOperator = 
  | 'contains'     // has specific value
  | 'doesNotContain' // lacks specific value
  | 'containsAny'  // has at least one of specified values
  | 'containsAll'  // has all specified values
  | 'isEmpty';     // no selections
```

### FilterConfig\<T\>

```typescript
interface FilterConfig<T> {
  key: keyof T;
  value: string;
  operator: FilterOperator;
  secondValue?: string; // For range filters (between, dateRange)
}
```

---

## Collection System

### CollectionConfig Types

Base configuration interface:

```typescript
interface BaseCollectionConfig {
  type: CollectionType;
  options: CollectionOption[] | (() => CollectionOption[]);
  placeholder?: string;
  searchable?: boolean;
  maxHeight?: string;
  virtualized?: boolean;
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange?: (value: string | string[], item: any) => void;
  
  // Display Configuration
  inputMode?: 'traditional' | 'chips';
  viewDisplayMode?: 'inline' | 'dropdown' | 'traditional' | 'auto';
  inlineThreshold?: number;
  maxVisibleInline?: number;
}
```

### Collection Types and Aliases

**Collection Types:** (NEW in v1.0.6)
```typescript
type CollectionType = 'checkbox' | 'radio' | 'chip' | 'tag' | 'chips' | 'tags' | 'checkboxes';
```

**Type Aliases:** The following type aliases are supported for backward compatibility and convenience:
- `'checkboxes'` → `'checkbox'`
- `'chips'` → `'chip'`
- `'tags'` → `'tag'`

**Collection Display Modes:** (NEW in v1.0.6)
```typescript
type CollectionDisplayMode = 'input' | 'chips' | 'text' | 'compact' | 'full';
```

### Collection Option

```typescript
interface CollectionOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;        // For chip styling
  description?: string;  // Tooltip or help text
}
```

### Checkbox Collections

```typescript
interface CheckboxCollectionConfig extends BaseCollectionConfig {
  type: 'checkbox';
  maxSelections?: number;
  minSelections?: number;
  selectAllOption?: boolean;
}
```

**Example:**
```typescript
{
  type: 'checkbox',
  inputMode: 'chips',
  viewDisplayMode: 'inline',
  options: [
    { value: 'read', label: 'Read Access', color: '#22c55e' },
    { value: 'write', label: 'Write Access', color: '#f59e0b' },
    { value: 'admin', label: 'Admin Access', color: '#ef4444' }
  ],
  maxSelections: 5,
  searchable: true
}
```

### Radio Collections

```typescript
interface RadioCollectionConfig extends BaseCollectionConfig {
  type: 'radio';
  required?: boolean;
  clearable?: boolean;
}
```

**Example:**
```typescript
{
  type: 'radio',
  inputMode: 'chips',
  options: [
    { value: 'low', label: 'Low', color: '#22c55e' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ],
  required: true
}
```

### Chip Collections

```typescript
interface ChipCollectionConfig extends BaseCollectionConfig {
  type: 'chip';
  maxSelections?: number;
  chipVariant?: 'filled' | 'outlined' | 'soft';
  removable?: boolean;
}
```

### Tag Collections

```typescript
interface TagCollectionConfig extends BaseCollectionConfig {
  type: 'tag';
  allowCustomValues?: boolean;
  maxTags?: number;
  minLength?: number;
  maxLength?: number;
  duplicateAllowed?: boolean;
  caseSensitive?: boolean;
  separator?: string;
}
```

---

## View Configuration

### ViewConfiguration\<T\>

Defines the table's current state including visible columns, sorting, filtering, and grouping.

```typescript
interface ViewConfiguration<T> {
  id: string;
  name: string;
  visibleColumns: (keyof T)[];   // Columns to show and their order
  groupBy: (keyof T)[];          // Multi-level grouping
  sortConfig: SortConfig<T>[];   // Multi-column sorting
  filterConfig: FilterConfig<T>[]; // Active filters
}
```

### SortConfig\<T\>

```typescript
interface SortConfig<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}
```

**Multi-column sorting:**
```typescript
const viewConfig = {
  // ... other config
  sortConfig: [
    { key: 'department', direction: 'ascending' },
    { key: 'name', direction: 'ascending' }
  ]
};
```

---

## Theme System

### TableTheme

```typescript
interface TableTheme {
  colors: Partial<TableThemeColors>;
  spacing?: Partial<TableThemeSpacing>;
  typography?: Partial<TableThemeTypography>;
  borderRadius?: string;
  boxShadow?: string;
}
```

### TableThemeColors

```typescript
interface TableThemeColors {
  primary: string;      // Primary accent color
  secondary: string;    // Secondary accent color
  background: string;   // Main background
  surface: string;      // Card/panel background
  text: string;         // Primary text color
  textMuted: string;    // Secondary text color
  border: string;       // Border color
  accent: string;       // Highlight color
  success: string;      // Success state color
  warning: string;      // Warning state color
  error: string;        // Error state color
}
```

### CSS Custom Properties

The theme system uses CSS custom properties that can be overridden:

```css
:root {
  --table-color-primary: #6366f1;
  --table-color-secondary: #8b5cf6;
  --table-color-background: #111827;
  --table-color-surface: #1f2937;
  --table-color-text: #f3f4f6;
  --table-color-textMuted: #9ca3af;
  --table-color-border: #4b5563;
  --table-color-accent: #06b6d4;
  --table-color-success: #22c55e;
  --table-color-warning: #f59e0b;
  --table-color-error: #ef4444;
  --table-border-radius: 0.375rem;
}
```

---

## Cell Rendering

### Dynamic Cell Rendering

For columns that need different display based on data content:

```typescript
interface CellRenderContext<T> {
  value: any;
  row: T;
  rowIndex: number;
  column: Column<T>;
  isEditing: boolean;
}

interface CellRenderDecision {
  type: 'text' | 'collection' | 'checkbox' | 'toggle' | 'date' | 'datetime' | 'currency' | 'number' | 'custom';
  content?: React.ReactNode;
  props?: Record<string, any>;
  collectionConfig?: CollectionConfig;
  editable?: boolean;
}
```

**Example:**
```typescript
{
  header: 'Comments',
  accessor: 'comments',
  renderCell: (context) => {
    const { value, row } = context;
    
    if (Array.isArray(value)) {
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: value.map(item => ({ value: item, label: item }))
        }
      };
    }
    
    if (typeof value === 'string') {
      return { type: 'text', content: value };
    }
    
    return { type: 'text', content: 'No data' };
  }
}
```

### Cell Rendering Utilities

```typescript
// Resolve cell renderer with fallbacks
function resolveCellRenderer<T>(context: CellRenderContext<T>): CellRenderDecision | React.ReactNode

// Create conditional renderer based on rules
function createMixedContentRenderer<T>(rules: Array<{
  condition: (context: CellRenderContext<T>) => boolean;
  render: (context: CellRenderContext<T>) => CellRenderDecision;
}>): (context: CellRenderContext<T>) => CellRenderDecision

// Create editable renderer based on conditions
function createConditionalEditRenderer<T>(
  baseRenderer: (context: CellRenderContext<T>) => CellRenderDecision,
  editableCondition: (context: CellRenderContext<T>) => boolean
): (context: CellRenderContext<T>) => CellRenderDecision

// Auto-detect data type from value
function detectDataType(value: any): string

// Memoize expensive cell decisions
function memoizeCellDecision<T extends object>(
  renderer: (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode
): (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode
```

---

## Row Selection

### RowSelectionState\<T\>

```typescript
interface RowSelectionState<T> {
  selectedRows: Set<T>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// NEW: Enhanced row selection configuration (v1.0.6)
interface RowSelectionConfig {
  enabled: boolean;
  mode: SelectionMode;
  maxSelections?: number;
  onSelectionChange?: (selectedRows: any[]) => void;
}

// Extended with handlers for table props
type TableRowSelection<T> = RowSelectionState<T> & {
  selectRow: (row: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
};
```

### Selection Modes

```typescript
type SelectionMode = 'single' | 'multiple' | 'none';
```

---

## Hooks

### useTable\<T\>

Main table logic hook providing sorting, filtering, pagination, and grouping.

```typescript
interface UseTableProps<T> {
  data: T[];
  allColumns: Column<T>[];
  initialSort?: SortConfig<T>[];
  initialFilters?: FilterConfig<T>[];
  initialPageSize?: number;
  groupByKeys: (keyof T)[];
}

interface UseTableReturn<T> {
  paginatedItems: DisplayRow<T>[];
  originalItems: T[];
  handleSort: (key: keyof T, isMulti: boolean) => void;
  handleFilterChange: (key: keyof T, operator: FilterOperator, value: string, secondValue?: string, forceRemove?: boolean) => void;
  getSortDirection: (key: keyof T) => SortDirection | undefined;
  getSortOrder: (key: keyof T) => number | undefined;
  filters: FilterConfig<T>[];
  clearFilters: () => void;
  toggleGroup: (path: string) => void;
  collapsedGroups: Set<string>;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}
```

### useTableSelection\<T\>

Row selection management hook with enhanced features and backward compatibility.

```typescript
interface UseTableSelectionProps<T> {
  data: T[];
  mode: SelectionMode;
  initialSelection?: T[]; // Changed from Set<T> to T[]
  onSelectionChange?: (selectedRows: T[]) => void;
  enableBatch?: boolean; // Enable batch operations
  maxSelections?: number; // NEW: Maximum selections allowed
  maxSelection?: number; // DEPRECATED: Use maxSelections instead
  onMaxSelectionReached?: () => void; // NEW: Callback when limit reached
}

interface TableSelectionReturn<T> extends RowSelectionState<T> {
  selectRow: (row: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // NEW: Enhanced API methods (v1.0.6)
  selectedCount: number;
  selectedData: T[];
  isMaxSelectionReached: boolean;
  canSelectMore: boolean;
  
  // NEW: Batch operations
  selectRows: (rows: T[]) => void;
  deselectRows: (rows: T[]) => void;
  toggleRows: (rows: T[]) => void;
  
  // NEW: Utility methods
  isRowSelected: (row: T) => boolean;
  getSelectionSummary: () => {
    total: number;
    selected: number;
    percentage: number;
  };
}
```

**Migration Note:** The `maxSelection` property is deprecated in favor of `maxSelections` (plural) for consistency.

---

## Utility Functions

### Collection Utilities

```typescript
const CollectionUtils = {
  // Normalize value to proper type based on config
  normalizeValue<T extends CollectionConfig>(
    value: string | string[] | null | undefined, 
    config: T
  ): any;

  // Get resolved options from static array or dynamic function
  getResolvedOptions(config: CollectionConfig): CollectionOption[];

  // Validate collection value against configuration rules
  validateValue<T extends CollectionConfig>(
    value: any, 
    config: T, 
    options: CollectionOption[]
  ): CollectionValidationResult;

  // Format collection value for display
  formatDisplayValue(
    value: string | string[], 
    config: CollectionConfig, 
    options: CollectionOption[]
  ): string;

  // Generate unique ID for collection components
  generateId(prefix?: string): string;

  // Filter options based on search query
  filterOptions(options: CollectionOption[], searchQuery: string): CollectionOption[];

  // Smart mode detection for automatic display mode selection
  getSmartDisplayMode(
    optionCount: number, 
    selectedCount: number,
    config: CollectionConfig
  ): 'inline' | 'dropdown';

  // Get effective input mode with smart defaults
  getEffectiveInputMode(config: CollectionConfig): 'traditional' | 'chips';

  // Get effective view display mode with smart defaults
  getEffectiveViewDisplayMode(
    config: CollectionConfig,
    selectedValues: string | string[],
    options: CollectionOption[]
  ): 'inline' | 'dropdown' | 'traditional';

  // Get maximum visible chips for inline display
  getMaxVisibleChips(config: CollectionConfig): number;
};
```

### CSV Export

```typescript
function downloadCSV(
  data: any[],
  visibleColumns: Column<any>[],
  locale: string,
  filename?: string
): void
```

---

## Group Types

### GroupHeaderRow\<T\>

```typescript
interface GroupHeaderRow<T> {
  isGroupHeader: true;
  level: number;        // Indentation level
  path: string;         // Unique path for this group
  groupKey: keyof T;    // The accessor key for this group level
  groupValue: any;      // The value of the group
  count: number;        // Number of items in this group
}
```

### DisplayRow\<T\>

```typescript
type DisplayRow<T> = T | GroupHeaderRow<T>;
```

---

## Validation

### CollectionValidationResult

```typescript
interface CollectionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
```

---

## Performance Notes

### Large Datasets
- Use server-side filtering and sorting for 1000+ rows
- Enable virtualization for large option lists (100+ options)
- Implement memoized cell renderers for expensive operations

### Memory Optimization
- Use `React.memo` for custom cell components
- Implement lazy loading for dynamic options
- Consider pagination for very large datasets

### Bundle Size
- Core table: ~15KB gzipped
- Collections: +8KB gzipped  
- DatePicker: +5KB gzipped
- All features: ~28KB gzipped
- Tree-shakeable imports supported

---

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **React**: 18.0+ or 19.0+ 
- **TypeScript**: 4.5+ (recommended but not required)
- **Node.js**: 16+ for development

---

## Accessibility Features

- **WCAG 2.1 AA Compliant**: Full keyboard navigation and screen reader support
- **Keyboard Navigation**: Tab, Arrow keys, Space, Enter, Escape
- **Screen Reader Support**: Proper ARIA labels, descriptions, and announcements
- **Focus Management**: Visible focus indicators and logical tab order
- **High Contrast**: Compatible with high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion settings

---

This completes the comprehensive API reference for the Advanced Reusable Table component. For usage examples and guides, see the other documentation files in this repository.