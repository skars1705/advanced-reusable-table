import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Column, ViewConfiguration, SortConfig, FilterConfig, FilterOperator, StringFilterOperator, NumberFilterOperator, DateFilterOperator } from '../types';
import { useDndList } from '../hooks/useDndList';
import { SortIcon } from './icons/SortIcon';
import { SortUpIcon } from './icons/SortUpIcon';
import { SortDownIcon } from './icons/SortDownIcon';
import { FilterIcon } from './icons/FilterIcon';
import { StringOperatorLabels, NumberOperatorLabels, DateOperatorLabels } from '../types';
import { XIcon } from './icons/XIcon';

interface ViewEditorProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (view: ViewConfiguration<T>) => void;
  initialView: ViewConfiguration<T> | null;
  allColumns: Column<T>[];
}

// A single, detached popover component to avoid being clipped by scrollable containers.
const FilterPopoverContent = <T,>({
  column,
  filterConfig,
  onFilterChange,
  onClose,
  coords,
}: {
  column: Column<T>;
  filterConfig: FilterConfig<T> | undefined;
  onFilterChange: (newFilter: FilterConfig<T> | null) => void;
  onClose: () => void;
  coords: { top: number, right: number };
}) => {
  const defaultStringOp: StringFilterOperator = 'contains';
  const defaultNumberOp: NumberFilterOperator = 'eq';
  const defaultDateOp: DateFilterOperator = 'is';

  const isNumeric = column.dataType === 'number' || column.dataType === 'currency';
  const isDate = column.dataType === 'date';
  const isDateTime = column.dataType === 'datetime';
  const initialOperator = filterConfig?.operator || (isNumeric ? defaultNumberOp : (isDate || isDateTime) ? defaultDateOp : defaultStringOp);
  const initialValue = filterConfig?.value || '';

  const [operator, setOperator] = useState<FilterOperator>(initialOperator);
  const [value, setValue] = useState(initialValue);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleApply = () => {
    if (value.trim() !== '') {
      onFilterChange({ key: column.accessor, operator, value });
    } else {
      onFilterChange(null);
    }
    onClose();
  };

  const operators = isNumeric
    ? Object.entries(NumberOperatorLabels)
    : (isDate || isDateTime)
    ? Object.entries(DateOperatorLabels)
    : Object.entries(StringOperatorLabels);

  return (
    <div 
      ref={popoverRef} 
      className="fixed z-50 w-64 bg-gray-800 rounded-lg shadow-2xl ring-1 ring-white/10 p-4 space-y-3"
      style={{ top: `${coords.top}px`, right: `${coords.right}px` }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Filter: {column.header}</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><XIcon /></button>
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Condition</label>
        <select value={operator} onChange={e => setOperator(e.target.value as FilterOperator)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200">
          {operators.map(([opValue, label]) => <option key={opValue} value={opValue}>{label}</option>)}
        </select>
      </div>
       <div>
        <label className="text-xs text-gray-400 block mb-1">Value</label>
        <input type={isNumeric ? 'number' : isDate ? 'date' : isDateTime ? 'datetime-local' : 'text'} value={value} onChange={e => setValue(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-sm text-gray-200" autoFocus />
      </div>
      <button onClick={handleApply} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Apply</button>
    </div>
  );
};


export const ViewEditor = <T,>({
  isOpen,
  onClose,
  onSave,
  initialView,
  allColumns,
}: ViewEditorProps<T>) => {
  const [viewName, setViewName] = useState('');
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<keyof T>>(new Set());
  const [activeGroupTab, setActiveGroupTab] = useState<'recommended' | 'all'>('recommended');
  
  const [sortConfig, setSortConfig] = useState<SortConfig<T>[]>([]);
  const [filterConfig, setFilterConfig] = useState<FilterConfig<T>[]>([]);
  
  // State for the single, detached popover
  const [editingFilterKey, setEditingFilterKey] = useState<keyof T | null>(null);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number, right: number } | null>(null);


  const { items: orderedVisibleColumns, setItems: setOrderedVisibleColumns, getDraggableProps } = useDndList<Column<T>>([]);
  const { items: activeGroups, setItems: setActiveGroups, getDraggableProps: getGroupDraggableProps } = useDndList<Column<T>>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialView) {
        setViewName(initialView.name);
        const visibleSet = new Set(initialView.visibleColumns);
        setVisibleColumnKeys(visibleSet);
        
        const ordered = initialView.visibleColumns
          .map(key => allColumns.find(c => c.accessor === key)!)
          .filter(Boolean);
        setOrderedVisibleColumns(ordered);

        const groups = initialView.groupBy
          .map(key => allColumns.find(c => c.accessor === key)!)
          .filter(Boolean);
        setActiveGroups(groups);

        setSortConfig(initialView.sortConfig || []);
        setFilterConfig(initialView.filterConfig || []);

      } else {
        // Reset for new view
        setViewName('');
        const defaultVisible = allColumns.map(c => c.accessor);
        setVisibleColumnKeys(new Set(defaultVisible));
        setOrderedVisibleColumns([...allColumns]);
        setActiveGroups([]);
        setSortConfig([]);
        setFilterConfig([]);
      }
      setActiveGroupTab('recommended'); // Reset tab on open
    } else {
      // Clean up popover state when modal closes
      setEditingFilterKey(null);
      setPopoverCoords(null);
    }
  }, [isOpen, initialView, allColumns, setOrderedVisibleColumns, setActiveGroups]);

  const handleFilterIconClick = (key: keyof T, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const popoverHeight = 230; // Approximate height of the popover in pixels
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    
    let top;
    // If not enough space below, and more space above, flip it
    if (spaceBelow < popoverHeight && buttonRect.top > popoverHeight) {
      top = buttonRect.top - popoverHeight - 8; // Position above with a small gap
    } else {
      top = buttonRect.bottom + 8; // Default position below with a small gap
    }
    
    const right = window.innerWidth - buttonRect.right;
    
    setPopoverCoords({ top, right });
    setEditingFilterKey(key);
  };


  const handleToggleColumnVisibility = (key: keyof T) => {
    const newSet = new Set(visibleColumnKeys);
    let newOrdered = [...orderedVisibleColumns];
    if (newSet.has(key)) {
      newSet.delete(key);
      newOrdered = newOrdered.filter(c => c.accessor !== key);
    } else {
      newSet.add(key);
      const columnToAdd = allColumns.find(c => c.accessor === key);
      if (columnToAdd) {
        newOrdered.push(columnToAdd);
      }
    }
    setVisibleColumnKeys(newSet);
    setOrderedVisibleColumns(newOrdered);
  };

  const handleSortClick = (key: keyof T) => {
    setSortConfig(prev => {
        const existingIndex = prev.findIndex(s => s.key === key);
        if (existingIndex > -1) {
            const current = prev[existingIndex];
            if (current.direction === 'ascending') {
                const newConfig = [...prev];
                newConfig[existingIndex] = { ...current, direction: 'descending' };
                return newConfig;
            } else {
                return prev.filter(s => s.key !== key);
            }
        } else {
            return [...prev, { key, direction: 'ascending' }];
        }
    });
  };

  const handleFilterChange = (newFilter: FilterConfig<T> | null) => {
    setFilterConfig(prev => {
      const keyToUpdate = editingFilterKey;
      if (!keyToUpdate) return prev;

      const otherFilters = prev.filter(f => f.key !== keyToUpdate);
      if (newFilter) {
        return [...otherFilters, newFilter];
      }
      return otherFilters;
    });
  };

  const availableGroupColumnsRecommended = useMemo(() => {
    const activeKeys = new Set(activeGroups.map(g => g.accessor));
    return allColumns.filter(c => c.groupable && !activeKeys.has(c.accessor));
  }, [allColumns, activeGroups]);
  
  const availableGroupColumnsAll = useMemo(() => {
    const activeKeys = new Set(activeGroups.map(g => g.accessor));
    return allColumns.filter(c => !activeKeys.has(c.accessor));
  }, [allColumns, activeGroups]);

  const addGroup = (key: keyof T) => {
    const column = allColumns.find(c => c.accessor === key);
    if (column && !activeGroups.some(g => g.accessor === key)) {
      setActiveGroups([...activeGroups, column]);
    }
  };

  const removeGroup = (key: keyof T) => {
    setActiveGroups(activeGroups.filter(g => g.accessor !== key));
  };


  const handleSave = () => {
    const finalView: ViewConfiguration<T> = {
      id: initialView?.id || `view_${Date.now()}`,
      name: viewName.trim() || 'Untitled View',
      visibleColumns: orderedVisibleColumns.map(c => c.accessor),
      groupBy: activeGroups.map(g => g.accessor),
      sortConfig,
      filterConfig,
    };
    onSave(finalView);
  };

  if (!isOpen) return null;
  
  const editingFilterColumn = useMemo(() => 
    editingFilterKey ? allColumns.find(c => c.accessor === editingFilterKey) : null,
  [editingFilterKey, allColumns]);

  const DraggableGroupItem = ({ item, isDragging, onRemove, ...props }: any) => (
     <div {...props} className={`flex items-center justify-between p-2 rounded-md transition-shadow ${isDragging ? 'shadow-lg bg-gray-600' : 'bg-gray-700'}`}>
        <span>{item.header}</span>
        <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2 cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <button onClick={onRemove} className="text-gray-400 hover:text-white text-xl font-bold leading-none">&times;</button>
        </div>
    </div>
  );

  const GroupingColumnList = ({ columns, onAdd }: { columns: Column<T>[], onAdd: (key: keyof T) => void }) => (
    <div className="flex flex-wrap gap-2">
      {columns.map(col => (
        <button key={String(col.accessor)} onClick={() => onAdd(col.accessor)} className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
          {col.header} +
        </button>
      ))}
      {columns.length === 0 && <p className="text-xs text-gray-500 w-full">No available columns.</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col ring-1 ring-white/10">
        <header className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialView ? 'Edit View' : 'Create New View'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          <div>
            <label htmlFor="view-name" className="block text-sm font-medium text-gray-300 mb-1">View Name</label>
            <input
              type="text"
              id="view-name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Sales Report"
              disabled={initialView?.id === 'default'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column Visibility, Order, Sort, and Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold">Columns (Visible & Ordered)</h3>
              <p className="text-sm text-gray-400">Drag to reorder. Use controls to set default sort and filters.</p>
              <div className="p-2 bg-gray-900/50 rounded-lg space-y-2 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                    {orderedVisibleColumns.map((col, index) => {
                      const sort = sortConfig.find(s => s.key === col.accessor);
                      const sortIndex = sort ? sortConfig.indexOf(sort) : -1;
                      const filter = filterConfig.find(f => f.key === col.accessor);
                      
                      return (
                        <div key={String(col.accessor)} {...getDraggableProps(index)}
                             className={`flex items-center justify-between p-2 rounded-md transition-shadow ${getDraggableProps(index).isDragging ? 'shadow-lg bg-gray-600' : 'bg-gray-700'}`}>
                          <span>{col.header}</span>
                          <div className="flex items-center space-x-2">
                            {col.sortable && (
                               <button onClick={() => handleSortClick(col.accessor)} className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                                {sort?.direction === 'ascending' ? <SortUpIcon /> : sort?.direction === 'descending' ? <SortDownIcon /> : <SortIcon />}
                                <div className="w-4 text-center">
                                    {sortIndex > -1 && <span className="text-xs font-bold text-indigo-300">{sortIndex + 1}</span>}
                                </div>
                               </button>
                            )}
                            {col.filterable && (
                                <button onClick={(e) => handleFilterIconClick(col.accessor, e)} className={filter ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-400'}>
                                    <FilterIcon />
                                </button>
                            )}
                            <svg className="w-5 h-5 text-gray-400 cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <details className="text-sm">
                <summary className="cursor-pointer text-indigo-400 hover:underline">Manage all columns</summary>
                <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-gray-900/50 rounded-lg">
                    {allColumns.map(col => (
                        <label key={String(col.accessor)} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                                checked={visibleColumnKeys.has(col.accessor)}
                                onChange={() => handleToggleColumnVisibility(col.accessor)}
                            />
                            <span>{col.header}</span>
                        </label>
                    ))}
                </div>
              </details>
            </div>

            {/* Grouping Configuration */}
            <div className="space-y-3 flex flex-col">
              <h3 className="font-semibold">Grouping</h3>
              <p className="text-sm text-gray-400">Drag columns from available to active to create groups.</p>
              <div className="p-2 bg-gray-900/50 rounded-lg space-y-2 min-h-[120px]">
                 <h4 className="text-xs uppercase text-gray-400 font-bold mb-1">Active Groups (Ordered)</h4>
                 <div className="space-y-2">
                    {activeGroups.map((col, index) => (
                        <DraggableGroupItem 
                            key={String(col.accessor)}
                            {...getGroupDraggableProps(index)}
                            item={col}
                            onRemove={() => removeGroup(col.accessor)}
                        />
                    ))}
                    {activeGroups.length === 0 && <p className="text-xs text-center text-gray-500 py-4">Drag a column here</p>}
                 </div>
              </div>
              <div className="p-2 bg-gray-900/50 rounded-lg space-y-2 flex-grow">
                  <div className="flex border-b border-gray-700">
                      <button onClick={() => setActiveGroupTab('recommended')} className={`px-3 py-1.5 text-sm font-medium ${activeGroupTab === 'recommended' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>Recommended</button>
                      <button onClick={() => setActiveGroupTab('all')} className={`px-3 py-1.5 text-sm font-medium ${activeGroupTab === 'all' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>All Columns</button>
                  </div>
                  <div className="pt-2">
                      {activeGroupTab === 'recommended' ? (
                          <GroupingColumnList columns={availableGroupColumnsRecommended} onAdd={addGroup} />
                      ) : (
                          <>
                              <blockquote className="text-xs text-yellow-300 bg-yellow-500/10 border-l-2 border-yellow-400 p-2 mb-2 rounded-r-md">
                                  <strong>Warning:</strong> Grouping by columns with many unique values (like ID or Email) can lead to poor performance and a confusing UI.
                              </blockquote>
                              <GroupingColumnList columns={availableGroupColumnsAll} onAdd={addGroup} />
                          </>
                      )}
                  </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4 border-t border-gray-700 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Save View</button>
        </footer>
      </div>

      {/* Render the single, detached popover */}
      {editingFilterKey && popoverCoords && editingFilterColumn && (
        <FilterPopoverContent
          column={editingFilterColumn}
          filterConfig={filterConfig.find(f => f.key === editingFilterKey)}
          onFilterChange={handleFilterChange}
          onClose={() => setEditingFilterKey(null)}
          coords={popoverCoords}
        />
      )}
    </div>
  );
};