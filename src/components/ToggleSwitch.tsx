import React from 'react';

interface ToggleSwitchProps {
  id: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, isChecked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${isChecked ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isChecked ? 'translate-x-4' : ''}`}></div>
      </div>
    </label>
  );
};