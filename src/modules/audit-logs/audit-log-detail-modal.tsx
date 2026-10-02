'use client';

import { Button, Chip, Modal } from '@heroui/react';
import {
  Eye,
  Globe,
  HardDrive,
  Info,
  Laptop,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { IAuditLog } from '@/models';
import { formatPersianDate } from '@/utils';

interface AuditLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: IAuditLog | null;
}

export const AuditLogDetailModal = ({
  isOpen,
  onClose,
  log,
}: AuditLogDetailModalProps) => {
  const t = useTranslations('auditLogs');

  if (!log) return null;

  const renderValue = (val: unknown) => {
    if (val === null || val === undefined) {
      return <span className="text-neutral-400 italic">{t('modal.nullValue')}</span>;
    }
    if (typeof val === 'boolean') {
      return <span>{val ? t('modal.trueValue') : t('modal.falseValue')}</span>;
    }
    if (typeof val === 'object') {
      return (
        <pre className="font-mono text-2xs p-1.5 bg-neutral-100 rounded overflow-x-auto dir-ltr text-left">
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <span className="font-mono text-xs">{String(val)}</span>;
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DELETE':
        return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'MERGE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'LOGIN':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      case 'INVALIDATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const detailEntries = log.details ? Object.entries(log.details) : [];

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container size="lg" className="max-w-3xl">
          <Modal.Dialog className="max-h-[90vh] flex flex-col overflow-hidden">
            <Modal.CloseTrigger />
            <Modal.Header className="pb-3 border-b border-neutral-200/80">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/60 text-primary-700">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <Modal.Heading className="text-base font-bold text-neutral-900">
                    {t('modal.title')} #{log.id}
                  </Modal.Heading>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip
                      size="sm"
                      variant="soft"
                      className={`text-2xs font-bold border px-2 ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </Chip>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {t('modal.entityLabel', { type: log.entityType })}
                    </span>
                  </div>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Event & Actor Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Actor Info */}
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary-600" />
                    {t('modal.actorInfo')}
                  </h4>
                  <div className="text-xs space-y-1 text-neutral-600">
                    <p className="flex justify-between">
                      <span className="text-neutral-400">{t('modal.adminUser')}</span>
                      <span className="font-semibold text-neutral-900">
                        {log.adminUsername || t('modal.systemUser')}
                      </span>
                    </p>
                    {log.adminUserId && (
                      <p className="flex justify-between font-mono">
                        <span className="text-neutral-400">{t('modal.adminId')}</span>
                        <span>#{log.adminUserId}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Target Entity & Time */}
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-emerald-600" />
                    {t('modal.targetEntity')}
                  </h4>
                  <div className="text-xs space-y-1 text-neutral-600">
                    <p className="flex justify-between">
                      <span className="text-neutral-400">{t('modal.entityTypeLabel')}</span>
                      <span className="font-mono font-semibold text-neutral-900">
                        {log.entityType}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-neutral-400">{t('modal.recordId')}</span>
                      <span className="font-mono font-semibold text-neutral-900">
                        #{log.entityId || '-'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-neutral-400">{t('modal.eventTime')}</span>
                      <span className="font-mono text-neutral-700">
                        {formatPersianDate(log.createdAt)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Key-Value Table */}
              <div className="rounded-xl border border-neutral-200/80 overflow-hidden">
                <div className="bg-neutral-100/70 px-4 py-2.5 border-b border-neutral-200/80 flex items-center gap-2">
                  <Info className="w-4 h-4 text-neutral-500" />
                  <h4 className="text-xs font-bold text-neutral-800">
                    {t('modal.changesTitle')}
                  </h4>
                </div>

                {detailEntries.length > 0 ? (
                  <div className="divide-y divide-neutral-200/60">
                    <div className="grid grid-cols-12 bg-neutral-50 p-2.5 text-2xs font-semibold text-neutral-500">
                      <div className="col-span-5">{t('modal.field')}</div>
                      <div className="col-span-7">{t('modal.recordedValue')}</div>
                    </div>
                    {detailEntries.map(([key, val], idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 p-3 text-xs items-center gap-2 hover:bg-neutral-50/50 transition-colors"
                      >
                        <div className="col-span-5 font-mono font-semibold text-neutral-800 text-xs">
                          {key}
                        </div>
                        <div className="col-span-7 text-neutral-800 bg-neutral-100/60 p-2 rounded-lg border border-neutral-200/60">
                          {renderValue(val)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    {t('modal.noChanges')}
                  </div>
                )}
              </div>

              {/* Network / Client Info */}
              {(log.ipAddress || log.userAgent) && (
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    {t('modal.networkInfo')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs text-neutral-600">
                    {log.ipAddress && (
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-neutral-400">IP:</span>
                        <span>{log.ipAddress}</span>
                      </div>
                    )}
                    {log.userAgent && (
                      <div className="flex items-center gap-1.5 font-mono truncate" title={log.userAgent}>
                        <Laptop className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{log.userAgent}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Raw Details JSON */}
              {log.details && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-neutral-700">
                    {t('modal.metadata')}
                  </h4>
                  <pre className="font-mono text-2xs p-3 bg-neutral-900 text-emerald-400 rounded-xl overflow-x-auto dir-ltr text-left">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className="border-t border-neutral-200/80 p-4 flex justify-end">
              <Button variant="outline" onPress={onClose}>
                {t('modal.close')}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AuditLogDetailModal;
