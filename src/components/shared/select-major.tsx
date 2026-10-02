'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { LookupAutocomplete } from './lookup-autocomplete';
import { lookupServices } from '@/apis/services/lookups/client';
import type { ILookupItem } from '@/models';

export interface SelectMajorProps {
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

export const SelectMajor: React.FC<SelectMajorProps> = ({
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  ...props
}: SelectMajorProps & { searchPlaceholder?: string }) => {
  const t = useTranslations('common.academic');
  const placeholder = placeholderProp ?? t('selectMajorPlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? t('searchMajorPlaceholder');

  const fetchMajors = useCallback(async (query: string) => {
    return lookupServices.lookupMajors({ q: query });
  }, []);

  return (
    <LookupAutocomplete<ILookupItem>
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      fetchOptions={fetchMajors}
      getOptionLabel={(m) => m.name}
      getOptionValue={(m) => m.id}
      {...props}
    />
  );
};
