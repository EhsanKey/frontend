'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { LookupAutocomplete } from './lookup-autocomplete';
import { lookupServices } from '@/apis/services/lookups/client';
import type { ILookupItem } from '@/models';

export interface SelectUniversityProps {
  label?: string;
  placeholder?: string;
  value?: string | number | null;
  initialLabel?: string;
  onChange?: (value: string, item?: ILookupItem) => void;
  onClear?: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
}

export const SelectUniversity: React.FC<SelectUniversityProps> = ({
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  ...props
}: SelectUniversityProps & { searchPlaceholder?: string }) => {
  const t = useTranslations('common.academic');
  const placeholder = placeholderProp ?? t('selectUniversityPlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? t('searchUniversityPlaceholder');

  const fetchUniversities = useCallback(async (query: string) => {
    return lookupServices.lookupUniversities({ q: query });
  }, []);

  return (
    <LookupAutocomplete<ILookupItem>
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      fetchOptions={fetchUniversities}
      getOptionLabel={(u) => u.name}
      getOptionValue={(u) => u.id}
      {...props}
    />
  );
};
