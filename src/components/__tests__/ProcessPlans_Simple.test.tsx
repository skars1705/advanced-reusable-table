import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ProcessPlans, processPlans, processPlansColumns } from '../../data/sampleData';
import { ThemeProvider } from '../ThemeProvider';

describe('ProcessPlans Data Integration', () => {
  test('should have ProcessPlans data available', () => {
    expect(processPlans).toBeDefined();
    expect(processPlans.length).toBeGreaterThan(0);
    expect(processPlans[0]).toHaveProperty('Ordning');
    expect(processPlans[0]).toHaveProperty('Aktivitet');
    expect(processPlans[0]).toHaveProperty('Status');
  });

  test('should have ProcessPlans columns configured', () => {
    expect(processPlansColumns).toBeDefined();
    expect(processPlansColumns.length).toBeGreaterThan(0);
    
    // Check for key columns
    const columnAccessors = processPlansColumns.map(col => col.accessor);
    expect(columnAccessors).toContain('Ordning');
    expect(columnAccessors).toContain('Aktivitet');
    expect(columnAccessors).toContain('Aktivitetskommentar');
    expect(columnAccessors).toContain('Status');
    expect(columnAccessors).toContain('Utföres_senast');
    expect(columnAccessors).toContain('Utfört_datum');
  });

  test('should have mixed content types in data', () => {
    // Text comment
    const textComment = processPlans.find(p => typeof p.Aktivitetskommentar === 'string');
    expect(textComment).toBeDefined();
    
    // Array collection
    const arrayComment = processPlans.find(p => Array.isArray(p.Aktivitetskommentar));
    expect(arrayComment).toBeDefined();
    
    // Null comment
    const nullComment = processPlans.find(p => p.Aktivitetskommentar === null);
    expect(nullComment).toBeDefined();
  });

  test('should have different status types', () => {
    const statuses = processPlans.map(p => p.Status);
    expect(statuses).toContain('Not Started');
    expect(statuses).toContain('In Progress');
    expect(statuses).toContain('Completed');
  });

  test('should have date fields', () => {
    const withDueDate = processPlans.find(p => p.Utföres_senast);
    expect(withDueDate).toBeDefined();
    
    const withCompletionDate = processPlans.find(p => p.Utfört_datum);
    expect(withCompletionDate).toBeDefined();
  });

  test('should have proper column configuration for collections', () => {
    // Status column should be collection type
    const statusColumn = processPlansColumns.find(col => col.accessor === 'Status');
    expect(statusColumn?.dataType).toBe('collection');
    expect(statusColumn?.collectionConfig?.type).toBe('radio');
    expect(statusColumn?.collectionConfig?.inputMode).toBe('chips');
    
    // Should have status options
    const statusOptions = statusColumn?.collectionConfig?.options;
    expect(statusOptions).toBeDefined();
    expect(statusOptions?.length).toBe(3);
    expect(statusOptions?.find(opt => opt.value === 'Not Started')).toBeDefined();
    expect(statusOptions?.find(opt => opt.value === 'In Progress')).toBeDefined();
    expect(statusOptions?.find(opt => opt.value === 'Completed')).toBeDefined();
  });

  test('should have Swedish locale configuration for dates', () => {
    const dueDateColumn = processPlansColumns.find(col => col.accessor === 'Utföres_senast');
    expect(dueDateColumn?.dateOptions?.locale).toBe('sv-SE');
    expect(dueDateColumn?.dateOptions?.dateStyle).toBe('medium');
    
    const completionDateColumn = processPlansColumns.find(col => col.accessor === 'Utfört_datum');
    expect(completionDateColumn?.dateOptions?.locale).toBe('sv-SE');
    expect(completionDateColumn?.dateOptions?.dateStyle).toBe('medium');
  });
});

describe('ProcessPlans Dynamic Rendering Configuration', () => {
  test('should have renderCell function for Activity Comments', () => {
    const commentsColumn = processPlansColumns.find(col => col.accessor === 'Aktivitetskommentar');
    expect(commentsColumn?.renderCell).toBeDefined();
    expect(typeof commentsColumn?.renderCell).toBe('function');
  });

  test('should have conditional editing for Completion Date', () => {
    const completionColumn = processPlansColumns.find(col => col.accessor === 'Utfört_datum');
    expect(completionColumn?.renderCell).toBeDefined();
    expect(typeof completionColumn?.renderCell).toBe('function');
  });

  test('should support ThemeProvider', () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});