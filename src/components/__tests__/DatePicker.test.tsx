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

describe('DatePicker', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
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

  describe('Date Display and Formatting', () => {
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

    it('opens calendar when Enter key is pressed', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.type(input, '{Enter}');
      
      const calendar = screen.getByRole('dialog', { name: 'Calendar' });
      expect(calendar).toBeInTheDocument();
    });

    it('opens calendar when Space key is pressed', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.type(input, ' ');
      
      const calendar = screen.getByRole('dialog', { name: 'Calendar' });
      expect(calendar).toBeInTheDocument();
    });

    it('closes calendar when Escape key is pressed', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument();
      
      await user.type(input, '{Escape}');
      
      expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
      expect(input).toHaveFocus();
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

    it('does not open calendar when disabled', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} disabled />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Month Navigation', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} value="2024-03-15" />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
    });

    it('displays current month and year in header', () => {
      expect(screen.getByText('March 2024')).toBeInTheDocument();
    });

    it('navigates to previous month', async () => {
      const user = userEvent.setup();
      
      const prevButton = screen.getByRole('button', { name: 'Previous month' });
      await user.click(prevButton);
      
      expect(screen.getByText('February 2024')).toBeInTheDocument();
    });

    it('navigates to next month', async () => {
      const user = userEvent.setup();
      
      const nextButton = screen.getByRole('button', { name: 'Next month' });
      await user.click(nextButton);
      
      expect(screen.getByText('April 2024')).toBeInTheDocument();
    });

    it('shows day headers', () => {
      const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayHeaders.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });
  });

  describe('Date Selection', () => {
    it('selects date when day is clicked', async () => {
      const mockOnChange = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker {...defaultProps} onChange={mockOnChange} value="2024-03-15" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Click on day 20
      const day20 = screen.getByRole('gridcell', { name: /20.*March.*2024/ });
      await user.click(day20);
      
      expect(mockOnChange).toHaveBeenCalledWith('2024-03-20');
    });

    it('highlights selected date', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} value="2024-03-15" />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const selectedDay = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      expect(selectedDay).toHaveAttribute('aria-selected', 'true');
    });

    it('highlights today\'s date', async () => {
      const user = userEvent.setup();
      const today = new Date();
      
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      // Check if today's date has special styling (this depends on implementation)
      const todayDay = today.getDate();
      const todayButton = screen.getByText(todayDay.toString());
      expect(todayButton).toBeInTheDocument();
    });

    it('closes calendar after date selection for date type', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker {...defaultProps} type="date" value="2024-03-15" />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day20 = screen.getByRole('gridcell', { name: /20.*March.*2024/ });
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
      
      const day20 = screen.getByRole('gridcell', { name: /20.*March.*2024/ });
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

    it('updates time when time input changes', async () => {
      const mockOnChange = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker 
          {...defaultProps} 
          onChange={mockOnChange}
          type="datetime-local" 
          value="2024-03-15T14:30"
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const timeInput = screen.getByLabelText('Time');
      await user.clear(timeInput);
      await user.type(timeInput, '16:45');
      
      expect(mockOnChange).toHaveBeenCalledWith('2024-03-15T16:45');
    });
  });

  describe('Keyboard Navigation in Calendar', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} value="2024-03-15" />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
    });

    it('navigates with arrow keys', async () => {
      const user = userEvent.setup();
      
      // Focus on the selected date (15th)
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      day15.focus();
      
      // Navigate right to 16th
      await user.type(day15, '{ArrowRight}');
      
      const day16 = screen.getByRole('gridcell', { name: /16.*March.*2024/ });
      expect(day16).toHaveFocus();
    });

    it('navigates to previous day with left arrow', async () => {
      const user = userEvent.setup();
      
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      day15.focus();
      
      await user.type(day15, '{ArrowLeft}');
      
      const day14 = screen.getByRole('gridcell', { name: /14.*March.*2024/ });
      expect(day14).toHaveFocus();
    });

    it('navigates to next week with down arrow', async () => {
      const user = userEvent.setup();
      
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      day15.focus();
      
      await user.type(day15, '{ArrowDown}');
      
      const day22 = screen.getByRole('gridcell', { name: /22.*March.*2024/ });
      expect(day22).toHaveFocus();
    });

    it('navigates to previous week with up arrow', async () => {
      const user = userEvent.setup();
      
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      day15.focus();
      
      await user.type(day15, '{ArrowUp}');
      
      const day8 = screen.getByRole('gridcell', { name: /8.*March.*2024/ });
      expect(day8).toHaveFocus();
    });

    it('selects date with Enter key', async () => {
      const mockOnChange = vi.fn();
      const user = userEvent.setup();
      
      const { rerender } = render(
        <ThemeProvider>
          <DatePicker {...defaultProps} onChange={mockOnChange} value="2024-03-15" />
        </ThemeProvider>
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      day15.focus();
      
      await user.type(day15, '{Enter}');
      
      expect(mockOnChange).toHaveBeenCalledWith('2024-03-15');
    });

    it('selects date with Space key', async () => {
      const mockOnChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <DatePicker {...defaultProps} onChange={mockOnChange} value="2024-03-15" />
        </ThemeProvider>
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      day15.focus();
      
      await user.type(day15, ' ');
      
      expect(mockOnChange).toHaveBeenCalledWith('2024-03-15');
    });
  });

  describe('Min/Max Date Constraints', () => {
    it('disables dates before min date', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <DatePicker 
          {...defaultProps} 
          value="2024-03-15"
          min="2024-03-10"
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day5 = screen.getByText('5');
      expect(day5).toHaveAttribute('disabled');
    });

    it('disables dates after max date', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <DatePicker 
          {...defaultProps} 
          value="2024-03-15"
          max="2024-03-20"
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day25 = screen.getByText('25');
      expect(day25).toHaveAttribute('disabled');
    });

    it('does not call onChange for disabled dates', async () => {
      const mockOnChange = vi.fn();
      const user = userEvent.setup();
      
      renderWithTheme(
        <DatePicker 
          {...defaultProps} 
          onChange={mockOnChange}
          value="2024-03-15"
          min="2024-03-10"
        />
      );
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day5 = screen.getByText('5');
      await user.click(day5);
      
      expect(mockOnChange).not.toHaveBeenCalled();
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
      
      await user.type(input, '{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('calendar has proper role and label', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const calendar = screen.getByRole('dialog', { name: 'Calendar' });
      expect(calendar).toHaveAttribute('role', 'dialog');
    });

    it('grid cells have proper accessibility attributes', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} value="2024-03-15" />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      const day15 = screen.getByRole('gridcell', { name: /15.*March.*2024/ });
      expect(day15).toHaveAttribute('role', 'gridcell');
      expect(day15).toHaveAttribute('aria-selected', 'true');
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

    it('does not open calendar when disabled', async () => {
      const user = userEvent.setup();
      renderWithTheme(<DatePicker {...defaultProps} disabled />);
      
      const input = screen.getByRole('combobox');
      await user.click(input);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid date values gracefully', () => {
      renderWithTheme(<DatePicker {...defaultProps} value="invalid-date" />);
      
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('');
    });

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