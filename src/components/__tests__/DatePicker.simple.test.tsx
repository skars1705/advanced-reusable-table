import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DatePicker } from '../DatePicker';
import { ThemeProvider } from '../ThemeProvider';

// Mock the ThemeProvider for testing
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('DatePicker - Core Functionality', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Select date');
    });

    it('displays custom placeholder', () => {
      renderWithTheme(
        <DatePicker {...defaultProps} placeholder="Choose a date..." />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('placeholder', 'Choose a date...');
    });

    it('shows calendar icon', () => {
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const calendarIcon = screen.getByRole('img', { hidden: true });
      expect(calendarIcon).toBeInTheDocument();
      expect(calendarIcon).toHaveAttribute('aria-hidden', 'true');
      expect(calendarIcon).toHaveAttribute('aria-label', 'Calendar');
    });

    it('handles different input types', () => {
      const { rerender } = renderWithTheme(
        <DatePicker {...defaultProps} type="date" />
      );
      
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Select date');
      
      rerender(
        <ThemeProvider>
          <DatePicker {...defaultProps} type="datetime-local" />
        </ThemeProvider>
      );
      
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Select date and time');
    });
  });

  describe('Value Display', () => {
    it('displays date value correctly for date type', () => {
      renderWithTheme(
        <DatePicker {...defaultProps} value="2024-03-15" type="date" />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Mar 15, 2024');
    });

    it('displays datetime value correctly for datetime-local type', () => {
      renderWithTheme(
        <DatePicker 
          {...defaultProps} 
          value="2024-03-15T14:30" 
          type="datetime-local" 
        />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Mar 15, 2024, 14:30');
    });

    it('handles empty value', () => {
      renderWithTheme(<DatePicker {...defaultProps} value="" />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('');
    });

    it('handles invalid date values gracefully', () => {
      renderWithTheme(<DatePicker {...defaultProps} value="invalid-date" />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('');
    });
  });

  describe('Calendar Dropdown', () => {
    it('opens calendar when input is clicked', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const calendar = screen.getByRole('dialog', { name: 'Calendar' });
      expect(calendar).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('does not open calendar when disabled', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} disabled />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes calendar when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <div>
          <DatePicker {...defaultProps} />
          <button>Outside button</button>
        </div>
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument();
      
      const outsideButton = screen.getByRole('button', { name: 'Outside button' });
      await user.click(outsideButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Calendar Content', () => {
    it('displays current month and year in header when calendar is open', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} value="2024-03-15" />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.getByText('March 2024')).toBeInTheDocument();
    });

    it('shows day headers when calendar is open', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayHeaders.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('shows navigation buttons when calendar is open', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
    });
  });

  describe('Date Selection', () => {
    it('calls onChange when date is selected', async () => {
      const mockOnChange = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker {...defaultProps} onChange={mockOnChange} value="2024-03-15" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Find a date button (day 20)
      const day20 = screen.getByText('20');
      await user.click(day20);
      
      expect(mockOnChange).toHaveBeenCalledWith('2024-03-20');
    });

    it('closes calendar after date selection for date type', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker {...defaultProps} type="date" value="2024-03-15" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day20 = screen.getByText('20');
      await user.click(day20);
      
      expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    it('keeps calendar open after date selection for datetime-local type', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker {...defaultProps} type="datetime-local" value="2024-03-15T14:30" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day20 = screen.getByText('20');
      await user.click(day20);
      
      expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument();
    });
  });

  describe('Time Picker (datetime-local)', () => {
    it('shows time picker for datetime-local type', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <DatePicker {...defaultProps} type="datetime-local" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.getByLabelText('Time')).toBeInTheDocument();
    });

    it('does not show time picker for date type', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <DatePicker {...defaultProps} type="date" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.queryByLabelText('Time')).not.toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('applies theme CSS custom properties', () => {
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveClass(
        'bg-[var(--table-color-surface,#1f2937)]',
        'border-[var(--table-color-border,#4b5563)]',
        'text-[var(--table-color-text,#f3f4f6)]',
        'placeholder-[var(--table-color-textMuted,#9ca3af)]'
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithTheme(
        <DatePicker 
          {...defaultProps} 
          aria-label="Select date"
          aria-describedby="date-help"
        />
      );
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-label', 'Select date');
      expect(input).toHaveAttribute('aria-describedby', 'date-help');
      expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('updates aria-expanded when calendar opens/closes', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('calendar has proper role and label', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const calendar = screen.getByRole('dialog', { name: 'Calendar' });
      expect(calendar).toHaveAttribute('role', 'dialog');
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      renderWithTheme(<DatePicker {...defaultProps} disabled />);
      
      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });

    it('applies disabled styling', () => {
      renderWithTheme(<DatePicker {...defaultProps} disabled />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty value prop', () => {
      renderWithTheme(<DatePicker {...defaultProps} value="" />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('');
    });

    it('generates unique IDs for multiple instances', () => {
      renderWithTheme(
        <div>
          <DatePicker {...defaultProps} />
          <DatePicker {...defaultProps} />
        </div>
      );
      
      const inputs = screen.getAllByRole('combobox');
      const input1Id = inputs[0].getAttribute('id');
      const input2Id = inputs[1].getAttribute('id');
      
      expect(input1Id).not.toBe(input2Id);
    });
  });
});