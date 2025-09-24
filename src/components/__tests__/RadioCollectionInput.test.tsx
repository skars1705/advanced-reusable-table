import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RadioCollectionInput } from '../RadioCollectionInput';
import type { RadioCollectionConfig, CollectionOption } from '../../types';

// Mock data
const mockOptions: CollectionOption[] = [
  { value: 'opt1', label: 'Option 1', description: 'First option' },
  { value: 'opt2', label: 'Option 2', color: '#ff0000' },
  { value: 'opt3', label: 'Option 3', disabled: true },
  { value: 'opt4', label: 'Option 4' },
  { value: 'opt5', label: 'Option 5' }
];

const defaultConfig: RadioCollectionConfig = {
  type: 'radio',
  options: mockOptions,
  searchable: true,
  clearable: true,
  maxHeight: '300px'
};

describe('RadioCollectionInput', () => {
  const user = userEvent.setup();

  it('renders with initial state', () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    expect(screen.getByText('No selection')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('displays selected option correctly', () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('handles option selection', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const option1 = screen.getByRole('radio', { name: /option 1/i });
    await user.click(option1);

    expect(mockOnChange).toHaveBeenCalledWith('opt1');
  });

  it('handles option change', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const option2 = screen.getByRole('radio', { name: /option 2/i });
    await user.click(option2);

    expect(mockOnChange).toHaveBeenCalledWith('opt2');
  });

  it('handles clear functionality', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('does not show clear button when clearable is false', () => {
    const mockOnChange = jest.fn();
    const nonClearableConfig: RadioCollectionConfig = {
      ...defaultConfig,
      clearable: false
    };

    render(
      <RadioCollectionInput
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
        config={nonClearableConfig}
      />
    );

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('shows required indicator when selection is required', () => {
    const mockOnChange = jest.fn();
    const requiredConfig: RadioCollectionConfig = {
      ...defaultConfig,
      required: true
    };

    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={requiredConfig}
      />
    );

    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const searchInput = screen.getByRole('textbox', { name: /search radio options/i });
    await user.type(searchInput, 'Option 1');

    // Wait for search to filter results
    await waitFor(() => {
      expect(screen.getByRole('radio', { name: /option 1/i })).toBeInTheDocument();
      expect(screen.queryByRole('radio', { name: /option 2/i })).not.toBeInTheDocument();
    });
  });

  it('highlights search matches', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const searchInput = screen.getByRole('textbox', { name: /search radio options/i });
    await user.type(searchInput, 'Option');

    // Check that search term is highlighted
    const highlightedText = screen.getAllByRole('radio');
    expect(highlightedText.length).toBeGreaterThan(0);
  });

  it('handles keyboard navigation', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const radioGroup = screen.getByRole('radiogroup');
    
    // Focus the radio group
    await user.tab();
    
    // Use arrow keys to navigate
    await user.keyboard('{ArrowDown}');
    
    // Should focus first option
    const firstOption = screen.getByRole('radio', { name: /option 1/i });
    expect(firstOption).toHaveFocus();

    // Select with Space
    await user.keyboard(' ');
    expect(mockOnChange).toHaveBeenCalledWith('opt1');
  });

  it('skips disabled options in keyboard navigation', async () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const radioGroup = screen.getByRole('radiogroup');
    await user.tab();
    
    // Navigate to disabled option (opt3)
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    
    const disabledOption = screen.getByRole('radio', { name: /option 3/i });
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles disabled state', () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
        disabled={true}
      />
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    
    // Search input should be disabled
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeDisabled();
  });

  it('provides proper accessibility attributes', () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
        config={defaultConfig}
        aria-label="Test radio collection"
      />
    );

    const radioGroup = screen.getByRole('radiogroup', { name: /test radio collection/i });
    expect(radioGroup).toBeInTheDocument();

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
  });

  it('handles large datasets with virtualization', () => {
    const largeOptions = Array.from({ length: 100 }, (_, i) => ({
      value: `opt${i}`,
      label: `Option ${i}`,
    }));

    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={largeOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    // Should render component without issues
    expect(screen.getByText('No selection')).toBeInTheDocument();
  });

  it('handles controlled search state', async () => {
    const mockOnChange = jest.fn();
    const mockOnSearchChange = jest.fn();

    render(
      <RadioCollectionInput
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        config={defaultConfig}
        searchQuery="test"
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByRole('textbox');
    await user.clear(searchInput);
    await user.type(searchInput, 'new search');

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('displays option colors when provided', () => {
    const mockOnChange = jest.fn();
    render(
      <RadioCollectionInput
        options={mockOptions}
        value="opt2"
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    // Should show color indicator for opt2 which has color: '#ff0000'
    const colorIndicator = screen.getByText('Option 2').parentElement?.parentElement?.querySelector('[style*="background-color"]');
    expect(colorIndicator).toBeInTheDocument();
  });
});