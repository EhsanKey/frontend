'use client';

import { Button, Chip } from '@heroui/react';
import { Eye, History, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TableContainer, type TableHeaderOptions } from '@/containers';
import { QUERY_KEYS } from '@/constants';
import { useGetRequest, useQueryState } from '@/hooks';
import { clientAuditLogServices } from '@/apis/services/audit-logs/client';
import { formatPersianDate } from '@/utils';
import type { IAuditLog } from '@/models';
import type { AuditLogColumnKey, AuditLogsClientProps } from './types';
import { AuditLogsFilters } from './audit-logs-filters';
import { AuditLogDetailModal } from './audit-log-detail-modal';

export const AuditLogsClient = ({ initialData }: AuditLogsClientProps) => {
  const t = useTranslations('auditLogs');
  const { getQuery, updateQueries } = useQueryState();

  const search = getQuery('search') ?? '';
  const domain = getQuery('domain') ?? '';
  const action = getQuery('action') ?? '';
  const page = Number(getQuery('page')) || 1;

  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);

  const { data, isLoading } = useGetRequest({
    queryKey: QUERY_KEYS.auditLogs.list({
      page,
      search: search || undefined,
      domain: domain && domain !== 'all' ? domain : undefined,
      action: action && action !== 'all' ? action : undefined,
    }),
    requestFn: (signal) =>
      clientAuditLogServices.getAuditLogs(
        {
          page,
          pageSize: 20,
          search: search || undefined,
          entityType: domain && domain !== 'all' ? domain : undefined,
          action: action && action !== 'all' ? action : undefined,
        },
        signal,
      ),
    initialData,
    keepPreviousData: true,
  });

  const headerCells: TableHeaderOptions<AuditLogColumnKey>[] = [
    { id: 'id', label: t('columns.id'), className: 'w-16 text-center' },
    { id: 'timestamp', label: t('columns.timestamp'), className: 'w-36 text-center' },
    { id: 'actor', label: t('columns.actor'), className: 'min-w-40', isRowHeader: true },
    { id: 'domain', label: t('columns.domain'), className: 'w-32 text-center' },
    { id: 'action', label: t('columns.action'), className: 'w-28 text-center' },
    { id: 'entity', label: t('columns.entity'), className: 'w-36 text-center' },
    { id: 'ip', label: t('columns.ip'), className: 'w-32 text-center font-mono text-2xs' },
    { id: 'actions', label: t('columns.actions'), className: 'w-24 text-center' },
  ];

  const getActionColor = (act: string) => {
    switch (act.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'DELETE':
        return 'bg-danger-50 text-danger-700 border-danger-200/60';
      case 'MERGE':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'LOGIN':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200/60';
      case 'INVALIDATE':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200/60';
    }
  };

  const renderCell = (item: IAuditLog, columnKey: AuditLogColumnKey) => {
    switch (columnKey) {
      case 'id':
        return (
          <span className="font-mono text-caption text-neutral-400">
            #{item.id}
          </span>
        );
      case 'timestamp':
        return (
          <span className="text-caption text-neutral-600 font-mono">
            {formatPersianDate(item.createdAt)}
          </span>
        );
      case 'actor':
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-neutral-900 leading-tight">
                {item.adminUsername || t('modal.systemUser')}
              </span>
              {item.adminUserId && (
                <span className="text-2xs text-neutral-400 font-mono">
                  #{item.adminUserId}
                </span>
              )}
            </div>
          </div>
        );
      case 'domain':
        return (
          <Chip
            size="sm"
            variant="soft"
            className="bg-neutral-100 text-neutral-700 font-medium text-2xs"
          >
            {item.entityType}
          </Chip>
        );
      case 'action':
        return (
          <Chip
            size="sm"
            variant="soft"
            className={`font-semibold border text-2xs ${getActionColor(item.action)}`}
          >
            {item.action}
          </Chip>
        );
      case 'entity':
        return (
          <div className="flex items-center justify-center gap-1 font-mono text-xs text-neutral-700">
            <span>{item.entityType}</span>
            {item.entityId && (
              <span className="text-neutral-400">#{item.entityId}</span>
            )}
          </div>
        );
      case 'ip':
        return (
          <span className="text-neutral-500 font-mono text-2xs" dir="ltr">
            {item.ipAddress || '-'}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-center">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs h-7 px-2"
              onPress={() => setSelectedLog(item)}
            >
              <Eye className="w-3.5 h-3.5" />
              {t('columns.actions')}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100/60 text-primary-700">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{t('title')}</h1>
            <p className="text-xs text-neutral-500">{t('description')}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AuditLogsFilters />

      {/* Table */}
      <TableContainer
        ariaLabel={t('title')}
        headerCells={headerCells}
        items={data?.items ?? []}
        pagination={
          data?.meta
            ? {
                ...data.meta,
                onPageChange: (newPage) => {
                  updateQueries({ page: newPage > 1 ? String(newPage) : null });
                },
              }
            : undefined
        }
        isLoading={isLoading}
        renderCell={renderCell}
      />

      {/* Detail Modal */}
      <AuditLogDetailModal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
};

export default AuditLogsClient;
