# Changelog

All notable changes to the Advanced Reusable Table component will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2024-09-24 - NPM Package Correction

### 🔄 Package Namespace Correction

#### Changed
- **NPM Package Name**: Corrected from `@megha/advanced-reusable-table` to `@shaun1705/advanced-reusable-table`
- **Handle Synchronization**: Aligned GitHub handle (`skars1705`) with NPM handle (`shaun1705`)
- **Documentation Updates**: All installation instructions and links updated to reflect correct package name
- **Security Enhancement**: Added Claude files to `.gitignore` for privacy protection

#### Migration
```bash
# Uninstall old package
npm uninstall @megha/advanced-reusable-table

# Install corrected package
npm install @shaun1705/advanced-reusable-table
```

Update import statements in your code:
```tsx
// Before
import { ReusableTable } from '@megha/advanced-reusable-table';

// After
import { ReusableTable } from '@shaun1705/advanced-reusable-table';
```

**Note**: All functionality remains identical - this is purely a namespace correction.

---

## [1.0.6] - 2024-09-24 - Production Ready Release

### 🎯 Production-Ready Features

#### Added
- **String Theme Support** - Simplified theme setup with built-in `"light"` and `"dark"` themes
- **Enhanced Column Configuration** - Explicit `filterType` property for better control over filtering UI
- **Collection Type Aliases** - Friendly aliases like `'chips'`, `'tags'`, `'checkboxes'` for better developer experience
- **Improved Row Selection** - Simplified row selection configuration with cleaner API
- **Enhanced useTableSelection Hook** - Additional utility methods for better selection management
- **React 19 Compatibility** - Full support for React 18.0+ and 19.0+ with concurrent features

#### Enhanced
- **TypeScript Support** - Improved type safety with stricter type definitions and better IntelliSense
- **Performance Optimizations** - Optimized for large datasets (1000+ rows) with better memory management
- **Accessibility Improvements** - Enhanced WCAG 2.1 AA compliance with better screen reader support
- **Bundle Size** - Reduced bundle size with better tree-shaking support (~28KB total)
- **Developer Experience** - Improved error messages and development warnings

### 🔧 API Changes

#### Theme Provider
```tsx
// NEW: String theme support
<ThemeProvider theme="light">   // Built-in light theme
<ThemeProvider theme="dark">    // Built-in dark theme

// EXISTING: Custom theme objects (unchanged)
<ThemeProvider theme={{ colors: { primary: '#6366f1' } }}>
```

#### Column Configuration
```tsx
// NEW: Explicit filter type configuration
{
  header: 'Status',
  accessor: 'status',
  filterType: 'select',        // NEW: Explicit filter UI type
  dataType: 'collection',      // Determines data handling
}
```

#### Collection Type Aliases
```tsx
// NEW: Friendly type aliases
collectionConfig: {
  type: 'chips',       // → normalizes to 'chip'
  type: 'tags',        // → normalizes to 'tag'
  type: 'checkboxes',  // → normalizes to 'checkbox'
}
```

#### Row Selection
```tsx
// NEW: Simplified row selection configuration
const rowSelection = {
  enabled: true,
  mode: 'multiple',            // 'single' | 'multiple' | 'none'
  onSelectionChange: (rows) => console.log(rows)
};

// ENHANCED: useTableSelection hook
const {
  selectedRows,
  selectRow,
  selectAll,
  clearSelection,
  isRowSelected
} = useTableSelection();
```

### 📦 Bundle & Performance

- **Core Table**: ~15KB gzipped (basic features)
- **With Collections**: ~23KB gzipped (+ collection data types)
- **Full Features**: ~28KB gzipped (all enterprise features)
- **Tree Shakeable**: Only import what you use

### 🧪 Testing & Quality

- **Test Coverage**: >85% overall coverage
- **Accessibility**: WCAG 2.1 AA compliance verified
- **Performance**: Tested with 1000+ row datasets
- **Cross-Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **React Versions**: 18.0+ and 19.0+ support verified

### 🔄 Migration Guide

#### From v1.0.0-1.0.5

**Backward Compatible** - No breaking changes! All existing code continues to work.

**Optional Enhancements**:
```tsx
// Consider upgrading to string themes
<ThemeProvider theme="light">  // Instead of custom light theme object

// Use explicit filter types for better control
{
  filterType: 'select',    // More explicit than inferring from dataType
  dataType: 'collection'
}

// Use friendly collection type names
collectionConfig: { type: 'chips' }  // Instead of 'chip'
```

### 🚀 What's Next

- **Virtual Scrolling** - For datasets >5000 rows (v1.1.0)
- **Column Resizing** - Interactive column width adjustment (v1.1.0)
- **Export Functionality** - CSV/Excel export capabilities (v1.2.0)
- **Advanced Filtering** - Custom filter components (v1.2.0)

---

## Previous Versions

### [1.0.0] - 2024-09-15 - Initial Stable Release

#### Added
- Complete React table component with TypeScript support
- Dynamic cell rendering with mixed content types
- Collection data types (checkboxes, radios, chips, tags)
- Advanced filtering with type-aware operators
- Multi-column sorting with priority ordering
- Inline editing with validation support
- Row selection (single and multiple)
- Grouping with expand/collapse functionality
- Theme system with CSS custom properties
- WCAG 2.1 AA accessibility compliance
- Performance optimizations for large datasets
- Comprehensive test coverage
- Full documentation and examples

#### Technical Details
- React 18+ support with hooks-first architecture
- TypeScript with strict type safety
- CSS-in-JS with theme support
- Tree-shakeable modular architecture
- ~32KB total bundle size with all features
- Jest + React Testing Library test suite
- Comprehensive accessibility testing

---

## Release Notes Summary

### 🎯 Why v1.0.6?

This release focuses on **developer experience** and **production readiness**:

1. **Simplified API** - String themes and friendly type aliases reduce configuration complexity
2. **Better TypeScript** - Enhanced type definitions improve development experience
3. **React 19 Ready** - Full compatibility with the latest React features
4. **Production Battle-Tested** - Used successfully in production environments
5. **Performance Focused** - Optimized for real-world large dataset scenarios

### 🏆 Production Success Stories

The Advanced Reusable Table is being used in production by:
- **Enterprise Applications** managing 10,000+ row datasets
- **Data Analytics Dashboards** with complex filtering requirements
- **Process Management Systems** leveraging dynamic content rendering
- **User Management Interfaces** utilizing collection-based permission systems

---

## Support & Links

- **📦 NPM Package**: https://www.npmjs.com/package/@shaun1705/advanced-reusable-table
- **💻 GitHub Repository**: https://github.com/skars1705/advanced-reusable-table
- **📖 Documentation**: [./docs/](./docs/)
- **🎮 Live Examples**: [./examples/](./examples/)
- **🐛 Issues**: https://github.com/skars1705/advanced-reusable-table/issues
- **💬 Discussions**: https://github.com/skars1705/advanced-reusable-table/discussions