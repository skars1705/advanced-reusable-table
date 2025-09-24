import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Column, SortConfig, FilterConfig, SortDirection, FilterOperator, StringFilterOperator, NumberFilterOperator, DisplayRow, GroupHeaderRow, DateFilterOperator, CollectionFilterOperator } from '../types';


interface UseTableProps<T> {
  data: T[];
  allColumns: Column<T>[];
  initialSort?: SortConfig<T>[];
  initialFilters?: FilterConfig<T>[];
  initialPageSize?: number;
  groupByKeys: (keyof T)[];
}

export const useTable = <T,>({
  data,
  allColumns,
  initialSort = [],
  initialFilters = [],
  initialPageSize = 10,
  groupByKeys = [],
}: UseTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>[]>(initialSort);
  const [filters, setFilters] = useState<FilterConfig<T>[]>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Make hook reactive to changes in initial props from view switching
  useEffect(() => {
    setSortConfig(initialSort);
  }, [initialSort]);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Reset pagination and collapsed groups when grouping changes
  useEffect(() => {
    setCurrentPage(1);
    setCollapsedGroups(new Set());
  }, [JSON.stringify(groupByKeys)]);

  const handleFilterChange = useCallback((key: keyof T, operator: FilterOperator, value: string, secondValue?: string, forceRemove?: boolean) => {
    setCurrentPage(1); // Reset to first page on filter change
    setFilters(prevFilters => {
      const existingFilterIndex = prevFilters.findIndex(f => f.key === key);

      // For isEmpty operator, we don't need a value, so don't remove the filter
      // For range operators (between, dateRange), keep the filter even if first value is empty
      const isRangeOperator = operator === 'between' || operator === 'dateRange';
      if (operator !== 'isEmpty' && !isRangeOperator && (value === '' || value === null)) {
        return prevFilters.filter(f => f.key !== key);
      }
      
      // For range operators, only remove if both values are empty AND it's explicitly forced
      if (isRangeOperator && (value === '' || value === null) && (!secondValue || secondValue === '') && forceRemove) {
        return prevFilters.filter(f => f.key !== key);
      }
      
      const newFilter: FilterConfig<T> = { key, operator, value, secondValue };

      if (existingFilterIndex > -1) {
        const newFilters = [...prevFilters];
        newFilters[existingFilterIndex] = newFilter;
        return newFilters;
      } else {
        return [...prevFilters, newFilter];
      }
    });
  }, []);

  const handleSort = useCallback((key: keyof T, isMulti: boolean) => {
    setSortConfig(prevConfig => {
        const existingSortIndex = prevConfig.findIndex(s => s.key === key);

        // --- Multi-sort logic ---
        if (isMulti) {
            const newConfig = [...prevConfig];
            if (existingSortIndex > -1) {
                // Toggle direction if it exists
                const newDirection = newConfig[existingSortIndex].direction === 'ascending' ? 'descending' : 'ascending';
                newConfig[existingSortIndex] = { ...newConfig[existingSortIndex], direction: newDirection };
            } else {
                // Add new sort if it doesn't exist
                newConfig.push({ key, direction: 'ascending' });
            }
            return newConfig;
        }

        // --- Single-sort logic ---
        // If the clicked column is already the single active sort, toggle its direction
        if (existingSortIndex > -1 && prevConfig.length === 1) {
            const newDirection = prevConfig[existingSortIndex].direction === 'ascending' ? 'descending' : 'ascending';
            return [{ key, direction: newDirection }];
        } else {
            // Otherwise, this is a new single sort (either from no sort, a different sort, or from multi-sort)
            return [{ key, direction: 'ascending' }];
        }
    });
  }, []);


  const clearFilters = useCallback(() => {
    setFilters([]);
    setCurrentPage(1);
  }, []);

  const toggleGroup = useCallback((path: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
    setCurrentPage(1);
  }, []);

  const filteredData = useMemo(() => {
    if (filters.length === 0) {
      return data;
    }
    const columnMap = new Map(allColumns.map(c => [c.accessor, c]));

    return data.filter(item => {
      return filters.every(filter => {
        const itemValue = item[filter.key];
        const filterValue = filter.value;
        const column = columnMap.get(filter.key);

        // Check for isEmpty filter (applies to all data types)
        if (filter.operator === 'isEmpty') {
          return itemValue === null || itemValue === undefined || itemValue === '';
        }

        // Date/DateTime filtering
        if ((column?.dataType === 'date' || column?.dataType === 'datetime') && typeof itemValue === 'string' && filterValue) {
          try {
              let itemDateMs, filterDateMs;

              if (column.dataType === 'date') {
                  // Compare dates by UTC midnight to ignore time
                  itemDateMs = new Date(itemValue).setUTCHours(0, 0, 0, 0);
                  filterDateMs = new Date(filterValue).setUTCHours(0, 0, 0, 0);
              } else { // datetime
                  itemDateMs = new Date(itemValue).getTime();
                  filterDateMs = new Date(filterValue).getTime();
              }
              
              if (isNaN(itemDateMs) || isNaN(filterDateMs)) return true;

              switch (filter.operator as DateFilterOperator) {
                  case 'is': return itemDateMs === filterDateMs;
                  case 'isNot': return itemDateMs !== filterDateMs;
                  case 'isBefore': return itemDateMs < filterDateMs;
                  case 'isAfter': return itemDateMs > filterDateMs;
                  case 'dateRange':
                    if (filter.secondValue) {
                      let secondDateMs;
                      if (column.dataType === 'date') {
                        secondDateMs = new Date(filter.secondValue).setUTCHours(0, 0, 0, 0);
                      } else {
                        secondDateMs = new Date(filter.secondValue).getTime();
                      }
                      if (!isNaN(secondDateMs)) {
                        return itemDateMs >= filterDateMs && itemDateMs <= secondDateMs;
                      }
                    }
                    return true;
                  default: return true;
              }
          } catch (e) { return true; }
        }

        // String filtering
        if (typeof itemValue === 'string') {
            const itemStr = itemValue.toLowerCase();
            const filterStr = filterValue.toLowerCase();
            switch (filter.operator as StringFilterOperator) {
                case 'contains': return itemStr.includes(filterStr);
                case 'doesNotContain': return !itemStr.includes(filterStr);
                case 'equals': return itemStr === filterStr;
                case 'startsWith': return itemStr.startsWith(filterStr);
                case 'endsWith': return itemStr.endsWith(filterStr);
                default: return true;
            }
        }

        // Number filtering
        if (typeof itemValue === 'number') {
            const itemNum = itemValue;
            const filterNum = parseFloat(filterValue);
            if (isNaN(filterNum)) return true; 

            switch (filter.operator as NumberFilterOperator) {
                case 'eq': return itemNum === filterNum;
                case 'neq': return itemNum !== filterNum;
                case 'gt': return itemNum > filterNum;
                case 'lt': return itemNum < filterNum;
                case 'gte': return itemNum >= filterNum;
                case 'lte': return itemNum <= filterNum;
                case 'between':
                  if (filter.secondValue) {
                    const secondNum = parseFloat(filter.secondValue);
                    if (!isNaN(secondNum)) {
                      return itemNum >= filterNum && itemNum <= secondNum;
                    }
                  }
                  return true;
                default: return true;
            }
        }
        
        if (typeof itemValue === 'boolean') {
            const filterBool = filterValue.toLowerCase();
            if (filterBool === 'true') return itemValue === true;
            if (filterBool === 'false') return itemValue === false;
            return true;
        }

        // Collection filtering
        if (column?.dataType === 'collection') {
          const collectionValue = Array.isArray(itemValue) ? itemValue : 
                                   (itemValue ? [itemValue] : []);
          
          switch (filter.operator as CollectionFilterOperator) {
            case 'contains':
              return collectionValue.includes(filterValue as any);
            case 'doesNotContain':
              return !collectionValue.includes(filterValue as any);
            case 'containsAny': {
              const searchValues = filterValue.split(',').map(v => v.trim()).filter(Boolean);
              return searchValues.some(searchVal => collectionValue.includes(searchVal as any));
            }
            case 'containsAll': {
              const searchValues = filterValue.split(',').map(v => v.trim()).filter(Boolean);
              return searchValues.every(searchVal => collectionValue.includes(searchVal as any));
            }
            case 'isEmpty':
              return collectionValue.length === 0;
            default: 
              return true;
          }
        }

        return true; 
      });
    });
  }, [data, filters, allColumns]);

  const sortedAndFilteredData = useMemo(() => {
    const dataToSort = [...filteredData];
    if (sortConfig.length > 0) {
        const columnMap = new Map(allColumns.map(c => [c.accessor, c]));
        dataToSort.sort((a, b) => {
            for (const config of sortConfig) {
                const { key, direction } = config;
                const column = columnMap.get(key);
                const aValue = a[key];
                const bValue = b[key];

                let comparison = 0;
                if (column?.dataType === 'number' || column?.dataType === 'currency') {
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        comparison = aValue - bValue;
                    }
                } else if ((column?.dataType === 'date' || column?.dataType === 'datetime') && typeof aValue === 'string' && typeof bValue === 'string') {
                    const dateA = new Date(aValue).getTime();
                    const dateB = new Date(bValue).getTime();
                    if (!isNaN(dateA) && !isNaN(dateB)) {
                        comparison = dateA - dateB;
                    }
                } else if (column?.dataType === 'collection') {
                    // Collection sorting: first by count, then alphabetically by first value
                    const aCollection = Array.isArray(aValue) ? aValue : (aValue ? [aValue] : []);
                    const bCollection = Array.isArray(bValue) ? bValue : (bValue ? [bValue] : []);
                    
                    // Sort by count first
                    if (aCollection.length !== bCollection.length) {
                        comparison = aCollection.length - bCollection.length;
                    } else {
                        // If counts are equal, sort alphabetically by first value
                        const aFirst = aCollection[0] || '';
                        const bFirst = bCollection[0] || '';
                        const strA = String(aFirst).toLowerCase();
                        const strB = String(bFirst).toLowerCase();
                        if (strA < strB) comparison = -1;
                        if (strA > strB) comparison = 1;
                    }
                } else {
                    const strA = String(aValue).toLowerCase();
                    const strB = String(bValue).toLowerCase();
                    if (strA < strB) comparison = -1;
                    if (strA > strB) comparison = 1;
                }
                
                if (comparison !== 0) {
                    return direction === 'ascending' ? comparison : -comparison;
                }
            }
            return 0;
        });
    }
    return dataToSort;
  }, [filteredData, sortConfig, allColumns]);

  // Memoize groupByKeys to prevent unnecessary re-renders due to array reference changes
  const memoizedGroupByKeys = useMemo(() => groupByKeys, [JSON.stringify(groupByKeys)]);

  const displayData = useMemo(() => {
    if (memoizedGroupByKeys.length === 0) {
      return sortedAndFilteredData;
    }

    const groupDataRecursively = (
        items: T[], 
        groupKeys: (keyof T)[], 
        level: number, 
        parentPath: string
    ): DisplayRow<T>[] => {
        if (groupKeys.length === 0) {
            return items;
        }

        const [currentGroupKey, ...restGroupKeys] = groupKeys;

        const groups = items.reduce((acc, item) => {
            const groupValue = String(item[currentGroupKey]);
            if (!acc[groupValue]) {
                acc[groupValue] = [];
            }
            acc[groupValue].push(item);
            return acc;
        }, {} as Record<string, T[]>);
        
        const result: DisplayRow<T>[] = [];

        // Sort group values before processing
        const sortedGroupValues = Object.keys(groups).sort((a, b) => {
          // A simple alphanumeric sort for group headers
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });

        for (const groupValue of sortedGroupValues) {
            const groupItems = groups[groupValue];
            const path = parentPath ? `${parentPath}|${groupValue}` : groupValue;

            const groupHeader: GroupHeaderRow<T> = {
                isGroupHeader: true,
                level,
                path,
                groupKey: currentGroupKey,
                groupValue,
                count: groupItems.length,
            };

            result.push(groupHeader);

            if (!collapsedGroups.has(path)) {
                result.push(...groupDataRecursively(groupItems, restGroupKeys, level + 1, path));
            }
        }
        return result;
    };

    return groupDataRecursively(sortedAndFilteredData, memoizedGroupByKeys, 0, '');
  }, [sortedAndFilteredData, memoizedGroupByKeys, collapsedGroups]);

  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return displayData.slice(startIndex, startIndex + pageSize);
  }, [displayData, currentPage, pageSize]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);


  const getSortDirection = useCallback((key: keyof T): SortDirection | undefined => {
    return sortConfig.find(s => s.key === key)?.direction;
  }, [sortConfig]);
  
  const getSortOrder = useCallback((key: keyof T): number | undefined => {
    const index = sortConfig.findIndex(s => s.key === key);
    return index > -1 ? index + 1 : undefined;
  }, [sortConfig]);


  return {
    paginatedItems: paginatedData,
    originalItems: sortedAndFilteredData, // Used for export
    handleSort,
    handleFilterChange,
    getSortDirection,
    getSortOrder,
    filters,
    clearFilters,
    toggleGroup,
    collapsedGroups,
    pagination: {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        setCurrentPage,
        setPageSize: handlePageSizeChange,
    }
  };
};