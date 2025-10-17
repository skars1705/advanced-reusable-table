/**
 * Test Suite: Stable ID Generation for SSR Compatibility
 *
 * Verifies that ID generation is:
 * - Deterministic (same inputs = same outputs)
 * - Unique (different components = different IDs)
 * - SSR-safe (no random elements)
 * - Human-readable (meaningful prefixes)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateStableId,
  generateStableIdWithHash,
  createScopedIdGenerator,
  resetIdCounter,
} from '../generateStableId';

describe('generateStableId', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('Basic ID Generation', () => {
    it('should generate ID with prefix only', () => {
      const id = generateStableId('datepicker');
      expect(id).toBe('datepicker-1');
    });

    it('should generate sequential IDs for same prefix', () => {
      const id1 = generateStableId('filter');
      const id2 = generateStableId('filter');
      const id3 = generateStableId('filter');

      expect(id1).toBe('filter-1');
      expect(id2).toBe('filter-2');
      expect(id3).toBe('filter-3');
    });

    it('should include identifier in ID', () => {
      const id = generateStableId('filter', 'name');
      expect(id).toBe('filter-name-1');
    });

    it('should include index in ID', () => {
      const id = generateStableId('option', 'status', 0);
      expect(id).toBe('option-status-0-1');
    });

    it('should sanitize special characters in identifier', () => {
      const id1 = generateStableId('filter', 'user.email');
      const id2 = generateStableId('filter', 'address[0]');
      const id3 = generateStableId('filter', 'first name');

      expect(id1).toBe('filter-user-email-1');
      expect(id2).toBe('filter-address-0-2');
      expect(id3).toBe('filter-first-name-3');
    });

    it('should handle numeric identifiers', () => {
      const id = generateStableId('row', 42);
      expect(id).toBe('row-42-1');
    });

    it('should handle zero index', () => {
      const id = generateStableId('item', 'name', 0);
      expect(id).toBe('item-name-0-1');
    });

    it('should collapse multiple dashes', () => {
      const id = generateStableId('filter', 'user..email--address');
      expect(id).toBe('filter-user-email-address-1');
    });

    it('should remove leading and trailing dashes', () => {
      const id = generateStableId('filter', '-name-');
      expect(id).toBe('filter-name-1');
    });
  });

  describe('Counter Reset', () => {
    it('should reset counter to 0', () => {
      generateStableId('test'); // counter = 1
      generateStableId('test'); // counter = 2

      resetIdCounter();

      const id = generateStableId('test');
      expect(id).toBe('test-1'); // Counter reset
    });

    it('should generate same IDs after reset (simulates new SSR render)', () => {
      const firstRender = [
        generateStableId('filter', 'name'),
        generateStableId('filter', 'email'),
        generateStableId('sort', 'date'),
      ];

      resetIdCounter();

      const secondRender = [
        generateStableId('filter', 'name'),
        generateStableId('filter', 'email'),
        generateStableId('sort', 'date'),
      ];

      expect(secondRender).toEqual(firstRender);
    });
  });

  describe('SSR Compatibility', () => {
    it('should generate consistent IDs for same sequence', () => {
      // Simulate server render
      resetIdCounter();
      const serverIds = [
        generateStableId('show-filters-toggle'),
        generateStableId('filter', 'name'),
        generateStableId('filter', 'email'),
      ];

      // Simulate client render
      resetIdCounter();
      const clientIds = [
        generateStableId('show-filters-toggle'),
        generateStableId('filter', 'name'),
        generateStableId('filter', 'email'),
      ];

      expect(clientIds).toEqual(serverIds);
    });

    it('should not use Math.random()', () => {
      const spy = vi.spyOn(Math, 'random');

      generateStableId('test');
      generateStableId('test', 'identifier');
      generateStableId('test', 'identifier', 0);

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('Uniqueness', () => {
    it('should generate unique IDs for different prefixes', () => {
      const id1 = generateStableId('filter');
      const id2 = generateStableId('sort');
      const id3 = generateStableId('search');

      expect(new Set([id1, id2, id3]).size).toBe(3);
    });

    it('should generate unique IDs for different identifiers', () => {
      const id1 = generateStableId('filter', 'name');
      const id2 = generateStableId('filter', 'email');
      const id3 = generateStableId('filter', 'status');

      expect(new Set([id1, id2, id3]).size).toBe(3);
    });

    it('should generate unique IDs for different indices', () => {
      const id1 = generateStableId('option', 'status', 0);
      const id2 = generateStableId('option', 'status', 1);
      const id3 = generateStableId('option', 'status', 2);

      expect(new Set([id1, id2, id3]).size).toBe(3);
    });
  });
});

describe('generateStableIdWithHash', () => {
  it('should generate deterministic hash-based ID', () => {
    const id1 = generateStableIdWithHash('filter', 'name');
    const id2 = generateStableIdWithHash('filter', 'name');

    expect(id1).toBe(id2);
  });

  it('should generate different hashes for different inputs', () => {
    const id1 = generateStableIdWithHash('filter', 'name');
    const id2 = generateStableIdWithHash('filter', 'email');

    expect(id1).not.toBe(id2);
  });

  it('should include hash suffix', () => {
    const id = generateStableIdWithHash('filter', 'name');

    expect(id).toMatch(/^filter-name-[a-z0-9]{1,6}$/);
  });

  it('should generate consistent IDs regardless of call order', () => {
    const id1a = generateStableIdWithHash('filter', 'name');
    const id1b = generateStableIdWithHash('filter', 'email');

    const id2a = generateStableIdWithHash('filter', 'name');
    const id2b = generateStableIdWithHash('filter', 'email');

    expect(id1a).toBe(id2a);
    expect(id1b).toBe(id2b);
  });
});

describe('createScopedIdGenerator', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should create scoped ID generator', () => {
    const generateId = createScopedIdGenerator('table', 'users-view');

    const id = generateId('filter');
    expect(id).toBe('table-users-view-filter-1');
  });

  it('should generate multiple scoped IDs', () => {
    const generateId = createScopedIdGenerator('table', 'users-view');

    const filterId = generateId('filter');
    const sortId = generateId('sort');
    const searchId = generateId('search');

    expect(filterId).toBe('table-users-view-filter-1');
    expect(sortId).toBe('table-users-view-sort-2');
    expect(searchId).toBe('table-users-view-search-3');
  });

  it('should include additional identifiers', () => {
    const generateId = createScopedIdGenerator('table', 'users-view');

    const id = generateId('filter', 'name');
    expect(id).toBe('table-users-view-filter-name-1');
  });

  it('should include index parameter', () => {
    const generateId = createScopedIdGenerator('table', 'users-view');

    const id = generateId('option', 'status', 0);
    expect(id).toBe('table-users-view-option-status-0-1');
  });

  it('should work without instance ID', () => {
    const generateId = createScopedIdGenerator('table');

    const id = generateId('filter');
    expect(id).toBe('table-filter-1');
  });

  it('should sanitize instance ID', () => {
    const generateId = createScopedIdGenerator('table', 'users.view[0]');

    const id = generateId('filter');
    expect(id).toBe('table-users-view-0-filter-1');
  });

  it('should create independent scopes', () => {
    const table1 = createScopedIdGenerator('table', 'users-view');
    const table2 = createScopedIdGenerator('table', 'products-view');

    const id1 = table1('filter');
    const id2 = table2('filter');

    expect(id1).not.toBe(id2);
    expect(id1).toContain('users-view');
    expect(id2).toContain('products-view');
  });
});

describe('Real-world Usage Scenarios', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should handle ReusableTable show-filters toggle', () => {
    const viewConfigId = 'users-view';
    const toggleId = generateStableId('show-filters-toggle', viewConfigId);

    expect(toggleId).toBe('show-filters-toggle-users-view-1');
  });

  it('should handle CollectionCell component IDs', () => {
    const componentId = generateStableId('collection');
    const listId = `${componentId}-list`;
    const descriptionId = `${componentId}-description`;

    expect(componentId).toBe('collection-1');
    expect(listId).toBe('collection-1-list');
    expect(descriptionId).toBe('collection-1-description');
  });

  it('should handle RadioCollectionInput group names', () => {
    const id1 = generateStableId('radio-collection', 'permissions');
    const id2 = generateStableId('radio-collection', 'roles');

    expect(id1).toBe('radio-collection-permissions-1');
    expect(id2).toBe('radio-collection-roles-2');
  });

  it('should handle DatePicker IDs', () => {
    const datePickerId = generateStableId('datepicker');
    const calendarId = `${datePickerId}-calendar`;
    const timePickerId = `${datePickerId}-time`;

    expect(datePickerId).toBe('datepicker-1');
    expect(calendarId).toBe('datepicker-1-calendar');
    expect(timePickerId).toBe('datepicker-1-time');
  });

  it('should handle GlobalSearch IDs', () => {
    const searchInputId = generateStableId('global-search');
    const resultsId = `${searchInputId}-results`;

    expect(searchInputId).toBe('global-search-1');
    expect(resultsId).toBe('global-search-1-results');
  });

  it('should handle multiple table instances on same page', () => {
    const table1Toggle = generateStableId('show-filters-toggle', 'users-view');
    const table1Filter = generateStableId('filter', 'name');

    const table2Toggle = generateStableId('show-filters-toggle', 'products-view');
    const table2Filter = generateStableId('filter', 'name');

    expect(table1Toggle).not.toBe(table2Toggle);
    expect(table1Filter).not.toBe(table2Filter);
  });
});
