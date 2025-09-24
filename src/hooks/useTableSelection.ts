import { useCallback } from 'react';
import { useRowSelection, type UseRowSelectionProps } from './useRowSelection';
import type { RowSelectionState, SelectionMode } from '../types';

/**
 * Enhanced table selection hook with simplified API
 * 
 * This hook provides a simplified interface for table row selection
 * that directly integrates with ReusableTable without any prop mapping.
 * 
 * @example Simple Usage
 * ```tsx
 * const tableProps = useTableSelection({
 *   data: users,
 *   mode: 'multiple'
 * });
 * 
 * return <ReusableTable {...tableProps} />;
 * ```
 * 
 * @example Advanced Usage
 * ```tsx
 * const selection = useTableSelection({
 *   data: users,
 *   mode: 'multiple',
 *   onSelectionChange: (selected) => console.log(selected),
 *   initialSelection: [users[0]]
 * });
 * 
 * // Access selection state
 * console.log(selection.selectedCount);
 * 
 * // Use with table
 * return <ReusableTable rowSelection={selection} ... />;
 * ```
 */

interface UseTableSelectionProps<T> {
  data: T[];
  mode: SelectionMode;
  initialSelection?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  /**
   * Enable batch operations for performance with large datasets
   * @default false
   */
  enableBatch?: boolean;
  /**
   * Maximum number of items that can be selected
   */
  maxSelections?: number;
  /**
   * @deprecated Use maxSelections instead
   */
  maxSelection?: number;
  /**
   * Callback fired when max selection limit is reached
   */
  onMaxSelectionReached?: () => void;
}

export interface TableSelectionReturn<T> extends RowSelectionState<T> {
  selectRow: (row: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // Enhanced API methods
  selectedCount: number;
  selectedData: T[];
  isMaxSelectionReached: boolean;
  canSelectMore: boolean;
  
  // Batch operations
  selectRows: (rows: T[]) => void;
  deselectRows: (rows: T[]) => void;
  toggleRows: (rows: T[]) => void;
  
  // Utility methods
  isRowSelected: (row: T) => boolean;
  getSelectionSummary: () => {
    total: number;
    selected: number;
    percentage: number;
  };
}

export const useTableSelection = <T extends object>({
  data,
  mode,
  initialSelection,
  onSelectionChange,
  enableBatch = false,
  maxSelections,
  maxSelection, // Deprecated, for backward compatibility
  onMaxSelectionReached,
}: UseTableSelectionProps<T>): TableSelectionReturn<T> => {
  
  // Enhanced selection change handler with backward compatibility
  const effectiveMaxSelections = maxSelections ?? maxSelection;
  
  const handleSelectionChange = useCallback((selectedRows: T[]) => {
    // Check max selection limit
    if (effectiveMaxSelections && selectedRows.length > effectiveMaxSelections) {
      onMaxSelectionReached?.();
      return; // Prevent selection beyond limit
    }
    
    onSelectionChange?.(selectedRows);
  }, [effectiveMaxSelections, onMaxSelectionReached, onSelectionChange]);

  // Use base hook with enhanced handler
  const baseSelection = useRowSelection<T>({
    data,
    mode,
    initialSelection,
    onSelectionChange: handleSelectionChange,
  });

  // Enhanced methods
  const selectedCount = baseSelection.selectedRowsArray.length;
  const selectedData = baseSelection.selectedRowsArray;
  const isMaxSelectionReached = effectiveMaxSelections ? selectedCount >= effectiveMaxSelections : false;
  const canSelectMore = !isMaxSelectionReached;

  const selectRows = useCallback((rows: T[]) => {
    if (!enableBatch) {
      rows.forEach(row => baseSelection.selectRow(row));
      return;
    }
    
    // Batch operation
    baseSelection.selectRows(rows);
  }, [baseSelection, enableBatch]);

  const deselectRows = useCallback((rows: T[]) => {
    rows.forEach(row => {
      if (baseSelection.isRowSelected(row)) {
        baseSelection.selectRow(row); // Toggle to deselect
      }
    });
  }, [baseSelection]);

  const toggleRows = useCallback((rows: T[]) => {
    rows.forEach(row => baseSelection.selectRow(row));
  }, [baseSelection]);

  const getSelectionSummary = useCallback(() => ({
    total: data.length,
    selected: selectedCount,
    percentage: data.length > 0 ? Math.round((selectedCount / data.length) * 100) : 0,
  }), [data.length, selectedCount]);

  return {
    // Base selection state (directly compatible with ReusableTable)
    ...baseSelection,
    
    // Enhanced API
    selectedCount,
    selectedData,
    isMaxSelectionReached,
    canSelectMore,
    
    // Batch operations
    selectRows,
    deselectRows,
    toggleRows,
    
    // Utility methods
    getSelectionSummary,
  };
};

/**
 * Simple table selection hook for common use cases
 * Returns props that can be directly spread to ReusableTable
 */
export const useSimpleTableSelection = <T extends object>(
  data: T[],
  mode: SelectionMode = 'multiple'
) => {
  return useTableSelection({ data, mode });
};