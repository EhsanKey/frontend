'use client';

import {
  Button,
  InputGroup,
  Label,
} from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  isDisabled?: boolean;
}

const PasswordField = ({
  label,
  placeholder,
  registration,
  error,
  autoComplete,
  showPasswordLabel,
  hidePasswordLabel,
  isDisabled = false,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const visibilityLabel = isVisible ? hidePasswordLabel : showPasswordLabel;
  const VisibilityIcon = isVisible ? EyeOff : Eye;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label className="text-body-sm font-medium text-neutral-700">{label}</Label>

      <InputGroup fullWidth variant="secondary">
        <InputGroup.Input
          {...registration}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          disabled={isDisabled}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />

        <InputGroup.Suffix>
          <Button
            type="button"
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={visibilityLabel}
            isDisabled={isDisabled}
            onPress={() => setIsVisible((current) => !current)}
          >
            <VisibilityIcon aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          </Button>
        </InputGroup.Suffix>
      </InputGroup>

      {error && <p className="text-caption text-danger-600 font-medium">{error}</p>}
    </div>
  );
};

export default PasswordField;
