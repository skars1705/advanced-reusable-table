import { useState, useMemo, useCallback } from 'react';
import type { Column, GlobalSearchConfig } from '../types';

interface UseGlobalSearchProps<T> {
  data: T[];
  columns: Column<T>[];
  config: GlobalSearchConfig;
}

export const useGlobalSearch = <T extends object>({
  data,
  columns,
  config
}: UseGlobalSearchProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchableColumns = useMemo(() => {
    if (config.searchableColumns && config.searchableColumns.length > 0) {
      // Filter columns based on provided searchable column names
      return columns.filter(col => 
        config.searchableColumns?.includes(String(col.accessor))
      );
    }
    // If no specific columns specified, use all columns that are filterable or don't have filterable: false
    return columns.filter(col => col.filterable !== false);
  }, [columns, config.searchableColumns]);

  const filteredData = useMemo(() => {
    if (!config.enabled || !searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();

    return data.filter(item => {
      return searchableColumns.some(column => {
        const value = item[column.accessor];
        
        if (value == null) return false;

        // Handle different data types
        let searchableValue: string;
        
        if (typeof value === 'string') {
          searchableValue = value;
        } else if (typeof value === 'number') {
          searchableValue = value.toString();
        } else if (typeof value === 'boolean') {
          searchableValue = value ? 'true' : 'false';
        } else if (column.dataType === 'date' || column.dataType === 'datetime') {
          try {
            // For dates, also search in formatted date strings
            if (column.dateOptions) {
              searchableValue = new Intl.DateTimeFormat(
                column.dateOptions.locale,
                {
                  dateStyle: column.dateOptions.dateStyle,
                  timeStyle: column.dateOptions.timeStyle,
                  timeZone: 'UTC',
                }
              ).format(new Date(String(value)));
            } else {
              searchableValue = new Date(String(value)).toLocaleDateString();
            }
          } catch {
            searchableValue = String(value);
          }
        } else if (column.dataType === 'currency' && typeof value === 'number') {
          // For currency, search in formatted currency strings
          if (column.currencyOptions) {
            try {
              searchableValue = new Intl.NumberFormat(
                column.currencyOptions.locale,
                {
                  style: 'currency',
                  currency: column.currencyOptions.currency,
                }
              ).format(value);
            } catch {
              searchableValue = value.toString();
            }
          } else {
            searchableValue = value.toString();
          }
        } else {
          searchableValue = String(value);
        }

        return searchableValue.toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchableColumns, config.enabled]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    filteredData,
    handleSearchChange,
    clearSearch,
    hasActiveSearch: Boolean(config.enabled && searchQuery.trim()),
  };
};