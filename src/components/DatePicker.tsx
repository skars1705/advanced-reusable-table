import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useThemeClasses } from './ThemeProvider';

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'date' | 'datetime-local';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  type = 'date',
  placeholder = type === 'date' ? 'Select date' : 'Select date and time',
  className = '',
  disabled = false,
  min,
  max,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  });
  const [timeValue, setTimeValue] = useState(() => {
    if (value && type === 'datetime-local') {
      const date = new Date(value);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return '12:00';
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const themeClasses = useThemeClasses();

  // Generate unique IDs
  const datePickerId = `datepicker-${Math.random().toString(36).substr(2, 9)}`;
  const calendarId = `${datePickerId}-calendar`;
  const timePickerId = `${datePickerId}-time`;

  // Get min and max dates
  const minDate = min ? new Date(min) : null;
  const maxDate = max ? new Date(max) : null;

  // Format display value
  const formatDisplayValue = useCallback((date: Date | null, includeTime: boolean = false): string => {
    if (!date || isNaN(date.getTime())) return '';
    
    try {
      if (includeTime && type === 'datetime-local') {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  }, [type]);

  // Format ISO value for onChange
  const formatISOValue = useCallback((date: Date, time?: string): string => {
    if (type === 'datetime-local' && time) {
      const [hours, minutes] = time.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      
      // Format as YYYY-MM-DDTHH:MM
      return `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}T${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Format as YYYY-MM-DD
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }, [type]);

  // Check if date is disabled
  const isDateDisabled = useCallback((date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    const isoValue = formatISOValue(date, timeValue);
    onChange(isoValue);
    
    if (type === 'date') {
      setIsOpen(false);
      inputRef.current?.focus();
    }
  }, [formatISOValue, isDateDisabled, onChange, timeValue, type]);

  // Handle time change
  const handleTimeChange = useCallback((time: string) => {
    setTimeValue(time);
    if (selectedDate) {
      const isoValue = formatISOValue(selectedDate, time);
      onChange(isoValue);
    }
  }, [formatISOValue, onChange, selectedDate]);

  // Navigate months
  const navigateMonth = useCallback((direction: 1 | -1) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  }, []);

  // Generate calendar days
  const generateCalendarDays = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
      isDisabled: boolean;
    }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isSelected = selectedDate ? 
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate() : false;
      const isToday = date.getTime() === today.getTime();
      const isDisabled = isDateDisabled(date);

      days.push({
        date,
        isCurrentMonth,
        isSelected,
        isToday,
        isDisabled
      });
    }

    return days;
  }, [currentDate, selectedDate, isDateDisabled]);

  // Handle click outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  }, [isOpen]);

  // Handle calendar keyboard navigation
  const handleCalendarKeyDown = useCallback((event: React.KeyboardEvent, date: Date) => {
    let newDate: Date | null = null;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleDateSelect(date);
        return;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        inputRef.current?.focus();
        return;
    }

    if (newDate && !isDateDisabled(newDate)) {
      // Update current date to show the correct month
      if (newDate.getMonth() !== currentDate.getMonth()) {
        setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
      }
      
      // Focus the new date button
      setTimeout(() => {
        const button = calendarRef.current?.querySelector(`[data-date="${newDate!.getTime()}"]`) as HTMLButtonElement;
        button?.focus();
      }, 0);
    }
  }, [currentDate, handleDateSelect, isDateDisabled]);

  // Effect for click outside
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  // Effect for value changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        setSelectedDate(null);
      } else {
        setSelectedDate(date);
        setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
        
        if (type === 'datetime-local') {
          setTimeValue(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
        }
      }
    } else {
      setSelectedDate(null);
    }
  }, [value, type]);

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <input
        ref={inputRef}
        id={datePickerId}
        type="text"
        value={formatDisplayValue(selectedDate, type === 'datetime-local')}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        className={`w-full bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-2 px-3 text-sm text-[var(--table-color-text,#f3f4f6)] placeholder-[var(--table-color-textMuted,#9ca3af)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition-colors cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || placeholder}
        aria-describedby={ariaDescribedBy}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        role="combobox"
      />

      {/* Calendar Icon */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-[var(--table-color-textMuted,#9ca3af)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="Calendar" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div 
          ref={calendarRef}
          id={calendarId}
          className="absolute z-50 mt-1 bg-[var(--table-color-surface,#1f2937)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] shadow-[var(--table-box-shadow,0_10px_15px_-3px_rgba(0,0,0,0.1))] p-4 min-w-[320px]"
          role="dialog"
          aria-label="Calendar"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-[var(--table-color-primary,#6366f1)]/20 rounded-[var(--table-border-radius,0.375rem)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)]"
              aria-label="Previous month"
            >
              <svg className="h-4 w-4 text-[var(--table-color-text,#f3f4f6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-[var(--table-color-text,#f3f4f6)] font-semibold text-sm">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-[var(--table-color-primary,#6366f1)]/20 rounded-[var(--table-border-radius,0.375rem)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)]"
              aria-label="Next month"
            >
              <svg className="h-4 w-4 text-[var(--table-color-text,#f3f4f6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-[var(--table-color-textMuted,#9ca3af)] p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1" role="grid" aria-labelledby={calendarId}>
            {calendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                data-date={day.date.getTime()}
                onClick={() => handleDateSelect(day.date)}
                onKeyDown={(e) => handleCalendarKeyDown(e, day.date)}
                disabled={day.isDisabled}
                className={`
                  p-2 text-xs text-center rounded-[var(--table-border-radius,0.375rem)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)]
                  ${!day.isCurrentMonth ? 'text-[var(--table-color-textMuted,#9ca3af)] opacity-50' : 'text-[var(--table-color-text,#f3f4f6)]'}
                  ${day.isSelected ? 'bg-[var(--table-color-primary,#6366f1)] text-white' : ''}
                  ${day.isToday && !day.isSelected ? 'bg-[var(--table-color-accent,#10b981)]/20 text-[var(--table-color-accent,#10b981)]' : ''}
                  ${day.isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[var(--table-color-primary,#6366f1)]/20'}
                `}
                role="gridcell"
                aria-label={day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                aria-selected={day.isSelected}
                tabIndex={day.isSelected ? 0 : -1}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>

          {/* Time Picker for datetime-local */}
          {type === 'datetime-local' && (
            <div className="mt-4 pt-4 border-t border-[var(--table-color-border,#4b5563)]">
              <label htmlFor={timePickerId} className="block text-xs font-medium text-[var(--table-color-textMuted,#9ca3af)] mb-2">
                Time
              </label>
              <input
                id={timePickerId}
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full bg-[var(--table-color-background,#111827)] border border-[var(--table-color-border,#4b5563)] rounded-[var(--table-border-radius,0.375rem)] py-2 px-3 text-sm text-[var(--table-color-text,#f3f4f6)] focus:ring-2 focus:ring-[var(--table-color-primary,#6366f1)] focus:border-[var(--table-color-primary,#6366f1)] outline-none transition-colors"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export prop types for better TypeScript integration
export type DatePickerType = 'date' | 'datetime-local';