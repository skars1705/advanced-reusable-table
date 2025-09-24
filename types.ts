export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

// New filter operator types
export type StringFilterOperator = 'contains' | 'doesNotContain' | 'equals' | 'startsWith' | 'endsWith';
export type NumberFilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';
export type DateFilterOperator = 'is' | 'isNot' | 'isBefore' | 'isAfter';
export type FilterOperator = StringFilterOperator | NumberFilterOperator | DateFilterOperator;

// Map for display names in the UI
export const StringOperatorLabels: Record<StringFilterOperator, string> = {
  contains: 'Contains',
  doesNotContain: 'Does Not Contain',
  equals: 'Equals',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
};

export const NumberOperatorLabels: Record<NumberFilterOperator, string> = {
  eq: '=',
  neq: '!=',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<=',
};

export const DateOperatorLabels: Record<DateFilterOperator, string> = {
  is: 'Is',
  isNot: 'Is Not',
  isBefore: 'Is Before',
  isAfter: 'Is After',
};

// Updated FilterConfig to include an operator
export interface FilterConfig<T> {
  key: keyof T;
  value: string;
  operator: FilterOperator;
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

// Updated Column type to include dataType for type-specific filtering
export interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  dataType?: 'string' | 'number' | 'currency' | 'date' | 'datetime';
  currencyOptions?: CurrencyOptions;
  dateOptions?: DateOptions;
  cell?: (item: T) => React.ReactNode;
  editable?: boolean;
  cellType?: 'checkbox' | 'toggle';
  groupable?: boolean;
  align?: 'left' | 'center' | 'right';
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
  // Defines the default sorting for the view
  sortConfig: SortConfig<T>[];
  // Defines the default filters for the view
  filterConfig: FilterConfig<T>[];
}