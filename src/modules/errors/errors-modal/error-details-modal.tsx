'use client';

import { Button, Chip, Modal } from '@heroui/react';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { formatPersianDateTime } from '@/utils';
import type { IErrorLog } from '@/models';

interface ErrorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: IErrorLog | null;
  onResolve?: (id: string) => Promise<void>;
  isResolving?: boolean;
}

export const ErrorDetailsModal = ({
  isOpen,
  onClose,
  error,
  onResolve,
  isResolving = false,
}: ErrorDetailsModalProps) => {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');

  if (!error) return null;

  const handleResolve = async () => {
    if (onResolve) {
      await onResolve(error.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-3">
                <Modal.Heading>{t('modals.detailsTitle')}</Modal.Heading>
                <Chip
                  size="sm"
                  variant="secondary"
                  className={
                    error.level === 'fatal'
                      ? 'bg-danger-100 text-danger-800 font-bold'
                      : error.level === 'error'
                        ? 'bg-danger-50 text-danger-700 font-medium'
                        : 'bg-warning-50 text-warning-700 font-medium'
                  }
                >
                  {t(`levels.${error.level}`)}
                </Chip>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              {/* Summary */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="font-bold text-neutral-900 leading-relaxed">{error.message}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-caption text-neutral-500">
                  <span>
                    <strong>{t('modals.sourceLabel')}</strong> {t(`sources.${error.source}`)}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>{t('modals.timeLabel')}</strong>{' '}
                    <span dir="ltr" className="font-mono">
                      {formatPersianDateTime(error.createdAt)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Resolved state banner */}
              {error.isResolved ? (
                <div className="flex items-center gap-2 rounded-xl bg-success-50 p-3.5 text-body-sm font-medium text-success-800">
                  <CheckCircle2 className="size-4 shrink-0 text-success-600" />
                  <span>
                    {t('modals.resolvedInfo', {
                      date: error.resolvedAt ? formatPersianDateTime(error.resolvedAt) : '-',
                      user: error.resolvedBy || t('modals.defaultAdmin'),
                    })}
                  </span>
                </div>
              ) : null}

              {/* Execution Context */}
              {error.context ? (
                <div>
                  <h4 className="text-body-sm font-bold text-neutral-800">
                    {t('modals.contextTitle')}
                  </h4>
                  <pre
                    dir="ltr"
                    className="mt-1.5 max-h-40 overflow-auto rounded-xl bg-neutral-900 p-3.5 font-mono text-caption text-neutral-100"
                  >
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </div>
              ) : null}

              {/* Stack trace */}
              {error.stack ? (
                <div>
                  <h4 className="text-body-sm font-bold text-neutral-800">
                    {t('modals.stackTitle')}
                  </h4>
                  <pre
                    dir="ltr"
                    className="mt-1.5 max-h-56 overflow-auto rounded-xl bg-neutral-900 p-3.5 font-mono text-caption text-danger-300"
                  >
                    {error.stack}
                  </pre>
                </div>
              ) : null}
            </Modal.Body>

            <Modal.Footer className="flex justify-between items-center gap-2">
              {!error.isResolved && onResolve ? (
                <Button
                  variant="outline"
                  isPending={isResolving}
                  onPress={handleResolve}
                  className="border-success-600 text-success-700 hover:bg-success-50"
                >
                  <CheckCircle2 className={ICON_SIZE_CLASS.sm} />
                  {t('actions.resolve')}
                </Button>
              ) : (
                <div />
              )}

              <Button variant="outline" onPress={onClose}>
                {tCommon('actions.close')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
