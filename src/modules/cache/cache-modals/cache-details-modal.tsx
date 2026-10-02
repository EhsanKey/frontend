'use client';

import { Button, Chip, Modal } from '@heroui/react';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { formatPersianDate } from '@/utils';
import type { IAiCacheEntry } from '@/models';

interface CacheDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: IAiCacheEntry | null;
}

export const CacheDetailsModal = ({
  isOpen,
  onClose,
  entry,
}: CacheDetailsModalProps) => {
  const t = useTranslations('cache');

  if (!entry) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-3">
                <Modal.Heading>{t('detailsModal.title')}</Modal.Heading>
                <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
                  {entry.intent}
                </Chip>
              </div>
            </Modal.Header>

            <Modal.Body className="space-y-5">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 p-4 sm:grid-cols-2 text-body-sm">
                <div>
                  <span className="text-neutral-500">{t('detailsModal.professor')}: </span>
                  <span className="font-semibold text-neutral-900">
                    {entry.professor ? entry.professor.name : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">{t('detailsModal.course')}: </span>
                  <span className="font-semibold text-neutral-900">
                    {entry.course ? entry.course.name : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">{t('detailsModal.hits')}: </span>
                  <span className="font-semibold text-neutral-900">
                    {entry.hitCount.toLocaleString('fa-IR')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">{t('detailsModal.lastHitAt')}: </span>
                  <span className="font-semibold text-neutral-900" dir="ltr">
                    {entry.lastHitAt ? formatPersianDate(entry.lastHitAt) : '-'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-neutral-500">{t('detailsModal.cacheKey')}: </span>
                  <span className="block mt-1 font-mono text-caption text-neutral-700 bg-neutral-200/50 rounded p-1.5 break-all" dir="ltr">
                    {entry.cacheKey}
                  </span>
                </div>
              </div>

              {/* Full Answer Text */}
              <div>
                <label className="mb-2 block text-label font-semibold text-neutral-900">
                  {t('detailsModal.answerText')}
                </label>
                <div className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl border border-neutral-200 bg-white p-4 font-sans text-body-sm leading-relaxed text-neutral-800 shadow-2xs">
                  {entry.answerText || entry.answerPreview}
                </div>
              </div>

              {/* Attached Resources */}
              {entry.resources && entry.resources.length > 0 && (
                <div>
                  <label className="mb-2 block text-label font-semibold text-neutral-900">
                    {t('detailsModal.attachedResources')}
                  </label>
                  <div className="flex flex-col gap-2">
                    {entry.resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 text-body-sm text-neutral-800 transition-colors hover:border-primary-300 hover:bg-primary-50/30"
                      >
                        <span className="font-medium">{res.label}</span>
                        <ExternalLink className={`text-neutral-400 ${ICON_SIZE_CLASS.sm}`} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline" onPress={onClose}>
                {t('detailsModal.close')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
