import React, { useState } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from './src/components/ThemeProvider';
import CollectionCell from './src/components/CollectionCell';
import CollectionDisplay from './src/components/CollectionDisplay';
import Chip from './src/components/Chip';
import type { 
  CheckboxCollectionConfig, 
  RadioCollectionConfig,
  ChipCollectionConfig,
  CollectionOption 
} from './src/types';

/**
 * MILESTONE 3 DEMONSTRATION
 * 
 * This demo showcases the sophisticated display & visualization components:
 * 1. Chip component with colors, sizes, and removable functionality
 * 2. CollectionDisplay with overflow handling and multiple layouts
 * 3. Inline editing modes in CollectionCell with seamless transitions
 * 4. Full accessibility support and keyboard navigation
 * 5. Performance optimization for large collections
 */

const Demo: React.FC = () => {
  // Sample data for demonstrations
  const techOptions: CollectionOption[] = [
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
    { value: 'angular', label: 'Angular', color: '#dd1b16' },
    { value: 'svelte', label: 'Svelte', color: '#ff3e00' },
    { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
    { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
    { value: 'nodejs', label: 'Node.js', color: '#339933' },
    { value: 'python', label: 'Python', color: '#3776ab' },
    { value: 'golang', label: 'Go', color: '#00add8' },
    { value: 'rust', label: 'Rust', color: '#000000' },
  ];

  const priorityOptions: CollectionOption[] = [
    { value: 'low', label: 'Low Priority', color: '#22c55e' },
    { value: 'medium', label: 'Medium Priority', color: '#f59e0b' },
    { value: 'high', label: 'High Priority', color: '#ef4444' },
    { value: 'urgent', label: 'Urgent', color: '#dc2626' },
  ];

  // State for different demo scenarios
  const [techSkills, setTechSkills] = useState<string[]>(['react', 'typescript', 'nodejs']);
  const [selectedPriority, setSelectedPriority] = useState<string>('medium');
  const [largeSelection, setLargeSelection] = useState<string[]>([
    'react', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'nodejs'
  ]);
  const [editingMode, setEditingMode] = useState<'display' | 'input'>('display');

  // Collection configurations
  const techConfig: CheckboxCollectionConfig = {
    type: 'checkbox',
    options: techOptions,
    placeholder: 'Select your tech stack...',
    searchable: true,
    maxSelections: 5,
    displayMode: 'chips',
  };

  const priorityConfig: RadioCollectionConfig = {
    type: 'radio',
    options: priorityOptions,
    placeholder: 'Choose priority level...',
    required: true,
    displayMode: 'chips',
  };

  const chipConfig: ChipCollectionConfig = {
    type: 'chip',
    options: techOptions,
    placeholder: 'Select technologies...',
    maxSelections: 8,
    chipVariant: 'filled',
    removable: true,
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--table-color-background,#111827)] text-[var(--table-color-text,#f3f4f6)] p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">MILESTONE 3: Display & Visualization</h1>
            <p className="text-xl text-[var(--table-color-textMuted,#9ca3af)]">
              Sophisticated collection display with chips, inline editing, and performance optimization
            </p>
          </div>

          {/* 1. Chip Component Showcase */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-[var(--table-color-border,#4b5563)] pb-2">
              1. Chip Component Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Size Variants */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Size Variants</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">SM:</span>
                    <Chip label="Small" value="small" size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">MD:</span>
                    <Chip label="Medium" value="medium" size="md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-8">LG:</span>
                    <Chip label="Large" value="large" size="lg" />
                  </div>
                </div>
              </div>

              {/* Color Variants */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Custom Colors</h3>
                <div className="flex flex-wrap gap-2">
                  <Chip label="React" value="react" color="#61dafb" />
                  <Chip label="Vue" value="vue" color="#4fc08d" />
                  <Chip label="Angular" value="angular" color="#dd1b16" />
                  <Chip label="Svelte" value="svelte" color="#ff3e00" />
                </div>
              </div>

              {/* Interactive States */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Interactive States</h3>
                <div className="space-y-2">
                  <Chip 
                    label="Clickable" 
                    value="clickable" 
                    onClick={(value) => alert(`Clicked: ${value}`)}
                  />
                  <Chip 
                    label="Removable" 
                    value="removable" 
                    removable
                    onRemove={(value) => alert(`Removed: ${value}`)}
                  />
                  <Chip label="Disabled" value="disabled" disabled />
                </div>
              </div>
            </div>
          </section>

          {/* 2. Collection Display Showcase */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-[var(--table-color-border,#4b5563)] pb-2">
              2. Collection Display with Overflow Handling
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Display */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Basic Display (3 max visible)</h3>
                <CollectionDisplay
                  values={largeSelection}
                  options={techOptions}
                  maxVisible={3}
                  showCount={true}
                  layout="horizontal"
                  removable={true}
                  onChipRemove={(value) => {
                    setLargeSelection(prev => prev.filter(v => v !== value));
                  }}
                  onChipClick={(value) => console.log('Clicked:', value)}
                />
                <div className="mt-4 text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                  Click chips to interact, use expand/collapse, or remove items
                </div>
              </div>

              {/* Vertical Layout */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Vertical Layout</h3>
                <CollectionDisplay
                  values={['react', 'typescript', 'nodejs', 'python']}
                  options={techOptions}
                  layout="vertical"
                  removable={false}
                />
              </div>
            </div>

            {/* Grid Layout */}
            <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Grid Layout (Responsive)</h3>
              <CollectionDisplay
                values={techOptions.slice(0, 8).map(opt => opt.value)}
                options={techOptions}
                layout="grid"
                maxVisible={6}
                size="md"
                removable={true}
                onChipRemove={(value) => console.log('Removed from grid:', value)}
              />
            </div>
          </section>

          {/* 3. Inline Editing Modes */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-[var(--table-color-border,#4b5563)] pb-2">
              3. Inline Editing with Seamless Transitions
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tech Skills with Display Mode */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Tech Skills (Editable Display)</h3>
                <CollectionCell
                  value={techSkills}
                  config={techConfig}
                  onChange={setTechSkills}
                  initialMode="display"
                  showEditButton={true}
                  onModeChange={(mode) => console.log('Mode changed to:', mode)}
                  aria-label="Technology skills selection"
                />
                <div className="mt-4 space-y-2 text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                  <p>• Click edit button or press Enter to modify</p>
                  <p>• Remove chips directly in display mode</p>
                  <p>• ESC to cancel, auto-save on blur</p>
                </div>
              </div>

              {/* Priority Selection */}
              <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Priority Level (Radio)</h3>
                <CollectionCell
                  value={selectedPriority}
                  config={priorityConfig}
                  onChange={setSelectedPriority}
                  initialMode="display"
                  showEditButton={true}
                  aria-label="Priority level selection"
                />
                <div className="mt-4 text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                  Current: {priorityOptions.find(opt => opt.value === selectedPriority)?.label || 'None'}
                </div>
              </div>
            </div>

            {/* Mode Toggle Demo */}
            <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Mode Toggle Demo</h3>
                <button
                  className="px-4 py-2 bg-[var(--table-color-primary,#6366f1)] text-white rounded-md hover:bg-[var(--table-color-primary,#6366f1)]/80 transition-colors"
                  onClick={() => setEditingMode(mode => mode === 'display' ? 'input' : 'display')}
                >
                  Switch to {editingMode === 'display' ? 'Input' : 'Display'} Mode
                </button>
              </div>
              
              <CollectionCell
                value={largeSelection}
                config={chipConfig}
                onChange={setLargeSelection}
                initialMode={editingMode}
                showEditButton={true}
                onModeChange={setEditingMode}
                aria-label="Demo collection with mode toggle"
              />
            </div>
          </section>

          {/* 4. Accessibility Features */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-[var(--table-color-border,#4b5563)] pb-2">
              4. Accessibility & Keyboard Navigation
            </h2>

            <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Keyboard Navigation Demo</h3>
              <div className="mb-4">
                <CollectionDisplay
                  values={['react', 'vue', 'angular', 'typescript']}
                  options={techOptions}
                  removable={true}
                  aria-label="Keyboard navigation demo"
                  onChipRemove={(value) => console.log('Removed via keyboard:', value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2 text-[var(--table-color-accent,#10b981)]">Chip Navigation:</h4>
                  <ul className="space-y-1 text-[var(--table-color-textMuted,#9ca3af)]">
                    <li>• Tab: Focus next chip</li>
                    <li>• Arrow keys: Navigate between chips</li>
                    <li>• Home/End: First/last chip</li>
                    <li>• Delete/Backspace: Remove chip</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-[var(--table-color-accent,#10b981)]">Edit Mode:</h4>
                  <ul className="space-y-1 text-[var(--table-color-textMuted,#9ca3af)]">
                    <li>• Enter/Space: Activate editing</li>
                    <li>• Escape: Cancel changes</li>
                    <li>• Tab: Auto-save and exit</li>
                    <li>• Screen reader announcements</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Performance Optimization */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold border-b border-[var(--table-color-border,#4b5563)] pb-2">
              5. Performance Features
            </h2>

            <div className="bg-[var(--table-color-surface,#1f2937)] rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Large Collection Handling</h3>
              <div className="space-y-4">
                <p className="text-[var(--table-color-textMuted,#9ca3af)]">
                  Components are optimized for large collections (50+ items) with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[var(--table-color-background,#111827)] rounded p-4">
                    <h4 className="font-medium text-[var(--table-color-accent,#10b981)] mb-2">Smart Rendering</h4>
                    <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                      Only visible chips are rendered, with smooth expand/collapse animations
                    </p>
                  </div>
                  <div className="bg-[var(--table-color-background,#111827)] rounded p-4">
                    <h4 className="font-medium text-[var(--table-color-accent,#10b981)] mb-2">Memoization</h4>
                    <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                      React.memo and useCallback prevent unnecessary re-renders
                    </p>
                  </div>
                  <div className="bg-[var(--table-color-background,#111827)] rounded p-4">
                    <h4 className="font-medium text-[var(--table-color-accent,#10b981)] mb-2">Responsive Design</h4>
                    <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                      Automatic layout switching based on container size
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Success Criteria Summary */}
          <section className="bg-[var(--table-color-accent,#10b981)]/10 border border-[var(--table-color-accent,#10b981)]/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--table-color-accent,#10b981)]">
              ✅ MILESTONE 3 Success Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Beautiful, interactive chips with colors and removal
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Smart overflow handling with expand/collapse
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Seamless inline editing transitions
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Full keyboard navigation and screen reader support
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Smooth rendering for large collections (50+ items)
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[var(--table-color-accent,#10b981)]">✓</span>
                  Consistent theme integration and responsive design
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Demo;