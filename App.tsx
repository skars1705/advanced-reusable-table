import React, { useState, useMemo, useCallback } from 'react';
import { ReusableTable } from './src/components/ReusableTable';
import { GlobalSearch } from './src/components/GlobalSearch';
import { ThemeProvider } from './src/components/ThemeProvider';
import { useRowSelection } from './src/hooks/useRowSelection';
import { useGlobalSearch } from './src/hooks/useGlobalSearch';
import { userColumns, productColumns, payrollColumns, processPlansColumns, users as initialUsers, products as initialProducts, payrollRecords as initialPayroll, processPlans as initialProcessPlans } from './src/data/sampleData';
import type { User, Product, PayrollRecord, ProcessPlans } from './src/data/sampleData';
import type { Column, ViewConfiguration } from './src/types';
import { ViewEditor } from './src/components/ViewEditor';
import { PlusIcon } from './src/components/icons/PlusIcon';
import { PencilIcon } from './src/components/icons/PencilIcon';
import { React19CompatibilityTest } from './React19CompatibilityTest';

const createDefaultView = <T,>(columns: Column<T>[]): ViewConfiguration<T> => ({
  id: 'default',
  name: 'Default',
  visibleColumns: columns.map(c => c.accessor),
  groupBy: [],
  sortConfig: [],
  filterConfig: [],
});

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(initialPayroll);
  const [processPlans, setProcessPlans] = useState<ProcessPlans[]>(initialProcessPlans);

  // Row selection hooks
  const userSelection = useRowSelection<User>({ data: users, mode: 'multiple' });
  const productSelection = useRowSelection<Product>({ data: products, mode: 'multiple' });
  const payrollSelection = useRowSelection<PayrollRecord>({ data: payroll, mode: 'multiple' });
  const processPlansSelection = useRowSelection<ProcessPlans>({ data: processPlans, mode: 'multiple' });

  // Global search hooks
  const userGlobalSearch = useGlobalSearch<User>({ 
    data: users, 
    columns: userColumns, 
    config: { enabled: true, searchableColumns: ['name', 'email', 'department'] }
  });
  const productGlobalSearch = useGlobalSearch<Product>({ 
    data: products, 
    columns: productColumns, 
    config: { enabled: true, searchableColumns: ['name', 'category', 'description'] }
  });
  const payrollGlobalSearch = useGlobalSearch<PayrollRecord>({ 
    data: payroll, 
    columns: payrollColumns, 
    config: { enabled: true, searchableColumns: ['employeeName', 'department', 'position'] }
  });
  const processPlansGlobalSearch = useGlobalSearch<ProcessPlans>({ 
    data: processPlans, 
    columns: processPlansColumns, 
    config: { enabled: true, searchableColumns: ['Aktivitet', 'Aktivitetskommentar', 'Status'] }
  });


  const [userViews, setUserViews] = useState<ViewConfiguration<User>[]>([createDefaultView(userColumns)]);
  const [productViews, setProductViews] = useState<ViewConfiguration<Product>[]>([createDefaultView(productColumns)]);
  const [payrollViews, setPayrollViews] = useState<ViewConfiguration<PayrollRecord>[]>([createDefaultView(payrollColumns)]);
  const [processPlansViews, setProcessPlansViews] = useState<ViewConfiguration<ProcessPlans>[]>([createDefaultView(processPlansColumns)]);

  const [activeUserViewId, setActiveUserViewId] = useState('default');
  const [activeProductViewId, setActiveProductViewId] = useState('default');
  const [activePayrollViewId, setActivePayrollViewId] = useState('default');
  const [activeProcessPlansViewId, setActiveProcessPlansViewId] = useState('default');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingView, setEditingView] = useState<ViewConfiguration<any> | null>(null);
  const [editingTableType, setEditingTableType] = useState<'users' | 'products' | 'payroll' | 'processPlans' | null>(null);

  const activeUserView = useMemo(() => userViews.find(v => v.id === activeUserViewId)!, [userViews, activeUserViewId]);
  const activeProductView = useMemo(() => productViews.find(v => v.id === activeProductViewId)!, [productViews, activeProductViewId]);
  const activePayrollView = useMemo(() => payrollViews.find(v => v.id === activePayrollViewId)!, [payrollViews, activePayrollViewId]);
  const activeProcessPlansView = useMemo(() => processPlansViews.find(v => v.id === activeProcessPlansViewId)!, [processPlansViews, activeProcessPlansViewId]);

  const handleUserDataUpdate = (rowIndex: number, columnId: keyof User, value: any) => {
    setUsers(prevUsers => 
      prevUsers.map((row, index) => 
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const handleProductDataUpdate = (rowIndex: number, columnId: keyof Product, value: any) => {
    setProducts(prevProducts =>
      prevProducts.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };
  
  const handlePayrollDataUpdate = (rowIndex: number, columnId: keyof PayrollRecord, value: any) => {
    setPayroll(prev =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };
  
  const handleProcessPlansDataUpdate = (rowIndex: number, columnId: keyof ProcessPlans, value: any) => {
    setProcessPlans(prev =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };

  const handleOpenEditor = useCallback((view: ViewConfiguration<any> | null, type: 'users' | 'products' | 'payroll' | 'processPlans') => {
    setEditingView(view);
    setEditingTableType(type);
    setIsEditorOpen(true);
  }, []);

  const handleSaveView = (savedView: ViewConfiguration<any>) => {
    if (editingTableType === 'users') {
      setUserViews(prev => {
        const existingIndex = prev.findIndex(v => v.id === savedView.id);
        if (existingIndex > -1) {
          const newViews = [...prev];
          newViews[existingIndex] = savedView;
          return newViews;
        }
        return [...prev, savedView];
      });
      setActiveUserViewId(savedView.id);
    } else if (editingTableType === 'products') {
      setProductViews(prev => {
        const existingIndex = prev.findIndex(v => v.id === savedView.id);
        if (existingIndex > -1) {
          const newViews = [...prev];
          newViews[existingIndex] = savedView;
          return newViews;
        }
        return [...prev, savedView];
      });
      setActiveProductViewId(savedView.id);
    } else if (editingTableType === 'payroll') {
      setPayrollViews(prev => {
        const existingIndex = prev.findIndex(v => v.id === savedView.id);
        if (existingIndex > -1) {
          const newViews = [...prev];
          newViews[existingIndex] = savedView;
          return newViews;
        }
        return [...prev, savedView];
      });
      setActivePayrollViewId(savedView.id);
    } else if (editingTableType === 'processPlans') {
      setProcessPlansViews(prev => {
        const existingIndex = prev.findIndex(v => v.id === savedView.id);
        if (existingIndex > -1) {
          const newViews = [...prev];
          newViews[existingIndex] = savedView;
          return newViews;
        }
        return [...prev, savedView];
      });
      setActiveProcessPlansViewId(savedView.id);
    }
    setIsEditorOpen(false);
  };

  const ViewTabs = ({ views, activeViewId, setActiveViewId, onEdit, onCreate }: any) => (
    <div className="flex items-center border-b border-gray-700 mb-4 overflow-x-auto">
      {views.map((view: ViewConfiguration<any>) => (
        <button 
          key={view.id}
          onClick={() => setActiveViewId(view.id)}
          className={`flex-shrink-0 flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeViewId === view.id
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          {view.name}
          {view.id !== 'default' && (
            <span onClick={(e) => { e.stopPropagation(); onEdit(view); }} className="ml-2 text-gray-500 hover:text-white">
              <PencilIcon />
            </span>
          )}
        </button>
      ))}
      <button onClick={onCreate} className="ml-2 p-2 text-gray-400 hover:text-white">
        <PlusIcon />
      </button>
    </div>
  );

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Advanced Reusable Table
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          A powerful, generic table component with multi-column sorting, filtering, pagination, and savable views.
        </p>
      </header>

      {/* React 19.1.1 Compatibility Test Section */}
      <section className="mb-12">
        <React19CompatibilityTest />
      </section>

      <main className="space-y-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl ring-1 ring-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">Process Plans - Dynamic Mixed Content</h2>
              <p className="text-sm text-gray-400 mb-2 md:mb-0">Dynamic cell rendering: Collections, text labels, and placeholders based on row data</p>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch
                searchTerm={processPlansGlobalSearch.searchQuery}
                onSearchChange={processPlansGlobalSearch.handleSearchChange}
                placeholder="Search process plans..."
                className="w-64"
                variant="default"
                showResultsCount={true}
                resultsCount={processPlansGlobalSearch.filteredData.length}
              />
              {processPlansSelection.selectedRows.size > 0 && (
                <div className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg">
                  {processPlansSelection.selectedRows.size} selected
                </div>
              )}
              <div className="text-sm bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg">
                <strong>Smart Rendering:</strong> Different cell types per row!
              </div>
            </div>
          </div>
          <ViewTabs
            views={processPlansViews}
            activeViewId={activeProcessPlansViewId}
            setActiveViewId={setActiveProcessPlansViewId}
            onEdit={(view: ViewConfiguration<ProcessPlans>) => handleOpenEditor(view, 'processPlans')}
            onCreate={() => handleOpenEditor(null, 'processPlans')}
          />
          <ReusableTable<ProcessPlans> 
            allColumns={processPlansColumns as Column<ProcessPlans>[]} 
            data={processPlansGlobalSearch.filteredData}
            viewConfig={activeProcessPlansView}
            onUpdateData={handleProcessPlansDataUpdate}
            rowSelection={processPlansSelection}
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl ring-1 ring-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">Payroll Data</h2>
            <div className="flex items-center space-x-4">
              <GlobalSearch
                searchTerm={payrollGlobalSearch.searchQuery}
                onSearchChange={payrollGlobalSearch.handleSearchChange}
                placeholder="Search payroll records..."
                className="w-64"
                variant="default"
                showResultsCount={true}
                resultsCount={payrollGlobalSearch.filteredData.length}
              />
              {payrollSelection.selectedRows.size > 0 && (
                <div className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg">
                  {payrollSelection.selectedRows.size} selected
                </div>
              )}
            </div>
          </div>
          <ViewTabs
            views={payrollViews}
            activeViewId={activePayrollViewId}
            setActiveViewId={setActivePayrollViewId}
            onEdit={(view: ViewConfiguration<PayrollRecord>) => handleOpenEditor(view, 'payroll')}
            onCreate={() => handleOpenEditor(null, 'payroll')}
          />
          <ReusableTable<PayrollRecord> 
            allColumns={payrollColumns as Column<PayrollRecord>[]} 
            data={payrollGlobalSearch.filteredData}
            viewConfig={activePayrollView}
            onUpdateData={handlePayrollDataUpdate}
            rowSelection={payrollSelection}
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl ring-1 ring-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">Users Data</h2>
            <div className="flex items-center space-x-4">
              <GlobalSearch
                searchTerm={userGlobalSearch.searchQuery}
                onSearchChange={userGlobalSearch.handleSearchChange}
                placeholder="Search users..."
                className="w-64"
                variant="compact"
                showResultsCount={true}
                resultsCount={userGlobalSearch.filteredData.length}
              />
              {userSelection.selectedRows.size > 0 && (
                <div className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg">
                  {userSelection.selectedRows.size} selected
                </div>
              )}
              <div className="text-sm bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg">
                <strong>Pro Tip:</strong> Use the '+' to create custom views of the data.
              </div>
            </div>
          </div>
          <ViewTabs
            views={userViews}
            activeViewId={activeUserViewId}
            setActiveViewId={setActiveUserViewId}
            onEdit={(view: ViewConfiguration<User>) => handleOpenEditor(view, 'users')}
            onCreate={() => handleOpenEditor(null, 'users')}
          />
          <ReusableTable<User> 
            allColumns={userColumns as Column<User>[]} 
            data={userGlobalSearch.filteredData} 
            viewConfig={activeUserView}
            onUpdateData={handleUserDataUpdate}
            rowSelection={userSelection}
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl ring-1 ring-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">Products Data</h2>
            <div className="flex items-center space-x-4">
              <GlobalSearch
                searchTerm={productGlobalSearch.searchQuery}
                onSearchChange={productGlobalSearch.handleSearchChange}
                placeholder="Search products..."
                className="w-64"
                variant="default"
                showResultsCount={false}
              />
              {productSelection.selectedRows.size > 0 && (
                <div className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg">
                  {productSelection.selectedRows.size} selected
                </div>
              )}
            </div>
          </div>
          <ViewTabs
            views={productViews}
            activeViewId={activeProductViewId}
            setActiveViewId={setActiveProductViewId}
            onEdit={(view: ViewConfiguration<Product>) => handleOpenEditor(view, 'products')}
            onCreate={() => handleOpenEditor(null, 'products')}
          />
          <ReusableTable<Product> 
            allColumns={productColumns as Column<Product>[]} 
            data={productGlobalSearch.filteredData}
            viewConfig={activeProductView}
            onUpdateData={handleProductDataUpdate}
            rowSelection={productSelection}
          />
        </div>
        
        
      </main>

      {isEditorOpen && editingTableType === 'payroll' && (
        <ViewEditor<PayrollRecord>
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveView}
            initialView={editingView as ViewConfiguration<PayrollRecord> | null}
            allColumns={payrollColumns}
        />
      )}
      
      {isEditorOpen && editingTableType === 'users' && (
        <ViewEditor<User>
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveView}
            initialView={editingView as ViewConfiguration<User> | null}
            allColumns={userColumns}
        />
      )}
      
      {isEditorOpen && editingTableType === 'products' && (
        <ViewEditor<Product>
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveView}
            initialView={editingView as ViewConfiguration<Product> | null}
            allColumns={productColumns}
        />
      )}
      
      {isEditorOpen && editingTableType === 'processPlans' && (
        <ViewEditor<ProcessPlans>
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveView}
            initialView={editingView as ViewConfiguration<ProcessPlans> | null}
            allColumns={processPlansColumns}
        />
      )}
      
      <footer className="text-center mt-12 py-6 border-t border-gray-700">
        <p className="text-gray-500">Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;