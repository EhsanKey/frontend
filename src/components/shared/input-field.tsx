'use client';

import { Input, Label } from '@heroui/react';
import type { ComponentProps } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface InputFieldProps extends Omit<ComponentProps<typeof Input>, 'children'> {
  label?: string;
  error?: string;
  errorMessage?: string;
  helperText?: string;
  registration?: UseFormRegisterReturn;
  containerClassName?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

/**
 * Standard Form InputField
 * Replaces React Aria's <TextField> to prevent uncontrolled state collisions
 * and text wiping on click/focus with React Hook Form.
 */
export const InputField = ({
  label,
  error,
  errorMessage,
  helperText,
  registration,
  className,
  containerClassName = 'flex flex-col gap-1.5 w-full',
  isInvalid,
  isDisabled,
  disabled,
  ...props
}: InputFieldProps) => {
  const displayError = error || errorMessage;
  const hasError = Boolean(displayError) || isInvalid;
  const isFieldDisabled = isDisabled ?? disabled;

  return (
    <div className={containerClassName}>
      {label && (
        <Label className="text-body-sm font-medium text-neutral-700">
          {label}
        </Label>
      )}

      <Input
        aria-invalid={hasError}
        disabled={isFieldDisabled}
        className={className}
        {...registration}
        {...props}
      />

      {displayError ? (
        <p className="text-caption text-danger-600 font-medium">{displayError}</p>
      ) : helperText ? (
        <p className="text-caption text-neutral-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default InputField;
