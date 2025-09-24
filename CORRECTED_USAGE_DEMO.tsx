import React, { useState } from 'react';
import { 
  ReusableTable, 
  useRowSelection, 
  ThemeProvider,
  type Column,
  type ViewConfiguration 
} from './src/index';

// Sample data types
interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
  salary: number;
  skills: string[];
}

interface DemoProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  tags: string[];
}

// Sample data
const users: DemoUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', salary: 75000, skills: ['React', 'TypeScript'] },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', salary: 65000, skills: ['Figma', 'CSS'] },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Manager', salary: 90000, skills: ['Leadership', 'Strategy'] },
];

const products: DemoProduct[] = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, inStock: true, tags: ['premium', 'business'] },
  { id: 2, name: 'Desk Chair', category: 'Furniture', price: 299.99, inStock: false, tags: ['ergonomic', 'office'] },
  { id: 3, name: 'Monitor 4K', category: 'Electronics', price: 599.99, inStock: true, tags: ['4k', 'gaming'] },
];

/**
 * CORRECTED USAGE DEMO
 * 
 * This demonstrates the FIXED API integration:
 * 1. ✅ useRowSelection uses 'mode' parameter (not 'selectionMode')
 * 2. ✅ Hook returns props that can be directly spread to ReusableTable
 * 3. ✅ CSS styles are bundled and automatically imported
 * 4. ✅ No complex workarounds needed
 */
const CorrectedUsageDemo: React.FC = () => {
  // Column definitions
  const userColumns: Column<DemoUser>[] = [
    { header: 'Name', accessor: 'name', sortable: true, filterable: true },
    { header: 'Email', accessor: 'email', sortable: true, filterable: true },
    { header: 'Role', accessor: 'role', sortable: true, filterable: true },
    { 
      header: 'Salary', 
      accessor: 'salary', 
      sortable: true, 
      filterable: true, 
      dataType: 'currency',
      currencyOptions: { locale: 'en-US', currency: 'USD' },
      align: 'right'
    },
    { 
      header: 'Skills', 
      accessor: 'skills', 
      dataType: 'collection',
      collectionConfig: {
        type: 'chip',
        options: [
          { value: 'React', label: 'React', color: '#61dafb' },
          { value: 'TypeScript', label: 'TypeScript', color: '#3178c6' },
          { value: 'Figma', label: 'Figma', color: '#f24e1e' },
          { value: 'CSS', label: 'CSS', color: '#1572b6' },
          { value: 'Leadership', label: 'Leadership', color: '#8b5cf6' },
          { value: 'Strategy', label: 'Strategy', color: '#10b981' },
        ]
      }
    },
  ];

  const productColumns: Column<DemoProduct>[] = [
    { header: 'Product Name', accessor: 'name', sortable: true, filterable: true },
    { header: 'Category', accessor: 'category', sortable: true, filterable: true },
    { 
      header: 'Price', 
      accessor: 'price', 
      sortable: true, 
      filterable: true, 
      dataType: 'currency',
      currencyOptions: { locale: 'en-US', currency: 'USD' },
      align: 'right'
    },
    { header: 'In Stock', accessor: 'inStock', cellType: 'checkbox' },
    { 
      header: 'Tags', 
      accessor: 'tags', 
      dataType: 'collection',
      collectionConfig: {
        type: 'chip',
        options: [
          { value: 'premium', label: 'Premium', color: '#fbbf24' },
          { value: 'business', label: 'Business', color: '#3b82f6' },
          { value: 'ergonomic', label: 'Ergonomic', color: '#10b981' },
          { value: 'office', label: 'Office', color: '#8b5cf6' },
          { value: '4k', label: '4K', color: '#ef4444' },
          { value: 'gaming', label: 'Gaming', color: '#f59e0b' },
        ]
      }
    },
  ];

  // View configurations
  const userViewConfig: ViewConfiguration<DemoUser> = {
    id: 'default-users',
    name: 'All Users',
    visibleColumns: ['name', 'email', 'role', 'salary', 'skills'],
    groupBy: [],
    sortConfig: [{ key: 'name', direction: 'ascending' }],
    filterConfig: [],
  };

  const productViewConfig: ViewConfiguration<DemoProduct> = {
    id: 'default-products',
    name: 'All Products', 
    visibleColumns: ['name', 'category', 'price', 'inStock', 'tags'],
    groupBy: [],
    sortConfig: [{ key: 'name', direction: 'ascending' }],
    filterConfig: [],
  };

  // ✅ CORRECTED: Using 'mode' parameter instead of 'selectionMode'
  const userRowSelection = useRowSelection<DemoUser>({
    data: users,
    mode: 'multiple', // ✅ Correct parameter name
    onSelectionChange: (selectedRows) => {
      console.log('Selected users:', selectedRows);
    },
  });

  const productRowSelection = useRowSelection<DemoProduct>({
    data: products,
    mode: 'single', // ✅ Correct parameter name
    onSelectionChange: (selectedRows) => {
      console.log('Selected products:', selectedRows);
    },
  });

  // Data update handlers
  const handleUserDataUpdate = (rowIndex: number, columnId: keyof DemoUser, value: any) => {
    console.log('Update user data:', { rowIndex, columnId, value });
    // In real app, update your state/database here
  };

  const handleProductDataUpdate = (rowIndex: number, columnId: keyof DemoProduct, value: any) => {
    console.log('Update product data:', { rowIndex, columnId, value });
    // In real app, update your state/database here
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--table-color-background,#111827)] text-[var(--table-color-text,#f3f4f6)] p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">✅ CORRECTED USAGE DEMO</h1>
            <p className="text-xl text-[var(--table-color-textMuted,#9ca3af)]">
              Demonstrates the fixed API integration without workarounds
            </p>
          </div>

          {/* Before/After Comparison */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-300">❌ Before (Broken)</h2>
              <div className="bg-gray-800 rounded p-4 font-mono text-sm">
                <div className="text-red-300">// API mismatch - doesn't work</div>
                <div className="text-gray-300 mt-2">
                  {`const hook = useRowSelection({`}<br/>
                  {`  data: users,`}<br/>
                  {`  mode: 'multiple', // ❌ Error`}<br/>
                  {`});`}
                </div>
                <div className="text-red-300 mt-4">// Complex workaround required</div>
                <div className="text-gray-300 mt-2">
                  {`rowSelection={{`}<br/>
                  {`  ...hook.selectionState,`}<br/>
                  {`  selectRow: hook.toggleRowSelection,`}<br/>
                  {`  selectAll: hook.toggleAllSelection,`}<br/>
                  {`  clearSelection: hook.clearSelection,`}<br/>
                  {`}}`}
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-300">✅ After (Fixed)</h2>
              <div className="bg-gray-800 rounded p-4 font-mono text-sm">
                <div className="text-green-300">// Correct API - works perfectly</div>
                <div className="text-gray-300 mt-2">
                  {`const hook = useRowSelection({`}<br/>
                  {`  data: users,`}<br/>
                  {`  mode: 'multiple', // ✅ Correct`}<br/>
                  {`});`}
                </div>
                <div className="text-green-300 mt-4">// Direct usage - no workarounds</div>
                <div className="text-gray-300 mt-2">
                  {`rowSelection={hook}`}<br/>
                  {`// That's it! 🎉`}
                </div>
              </div>
            </div>
          </section>

          {/* Users Table with Multiple Selection */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Users Table - Multiple Selection</h2>
              <p className="text-[var(--table-color-textMuted,#9ca3af)]">
                Select multiple users using checkboxes. Notice how the hook return value can be directly passed as rowSelection prop.
              </p>
            </div>
            
            {/* ✅ CORRECTED: Direct prop spreading without workarounds */}
            <ReusableTable<DemoUser>
              allColumns={userColumns}
              data={users}
              viewConfig={userViewConfig}
              onUpdateData={handleUserDataUpdate}
              rowSelection={userRowSelection} // ✅ Direct usage - no complex mapping needed!
            />

            <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-4">
              <h3 className="font-medium mb-2">Selection Status:</h3>
              <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                Selected: {userRowSelection.selectedRowsArray.length} users
                {userRowSelection.selectedRowsArray.length > 0 && (
                  <span className="ml-2">
                    [{userRowSelection.selectedRowsArray.map(user => user.name).join(', ')}]
                  </span>
                )}
              </p>
            </div>
          </section>

          {/* Products Table with Single Selection */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Products Table - Single Selection</h2>
              <p className="text-[var(--table-color-textMuted,#9ca3af)]">
                Select one product using radio-style selection. Toggle switches for in-stock status are editable.
              </p>
            </div>
            
            {/* ✅ CORRECTED: Direct prop spreading without workarounds */}
            <ReusableTable<DemoProduct>
              allColumns={productColumns}
              data={products}
              viewConfig={productViewConfig}
              onUpdateData={handleProductDataUpdate}
              rowSelection={productRowSelection} // ✅ Direct usage - no complex mapping needed!
            />

            <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-4">
              <h3 className="font-medium mb-2">Selection Status:</h3>
              <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                Selected: {productRowSelection.selectedRowsArray.length > 0 
                  ? productRowSelection.selectedRowsArray[0].name 
                  : 'None'}
              </p>
            </div>
          </section>

          {/* Success Criteria Summary */}
          <section className="bg-[var(--table-color-accent,#10b981)]/10 border border-[var(--table-color-accent,#10b981)]/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-accent,#10b981)]">
              ✅ Issues RESOLVED
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  CSS file is now bundled and automatically imported
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  API uses consistent 'mode' parameter naming
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Hook returns props that directly match table interface
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  No complex workarounds needed for row selection
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Component is genuinely reusable out-of-the-box
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Professional styling with theme system
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CorrectedUsageDemo;