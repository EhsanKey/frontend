'use client';

import React, { useState } from 'react';
import {
  Button,
  Tabs,
  Modal,
  toast,
} from '@heroui/react';
import {
  Megaphone,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientBroadcastsServices } from '@/apis/services/broadcasts';
import { SearchInput } from '@/components/shared';
import { QUERY_KEYS } from '@/constants';
import { useAuth, useQueryState } from '@/hooks';
import { hasPermission } from '@/utils';
import { BroadcastsTable } from './components/broadcasts-table';
import { BroadcastDetailModal } from './components/broadcast-detail-modal';
import type { IBroadcastCampaign } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface BroadcastsClientProps {
  initialData?: PaginatedResult<IBroadcastCampaign>;
}

export const BroadcastsClient: React.FC<BroadcastsClientProps> = ({ initialData }) => {
  const router = useRouter();
  const t = useTranslations('broadcasts');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { getQuery, updateQueries } = useQueryState();

  const canCreate = hasPermission(user, 'broadcasts:create');

  const page = Number(getQuery('page')) || 1;
  const statusFilter = getQuery('status') || '';
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [detailCampaign, setDetailCampaign] = useState<IBroadcastCampaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<IBroadcastCampaign | null>(null);

  // Query campaigns
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.broadcasts.list({ page, search: searchTerm, status: statusFilter }),
    queryFn: () =>
      clientBroadcastsServices.getBroadcasts({
        page,
        pageSize: 15,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      }),
    initialData,
    refetchInterval: 5000, // Periodically refresh sending status
  });

  // Retry mutation
  const retryMutation = useMutation({
    mutationFn: (id: string) => clientBroadcastsServices.retryFailedBroadcast(id),
    onSuccess: (res) => {
      toast.success(t('toast.retryStarted', { count: res.retryingCount }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.broadcasts.lists() });
      if (detailCampaign) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.broadcasts.detail(detailCampaign.id) });
      }
    },
    onError: (err: unknown) => {
      toast.danger((err as Error)?.message || t('toast.retryError'));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientBroadcastsServices.deleteBroadcast(id),
    onSuccess: () => {
      toast.success(t('toast.deleted'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.broadcasts.lists() });
      setCampaignToDelete(null);
    },
    onError: (err: unknown) => {
      toast.danger((err as Error)?.message || t('toast.deleteError'));
    },
  });

  const handlePageChange = (newPage: number) => {
    updateQueries({ page: String(newPage) });
  };

  const handleStatusTabChange = (key: string) => {
    updateQueries({
      status: key === 'all' ? null : key,
      page: null,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-xs text-default-500">
              {t('description')}
            </p>
          </div>
        </div>

        {canCreate && (
          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onPress={() => router.push('/dashboard/broadcasts/create')}
          >
            <Plus className="w-4 h-4" />
            <span>{t('actions.newBroadcast')}</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          selectedKey={statusFilter || 'all'}
          onSelectionChange={(k) => handleStatusTabChange(k as string)}
          variant="secondary"
        >
          <Tabs.List className="border-b border-divider gap-2">
            <Tabs.Tab id="all">
              <span>{t('tabs.all')}</span>
            </Tabs.Tab>
            <Tabs.Tab id="completed">
              <span>{t('tabs.completed')}</span>
            </Tabs.Tab>
            <Tabs.Tab id="sending">
              <span>{t('tabs.sending')}</span>
            </Tabs.Tab>
            <Tabs.Tab id="partially_failed">
              <span>{t('tabs.failed')}</span>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <div className="w-full sm:w-72">
          <SearchInput
            placeholder={tCommon('search.placeholder')}
            queryValue={searchTerm}
            onValueChange={(val: string) => setSearchTerm(val)}
          />
        </div>
      </div>

      {/* Broadcasts History Table */}
      <BroadcastsTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onViewDetails={(c) => setDetailCampaign(c)}
        onRetry={(c) => retryMutation.mutate(c.id)}
        onDelete={(c) => setCampaignToDelete(c)}
      />

      {/* Broadcast Detail & Retry Modal */}
      <BroadcastDetailModal
        campaign={detailCampaign}
        isOpen={Boolean(detailCampaign)}
        onClose={() => setDetailCampaign(null)}
      />

      {/* Delete Confirmation Modal */}
      {campaignToDelete && (
        <Modal
          isOpen={Boolean(campaignToDelete)}
          onOpenChange={(open) => !open && setCampaignToDelete(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="sm">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex items-center gap-2 text-danger">
                    <AlertTriangle className="w-5 h-5" />
                    <Modal.Heading>{t('deleteModal.title')}</Modal.Heading>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <p className="text-sm text-foreground">
                    {t('deleteModal.prompt', { title: campaignToDelete.title })}
                  </p>
                  <p className="text-xs text-default-400 mt-2">
                    {t('deleteModal.warning')}
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => setCampaignToDelete(null)}
                  >
                    {tCommon('actions.cancel')}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="gap-2"
                    isPending={deleteMutation.isPending}
                    isDisabled={deleteMutation.isPending}
                    onPress={() => deleteMutation.mutate(campaignToDelete.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('deleteModal.confirm')}</span>
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </div>
  );
};
