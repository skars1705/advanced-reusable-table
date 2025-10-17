# TypeScript Type Inference Guide

This guide demonstrates the improved type inference for the ReusableTable component.

## Basic Column Definition (Recommended)

The simplest approach - TypeScript now infers accessor types automatically:

```typescript
import { Column } from 'advanced-reusable-table';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// ✅ NO type assertions needed - TypeScript infers everything!
const columns: Column<User>[] = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true, editable: true },
  { header: 'Email', accessor: 'email', sortable: true, filterable: true },
  { header: 'Age', accessor: 'age', dataType: 'number' }
];

// ❌ TypeScript catches typos at compile time:
// const badColumn: Column<User> = { header: 'Bad', accessor: 'nonexistent' }; // Error!
```

## Advanced: Const Assertions for Maximum Type Safety

For even stronger typing, use `as const`:

```typescript
const strictColumns = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true, editable: true },
  { header: 'Email', accessor: 'email', sortable: true }
] as const satisfies readonly Column<User>[];

// TypeScript now knows EXACTLY which columns exist
// This is useful for extracting accessor types
type UserColumnKeys = ExtractAccessors<User, typeof strictColumns>;
// Result: 'id' | 'name' | 'email'
```

## Type-Safe ViewConfiguration

The new `TypedViewConfiguration` helper ensures view configs only reference actual columns:

```typescript
import { TypedViewConfiguration, ExtractAccessors } from 'advanced-reusable-table';

const columns = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', groupable: true },
  { header: 'Email', accessor: 'email' }
] as const;

// ✅ Type-safe view configuration
const viewConfig: TypedViewConfiguration<User, typeof columns> = {
  id: 'default',
  name: 'Default View',
  visibleColumns: ['id', 'name', 'email'], // ✅ Autocomplete works!
  groupBy: ['name'], // ✅ Only columns from your array
  sortConfig: [{ key: 'id', direction: 'ascending' }]
};

// ❌ TypeScript prevents invalid references:
// const badView: TypedViewConfiguration<User, typeof columns> = {
//   visibleColumns: ['nonexistent'] // Error: not in column array!
// };
```

## Migration from Old Code

### Before (Required Type Assertions)

```typescript
// ❌ Old way - verbose and error-prone
const columns: Column<User>[] = [
  { header: 'ID', accessor: 'id' as keyof User },
  { header: 'Name', accessor: 'name' as keyof User }
];
```

### After (Automatic Inference)

```typescript
// ✅ New way - clean and automatic
const columns: Column<User>[] = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' }
];
```

## Helper Type Reference

### `ColumnAccessor<T, C>`
Extracts the accessor key from a single column type.

```typescript
type MyColumn = Column<User, 'name'>;
type Key = ColumnAccessor<User, MyColumn>; // Result: 'name'
```

### `ExtractAccessors<T, Cols>`
Creates a union of all accessor keys from a column array.

```typescript
const cols = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' }
] as const;

type Keys = ExtractAccessors<User, typeof cols>; // Result: 'id' | 'name'
```

### `ColumnArray<T>`
Type alias for readonly column arrays.

```typescript
const columns: ColumnArray<User> = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' }
] as const;
```

### `TypedViewConfiguration<T, Cols>`
Creates type-safe view configurations based on available columns.

```typescript
type MyViewConfig = TypedViewConfiguration<User, typeof columns>;
// Ensures visibleColumns, groupBy, etc. only reference actual column accessors
```

## Best Practices

1. **Use `Column<User>[]` for most cases** - TypeScript infers everything automatically
2. **Add `as const` for maximum type safety** - When you need compile-time guarantees
3. **Use `TypedViewConfiguration`** - For type-safe view configurations
4. **Let TypeScript infer** - Avoid manual type assertions unless necessary

## Benefits

- ✅ **Full IDE autocomplete** for accessor properties
- ✅ **Compile-time validation** catches typos before runtime
- ✅ **No type assertions needed** - cleaner, more maintainable code
- ✅ **Better refactoring support** - rename detection works correctly
- ✅ **Zero runtime overhead** - all improvements are compile-time only
