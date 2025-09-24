# Migration Guide: v1.0.6

This guide helps you migrate from earlier versions to v1.0.6, which introduces several new features and API enhancements while maintaining backward compatibility.

## Overview

v1.0.6 introduces:
- ✅ String theme support for `ThemeProvider`
- ✅ `filterType` property for enhanced filtering control
- ✅ Collection type aliases (`chips`, `tags`, `checkboxes`)
- ✅ Enhanced `CollectionDisplayMode` options (`compact`, `full`)
- ✅ Improved `RowSelectionConfig` format
- ✅ Enhanced `useTableSelection` API with `maxSelections` (plural)

**Breaking Changes:** None - all changes are backward compatible.

---

## 1. Enhanced ThemeProvider

### What's New
The `ThemeProvider` now accepts predefined theme strings for easier theme switching.

### Before (v1.0.5)
```tsx
import { ThemeProvider } from 'advanced-reusable-table';

// Only custom theme objects were supported
const customTheme = {
  colors: {
    primary: '#6366f1',
    background: '#111827'
  }
};

<ThemeProvider theme={customTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

### After (v1.0.6)
```tsx
import { ThemeProvider } from 'advanced-reusable-table';

// NEW: String theme support
<ThemeProvider theme="light">  {/* or "dark" */}
  <ReusableTable {...props} />
</ThemeProvider>

// OR: Continue using custom objects (unchanged)
<ThemeProvider theme={{
  colors: {
    primary: '#3b82f6',
    background: '#1e293b'
  }
}}>
  <ReusableTable {...props} />
</ThemeProvider>
```

### Migration Steps
1. **No action required** - existing custom theme objects continue to work
2. **Optional**: Replace custom light/dark themes with predefined strings:
   - Replace dark theme objects → `theme="dark"`
   - Replace light theme objects → `theme="light"`

---

## 2. Column filterType Property

### What's New
Columns now support a `filterType` property to customize filtering behavior independently from display type.

### Before (v1.0.5)
```tsx
// Filtering was tied to dataType
{
  header: 'Status Code',
  accessor: 'statusCode',
  dataType: 'number',  // Both display AND filtering were numeric
  filterable: true
}
```

### After (v1.0.6)
```tsx
// NEW: Separate display from filtering
{
  header: 'Status Code',
  accessor: 'statusCode', 
  dataType: 'number',      // Display as number
  filterType: 'select',    // But filter as dropdown selection
  filterable: true
}
```

### Migration Steps
1. **No action required** - existing columns work unchanged
2. **Optional**: Add `filterType` to customize filtering:
   - `filterType: 'text'` - Text-based filtering
   - `filterType: 'select'` - Dropdown selection
   - `filterType: 'boolean'` - True/false filtering
   - `filterType: 'date'` - Date range filtering
   - `filterType: 'number'` - Numeric comparison filtering
   - `filterType: 'collection'` - Multi-value filtering

### Common Use Cases
```tsx
// Date column with text filtering
{
  header: 'Created Date',
  accessor: 'createdDate',
  dataType: 'date',        // Display as formatted date
  filterType: 'text',      // Allow text search within dates
  filterable: true
}

// Collection with boolean filtering  
{
  header: 'Has Permissions',
  accessor: 'permissions',
  dataType: 'collection',  // Display as chips
  filterType: 'boolean',   // Simple has/doesn't have filter
  filterable: true
}
```

---

## 3. Collection Type Aliases

### What's New
Collection types now support convenient aliases for better readability.

### Before (v1.0.5)
```tsx
{
  header: 'Skills',
  accessor: 'skills',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkbox',  // Only canonical types supported
    // ...
  }
}
```

### After (v1.0.6)
```tsx
{
  header: 'Skills',
  accessor: 'skills',
  dataType: 'collection',
  collectionConfig: {
    type: 'checkboxes',  // NEW: Alias support
    // or 'chips' instead of 'chip'
    // or 'tags' instead of 'tag'
    // ...
  }
}
```

### Supported Aliases
- `'checkboxes'` → `'checkbox'`
- `'chips'` → `'chip'`
- `'tags'` → `'tag'`

### Migration Steps
1. **No action required** - existing types continue to work
2. **Optional**: Use aliases for better readability where preferred

---

## 4. Enhanced Collection Display Modes

### What's New
Collection display modes now include `'compact'` and `'full'` options.

### Before (v1.0.5)
```tsx
{
  collectionConfig: {
    type: 'checkbox',
    displayMode: 'chips'  // Limited options
  }
}
```

### After (v1.0.6)
```tsx
{
  collectionConfig: {
    type: 'checkbox',
    viewDisplayMode: 'compact',  // NEW: Enhanced display modes
    // Options: 'inline' | 'dropdown' | 'traditional' | 'auto' | 'compact' | 'full'
  }
}
```

### New Display Modes
- `'compact'` - Minimized display with condensed formatting
- `'full'` - Expanded display with full details and descriptions

### Migration Steps
1. **No action required** - existing `displayMode` continues to work
2. **Recommended**: Migrate to `viewDisplayMode` for new features:
   - `displayMode: 'chips'` → `viewDisplayMode: 'inline'`
   - `displayMode: 'text'` → `viewDisplayMode: 'traditional'`

---

## 5. Enhanced Row Selection Configuration

### What's New
Row selection now supports a simplified configuration format with enhanced features.

### Before (v1.0.5)
```tsx
const selection = useTableSelection({
  data: users,
  mode: 'multiple',
  // Limited configuration options
});
```

### After (v1.0.6)
```tsx
// NEW: Enhanced configuration options
const selection = useTableSelection({
  data: users,
  mode: 'multiple',
  maxSelections: 5,        // NEW: Selection limits
  onMaxSelectionReached: () => {
    alert('Maximum selections reached!');
  },
  enableBatch: true,       // NEW: Batch operations
  onSelectionChange: (selected) => {
    console.log('Selected:', selected);
  }
});

// NEW: Simplified config format for basic usage
const rowSelectionConfig = {
  enabled: true,
  mode: 'multiple',
  maxSelections: 3
};
```

### New Features Available
```tsx
// Enhanced API methods
console.log(selection.selectedCount);      // NEW: Count
console.log(selection.isMaxSelectionReached); // NEW: Limit check
console.log(selection.canSelectMore);      // NEW: Availability check

// NEW: Batch operations
selection.selectRows([user1, user2, user3]);
selection.deselectRows([user1]);
selection.toggleRows([user2, user3]);

// NEW: Utility methods  
const summary = selection.getSelectionSummary();
// { total: 100, selected: 5, percentage: 5 }
```

### Migration Steps
1. **No action required** - existing selection usage continues to work
2. **Optional**: Add new features like `maxSelections`, batch operations
3. **Note**: `maxSelection` (singular) is deprecated, use `maxSelections` (plural)

---

## 6. useTableSelection API Changes

### What's New
The `useTableSelection` hook now supports enhanced features and improved naming conventions.

### Before (v1.0.5)
```tsx
const selection = useTableSelection({
  data: users,
  mode: 'multiple',
  maxSelection: 3,  // Singular property name
});
```

### After (v1.0.6)
```tsx
const selection = useTableSelection({
  data: users,
  mode: 'multiple',
  maxSelections: 3,  // NEW: Plural property name (preferred)
  maxSelection: 3,   // DEPRECATED: Still works for backward compatibility
});
```

### Migration Steps
1. **No action required** - existing code continues to work
2. **Recommended**: Update `maxSelection` → `maxSelections` when convenient
3. **Note**: Both work in v1.0.6, but `maxSelection` will be removed in v2.0

### Find and Replace Pattern
```bash
# Find instances of the deprecated property
grep -r "maxSelection:" src/

# Replace with new property name
sed -i 's/maxSelection:/maxSelections:/g' src/**/*.tsx
```

---

## 7. TypeScript Updates

### What's New
Enhanced TypeScript interfaces provide better type safety for new features.

### New Types Available
```tsx
import type { 
  ThemeConfig,           // NEW: String | object themes
  PredefinedTheme,       // NEW: 'light' | 'dark'
  RowSelectionConfig,    // NEW: Enhanced selection config
  CollectionDisplayMode  // NEW: Enhanced display modes
} from 'advanced-reusable-table';

// NEW: Theme configuration typing
const themeConfig: ThemeConfig = 'light'; // or custom object

// NEW: Row selection configuration typing
const selectionConfig: RowSelectionConfig = {
  enabled: true,
  mode: 'multiple',
  maxSelections: 5
};
```

### Migration Steps
1. **No action required** - existing types continue to work
2. **Optional**: Import and use new types for better type safety
3. **Benefit**: Enhanced IntelliSense and compile-time error checking

---

## Testing Migration

### Automated Testing
```bash
# Run tests to ensure compatibility
npm test

# Check TypeScript compilation
npm run typecheck

# Build to verify no breaking changes
npm run build
```

### Manual Testing Checklist
- [ ] Existing tables render without errors
- [ ] Theme switching works (if using custom themes)
- [ ] Collection filtering continues to work
- [ ] Row selection behaves as expected
- [ ] No TypeScript compilation errors
- [ ] No console warnings about deprecated APIs

---

## Common Issues & Solutions

### Issue: TypeScript errors after upgrade
**Solution**: Update import statements to include new types if needed:
```tsx
import type { 
  Column, 
  ViewConfiguration,
  ThemeConfig  // Add if using new theme features
} from 'advanced-reusable-table';
```

### Issue: Custom theme not working with string format
**Solution**: Verify you're using the correct predefined theme names:
```tsx
// ✅ Correct
<ThemeProvider theme="light">
<ThemeProvider theme="dark">

// ❌ Incorrect  
<ThemeProvider theme="bright">  // Not a predefined theme
```

### Issue: Collection type aliases not recognized
**Solution**: Update collection configuration:
```tsx
// ✅ Use aliases
{ type: 'chips' }    // instead of 'chip'
{ type: 'tags' }     // instead of 'tag' 
{ type: 'checkboxes' } // instead of 'checkbox'
```

---

## Performance Optimizations

v1.0.6 includes several performance improvements:

- **Theme Application**: Faster CSS custom property updates
- **Selection Operations**: Optimized batch selection operations
- **Collection Rendering**: Improved display mode switching performance
- **Type Resolution**: Faster collection type alias resolution

---

## Next Steps

After migrating to v1.0.6:

1. **Explore New Features**: Try string themes and enhanced filtering
2. **Optimize Performance**: Use batch selection for large datasets
3. **Improve UX**: Leverage new display modes for better collection rendering
4. **Update Documentation**: Update your project docs to reflect new capabilities

---

## Support

If you encounter issues during migration:

- 📖 Check the [Complete API Reference](./api/complete-api-reference.md)
- 🐛 [Report Issues](https://github.com/yourorg/advanced-reusable-table/issues)
- 💬 [Join Discussions](https://github.com/yourorg/advanced-reusable-table/discussions)
- 📧 [Email Support](mailto:support@advanced-reusable-table.dev)

**Migration Complete!** 🎉 You're now ready to use all the new features in v1.0.6.