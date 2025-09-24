import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CollectionDisplay from '../CollectionDisplay';
import type { CollectionOption } from '../../types';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('CollectionDisplay Component', () => {
  const mockOptions: CollectionOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', color: '#ff5733' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
  ];

  const defaultProps = {
    values: ['option1', 'option2'],
    options: mockOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders chips for provided values', () => {
      render(<CollectionDisplay {...defaultProps} />);
      expect(screen.getByTestId('chip-option1')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option2')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('shows empty state when no values provided', () => {
      render(<CollectionDisplay values={[]} options={mockOptions} />);
      expect(screen.getByText('No items selected')).toBeInTheDocument();
    });

    it('shows custom empty message', () => {
      render(
        <CollectionDisplay
          values={[]}
          options={mockOptions}
          emptyMessage="Custom empty message"
        />
      );
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('applies layout classes correctly', () => {
      const { rerender } = render(<CollectionDisplay {...defaultProps} layout="horizontal" />);
      expect(screen.getByRole('list')).toHaveClass('flex', 'flex-wrap', 'gap-2');

      rerender(<CollectionDisplay {...defaultProps} layout="vertical" />);
      expect(screen.getByRole('list')).toHaveClass('flex', 'flex-col', 'gap-2');

      rerender(<CollectionDisplay {...defaultProps} layout="grid" />);
      expect(screen.getByRole('list')).toHaveClass('grid', 'grid-cols-2');
    });

    it('passes correct props to chips', () => {
      render(<CollectionDisplay {...defaultProps} size="lg" removable />);
      const chip = screen.getByTestId('chip-option1');
      expect(chip).toHaveClass('px-4', 'py-1.5', 'text-base'); // lg size
    });
  });

  describe('Overflow Handling', () => {
    it('shows all items when count is within maxVisible', () => {
      render(<CollectionDisplay {...defaultProps} maxVisible={5} />);
      expect(screen.getByTestId('chip-option1')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option2')).toBeInTheDocument();
      expect(screen.queryByTestId('expand-button')).not.toBeInTheDocument();
    });

    it('shows only maxVisible items with expand button', () => {
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4', 'option5']}
          options={mockOptions}
          maxVisible={3}
        />
      );

      expect(screen.getByTestId('chip-option1')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option2')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option3')).toBeInTheDocument();
      expect(screen.queryByTestId('chip-option4')).not.toBeInTheDocument();
      expect(screen.queryByTestId('chip-option5')).not.toBeInTheDocument();
      expect(screen.getByTestId('expand-button')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
      expect(screen.getByText('more')).toBeInTheDocument();
    });

    it('expands to show all items when expand button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4', 'option5']}
          options={mockOptions}
          maxVisible={3}
        />
      );

      await user.click(screen.getByTestId('expand-button'));

      expect(screen.getByTestId('chip-option4')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option5')).toBeInTheDocument();
      expect(screen.getByTestId('collapse-button')).toBeInTheDocument();
      expect(screen.queryByTestId('expand-button')).not.toBeInTheDocument();
    });

    it('collapses back when collapse button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4', 'option5']}
          options={mockOptions}
          maxVisible={3}
        />
      );

      // First expand
      await user.click(screen.getByTestId('expand-button'));
      expect(screen.getByTestId('collapse-button')).toBeInTheDocument();

      // Then collapse
      await user.click(screen.getByTestId('collapse-button'));
      expect(screen.queryByTestId('chip-option4')).not.toBeInTheDocument();
      expect(screen.queryByTestId('chip-option5')).not.toBeInTheDocument();
      expect(screen.getByTestId('expand-button')).toBeInTheDocument();
    });

    it('shows correct count information', () => {
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4', 'option5']}
          options={mockOptions}
          maxVisible={3}
        />
      );

      expect(screen.getByText('Showing first 3 of 5 items')).toBeInTheDocument();
    });

    it('updates count information when expanded', async () => {
      const user = userEvent.setup();
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4', 'option5']}
          options={mockOptions}
          maxVisible={3}
        />
      );

      await user.click(screen.getByTestId('expand-button'));
      expect(screen.getByText('Showing all 5 of 5 items')).toBeInTheDocument();
    });

    it('hides count when showCount is false', () => {
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4', 'option5']}
          options={mockOptions}
          maxVisible={3}
          showCount={false}
        />
      );

      expect(screen.queryByText('+2')).not.toBeInTheDocument();
      expect(screen.getByText('more')).toBeInTheDocument();
    });
  });

  describe('Interactive Functionality', () => {
    it('calls onChipRemove when chip is removed', async () => {
      const user = userEvent.setup();
      const onChipRemoveMock = jest.fn();
      render(
        <CollectionDisplay {...defaultProps} removable onChipRemove={onChipRemoveMock} />
      );

      await user.click(screen.getByTestId('chip-remove-option1'));
      expect(onChipRemoveMock).toHaveBeenCalledWith('option1');
    });

    it('calls onChipClick when chip is clicked', async () => {
      const user = userEvent.setup();
      const onChipClickMock = jest.fn();
      render(<CollectionDisplay {...defaultProps} onChipClick={onChipClickMock} />);

      await user.click(screen.getByTestId('chip-option1'));
      expect(onChipClickMock).toHaveBeenCalledWith('option1');
    });

    it('calls onExpand when expand button is clicked', async () => {
      const user = userEvent.setup();
      const onExpandMock = jest.fn();
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4']}
          options={mockOptions}
          maxVisible={3}
          onExpand={onExpandMock}
        />
      );

      await user.click(screen.getByTestId('expand-button'));
      expect(onExpandMock).toHaveBeenCalled();
    });

    it('does not call callbacks when disabled', async () => {
      const user = userEvent.setup();
      const onChipRemoveMock = jest.fn();
      const onChipClickMock = jest.fn();
      render(
        <CollectionDisplay
          {...defaultProps}
          removable
          disabled
          onChipRemove={onChipRemoveMock}
          onChipClick={onChipClickMock}
        />
      );

      const chip = screen.getByTestId('chip-option1');
      await user.click(chip);
      expect(onChipClickMock).not.toHaveBeenCalled();
      expect(onChipRemoveMock).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates between chips with arrow keys in horizontal layout', async () => {
      const user = userEvent.setup();
      render(<CollectionDisplay {...defaultProps} layout="horizontal" />);

      const firstChip = screen.getByTestId('chip-option1');
      const secondChip = screen.getByTestId('chip-option2');

      firstChip.focus();
      await user.keyboard('{ArrowRight}');
      expect(secondChip).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(firstChip).toHaveFocus();
    });

    it('navigates between chips with arrow keys in vertical layout', async () => {
      const user = userEvent.setup();
      render(<CollectionDisplay {...defaultProps} layout="vertical" />);

      const firstChip = screen.getByTestId('chip-option1');
      const secondChip = screen.getByTestId('chip-option2');

      firstChip.focus();
      await user.keyboard('{ArrowDown}');
      expect(secondChip).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(firstChip).toHaveFocus();
    });

    it('wraps around when navigating past first/last chip', async () => {
      const user = userEvent.setup();
      render(<CollectionDisplay {...defaultProps} />);

      const firstChip = screen.getByTestId('chip-option1');
      const lastChip = screen.getByTestId('chip-option2');

      firstChip.focus();
      await user.keyboard('{ArrowLeft}');
      expect(lastChip).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(firstChip).toHaveFocus();
    });

    it('navigates to first chip with Home key', async () => {
      const user = userEvent.setup();
      render(<CollectionDisplay {...defaultProps} />);

      const firstChip = screen.getByTestId('chip-option1');
      const secondChip = screen.getByTestId('chip-option2');

      secondChip.focus();
      await user.keyboard('{Home}');
      expect(firstChip).toHaveFocus();
    });

    it('navigates to last chip with End key', async () => {
      const user = userEvent.setup();
      render(<CollectionDisplay {...defaultProps} />);

      const firstChip = screen.getByTestId('chip-option1');
      const lastChip = screen.getByTestId('chip-option2');

      firstChip.focus();
      await user.keyboard('{End}');
      expect(lastChip).toHaveFocus();
    });

    it('ignores inappropriate arrow keys for layout', async () => {
      const user = userEvent.setup();
      render(<CollectionDisplay {...defaultProps} layout="horizontal" />);

      const firstChip = screen.getByTestId('chip-option1');
      firstChip.focus();

      // ArrowDown should be ignored in horizontal layout
      await user.keyboard('{ArrowDown}');
      expect(firstChip).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<CollectionDisplay {...defaultProps} />);
      const container = screen.getByTestId('collection-display');
      expect(container).toHaveAttribute('role', 'group');
      expect(container).toHaveAttribute('aria-label', 'Collection of 2 items');
    });

    it('uses custom aria-label when provided', () => {
      render(<CollectionDisplay {...defaultProps} aria-label="Custom label" />);
      const container = screen.getByTestId('collection-display');
      expect(container).toHaveAttribute('aria-label', 'Custom label');
    });

    it('has proper list structure', () => {
      render(<CollectionDisplay {...defaultProps} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('sets proper aria attributes for chips', () => {
      render(<CollectionDisplay {...defaultProps} />);
      const firstChip = screen.getByTestId('chip-option1');
      expect(firstChip).toHaveAttribute('aria-posinset', '1');
      expect(firstChip).toHaveAttribute('aria-setsize', '2');
    });

    it('updates aria-setsize when expanded', async () => {
      const user = userEvent.setup();
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4']}
          options={mockOptions}
          maxVisible={2}
        />
      );

      let firstChip = screen.getByTestId('chip-option1');
      expect(firstChip).toHaveAttribute('aria-setsize', '2');

      await user.click(screen.getByTestId('expand-button'));
      firstChip = screen.getByTestId('chip-option1');
      expect(firstChip).toHaveAttribute('aria-setsize', '4');
    });

    it('has proper expand button accessibility', () => {
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4']}
          options={mockOptions}
          maxVisible={2}
        />
      );

      const expandButton = screen.getByTestId('expand-button');
      expect(expandButton).toHaveAttribute('aria-label', 'Show 2 more items');
    });

    it('has proper collapse button accessibility', async () => {
      const user = userEvent.setup();
      render(
        <CollectionDisplay
          values={['option1', 'option2', 'option3', 'option4']}
          options={mockOptions}
          maxVisible={2}
        />
      );

      await user.click(screen.getByTestId('expand-button'));
      const collapseButton = screen.getByTestId('collapse-button');
      expect(collapseButton).toHaveAttribute('aria-label', 'Show fewer items');
    });
  });

  describe('Visual States', () => {
    it('applies disabled styles when disabled', () => {
      render(<CollectionDisplay {...defaultProps} disabled />);
      const container = screen.getByTestId('collection-display');
      expect(container).toHaveClass('opacity-50', 'pointer-events-none');
    });

    it('passes disabled state to chips', () => {
      render(<CollectionDisplay {...defaultProps} disabled />);
      const chip = screen.getByTestId('chip-option1');
      expect(chip).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles option-level disabled state', () => {
      render(
        <CollectionDisplay
          values={['option1', 'option3']}
          options={mockOptions}
          removable
        />
      );
      
      const disabledChip = screen.getByTestId('chip-option3');
      expect(disabledChip).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByTestId('chip-remove-option3')).not.toBeInTheDocument();
    });

    it('applies custom colors from options', () => {
      render(<CollectionDisplay {...defaultProps} />);
      const coloredChip = screen.getByTestId('chip-option2');
      expect(coloredChip).toHaveStyle({
        backgroundColor: '#ff573320',
        color: '#ff5733',
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles values not found in options', () => {
      render(
        <CollectionDisplay
          values={['option1', 'unknown-value']}
          options={mockOptions}
        />
      );
      
      expect(screen.getByTestId('chip-option1')).toBeInTheDocument();
      expect(screen.getByTestId('chip-unknown-value')).toBeInTheDocument();
      expect(screen.getByText('unknown-value')).toBeInTheDocument(); // Uses value as label
    });

    it('handles empty options array', () => {
      render(<CollectionDisplay values={['value1']} options={[]} />);
      expect(screen.getByTestId('chip-value1')).toBeInTheDocument();
      expect(screen.getByText('value1')).toBeInTheDocument();
    });

    it('handles maxVisible of 0', () => {
      render(<CollectionDisplay {...defaultProps} maxVisible={0} />);
      expect(screen.queryByTestId('chip-option1')).not.toBeInTheDocument();
      expect(screen.getByTestId('expand-button')).toBeInTheDocument();
    });

    it('handles very large maxVisible value', () => {
      render(<CollectionDisplay {...defaultProps} maxVisible={1000} />);
      expect(screen.getByTestId('chip-option1')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option2')).toBeInTheDocument();
      expect(screen.queryByTestId('expand-button')).not.toBeInTheDocument();
    });
  });
});