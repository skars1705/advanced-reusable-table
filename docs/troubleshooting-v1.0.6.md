# Troubleshooting Guide: v1.0.6

This guide helps you resolve common issues and questions related to the new features introduced in v1.0.6.

## Quick Reference

**New in v1.0.6:**
- ✅ String theme support (`theme="light"` | `theme="dark"`)
- ✅ `filterType` property for custom filtering behavior
- ✅ Collection type aliases (`chips`, `tags`, `checkboxes`)
- ✅ Enhanced `CollectionDisplayMode` (`compact`, `full`)
- ✅ Improved `useTableSelection` with `maxSelections`

---

## Theme-Related Issues

### String Theme Not Working

**Issue:** Using `theme="light"` but table still shows default dark theme.

**Symptoms:**
```tsx
<ThemeProvider theme="light">
  <ReusableTable {...props} />
</ThemeProvider>
// Table still appears dark
```

**Solutions:**

1. **Check Import:** Ensure you're importing from the correct package:
   ```tsx
   // ✅ Correct
   import { ThemeProvider } from 'advanced-reusable-table';
   
   // ❌ Incorrect
   import { ThemeProvider } from '@emotion/react'; // Wrong package
   ```

2. **Verify Version:** Confirm you're using v1.0.6 or later:
   ```bash
   npm list advanced-reusable-table
   # Should show 1.0.6 or higher
   ```

3. **Check Component Wrapping:** Ensure ThemeProvider wraps the table:
   ```tsx
   // ❌ Incorrect - ThemeProvider doesn't wrap table
   <div>
     <ReusableTable {...props} />
     <ThemeProvider theme="light">
       <OtherComponent />
     </ThemeProvider>
   </div>
   
   // ✅ Correct
   <ThemeProvider theme="light">
     <ReusableTable {...props} />
   </ThemeProvider>
   ```

4. **TypeScript Issues:** If using TypeScript, ensure proper typing:
   ```tsx
   import type { ThemeConfig } from 'advanced-reusable-table';
   
   const theme: ThemeConfig = 'light'; // Explicit typing
   <ThemeProvider theme={theme}>
   ```

### Invalid Theme String

**Issue:** Using an unsupported theme string causes errors.

**Error Message:** `Warning: Unknown theme "custom-theme". Using default theme.`

**Solution:** Use only supported predefined themes:
```tsx
// ✅ Supported
<ThemeProvider theme="light" />
<ThemeProvider theme="dark" />

// ❌ Not supported
<ThemeProvider theme="blue" />
<ThemeProvider theme="custom" />

// ✅ For custom themes, use objects
<ThemeProvider theme={{ colors: { primary: 'blue' } }} />
```

### Theme Not Switching Dynamically

**Issue:** Theme changes in state but table appearance doesn't update.

**Symptoms:**
```tsx
const [theme, setTheme] = useState('light');
// Theme state changes but table doesn't update
```

**Solutions:**

1. **Check State Updates:** Ensure state is actually changing:
   ```tsx
   const [theme, setTheme] = useState<'light' | 'dark'>('light');
   
   console.log('Current theme:', theme); // Debug output
   
   const toggleTheme = () => {
     const newTheme = theme === 'light' ? 'dark' : 'light';
     console.log('Switching to:', newTheme); // Debug output
     setTheme(newTheme);
   };
   ```

2. **Object Reference Issues:** If using custom theme objects:
   ```tsx
   // ❌ Creates new object every render
   <ThemeProvider theme={{ colors: { primary: isDark ? 'white' : 'black' } }}>
   
   // ✅ Stable references
   const lightTheme = useMemo(() => ({ colors: { primary: 'black' } }), []);
   const darkTheme = useMemo(() => ({ colors: { primary: 'white' } }), []);
   <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
   ```

3. **CSS Caching Issues:** Clear browser cache or hard refresh:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

---

## Filter Type Issues

### filterType Not Working

**Issue:** Setting `filterType` property doesn't change filtering behavior.

**Symptoms:**
```tsx
{
  header: 'Status',
  accessor: 'status',
  dataType: 'string',
  filterType: 'select', // Not working
  filterable: true
}
```

**Solutions:**

1. **Version Check:** Ensure you're using v1.0.6+:
   ```bash
   npm list advanced-reusable-table
   ```

2. **Verify Column Configuration:** Check the complete column setup:
   ```tsx
   {
     header: 'Status',
     accessor: 'status',
     filterable: true,        // Must be true
     filterType: 'select',    // NEW: Filter override
     dataType: 'string'       // Display type
   }
   ```

3. **TypeScript Errors:** If TypeScript shows errors:
   ```tsx
   import type { Column } from 'advanced-reusable-table';
   
   const columns: Column<MyDataType>[] = [
     {
       header: 'Status',
       accessor: 'status',
       filterType: 'select' as const, // Explicit typing
       filterable: true
     }
   ];
   ```

### filterType and dataType Conflict

**Issue:** Confusion about when to use `filterType` vs `dataType`.

**Explanation:**
- `dataType` - Controls how data is **displayed** (formatting, cell appearance)
- `filterType` - Controls how data is **filtered** (filter UI, operators available)

**Examples:**
```tsx
// Display as formatted date, but allow text search
{
  header: 'Created Date',
  accessor: 'createdAt',
  dataType: 'date',        // Display: "Jan 15, 2023"
  filterType: 'text',      // Filter: text input with contains/equals
  filterable: true
}

// Display as number, but filter with dropdown
{
  header: 'Status Code',
  accessor: 'statusCode',
  dataType: 'number',      // Display: formatted number
  filterType: 'select',    // Filter: dropdown with predefined values
  filterable: true
}
```

### Invalid filterType Values

**Issue:** Using unsupported `filterType` values.

**Error:** Column filtering may not work or fall back to default behavior.

**Supported Values:**
- `'text'` - Text-based filtering (contains, equals, starts with, etc.)
- `'number'` - Numeric filtering (=, >, <, between, etc.)
- `'date'` - Date filtering with date pickers
- `'boolean'` - True/false filtering
- `'select'` - Dropdown selection
- `'collection'` - Multi-value filtering

**Solution:**
```tsx
// ❌ Invalid
{
  filterType: 'dropdown',  // Not supported
  filterType: 'multi',     // Not supported
  filterType: 'custom'     // Not supported
}

// ✅ Valid
{
  filterType: 'select',    // For dropdown
  filterType: 'collection' // For multi-value
}
```

---

## Collection Type Issues

### Collection Type Aliases Not Working

**Issue:** Using type aliases like `'chips'` or `'checkboxes'` doesn't work.

**Symptoms:**
```tsx
{
  collectionConfig: {
    type: 'chips', // Not working
    options: [...]
  }
}
```

**Solutions:**

1. **Version Check:** Collection aliases require v1.0.6+:
   ```bash
   npm list advanced-reusable-table
   ```

2. **Check Spelling:** Ensure correct alias spelling:
   ```tsx
   // ✅ Supported aliases
   type: 'checkboxes'  // → 'checkbox'
   type: 'chips'       // → 'chip' 
   type: 'tags'        // → 'tag'
   
   // ❌ Common misspellings
   type: 'checkbox'    // Use 'checkboxes' alias or 'checkbox' directly
   type: 'chip'        // Use 'chips' alias or 'chip' directly
   ```

3. **TypeScript Issues:** If TypeScript errors occur:
   ```tsx
   import type { CollectionType } from 'advanced-reusable-table';
   
   const collectionType: CollectionType = 'chips'; // Explicit typing
   ```

### New Collection Display Modes

**Issue:** `'compact'` or `'full'` display modes not working.

**Solution:** These are new modes in v1.0.6:
```tsx
{
  collectionConfig: {
    type: 'checkbox',
    viewDisplayMode: 'compact', // NEW: Minimized display
    // OR
    viewDisplayMode: 'full',    // NEW: Expanded display
    options: [...]
  }
}
```

**Migration from old `displayMode`:**
```tsx
// OLD (still works but deprecated)
{
  collectionConfig: {
    displayMode: 'chips'  // DEPRECATED
  }
}

// NEW (recommended)
{
  collectionConfig: {
    viewDisplayMode: 'inline'  // NEW: Equivalent to old 'chips'
  }
}
```

---

## Row Selection Issues

### maxSelections vs maxSelection

**Issue:** Using deprecated `maxSelection` property or confusion about the naming.

**Symptoms:**
```tsx
const selection = useTableSelection({
  data: users,
  mode: 'multiple',
  maxSelection: 5  // DEPRECATED
});
```

**Solutions:**

1. **Use New Property Name:**
   ```tsx
   // ✅ NEW: Use plural form
   const selection = useTableSelection({
     data: users,
     mode: 'multiple',
     maxSelections: 5  // Correct plural form
   });
   ```

2. **Backward Compatibility:** The old property still works but shows deprecation warning:
   ```tsx
   // ⚠️ DEPRECATED: Still works but update when possible
   maxSelection: 5   // Will show console warning
   
   // ✅ PREFERRED: New property name
   maxSelections: 5  // No warning
   ```

3. **TypeScript Migration:** Update your types:
   ```tsx
   interface SelectionConfig {
     maxSelections?: number;  // NEW
     // maxSelection?: number; // Remove deprecated
   }
   ```

### Enhanced Selection API Not Available

**Issue:** New selection methods like `selectedCount`, `isMaxSelectionReached` are undefined.

**Symptoms:**
```tsx
const selection = useTableSelection({...});
console.log(selection.selectedCount); // undefined
```

**Solutions:**

1. **Version Check:** Enhanced API requires v1.0.6+
2. **Return Type:** Ensure you're using the enhanced return type:
   ```tsx
   import type { TableSelectionReturn } from 'advanced-reusable-table';
   
   const selection: TableSelectionReturn<User> = useTableSelection({
     data: users,
     mode: 'multiple'
   });
   
   // Now available:
   console.log(selection.selectedCount);
   console.log(selection.isMaxSelectionReached);
   console.log(selection.canSelectMore);
   ```

### Row Selection Config Format

**Issue:** New simplified config format not working.

**Problem:**
```tsx
// Trying to use new simplified format
const rowSelectionConfig = {
  enabled: true,
  mode: 'multiple',
  maxSelections: 3
};
// But not sure how to apply it
```

**Solution:** The new format is for documentation clarity. Use with `useTableSelection`:
```tsx
// Method 1: Direct usage
const selection = useTableSelection({
  data: users,
  mode: 'multiple',
  maxSelections: 3
});

// Method 2: Config object pattern
const selectionConfig = {
  enabled: true,
  mode: 'multiple' as const,
  maxSelections: 3
};

const selection = useTableSelection({
  data: users,
  mode: selectionConfig.mode,
  maxSelections: selectionConfig.maxSelections
});
```

---

## TypeScript Issues

### Type Import Errors

**Issue:** New types like `ThemeConfig`, `PredefinedTheme` not found.

**Error:** `Module 'advanced-reusable-table' has no exported member 'ThemeConfig'`

**Solution:** Check imports and version:
```tsx
// ✅ Available in v1.0.6+
import type { 
  ThemeConfig,
  PredefinedTheme,
  RowSelectionConfig,
  CollectionDisplayMode
} from 'advanced-reusable-table';

// Version check
npm list advanced-reusable-table
```

### Generic Type Issues

**Issue:** TypeScript errors with enhanced selection types.

**Error:** `Type 'TableSelectionReturn<unknown>' is not assignable to type 'TableSelectionReturn<User>'`

**Solution:** Provide explicit generic types:
```tsx
interface User {
  id: string;
  name: string;
}

// ✅ Explicit generic typing
const selection = useTableSelection<User>({
  data: users,
  mode: 'multiple'
});

// ✅ With return type annotation
const selection: TableSelectionReturn<User> = useTableSelection({
  data: users,
  mode: 'multiple'
});
```

---

## Performance Issues

### Theme Switching Performance

**Issue:** Theme switching causes performance issues or layout shifts.

**Solutions:**

1. **Memoize Theme Objects:**
   ```tsx
   // ❌ Creates new object every render
   <ThemeProvider theme={{ colors: { primary: color } }}>
   
   // ✅ Memoized theme object
   const theme = useMemo(() => ({
     colors: { primary: color }
   }), [color]);
   <ThemeProvider theme={theme}>
   ```

2. **Use String Themes When Possible:**
   ```tsx
   // ✅ String themes are optimized
   <ThemeProvider theme={isDark ? 'dark' : 'light'}>
   ```

3. **Avoid Inline Theme Objects:**
   ```tsx
   // ❌ Poor performance
   <ThemeProvider theme={{ colors: { primary: '#blue' } }}>
   
   // ✅ Define outside render
   const customTheme = { colors: { primary: '#blue' } };
   <ThemeProvider theme={customTheme}>
   ```

### Selection Performance with Large Datasets

**Issue:** Row selection becomes slow with large datasets.

**Solutions:**

1. **Enable Batch Operations:**
   ```tsx
   const selection = useTableSelection({
     data: largeDataset,
     mode: 'multiple',
     enableBatch: true  // NEW: Optimize for large datasets
   });
   ```

2. **Use Selection Limits:**
   ```tsx
   const selection = useTableSelection({
     data: largeDataset,
     mode: 'multiple',
     maxSelections: 50,  // Prevent excessive selections
     onMaxSelectionReached: () => {
       toast.warn('Maximum selections reached');
     }
   });
   ```

---

## Browser Compatibility

### CSS Custom Properties Not Working

**Issue:** Themes not applying in older browsers.

**Affected Browsers:** Internet Explorer, older versions of Safari/Chrome

**Solutions:**

1. **Browser Support Check:** CSS custom properties require:
   - Chrome 49+
   - Firefox 31+
   - Safari 9.1+
   - Edge 16+

2. **Polyfill for Older Browsers:**
   ```bash
   npm install css-vars-ponyfill
   ```
   
   ```tsx
   import cssVars from 'css-vars-ponyfill';
   
   // Apply polyfill
   cssVars({
     include: 'style[data-table-theme]',
     onlyLegacy: true
   });
   ```

3. **Fallback Styles:** Provide fallback values:
   ```css
   .table-cell {
     color: #1f2937; /* Fallback */
     color: var(--table-color-text, #1f2937);
   }
   ```

---

## Development & Debugging

### Debug Theme Application

**Issue:** Unclear if theme is being applied correctly.

**Debug Steps:**

1. **Check CSS Custom Properties:** Open browser dev tools:
   ```css
   /* Look for these in :root or html */
   --table-color-primary: #6366f1;
   --table-color-background: #ffffff;
   ```

2. **Console Logging:**
   ```tsx
   const ThemeDebug = ({ children }) => {
     const theme = useTheme(); // Hook to access current theme
     console.log('Current theme:', theme);
     return children;
   };
   
   <ThemeProvider theme="light">
     <ThemeDebug>
       <ReusableTable {...props} />
     </ThemeDebug>
   </ThemeProvider>
   ```

3. **Component Inspector:** Check if ThemeProvider is in component tree:
   - React DevTools
   - Look for ThemeProvider in component hierarchy
   - Verify theme prop value

### Debug Selection Issues

**Issue:** Selection not behaving as expected.

**Debug Steps:**

1. **Log Selection State:**
   ```tsx
   const selection = useTableSelection({...});
   
   useEffect(() => {
     console.log('Selection state:', {
       selectedCount: selection.selectedCount,
       isMaxReached: selection.isMaxSelectionReached,
       canSelectMore: selection.canSelectMore,
       selectedData: selection.selectedData
     });
   }, [selection.selectedCount]);
   ```

2. **Test Selection Limits:**
   ```tsx
   const selection = useTableSelection({
     maxSelections: 3,
     onMaxSelectionReached: () => {
       console.log('Max selections reached!'); // Debug callback
     }
   });
   ```

### Debug Filter Type Issues

**Issue:** Custom `filterType` not working as expected.

**Debug Steps:**

1. **Verify Column Configuration:**
   ```tsx
   useEffect(() => {
     columns.forEach(col => {
       if (col.filterable) {
         console.log(`Column ${col.header}:`, {
           dataType: col.dataType,
           filterType: col.filterType,
           hasFilterType: 'filterType' in col
         });
       }
     });
   }, []);
   ```

2. **Check Filter Operators:** Inspect available operators in filter UI
3. **Test Different Filter Types:** Try different `filterType` values to isolate issues

---

## Getting Help

### Before Reporting Issues

1. **Version Check:**
   ```bash
   npm list advanced-reusable-table
   # Should be 1.0.6 or higher for new features
   ```

2. **Clear Cache:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

3. **Browser Hard Refresh:**
   - Clear browser cache
   - Disable browser extensions
   - Test in incognito/private mode

### Useful Debug Information

When reporting issues, include:

```tsx
// System info
console.log({
  packageVersion: require('advanced-reusable-table/package.json').version,
  react: require('react').version,
  browser: navigator.userAgent,
  theme: 'light|dark|custom',
  features: ['filterType', 'stringThemes', 'collectionAliases', 'enhancedSelection']
});
```

### Support Channels

- 📖 [Complete API Reference](./api/complete-api-reference.md)
- 📋 [Migration Guide v1.0.6](./migration-v1.0.6.md)
- 🐛 [Report Issues](https://github.com/yourorg/advanced-reusable-table/issues)
- 💬 [Join Discussions](https://github.com/yourorg/advanced-reusable-table/discussions)
- 📧 [Email Support](mailto:support@advanced-reusable-table.dev)

---

## Common Patterns & Best Practices

### Theme Management

```tsx
// ✅ Good: Centralized theme management
const useAppTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return { theme, toggleTheme };
};
```

### Filter Type Selection

```tsx
// ✅ Good: Clear separation of display vs filter behavior
const columns = [
  {
    header: 'Price',
    accessor: 'price',
    dataType: 'currency',     // Display as $1,234.56
    filterType: 'number',     // Filter with numeric operators
  },
  {
    header: 'Categories',
    accessor: 'categories', 
    dataType: 'collection',   // Display as chips
    filterType: 'collection', // Filter with multi-select
  }
];
```

### Selection Configuration

```tsx
// ✅ Good: Clear selection configuration
const useUserSelection = (users: User[]) => {
  return useTableSelection({
    data: users,
    mode: 'multiple',
    maxSelections: 10,
    enableBatch: users.length > 100,
    onSelectionChange: (selected) => {
      console.log(`Selected ${selected.length} users`);
    },
    onMaxSelectionReached: () => {
      toast.warn('Maximum of 10 users can be selected');
    }
  });
};
```

**Troubleshooting Complete!** 🎉 You should now be able to resolve most issues with v1.0.6 features.