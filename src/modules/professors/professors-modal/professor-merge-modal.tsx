'use client';

import { Button, Modal } from '@heroui/react';
import { GitMerge } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { SelectProfessor } from '@/components/shared';
import { useGetRequest } from '@/hooks';
import { clientProfessorServices } from '@/apis/services/professors/client';
import type { IProfessor } from '@/models';

interface ProfessorMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetId: string) => Promise<void>;
  sourceProfessor: IProfessor | null;
  professorsList?: IProfessor[];
  isPending?: boolean;
}

export const ProfessorMergeModal = ({
  isOpen,
  onClose,
  onSubmit,
  sourceProfessor,
  isPending = false,
}: ProfessorMergeModalProps) => {
  const t = useTranslations('professors');
  const tCommon = useTranslations('common');
  const [targetId, setTargetId] = useState<string>('');

  const { data: liveCounts } = useGetRequest({
    queryKey: QUERY_KEYS.professors.relationCounts(sourceProfessor?.id ?? ''),
    requestFn: () => clientProfessorServices.getRelationCounts(sourceProfessor!.id),
    enabled: Boolean(isOpen && sourceProfessor?.id),
  });

  const relationCounts = liveCounts ?? sourceProfessor?.relationCounts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    await onSubmit(targetId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-primary-600">
                <GitMerge className={ICON_SIZE_CLASS.md} />
                <Modal.Heading>{t('modals.mergeTitle')}</Modal.Heading>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
              <Modal.Body className="flex flex-col gap-4">
                <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4 text-body-sm text-primary-900 leading-relaxed">
                  {t('modals.mergeDescription')}
                </div>

                {/* Source Details */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
                  <span className="text-caption font-semibold text-neutral-500">
                    {t('modals.mergeSourceLabel')}
                  </span>
                  <p className="mt-1 text-body-sm font-bold text-neutral-900">
                    {sourceProfessor?.name} (
                    {sourceProfessor?.universityName || tCommon('academic.unknownUniversity')})
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-caption text-neutral-500">
                    <span>
                      {t('modals.teachingsCount', { count: relationCounts?.teachings ?? 0 })}
                    </span>
                    <span>•</span>
                    <span>
                      {t('modals.reviewsCount', { count: relationCounts?.reviews ?? 0 })}
                    </span>
                    <span>•</span>
                    <span>
                      {t('modals.resourcesCount', { count: relationCounts?.resources ?? 0 })}
                    </span>
                    <span>•</span>
                    <span>
                      {t('modals.inquiriesCount', { count: relationCounts?.inquiries ?? 0 })}
                    </span>
                  </div>
                </div>

                {/* Target Selector */}
                <div className="flex flex-col gap-1.5">
                  <SelectProfessor
                    value={targetId}
                    onChange={(val) => setTargetId(val)}
                    label={t('modals.mergeTargetLabel')}
                    placeholder={t('modals.mergeSelectPlaceholder')}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onPress={onClose}
                  isDisabled={isPending}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isPending={isPending}
                  isDisabled={!targetId}
                >
                  {t('modals.mergeConfirmButton')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
