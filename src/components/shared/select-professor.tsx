'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { LookupAutocomplete } from './lookup-autocomplete';
import { lookupServices } from '@/apis/services/lookups/client';
import type { ILookupItem } from '@/models';

export interface SelectProfessorProps {
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

export const SelectProfessor: React.FC<SelectProfessorProps> = ({
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  ...props
}: SelectProfessorProps & { searchPlaceholder?: string }) => {
  const t = useTranslations('common.academic');
  const placeholder = placeholderProp ?? t('selectProfessorPlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? t('searchProfessorPlaceholder');

  const fetchProfessors = useCallback(async (query: string) => {
    return lookupServices.lookupProfessors({ q: query });
  }, []);

  return (
    <LookupAutocomplete<ILookupItem>
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      fetchOptions={fetchProfessors}
      getOptionLabel={(p) => p.name}
      getOptionValue={(p) => p.id}
      {...props}
    />
  );
};
