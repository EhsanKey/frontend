'use client';

import { Label, ListBox, Select } from '@heroui/react';
import { useId } from 'react';
import { cn } from '@/utils';

export interface SelectFieldOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface SelectFieldProps {
  label?: string;
  value?: string | null;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  className?: string;
  containerClassName?: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Standard static option `<Select>` wrapper.
 *
 * Replaces the copy-pasted `Label + Select.Trigger + Select.Popover + ListBox` blocks
 * that used to be repeated in every form, filter bar and table toolbar.
 * For searchable academic entities keep using `SelectUniversity` / `SelectCourse` / ...
 */
export const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  className,
  containerClassName = 'flex flex-col gap-1.5 w-full',
  variant = 'secondary',
}: SelectFieldProps) => {
  const generatedId = useId();

  return (
    <div className={cn(containerClassName)}>
      {label ? (
        <Label
          id={`${generatedId}-label`}
          className="text-body-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </Label>
      ) : null}

      <Select
        selectedKey={value || undefined}
        onSelectionChange={(key) => onChange(String(key))}
        isDisabled={isDisabled}
        variant={variant}
        className={cn('w-full', className)}
        aria-label={label}
        aria-invalid={isInvalid || undefined}
        aria-labelledby={label ? `${generatedId}-label` : undefined}
      >
        <Select.Trigger>
          <Select.Value>
            {!value && placeholder ? placeholder : null}
          </Select.Value>
        </Select.Trigger>
        <Select.Popover>
          <ListBox aria-label={label}>
            {options.map((option) => (
              <ListBox.Item
                key={option.value}
                id={option.value}
                textValue={option.label}
                isDisabled={option.isDisabled}
              >
                {option.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {errorMessage ? (
        <p className="text-caption text-danger-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};

export default SelectField;
