# Editable Table: Full CRUD Operations

Complete example demonstrating inline editing, data validation, and CRUD operations with optimistic updates and error handling.

## Overview

This example showcases:
- **Inline Editing** - Click to edit cells directly
- **Data Validation** - Client-side validation with error messages
- **Optimistic Updates** - Immediate UI updates with rollback on error
- **CRUD Operations** - Create, read, update, delete functionality
- **State Management** - Proper React state handling for table data
- **Error Handling** - User-friendly error messages and recovery

## Implementation

### Data Structure

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  tags: string[];
  lastUpdated: string;
  createdBy: string;
}

interface ValidationError {
  field: keyof Product;
  message: string;
}
```

### Sample Data

```typescript
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    category: 'Electronics',
    inStock: true,
    tags: ['wireless', 'audio', 'premium'],
    lastUpdated: '2024-01-20',
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Coffee Mug',
    description: 'Ceramic coffee mug with company logo',
    price: 12.99,
    category: 'Office Supplies',
    inStock: false,
    tags: ['ceramic', 'branded'],
    lastUpdated: '2024-01-18',
    createdBy: 'marketing'
  },
  {
    id: '3',
    name: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with USB charging port',
    price: 79.99,
    category: 'Furniture',
    inStock: true,
    tags: ['led', 'adjustable', 'usb'],
    lastUpdated: '2024-01-19',
    createdBy: 'facilities'
  }
];
```

### Column Configuration

```typescript
import type { Column } from 'advanced-reusable-table';

const productColumns: Column<Product>[] = [
  {
    header: 'Product Name',
    accessor: 'name',
    dataType: 'string',
    sortable: true,
    filterable: true,
    editable: true,
    // Validation rules
    validate: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'Product name is required';
      }
      if (value.length < 3) {
        return 'Product name must be at least 3 characters';
      }
      if (value.length > 100) {
        return 'Product name must be less than 100 characters';
      }
      return null;
    }
  },
  
  {
    header: 'Description',
    accessor: 'description',
    dataType: 'string',
    filterable: true,
    editable: true,
    // Multi-line text editing
    cellProps: {
      multiline: true,
      rows: 2
    },
    validate: (value: string) => {
      if (value && value.length > 500) {
        return 'Description must be less than 500 characters';
      }
      return null;
    }
  },
  
  {
    header: 'Price',
    accessor: 'price',
    dataType: 'currency',
    currencyOptions: {
      locale: 'en-US',
      currency: 'USD'
    },
    sortable: true,
    filterable: true,
    editable: true,
    align: 'right',
    validate: (value: number) => {
      if (value == null || value === undefined) {
        return 'Price is required';
      }
      if (value <= 0) {
        return 'Price must be greater than 0';
      }
      if (value > 10000) {
        return 'Price must be less than $10,000';
      }
      return null;
    }
  },
  
  {
    header: 'Category',
    accessor: 'category',
    dataType: 'collection',
    collectionConfig: {
      type: 'radio',
      inputMode: 'chips',
      viewDisplayMode: 'inline',
      options: [
        { value: 'Electronics', label: 'Electronics', color: '#3b82f6' },
        { value: 'Office Supplies', label: 'Office Supplies', color: '#8b5cf6' },
        { value: 'Furniture', label: 'Furniture', color: '#22c55e' },
        { value: 'Clothing', label: 'Clothing', color: '#f59e0b' },
        { value: 'Books', label: 'Books', color: '#ef4444' }
      ],
      required: true
    },
    sortable: true,
    filterable: true,
    editable: true,
    groupable: true
  },
  
  {
    header: 'In Stock',
    accessor: 'inStock',
    cellType: 'toggle',
    sortable: true,
    filterable: true,
    editable: true,
    align: 'center'
  },
  
  {
    header: 'Tags',
    accessor: 'tags',
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      inputMode: 'chips',
      viewDisplayMode: 'auto',
      inlineThreshold: 3,
      options: [
        { value: 'wireless', label: 'Wireless', color: '#3b82f6' },
        { value: 'audio', label: 'Audio', color: '#8b5cf6' },
        { value: 'premium', label: 'Premium', color: '#f59e0b' },
        { value: 'ceramic', label: 'Ceramic', color: '#22c55e' },
        { value: 'branded', label: 'Branded', color: '#ef4444' },
        { value: 'led', label: 'LED', color: '#06b6d4' },
        { value: 'adjustable', label: 'Adjustable', color: '#84cc16' },
        { value: 'usb', label: 'USB', color: '#f97316' }
      ],
      searchable: true,
      maxSelections: 5
    },
    editable: true
  },
  
  {
    header: 'Last Updated',
    accessor: 'lastUpdated',
    dataType: 'date',
    dateOptions: {
      locale: 'en-US',
      dateStyle: 'short'
    },
    sortable: true,
    filterable: true
  },
  
  {
    header: 'Created By',
    accessor: 'createdBy',
    dataType: 'string',
    filterable: true,
    editable: false,  // Read-only field
    cell: (product) => (
      <span style={{
        fontSize: '0.875rem',
        color: 'var(--table-color-textMuted, #6b7280)',
        fontStyle: 'italic'
      }}>
        {product.createdBy}
      </span>
    )
  }
];
```

### Complete Component with CRUD Operations

```tsx
import React, { useState, useCallback, useMemo } from 'react';
import { 
  ReusableTable, 
  ThemeProvider,
  type ViewConfiguration,
  type Column 
} from 'advanced-reusable-table';
import 'advanced-reusable-table/dist/style.css';

const EditableProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Generate unique ID for new products
  const generateId = () => `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Validation function
  const validateProduct = useCallback((product: Product): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!product.name || product.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Product name is required' });
    }
    
    if (product.price <= 0) {
      errors.push({ field: 'price', message: 'Price must be greater than 0' });
    }
    
    if (!product.category) {
      errors.push({ field: 'category', message: 'Category is required' });
    }
    
    return errors;
  }, []);
  
  // Mock API functions
  const api = {
    updateProduct: async (product: Product): Promise<Product> => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Simulate validation error
      if (product.name.toLowerCase().includes('error')) {
        throw new Error('Invalid product name');
      }
      
      return {
        ...product,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    },
    
    deleteProduct: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (id === 'error') {
        throw new Error('Cannot delete this product');
      }
    },
    
    createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        ...product,
        id: generateId(),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }
  };
  
  // Show notification helper
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);
  
  // Handle cell updates with optimistic updates
  const handleUpdateData = useCallback(async (
    rowIndex: number, 
    columnId: keyof Product, 
    newValue: any
  ) => {
    const product = products[rowIndex];
    const originalProduct = { ...product };
    
    // Optimistic update
    const updatedProduct = { ...product, [columnId]: newValue };
    
    // Client-side validation
    const validationErrors = validateProduct(updatedProduct);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showNotification('error', validationErrors[0].message);
      return;
    }
    
    // Update UI immediately (optimistic)
    setProducts(prev => prev.map((p, i) => i === rowIndex ? updatedProduct : p));
    setIsLoading(true);
    setErrors([]);
    
    try {
      // Call API
      const savedProduct = await api.updateProduct(updatedProduct);
      
      // Update with server response
      setProducts(prev => prev.map((p, i) => i === rowIndex ? savedProduct : p));
      showNotification('success', 'Product updated successfully');
      
    } catch (error) {
      // Rollback on error
      setProducts(prev => prev.map((p, i) => i === rowIndex ? originalProduct : p));
      showNotification('error', `Update failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [products, validateProduct, showNotification]);
  
  // Handle row deletion
  const handleDeleteRows = useCallback(async (selectedProducts: Product[]) => {
    const idsToDelete = selectedProducts.map(p => p.id);
    
    // Optimistic removal
    setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
    setIsLoading(true);
    
    try {
      // Delete each product
      await Promise.all(idsToDelete.map(id => api.deleteProduct(id)));
      showNotification('success', `${idsToDelete.length} product(s) deleted successfully`);
      
    } catch (error) {
      // Rollback - would need to restore from backup in real app
      showNotification('error', `Delete failed: ${error.message}`);
      // In a real app, you'd restore the deleted items or reload from server
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);
  
  // Handle new product creation
  const handleCreateProduct = useCallback(async () => {
    const newProduct: Omit<Product, 'id'> = {
      name: 'New Product',
      description: '',
      price: 0,
      category: 'Electronics',
      inStock: true,
      tags: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: 'current-user'
    };
    
    setIsLoading(true);
    
    try {
      const createdProduct = await api.createProduct(newProduct);
      setProducts(prev => [createdProduct, ...prev]);
      showNotification('success', 'New product created successfully');
      
    } catch (error) {
      showNotification('error', `Create failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);
  
  // View configuration
  const defaultView: ViewConfiguration<Product> = useMemo(() => ({
    id: 'product-management',
    name: 'Product Management',
    visibleColumns: [
      'name', 'description', 'price', 'category', 
      'inStock', 'tags', 'lastUpdated', 'createdBy'
    ],
    groupBy: [],
    sortConfig: [
      { key: 'lastUpdated', direction: 'descending' }
    ],
    filterConfig: []
  }), []);
  
  return (
    <ThemeProvider>
      <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header with actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: 'var(--table-color-text, #1f2937)'
            }}>
              Product Management
            </h1>
            <p style={{ 
              color: 'var(--table-color-textMuted, #6b7280)',
              fontSize: '1.125rem'
            }}>
              Full CRUD operations with inline editing and validation
            </p>
          </div>
          
          <button
            onClick={handleCreateProduct}
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--table-color-primary, #3b82f6)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Creating...' : 'Add Product'}
          </button>
        </div>
        
        {/* Notification */}
        {notification && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '6px',
            backgroundColor: notification.type === 'success' 
              ? 'var(--table-color-success, #22c55e)' 
              : 'var(--table-color-error, #ef4444)',
            color: 'white',
            fontWeight: '500'
          }}>
            {notification.message}
          </div>
        )}
        
        {/* Error display */}
        {errors.length > 0 && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '6px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b'
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Table */}
        <ReusableTable
          allColumns={productColumns}
          data={products}
          viewConfig={defaultView}
          onUpdateData={handleUpdateData}
          rowSelection={{
            enabled: true,
            mode: 'multiple',
            onSelectionChange: (selected) => {
              // Could show bulk actions based on selection
            }
          }}
          loading={isLoading}
        />
        
        {/* Bulk actions */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'var(--table-color-surface, #f8fafc)',
          borderRadius: '6px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span style={{ 
            fontSize: '14px', 
            color: 'var(--table-color-textMuted, #6b7280)' 
          }}>
            Bulk Actions:
          </span>
          <button
            onClick={() => {
              // Would implement bulk delete for selected rows
              console.log('Bulk delete selected rows');
            }}
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--table-color-error, #ef4444)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            Delete Selected
          </button>
        </div>
        
        {/* Statistics */}
        <div style={{
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--table-color-surface, #f8fafc)',
            borderRadius: '8px',
            border: '1px solid var(--table-color-border, #e5e7eb)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'semibold', marginBottom: '4px' }}>
              Total Products
            </h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--table-color-primary)' }}>
              {products.length}
            </p>
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--table-color-surface, #f8fafc)',
            borderRadius: '8px',
            border: '1px solid var(--table-color-border, #e5e7eb)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'semibold', marginBottom: '4px' }}>
              In Stock
            </h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--table-color-success)' }}>
              {products.filter(p => p.inStock).length}
            </p>
          </div>
          
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--table-color-surface, #f8fafc)',
            borderRadius: '8px',
            border: '1px solid var(--table-color-border, #e5e7eb)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'semibold', marginBottom: '4px' }}>
              Average Price
            </h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--table-color-accent)' }}>
              ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default EditableProductTable;
```

## Key Features Demonstrated

### 1. Optimistic Updates
```typescript
// Update UI immediately
setProducts(prev => prev.map((p, i) => i === rowIndex ? updatedProduct : p));

try {
  await api.updateProduct(updatedProduct);
} catch (error) {
  // Rollback on error
  setProducts(prev => prev.map((p, i) => i === rowIndex ? originalProduct : p));
}
```

### 2. Client-Side Validation
```typescript
const validateProduct = (product: Product): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!product.name || product.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Product name is required' });
  }
  
  return errors;
};
```

### 3. Error Handling with User Feedback
```typescript
const showNotification = (type: 'success' | 'error', message: string) => {
  setNotification({ type, message });
  setTimeout(() => setNotification(null), 3000);
};
```

### 4. Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

// Show loading in UI
<ReusableTable
  loading={isLoading}
  // ... other props
/>
```

## Advanced Patterns

### Conditional Editing
```typescript
{
  header: 'Price',
  accessor: 'price',
  editable: (row) => row.status !== 'archived' && row.userCanEdit
}
```

### Custom Validation
```typescript
{
  header: 'Email',
  accessor: 'email',
  validate: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email';
  }
}
```

### Bulk Operations
```typescript
const handleBulkUpdate = async (updates: Record<string, any>) => {
  const selectedRows = getSelectedRows();
  
  try {
    await Promise.all(
      selectedRows.map(row => 
        api.updateProduct({ ...row, ...updates })
      )
    );
    showNotification('success', 'Bulk update completed');
  } catch (error) {
    showNotification('error', 'Bulk update failed');
  }
};
```

## Testing CRUD Operations

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('EditableProductTable', () => {
  it('updates product name when edited', async () => {
    render(<EditableProductTable />);
    
    // Click on a product name to edit
    const nameCell = screen.getByText('Wireless Headphones');
    fireEvent.click(nameCell);
    
    // Edit the name
    const input = screen.getByDisplayValue('Wireless Headphones');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Headphones');
    
    // Save changes
    fireEvent.blur(input);
    
    // Verify update
    await waitFor(() => {
      expect(screen.getByText('Updated Headphones')).toBeInTheDocument();
    });
  });
  
  it('shows validation error for invalid price', async () => {
    render(<EditableProductTable />);
    
    // Edit price to invalid value
    const priceCell = screen.getByText('$299.99');
    fireEvent.click(priceCell);
    
    const input = screen.getByDisplayValue('299.99');
    await userEvent.clear(input);
    await userEvent.type(input, '-10');
    fireEvent.blur(input);
    
    // Verify validation error
    await waitFor(() => {
      expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();
    });
  });
  
  it('creates new product', async () => {
    render(<EditableProductTable />);
    
    const addButton = screen.getByText('Add Product');
    fireEvent.click(addButton);
    
    // Verify new product appears
    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument();
    });
  });
});
```

## Performance Considerations

### Memoization
```tsx
const memoizedColumns = useMemo(() => productColumns, []);
const memoizedView = useMemo(() => defaultView, []);
```

### Debounced Updates
```typescript
const debouncedUpdate = useMemo(
  () => debounce((rowIndex, columnId, value) => {
    handleUpdateData(rowIndex, columnId, value);
  }, 500),
  [handleUpdateData]
);
```

### Virtual Scrolling
For large datasets (1000+ rows), enable virtualization:
```tsx
<ReusableTable
  virtualized={true}
  virtualizedOptions={{
    itemHeight: 60,
    overscanCount: 10
  }}
  {...otherProps}
/>
```

## Next Steps

- [Process Plans](./process-plans.md) - Dynamic rendering showcase
- [Performance Guide](../advanced/performance.md) - Optimize for large datasets
- [Validation Patterns](../guides/validation.md) - Advanced validation techniques
- [State Management](../advanced/state-management.md) - Complex state patterns