import React from 'react';
import type { CheckboxCollectionConfig, RadioCollectionConfig, CollectionOption } from '../src/types';
import { CollectionCell } from '../src/components/CollectionCell';

// Sample data for demonstrations
const skillOptions: CollectionOption[] = [
  { value: 'react', label: 'React', color: '#61dafb' },
  { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { value: 'nodejs', label: 'Node.js', color: '#339933' },
  { value: 'graphql', label: 'GraphQL', color: '#e10098' },
  { value: 'docker', label: 'Docker', color: '#2496ed' },
  { value: 'aws', label: 'AWS', color: '#ff9900' },
  { value: 'mongodb', label: 'MongoDB', color: '#47a248' },
  { value: 'postgresql', label: 'PostgreSQL', color: '#336791' },
  { value: 'redis', label: 'Redis', color: '#dc382d' },
  { value: 'kubernetes', label: 'Kubernetes', color: '#326ce5' },
];

const priorityOptions: CollectionOption[] = [
  { value: 'low', label: 'Low Priority', color: '#10b981' },
  { value: 'medium', label: 'Medium Priority', color: '#f59e0b' },
  { value: 'high', label: 'High Priority', color: '#ef4444' },
  { value: 'critical', label: 'Critical', color: '#7c2d12' },
];

/**
 * FlexibleCollectionModesDemo - Comprehensive demonstration of enhanced collection display modes
 * 
 * This example showcases all the new flexible display configurations:
 * 1. Input Mode Choice: Traditional checkboxes/radio vs modern chip-based selectors
 * 2. Display Mode Options: Inline chips vs dropdown for space management  
 * 3. Smart Defaults: Automatic mode selection based on option count
 */
export const FlexibleCollectionModesDemo: React.FC = () => {
  // State for different collection examples
  const [traditionalCheckboxSkills, setTraditionalCheckboxSkills] = React.useState<string[]>(['react', 'typescript']);
  const [chipsCheckboxSkills, setChipsCheckboxSkills] = React.useState<string[]>(['nodejs', 'docker', 'aws']);
  const [inlineDisplaySkills, setInlineDisplaySkills] = React.useState<string[]>(['react', 'typescript']);
  const [dropdownDisplaySkills, setDropdownDisplaySkills] = React.useState<string[]>(['react', 'typescript', 'nodejs', 'docker', 'aws', 'mongodb']);
  const [autoDisplaySkills, setAutoDisplaySkills] = React.useState<string[]>(['react', 'typescript', 'nodejs']);
  
  const [traditionalRadioPriority, setTraditionalRadioPriority] = React.useState<string>('medium');
  const [chipsRadioPriority, setChipsRadioPriority] = React.useState<string>('high');

  return (
    <div className="p-8 space-y-8 bg-[var(--table-color-background,#111827)] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--table-color-text,#f3f4f6)] mb-2">
          Flexible Collection Display Modes
        </h1>
        <p className="text-[var(--table-color-textMuted,#9ca3af)] mb-8">
          Comprehensive demonstration of enhanced input and display modes for collection data
        </p>

        {/* Input Mode Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--table-color-text,#f3f4f6)] border-b border-[var(--table-color-border,#4b5563)] pb-2">
            Input Mode Variations
          </h2>
          
          {/* Traditional Checkbox Input */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Traditional Checkbox Input
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Classic checkbox + label interface with search functionality and bulk actions
            </p>
            <div className="w-full max-w-md">
              <CollectionCell
                value={traditionalCheckboxSkills}
                config={{
                  type: 'checkbox',
                  options: skillOptions,
                  inputMode: 'traditional',
                  viewDisplayMode: 'inline',
                  searchable: true,
                  placeholder: 'Select your skills...',
                  maxSelections: 5,
                  selectAllOption: true
                } as CheckboxCollectionConfig}
                onChange={(value) => setTraditionalCheckboxSkills(value as string[])}
                initialMode="input"
                showEditButton={true}
              />
            </div>
          </div>

          {/* Chip-based Checkbox Input */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Chip-based Checkbox Input (Default)
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Modern chip-based selector with interactive checkbox interface
            </p>
            <div className="w-full max-w-md">
              <CollectionCell
                value={chipsCheckboxSkills}
                config={{
                  type: 'checkbox',
                  options: skillOptions,
                  inputMode: 'chips', // Explicit chips mode
                  viewDisplayMode: 'inline',
                  searchable: true,
                  placeholder: 'Select technologies...',
                  maxSelections: 4
                } as CheckboxCollectionConfig}
                onChange={(value) => setChipsCheckboxSkills(value as string[])}
                initialMode="input"
                showEditButton={true}
              />
            </div>
          </div>

          {/* Traditional Radio Input */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Traditional Radio Input
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Classic radio button interface with clear selection and search
            </p>
            <div className="w-full max-w-md">
              <CollectionCell
                value={traditionalRadioPriority}
                config={{
                  type: 'radio',
                  options: priorityOptions,
                  inputMode: 'traditional',
                  viewDisplayMode: 'inline',
                  searchable: false,
                  clearable: true,
                  required: true,
                  placeholder: 'Select priority level...'
                } as RadioCollectionConfig}
                onChange={(value) => setTraditionalRadioPriority(value as string)}
                initialMode="input"
                showEditButton={true}
              />
            </div>
          </div>

          {/* Chip-based Radio Input */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Chip-based Radio Input (Default)
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Modern radio selector with chip-based interface
            </p>
            <div className="w-full max-w-md">
              <CollectionCell
                value={chipsRadioPriority}
                config={{
                  type: 'radio',
                  options: priorityOptions,
                  inputMode: 'chips', // Explicit chips mode
                  viewDisplayMode: 'inline',
                  clearable: true,
                  placeholder: 'Choose priority...'
                } as RadioCollectionConfig}
                onChange={(value) => setChipsRadioPriority(value as string)}
                initialMode="input"
                showEditButton={true}
              />
            </div>
          </div>
        </section>

        {/* Display Mode Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-[var(--table-color-text,#f3f4f6)] border-b border-[var(--table-color-border,#4b5563)] pb-2">
            Display Mode Variations
          </h2>
          
          {/* Inline Display Mode */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Inline Display Mode
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Show all selected values as chips directly in cell with overflow handling
            </p>
            <div className="w-full max-w-md">
              <CollectionCell
                value={inlineDisplaySkills}
                config={{
                  type: 'checkbox',
                  options: skillOptions,
                  inputMode: 'chips',
                  viewDisplayMode: 'inline', // Force inline display
                  maxVisibleInline: 3,
                  searchable: true,
                  placeholder: 'Select skills...'
                } as CheckboxCollectionConfig}
                onChange={(value) => setInlineDisplaySkills(value as string[])}
                initialMode="display"
                showEditButton={true}
              />
            </div>
          </div>

          {/* Dropdown Display Mode */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Dropdown Display Mode
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Collapse selections into "N selected" trigger with expandable dropdown
            </p>
            <div className="w-full max-w-md">
              <CollectionCell
                value={dropdownDisplaySkills}
                config={{
                  type: 'checkbox',
                  options: skillOptions,
                  inputMode: 'chips',
                  viewDisplayMode: 'dropdown', // Force dropdown display
                  searchable: true,
                  placeholder: 'Select multiple skills...'
                } as CheckboxCollectionConfig}
                onChange={(value) => setDropdownDisplaySkills(value as string[])}
                initialMode="display"
                showEditButton={false} // Edit button hidden for dropdown mode
              />
            </div>
          </div>

          {/* Auto Display Mode */}
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-[var(--table-color-text,#f3f4f6)] mb-4">
              Auto Display Mode (Smart Selection)
            </h3>
            <p className="text-sm text-[var(--table-color-textMuted,#9ca3af)] mb-4">
              Automatically choose inline or dropdown based on option count and selections
            </p>
            <div className="space-y-4">
              <div className="w-full max-w-md">
                <CollectionCell
                  value={autoDisplaySkills}
                  config={{
                    type: 'checkbox',
                    options: skillOptions,
                    inputMode: 'chips',
                    viewDisplayMode: 'auto', // Smart selection
                    inlineThreshold: 3, // Switch to dropdown after 3 selections
                    maxVisibleInline: 4,
                    searchable: true,
                    placeholder: 'Auto mode demonstration...'
                  } as CheckboxCollectionConfig}
                  onChange={(value) => setAutoDisplaySkills(value as string[])}
                  initialMode="display"
                  showEditButton={true}
                />
              </div>
              <div className="text-sm text-[var(--table-color-textMuted,#9ca3af)]">
                <strong>Current Logic:</strong> {autoDisplaySkills.length <= 2 ? 'Inline (≤ 2 selections)' : 
                autoDisplaySkills.length <= 3 ? 'Inline (≤ threshold)' : 
                'Would be Dropdown (> threshold)'}
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Matrix */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--table-color-text,#f3f4f6)] border-b border-[var(--table-color-border,#4b5563)] pb-2">
            Configuration Matrix
          </h2>
          
          <div className="bg-[var(--table-color-surface,#1f2937)] p-6 rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-[var(--table-color-text,#f3f4f6)]">
              <thead>
                <tr className="border-b border-[var(--table-color-border,#4b5563)]">
                  <th className="text-left py-2 px-3">Input Mode</th>
                  <th className="text-left py-2 px-3">Display Mode</th>
                  <th className="text-left py-2 px-3">Use Case</th>
                  <th className="text-left py-2 px-3">Best For</th>
                </tr>
              </thead>
              <tbody className="text-[var(--table-color-textMuted,#9ca3af)]">
                <tr className="border-b border-[var(--table-color-border,#4b5563)]">
                  <td className="py-2 px-3">traditional</td>
                  <td className="py-2 px-3">inline</td>
                  <td className="py-2 px-3">Classic forms, enterprise applications</td>
                  <td className="py-2 px-3">Familiarity, accessibility</td>
                </tr>
                <tr className="border-b border-[var(--table-color-border,#4b5563)]">
                  <td className="py-2 px-3">chips</td>
                  <td className="py-2 px-3">inline</td>
                  <td className="py-2 px-3">Modern interfaces, small selections</td>
                  <td className="py-2 px-3">Visual clarity, quick edits</td>
                </tr>
                <tr className="border-b border-[var(--table-color-border,#4b5563)]">
                  <td className="py-2 px-3">chips</td>
                  <td className="py-2 px-3">dropdown</td>
                  <td className="py-2 px-3">Space-constrained, many selections</td>
                  <td className="py-2 px-3">Space efficiency, large datasets</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">any</td>
                  <td className="py-2 px-3">auto</td>
                  <td className="py-2 px-3">Dynamic interfaces, varying data</td>
                  <td className="py-2 px-3">Adaptability, user experience</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="bg-[var(--table-color-accent,#374151)] bg-opacity-30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[var(--table-color-text,#f3f4f6)] mb-4">
            Implementation Notes
          </h2>
          <ul className="space-y-2 text-[var(--table-color-textMuted,#9ca3af)] text-sm">
            <li>• <strong>Smart Defaults:</strong> viewDisplayMode: 'auto' automatically chooses based on selection count</li>
            <li>• <strong>Backward Compatibility:</strong> Existing displayMode: 'chips' maps to viewDisplayMode: 'inline'</li>
            <li>• <strong>Accessibility:</strong> All modes support full keyboard navigation and screen reader compatibility</li>
            <li>• <strong>Theme Integration:</strong> Uses CSS custom properties for consistent styling</li>
            <li>• <strong>Performance:</strong> Dropdown mode reduces DOM complexity for large collections</li>
            <li>• <strong>Configuration:</strong> inlineThreshold and maxVisibleInline control auto mode behavior</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FlexibleCollectionModesDemo;