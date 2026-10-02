'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { LookupAutocomplete } from './lookup-autocomplete';
import { lookupServices } from '@/apis/services/lookups/client';
import type { ILookupItem } from '@/models';

export interface SelectCourseProps {
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

export const SelectCourse: React.FC<SelectCourseProps> = ({
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  ...props
}: SelectCourseProps & { searchPlaceholder?: string }) => {
  const t = useTranslations('common.academic');
  const placeholder = placeholderProp ?? t('selectCoursePlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? t('searchCoursePlaceholder');

  const fetchCourses = useCallback(async (query: string) => {
    return lookupServices.lookupCourses({ q: query });
  }, []);

  return (
    <LookupAutocomplete<ILookupItem>
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      fetchOptions={fetchCourses}
      getOptionLabel={(c) => c.name}
      getOptionValue={(c) => c.id}
      {...props}
    />
  );
};
