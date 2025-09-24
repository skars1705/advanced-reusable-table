# Theming Guide

Complete guide to customizing the appearance of Advanced Reusable Table with CSS custom properties, design tokens, and theme integration.

## Overview

The table uses a comprehensive theming system built on CSS custom properties (CSS variables) that allows for:

- **Design System Integration** - Match your existing brand colors and typography
- **Dark/Light Mode Support** - Built-in theme switching capabilities
- **Component-Level Customization** - Override styles for specific components
- **Runtime Theme Changes** - Switch themes dynamically without page reload
- **Accessibility** - Maintain contrast ratios and readability

## ThemeProvider Setup

### Basic Usage

Wrap your application with `ThemeProvider` to enable theming. NEW in v1.0.6: Support for predefined string themes.

```tsx
import { ThemeProvider } from 'advanced-reusable-table';

function App() {
  return (
    <ThemeProvider theme="light"> {/* NEW: String theme support */}
      <YourAppContent />
    </ThemeProvider>
  );
}
```

**Available String Themes:**
- `"dark"` (default) - High-contrast dark theme for low-light environments
- `"light"` - Clean light theme for bright environments

### Custom Theme

Pass a theme object to customize colors, spacing, and typography:

```tsx
import { ThemeProvider, type TableTheme } from 'advanced-reusable-table';

const customTheme: TableTheme = {
  colors: {
    primary: '#6366f1',      // Indigo-500
    secondary: '#8b5cf6',    // Violet-500
    background: '#ffffff',   // White
    surface: '#f8fafc',      // Slate-50
    text: '#1f2937',         // Gray-800
    textMuted: '#6b7280',    // Gray-500
    border: '#e5e7eb',       // Gray-200
    accent: '#10b981',       // Emerald-500
    success: '#22c55e',      // Green-500
    warning: '#f59e0b',      // Amber-500
    error: '#ef4444'         // Red-500
  },
  spacing: {
    xs: '0.25rem',          // 4px
    sm: '0.5rem',           // 8px
    md: '1rem',             // 16px
    lg: '1.5rem',           // 24px
    xl: '2rem'              // 32px
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',        // 12px
      sm: '0.875rem',       // 14px
      md: '1rem',           // 16px
      lg: '1.125rem',       // 18px
      xl: '1.25rem'         // 20px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
};

<ThemeProvider theme={customTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

## CSS Custom Properties

The theme system generates CSS custom properties that you can use in your own styles:

### Color Variables

```css
/* Primary colors */
--table-color-primary: #6366f1;
--table-color-secondary: #8b5cf6;

/* Background colors */
--table-color-background: #ffffff;
--table-color-surface: #f8fafc;

/* Text colors */
--table-color-text: #1f2937;
--table-color-textMuted: #6b7280;

/* Semantic colors */
--table-color-border: #e5e7eb;
--table-color-accent: #10b981;
--table-color-success: #22c55e;
--table-color-warning: #f59e0b;
--table-color-error: #ef4444;
```

### Spacing Variables

```css
--table-spacing-xs: 0.25rem;
--table-spacing-sm: 0.5rem;
--table-spacing-md: 1rem;
--table-spacing-lg: 1.5rem;
--table-spacing-xl: 2rem;
```

### Typography Variables

```css
--table-font-family: Inter, system-ui, sans-serif;

/* Font sizes */
--table-font-size-xs: 0.75rem;
--table-font-size-sm: 0.875rem;
--table-font-size-md: 1rem;
--table-font-size-lg: 1.125rem;
--table-font-size-xl: 1.25rem;

/* Font weights */
--table-font-weight-normal: 400;
--table-font-weight-medium: 500;
--table-font-weight-semibold: 600;
--table-font-weight-bold: 700;
```

### Layout Variables

```css
--table-border-radius: 0.5rem;
--table-box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
```

## Built-in Themes (NEW in v1.0.6)

### Light Theme

Clean, professional appearance suitable for most applications:

```tsx
<ThemeProvider theme="light">
  <ReusableTable {...props} />
</ThemeProvider>
```

### Dark Theme (Default)

High-contrast dark theme for low-light environments:

```tsx
<ThemeProvider theme="dark">
  <ReusableTable {...props} />
</ThemeProvider>

// Or omit theme prop for default
<ThemeProvider>
  <ReusableTable {...props} />
</ThemeProvider>
```

### Theme Types

The `ThemeProvider` now accepts both string themes and custom theme objects:

```typescript
type ThemeConfig = 'light' | 'dark' | Partial<TableTheme>;

// String themes
<ThemeProvider theme="light" />
<ThemeProvider theme="dark" />

// Custom theme objects (unchanged)
<ThemeProvider theme={customThemeObject} />

// Mixed approach - extend predefined themes
<ThemeProvider theme={{
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#custom-color'
  }
}} />
```

## Theme Examples

### Corporate Theme

Professional appearance for enterprise applications:

```tsx
const corporateTheme: TableTheme = {
  colors: {
    primary: '#1f3a8a',      // Navy blue
    secondary: '#1e40af',    // Blue-800
    background: '#ffffff',
    surface: '#f1f5f9',      // Slate-100
    text: '#0f172a',         // Slate-900
    textMuted: '#475569',    // Slate-600
    border: '#cbd5e1',       // Slate-300
    accent: '#059669',       // Emerald-600
    success: '#16a34a',      // Green-600
    warning: '#ca8a04',      // Yellow-600
    error: '#dc2626'         // Red-600
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '0.9375rem',      // Slightly smaller for density
      lg: '1.0625rem',
      xl: '1.1875rem'
    },
    fontWeight: {
      normal: '400',
      medium: '600',         // More emphasis
      semibold: '700',
      bold: '800'
    }
  },
  borderRadius: '0.25rem',   // Sharper corners
  boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.1)'
};
```

### Modern/Startup Theme

Vibrant colors and rounded corners for modern applications:

```tsx
const modernTheme: TableTheme = {
  colors: {
    primary: '#8b5cf6',      // Violet-500
    secondary: '#a78bfa',    // Violet-400
    background: '#fefefe',
    surface: '#fafafa',
    text: '#18181b',         // Zinc-900
    textMuted: '#71717a',    // Zinc-500
    border: '#e4e4e7',       // Zinc-200
    accent: '#06b6d4',       // Cyan-500
    success: '#10b981',      // Emerald-500
    warning: '#f59e0b',      // Amber-500
    error: '#f43f5e'         // Rose-500
  },
  spacing: {
    xs: '0.375rem',         // Slightly larger
    sm: '0.625rem',
    md: '1.125rem',
    lg: '1.75rem',
    xl: '2.25rem'
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  borderRadius: '0.75rem',   // More rounded
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
};
```

### Minimal Theme

Clean, minimal design with subtle colors:

```tsx
const minimalTheme: TableTheme = {
  colors: {
    primary: '#374151',      // Gray-700
    secondary: '#4b5563',    // Gray-600
    background: '#ffffff',
    surface: '#fefefe',
    text: '#111827',         // Gray-900
    textMuted: '#6b7280',    // Gray-500
    border: '#f3f4f6',       // Gray-100
    accent: '#374151',       // Gray-700
    success: '#065f46',      // Emerald-800
    warning: '#92400e',      // Amber-800
    error: '#991b1b'         // Red-800
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.8125rem',      // Slightly smaller
      md: '0.9375rem',
      lg: '1.0625rem',
      xl: '1.1875rem'
    }
  },
  borderRadius: '0.125rem',  // Minimal rounding
  boxShadow: 'none'          // No shadows
};
```

## Dark Mode Implementation

### Automatic Dark Mode

The theme system can automatically detect and respond to system preferences:

```tsx
// Automatically switches based on system preference
<ThemeProvider theme="auto">
  <ReusableTable {...props} />
</ThemeProvider>
```

### Manual Dark Mode Toggle

Implement a theme switcher component using the new string theme support:

```tsx
import { useState } from 'react';
import { ThemeProvider } from 'advanced-reusable-table';

function App() {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <ThemeProvider theme={isDark ? 'dark' : 'light'}> {/* NEW: String themes */}
      <button onClick={() => setIsDark(!isDark)}>
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

**Advanced Theme Toggle** - Combine string themes with custom overrides:

```tsx
import { useState } from 'react';
import { ThemeProvider, type ThemeConfig } from 'advanced-reusable-table';

function App() {
  const [isDark, setIsDark] = useState(false);
  
  // Combine predefined themes with custom branding
  const theme: ThemeConfig = isDark ? 'dark' : {
    // Extend light theme with custom branding
    colors: {
      primary: '#your-brand-color',
      secondary: '#your-secondary-color'
      // Other colors use light theme defaults
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

### Dark Theme Colors

Recommended dark theme color palette:

```tsx
const darkTheme: TableTheme = {
  colors: {
    primary: '#818cf8',      // Indigo-400
    secondary: '#a78bfa',    // Violet-400
    background: '#0f172a',   // Slate-900
    surface: '#1e293b',      // Slate-800
    text: '#f1f5f9',         // Slate-100
    textMuted: '#94a3b8',    // Slate-400
    border: '#334155',       // Slate-700
    accent: '#34d399',       // Emerald-400
    success: '#4ade80',      // Green-400
    warning: '#fbbf24',      // Amber-400
    error: '#f87171'         // Red-400
  }
};
```

## Component-Specific Theming

### Table Container

```css
.reusable-table {
  background: var(--table-color-background);
  border: 1px solid var(--table-color-border);
  border-radius: var(--table-border-radius);
  box-shadow: var(--table-box-shadow);
}
```

### Header Styling

```css
.table-header {
  background: var(--table-color-surface);
  color: var(--table-color-text);
  font-weight: var(--table-font-weight-semibold);
  font-size: var(--table-font-size-sm);
  padding: var(--table-spacing-md);
  border-bottom: 1px solid var(--table-color-border);
}
```

### Cell Styling

```css
.table-cell {
  padding: var(--table-spacing-sm) var(--table-spacing-md);
  color: var(--table-color-text);
  font-size: var(--table-font-size-sm);
  border-bottom: 1px solid var(--table-color-border);
}

.table-cell--muted {
  color: var(--table-color-textMuted);
}
```

### Collection Components

```css
.chip {
  background: var(--table-color-primary);
  color: white;
  border-radius: calc(var(--table-border-radius) / 2);
  padding: calc(var(--table-spacing-xs) / 2) var(--table-spacing-xs);
  font-size: var(--table-font-size-xs);
  font-weight: var(--table-font-weight-medium);
}

.collection-input {
  border: 1px solid var(--table-color-border);
  border-radius: var(--table-border-radius);
  background: var(--table-color-background);
}
```

## Custom CSS Integration

### Override Specific Components

```css
/* Custom table header styling */
.my-custom-table .table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Custom chip styling */
.my-custom-table .chip {
  background: var(--table-color-accent);
  border: 1px solid currentColor;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.my-custom-table .chip:hover {
  opacity: 1;
}
```

### CSS-in-JS Integration

Works with styled-components, emotion, and other CSS-in-JS libraries:

```tsx
import styled from 'styled-components';

const StyledTableContainer = styled.div`
  .reusable-table {
    --table-color-primary: ${props => props.theme.colors.primary};
    --table-color-secondary: ${props => props.theme.colors.secondary};
    --table-border-radius: ${props => props.theme.borderRadius};
    
    border: 2px solid var(--table-color-primary);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .table-header {
    background: linear-gradient(
      135deg, 
      var(--table-color-primary), 
      var(--table-color-secondary)
    );
    color: white;
  }
`;
```

## Design System Integration

### Tailwind CSS

Use Tailwind classes with CSS custom properties:

```tsx
const tailwindTheme: TableTheme = {
  colors: {
    primary: 'rgb(var(--color-primary) / <alpha-value>)',
    secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
    background: 'rgb(var(--color-background) / <alpha-value>)',
    // Use your Tailwind color tokens
  }
};
```

### Material-UI Integration

Match Material-UI theme colors:

```tsx
import { useTheme } from '@mui/material/styles';

function ThemedTable() {
  const muiTheme = useTheme();
  
  const tableTheme: TableTheme = {
    colors: {
      primary: muiTheme.palette.primary.main,
      secondary: muiTheme.palette.secondary.main,
      background: muiTheme.palette.background.paper,
      surface: muiTheme.palette.background.default,
      text: muiTheme.palette.text.primary,
      textMuted: muiTheme.palette.text.secondary,
      border: muiTheme.palette.divider,
      accent: muiTheme.palette.info.main,
      success: muiTheme.palette.success.main,
      warning: muiTheme.palette.warning.main,
      error: muiTheme.palette.error.main
    },
    typography: {
      fontFamily: muiTheme.typography.fontFamily,
      fontSize: {
        xs: muiTheme.typography.caption.fontSize,
        sm: muiTheme.typography.body2.fontSize,
        md: muiTheme.typography.body1.fontSize,
        lg: muiTheme.typography.h6.fontSize,
        xl: muiTheme.typography.h5.fontSize
      }
    },
    borderRadius: `${muiTheme.shape.borderRadius}px`
  };
  
  return (
    <ThemeProvider theme={tableTheme}>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

### Chakra UI Integration

```tsx
import { useTheme } from '@chakra-ui/react';

function ChakraThemedTable() {
  const chakraTheme = useTheme();
  
  const tableTheme: TableTheme = {
    colors: {
      primary: chakraTheme.colors.blue[500],
      secondary: chakraTheme.colors.purple[500],
      background: chakraTheme.colors.white,
      surface: chakraTheme.colors.gray[50],
      text: chakraTheme.colors.gray[900],
      textMuted: chakraTheme.colors.gray[600],
      border: chakraTheme.colors.gray[200],
      accent: chakraTheme.colors.teal[500],
      success: chakraTheme.colors.green[500],
      warning: chakraTheme.colors.orange[500],
      error: chakraTheme.colors.red[500]
    },
    spacing: {
      xs: chakraTheme.space[1],
      sm: chakraTheme.space[2],
      md: chakraTheme.space[4],
      lg: chakraTheme.space[6],
      xl: chakraTheme.space[8]
    },
    borderRadius: chakraTheme.radii.md
  };
  
  return (
    <ThemeProvider theme={tableTheme}>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

## Accessibility Considerations

### Color Contrast

Ensure sufficient contrast ratios for accessibility:

```tsx
const accessibleTheme: TableTheme = {
  colors: {
    // WCAG AA compliant contrast ratios
    text: '#000000',         // 21:1 on white
    textMuted: '#595959',    // 7:1 on white
    background: '#ffffff',
    border: '#767676',       // 4.5:1 on white
    
    // High contrast accent colors
    primary: '#0F4C81',      // 7:1 on white
    success: '#0F5132',      // 7:1 on white
    error: '#842029',        // 7:1 on white
    warning: '#664D03'       // 7:1 on white
  }
};
```

### Focus Indicators

Ensure focus indicators are visible:

```css
.table-cell:focus,
.chip:focus,
.collection-input:focus {
  outline: 2px solid var(--table-color-primary);
  outline-offset: 2px;
}
```

## Performance Considerations

### CSS Custom Property Performance

CSS custom properties are performant and allow for runtime theme changes without style recalculation.

### Theme Provider Optimization

```tsx
// Memoize theme objects to prevent unnecessary re-renders
const memoizedTheme = useMemo(() => ({
  colors: {
    primary: brandColors.primary,
    // ... other colors
  }
}), [brandColors]);

<ThemeProvider theme={memoizedTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

## Best Practices

### Theme Organization

```typescript
// themes/corporate.ts
export const corporateTheme: TableTheme = {
  // Corporate theme definition
};

// themes/modern.ts
export const modernTheme: TableTheme = {
  // Modern theme definition
};

// themes/index.ts
export * from './corporate';
export * from './modern';
```

### Color Naming

Use semantic color names that describe purpose, not appearance:

```tsx
const theme = {
  colors: {
    primary: '#3b82f6',      // Good: semantic name
    secondary: '#8b5cf6',    // Good: semantic name
    blue500: '#3b82f6',      // Avoid: appearance-based
    purple400: '#a78bfa'     // Avoid: appearance-based
  }
};
```

### Responsive Theming

Consider responsive design in your themes:

```css
@media (max-width: 768px) {
  .reusable-table {
    --table-spacing-md: 0.75rem;
    --table-font-size-sm: 0.8125rem;
  }
}
```

### Documentation

Document your custom themes:

```tsx
/**
 * Corporate Theme
 * 
 * Professional appearance for enterprise applications
 * - Navy blue primary color for trust and stability
 * - Conservative typography choices
 * - High contrast ratios for accessibility
 * - Minimal border radius for formal appearance
 */
export const corporateTheme: TableTheme = {
  // Theme definition
};
```

## Troubleshooting

### Theme Not Applied

Ensure ThemeProvider wraps your table:

```tsx
// ❌ Incorrect
<ReusableTable {...props} />
<ThemeProvider theme={myTheme}>
  <OtherComponents />
</ThemeProvider>

// ✅ Correct
<ThemeProvider theme={myTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

### CSS Custom Properties Not Working

Check for CSS specificity issues:

```css
/* Increase specificity if needed */
.my-app .reusable-table {
  --table-color-primary: #custom-color;
}
```

### Theme Changes Not Reflecting

Ensure theme objects are properly memoized:

```tsx
// ❌ Incorrect - creates new object on every render
<ThemeProvider theme={{ colors: { primary: '#3b82f6' } }}>

// ✅ Correct - stable reference
const theme = { colors: { primary: '#3b82f6' } };
<ThemeProvider theme={theme}>
```

## Next Steps

- [Getting Started](../getting-started.md) - Set up your first themed table
- [Column Configuration](./columns.md) - Style different column types
- [Collection Data Types](./collections.md) - Theme collection components
- [Advanced Customization](../advanced/customization.md) - Deep customization techniques