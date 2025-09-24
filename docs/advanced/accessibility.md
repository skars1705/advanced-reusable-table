# Accessibility Guide

Complete guide to accessibility features, WCAG 2.1 AA compliance, and inclusive design patterns in Advanced Reusable Table.

## Overview

The Advanced Reusable Table is designed with accessibility as a core principle, providing:

- **WCAG 2.1 AA Compliance** - Meets international accessibility standards
- **Screen Reader Support** - Full compatibility with NVDA, JAWS, and VoiceOver
- **Keyboard Navigation** - Complete keyboard-only operation
- **Focus Management** - Logical focus order and clear indicators
- **Semantic Structure** - Proper HTML semantics and ARIA attributes
- **Color Accessibility** - High contrast and color-blind friendly design

## Built-in Accessibility Features

### ✅ Keyboard Navigation

Complete keyboard navigation is available out of the box:

| Key Combination | Action |
|-----------------|--------|
| **Tab** | Move to next focusable element |
| **Shift + Tab** | Move to previous focusable element |
| **Arrow Keys** | Navigate between cells and options |
| **Enter** | Activate element or enter edit mode |
| **Space** | Select checkboxes, toggle switches |
| **Escape** | Cancel editing or close dropdowns |
| **Home** | First cell in row |
| **End** | Last cell in row |
| **Ctrl + Home** | First cell in table |
| **Ctrl + End** | Last cell in table |
| **Page Up/Down** | Scroll page up/down |

### ✅ Screen Reader Support

#### Table Structure Announcements
```html
<!-- Semantic table structure -->
<table role="table" aria-label="Product management table">
  <caption>
    Product inventory with 25 items. Use arrow keys to navigate, Enter to edit.
  </caption>
  <thead>
    <tr role="row">
      <th role="columnheader" aria-sort="ascending">
        Product Name
        <button aria-label="Sort by Product Name descending">
          <!-- Sort icon -->
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr role="row" aria-rowindex="2" aria-selected="false">
      <td role="gridcell" aria-describedby="product-name-help">
        Wireless Headphones
      </td>
    </tr>
  </tbody>
</table>
```

#### Live Regions for Updates
```html
<!-- Status announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Sorted by Product Name in ascending order. 25 items visible.
</div>

<div aria-live="assertive" aria-atomic="true" class="sr-only">
  Product "Wireless Headphones" updated successfully.
</div>
```

### ✅ Focus Management

Clear focus indicators and logical progression:

```css
/* Built-in focus styles */
.table-cell:focus,
.collection-input:focus,
.chip:focus {
  outline: 2px solid var(--table-color-primary, #3b82f6);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .table-cell:focus {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}
```

## Configuring Accessibility

### Table-Level Configuration

```tsx
import { ReusableTable } from 'advanced-reusable-table';

<ReusableTable
  allColumns={columns}
  data={data}
  viewConfig={viewConfig}
  // Accessibility configuration
  accessibilityConfig={{
    tableLabel: "Product inventory management",
    tableDescription: "Interactive table for managing product inventory with sorting, filtering, and editing capabilities",
    announceUpdates: true,
    keyboardNavigationEnabled: true,
    focusManagement: 'automatic',
    screenReaderOptimizations: true
  }}
  // Caption for screen readers
  caption="Product inventory with filtering and editing. Use Tab to navigate, Enter to edit cells, and arrow keys to move between cells."
  // Summary for complex tables
  summary="This table contains product information including name, price, category, and stock status. Use the filter controls above each column to narrow results."
/>
```

### Column-Level Accessibility

```tsx
const accessibleColumns: Column<Product>[] = [
  {
    header: 'Product Name',
    accessor: 'name',
    // Screen reader description
    ariaLabel: 'Product name, sortable column',
    ariaDescription: 'The name of the product. Click to sort alphabetically.',
    // Help text
    helpText: 'Enter a descriptive product name between 3-100 characters',
    // Validation announcements
    validateAnnounce: true,
    editable: true
  },
  
  {
    header: 'Price',
    accessor: 'price',
    dataType: 'currency',
    ariaLabel: 'Product price in US dollars',
    // Custom format for screen readers
    ariaValueText: (value) => `$${value} US dollars`,
    // Validation with accessible error messages
    validate: (value) => {
      if (value <= 0) return 'Price must be greater than zero dollars';
      if (value > 10000) return 'Price cannot exceed ten thousand dollars';
      return null;
    }
  },
  
  {
    header: 'In Stock',
    accessor: 'inStock',
    cellType: 'toggle',
    ariaLabel: 'In stock status',
    // Custom announcements
    ariaValueText: (value) => value ? 'In stock' : 'Out of stock',
    // Instructions for interaction
    ariaDescription: 'Use Space key or Enter to toggle stock status'
  },
  
  {
    header: 'Tags',
    accessor: 'tags',
    dataType: 'collection',
    collectionConfig: {
      type: 'checkbox',
      options: tagOptions,
      // Accessibility for collections
      ariaLabel: 'Product tags',
      ariaDescription: 'Select one or more tags that describe this product',
      // Announce selection changes
      announceSelectionChanges: true,
      // Selection limit announcement
      maxSelections: 5,
      maxSelectionsMessage: 'Maximum of 5 tags allowed'
    }
  }
];
```

## Collection Accessibility

### Checkbox Collections

```tsx
const checkboxCollectionConfig = {
  type: 'checkbox',
  options: permissionOptions,
  // Fieldset and legend for grouping
  fieldsetLabel: 'User Permissions',
  fieldsetDescription: 'Select the permissions for this user account',
  
  // Individual option accessibility
  options: [
    {
      value: 'read',
      label: 'Read Access',
      ariaLabel: 'Read access permission',
      description: 'Allows viewing of data and documents',
      // Disabled state announcements
      disabled: false,
      disabledReason: ''
    },
    {
      value: 'write',
      label: 'Write Access', 
      ariaLabel: 'Write access permission',
      description: 'Allows creating and editing of data',
      disabled: !hasWritePermission,
      disabledReason: 'Requires administrator approval'
    }
  ],
  
  // Selection announcements
  announceSelectionCount: true,
  selectionCountTemplate: (count, total) => 
    `${count} of ${total} permissions selected`,
  
  // Error handling
  required: true,
  requiredMessage: 'At least one permission must be selected',
  
  // Keyboard navigation
  keyboardNavigation: {
    enabled: true,
    selectAllShortcut: 'Ctrl+A',
    selectAllAnnouncement: 'All permissions selected'
  }
};
```

### Radio Collections

```tsx
const radioCollectionConfig = {
  type: 'radio',
  options: priorityOptions,
  
  // Radio group accessibility
  fieldsetLabel: 'Priority Level',
  fieldsetDescription: 'Choose the priority level for this task',
  
  // Required field handling
  required: true,
  requiredMessage: 'Priority level is required',
  
  // Error announcements
  errorAnnouncement: {
    invalid: 'Invalid priority selection',
    required: 'Please select a priority level'
  },
  
  // Visual and screen reader coordination
  inputMode: 'chips',  // Visual chip interface
  ariaPresentation: 'radiogroup',  // Screen reader structure
  
  // Option descriptions
  options: priorityOptions.map(option => ({
    ...option,
    ariaDescription: `Set priority to ${option.label}. ${option.description}`,
    // Keyboard shortcuts
    accessKey: option.label.charAt(0).toLowerCase()
  }))
};
```

## Dynamic Content Accessibility

### Dynamic Rendering Announcements

```tsx
const dynamicColumn = {
  header: 'Content',
  accessor: 'content',
  renderCell: (context) => {
    const { value, row } = context;
    
    // Announce content type changes
    const announceContentType = (type: string) => {
      if (context.announceChanges) {
        announce(`Content changed to ${type}`, 'polite');
      }
    };
    
    if (Array.isArray(value)) {
      announceContentType('checklist');
      return {
        type: 'collection',
        collectionConfig: {
          type: 'checkbox',
          options: value.map(item => ({ value: item, label: item })),
          ariaLabel: `Checklist with ${value.length} items`,
          announceSelectionChanges: true
        }
      };
    }
    
    if (typeof value === 'string') {
      announceContentType('text content');
      return { 
        type: 'text', 
        content: value,
        ariaLabel: 'Text content'
      };
    }
    
    return { 
      type: 'text', 
      content: 'No content available',
      ariaLabel: 'Empty content'
    };
  }
};
```

### Loading State Accessibility

```tsx
const LoadingAccessibleTable = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  return (
    <>
      {/* Loading announcement */}
      {loading && (
        <div 
          aria-live="assertive" 
          aria-busy="true"
          className="sr-only"
        >
          Loading table data, please wait...
        </div>
      )}
      
      <ReusableTable
        data={data}
        loading={loading}
        loadingText="Loading product data..."
        // Disable interactions during loading
        disabled={loading}
        aria-busy={loading}
        aria-describedby={loading ? "loading-message" : undefined}
      />
      
      {loading && (
        <div id="loading-message" className="sr-only">
          Data is currently being loaded. Table interactions are temporarily disabled.
        </div>
      )}
    </>
  );
};
```

## Error Handling and Validation

### Accessible Error Messages

```tsx
const ValidationErrorDisplay = ({ errors, fieldId }) => (
  <div 
    role="alert"
    aria-live="assertive" 
    id={`${fieldId}-error`}
    className="error-container"
  >
    {errors.map((error, index) => (
      <div key={index} className="error-message">
        <span className="sr-only">Error: </span>
        {error.message}
      </div>
    ))}
  </div>
);

// Usage in form validation
const validatedColumn = {
  header: 'Email',
  accessor: 'email',
  validate: (value) => {
    const errors = [];
    if (!value) {
      errors.push({ 
        message: 'Email address is required',
        type: 'required'
      });
    } else if (!isValidEmail(value)) {
      errors.push({ 
        message: 'Please enter a valid email address format',
        type: 'format'
      });
    }
    return errors;
  },
  // Connect errors to input
  ariaDescribedBy: (hasErrors, fieldId) => 
    hasErrors ? `${fieldId}-error ${fieldId}-help` : `${fieldId}-help`,
  // Help text
  helpText: 'Enter a valid email address like user@example.com'
};
```

### Success Confirmations

```tsx
const SuccessfulUpdateHandler = () => {
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const handleUpdate = useCallback(async (rowIndex, columnId, value) => {
    try {
      await updateData(rowIndex, columnId, value);
      
      // Announce success
      const announcement = `${columnId} updated to ${value}`;
      setLastUpdate(announcement);
      
      // Clear announcement after delay
      setTimeout(() => setLastUpdate(null), 3000);
      
    } catch (error) {
      // Announce error
      setLastUpdate(`Update failed: ${error.message}`);
    }
  }, []);
  
  return (
    <>
      {lastUpdate && (
        <div 
          aria-live="polite"
          aria-atomic="true" 
          className="sr-only"
        >
          {lastUpdate}
        </div>
      )}
      
      <ReusableTable
        onUpdateData={handleUpdate}
        // ... other props
      />
    </>
  );
};
```

## Testing Accessibility

### Automated Testing

```tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

expect.extend(toHaveNoViolations);

describe('Table Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ReusableTable
        allColumns={accessibleColumns}
        data={testData}
        viewConfig={testView}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(<ReusableTable {...props} />);
    
    // Tab to first cell
    await user.tab();
    expect(screen.getByRole('gridcell')).toHaveFocus();
    
    // Arrow key navigation
    await user.keyboard('{ArrowRight}');
    expect(screen.getAllByRole('gridcell')[1]).toHaveFocus();
    
    // Enter to edit
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox')).toHaveFocus();
    
    // Escape to cancel
    await user.keyboard('{Escape}');
    expect(screen.getByRole('gridcell')).toHaveFocus();
  });
  
  it('should announce sort changes', async () => {
    const user = userEvent.setup();
    
    render(<ReusableTable {...props} />);
    
    // Monitor announcements
    const announcement = screen.getByRole('status');
    
    // Click sort header
    await user.click(screen.getByRole('columnheader', { name: /name/i }));
    
    // Check announcement
    expect(announcement).toHaveTextContent(/sorted by name/i);
  });
  
  it('should handle focus management correctly', async () => {
    const user = userEvent.setup();
    
    render(<ReusableTable {...props} />);
    
    // Open collection dropdown
    const collectionCell = screen.getByRole('button', { name: /edit tags/i });
    await user.click(collectionCell);
    
    // Focus should be on first option
    expect(screen.getByRole('checkbox', { name: /first tag/i })).toHaveFocus();
    
    // Escape should return focus to cell
    await user.keyboard('{Escape}');
    expect(collectionCell).toHaveFocus();
  });
});
```

### Manual Testing Checklist

#### Screen Reader Testing

```markdown
# Screen Reader Testing Checklist

## NVDA (Windows)
- [ ] Table structure announced correctly
- [ ] Column headers read with each cell
- [ ] Sort order changes announced
- [ ] Edit mode entry/exit announced
- [ ] Validation errors read aloud
- [ ] Collection selections announced

## JAWS (Windows)
- [ ] Table navigation with virtual cursor
- [ ] Quick navigation keys work (T for table, H for heading)
- [ ] Forms mode for editing cells
- [ ] Error messages in virtual buffer

## VoiceOver (macOS/iOS)
- [ ] Table rotor navigation
- [ ] Column/row headers identified
- [ ] Custom actions available
- [ ] Gesture navigation support
- [ ] Focus changes announced

## ORCA (Linux)
- [ ] Table reading preferences respected
- [ ] Keyboard navigation consistent
- [ ] Speech synthesis clear and accurate
```

### Keyboard Testing

```markdown
# Keyboard Testing Checklist

## Basic Navigation
- [ ] Tab order is logical and complete
- [ ] No keyboard traps
- [ ] Focus indicators clearly visible
- [ ] Skip links available for large tables

## Table Navigation
- [ ] Arrow keys navigate between cells
- [ ] Home/End keys work correctly
- [ ] Page Up/Down scroll appropriately
- [ ] Ctrl+Home/End go to table corners

## Editing
- [ ] Enter activates edit mode
- [ ] Tab moves to next editable cell
- [ ] Escape cancels editing
- [ ] Changes save on blur

## Collections
- [ ] Space toggles checkboxes
- [ ] Arrow keys navigate options
- [ ] Type-ahead search works
- [ ] Enter confirms selections
```

## High Contrast and Visual Adaptations

### Automatic Contrast Adjustments

```css
/* Automatic high contrast support */
@media (prefers-contrast: high) {
  .reusable-table {
    --table-border-width: 2px;
    --table-focus-outline-width: 3px;
  }
  
  .table-cell {
    border: var(--table-border-width) solid currentColor;
  }
  
  .chip {
    border: 2px solid currentColor;
    background: transparent;
    color: currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .table-cell,
  .chip,
  .collection-dropdown {
    transition: none;
    animation: none;
  }
}

/* Color scheme support */
@media (prefers-color-scheme: dark) {
  .reusable-table {
    --table-color-background: #1a1a1a;
    --table-color-text: #ffffff;
    --table-color-border: #404040;
  }
}
```

### Custom Theme Accessibility

```tsx
const accessibleTheme = {
  colors: {
    // High contrast ratios (7:1 for AA+)
    primary: '#0052CC',      // 7.11:1 on white
    text: '#000000',         // 21:1 on white
    textMuted: '#505050',    // 7.68:1 on white
    border: '#757575',       // 4.54:1 on white
    
    // Error states
    error: '#D04437',        // 5.73:1 on white
    errorBackground: '#FFEBE6', // Safe background
    
    // Success states  
    success: '#006644',      // 7.16:1 on white
    successBackground: '#E3FCEF'
  },
  
  // Minimum touch targets (44px)
  spacing: {
    touchTarget: '44px',
    minSpacing: '8px'
  },
  
  // Readable font sizes
  typography: {
    fontSize: {
      minimum: '16px',      // Never below 16px
      body: '18px',         // Comfortable reading
      small: '16px'         // Even small text is readable
    }
  }
};
```

## Internationalization and Accessibility

### RTL Language Support

```tsx
const RTLAccessibleTable = () => {
  const { direction, language } = useI18n();
  
  return (
    <div dir={direction} lang={language}>
      <ReusableTable
        allColumns={columns}
        data={data}
        viewConfig={viewConfig}
        // RTL-aware navigation
        keyboardNavigation={{
          rightToLeft: direction === 'rtl',
          arrowKeyBehavior: direction === 'rtl' ? 'reverse' : 'normal'
        }}
        // Localized announcements
        announcements={{
          sortAscending: t('table.sortAscending'),
          sortDescending: t('table.sortDescending'),
          filterApplied: t('table.filterApplied'),
          rowSelected: t('table.rowSelected')
        }}
      />
    </div>
  );
};
```

### Locale-Aware Formatting

```tsx
const localizedColumns = [
  {
    header: t('product.price'),
    accessor: 'price',
    dataType: 'currency',
    currencyOptions: {
      locale: userLocale,
      currency: userCurrency
    },
    // Screen reader formatting
    ariaValueText: (value) => 
      formatCurrency(value, userLocale, userCurrency, { 
        spellOut: true  // "twenty-five dollars" vs "$25"
      })
  },
  
  {
    header: t('product.date'),
    accessor: 'createdDate',
    dataType: 'date',
    dateOptions: {
      locale: userLocale,
      dateStyle: 'full'  // Most descriptive format
    },
    // Accessible date format
    ariaValueText: (value) =>
      formatDate(value, userLocale, {
        dateStyle: 'full',
        timeStyle: 'short',
        narrative: true  // "Today at 3:30 PM" vs "2024-01-20 15:30"
      })
  }
];
```

## Best Practices Summary

### Do's ✅

1. **Always provide alternative text** for visual content
2. **Use semantic HTML** elements and ARIA roles appropriately
3. **Maintain logical focus order** throughout the interface
4. **Test with real assistive technologies**, not just automated tools
5. **Provide clear instructions** for complex interactions
6. **Announce important changes** to screen reader users
7. **Ensure sufficient color contrast** (4.5:1 minimum, 7:1 preferred)
8. **Support keyboard-only navigation** completely
9. **Use consistent interaction patterns** throughout the table
10. **Provide multiple ways** to accomplish tasks

### Don'ts ❌

1. **Never rely solely on color** to convey information
2. **Don't create keyboard traps** or dead ends
3. **Don't hide focus indicators** or make them barely visible
4. **Don't use placeholder text** as the only label
5. **Don't ignore error states** in accessibility markup
6. **Don't assume users** have specific abilities or technologies
7. **Don't over-use ARIA** - semantic HTML is often better
8. **Don't forget mobile accessibility** - touch targets, zoom, etc.
9. **Don't make interactions too complex** or require precise timing
10. **Don't skip accessibility testing** with real users

### Quick Accessibility Checklist

```markdown
# Pre-Launch Accessibility Checklist

## Structure & Semantics
- [ ] Proper heading hierarchy (h1-h6)
- [ ] Table headers correctly associated
- [ ] Form labels properly connected
- [ ] Landmark regions defined

## Keyboard & Focus
- [ ] All interactive elements reachable by keyboard
- [ ] Focus order is logical and visible
- [ ] No keyboard traps exist
- [ ] Skip links provided where needed

## Screen Readers
- [ ] All content readable by screen readers
- [ ] Images have appropriate alt text
- [ ] Dynamic content changes announced
- [ ] Error messages properly associated

## Visual Design
- [ ] Color contrast ratios meet WCAG AA (4.5:1)
- [ ] Information not conveyed by color alone
- [ ] Text can be resized to 200% without horizontal scrolling
- [ ] Focus indicators clearly visible

## Testing
- [ ] Automated testing with axe-core passes
- [ ] Manual keyboard testing completed
- [ ] Screen reader testing conducted
- [ ] High contrast mode verified
```

## Next Steps

- [Performance Guide](./performance.md) - Optimize accessibility without sacrificing performance
- [Customization Guide](./customization.md) - Build accessible custom components
- [Testing Guide](./testing.md) - Comprehensive accessibility testing strategies
- [Migration Guide](./migration.md) - Maintain accessibility during migration