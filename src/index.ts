// Import CSS styles first for React 19.1.1 compatibility
import './styles/index.css';

// Main exports for the library
export { ReusableTable } from './components/ReusableTable';
export { Pagination } from './components/Pagination';
export { ToggleSwitch } from './components/ToggleSwitch';
export { ViewEditor } from './components/ViewEditor';
export { GlobalSearch } from './components/GlobalSearch';
export { ThemeProvider, useTheme, useThemeClasses } from './components/ThemeProvider';
export { CollectionCell, CollectionUtils } from './components/CollectionCell';
export { CheckboxCollectionInput } from './components/CheckboxCollectionInput';
export { RadioCollectionInput } from './components/RadioCollectionInput';

// Export hooks
export { useTable } from './hooks/useTable';
export { useDndList } from './hooks/useDndList';
export { useRowSelection } from './hooks/useRowSelection';
export { useGlobalSearch } from './hooks/useGlobalSearch';
export { useTableSelection, useSimpleTableSelection, type TableSelectionReturn } from './hooks/useTableSelection';

// Export types
export type {
  Column,
  SortConfig,
  FilterConfig,
  SortDirection,
  FilterOperator,
  StringFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
  CurrencyOptions,
  DateOptions,
  GroupHeaderRow,
  DisplayRow,
  ViewConfiguration,
  SelectionMode,
  RowSelectionState,
  RowSelectionConfig,
  PredefinedTheme,
  ThemeConfig,
  TableTheme,
  TableThemeColors,
  TableThemeSpacing,
  TableThemeTypography,
  GlobalSearchConfig,
  // Collection types
  CollectionConfig,
  CollectionOption,
  CollectionType,
  CollectionDisplayMode,
  CollectionValue,
  CollectionValidationResult,
  CollectionFilterOperator,
  CollectionFilterConfig,
  CheckboxCollectionConfig,
  RadioCollectionConfig,
  ChipCollectionConfig,
  TagCollectionConfig,
  // Dynamic cell rendering types
  CellRenderContext,
  CellRenderDecision,
  // Additional collection and rendering types
  CollectionInputMode,
  CollectionViewDisplayMode,
  BaseCollectionConfig,
  // Type inference helpers
  ColumnAccessor,
  ExtractAccessors,
  ColumnArray,
  TypedViewConfiguration
} from './types';

// Export operator labels
export {
  StringOperatorLabels,
  NumberOperatorLabels,
  DateOperatorLabels,
  CollectionOperatorLabels
} from './types';

// Export icons (in case users want to customize)
export { FilterIcon } from './components/icons/FilterIcon';
export { SortIcon } from './components/icons/SortIcon';
export { SortUpIcon } from './components/icons/SortUpIcon';
export { SortDownIcon } from './components/icons/SortDownIcon';
export { PencilIcon } from './components/icons/PencilIcon';
export { PlusIcon } from './components/icons/PlusIcon';
export { XIcon } from './components/icons/XIcon';

// Export collection utilities
export { CollectionDataManager, CommonCollectionOptions } from './utils/collectionUtils';

// Export cell rendering utilities
export { 
  resolveCellRenderer, 
  createMixedContentRenderer, 
  createConditionalEditRenderer,
  detectDataType,
  memoizeCellDecision 
} from './utils/cellRenderUtils';