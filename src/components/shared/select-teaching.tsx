'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { LookupAutocomplete } from './lookup-autocomplete';
import { lookupServices } from '@/apis/services/lookups/client';
import type { ITeachingLookupItem } from '@/models';

export interface SelectTeachingProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string | number | null;
  initialLabel?: string;
  onChange?: (value: string, item?: ITeachingLookupItem) => void;
  onClear?: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
}

export const SelectTeaching: React.FC<SelectTeachingProps> = ({
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  ...props
}: SelectTeachingProps & { searchPlaceholder?: string }) => {
  const t = useTranslations('common.academic');
  const placeholder = placeholderProp ?? t('selectTeachingPlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? t('searchTeachingPlaceholder');

  const fetchTeachings = useCallback(async (query: string) => {
    return lookupServices.lookupTeachings({ q: query });
  }, []);

  return (
    <LookupAutocomplete<ITeachingLookupItem>
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      fetchOptions={fetchTeachings}
      getOptionLabel={(item) => item.title}
      getOptionValue={(item) => item.id}
      renderOption={(item) => (
        <div className="flex flex-col gap-0.5 py-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              {item.courseName || t('course')}
            </span>
            <span className="text-caption text-primary-600 font-medium">
              - {item.professorName || t('professor')}
            </span>
          </div>
          <span className="text-caption text-neutral-400 truncate">
            {item.universityName} | {item.campusName} | {item.majorName}
          </span>
        </div>
      )}
      {...props}
    />
  );
};
