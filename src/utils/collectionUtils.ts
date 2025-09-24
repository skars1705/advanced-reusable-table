import type { 
  CollectionConfig, 
  CollectionOption, 
  CollectionValue,
  Column
} from '../types';

/**
 * Collection Data Utilities
 * 
 * Provides utility functions for managing collection data types
 * including validation, transformation, and integration patterns.
 */

/**
 * Collection data storage patterns and utilities
 */
export class CollectionDataManager {
  /**
   * Transform table data for collection columns
   * Ensures proper data types and validates collection values
   */
  static transformTableData<T>(
    data: T[], 
    columns: Column<T>[]
  ): T[] {
    const collectionColumns = columns.filter(col => 
      col.dataType === 'collection' && col.collectionConfig
    );
    
    if (collectionColumns.length === 0) {
      return data;
    }
    
    return data.map(item => {
      const transformedItem = { ...item };
      
      collectionColumns.forEach(column => {
        const config = column.collectionConfig!;
        const currentValue = item[column.accessor];
        
        // Normalize and validate the value
        const normalizedValue = this.normalizeCollectionValue(currentValue, config);
        const isValid = this.validateCollectionValue(normalizedValue, config);
        
        if (!isValid) {
          console.warn(`Invalid collection value for column ${String(column.accessor)}:`, currentValue);
          // Set to empty value for the collection type
          (transformedItem as any)[column.accessor] = config.type === 'radio' ? '' : [];
        } else {
          (transformedItem as any)[column.accessor] = normalizedValue;
        }
      });
      
      return transformedItem;
    });
  }
  
  /**
   * Normalize collection value to proper type
   */
  static normalizeCollectionValue<T extends CollectionConfig>(
    value: any, 
    config: T
  ): CollectionValue<T> {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return (config.type === 'radio' ? '' : []) as CollectionValue<T>;
    }
    
    // Handle radio type (single string value)
    if (config.type === 'radio') {
      if (Array.isArray(value)) {
        return (value.length > 0 ? String(value[0]) : '') as CollectionValue<T>;
      }
      return String(value) as CollectionValue<T>;
    }
    
    // Handle array types (checkbox, chip, tag)
    if (Array.isArray(value)) {
      return value.map(String) as CollectionValue<T>;
    }
    
    // Convert single value to array
    const stringValue = String(value);
    if (stringValue.length === 0) {
      return [] as CollectionValue<T>;
    }
    
    // Handle separated values for tags
    if (config.type === 'tag' && 'separator' in config && config.separator) {
      return stringValue.split(config.separator).map(v => v.trim()) as CollectionValue<T>;
    }
    
    return [stringValue] as CollectionValue<T>;
  }
  
  /**
   * Validate collection value against configuration
   */
  static validateCollectionValue<T extends CollectionConfig>(
    value: CollectionValue<T>, 
    config: T
  ): boolean {
    try {
      if (config.type === 'radio') {
        const stringValue = value as string;
        return typeof stringValue === 'string';
      }
      
      const arrayValue = value as string[];
      if (!Array.isArray(arrayValue)) {
        return false;
      }
      
      // Validate all elements are strings
      if (!arrayValue.every(v => typeof v === 'string')) {
        return false;
      }
      
      // Type-specific validation
      switch (config.type) {
        case 'checkbox':
          if ('maxSelections' in config && config.maxSelections) {
            return arrayValue.length <= config.maxSelections;
          }
          break;
        case 'chip':
          if ('maxSelections' in config && config.maxSelections) {
            return arrayValue.length <= config.maxSelections;
          }
          break;
        case 'tag':
          if ('maxTags' in config && config.maxTags) {
            return arrayValue.length <= config.maxTags;
          }
          break;
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get collection display value for table cells
   */
  static getDisplayValue<T extends CollectionConfig>(
    value: CollectionValue<T>,
    config: T,
    options?: CollectionOption[]
  ): string {
    if (config.type === 'radio') {
      const stringValue = value as string;
      if (!stringValue) return '';
      
      const option = options?.find(opt => opt.value === stringValue);
      return option ? option.label : stringValue;
    }
    
    const arrayValue = value as string[];
    if (arrayValue.length === 0) {
      return '';
    }
    
    // For display mode 'text', show labels
    if (config.displayMode === 'text' && options) {
      const labels = arrayValue.map(val => {
        const option = options.find(opt => opt.value === val);
        return option ? option.label : val;
      });
      return labels.join(', ');
    }
    
    // For chip display mode or default
    if (arrayValue.length === 1) {
      const option = options?.find(opt => opt.value === arrayValue[0]);
      return option ? option.label : arrayValue[0];
    }
    
    return `${arrayValue.length} selected`;
  }
  
  /**
   * Extract unique values from collection data for filtering
   */
  static extractUniqueValues<T>(
    data: T[],
    column: Column<T>
  ): CollectionOption[] {
    if (!column.collectionConfig) return [];
    
    const valuesSet = new Set<string>();
    const config = column.collectionConfig;
    
    data.forEach(item => {
      const value = item[column.accessor];
      const normalized = this.normalizeCollectionValue(value, config);
      
      if (config.type === 'radio') {
        const stringValue = typeof normalized === 'string' ? normalized : '';
        if (stringValue) valuesSet.add(stringValue);
      } else {
        const arrayValue = Array.isArray(normalized) ? normalized : [];
        arrayValue.forEach(v => valuesSet.add(v));
      }
    });
    
    return Array.from(valuesSet).sort().map(value => ({
      value,
      label: value
    }));
  }
  
  /**
   * Filter data by collection values
   */
  static filterByCollection<T>(
    data: T[],
    column: Column<T>,
    filterValues: string[],
    operator: 'contains' | 'equals' | 'hasAny' | 'hasAll' = 'hasAny'
  ): T[] {
    if (!column.collectionConfig || filterValues.length === 0) {
      return data;
    }
    
    const config = column.collectionConfig;
    
    return data.filter(item => {
      const value = item[column.accessor];
      const normalized = this.normalizeCollectionValue(value, config);
      
      if (config.type === 'radio') {
        const stringValue = typeof normalized === 'string' ? normalized : '';
        switch (operator) {
          case 'equals':
            return filterValues.includes(stringValue);
          case 'contains':
          case 'hasAny':
          default:
            return filterValues.some(filterVal => 
              stringValue.toLowerCase().includes(filterVal.toLowerCase())
            );
        }
      }
      
      const arrayValue = Array.isArray(normalized) ? normalized : [];
      switch (operator) {
        case 'equals':
          return filterValues.length === arrayValue.length &&
            filterValues.every(v => arrayValue.includes(v));
        case 'hasAll':
          return filterValues.every(filterVal => 
            arrayValue.some(val => val.toLowerCase().includes(filterVal.toLowerCase()))
          );
        case 'contains':
        case 'hasAny':
        default:
          return filterValues.some(filterVal =>
            arrayValue.some(val => val.toLowerCase().includes(filterVal.toLowerCase()))
          );
      }
    });
  }
  
  /**
   * Sort data by collection values
   */
  static sortByCollection<T>(
    data: T[],
    column: Column<T>,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    if (!column.collectionConfig) return data;
    
    const config = column.collectionConfig;
    
    return [...data].sort((a, b) => {
      const aValue = a[column.accessor];
      const bValue = b[column.accessor];
      
      const aNormalized = this.normalizeCollectionValue(aValue, config);
      const bNormalized = this.normalizeCollectionValue(bValue, config);
      
      let comparison = 0;
      
      if (config.type === 'radio') {
        const aString = typeof aNormalized === 'string' ? aNormalized : '';
        const bString = typeof bNormalized === 'string' ? bNormalized : '';
        comparison = aString.localeCompare(bString);
      } else {
        const aArray = Array.isArray(aNormalized) ? aNormalized : [];
        const bArray = Array.isArray(bNormalized) ? bNormalized : [];
        
        // Sort by count first, then by first value
        if (aArray.length !== bArray.length) {
          comparison = aArray.length - bArray.length;
        } else if (aArray.length > 0 && bArray.length > 0) {
          comparison = aArray[0].localeCompare(bArray[0]);
        }
      }
      
      return direction === 'desc' ? -comparison : comparison;
    });
  }
  
  /**
   * Export collection values for CSV
   */
  static exportValue<T extends CollectionConfig>(
    value: CollectionValue<T>,
    config: T,
    options?: CollectionOption[]
  ): string {
    if (config.type === 'radio') {
      const stringValue = value as string;
      const option = options?.find(opt => opt.value === stringValue);
      return option ? option.label : stringValue;
    }
    
    const arrayValue = value as string[];
    if (options) {
      const labels = arrayValue.map(val => {
        const option = options.find(opt => opt.value === val);
        return option ? option.label : val;
      });
      return labels.join('; ');
    }
    
    return arrayValue.join('; ');
  }
}

/**
 * Predefined collection option sets for common use cases
 */
export const CommonCollectionOptions = {
  priorities: [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'critical', label: 'Critical', color: '#dc2626' }
  ] as CollectionOption[],
  
  statuses: [
    { value: 'draft', label: 'Draft', color: '#6b7280' },
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'active', label: 'Active', color: '#10b981' },
    { value: 'inactive', label: 'Inactive', color: '#ef4444' },
    { value: 'archived', label: 'Archived', color: '#4b5563' }
  ] as CollectionOption[],
  
  departments: [
    { value: 'engineering', label: 'Engineering', color: '#3b82f6' },
    { value: 'design', label: 'Design', color: '#8b5cf6' },
    { value: 'product', label: 'Product', color: '#06b6d4' },
    { value: 'marketing', label: 'Marketing', color: '#f59e0b' },
    { value: 'sales', label: 'Sales', color: '#10b981' },
    { value: 'support', label: 'Support', color: '#ef4444' }
  ] as CollectionOption[],
  
  skills: [
    { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
    { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
    { value: 'angular', label: 'Angular', color: '#dd0031' },
    { value: 'nodejs', label: 'Node.js', color: '#339933' },
    { value: 'python', label: 'Python', color: '#3776ab' },
    { value: 'java', label: 'Java', color: '#ed8b00' }
  ] as CollectionOption[]
};

export default CollectionDataManager;