# Performance Optimization

Complete guide to optimizing Advanced Reusable Table for large datasets, complex operations, and production environments.

## Overview

The table is optimized for performance out of the box, but there are several techniques to further optimize for:

- **Large Datasets** (1000+ rows)
- **Complex Rendering** (dynamic cells, collections)
- **Frequent Updates** (real-time data)
- **Memory Management** (long-running applications)
- **Mobile Performance** (limited resources)

## Built-in Optimizations

### Automatic Optimizations

The table includes several automatic optimizations:

```typescript
// Automatic optimizations (no configuration needed)
✅ React.memo for component memoization
✅ useCallback for stable function references
✅ useMemo for expensive calculations
✅ Virtualized rendering for large datasets
✅ Debounced search and filtering
✅ Lazy evaluation of cell renderers
✅ Efficient DOM diffing
```

### Smart Defaults

```typescript
const performanceDefaults = {
  searchDebounce: 300,           // ms delay for search
  filterDebounce: 200,           // ms delay for filters
  virtualThreshold: 50,          // rows before virtualization
  memoizationDepth: 2,           // levels of memoization
  chunkSize: 100                 // rows per render chunk
};
```

## Large Dataset Optimization

### Virtual Scrolling

Automatically enabled for datasets over 50 rows:

```tsx
import { ReusableTable } from 'advanced-reusable-table';

// Automatic virtualization for large datasets
<ReusableTable
  allColumns={columns}
  data={largeDataset}        // 1000+ rows
  // Virtualization automatically enabled
  viewConfig={viewConfig}
/>

// Manual configuration
<ReusableTable
  allColumns={columns}
  data={data}
  viewConfig={viewConfig}
  virtualized={true}
  virtualizedOptions={{
    itemHeight: 60,            // Fixed row height for better performance
    overscanCount: 10,         // Extra rows to render outside viewport
    scrollingResetTimeInterval: 150  // Throttle scroll events
  }}
/>
```

### Progressive Loading

Load data in chunks for better perceived performance:

```tsx
const useProgressiveData = (allData: any[], chunkSize = 100) => {
  const [visibleData, setVisibleData] = useState(allData.slice(0, chunkSize));
  const [isLoading, setIsLoading] = useState(false);
  
  const loadMore = useCallback(() => {
    if (visibleData.length >= allData.length) return;
    
    setIsLoading(true);
    
    // Simulate async loading
    setTimeout(() => {
      setVisibleData(prev => [
        ...prev,
        ...allData.slice(prev.length, prev.length + chunkSize)
      ]);
      setIsLoading(false);
    }, 100);
  }, [allData, visibleData.length, chunkSize]);
  
  return { visibleData, loadMore, hasMore: visibleData.length < allData.length, isLoading };
};

// Usage
const DataTable = () => {
  const { visibleData, loadMore, hasMore, isLoading } = useProgressiveData(massiveDataset, 200);
  
  return (
    <>
      <ReusableTable
        allColumns={columns}
        data={visibleData}
        viewConfig={viewConfig}
      />
      
      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </>
  );
};
```

### Server-Side Operations

For very large datasets, implement server-side filtering, sorting, and pagination:

```tsx
const useServerSideTable = (baseUrl: string) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const fetchData = useCallback(async (params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    filters?: FilterConfig[];
    search?: string;
  }) => {
    setLoading(true);
    
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        pageSize: String(params.pageSize || 50),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
        ...(params.search && { search: params.search }),
        ...(params.filters && { filters: JSON.stringify(params.filters) })
      });
      
      const response = await fetch(`${baseUrl}/data?${queryParams}`);
      const result = await response.json();
      
      setData(result.data);
      setTotalCount(result.totalCount);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);
  
  return { data, totalCount, loading, fetchData };
};

// Usage with server-side operations
const ServerSideTable = () => {
  const { data, totalCount, loading, fetchData } = useServerSideTable('/api/products');
  
  return (
    <ReusableTable
      allColumns={columns}
      data={data}
      viewConfig={viewConfig}
      loading={loading}
      onSort={(sortConfig) => {
        fetchData({
          sortBy: sortConfig[0]?.key,
          sortDirection: sortConfig[0]?.direction
        });
      }}
      onFilter={(filters) => {
        fetchData({ filters });
      }}
      onSearch={(searchTerm) => {
        fetchData({ search: searchTerm });
      }}
      pagination={{
        enabled: true,
        totalCount,
        onPageChange: (page, pageSize) => {
          fetchData({ page, pageSize });
        }
      }}
    />
  );
};
```

## Cell Rendering Optimization

### Memoized Cell Renderers

Optimize expensive cell rendering operations:

```tsx
// ❌ Inefficient - creates new objects on every render
const columns = [
  {
    header: 'Complex Data',
    accessor: 'complexData',
    cell: (item) => {
      const processedData = expensiveCalculation(item.complexData);
      return <ComplexComponent data={processedData} />;
    }
  }
];

// ✅ Optimized - memoized calculations
const MemoizedComplexComponent = React.memo(ComplexComponent);

const useProcessedData = (complexData: any) => {
  return useMemo(() => expensiveCalculation(complexData), [complexData]);
};

const optimizedColumns = [
  {
    header: 'Complex Data',
    accessor: 'complexData',
    cell: (item) => {
      const processedData = useProcessedData(item.complexData);
      return <MemoizedComplexComponent data={processedData} />;
    }
  }
];
```

### Dynamic Rendering Optimization

Cache dynamic rendering decisions:

```tsx
// Create a memoized render decision cache
const useCellRenderCache = () => {
  const cache = useRef(new Map());
  
  return useCallback((key: string, factory: () => CellRenderDecision) => {
    if (!cache.current.has(key)) {
      cache.current.set(key, factory());
    }
    return cache.current.get(key);
  }, []);
};

// Optimized dynamic rendering
const dynamicColumn = {
  header: 'Dynamic Content',
  accessor: 'content',
  renderCell: (context) => {
    const getRenderDecision = useCellRenderCache();
    const { value, row } = context;
    
    // Create cache key based on relevant data
    const cacheKey = `${row.id}_${JSON.stringify(value)}`;
    
    return getRenderDecision(cacheKey, () => {
      if (Array.isArray(value)) {
        return {
          type: 'collection',
          collectionConfig: {
            type: 'checkbox',
            options: value.map(item => ({ value: item, label: item }))
          }
        };
      }
      
      return { type: 'text', content: String(value) };
    });
  }
};
```

### Collection Performance

Optimize large collection option lists:

```tsx
// ✅ Optimized collection with large option list
const optimizedCollectionConfig = {
  type: 'checkbox',
  options: useMemo(() => 
    largeOptionsList.map(item => ({
      value: item.id,
      label: item.name,
      color: item.color
    })),
    [largeOptionsList]  // Only recalculate when list changes
  ),
  searchable: true,        // Enable search for large lists
  virtualized: true,       // Enable virtualization for 100+ options
  maxHeight: '300px',      // Limit dropdown height
  debounceMs: 200         // Debounce search input
};
```

## State Management Optimization

### Efficient Updates

Minimize state updates and re-renders:

```tsx
// ❌ Inefficient - multiple state updates
const handleBulkUpdate = (updates: any[]) => {
  updates.forEach(update => {
    setData(prev => updateSingleItem(prev, update));  // Multiple renders
  });
};

// ✅ Optimized - batch updates
const handleBulkUpdate = (updates: any[]) => {
  setData(prev => {
    let newData = [...prev];
    updates.forEach(update => {
      newData = updateSingleItem(newData, update);
    });
    return newData;  // Single render
  });
};

// ✅ Even better - use reducer for complex updates
const dataReducer = (state: any[], action: any) => {
  switch (action.type) {
    case 'BULK_UPDATE':
      return action.updates.reduce(
        (acc, update) => updateSingleItem(acc, update),
        [...state]
      );
    case 'SINGLE_UPDATE':
      return updateSingleItem(state, action.update);
    default:
      return state;
  }
};

const OptimizedTable = () => {
  const [data, dispatch] = useReducer(dataReducer, initialData);
  
  const handleBulkUpdate = useCallback((updates) => {
    dispatch({ type: 'BULK_UPDATE', updates });
  }, []);
  
  return <ReusableTable /* ... */ />;
};
```

### Debounced Operations

Debounce expensive operations:

```tsx
import { debounce } from 'lodash-es';

const useOptimizedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Debounce search to avoid excessive filtering
  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSetSearch(searchTerm);
    return () => debouncedSetSearch.cancel();
  }, [searchTerm, debouncedSetSearch]);
  
  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm
  };
};
```

## Memory Management

### Cleanup and Leak Prevention

```tsx
const MemoryOptimizedTable = () => {
  const abortControllerRef = useRef<AbortController>();
  const intervalRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Create abort controller for API requests
    abortControllerRef.current = new AbortController();
    
    // Setup periodic data refresh
    intervalRef.current = setInterval(() => {
      fetchData({ signal: abortControllerRef.current?.signal });
    }, 30000);
    
    return () => {
      // Cleanup on unmount
      abortControllerRef.current?.abort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Cleanup large data structures when not needed
  const cleanupData = useCallback(() => {
    // Clear caches
    cellRenderCache.current.clear();
    
    // Cancel pending operations
    pendingOperations.current.forEach(op => op.cancel());
    pendingOperations.current = [];
  }, []);
  
  return (
    <ReusableTable
      allColumns={columns}
      data={data}
      onUnmount={cleanupData}
    />
  );
};
```

### Large Object Handling

Handle large objects efficiently:

```tsx
// Use shallow comparison for large objects
const MemoizedRow = React.memo(({ row, columns }) => {
  return (
    <TableRow>
      {columns.map(col => (
        <TableCell key={col.accessor}>
          {renderCell(row[col.accessor])}
        </TableCell>
      ))}
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to avoid deep equality checks
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.row.version === nextProps.row.version
  );
});
```

## Bundle Size Optimization

### Tree Shaking

Import only what you need:

```tsx
// ❌ Imports entire library
import * as TableLibrary from 'advanced-reusable-table';

// ✅ Tree-shakeable imports
import { 
  ReusableTable, 
  ThemeProvider,
  useTable 
} from 'advanced-reusable-table';

// ✅ Even more specific imports
import { ReusableTable } from 'advanced-reusable-table/components/ReusableTable';
import { ThemeProvider } from 'advanced-reusable-table/components/ThemeProvider';
```

### Lazy Loading

Load table components only when needed:

```tsx
import { lazy, Suspense } from 'react';

// Lazy load the table component
const LazyTable = lazy(() => import('advanced-reusable-table').then(module => ({
  default: module.ReusableTable
})));

// Lazy load complex cell components
const LazyComplexCell = lazy(() => import('./ComplexCell'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading table...</div>}>
      <LazyTable
        allColumns={[
          {
            header: 'Complex Data',
            accessor: 'complexData',
            cell: (item) => (
              <Suspense fallback={<span>Loading...</span>}>
                <LazyComplexCell data={item.complexData} />
              </Suspense>
            )
          }
        ]}
        data={data}
        viewConfig={viewConfig}
      />
    </Suspense>
  );
};
```

## Mobile Performance

### Responsive Optimization

```tsx
const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return {
    isMobile,
    // Mobile-optimized configurations
    pageSize: isMobile ? 10 : 50,
    virtualized: !isMobile,  // Disable virtualization on mobile
    searchDebounce: isMobile ? 500 : 300
  };
};

const MobileOptimizedTable = () => {
  const { isMobile, pageSize, virtualized, searchDebounce } = useMobileOptimizations();
  
  return (
    <ReusableTable
      allColumns={isMobile ? mobileColumns : desktopColumns}
      data={data}
      viewConfig={viewConfig}
      virtualized={virtualized}
      globalSearch={{
        enabled: true,
        debounceMs: searchDebounce
      }}
      pagination={{
        enabled: true,
        pageSize
      }}
    />
  );
};
```

## Performance Monitoring

### Built-in Performance Metrics

```tsx
const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    dataLoadTime: 0,
    searchTime: 0,
    sortTime: 0
  });
  
  const measureOperation = useCallback(async (name: string, operation: () => Promise<any>) => {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      [name]: end - start
    }));
    
    return result;
  }, []);
  
  return { metrics, measureOperation };
};

// Usage
const MonitoredTable = () => {
  const { metrics, measureOperation } = usePerformanceMonitoring();
  
  const handleSort = useCallback(async (sortConfig) => {
    await measureOperation('sortTime', async () => {
      // Perform sorting operation
      return applySorting(data, sortConfig);
    });
  }, [data, measureOperation]);
  
  return (
    <>
      <ReusableTable
        onSort={handleSort}
        // ... other props
      />
      
      {/* Performance metrics display */}
      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        Render: {metrics.renderTime.toFixed(1)}ms | 
        Sort: {metrics.sortTime.toFixed(1)}ms
      </div>
    </>
  );
};
```

### Performance Profiling

```tsx
// Development-only performance profiling
const usePerformanceProfiler = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`${entry.name}: ${entry.duration}ms`);
        });
      });
      
      observer.observe({ entryTypes: ['measure', 'mark'] });
      
      return () => observer.disconnect();
    }
  }, []);
};

const ProfiledTable = () => {
  usePerformanceProfiler();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark('table-render-start');
    }
  }, []);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark('table-render-end');
      performance.measure('table-render', 'table-render-start', 'table-render-end');
    }
  });
  
  return <ReusableTable /* ... */ />;
};
```

## Performance Best Practices

### Data Structure Optimization

```typescript
// ✅ Use stable IDs for row keys
interface OptimizedRow {
  id: string;           // Stable, unique identifier
  version: number;      // For change tracking
  data: any;           // Actual row data
}

// ✅ Normalize nested data
interface NormalizedData {
  items: Record<string, Item>;
  collections: Record<string, Collection>;
  relationships: Record<string, string[]>;
}
```

### Rendering Strategies

```typescript
// Strategy 1: Fixed height rows (fastest)
const fixedHeightConfig = {
  virtualized: true,
  virtualizedOptions: {
    itemHeight: 48,      // Fixed height for all rows
    estimatedItemSize: 48
  }
};

// Strategy 2: Dynamic height with estimation (slower but flexible)
const dynamicHeightConfig = {
  virtualized: true,
  virtualizedOptions: {
    estimatedItemSize: 60,  // Average row height
    getItemSize: (index) => calculateRowHeight(data[index])
  }
};

// Strategy 3: Hybrid approach
const hybridConfig = {
  virtualized: data.length > 100,  // Only virtualize for large datasets
  compactMode: data.length > 1000  // Ultra-compact for very large datasets
};
```

### Common Anti-Patterns to Avoid

```tsx
// ❌ Creating new objects in render
const BadTable = () => (
  <ReusableTable
    columns={[{ header: 'Name', accessor: 'name' }]}  // New array every render
    data={data}
    viewConfig={{                                     // New object every render
      id: 'view',
      name: 'View',
      visibleColumns: ['name']
    }}
  />
);

// ✅ Use stable references
const GoodTable = () => {
  const columns = useMemo(() => [
    { header: 'Name', accessor: 'name' }
  ], []);
  
  const viewConfig = useMemo(() => ({
    id: 'view',
    name: 'View',
    visibleColumns: ['name']
  }), []);
  
  return (
    <ReusableTable
      columns={columns}
      data={data}
      viewConfig={viewConfig}
    />
  );
};

// ❌ Expensive operations in render
const BadCell = ({ value }) => {
  const processed = expensiveOperation(value);  // Runs every render
  return <div>{processed}</div>;
};

// ✅ Memoize expensive operations
const GoodCell = ({ value }) => {
  const processed = useMemo(() => expensiveOperation(value), [value]);
  return <div>{processed}</div>;
};
```

## Measuring Performance

### Key Metrics to Monitor

1. **First Contentful Paint** - Time to first table render
2. **Largest Contentful Paint** - Time to full table render
3. **Interaction to Next Paint** - Response time for user interactions
4. **Memory Usage** - RAM consumption over time
5. **JavaScript Heap Size** - Memory allocation patterns

### Performance Budget

```typescript
const performanceBudget = {
  initialRender: 100,      // ms - Time to first render
  sortOperation: 50,       // ms - Time to sort data
  filterOperation: 30,     // ms - Time to apply filters
  searchOperation: 20,     // ms - Time to search
  scrollResponse: 16,      // ms - Time to respond to scroll (60fps)
  memoryGrowth: 10,        // MB - Maximum memory growth per hour
  bundleSize: 50          // KB - Maximum gzipped bundle size
};
```

### Automated Performance Testing

```javascript
// Jest performance test
describe('Table Performance', () => {
  it('should render large dataset within budget', async () => {
    const start = performance.now();
    
    render(
      <ReusableTable
        data={generateLargeDataset(1000)}
        columns={testColumns}
        viewConfig={testView}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    
    const renderTime = performance.now() - start;
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });
  
  it('should handle sorting within budget', async () => {
    const { container } = render(<TestTable />);
    
    const start = performance.now();
    fireEvent.click(screen.getByText('Name'));
    
    await waitFor(() => {
      expect(container.querySelector('[aria-sort]')).toHaveAttribute('aria-sort', 'ascending');
    });
    
    const sortTime = performance.now() - start;
    expect(sortTime).toBeLessThan(50); // 50ms budget
  });
});
```

## Next Steps

- [Accessibility Guide](./accessibility.md) - Ensure performance optimizations don't compromise accessibility
- [Customization Guide](./customization.md) - Build performance-optimized custom components
- [Testing Guide](./testing.md) - Performance testing strategies
- [Migration Guide](./migration.md) - Optimize during migration from other table libraries