'use client';

import { Button, Chip } from '@heroui/react';
import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import type { ILookupItem } from '@/models';
import { InputField } from './input-field';
import { SelectCourse } from './select-course';
import { SelectProfessor } from './select-professor';

export type ResolvableEntityType = 'professor' | 'course';

export interface ResolvableEntityFieldProps {
  entityType: ResolvableEntityType;
  title: string;
  icon: LucideIcon;
  /** The submission arrived referencing an entity that does not exist in the catalog yet. */
  isInitiallyNew: boolean;
  selectedId: string;
  nameRegistration: UseFormRegisterReturn;
  nameError?: string;
  onSelectExisting: (id: string, item?: ILookupItem) => void;
  onClearExisting: () => void;
  onNameEdited: () => void;
  isDisabled?: boolean;
}

/**
 * "New or existing entity" resolution card used by the review and resource editors.
 *
 * A student submission can name a professor/course that is not in the catalog yet, so
 * moderators must be able to either keep the free-text name or bind it to an existing
 * record. This card was previously copy-pasted four times (professor/course x
 * reviews/resources) and had already drifted into hardcoded Persian strings.
 */
export const ResolvableEntityField = ({
  entityType,
  title,
  icon: Icon,
  isInitiallyNew,
  selectedId,
  nameRegistration,
  nameError,
  onSelectExisting,
  onClearExisting,
  onNameEdited,
  isDisabled = false,
}: ResolvableEntityFieldProps) => {
  const t = useTranslations('common.entityResolution');

  const entityLabel = t(entityType);
  const entitiesLabel = t(`${entityType}s`);

  const selectProps = {
    value: selectedId,
    onChange: onSelectExisting,
    onClear: onClearExisting,
    isClearable: true,
    isDisabled,
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary-600" />
          <h2 className="text-sm font-bold text-neutral-900">{title}</h2>
        </div>
        <Chip
          size="sm"
          variant="secondary"
          className={
            isInitiallyNew
              ? 'bg-amber-50 text-amber-800 border border-amber-200 text-xs'
              : 'bg-neutral-100 text-neutral-700 text-xs'
          }
        >
          {`${entityLabel} ${
            isInitiallyNew ? t('newChip') : t('existingChip')
          }`}
        </Chip>
      </div>

      {!isInitiallyNew ? (
        entityType === 'professor' ? (
          <SelectProfessor
            label={t('existingLabel', { entities: entitiesLabel })}
            placeholder={t('existingPlaceholder', { entity: entityLabel })}
            {...selectProps}
          />
        ) : (
          <SelectCourse
            label={t('existingLabel', { entities: entitiesLabel })}
            placeholder={t('existingPlaceholder', { entity: entityLabel })}
            {...selectProps}
          />
        )
      ) : (
        <div className="flex flex-col gap-3">
          <InputField
            label={t('newNameLabel', { entity: entityLabel })}
            registration={nameRegistration}
            onChange={onNameEdited}
            error={nameError}
            placeholder={t('newNamePlaceholder', { entity: entityLabel })}
            isDisabled={isDisabled || Boolean(selectedId)}
            required={!selectedId}
          />

          {selectedId ? (
            <div className="flex items-center justify-between gap-3 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span>{t('overrideNotice', { entity: entityLabel })}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 shrink-0 text-xs text-amber-900 font-bold hover:bg-amber-100"
                onPress={onClearExisting}
              >
                {t('cancelOverride')}
              </Button>
            </div>
          ) : null}

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="flex-shrink mx-2 text-[11px] text-neutral-400 font-medium">
              {t('divider', { entity: entityLabel })}
            </span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          {entityType === 'professor' ? (
            <SelectProfessor
              label={t('existingLabel', { entities: entitiesLabel })}
              placeholder={t('existingPlaceholder', { entity: entityLabel })}
              {...selectProps}
            />
          ) : (
            <SelectCourse
              label={t('existingLabel', { entities: entitiesLabel })}
              placeholder={t('existingPlaceholder', { entity: entityLabel })}
              {...selectProps}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ResolvableEntityField;
