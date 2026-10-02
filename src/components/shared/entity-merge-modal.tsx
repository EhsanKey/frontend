'use client';

import { Button, Modal } from '@heroui/react';
import { GitMerge } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';

export interface EntityMergeStat {
  /** Fully formatted label, e.g. `t('modals.reviewsCount', { count: 3 })`. */
  label: string;
}

export interface EntityMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (targetId: string) => Promise<void>;
  sourceLabel: string;
  /** Rendered entity name of the record that will be removed. */
  sourceValue: ReactNode;
  /** Optional secondary line under the source name (university, code, ...). */
  sourceMeta?: ReactNode;
  stats?: EntityMergeStat[];
  description: string;
  targetPicker: (value: string, onChange: (value: string) => void) => ReactNode;
  isPending?: boolean;
  className?: string;
}

/**
 * Standard entity merge (deduplication) dialog.
 *
 * Used by professors and courses; the per-entity differences are limited to the
 * source summary, the relation counters and the target picker.
 */
export const EntityMergeModal = ({
  isOpen,
  onClose,
  onSubmit,
  sourceLabel,
  sourceValue,
  sourceMeta,
  stats = [],
  description,
  targetPicker,
  isPending = false,
  className,
}: EntityMergeModalProps) => {
  const tCommon = useTranslations('common');
  const [targetId, setTargetId] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!targetId) {
      return;
    }
    await onSubmit(targetId);
    setTargetId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog className={className}>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2 text-primary-600">
                <GitMerge className={ICON_SIZE_CLASS.md} />
                <Modal.Heading>{sourceLabel}</Modal.Heading>
              </div>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
              <Modal.Body className="flex flex-col gap-4">
                <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-4 text-body-sm text-primary-900 leading-relaxed">
                  {description}
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
                  <span className="text-caption font-semibold text-neutral-500">
                    {sourceLabel}
                  </span>
                  <p className="mt-1 text-body-sm font-bold text-neutral-900">
                    {sourceValue}
                    {sourceMeta ? (
                      <span className="font-medium text-neutral-600">
                        {' '}
                        {sourceMeta}
                      </span>
                    ) : null}
                  </p>
{stats.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-neutral-500">
                      {stats.map((stat) => (
                        <li key={stat.label} className="flex items-center gap-3">
                          <span className="size-1 rounded-full bg-neutral-300" />
                          <span>{stat.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5">
                  {targetPicker(targetId, setTargetId)}
                </div>
              </Modal.Body>

              <Modal.Footer className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onPress={onClose}
                  isDisabled={isPending}
                  className={cn(isPending && 'opacity-70')}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isPending={isPending}
                  isDisabled={!targetId}
                >
                  {tCommon('actions.confirm')}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EntityMergeModal;
