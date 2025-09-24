import React, { createContext, useContext, useEffect } from 'react';
import type { TableTheme, ThemeConfig, PredefinedTheme } from '../types';

const ThemeContext = createContext<TableTheme | undefined>(undefined);

// Default dark theme
const darkTheme: TableTheme = {
  colors: {
    primary: '#6366f1',      // indigo-500
    secondary: '#8b5cf6',    // violet-500  
    background: '#111827',   // gray-900
    surface: '#1f2937',      // gray-800
    text: '#f3f4f6',         // gray-100
    textMuted: '#9ca3af',    // gray-400
    border: '#4b5563',       // gray-600
    accent: '#10b981',       // emerald-500
    success: '#22c55e',      // green-500
    warning: '#f59e0b',      // amber-500
    error: '#ef4444',        // red-500
  },
  spacing: {
    xs: '0.25rem',    // 1
    sm: '0.5rem',     // 2
    md: '0.75rem',    // 3
    lg: '1rem',       // 4
    xl: '1.5rem',     // 6
  },
  typography: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: '0.375rem',  // rounded-md
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

// Light theme
const lightTheme: TableTheme = {
  colors: {
    primary: '#6366f1',      // indigo-500
    secondary: '#8b5cf6',    // violet-500  
    background: '#ffffff',   // white
    surface: '#f8fafc',      // slate-50
    text: '#1e293b',         // slate-800
    textMuted: '#64748b',    // slate-500
    border: '#e2e8f0',       // slate-200
    accent: '#10b981',       // emerald-500
    success: '#22c55e',      // green-500
    warning: '#f59e0b',      // amber-500
    error: '#ef4444',        // red-500
  },
  spacing: {
    xs: '0.25rem',    // 1
    sm: '0.5rem',     // 2
    md: '0.75rem',    // 3
    lg: '1rem',       // 4
    xl: '1.5rem',     // 6
  },
  typography: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  borderRadius: '0.375rem',  // rounded-md
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};

// Predefined themes mapping
const predefinedThemes: Record<PredefinedTheme, TableTheme> = {
  dark: darkTheme,
  light: lightTheme,
};

// Default theme (dark)
const defaultTheme: TableTheme = darkTheme;

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: ThemeConfig;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme = 'dark' }) => {
  // Resolve theme configuration
  const resolveTheme = (themeConfig: ThemeConfig): Partial<TableTheme> => {
    if (typeof themeConfig === 'string') {
      return predefinedThemes[themeConfig] || defaultTheme;
    }
    return themeConfig;
  };

  const resolvedTheme = resolveTheme(theme);
  
  // Deep merge the resolved theme with defaults
  const mergedTheme: TableTheme = {
    colors: { ...defaultTheme.colors, ...resolvedTheme.colors },
    spacing: { ...defaultTheme.spacing, ...resolvedTheme.spacing },
    typography: resolvedTheme.typography ? {
      fontFamily: resolvedTheme.typography.fontFamily || defaultTheme.typography!.fontFamily,
      fontSize: { ...defaultTheme.typography!.fontSize, ...resolvedTheme.typography.fontSize },
      fontWeight: { ...defaultTheme.typography!.fontWeight, ...resolvedTheme.typography.fontWeight },
    } : defaultTheme.typography,
    borderRadius: resolvedTheme.borderRadius || defaultTheme.borderRadius,
    boxShadow: resolvedTheme.boxShadow || defaultTheme.boxShadow,
  };

  // Apply CSS custom properties to the document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(mergedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--table-color-${key}`, value);
    });

    // Apply spacing variables
    if (mergedTheme.spacing) {
      Object.entries(mergedTheme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--table-spacing-${key}`, value);
      });
    }

    // Apply typography variables
    if (mergedTheme.typography) {
      root.style.setProperty('--table-font-family', mergedTheme.typography.fontFamily);
      
      Object.entries(mergedTheme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--table-font-size-${key}`, value);
      });
      
      Object.entries(mergedTheme.typography.fontWeight).forEach(([key, value]) => {
        root.style.setProperty(`--table-font-weight-${key}`, value);
      });
    }

    // Apply border radius and box shadow
    if (mergedTheme.borderRadius) {
      root.style.setProperty('--table-border-radius', mergedTheme.borderRadius);
    }
    if (mergedTheme.boxShadow) {
      root.style.setProperty('--table-box-shadow', mergedTheme.boxShadow);
    }

    // Cleanup function to remove variables when component unmounts
    return () => {
      const propertiesToRemove = [
        '--table-font-family', '--table-border-radius', '--table-box-shadow',
        ...Object.keys(mergedTheme.colors).map(key => `--table-color-${key}`),
        ...(mergedTheme.spacing ? Object.keys(mergedTheme.spacing).map(key => `--table-spacing-${key}`) : []),
        ...(mergedTheme.typography ? [
          ...Object.keys(mergedTheme.typography.fontSize).map(key => `--table-font-size-${key}`),
          ...Object.keys(mergedTheme.typography.fontWeight).map(key => `--table-font-weight-${key}`)
        ] : [])
      ];
      
      propertiesToRemove.forEach(prop => {
        root.style.removeProperty(prop);
      });
    };
  }, [mergedTheme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): TableTheme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    return defaultTheme;
  }
  return theme;
};

// Hook to generate CSS classes based on theme
export const useThemeClasses = () => {
  return {
    // Base table classes with CSS custom properties
    table: 'min-w-full divide-y divide-[var(--table-color-border,#4b5563)]',
    thead: 'bg-[var(--table-color-surface,#1f2937)]',
    tbody: 'bg-[var(--table-color-background,#111827)] divide-y divide-[var(--table-color-border,#4b5563)]',
    th: 'px-6 py-3 text-left text-xs font-medium text-[var(--table-color-textMuted,#9ca3af)] uppercase tracking-wider',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-[var(--table-color-text,#f3f4f6)]',
    button: 'px-4 py-2 border border-transparent text-sm font-medium rounded-[var(--table-border-radius,0.375rem)] text-[var(--table-color-primary,#6366f1)] bg-[var(--table-color-primary,#6366f1)]/20 hover:bg-[var(--table-color-primary,#6366f1)]/30 transition-colors',
    input: 'w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-2 px-3 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition',
  };
};