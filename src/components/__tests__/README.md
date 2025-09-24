# Component Usage Guide

This guide provides comprehensive documentation for the GlobalSearch and DatePicker components, including usage examples, accessibility features, and integration patterns.

## Table of Contents

1. [GlobalSearch Component](#globalsearch-component)
2. [DatePicker Component](#datepicker-component)
3. [Component Integration](#component-integration)
4. [Accessibility Features](#accessibility-features)
5. [Theming and Customization](#theming-and-customization)
6. [Testing Guide](#testing-guide)
7. [Performance Considerations](#performance-considerations)
8. [Browser Compatibility](#browser-compatibility)

---

## GlobalSearch Component

The GlobalSearch component provides a full-featured search input with real-time filtering, results counting, and keyboard navigation support.

### Basic Usage

```tsx
import { GlobalSearch } from './components/GlobalSearch';
import { useGlobalSearch } from './hooks/useGlobalSearch';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <GlobalSearch
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder="Search..."
    />
  );
}
```

### Advanced Usage with Results Count

```tsx
import { GlobalSearch } from './components/GlobalSearch';
import { useGlobalSearch } from './hooks/useGlobalSearch';

function SearchableTable() {
  const { searchQuery, handleSearchChange, filteredData } = useGlobalSearch({
    data: items,
    columns: tableColumns,
    config: { 
      enabled: true, 
      searchableColumns: ['name', 'email', 'category'] 
    }
  });

  return (
    <GlobalSearch
      searchTerm={searchQuery}
      onSearchChange={handleSearchChange}
      placeholder="Search items..."
      variant="default"
      showResultsCount={true}
      resultsCount={filteredData.length}
      className="w-64"
    />
  );
}
```

### Props Interface

```tsx
interface GlobalSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'compact';
  showResultsCount?: boolean;
  resultsCount?: number;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### Variants

#### Default Variant
- Standard padding and font size
- Icon size: 16x16px (h-4 w-4)
- Best for primary search interfaces

#### Compact Variant  
- Reduced padding and smaller font
- Icon size: 12x12px (h-3 w-3)
- Best for dense layouts or secondary search

### Features

- **Real-time Search**: Updates as user types
- **Clear Button**: Appears when search term is not empty
- **Results Count**: Optional display of filtered results
- **Keyboard Navigation**: Full keyboard support
- **Accessibility**: WCAG 2.1 AA compliant
- **Theme Integration**: Uses CSS custom properties for theming

---

## DatePicker Component

A custom date picker with calendar dropdown, supporting both date and datetime-local inputs with full keyboard navigation.

### Basic Usage

```tsx
import { DatePicker } from './components/DatePicker';

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  
  return (
    <DatePicker
      value={selectedDate}
      onChange={setSelectedDate}
      placeholder="Select date"
    />
  );
}
```

### DateTime Usage

```tsx
import { DatePicker } from './components/DatePicker';

function EventForm() {
  const [eventDateTime, setEventDateTime] = useState('');
  
  return (
    <DatePicker
      value={eventDateTime}
      onChange={setEventDateTime}
      type="datetime-local"
      placeholder="Select date and time"
    />
  );
}
```

### With Constraints

```tsx
import { DatePicker } from './components/DatePicker';

function BookingForm() {
  const [bookingDate, setBookingDate] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  
  return (
    <DatePicker
      value={bookingDate}
      onChange={setBookingDate}
      type="date"
      min={today}
      max={maxDate}
      placeholder="Select booking date"
    />
  );
}
```

### Props Interface

```tsx
interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'date' | 'datetime-local';
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### Features

- **Calendar Dropdown**: Visual date selection interface
- **Keyboard Navigation**: Arrow keys, Enter, Space, Escape
- **Time Picker**: Integrated time selection for datetime-local
- **Date Constraints**: Min/max date validation
- **Localized Display**: Formatted date display (e.g., "Mar 15, 2024")
- **Click-outside-to-close**: Intuitive UX behavior
- **Accessibility**: Full screen reader and keyboard support

---

## Component Integration

### Using Together in Forms

```tsx
import { GlobalSearch } from './components/GlobalSearch';
import { DatePicker } from './components/DatePicker';
import { ReusableTable } from './components/ReusableTable';
import { ThemeProvider } from './components/ThemeProvider';

function DataTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [data, setData] = useState(initialData);

  const filteredData = useMemo(() => {
    let filtered = data;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(item => item.date === dateFilter);
    }
    
    return filtered;
  }, [data, searchTerm, dateFilter]);

  return (
    <ThemeProvider>
      <div className="space-y-4">
        <div className="flex gap-4">
          <GlobalSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search records..."
            showResultsCount={true}
            resultsCount={filteredData.length}
            className="flex-1"
          />
          <DatePicker
            value={dateFilter}
            onChange={setDateFilter}
            type="date"
            placeholder="Filter by date"
          />
        </div>
        
        <ReusableTable
          data={filteredData}
          columns={columns}
          viewConfig={viewConfig}
          onUpdateData={handleDataUpdate}
        />
      </div>
    </ThemeProvider>
  );
}
```

### Theme Consistency

Both components use the same CSS custom properties for consistent theming:

```css
:root {
  --table-color-surface: #1f2937;
  --table-color-border: #4b5563;
  --table-color-text: #f3f4f6;
  --table-color-textMuted: #9ca3af;
  --table-color-primary: #6366f1;
  --table-border-radius: 0.375rem;
}
```

---

## Accessibility Features

### GlobalSearch Accessibility

- **Role**: `searchbox` for semantic meaning
- **ARIA Labels**: Descriptive labels for screen readers
- **ARIA Live Region**: Results count announced to screen readers
- **Keyboard Support**: 
  - Tab to focus/unfocus
  - Clear button accessible via keyboard
- **Focus Management**: Proper focus indicators

### DatePicker Accessibility

- **Role**: `combobox` with `aria-haspopup="dialog"`
- **ARIA Expanded**: Updates based on calendar state
- **Calendar Navigation**: 
  - Arrow keys for date navigation
  - Enter/Space to select dates
  - Escape to close calendar
- **Grid Structure**: Proper `role="grid"` for calendar
- **Date Announcements**: Each date has descriptive aria-label

### Best Practices

```tsx
// Proper labeling
<label htmlFor="search-input">Search</label>
<GlobalSearch
  aria-labelledby="search-input"
  aria-describedby="search-help"
  // ...other props
/>
<div id="search-help">Search across all visible columns</div>

// Date picker with context
<label htmlFor="date-input">Event Date</label>
<DatePicker
  aria-labelledby="date-input"
  aria-describedby="date-help"
  // ...other props
/>
<div id="date-help">Select the date for your event</div>
```

---

## Theming and Customization

### CSS Custom Properties

Both components support extensive theming through CSS custom properties:

```css
.custom-theme {
  --table-color-surface: #2563eb;
  --table-color-border: #3b82f6;
  --table-color-text: #ffffff;
  --table-color-textMuted: #cbd5e1;
  --table-color-primary: #f59e0b;
  --table-border-radius: 0.5rem;
}
```

### Custom Styling

```tsx
// Custom classes
<GlobalSearch
  className="w-full max-w-md shadow-lg"
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
/>

<DatePicker
  className="min-w-48 border-2 border-blue-500"
  value={date}
  onChange={setDate}
/>
```

### Theme Provider Usage

```tsx
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="dark-theme">
        {/* Your components here */}
      </div>
    </ThemeProvider>
  );
}
```

---

## Testing Guide

### Unit Testing

Both components have comprehensive test suites covering:

- **Basic functionality**: Rendering, props handling
- **User interactions**: Click, keyboard, focus events
- **Accessibility**: ARIA attributes, keyboard navigation
- **Theme integration**: CSS custom properties
- **Edge cases**: Invalid data, error conditions

### Integration Testing

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlobalSearch } from '../GlobalSearch';
import { DatePicker } from '../DatePicker';
import { ThemeProvider } from '../ThemeProvider';

test('components work together', async () => {
  const user = userEvent.setup();
  
  render(
    <ThemeProvider>
      <GlobalSearch searchTerm="" onSearchChange={vi.fn()} />
      <DatePicker value="" onChange={vi.fn()} />
    </ThemeProvider>
  );

  // Test interactions
  await user.type(screen.getByRole('searchbox'), 'test');
  await user.click(screen.getByRole('combobox'));
  
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test GlobalSearch.test.tsx
```

---

## Performance Considerations

### GlobalSearch Performance

- **Debouncing**: Consider debouncing search input for better performance
- **Memoization**: Results count and filtered data should be memoized
- **Large datasets**: Use virtual scrolling for very large result sets

```tsx
// Debounced search example
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearchTerm(value), 300),
  []
);

<GlobalSearch
  searchTerm={searchTerm}
  onSearchChange={debouncedSearch}
/>
```

### DatePicker Performance

- **Calendar rendering**: Only renders visible month to improve performance
- **Event listeners**: Proper cleanup of document event listeners
- **Memory usage**: Minimal memory footprint with efficient state management

### Bundle Size Optimization

- **Tree shaking**: Import only needed components
- **CSS optimization**: Use CSS custom properties instead of inline styles
- **Icon optimization**: SVG icons are inlined for better performance

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 88+ | Full support |
| Firefox | 85+ | Full support |
| Safari | 14+ | Full support |
| Edge | 88+ | Full support |

### Polyfills

For older browsers, you may need polyfills for:

- `ResizeObserver` (if using responsive features)
- CSS custom properties (IE11 and below)
- Modern JavaScript features (Arrow functions, etc.)

### Testing Matrix

Components are tested across:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation
- Touch interactions

---

## Migration Guide

### From v1 to v2

```tsx
// v1 (old)
<SearchInput 
  value={search}
  onChange={setSearch}
  showCount
  count={results.length}
/>

// v2 (new)
<GlobalSearch
  searchTerm={search}
  onSearchChange={setSearch}
  showResultsCount={true}
  resultsCount={results.length}
/>
```

### Breaking Changes

1. **Prop names**: `value` → `searchTerm`, `onChange` → `onSearchChange`
2. **Results count**: `showCount` and `count` → `showResultsCount` and `resultsCount`
3. **Variants**: Added `variant` prop with `default` and `compact` options
4. **Theme integration**: Now uses CSS custom properties

---

## Troubleshooting

### Common Issues

#### Search Not Working
```tsx
// ❌ Wrong - missing controlled state
<GlobalSearch onSearchChange={setSearch} />

// ✅ Correct - properly controlled
<GlobalSearch searchTerm={search} onSearchChange={setSearch} />
```

#### Calendar Not Opening
```tsx
// ❌ Wrong - missing controlled state
<DatePicker onChange={setDate} />

// ✅ Correct - properly controlled  
<DatePicker value={date} onChange={setDate} />
```

#### Theme Not Applied
```tsx
// ❌ Wrong - missing ThemeProvider
<GlobalSearch {...props} />

// ✅ Correct - wrapped in ThemeProvider
<ThemeProvider>
  <GlobalSearch {...props} />
</ThemeProvider>
```

### Debug Mode

Enable debug logging:

```tsx
// Add to your development environment
if (process.env.NODE_ENV === 'development') {
  window.DEBUG_COMPONENTS = true;
}
```

---

## Contributing

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm test

# Run linting
npm run lint
```

### Testing New Features

1. Write unit tests first
2. Add integration tests for component interactions
3. Test accessibility with screen readers
4. Verify browser compatibility
5. Update documentation

### Code Style

- Use TypeScript for type safety
- Follow existing patterns for consistency
- Include comprehensive prop documentation
- Add JSDoc comments for complex logic
- Maintain test coverage above 90%

---

For more detailed API documentation, see the TypeScript interfaces in each component file. For questions or issues, please check the test files for comprehensive usage examples.