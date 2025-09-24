export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

// New filter operator types
export type StringFilterOperator = 'contains' | 'doesNotContain' | 'equals' | 'startsWith' | 'endsWith' | 'isEmpty';
export type NumberFilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'isEmpty' | 'between';
export type DateFilterOperator = 'is' | 'isNot' | 'isBefore' | 'isAfter' | 'isEmpty' | 'dateRange';
export type CollectionFilterOperator = 'contains' | 'doesNotContain' | 'containsAny' | 'containsAll' | 'isEmpty';
export type FilterOperator = StringFilterOperator | NumberFilterOperator | DateFilterOperator | CollectionFilterOperator;

// Map for display names in the UI
export const StringOperatorLabels: Record<StringFilterOperator, string> = {
  contains: 'Contains',
  doesNotContain: 'Does Not Contain',
  equals: 'Equals',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  isEmpty: 'Is Empty',
};

export const NumberOperatorLabels: Record<NumberFilterOperator, string> = {
  eq: '=',
  neq: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
  isEmpty: 'Is Empty',
  between: 'Between',
};

export const DateOperatorLabels: Record<DateFilterOperator, string> = {
  is: 'Is',
  isNot: 'Is Not',
  isBefore: 'Is Before',
  isAfter: 'Is After',
  isEmpty: 'Is Empty',
  dateRange: 'Date Range',
};

export const CollectionOperatorLabels: Record<CollectionFilterOperator, string> = {
  contains: 'Contains',
  doesNotContain: 'Does Not Contain',
  containsAny: 'Contains Any',
  containsAll: 'Contains All',
  isEmpty: 'Is Empty',
};

// Updated FilterConfig to include an operator
export interface FilterConfig<T> {
  key: keyof T;
  value: string;
  operator: FilterOperator;
  // For range filters (between, dateRange) - stores the second value
  secondValue?: string;
}

export interface CurrencyOptions {
  locale: string;
  currency: string;
}

export interface DateOptions {
  locale: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

// Collection data architecture interfaces
export interface CollectionOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string; // For chip styling and visual customization
  description?: string; // Optional tooltip or help text
}

export type CollectionType = 'checkbox' | 'radio' | 'chip' | 'chips' | 'tag' | 'tags' | 'checkboxes';

// Collection type normalization - maps aliases to canonical types
export const normalizeCollectionType = (type: CollectionType): 'checkbox' | 'radio' | 'chip' | 'tag' => {
  switch (type) {
    case 'checkboxes':
      return 'checkbox';
    case 'chips':
      return 'chip';
    case 'tags':
      return 'tag';
    default:
      return type as 'checkbox' | 'radio' | 'chip' | 'tag';
  }
};
export type CollectionDisplayMode = 'input' | 'chips' | 'text' | 'compact' | 'full';

// NEW: Input rendering mode types
export type CollectionInputMode = 'traditional' | 'chips';
export type CollectionViewDisplayMode = 'inline' | 'dropdown' | 'traditional' | 'auto';

export interface BaseCollectionConfig {
  type: CollectionType;
  options: CollectionOption[] | (() => CollectionOption[]); // Static or dynamic options
  placeholder?: string;
  searchable?: boolean; // Enable search for large option lists
  displayMode?: CollectionDisplayMode; // How to display when not editing (DEPRECATED - use viewDisplayMode)
  maxHeight?: string; // For dropdown/menu height control
  virtualized?: boolean; // Enable virtualization for 100+ options
  allowEmpty?: boolean; // Allow clearing all selections
  disabled?: boolean; // Disable the entire collection
  onChange?: (value: string | string[], item: any) => void; // Custom change handler
  
  // NEW: Enhanced display configuration
  inputMode?: CollectionInputMode; // How to render during editing - 'traditional' or 'chips'
  viewDisplayMode?: CollectionViewDisplayMode; // How to show selected values - 'inline', 'dropdown', or 'auto'
  
  // NEW: Display thresholds for auto mode
  inlineThreshold?: number; // Switch to dropdown after N selections (default: 3)
  maxVisibleInline?: number; // Max chips shown inline before "+" (default: 5)
}

// Type-specific configuration interfaces
export interface CheckboxCollectionConfig extends BaseCollectionConfig {
  type: 'checkbox' | 'checkboxes'; // Support alias
  maxSelections?: number; // Limit number of selections
  minSelections?: number; // Minimum required selections
  selectAllOption?: boolean; // Show "Select All" option
}

export interface RadioCollectionConfig extends BaseCollectionConfig {
  type: 'radio';
  required?: boolean; // Require a selection
  clearable?: boolean; // Allow clearing selection
}

export interface ChipCollectionConfig extends BaseCollectionConfig {
  type: 'chip' | 'chips'; // Support alias
  maxSelections?: number;
  chipVariant?: 'filled' | 'outlined' | 'soft'; // Visual chip style
  removable?: boolean; // Can chips be removed individually
}

export interface TagCollectionConfig extends BaseCollectionConfig {
  type: 'tag' | 'tags'; // Support alias
  allowCustomValues?: boolean; // Allow user-created tags
  maxTags?: number; // Limit number of tags
  minLength?: number; // Minimum tag length
  maxLength?: number; // Maximum tag length
  duplicateAllowed?: boolean; // Allow duplicate tags
  caseSensitive?: boolean; // Case-sensitive tag matching
  separator?: string; // Separator for multiple tag input (e.g., comma, semicolon)
}

// Union type for all collection configurations
export type CollectionConfig = 
  | CheckboxCollectionConfig 
  | RadioCollectionConfig 
  | ChipCollectionConfig 
  | TagCollectionConfig;

// Collection data storage patterns
export type CollectionValue<T extends CollectionConfig> = 
  T['type'] extends 'radio' ? string : string[];

// Collection validation result
export interface CollectionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Collection filter configuration for advanced filtering (deprecated - use main CollectionFilterOperator above)

export interface CollectionFilterConfig<T> extends Omit<FilterConfig<T>, 'operator'> {
  operator: CollectionFilterOperator;
  selectedValues?: string[]; // For multi-value filtering
}

// Dynamic cell rendering interfaces
export interface CellRenderContext<T> {
  value: any;
  row: T;
  rowIndex: number;
  column: Column<T>;
  isEditing: boolean;
}

export interface CellRenderDecision {
  type: 'text' | 'collection' | 'checkbox' | 'toggle' | 'date' | 'datetime' | 'currency' | 'number' | 'custom';
  content?: React.ReactNode;
  props?: Record<string, any>;
  collectionConfig?: CollectionConfig;
  editable?: boolean;
}

// Updated Column type to include dataType for type-specific filtering
export interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'collection'; // NEW: Filter type configuration
  dataType?: 'string' | 'number' | 'currency' | 'date' | 'datetime' | 'collection';
  currencyOptions?: CurrencyOptions;
  dateOptions?: DateOptions;
  collectionConfig?: CollectionConfig; // Collection configuration
  cell?: (item: T) => React.ReactNode;
  editable?: boolean;
  cellType?: 'checkbox' | 'toggle';
  groupable?: boolean;
  align?: 'left' | 'center' | 'right';
  
  // Dynamic cell rendering function
  renderCell?: (context: CellRenderContext<T>) => CellRenderDecision | React.ReactNode;
}

// New type for a group header row, supporting nesting
export interface GroupHeaderRow<T> {
  isGroupHeader: true;
  level: number; // Indentation level
  path: string; // Unique path for this group, e.g., "Electronics" or "Electronics|true"
  groupKey: keyof T; // The accessor key for this group level, e.g., 'category'
  groupValue: any; // The value of the group, e.g., 'Electronics'
  count: number; // Number of items in this group
}

// A row in the display list can be a data item or a group header
export type DisplayRow<T> = T | GroupHeaderRow<T>;

// New interface for saved table views
export interface ViewConfiguration<T> {
  id: string;
  name: string;
  // Defines which columns are visible and in what order
  visibleColumns: (keyof T)[];
  // Defines the multi-level grouping and order
  groupBy: (keyof T)[];
  // NEW: Alternative name for groupBy for API compatibility
  groupByKeys?: (keyof T)[];
  // Defines the default sorting for the view
  sortConfig: SortConfig<T>[];
  // Defines the default filters for the view
  filterConfig: FilterConfig<T>[];
}

// Row selection types
export type SelectionMode = 'single' | 'multiple' | 'none';

export interface RowSelectionState<T> {
  selectedRows: Set<T>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// NEW: Enhanced row selection configuration
export interface RowSelectionConfig {
  enabled: boolean;
  mode: SelectionMode;
  maxSelections?: number;
  onSelectionChange?: (selectedRows: any[]) => void;
}

// Theme system types
export interface TableThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface TableThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface TableThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface TableTheme {
  colors: Partial<TableThemeColors>;
  spacing?: Partial<TableThemeSpacing>;
  typography?: Partial<TableThemeTypography>;
  borderRadius?: string;
  boxShadow?: string;
}

// NEW: Predefined theme names
export type PredefinedTheme = 'light' | 'dark';

// NEW: Theme configuration that accepts both strings and objects
export type ThemeConfig = PredefinedTheme | Partial<TableTheme>;

// Global search configuration
export interface GlobalSearchConfig {
  enabled: boolean;
  placeholder?: string;
  debounceMs?: number;
  searchableColumns?: string[]; // If empty, search all columns
}