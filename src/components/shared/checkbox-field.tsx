'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxFieldProps {
  label: string;
  description?: string;
  isSelected: boolean;
  onChange: (selected: boolean) => void;
  isDisabled?: boolean;
  className?: string;
}

export const CheckboxField = ({
  label,
  description,
  isSelected,
  onChange,
  isDisabled = false,
  className = '',
}: CheckboxFieldProps) => {
  const handleToggle = () => {
    if (!isDisabled) {
      onChange(!isSelected);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all select-none ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed bg-neutral-50 border-neutral-200'
          : isSelected
          ? 'bg-primary-50/40 border-primary-300 hover:border-primary-400 cursor-pointer shadow-xs'
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/70 cursor-pointer'
      } ${className}`}
    >
      <div className="flex flex-col gap-0.5 pr-1">
        <span
          className={`text-body-sm font-semibold transition-colors ${
            isSelected ? 'text-primary-950 font-bold' : 'text-neutral-800'
          }`}
        >
          {label}
        </span>
        {description && (
          <p className="text-caption text-neutral-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-150 ${
          isSelected
            ? 'bg-primary-600 border-primary-600 text-white shadow-xs'
            : 'border-neutral-300 bg-white group-hover:border-neutral-400'
        }`}
      >
        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </div>
    </div>
  );
};

export default CheckboxField;
