import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Chip from '../Chip';

describe('Chip Component', () => {
  const defaultProps = {
    label: 'Test Chip',
    value: 'test-value',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders chip with label', () => {
      render(<Chip {...defaultProps} />);
      expect(screen.getByText('Test Chip')).toBeInTheDocument();
      expect(screen.getByTestId('chip-test-value')).toBeInTheDocument();
    });

    it('applies size classes correctly', () => {
      const { rerender } = render(<Chip {...defaultProps} size="sm" />);
      expect(screen.getByTestId('chip-test-value')).toHaveClass('px-2', 'py-0.5', 'text-xs');

      rerender(<Chip {...defaultProps} size="md" />);
      expect(screen.getByTestId('chip-test-value')).toHaveClass('px-3', 'py-1', 'text-sm');

      rerender(<Chip {...defaultProps} size="lg" />);
      expect(screen.getByTestId('chip-test-value')).toHaveClass('px-4', 'py-1.5', 'text-base');
    });

    it('applies custom color styles', () => {
      render(<Chip {...defaultProps} color="#ff5733" />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveStyle({
        backgroundColor: '#ff573320',
        color: '#ff5733',
        borderColor: '#ff573340',
      });
    });

    it('applies theme colors when no custom color provided', () => {
      render(<Chip {...defaultProps} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveClass(
        'bg-[var(--table-color-primary,#6366f1)]/10',
        'text-[var(--table-color-primary,#6366f1)]'
      );
    });

    it('truncates long labels with ellipsis', () => {
      const longLabel = 'This is a very long chip label that should be truncated';
      render(<Chip {...defaultProps} label={longLabel} />);
      const labelElement = screen.getByText(longLabel);
      expect(labelElement).toHaveClass('truncate', 'max-w-[150px]');
      expect(labelElement).toHaveAttribute('title', longLabel);
    });
  });

  describe('Interactive Behavior', () => {
    it('calls onClick when chip is clicked', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Chip {...defaultProps} onClick={onClickMock} />);

      await user.click(screen.getByTestId('chip-test-value'));
      expect(onClickMock).toHaveBeenCalledWith('test-value');
    });

    it('calls onClick on Enter key press', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Chip {...defaultProps} onClick={onClickMock} />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Enter}');
      expect(onClickMock).toHaveBeenCalledWith('test-value');
    });

    it('calls onClick on Space key press', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Chip {...defaultProps} onClick={onClickMock} />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard(' ');
      expect(onClickMock).toHaveBeenCalledWith('test-value');
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Chip {...defaultProps} onClick={onClickMock} disabled />);

      await user.click(screen.getByTestId('chip-test-value'));
      expect(onClickMock).not.toHaveBeenCalled();
    });
  });

  describe('Removable Functionality', () => {
    it('shows remove button when removable is true', () => {
      render(<Chip {...defaultProps} removable />);
      expect(screen.getByTestId('chip-remove-test-value')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove Test Chip')).toBeInTheDocument();
    });

    it('does not show remove button when removable is false', () => {
      render(<Chip {...defaultProps} removable={false} />);
      expect(screen.queryByTestId('chip-remove-test-value')).not.toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', async () => {
      const user = userEvent.setup();
      const onRemoveMock = jest.fn();
      render(<Chip {...defaultProps} removable onRemove={onRemoveMock} />);

      await user.click(screen.getByTestId('chip-remove-test-value'));
      expect(onRemoveMock).toHaveBeenCalledWith('test-value');
    });

    it('calls onRemove on Delete key press', async () => {
      const user = userEvent.setup();
      const onRemoveMock = jest.fn();
      render(<Chip {...defaultProps} removable onRemove={onRemoveMock} />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Delete}');
      expect(onRemoveMock).toHaveBeenCalledWith('test-value');
    });

    it('calls onRemove on Backspace key press', async () => {
      const user = userEvent.setup();
      const onRemoveMock = jest.fn();
      render(<Chip {...defaultProps} removable onRemove={onRemoveMock} />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Backspace}');
      expect(onRemoveMock).toHaveBeenCalledWith('test-value');
    });

    it('does not show remove button when disabled', () => {
      render(<Chip {...defaultProps} removable disabled />);
      expect(screen.queryByTestId('chip-remove-test-value')).not.toBeInTheDocument();
    });

    it('does not call onRemove when disabled', async () => {
      const user = userEvent.setup();
      const onRemoveMock = jest.fn();
      render(<Chip {...defaultProps} removable onRemove={onRemoveMock} disabled />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Delete}');
      expect(onRemoveMock).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for clickable chip', () => {
      render(<Chip {...defaultProps} onClick={() => {}} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveAttribute('role', 'button');
      expect(chip).toHaveAttribute('aria-label', 'Test Chip chip');
      expect(chip).toHaveAttribute('tabindex', '0');
    });

    it('has proper ARIA attributes for non-clickable chip', () => {
      render(<Chip {...defaultProps} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveAttribute('role', 'listitem');
    });

    it('has proper ARIA attributes for removable chip', () => {
      render(<Chip {...defaultProps} removable />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveAttribute('aria-label', 'Test Chip chip, removable');
    });

    it('sets aria-disabled when disabled', () => {
      render(<Chip {...defaultProps} disabled />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveAttribute('aria-disabled', 'true');
      expect(chip).toHaveAttribute('tabindex', '-1');
    });

    it('uses custom aria-label when provided', () => {
      render(<Chip {...defaultProps} aria-label="Custom Label" />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('has proper focus styles', () => {
      render(<Chip {...defaultProps} onClick={() => {}} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveClass('focus:ring-2', 'focus:ring-[var(--table-color-primary,#6366f1)]');
    });
  });

  describe('Visual States', () => {
    it('applies disabled styles when disabled', () => {
      render(<Chip {...defaultProps} disabled />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('applies hover styles when not disabled', () => {
      render(<Chip {...defaultProps} onClick={() => {}} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveClass('hover:scale-105');
    });

    it('applies cursor pointer when interactive', () => {
      render(<Chip {...defaultProps} onClick={() => {}} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveClass('cursor-pointer');
    });

    it('applies cursor pointer when removable', () => {
      render(<Chip {...defaultProps} removable />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveClass('cursor-pointer');
    });
  });

  describe('Event Handling', () => {
    it('stops propagation on chip click', async () => {
      const user = userEvent.setup();
      const parentClickMock = jest.fn();
      const chipClickMock = jest.fn();

      render(
        <div onClick={parentClickMock}>
          <Chip {...defaultProps} onClick={chipClickMock} />
        </div>
      );

      await user.click(screen.getByTestId('chip-test-value'));
      expect(chipClickMock).toHaveBeenCalled();
      expect(parentClickMock).not.toHaveBeenCalled();
    });

    it('stops propagation on remove button click', async () => {
      const user = userEvent.setup();
      const parentClickMock = jest.fn();
      const removeMock = jest.fn();

      render(
        <div onClick={parentClickMock}>
          <Chip {...defaultProps} removable onRemove={removeMock} />
        </div>
      );

      await user.click(screen.getByTestId('chip-remove-test-value'));
      expect(removeMock).toHaveBeenCalled();
      expect(parentClickMock).not.toHaveBeenCalled();
    });

    it('handles custom tabIndex', () => {
      render(<Chip {...defaultProps} tabIndex={5} />);
      const chip = screen.getByTestId('chip-test-value');
      expect(chip).toHaveAttribute('tabindex', '5');
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter key for remove action when no onClick provided', async () => {
      const user = userEvent.setup();
      const onRemoveMock = jest.fn();
      render(<Chip {...defaultProps} removable onRemove={onRemoveMock} />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Enter}');
      expect(onRemoveMock).toHaveBeenCalledWith('test-value');
    });

    it('prioritizes onClick over onRemove for Enter key', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      const onRemoveMock = jest.fn();
      render(
        <Chip {...defaultProps} removable onClick={onClickMock} onRemove={onRemoveMock} />
      );

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Enter}');
      expect(onClickMock).toHaveBeenCalledWith('test-value');
      expect(onRemoveMock).not.toHaveBeenCalled();
    });

    it('ignores Escape key (allows parent to handle)', async () => {
      const user = userEvent.setup();
      const onClickMock = jest.fn();
      render(<Chip {...defaultProps} onClick={onClickMock} />);

      const chip = screen.getByTestId('chip-test-value');
      chip.focus();
      await user.keyboard('{Escape}');
      expect(onClickMock).not.toHaveBeenCalled();
    });
  });
});