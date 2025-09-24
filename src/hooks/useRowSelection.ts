import { useState, useCallback, useMemo } from 'react';
import type { SelectionMode, RowSelectionState } from '../types';

export interface UseRowSelectionProps<T> {
  data: T[];
  mode: SelectionMode; // Changed from selectionMode to match documentation
  initialSelection?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
}

export const useRowSelection = <T extends object>({
  data,
  mode,
  initialSelection = [],
  onSelectionChange
}: UseRowSelectionProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<T>>(new Set(initialSelection));

  const selectionState: RowSelectionState<T> = useMemo(() => {
    const selectedCount = selectedRows.size;
    const totalCount = data.length;
    
    return {
      selectedRows,
      isAllSelected: selectedCount > 0 && selectedCount === totalCount,
      isIndeterminate: selectedCount > 0 && selectedCount < totalCount,
    };
  }, [selectedRows, data.length]);

  const toggleRowSelection = useCallback((row: T) => {
    if (mode === 'none') return;

    setSelectedRows(prev => {
      const newSelection = new Set(prev);
      
      if (mode === 'single') {
        // For single selection, clear all and add only this row
        newSelection.clear();
        if (!prev.has(row)) {
          newSelection.add(row);
        }
      } else {
        // For multiple selection, toggle the row
        if (newSelection.has(row)) {
          newSelection.delete(row);
        } else {
          newSelection.add(row);
        }
      }
      
      onSelectionChange?.(Array.from(newSelection));
      return newSelection;
    });
  }, [mode, onSelectionChange]);

  const toggleAllSelection = useCallback(() => {
    if (mode !== 'multiple') return;

    setSelectedRows(prev => {
      const newSelection = new Set<T>();
      
      if (prev.size === data.length) {
        // If all are selected, deselect all
        // newSelection stays empty
      } else {
        // Otherwise, select all
        data.forEach(row => newSelection.add(row));
      }
      
      onSelectionChange?.(Array.from(newSelection));
      return newSelection;
    });
  }, [data, mode, onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const selectRows = useCallback((rows: T[]) => {
    if (mode === 'none') return;
    
    const newSelection = mode === 'single' 
      ? new Set([rows[0]].filter(Boolean))  // Take only first row for single mode
      : new Set(rows);
      
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  }, [mode, onSelectionChange]);

  const selectRow = useCallback((row: T) => {
    toggleRowSelection(row);
  }, [toggleRowSelection]);

  const selectAll = useCallback(() => {
    toggleAllSelection();
  }, [toggleAllSelection]);

  const isRowSelected = useCallback((row: T) => {
    return selectedRows.has(row);
  }, [selectedRows]);

  // Return interface that directly matches ReusableTable props
  return {
    // Direct spread-compatible props for ReusableTable
    ...selectionState,
    selectRow,
    selectAll,
    clearSelection,
    
    // Additional utility methods
    toggleRowSelection,
    toggleAllSelection,
    selectRows,
    isRowSelected,
    selectedRowsArray: Array.from(selectedRows),
  };
};