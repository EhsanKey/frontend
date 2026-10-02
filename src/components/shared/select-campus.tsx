'use client';

import React, { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { LookupAutocomplete } from './lookup-autocomplete';
import { lookupServices } from '@/apis/services/lookups/client';
import type { ICampusLookupItem } from '@/models';

export interface SelectCampusProps {
  label?: string;
  placeholder?: string;
  universityId?: string;
  value?: string | number | null;
  initialLabel?: string;
  onChange?: (value: string, item?: ICampusLookupItem) => void;
  onClear?: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
}

export const SelectCampus: React.FC<SelectCampusProps> = ({
  placeholder: placeholderProp,
  searchPlaceholder: searchPlaceholderProp,
  universityId,
  ...props
}: SelectCampusProps & { searchPlaceholder?: string }) => {
  const t = useTranslations('common.academic');
  const placeholder = placeholderProp ?? t('selectCampusPlaceholder');
  const searchPlaceholder = searchPlaceholderProp ?? t('searchCampusPlaceholder');

  const fetchCampuses = useCallback(
    async (query: string) => {
      return lookupServices.lookupCampuses({ universityId, q: query });
    },
    [universityId],
  );

  return (
    <LookupAutocomplete<ICampusLookupItem>
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      fetchOptions={fetchCampuses}
      getOptionLabel={(c) =>
        c.universityName ? `${c.name} (${c.universityName})` : c.name
      }
      getOptionValue={(c) => c.id}
      renderOption={(c) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{c.name}</span>
          {c.universityName ? (
            <span className="text-caption text-neutral-400">
              {c.universityName}
            </span>
          ) : null}
        </div>
      )}
      {...props}
    />
  );
};
