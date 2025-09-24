# Column Configuration

Complete guide to configuring table columns with all data types, sorting, and filtering options.

## Column Interface

```typescript
interface Column<T> {
  header: string;                    // Display name for the column
  accessor: keyof T;                 // Property key from your data object
  sortable?: boolean;                // Enable sorting
  filterable?: boolean;              // Enable column filtering
  dataType?: DataType;               // Type-specific behavior
  filterType?: FilterType;           // NEW v1.0.6: Override filtering behavior
  currencyOptions?: CurrencyOptions; // Currency formatting
  dateOptions?: DateOptions;         // Date formatting
  collectionConfig?: CollectionConfig; // Collection behavior
  cell?: (item: T) => React.ReactNode; // Custom cell renderer
  editable?: boolean;                // Enable inline editing
  cellType?: 'checkbox' | 'toggle';  // Special cell types
  groupable?: boolean;               // Allow grouping by this column
  align?: 'left' | 'center' | 'right'; // Text alignment
  renderCell?: (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode; // Dynamic rendering
}
```

## Filter Type Configuration (NEW in v1.0.6)

The `filterType` property allows you to customize filtering behavior independently from the display type (`dataType`). This gives you more flexibility in how users can filter your data.

### Available Filter Types

- `'text'` - Standard text filtering (contains, equals, starts with, etc.)
- `'number'` - Numeric filtering (equals, greater than, less than, etc.) 
- `'date'` - Date-specific filtering with date pickers and ranges
- `'boolean'` - Simple true/false filtering
- `'select'` - Dropdown selection from predefined options
- `'collection'` - Multi-value filtering for array/collection data

### Usage Examples

**Override default filtering behavior:**
```typescript
{
  header: 'Status Code',
  accessor: 'statusCode',
  dataType: 'number',      // Display as formatted number
  filterType: 'select',    // But filter as dropdown selection
  filterable: true
}
```

**Date column with text search:**
```typescript
{
  header: 'Created Date',
  accessor: 'createdDate', 
  dataType: 'date',        // Display as formatted date
  filterType: 'text',      // But allow text-based search
  filterable: true
}
```

**Collection with boolean filtering:**
```typescript
{
  header: 'Has Skills',
  accessor: 'skills',
  dataType: 'collection',  // Display as chips
  filterType: 'boolean',   // But filter as has/doesn't have
  filterable: true
}
```

### Default Filter Types

When `filterType` is not specified, it automatically matches the `dataType`:

| Data Type | Default Filter Type |
|-----------|-------------------|
| `string` | `text` |
| `number`, `currency` | `number` |
| `date`, `datetime` | `date` |
| `collection` | `collection` |

## Data Types

### String Columns
Standard text data with type-aware filtering.

```typescript
{
  header: 'Name',
  accessor: 'name',
  dataType: 'string',
  sortable: true,
  filterable: true,
  align: 'left'
}
```

**Available Filters:**
- Contains
- Does Not Contain
- Equals
- Starts With
- Ends With
- Is Empty

### Number Columns
Numeric data with mathematical operators.

```typescript
{
  header: 'Age',
  accessor: 'age',
  dataType: 'number',
  sortable: true,
  filterable: true,
  align: 'right'
}
```

**Available Filters:**
- Equals (=)
- Not Equals (!=)
- Greater Than (>)
- Less Than (<)
- Greater Than or Equal (>=)
- Less Than or Equal (<=)
- Between
- Is Empty

**Range Input Examples:**
```
20><50    (between 20 and 50)
>25       (greater than 25)
<=100     (less than or equal to 100)
```

### Currency Columns
Formatted monetary values with locale support.

```typescript
{
  header: 'Salary',
  accessor: 'salary',
  dataType: 'currency',
  currencyOptions: {
    locale: 'en-US',
    currency: 'USD'
  },
  sortable: true,
  filterable: true,
  align: 'right'
}
```

**Supported Locales:**
- `en-US` - $1,234.56
- `en-GB` - £1,234.56
- `de-DE` - 1.234,56 €
- `fr-FR` - 1 234,56 €
- `ja-JP` - ¥1,235
- `sv-SE` - 1 234,56 kr

### Date Columns
Date handling with internationalization and custom formatting.

```typescript
{
  header: 'Join Date',
  accessor: 'joinDate',
  dataType: 'date',
  dateOptions: {
    locale: 'en-US',
    dateStyle: 'medium'
  },
  sortable: true,
  filterable: true
}
```

**Date Style Options:**
- `short` - 1/1/23
- `medium` - Jan 1, 2023
- `long` - January 1, 2023
- `full` - Sunday, January 1, 2023

**Available Filters:**
- Is (exact date)
- Is Not
- Is Before
- Is After
- Date Range
- Is Empty

### DateTime Columns
Combined date and time with timezone support.

```typescript
{
  header: 'Last Login',
  accessor: 'lastLogin',
  dataType: 'datetime',
  dateOptions: {
    locale: 'en-US',
    dateStyle: 'short',
    timeStyle: 'medium'
  },
  sortable: true,
  filterable: true
}
```

### Collection Columns
Multiple values with sophisticated UI controls. See [Collection Data Types](./collections.md) for complete documentation.

```typescript
{
  header: 'Skills',
  accessor: 'skills',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkbox',
    inputMode: 'chips',
    viewDisplayMode: 'inline',
    options: skillOptions
  }
}
```

## Advanced Configuration

### Custom Cell Rendering

For simple custom display without changing the data type:

```typescript
{
  header: 'Status',
  accessor: 'status',
  cell: (item) => (
    <span className={`status-badge status-${item.status.toLowerCase()}`}>
      {item.status}
    </span>
  )
}
```

### Inline Editing

Enable inline editing for specific columns:

```typescript
{
  header: 'Name',
  accessor: 'name',
  editable: true,
  onUpdateData: (rowIndex, columnId, value) => {
    // Handle the update
    console.log(`Update row ${rowIndex}, column ${columnId} to ${value}`);
  }
}
```

### Special Cell Types

#### Checkbox Cells
```typescript
{
  header: 'Active',
  accessor: 'isActive',
  cellType: 'checkbox',
  editable: true
}
```

#### Toggle Switch Cells
```typescript
{
  header: 'Notifications',
  accessor: 'notifications',
  cellType: 'toggle',
  editable: true
}
```

### Column Alignment

Control text alignment within cells:

```typescript
// Left aligned (default for text)
{ header: 'Name', accessor: 'name', align: 'left' }

// Center aligned
{ header: 'Status', accessor: 'status', align: 'center' }

// Right aligned (default for numbers)
{ header: 'Amount', accessor: 'amount', align: 'right' }
```

### Groupable Columns

Allow users to group rows by column values:

```typescript
{
  header: 'Department',
  accessor: 'department',
  groupable: true,
  sortable: true
}
```

## Dynamic Column Rendering

For columns that need different display based on data content, use `renderCell`. See [Dynamic Rendering](./dynamic-rendering.md) for complete guide.

```typescript
{
  header: 'Comments',
  accessor: 'comments',
  renderCell: (context) => {
    const { value, row, isEditing } = context;
    
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

## Column Sorting

### Basic Sorting

```typescript
{
  header: 'Name',
  accessor: 'name',
  sortable: true
}
```

### Multi-Column Sorting

Users can sort by multiple columns by holding Shift while clicking headers. The sort order is indicated by numbers.

### Default Sort Configuration

Set default sorting in your view configuration:

```typescript
const viewConfig = {
  // ... other config
  sortConfig: [
    { key: 'name', direction: 'ascending' },
    { key: 'joinDate', direction: 'descending' }
  ]
};
```

## Column Filtering

### Enable Filtering

```typescript
{
  header: 'Email',
  accessor: 'email',
  filterable: true,
  dataType: 'string' // Determines available filter operators
}
```

### Filter Operators by Data Type

Each data type has specific filter operators:

| Data Type | Available Operators |
|-----------|-------------------|
| `string` | contains, equals, startsWith, endsWith, isEmpty |
| `number` | =, !=, >, <, >=, <=, between, isEmpty |
| `date` | is, isNot, isBefore, isAfter, dateRange, isEmpty |
| `collection` | contains, containsAny, containsAll, isEmpty |

### Advanced Filtering

Users can build complex filters using the filter interface. Filters are applied in AND logic (all must match).

## Real-World Examples

### User Management Table

```typescript
const userColumns: Column<User>[] = [
  {
    header: 'Name',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    editable: true
  },
  {
    header: 'Email',
    accessor: 'email',
    dataType: 'string',
    filterable: true
  },
  {
    header: 'Role',
    accessor: 'role',
    dataType: 'string',
    filterType: 'select',  // NEW: Use select filtering for predefined roles
    filterable: true,
    groupable: true,
    cell: (user) => (
      <span className={`role-badge role-${user.role.toLowerCase()}`}>
        {user.role}
      </span>
    )
  },
  {
    header: 'Salary',
    accessor: 'salary',
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
    sortable: true,
    filterable: true,
    align: 'right'
  },
  {
    header: 'Join Date',
    accessor: 'joinDate',
    dataType: 'date',
    dateOptions: { locale: 'en-US', dateStyle: 'medium' },
    sortable: true,
    filterable: true
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
        { value: 'nodejs', label: 'Node.js', color: '#339933' }
      ]
    }
  },
  {
    header: 'Active',
    accessor: 'isActive',
    cellType: 'toggle',
    editable: true,
    align: 'center'
  }
];
```

### E-commerce Product Table

```typescript
const productColumns: Column<Product>[] = [
  {
    header: 'Product',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    cell: (product) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{ width: '40px', height: '40px', borderRadius: '4px' }}
        />
        <span>{product.name}</span>
      </div>
    )
  },
  {
    header: 'Price',
    accessor: 'price',
    dataType: 'currency',
    currencyOptions: { locale: 'en-US', currency: 'USD' },
    sortable: true,
    filterable: true,
    align: 'right'
  },
  {
    header: 'Category',
    accessor: 'category',
    dataType: 'string',
    filterable: true,
    groupable: true
  },
  {
    header: 'Stock',
    accessor: 'stock',
    dataType: 'number',
    sortable: true,
    filterable: true,
    align: 'right',
    cell: (product) => (
      <span className={product.stock < 10 ? 'text-red-600' : 'text-green-600'}>
        {product.stock}
      </span>
    )
  },
  {
    header: 'Tags',
    accessor: 'tags',
    dataType: 'collection',
    collectionConfig: {
      type: 'chip',
      viewDisplayMode: 'inline',
      options: tagOptions
    }
  }
];
```

## Performance Considerations

### Large Datasets

For tables with 1000+ rows:
- Enable virtualization (handled automatically)
- Use memoized cell renderers
- Implement server-side filtering and sorting

### Memory Optimization

```typescript
// Memoize expensive cell renderers
const MemoizedCustomCell = React.memo(({ item }) => (
  <ExpensiveComponent data={item} />
));

{
  header: 'Complex Data',
  accessor: 'complexData',
  cell: (item) => <MemoizedCustomCell item={item} />
}
```

## Best Practices

### Column Naming
- Use clear, descriptive headers
- Keep headers concise (2-3 words max)
- Use title case: "User Name" not "user_name"

### Data Type Selection
- Always specify `dataType` for proper filtering
- Use `currency` for monetary values
- Use `collection` for arrays/multiple selections
- Use `date` or `datetime` for temporal data

### Alignment
- Left-align text content
- Right-align numbers and currencies
- Center-align icons and status indicators

### Performance
- Avoid complex calculations in `cell` functions
- Use `React.memo` for expensive custom renderers
- Implement server-side operations for large datasets

### Accessibility
- Provide meaningful `header` text
- Use semantic HTML in custom cell renderers
- Ensure sufficient color contrast in custom styling

## Next Steps

- [Collection Data Types](./collections.md) - Detailed collection configuration
- [Dynamic Rendering](./dynamic-rendering.md) - Same column, different content types
- [Theming](./theming.md) - Customize column appearance
- [Filtering & Sorting](../guides/filtering-sorting.md) - Advanced filtering techniques