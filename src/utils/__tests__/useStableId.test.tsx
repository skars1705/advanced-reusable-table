/**
 * Test Suite: useStableId React Hook
 *
 * Verifies that the React hook provides:
 * - Stable IDs across re-renders
 * - Unique IDs for different components
 * - SSR compatibility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStableId, useScopedIds } from '../useStableId';
import { resetIdCounter } from '../generateStableId';

describe('useStableId', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('Basic Hook Usage', () => {
    it('should generate stable ID', () => {
      const { result } = renderHook(() => useStableId('test'));

      expect(result.current).toBe('test-1');
    });

    it('should generate ID with identifier', () => {
      const { result } = renderHook(() => useStableId('filter', 'name'));

      expect(result.current).toBe('filter-name-1');
    });

    it('should generate ID with identifier and index', () => {
      const { result } = renderHook(() => useStableId('option', 'status', 0));

      expect(result.current).toBe('option-status-0-1');
    });
  });

  describe('Stability Across Re-renders', () => {
    it('should return same ID on re-render', () => {
      const { result, rerender } = renderHook(() => useStableId('test'));

      const firstId = result.current;
      rerender();
      const secondId = result.current;
      rerender();
      const thirdId = result.current;

      expect(firstId).toBe(secondId);
      expect(secondId).toBe(thirdId);
      expect(firstId).toBe('test-1');
    });

    it('should return same ID when props change', () => {
      const { result, rerender } = renderHook(
        ({ count }) => useStableId('test'),
        { initialProps: { count: 0 } }
      );

      const firstId = result.current;

      rerender({ count: 1 });
      const secondId = result.current;

      rerender({ count: 2 });
      const thirdId = result.current;

      expect(firstId).toBe(secondId);
      expect(secondId).toBe(thirdId);
    });

    it('should maintain stability with changing identifier prop', () => {
      const { result, rerender } = renderHook(
        ({ id }) => useStableId('filter', id),
        { initialProps: { id: 'name' } }
      );

      const firstId = result.current;

      // Even though identifier changes in prop, hook returns same ID
      rerender({ id: 'email' });
      const secondId = result.current;

      expect(firstId).toBe(secondId);
    });
  });

  describe('Uniqueness', () => {
    it('should generate different IDs for different hook calls', () => {
      const { result: result1 } = renderHook(() => useStableId('filter'));
      const { result: result2 } = renderHook(() => useStableId('filter'));
      const { result: result3 } = renderHook(() => useStableId('filter'));

      expect(result1.current).toBe('filter-1');
      expect(result2.current).toBe('filter-2');
      expect(result3.current).toBe('filter-3');
    });

    it('should generate different IDs for different identifiers', () => {
      const { result: result1 } = renderHook(() => useStableId('filter', 'name'));
      const { result: result2 } = renderHook(() => useStableId('filter', 'email'));

      expect(result1.current).not.toBe(result2.current);
      expect(result1.current).toBe('filter-name-1');
      expect(result2.current).toBe('filter-email-2');
    });
  });

  describe('SSR Simulation', () => {
    it('should generate consistent IDs across server and client renders', () => {
      // Simulate server render
      resetIdCounter();
      const { result: serverResult } = renderHook(() => useStableId('test'));
      const serverId = serverResult.current;

      // Simulate client render (same component tree)
      resetIdCounter();
      const { result: clientResult } = renderHook(() => useStableId('test'));
      const clientId = clientResult.current;

      expect(clientId).toBe(serverId);
    });

    it('should handle multiple components consistently', () => {
      // Server render simulation
      resetIdCounter();
      const { result: s1 } = renderHook(() => useStableId('filter', 'name'));
      const { result: s2 } = renderHook(() => useStableId('filter', 'email'));
      const { result: s3 } = renderHook(() => useStableId('sort', 'date'));

      const serverIds = [s1.current, s2.current, s3.current];

      // Client render simulation
      resetIdCounter();
      const { result: c1 } = renderHook(() => useStableId('filter', 'name'));
      const { result: c2 } = renderHook(() => useStableId('filter', 'email'));
      const { result: c3 } = renderHook(() => useStableId('sort', 'date'));

      const clientIds = [c1.current, c2.current, c3.current];

      expect(clientIds).toEqual(serverIds);
    });
  });
});

describe('useScopedIds', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('Basic Scoped ID Generation', () => {
    it('should generate scoped IDs', () => {
      const { result } = renderHook(() => useScopedIds('form-field', 'username'));

      expect(result.current.input()).toContain('form-field-username');
      expect(result.current.label()).toContain('form-field-username');
      expect(result.current.description()).toContain('form-field-username');
      expect(result.current.error()).toContain('form-field-username');
      expect(result.current.list()).toContain('form-field-username');
    });

    it('should generate different IDs for different elements', () => {
      const { result } = renderHook(() => useScopedIds('form-field', 'username'));

      const ids = [
        result.current.input(),
        result.current.label(),
        result.current.description(),
        result.current.error(),
        result.current.list(),
      ];

      // All IDs should be unique
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should support custom element generation', () => {
      const { result } = renderHook(() => useScopedIds('table', 'users-view'));

      const customId = result.current.generate('filter', 'name');
      expect(customId).toContain('table-users-view-filter-name');
    });
  });

  describe('Stability Across Re-renders', () => {
    it('should return same IDs on re-render', () => {
      const { result, rerender } = renderHook(() => useScopedIds('form-field', 'email'));

      const firstInputId = result.current.input();
      const firstLabelId = result.current.label();

      rerender();

      const secondInputId = result.current.input();
      const secondLabelId = result.current.label();

      expect(firstInputId).toBe(secondInputId);
      expect(firstLabelId).toBe(secondLabelId);
    });
  });
});

describe('Real-world Component Scenarios', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should simulate ReusableTable component', () => {
    const viewConfigId = 'users-view';
    const { result } = renderHook(() => useStableId('show-filters-toggle', viewConfigId));

    expect(result.current).toBe('show-filters-toggle-users-view-1');
  });

  it('should simulate multiple filter inputs', () => {
    const { result: name } = renderHook(() => useStableId('filter', 'name'));
    const { result: email } = renderHook(() => useStableId('filter', 'email'));
    const { result: status } = renderHook(() => useStableId('filter', 'status'));

    expect(name.current).toBe('filter-name-1');
    expect(email.current).toBe('filter-email-2');
    expect(status.current).toBe('filter-status-3');

    // Re-render all components
    renderHook(() => useStableId('filter', 'name'));
    renderHook(() => useStableId('filter', 'email'));
    renderHook(() => useStableId('filter', 'status'));

    // IDs should remain stable within each component instance
    expect(name.current).toBe('filter-name-1');
    expect(email.current).toBe('filter-email-2');
    expect(status.current).toBe('filter-status-3');
  });

  it('should simulate DatePicker with derived IDs', () => {
    const { result } = renderHook(() => useStableId('datepicker'));

    const datePickerId = result.current;
    const calendarId = `${datePickerId}-calendar`;
    const timePickerId = `${datePickerId}-time`;

    expect(datePickerId).toBe('datepicker-1');
    expect(calendarId).toBe('datepicker-1-calendar');
    expect(timePickerId).toBe('datepicker-1-time');
  });

  it('should simulate RadioCollectionInput', () => {
    const providedId = 'permissions';
    const { result } = renderHook(() => useStableId('radio-collection', providedId));

    expect(result.current).toBe('radio-collection-permissions-1');
  });

  it('should simulate form field with all ARIA relationships', () => {
    const { result } = renderHook(() => useScopedIds('email-field', 'user-email'));

    const inputId = result.current.input();
    const labelId = result.current.label();
    const descriptionId = result.current.description();
    const errorId = result.current.error();

    // Verify ARIA relationships can be established
    expect(inputId).toBeTruthy();
    expect(labelId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    expect(errorId).toBeTruthy();

    // All IDs should be unique
    expect(new Set([inputId, labelId, descriptionId, errorId]).size).toBe(4);
  });
});
