import React from 'react';
import type { Column, CellRenderContext, CellRenderDecision, CollectionConfig } from '../types';

/**
 * Resolves the appropriate cell renderer for a given context
 * Tries custom renderCell function first, then falls back to column defaults
 */
export function resolveCellRenderer<T>(context: CellRenderContext<T>): CellRenderDecision | React.ReactNode {
  const { column } = context;
  
  try {
    // 1. Try custom renderCell function first
    if (column.renderCell) {
      const result = column.renderCell(context);
      
      // If it returns a React node directly, wrap it in a decision
      if (React.isValidElement(result) || typeof result === 'string' || typeof result === 'number') {
        return {
          type: 'custom',
          content: result as React.ReactNode,
          editable: column.editable
        };
      }
      
      // If it's already a CellRenderDecision, return as-is
      if (result && typeof result === 'object' && 'type' in result) {
        return result;
      }
    }
    
    // 2. Fall back to column defaults
    return resolveColumnDefaults(context);
    
  } catch (error) {
    console.warn('Error in cell renderer:', error);
    return {
      type: 'text',
      content: String(context.value || ''),
      editable: column.editable
    };
  }
}

/**
 * Resolves cell rendering based on column's default configuration
 */
function resolveColumnDefaults<T>(context: CellRenderContext<T>): CellRenderDecision {
  const { column, value } = context;
  
  // Handle cellType (checkbox, toggle)
  if (column.cellType === 'checkbox') {
    return {
      type: 'checkbox',
      editable: column.editable
    };
  }
  
  if (column.cellType === 'toggle') {
    return {
      type: 'toggle',
      editable: column.editable
    };
  }
  
  // Handle dataType
  if (column.dataType === 'collection' && column.collectionConfig) {
    return {
      type: 'collection',
      collectionConfig: column.collectionConfig,
      editable: column.editable
    };
  }
  
  if (column.dataType === 'currency') {
    return {
      type: 'currency',
      props: { currencyOptions: column.currencyOptions },
      editable: column.editable
    };
  }
  
  if (column.dataType === 'date') {
    return {
      type: 'date',
      props: { dateOptions: column.dateOptions },
      editable: column.editable
    };
  }
  
  if (column.dataType === 'datetime') {
    return {
      type: 'datetime',
      props: { dateOptions: column.dateOptions },
      editable: column.editable
    };
  }
  
  if (column.dataType === 'number') {
    return {
      type: 'number',
      editable: column.editable
    };
  }
  
  // Handle custom cell function
  if (column.cell) {
    return {
      type: 'custom',
      content: column.cell(context.row),
      editable: column.editable
    };
  }
  
  // Default to text
  return {
    type: 'text',
    content: value as React.ReactNode,
    editable: column.editable
  };
}

/**
 * Helper function to create a mixed content renderer
 * Useful for scenarios like ProcessPlans where content type varies by row
 */
export function createMixedContentRenderer<T>(
  rules: {
    condition: (context: CellRenderContext<T>) => boolean;
    render: (context: CellRenderContext<T>) => CellRenderDecision;
  }[]
): (context: CellRenderContext<T>) => CellRenderDecision {
  return (context: CellRenderContext<T>) => {
    for (const rule of rules) {
      if (rule.condition(context)) {
        return rule.render(context);
      }
    }
    
    // Fallback to text
    return {
      type: 'text',
      content: String(context.value || ''),
      editable: false
    };
  };
}

/**
 * Helper function to create a conditional edit renderer
 * Allows editing based on row state
 */
export function createConditionalEditRenderer<T>(
  baseRenderer: (context: CellRenderContext<T>) => CellRenderDecision,
  editableCondition: (context: CellRenderContext<T>) => boolean
): (context: CellRenderContext<T>) => CellRenderDecision {
  return (context: CellRenderContext<T>) => {
    const decision = baseRenderer(context);
    return {
      ...decision,
      editable: editableCondition(context)
    };
  };
}

/**
 * Utility function to detect data type automatically
 */
export function detectDataType(value: any): string {
  if (value === null || value === undefined) return 'text';
  if (Array.isArray(value)) return 'collection';
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    // Try to detect date strings
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.includes('T') ? 'datetime' : 'date';
    }
  }
  return 'text';
}

/**
 * Performance optimization helper for memoizing cell decisions
 */
export function memoizeCellDecision<T extends object>(
  renderer: (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode
): (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode {
  const cache = new WeakMap<T, Map<keyof T, any>>();
  
  return (context: CellRenderContext<T>) => {
    const { row, column } = context;
    
    if (!cache.has(row)) {
      cache.set(row, new Map());
    }
    
    const rowCache = cache.get(row)!;
    const cacheKey = column.accessor;
    
    if (rowCache.has(cacheKey)) {
      return rowCache.get(cacheKey);
    }
    
    const result = renderer(context);
    rowCache.set(cacheKey, result);
    return result;
  };
}