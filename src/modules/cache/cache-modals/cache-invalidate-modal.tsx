'use client';

import { Button, ListBox, Modal, Select } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { SelectCourse, SelectProfessor } from '@/components/shared';
import type { AiCacheInvalidateDto } from '@/apis/services/ai-cache';

interface CacheInvalidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvalidate: (payload: AiCacheInvalidateDto) => Promise<void>;
  isPending?: boolean;
}

export const CacheInvalidateModal = ({
  isOpen,
  onClose,
  onInvalidate,
  isPending = false,
}: CacheInvalidateModalProps) => {
  const t = useTranslations('cache.invalidateModal');
  const tCommon = useTranslations('common');
  const [criteriaType, setCriteriaType] = useState<'professor' | 'course' | 'all'>('professor');
  const [targetId, setTargetId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (criteriaType === 'all') {
      await onInvalidate({ all: true });
    } else if (criteriaType === 'professor') {
      await onInvalidate({ professorId: targetId });
    } else {
      await onInvalidate({ courseId: targetId });
    }
    setTargetId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <form onSubmit={handleSubmit}>
              <Modal.Header>
                <div className="flex items-center gap-2">
                  <RotateCcw className={`text-primary-600 ${ICON_SIZE_CLASS.md}`} />
                  <Modal.Heading>{t('title')}</Modal.Heading>
                </div>
              </Modal.Header>

              <Modal.Body className="space-y-4">
                <p className="text-body-sm text-neutral-600">
                  {t('description')}
                </p>

                <div>
                  <label className="mb-1.5 block text-label font-medium text-neutral-700">
                    {t('typeLabel')}
                  </label>
                  <Select
                    selectedKey={criteriaType}
                    onSelectionChange={(key) => setCriteriaType(String(key) as 'professor' | 'course' | 'all')}
                    variant="secondary"
                    className="w-full"
                    aria-label={t('typeLabel')}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox aria-label={t('typeLabel')}>
                        <ListBox.Item id="professor" textValue={t('byProfessor')}>
                          {t('byProfessor')}
                        </ListBox.Item>
                        <ListBox.Item id="course" textValue={t('byCourse')}>
                          {t('byCourse')}
                        </ListBox.Item>
                        <ListBox.Item id="all" textValue={t('all')}>
                          {t('all')}
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {criteriaType === 'professor' && (
                  <div>
                    <SelectProfessor
                      value={targetId}
                      onChange={(val) => setTargetId(val)}
                      label={t('selectProfessor')}
                      placeholder={tCommon('academic.selectProfessorPlaceholder')}
                    />
                  </div>
                )}

                {criteriaType === 'course' && (
                  <div>
                    <SelectCourse
                      value={targetId}
                      onChange={(val) => setTargetId(val)}
                      label={t('selectCourse')}
                      placeholder={tCommon('academic.selectCoursePlaceholder')}
                    />
                  </div>
                )}

              </Modal.Body>

              <Modal.Footer>
                <Button variant="outline" onPress={onClose} isDisabled={isPending}>
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isPending={isPending}
                  isDisabled={criteriaType !== 'all' && !targetId.trim()}
                >
                  {t('confirm')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
