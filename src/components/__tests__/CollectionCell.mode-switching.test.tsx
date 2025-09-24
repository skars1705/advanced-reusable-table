import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CollectionCell from '../CollectionCell';
import type { CheckboxCollectionConfig, RadioCollectionConfig } from '../../types';

// Mock ResizeObserver for CollectionDisplay
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('CollectionCell - Mode Switching and Inline Editing', () => {
  const checkboxConfig: CheckboxCollectionConfig = {
    type: 'checkbox',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', color: '#ff5733' },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholder: 'Select options...',
  };

  const radioConfig: RadioCollectionConfig = {
    type: 'radio',
    options: [
      { value: 'choice1', label: 'Choice 1' },
      { value: 'choice2', label: 'Choice 2' },
    ],
    placeholder: 'Select choice...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mode Initialization', () => {
    it('defaults to input mode when no initialMode specified', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
        />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByTestId('collection-display')).not.toBeInTheDocument();
    });

    it('starts in display mode when initialMode is display', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('starts in input mode when initialMode is input', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByTestId('collection-display')).not.toBeInTheDocument();
    });
  });

  describe('Display Mode Features', () => {
    it('shows chips in display mode', () => {
      render(
        <CollectionCell
          value={['option1', 'option2']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      expect(screen.getByTestId('chip-option1')).toBeInTheDocument();
      expect(screen.getByTestId('chip-option2')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('shows edit button in display mode when enabled', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          showEditButton={true}
        />
      );

      expect(screen.getByTestId('edit-button')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit checkbox collection')).toBeInTheDocument();
    });

    it('hides edit button when showEditButton is false', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          showEditButton={false}
        />
      );

      expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('hides edit button when readOnly', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          readOnly
        />
      );

      expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('hides edit button when disabled', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          disabled
        />
      );

      expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('shows empty state in display mode when no values', () => {
      render(
        <CollectionCell
          value={[]}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      expect(screen.getByText('Select options...')).toBeInTheDocument();
    });
  });

  describe('Mode Switching via Edit Button', () => {
    it('switches to input mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      // Start in display mode
      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();

      // Click edit button
      await user.click(screen.getByTestId('edit-button'));

      // Should switch to input mode
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByTestId('collection-display')).not.toBeInTheDocument();
    });

    it('calls onModeChange callback when switching modes', async () => {
      const user = userEvent.setup();
      const onModeChangeMock = jest.fn();

      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          onModeChange={onModeChangeMock}
        />
      );

      await user.click(screen.getByTestId('edit-button'));
      expect(onModeChangeMock).toHaveBeenCalledWith('input');
    });

    it('opens dropdown automatically when switching to input mode', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      await user.click(screen.getByTestId('edit-button'));
      expect(screen.getByText('Option 1')).toBeInTheDocument(); // Option from dropdown
    });
  });

  describe('Mode Switching via Keyboard', () => {
    it('switches to input mode on Enter key in display mode', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      // Focus the edit button and press Enter
      const editButton = screen.getByTestId('edit-button');
      editButton.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('switches to input mode on Space key in display mode', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      // Focus the edit button and press Space
      const editButton = screen.getByTestId('edit-button');
      editButton.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('does not switch modes when readOnly', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          readOnly
        />
      );

      // Try various methods to switch (no edit button available)
      const display = screen.getByTestId('collection-display');
      display.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  describe('Input Mode Features', () => {
    it('shows save and cancel buttons in input mode', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      expect(screen.getByTitle('Save changes')).toBeInTheDocument();
      expect(screen.getByTitle('Cancel changes')).toBeInTheDocument();
    });

    it('shows dropdown when clicked in input mode', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      const combobox = screen.getByRole('combobox');
      await user.click(combobox);

      // Should show the checkbox options
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });
  });

  describe('Save and Cancel Actions', () => {
    it('switches to display mode when save button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      await user.click(screen.getByTitle('Save changes'));
      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('switches to display mode when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      await user.click(screen.getByTitle('Cancel changes'));
      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('resets to original value when cancelled', async () => {
      const user = userEvent.setup();
      const onChangeMock = jest.fn();

      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={onChangeMock}
          initialMode="input"
        />
      );

      // Open dropdown and make a change
      const combobox = screen.getByRole('combobox');
      await user.click(combobox);

      const option2Checkbox = screen.getByLabelText('Option 2');
      await user.click(option2Checkbox);

      expect(onChangeMock).toHaveBeenCalledWith(['option1', 'option2']);
      onChangeMock.mockClear();

      // Cancel changes
      await user.click(screen.getByTitle('Cancel changes'));

      // Should reset to original value
      expect(onChangeMock).toHaveBeenCalledWith(['option1']);
    });

    it('auto-saves when tabbing out of input mode', async () => {
      const user = userEvent.setup();
      const onModeChangeMock = jest.fn();

      render(
        <div>
          <CollectionCell
            value={['option1']}
            config={checkboxConfig}
            onChange={() => {}}
            initialMode="input"
            onModeChange={onModeChangeMock}
          />
          <button>Other element</button>
        </div>
      );

      // Focus the input and make it active
      const combobox = screen.getByRole('combobox');
      await user.click(combobox);

      // Tab out
      await user.keyboard('{Tab}');

      // Should auto-save (switch to display mode)
      await waitFor(() => {
        expect(onModeChangeMock).toHaveBeenCalledWith('display');
      });
    });
  });

  describe('Keyboard Shortcuts in Input Mode', () => {
    it('cancels changes on Escape key', async () => {
      const user = userEvent.setup();
      const onChangeMock = jest.fn();

      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={onChangeMock}
          initialMode="input"
        />
      );

      // Make a change then press Escape
      const combobox = screen.getByRole('combobox');
      combobox.focus();
      await user.keyboard('{Escape}');

      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
    });

    it('closes dropdown on first Escape, cancels edit on second Escape', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      // Open dropdown
      const combobox = screen.getByRole('combobox');
      await user.click(combobox);
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);

      // First Escape - close dropdown
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument(); // Still in input mode

      // Second Escape - cancel edit
      await user.keyboard('{Escape}');
      expect(screen.getByTestId('collection-display')).toBeInTheDocument();
    });
  });

  describe('Chip Removal in Display Mode', () => {
    it('removes chip when remove button is clicked in display mode', async () => {
      const user = userEvent.setup();
      const onChangeMock = jest.fn();

      render(
        <CollectionCell
          value={['option1', 'option2']}
          config={checkboxConfig}
          onChange={onChangeMock}
          initialMode="display"
        />
      );

      await user.click(screen.getByTestId('chip-remove-option1'));
      expect(onChangeMock).toHaveBeenCalledWith(['option2']);
    });

    it('handles chip removal for radio collection (clears selection)', async () => {
      const user = userEvent.setup();
      const onChangeMock = jest.fn();

      render(
        <CollectionCell
          value="choice1"
          config={radioConfig}
          onChange={onChangeMock}
          initialMode="display"
        />
      );

      await user.click(screen.getByTestId('chip-remove-choice1'));
      expect(onChangeMock).toHaveBeenCalledWith('');
    });

    it('does not allow chip removal when readOnly', () => {
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          readOnly
        />
      );

      expect(screen.queryByTestId('chip-remove-option1')).not.toBeInTheDocument();
    });
  });

  describe('Radio Collection Display', () => {
    it('displays single chip for radio selection', () => {
      render(
        <CollectionCell
          value="choice1"
          config={radioConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      expect(screen.getByTestId('chip-choice1')).toBeInTheDocument();
      expect(screen.getByText('Choice 1')).toBeInTheDocument();
      expect(screen.queryByTestId('chip-choice2')).not.toBeInTheDocument();
    });

    it('shows empty state for radio with no selection', () => {
      render(
        <CollectionCell
          value=""
          config={radioConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      expect(screen.getByText('Select choice...')).toBeInTheDocument();
    });
  });

  describe('Accessibility in Mode Switching', () => {
    it('maintains focus appropriately during mode switches', async () => {
      const user = userEvent.setup();
      render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      const editButton = screen.getByTestId('edit-button');
      editButton.focus();
      expect(editButton).toHaveFocus();

      await user.keyboard('{Enter}');

      // After switching to input mode, focus should be on the input
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveFocus();
    });

    it('announces mode changes to screen readers', () => {
      const { rerender } = render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
        />
      );

      const container = screen.getByTestId('collection-cell') || screen.getByRole('group').parentElement;
      expect(container).toHaveAttribute('data-edit-mode', 'display');

      rerender(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
        />
      );

      expect(container).toHaveAttribute('data-edit-mode', 'input');
    });

    it('has proper ARIA labels for different modes', () => {
      const { rerender } = render(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="display"
          aria-label="Custom collection"
        />
      );

      expect(screen.getByLabelText(/Custom collection|checkbox collection display/)).toBeInTheDocument();

      rerender(
        <CollectionCell
          value={['option1']}
          config={checkboxConfig}
          onChange={() => {}}
          initialMode="input"
          aria-label="Custom collection"
        />
      );

      expect(screen.getByLabelText(/Custom collection|checkbox collection/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('shows validation errors in both modes', () => {
      const configWithValidation: CheckboxCollectionConfig = {
        ...checkboxConfig,
        minSelections: 2,
      };

      const { rerender } = render(
        <CollectionCell
          value={['option1']}
          config={configWithValidation}
          onChange={() => {}}
          initialMode="display"
        />
      );

      expect(screen.getByText(/Minimum 2 selection/)).toBeInTheDocument();

      rerender(
        <CollectionCell
          value={['option1']}
          config={configWithValidation}
          onChange={() => {}}
          initialMode="input"
        />
      );

      expect(screen.getByText(/Minimum 2 selection/)).toBeInTheDocument();
    });
  });
});