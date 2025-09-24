# Theming & Customization Guide

Complete guide to customizing the appearance and behavior of the Advanced Reusable Table component.

## Table of Contents

- [Theme System Overview](#theme-system-overview)
- [CSS Custom Properties](#css-custom-properties)
- [ThemeProvider Usage](#themeprovider-usage)
- [Built-in Themes](#built-in-themes)
- [Custom Theme Creation](#custom-theme-creation)
- [Component-Level Customization](#component-level-customization)
- [Collection Styling](#collection-styling)
- [Responsive Design](#responsive-design)
- [Dark Mode Support](#dark-mode-support)
- [Design System Integration](#design-system-integration)
- [Advanced Customization](#advanced-customization)

---

## Theme System Overview

The Advanced Reusable Table uses a comprehensive theming system based on:

1. **CSS Custom Properties** - For runtime theme switching
2. **ThemeProvider** - React context for theme management
3. **TypeScript Interfaces** - Type-safe theme configuration
4. **Design Tokens** - Consistent spacing, colors, and typography

### Architecture

```
ThemeProvider
├── CSS Custom Properties (--table-*)
├── Theme Context
├── Default Theme Values
└── Runtime Theme Switching
```

---

## CSS Custom Properties

All styling is controlled through CSS custom properties with the `--table-` prefix:

### Color Variables

```css
:root {
  /* Primary Colors */
  --table-color-primary: #6366f1;        /* Primary accent color */
  --table-color-secondary: #8b5cf6;      /* Secondary accent color */
  
  /* Background Colors */
  --table-color-background: #111827;     /* Main background */
  --table-color-surface: #1f2937;        /* Card/panel background */
  
  /* Text Colors */
  --table-color-text: #f3f4f6;          /* Primary text */
  --table-color-textMuted: #9ca3af;     /* Secondary text */
  
  /* Interface Colors */
  --table-color-border: #4b5563;        /* Border color */
  --table-color-accent: #06b6d4;        /* Highlight color */
  
  /* Status Colors */
  --table-color-success: #22c55e;       /* Success state */
  --table-color-warning: #f59e0b;       /* Warning state */
  --table-color-error: #ef4444;         /* Error state */
}
```

### Layout Variables

```css
:root {
  /* Spacing */
  --table-spacing-xs: 0.25rem;
  --table-spacing-sm: 0.5rem;
  --table-spacing-md: 1rem;
  --table-spacing-lg: 1.5rem;
  --table-spacing-xl: 2rem;
  
  /* Border Radius */
  --table-border-radius: 0.375rem;
  
  /* Typography */
  --table-font-family: ui-sans-serif, system-ui, sans-serif;
  --table-font-size-xs: 0.75rem;
  --table-font-size-sm: 0.875rem;
  --table-font-size-md: 1rem;
  --table-font-size-lg: 1.125rem;
  
  /* Shadows */
  --table-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --table-box-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Direct CSS Override

```css
/* Override specific properties */
.my-custom-table {
  --table-color-primary: #059669;
  --table-color-background: #f0fdfa;
  --table-border-radius: 0.75rem;
}
```

```tsx
function CustomTable() {
  return (
    <div className="my-custom-table">
      <ThemeProvider>
        <ReusableTable {...props} />
      </ThemeProvider>
    </div>
  );
}
```

---

## ThemeProvider Usage

### Basic Usage

```tsx
import { ThemeProvider } from '@shaun1705/advanced-reusable-table';

function App() {
  return (
    <ThemeProvider>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

### With Custom Theme

```tsx
import { ThemeProvider, TableTheme } from '@shaun1705/advanced-reusable-table';

const customTheme: TableTheme = {
  colors: {
    primary: '#059669',
    secondary: '#0d9488',
    background: '#f0fdfa',
    surface: '#ffffff',
    text: '#134e4a',
    textMuted: '#6b7280',
    border: '#d1fae5'
  },
  borderRadius: '0.5rem'
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

### Dynamic Theme Switching

```tsx
function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<TableTheme>(lightTheme);
  
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === lightTheme ? darkTheme : lightTheme);
  };
  
  return (
    <div>
      <button onClick={toggleTheme}>
        Switch to {currentTheme === lightTheme ? 'Dark' : 'Light'} Theme
      </button>
      
      <ThemeProvider theme={currentTheme}>
        <ReusableTable {...props} />
      </ThemeProvider>
    </div>
  );
}
```

---

## Built-in Themes

### Light Theme

```tsx
const lightTheme: TableTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    accent: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: '0.375rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
};
```

### Dark Theme

```tsx
const darkTheme: TableTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: '#334155',
    accent: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  borderRadius: '0.5rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};
```

### Enterprise Theme

```tsx
const enterpriseTheme: TableTheme = {
  colors: {
    primary: '#1f2937',
    secondary: '#374151',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#d1d5db',
    accent: '#3b82f6',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626'
  },
  typography: {
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  borderRadius: '0.25rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
};
```

---

## Custom Theme Creation

### Complete Theme Interface

```tsx
interface TableTheme {
  colors: Partial<TableThemeColors>;
  spacing?: Partial<TableThemeSpacing>;
  typography?: Partial<TableThemeTypography>;
  borderRadius?: string;
  boxShadow?: string;
}

interface TableThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

interface TableThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface TableThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}
```

### Brand-Specific Theme

```tsx
const brandTheme: TableTheme = {
  colors: {
    primary: '#ff6b35',      // Brand orange
    secondary: '#004e89',     // Brand blue
    background: '#ffffff',
    surface: '#fafafa',
    text: '#2c3e50',
    textMuted: '#7f8c8d',
    border: '#ecf0f1',
    accent: '#3498db',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c'
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '2rem'
  },
  borderRadius: '0.5rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
};
```

### Material Design Theme

```tsx
const materialTheme: TableTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#212121',
    textMuted: '#757575',
    border: '#e0e0e0',
    accent: '#ff4081',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336'
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  borderRadius: '0.25rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
};
```

---

## Component-Level Customization

### Custom Cell Styling

```tsx
const styledColumns: Column<User>[] = [
  {
    header: 'Status',
    accessor: 'status',
    cell: (user) => (
      <span className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${user.status === 'active' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-gray-100 text-gray-800 border border-gray-200'
        }
      `}>
        <span className={`
          w-1.5 h-1.5 rounded-full mr-1.5
          ${user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}
        `} />
        {user.status}
      </span>
    )
  },
  {
    header: 'Priority',
    accessor: 'priority',
    cell: (user) => {
      const colors = {
        high: 'text-red-600 bg-red-50 border-red-200',
        medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        low: 'text-green-600 bg-green-50 border-green-200'
      };
      
      return (
        <span className={`
          inline-flex items-center px-2 py-1 rounded-md text-sm font-medium border
          ${colors[user.priority as keyof typeof colors]}
        `}>
          {user.priority}
        </span>
      );
    }
  }
];
```

### Custom Header Styling

```tsx
// Add custom CSS classes to the table
.custom-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.custom-header th {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}
```

### Custom Row Styling

```tsx
// Use CSS-in-JS or styled-components for row-level styling
const StyledTableWrapper = styled.div`
  .table-row {
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--table-color-surface);
      transform: translateY(-1px);
      box-shadow: var(--table-box-shadow);
    }
    
    &.row-selected {
      background-color: rgba(99, 102, 241, 0.1);
      border-left: 3px solid var(--table-color-primary);
    }
    
    &.row-error {
      background-color: rgba(239, 68, 68, 0.1);
      border-left: 3px solid var(--table-color-error);
    }
  }
`;
```

---

## Collection Styling

### Chip Customization

```css
/* Custom chip styles */
.collection-chip {
  --chip-bg: #f1f5f9;
  --chip-text: #334155;
  --chip-border: #cbd5e1;
  --chip-hover-bg: #e2e8f0;
  --chip-remove-hover: #ef4444;
}

.collection-chip--primary {
  --chip-bg: #dbeafe;
  --chip-text: #1e40af;
  --chip-border: #93c5fd;
}

.collection-chip--success {
  --chip-bg: #dcfce7;
  --chip-text: #166534;
  --chip-border: #86efac;
}

.collection-chip--warning {
  --chip-bg: #fef3c7;
  --chip-text: #92400e;
  --chip-border: #fde68a;
}
```

### Collection Input Styling

```tsx
const styledCollectionConfig = {
  type: 'checkbox' as const,
  inputMode: 'chips' as const,
  options: skillOptions,
  // Custom styling through CSS classes
  className: 'custom-collection-input',
  chipClassName: 'custom-chip',
  dropdownClassName: 'custom-dropdown'
};
```

```css
.custom-collection-input {
  border: 2px solid var(--table-color-primary);
  border-radius: 0.5rem;
  background: linear-gradient(to right, #f8fafc, #ffffff);
}

.custom-chip {
  background: var(--table-color-primary);
  color: white;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.custom-chip:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.custom-dropdown {
  border: 1px solid var(--table-color-border);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}
```

---

## Responsive Design

### Mobile-First Approach

```css
/* Base mobile styles */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .table-cell {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .table-header {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  /* Stack collection chips vertically on mobile */
  .collection-chips {
    flex-direction: column;
    gap: 0.25rem;
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .table-cell {
    padding: 0.75rem;
  }
}

/* Desktop styles */
@media (min-width: 1025px) {
  .table-cell {
    padding: 1rem;
  }
  
  .table-container {
    border-radius: var(--table-border-radius);
    box-shadow: var(--table-box-shadow);
  }
}
```

### Responsive Column Configuration

```tsx
function ResponsiveTable() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getVisibleColumns = (): (keyof User)[] => {
    if (windowWidth < 768) {
      return ['name', 'status']; // Mobile: essential columns only
    }
    if (windowWidth < 1024) {
      return ['name', 'email', 'status']; // Tablet: add email
    }
    return ['name', 'email', 'role', 'department', 'status']; // Desktop: all columns
  };
  
  const viewConfig = {
    ...baseViewConfig,
    visibleColumns: getVisibleColumns()
  };
  
  return <ReusableTable {...props} viewConfig={viewConfig} />;
}
```

---

## Dark Mode Support

### System Preference Detection

```tsx
function DarkModeTable() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <ReusableTable {...props} />
    </ThemeProvider>
  );
}
```

### CSS-Based Dark Mode

```css
/* Automatic dark mode using CSS */
@media (prefers-color-scheme: dark) {
  :root {
    --table-color-background: #0f172a;
    --table-color-surface: #1e293b;
    --table-color-text: #f1f5f9;
    --table-color-textMuted: #94a3b8;
    --table-color-border: #334155;
  }
}

/* Manual dark mode class */
.dark-mode {
  --table-color-background: #0f172a;
  --table-color-surface: #1e293b;
  --table-color-text: #f1f5f9;
  --table-color-textMuted: #94a3b8;
  --table-color-border: #334155;
}
```

### Dark Mode Toggle

```tsx
function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDark);
  }, [isDark]);
  
  return (
    <div>
      <button 
        onClick={() => setIsDark(!isDark)}
        className="mb-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
      >
        {isDark ? '☀️' : '🌙'} Toggle Theme
      </button>
      
      <ReusableTable {...props} />
    </div>
  );
}
```

---

## Design System Integration

### Tailwind CSS Integration

```tsx
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@shaun1705/advanced-reusable-table/dist/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'table-primary': '#6366f1',
        'table-secondary': '#8b5cf6'
      }
    }
  }
};
```

```css
/* Override with Tailwind classes */
.table-tailwind {
  --table-color-primary: theme('colors.blue.600');
  --table-color-secondary: theme('colors.purple.600');
  --table-color-background: theme('colors.gray.50');
  --table-color-surface: theme('colors.white');
  --table-color-text: theme('colors.gray.900');
  --table-color-textMuted: theme('colors.gray.500');
  --table-color-border: theme('colors.gray.200');
  --table-border-radius: theme('borderRadius.lg');
}
```

### Material-UI Integration

```tsx
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as TableThemeProvider } from '@shaun1705/advanced-reusable-table';

const muiTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});

const tableTheme: TableTheme = {
  colors: {
    primary: muiTheme.palette.primary.main,
    secondary: muiTheme.palette.secondary.main,
    background: muiTheme.palette.background.default,
    surface: muiTheme.palette.background.paper,
    text: muiTheme.palette.text.primary,
    textMuted: muiTheme.palette.text.secondary,
    border: muiTheme.palette.divider
  }
};

function IntegratedApp() {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <TableThemeProvider theme={tableTheme}>
        <ReusableTable {...props} />
      </TableThemeProvider>
    </MuiThemeProvider>
  );
}
```

### Chakra UI Integration

```tsx
import { ChakraProvider, useTheme } from '@chakra-ui/react';
import { ThemeProvider as TableThemeProvider } from '@shaun1705/advanced-reusable-table';

function ChakraIntegratedTable() {
  const chakraTheme = useTheme();
  
  const tableTheme: TableTheme = {
    colors: {
      primary: chakraTheme.colors.blue[500],
      secondary: chakraTheme.colors.purple[500],
      background: chakraTheme.colors.gray[50],
      surface: chakraTheme.colors.white,
      text: chakraTheme.colors.gray[800],
      textMuted: chakraTheme.colors.gray[600],
      border: chakraTheme.colors.gray[200]
    },
    borderRadius: chakraTheme.radii.md,
    boxShadow: chakraTheme.shadows.sm
  };
  
  return (
    <TableThemeProvider theme={tableTheme}>
      <ReusableTable {...props} />
    </TableThemeProvider>
  );
}
```

---

## Advanced Customization

### Custom Component Rendering

```tsx
// Create your own cell component
const CustomStatusCell = ({ value, onChange, disabled }: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const statusConfig = {
    pending: { color: '#f59e0b', icon: '⏳', label: 'Pending' },
    approved: { color: '#22c55e', icon: '✅', label: 'Approved' },
    rejected: { color: '#ef4444', icon: '❌', label: 'Rejected' }
  };
  
  const current = statusConfig[value as keyof typeof statusConfig];
  
  return (
    <div className="flex items-center space-x-2">
      <span style={{ color: current?.color }}>{current?.icon}</span>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border rounded px-2 py-1 text-sm"
      >
        {Object.entries(statusConfig).map(([key, config]) => (
          <option key={key} value={key}>{config.label}</option>
        ))}
      </select>
    </div>
  );
};

// Use in column configuration
const customColumn: Column<Task> = {
  header: 'Status',
  accessor: 'status',
  cell: (task) => (
    <CustomStatusCell 
      value={task.status}
      onChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
    />
  )
};
```

### Global Style Injection

```tsx
import { Global, css } from '@emotion/react';

const globalTableStyles = css`
  .advanced-table {
    /* Global table styles */
    font-family: 'Inter', sans-serif;
    
    /* Smooth animations */
    * {
      transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--table-color-surface);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--table-color-border);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--table-color-textMuted);
    }
  }
`;

function App() {
  return (
    <>
      <Global styles={globalTableStyles} />
      <div className="advanced-table">
        <ThemeProvider>
          <ReusableTable {...props} />
        </ThemeProvider>
      </div>
    </>
  );
}
```

### CSS-in-JS Theme Integration

```tsx
import styled, { createGlobalStyle } from 'styled-components';

const GlobalTableStyles = createGlobalStyle<{ theme: TableTheme }>`
  :root {
    --table-color-primary: ${props => props.theme.colors.primary};
    --table-color-secondary: ${props => props.theme.colors.secondary};
    --table-color-background: ${props => props.theme.colors.background};
    --table-color-surface: ${props => props.theme.colors.surface};
    --table-color-text: ${props => props.theme.colors.text};
    --table-color-textMuted: ${props => props.theme.colors.textMuted};
    --table-color-border: ${props => props.theme.colors.border};
    --table-border-radius: ${props => props.theme.borderRadius};
    --table-box-shadow: ${props => props.theme.boxShadow};
  }
`;

const StyledTableContainer = styled.div<{ theme: TableTheme }>`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  
  .table-header {
    background: linear-gradient(135deg, 
      ${props => props.theme.colors.primary}, 
      ${props => props.theme.colors.secondary}
    );
    color: white;
  }
`;

function StyledTable() {
  return (
    <>
      <GlobalTableStyles theme={customTheme} />
      <StyledTableContainer theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <ReusableTable {...props} />
        </ThemeProvider>
      </StyledTableContainer>
    </>
  );
}
```

---

## Performance Considerations

### Theme Optimization

```tsx
// Memoize theme object to prevent unnecessary re-renders
const memoizedTheme = useMemo(() => ({
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    // ... other colors
  },
  borderRadius: '0.375rem'
}), []); // Empty dependency array since theme is static

// Use with theme provider
<ThemeProvider theme={memoizedTheme}>
  <ReusableTable {...props} />
</ThemeProvider>
```

### CSS Custom Property Updates

```tsx
// Efficient runtime theme switching
function updateTheme(newTheme: TableTheme) {
  const root = document.documentElement;
  
  Object.entries(newTheme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--table-color-${key}`, value);
  });
  
  if (newTheme.borderRadius) {
    root.style.setProperty('--table-border-radius', newTheme.borderRadius);
  }
}
```

---

This comprehensive theming and customization guide covers all aspects of styling the Advanced Reusable Table component. The flexible theme system allows for everything from simple color changes to complete design system integration while maintaining performance and accessibility standards.