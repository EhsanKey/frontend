'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export interface SwitchFieldProps {
  label: string;
  description?: string;
  isSelected: boolean;
  onChange: (selected: boolean) => void;
  isDisabled?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export const SwitchField = ({
  label,
  description,
  isSelected,
  onChange,
  isDisabled = false,
  activeLabel,
  inactiveLabel,
  className = '',
}: SwitchFieldProps) => {
  const tCommon = useTranslations('common');
  const handleToggle = () => {
    if (!isDisabled) {
      onChange(!isSelected);
    }
  };

  return (
    <div
      role="switch"
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
        <div className="flex items-center gap-2">
          <span
            className={`text-body-sm font-semibold transition-colors ${
              isSelected ? 'text-primary-950 font-bold' : 'text-neutral-800'
            }`}
          >
            {label}
          </span>
          {(activeLabel || inactiveLabel) && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                isSelected
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {isSelected ? (activeLabel ?? tCommon('ui.active')) : (inactiveLabel ?? tCommon('ui.inactive'))}
            </span>
          )}
        </div>
        {description && (
          <p className="text-caption text-neutral-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div
        dir="ltr"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
          isSelected ? 'bg-primary-600' : 'bg-neutral-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            isSelected ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
};

export default SwitchField;
