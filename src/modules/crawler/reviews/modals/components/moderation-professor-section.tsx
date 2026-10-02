'use client';

import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField, SelectProfessor } from '@/components/shared';
import { ICON_SIZE_CLASS } from '@/constants';
import type { ILookupItem } from '@/models';

export interface ModerationProfessorSectionProps {
  isNew: boolean;
  onIsNewChange: (isNew: boolean) => void;
  professorId: string;
  onProfessorSelect: (id: string, item?: ILookupItem) => void;
  professorName: string;
  onProfessorNameChange: (name: string) => void;
  isDisabled?: boolean;
  errorMessage?: string;
}

export const ModerationProfessorSection = ({
  isNew,
  onIsNewChange,
  professorId,
  onProfessorSelect,
  professorName,
  onProfessorNameChange,
  isDisabled,
  errorMessage,
}: ModerationProfessorSectionProps) => {
  const t = useTranslations('crawler.reviews.moderationModal');

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-body-sm font-bold text-neutral-800 flex items-center gap-1.5">
          <User className={ICON_SIZE_CLASS.sm} />
          <span>{t('professorSectionTitle')}</span>
        </h4>
        <button
          type="button"
          role="switch"
          aria-checked={isNew}
          disabled={isDisabled}
          onClick={() => onIsNewChange(!isNew)}
          className="flex items-center gap-2 cursor-pointer text-caption text-neutral-600 select-none hover:text-neutral-900 transition-colors"
        >
          <span>{t('isProfessorNew')}</span>
          <div
            dir="ltr"
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
              isNew ? 'bg-primary-600' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                isNew ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
      </div>

      {isNew ? (
        <InputField
          label={t('newProfessorName')}
          value={professorName}
          onChange={(e) => onProfessorNameChange(e.target.value)}
          placeholder={t('newProfessorPlaceholder')}
          errorMessage={errorMessage}
          isInvalid={Boolean(errorMessage)}
          isDisabled={isDisabled}
        />
      ) : (
        <SelectProfessor
          label={t('existingProfessor')}
          value={professorId}
          initialLabel={professorName}
          onChange={onProfessorSelect}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
};
