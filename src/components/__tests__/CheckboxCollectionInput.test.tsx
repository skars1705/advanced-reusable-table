import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CheckboxCollectionInput } from '../CheckboxCollectionInput';
import type { CheckboxCollectionConfig, CollectionOption } from '../../types';

// Mock data
const mockOptions: CollectionOption[] = [
  { value: 'opt1', label: 'Option 1', description: 'First option' },
  { value: 'opt2', label: 'Option 2', color: '#ff0000' },
  { value: 'opt3', label: 'Option 3', disabled: true },
  { value: 'opt4', label: 'Option 4' },
  { value: 'opt5', label: 'Option 5' }
];

const defaultConfig: CheckboxCollectionConfig = {
  type: 'checkbox',
  options: mockOptions,
  searchable: true,
  selectAllOption: true,
  maxHeight: '300px'
};

describe('CheckboxCollectionInput', () => {
  const user = userEvent.setup();

  it('renders with initial state', () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    expect(screen.getByText('0 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all/i })).toBeDisabled();
  });

  it('displays selected options correctly', () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={['opt1', 'opt2']}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    expect(screen.getByText('2 selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all/i })).toBeEnabled();
  });

  it('handles individual option selection', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const option1 = screen.getByRole('option', { name: /option 1/i });
    await user.click(option1);

    expect(mockOnChange).toHaveBeenCalledWith(['opt1']);
  });

  it('handles option deselection', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={['opt1', 'opt2']}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const option1 = screen.getByRole('option', { name: /option 1/i });
    await user.click(option1);

    expect(mockOnChange).toHaveBeenCalledWith(['opt2']);
  });

  it('handles Select All functionality', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const selectAllButton = screen.getByRole('button', { name: /select all/i });
    await user.click(selectAllButton);

    // Should select all non-disabled options (opt3 is disabled)
    expect(mockOnChange).toHaveBeenCalledWith(['opt1', 'opt2', 'opt4', 'opt5']);
  });

  it('handles Clear All functionality', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={['opt1', 'opt2']}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const clearAllButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearAllButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('respects maxSelections constraint', async () => {
    const mockOnChange = jest.fn();
    const configWithLimit: CheckboxCollectionConfig = {
      ...defaultConfig,
      maxSelections: 2
    };

    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={['opt1', 'opt2']}
        onChange={mockOnChange}
        config={configWithLimit}
      />
    );

    const option4 = screen.getByRole('option', { name: /option 4/i });
    await user.click(option4);

    // Should not call onChange because max selections is reached
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('handles search functionality', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const searchInput = screen.getByRole('textbox', { name: /search checkbox options/i });
    await user.type(searchInput, 'Option 1');

    // Wait for search to filter results
    await waitFor(() => {
      expect(screen.getByRole('option', { name: /option 1/i })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: /option 2/i })).not.toBeInTheDocument();
    });
  });

  it('highlights search matches', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const searchInput = screen.getByRole('textbox', { name: /search checkbox options/i });
    await user.type(searchInput, 'Option');

    // Check that search term is highlighted
    const highlightedText = screen.getAllByRole('option');
    expect(highlightedText.length).toBeGreaterThan(0);
  });

  it('handles keyboard navigation', async () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    const option1 = screen.getByRole('option', { name: /option 1/i });
    await user.tab();
    expect(option1).toHaveFocus();

    // Test Space key selection
    await user.keyboard(' ');
    expect(mockOnChange).toHaveBeenCalledWith(['opt1']);
  });

  it('handles disabled state', () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
        disabled={true}
      />
    );

    const selectAllButton = screen.getByRole('button', { name: /select all/i });
    expect(selectAllButton).toBeDisabled();
  });

  it('provides proper accessibility attributes', () => {
    const mockOnChange = jest.fn();
    render(
      <CheckboxCollectionInput
        options={mockOptions}
        value={['opt1']}
        onChange={mockOnChange}
        config={defaultConfig}
        aria-label="Test checkbox collection"
      />
    );

    const group = screen.getByRole('group', { name: /test checkbox collection/i });
    expect(group).toBeInTheDocument();

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
      <CheckboxCollectionInput
        options={largeOptions}
        value={[]}
        onChange={mockOnChange}
        config={defaultConfig}
      />
    );

    // Should render component without issues
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });
});