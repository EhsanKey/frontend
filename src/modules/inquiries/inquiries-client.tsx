'use client';

import React, { useState, useMemo } from 'react';
import {
  Button,
  Card,
  Chip,
  Modal,
  Tabs,
  toast,
} from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Clock,
  GraduationCap,
  Info,
  Layers,
  RefreshCw,
  Send,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { useAuth, useQueryState } from '@/hooks';
import { clientInquiriesServices } from '@/apis/services/inquiries/client';
import { SearchInput } from '@/components/shared';
import { hasPermission } from '@/utils';
import {
  TopicAliasesModal,
  TopicEditModal,
  TopicMergeModal,
  TriggerNotificationModal,
} from './inquiries-modal';
import { InquiriesTable, TopicsTable } from './inquiries-table';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type {
  IInquiryFollowUpItem,
  IInquiryTopic,
  InquiryTopicStatus,
  InquiryTopicType,
} from '@/models';

interface InquiriesClientProps {
  initialTopicsData?: PaginatedResult<IInquiryTopic>;
  initialEligibleData?: PaginatedResult<IInquiryFollowUpItem>;
}

export const InquiriesClient: React.FC<InquiriesClientProps> = ({
  initialTopicsData,
  initialEligibleData,
}) => {
  const t = useTranslations('inquiries');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { getQuery, updateQueries } = useQueryState();

  const canTrigger = hasPermission(user, 'inquiries:trigger');
  const canManage = hasPermission(user, 'inquiries:manage');

  // URL / Query State
  const currentTab = getQuery('tab') || 'professors';
  const page = Number(getQuery('page')) || 1;
  const search = getQuery('search') || '';
  const statusParam = getQuery('status') as InquiryTopicStatus | undefined;

  // Selected topics for bulk campaign
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);

  // Modals state
  const [selectedTopicForAliases, setSelectedTopicForAliases] = useState<IInquiryTopic | null>(null);
  const [isAliasesOpen, setIsAliasesOpen] = useState(false);

  const [selectedTopicForEdit, setSelectedTopicForEdit] = useState<IInquiryTopic | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedTopicForMerge, setSelectedTopicForMerge] = useState<IInquiryTopic | null>(null);
  const [isMergeOpen, setIsMergeOpen] = useState(false);

  // Topic Deletion states
  const [deleteTopicTarget, setDeleteTopicTarget] = useState<IInquiryTopic | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Classic inquiries modal state
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // Active topic type based on selected tab
  const activeTopicType: InquiryTopicType = currentTab === 'resources' ? 'course' : 'professor';

  // 1. Fetch Topics Data (for professors / resources tabs)
  const isTopicsTab = currentTab === 'professors' || currentTab === 'resources';
  const {
    data: topicsData,
    isLoading: isLoadingTopics,
    refetch: refetchTopics,
  } = useQuery({
    queryKey: QUERY_KEYS.inquiries.topics({
      page,
      type: activeTopicType,
      status: statusParam,
      search: search || undefined,
    }),
    queryFn: () =>
      clientInquiriesServices.getTopics({
        page,
        type: activeTopicType,
        status: statusParam,
        search: search || undefined,
      }),
    initialData:
      currentTab === 'professors' && page === 1 && !search && !statusParam
        ? initialTopicsData
        : undefined,
    enabled: isTopicsTab,
  });

  // 2. Fetch Eligible Inquiries (for classic tab)
  const isClassicTab = currentTab === 'eligibleOld';
  const {
    data: eligibleData,
    isLoading: isLoadingEligible,
  } = useQuery({
    queryKey: QUERY_KEYS.inquiries.list({
      page,
      onlyEligible: true,
      search: search || undefined,
    }),
    queryFn: () =>
      clientInquiriesServices.getEligibleInquiries({
        page,
        onlyEligible: true,
        search: search || undefined,
      }),
    initialData: isClassicTab && page === 1 && !search ? initialEligibleData : undefined,
    enabled: isClassicTab,
  });

  const pendingEligibleItems = (eligibleData?.items ?? []).filter(
    (i) =>
      i.inquiry.notificationStatus === 'pending' ||
      (i.inquiry.notificationStatus === 'sent' && (i.inquiry.followUpCount ?? 0) < 2),
  );

  // Classic Trigger Notification Mutation
  const { mutateAsync: triggerMutate, isPending: isTriggering } = useMutation({
    mutationFn: ({
      inquiryIds,
      customMessage,
    }: {
      inquiryIds?: string[];
      customMessage?: string;
    }) =>
      clientInquiriesServices.triggerNotifications({
        inquiryIds,
        customMessage,
      }),
    onSuccess: (res) => {
      toast.success(t('toast.sentSuccess', { count: res.triggeredCount }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.lists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.overview });
    },
    onError: (err: unknown) => {
      toast.danger(err instanceof Error ? err.message : t('toast.sentFail'));
    },
  });

  // Delete Single Topic Mutation
  const { mutateAsync: deleteTopicMutate, isPending: isDeletingTopic } = useMutation({
    mutationFn: (topicId: string) => clientInquiriesServices.deleteTopic(topicId),
    onSuccess: () => {
      toast.success(t('toast.deleteTopicSuccess'));
      setDeleteTopicTarget(null);
      refetchTopics();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: unknown) => {
      toast.danger(err instanceof Error ? err.message : t('toast.sentFail'));
    },
  });

  // Bulk Delete Topics Mutation
  const { mutateAsync: bulkDeleteTopicsMutate, isPending: isBulkDeleting } = useMutation({
    mutationFn: (topicIds: string[]) => clientInquiriesServices.bulkDeleteTopics({ topicIds }),
    onSuccess: (res) => {
      toast.success(t('toast.bulkDeleteSuccess', { count: res.deletedCount }));
      setSelectedTopicIds([]);
      setIsBulkDeleteOpen(false);
      refetchTopics();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: unknown) => {
      toast.danger(err instanceof Error ? err.message : t('toast.sentFail'));
    },
  });

  // Stats calculation across loaded topics
  const stats = useMemo(() => {
    const items = topicsData?.items ?? [];
    const totalClusters = topicsData?.meta?.total ?? items.length;
    const waitingStudents = items.reduce(
      (sum, i) =>
        sum +
        ((i.round1PendingCount ?? i.pendingInquiriesCount ?? 0) +
          (i.round2PendingCount ?? 0)),
      0,
    );
    const messagesSent = items.reduce((sum, i) => sum + (i.sentInquiriesCount || 0), 0);
    const convertedCount = items.reduce((sum, i) => sum + (i.convertedInquiriesCount || 0), 0);
    const notifiedTotal = messagesSent + convertedCount;
    const conversionRate = notifiedTotal > 0 ? Math.round((convertedCount / notifiedTotal) * 100) : 0;

    return {
      totalClusters,
      waitingStudents,
      messagesSent,
      convertedCount,
      conversionRate,
    };
  }, [topicsData]);

  // Topic selection helpers
  const handleToggleSelectTopic = (id: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllTopics = (selected: boolean) => {
    if (selected && topicsData?.items) {
      setSelectedTopicIds(topicsData.items.map((i) => i.id));
    } else {
      setSelectedTopicIds([]);
    }
  };

  // Actions
  const handleSendCampaignSingle = (topic: IInquiryTopic) => {
    router.push(`/dashboard/inquiries/campaign?topicId=${topic.id}`);
  };

  const handleOpenBulkCampaign = () => {
    if (selectedTopicIds.length === 0) return;
    router.push(`/dashboard/inquiries/campaign?topicIds=${selectedTopicIds.join(',')}`);
  };

  const handleViewAliases = (topic: IInquiryTopic) => {
    setSelectedTopicForAliases(topic);
    setIsAliasesOpen(true);
  };

  const handleEditTopic = (topic: IInquiryTopic) => {
    setSelectedTopicForEdit(topic);
    setIsEditOpen(true);
  };

  const handleMergeTopic = (topic: IInquiryTopic) => {
    setSelectedTopicForMerge(topic);
    setIsMergeOpen(true);
  };

  const handleTriggerAllEligible = () => {
    setSelectedInquiryId(null);
    setIsTriggerOpen(true);
  };

  const handleTriggerSingleInquiry = (item: IInquiryFollowUpItem) => {
    setSelectedInquiryId(item.id);
    setIsTriggerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header & Quick Actions */}
      <div className="bg-surface flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-2xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h2 font-bold text-neutral-900 dark:text-neutral-50">
              {t('title')}
            </h1>
            <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 font-medium">
              هوشمند v2
            </Chip>
          </div>
          <p className="mt-1.5 text-body-sm text-neutral-500 dark:text-neutral-400 max-w-3xl leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="md"
            variant="outline"
            onPress={() => refetchTopics()}
            className="gap-2"
          >
            <RefreshCw className={ICON_SIZE_CLASS.sm} />
            <span>{t('actions.refresh')}</span>
          </Button>

          {canTrigger && selectedTopicIds.length > 0 && (
            <Button
              size="md"
              variant="primary"
              onPress={handleOpenBulkCampaign}
              className="gap-2"
            >
              <Send className={ICON_SIZE_CLASS.sm} />
              <span>{t('bulkActions.sendCampaign')} ({selectedTopicIds.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Topics */}
        <Card className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-neutral-500 dark:text-neutral-400 font-medium">
                {t('stats.totalTopics')}
              </p>
              <p className="mt-1.5 text-h2 font-extrabold text-neutral-900 dark:text-neutral-50">
                {stats.totalClusters.toLocaleString('fa-IR')}
              </p>
              <p className="mt-1 text-caption text-primary-600 font-medium">
                خوشه‌های فعال پیگیری
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600">
              <Layers className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2: Waiting Students */}
        <Card className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-neutral-500 dark:text-neutral-400 font-medium">
                {t('stats.waitingStudents')}
              </p>
              <p className="mt-1.5 text-h2 font-extrabold text-amber-600 dark:text-amber-400">
                {stats.waitingStudents.toLocaleString('fa-IR')}
              </p>
              <p className="mt-1 text-caption text-neutral-400">
                دانشجویان در صف دریافت پیام
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 3: Messages Sent */}
        <Card className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-neutral-500 dark:text-neutral-400 font-medium">
                {t('stats.messagesSent')}
              </p>
              <p className="mt-1.5 text-h2 font-extrabold text-blue-600 dark:text-blue-400">
                {stats.messagesSent.toLocaleString('fa-IR')}
              </p>
              <p className="mt-1 text-caption text-neutral-400">
                پیام‌های ارسالی تلگرام
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Send className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 4: Conversion Rate */}
        <Card className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-neutral-500 dark:text-neutral-400 font-medium">
                {t('stats.conversionRate')}
              </p>
              <p className="mt-1.5 text-h2 font-extrabold text-success-600 dark:text-success-400">
                %{stats.conversionRate.toLocaleString('fa-IR')}
              </p>
              <p className="mt-1 text-caption text-neutral-400">
                {t('stats.convertedCount', { count: stats.convertedCount.toLocaleString('fa-IR') })}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-50 dark:bg-success-950 text-success-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-2">
        <Tabs
          selectedKey={currentTab}
          onSelectionChange={(key) => {
            updateQueries({
              tab: key === 'professors' ? null : String(key),
              page: null,
            });
            setSelectedTopicIds([]);
          }}
        >
          <Tabs.List className="gap-2">
            <Tabs.Tab id="professors">
              <div className="flex items-center gap-2">
                <GraduationCap className={ICON_SIZE_CLASS.sm} />
                <span>{t('tabs.professors')}</span>
              </div>
            </Tabs.Tab>
            <Tabs.Tab id="resources">
              <div className="flex items-center gap-2">
                <BookOpen className={ICON_SIZE_CLASS.sm} />
                <span>{t('tabs.resources')}</span>
              </div>
            </Tabs.Tab>
            <Tabs.Tab id="eligibleOld">
              <div className="flex items-center gap-2">
                <Clock className={ICON_SIZE_CLASS.sm} />
                <span>{t('tabs.eligibleOld')}</span>
              </div>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {isClassicTab && canTrigger && (
          <Button
            variant="primary"
            isDisabled={pendingEligibleItems.length === 0}
            onPress={handleTriggerAllEligible}
            className="gap-2 self-start sm:self-auto"
          >
            <Send className={ICON_SIZE_CLASS.sm} />
            <span>{t('actions.triggerAll')} ({pendingEligibleItems.length})</span>
          </Button>
        )}
      </div>

      {/* 4. Search & Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-96">
          <SearchInput
            queryValue={search}
            onValueChange={(val) => updateQueries({ search: val || null, page: null })}
            placeholder={t('searchPlaceholder')}
            ariaLabel={t('searchPlaceholder')}
          />
        </div>

        {/* Bulk Action Banner when topics are selected */}
        {selectedTopicIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 rounded-xl px-4 py-2">
            <span className="text-xs font-bold text-primary-900 dark:text-primary-100">
              {t('bulkActions.selectedCount', { count: selectedTopicIds.length })}
            </span>
            <Button
              size="sm"
              variant="outline"
              onPress={() => setSelectedTopicIds([])}
            >
              {t('bulkActions.clearSelection')}
            </Button>
            {canManage && (
              <Button
                size="sm"
                variant="danger"
                className="gap-1.5"
                onPress={() => setIsBulkDeleteOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('bulkActions.deleteTopics')}</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="primary"
              className="gap-1.5"
              onPress={handleOpenBulkCampaign}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('bulkActions.sendCampaign')}</span>
            </Button>
          </div>
        )}
      </div>

      {/* 5. Main Content Area */}
      {isTopicsTab ? (
        <TopicsTable
          data={topicsData}
          isLoading={isLoadingTopics}
          selectedTopicIds={selectedTopicIds}
          onToggleSelectTopic={handleToggleSelectTopic}
          onSelectAllTopics={handleSelectAllTopics}
          onPageChange={(newPage) => updateQueries({ page: newPage === 1 ? null : newPage })}
          onViewAliases={handleViewAliases}
          onEditTopic={canTrigger ? handleEditTopic : undefined}
          onMergeTopic={canManage ? handleMergeTopic : undefined}
          onDeleteTopic={canManage ? (topic) => setDeleteTopicTarget(topic) : undefined}
          onSendCampaign={canTrigger ? handleSendCampaignSingle : undefined}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-2xl border border-primary-200/80 bg-primary-50/70 p-4 text-primary-900">
            <Info className="size-5 shrink-0 text-primary-600 mt-0.5" />
            <div>
              <h3 className="text-body-sm font-bold">دانشجویان واجد شرایط پیگیری انفرادی</h3>
              <p className="mt-1 text-caption text-primary-800 leading-relaxed">
                در این بخش می‌توانید فهرست تک‌تک پرسش‌های دانشجویان را به تفکیک زمان واجد شرایط شدن مشاهده کرده و نوتیفیکیشن اختصاصی ارسال نمایید.
              </p>
            </div>
          </div>

          <InquiriesTable
            data={eligibleData}
            isLoading={isLoadingEligible || isTriggering}
            onPageChange={(newPage) => updateQueries({ page: newPage === 1 ? null : newPage })}
            onTriggerSingle={canTrigger ? handleTriggerSingleInquiry : undefined}
          />
        </div>
      )}

      {/* 6. Modals */}
      {/* Aliases & Disambiguation Management Modal */}
      <TopicAliasesModal
        topic={selectedTopicForAliases}
        isOpen={isAliasesOpen}
        onClose={() => {
          setIsAliasesOpen(false);
          setSelectedTopicForAliases(null);
        }}
        canManage={canManage}
      />

      {/* Edit Topic & Link to Official DB Entity Modal */}
      <TopicEditModal
        topic={selectedTopicForEdit}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTopicForEdit(null);
        }}
      />

      {/* Merge Topic Modal */}
      <TopicMergeModal
        topic={selectedTopicForMerge}
        isOpen={isMergeOpen}
        onClose={() => {
          setIsMergeOpen(false);
          setSelectedTopicForMerge(null);
        }}
        onSuccess={() => {
          refetchTopics();
        }}
      />

      {/* Delete Single Topic Modal */}
      <Modal
        isOpen={Boolean(deleteTopicTarget)}
        onOpenChange={(open) => !open && setDeleteTopicTarget(null)}
      >
        <Modal.Backdrop>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-danger-600">
                  {t('modals.confirmDeleteTopicTitle', {
                    name: deleteTopicTarget?.canonicalName ?? '',
                  })}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t('modals.confirmDeleteTopicDesc', {
                    count: deleteTopicTarget?.aliases?.length ?? 0,
                  })}
                </p>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onPress={() => setDeleteTopicTarget(null)}
                  isDisabled={isDeletingTopic}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  variant="danger"
                  isPending={isDeletingTopic}
                  onPress={async () => {
                    if (!deleteTopicTarget) return;
                    await deleteTopicMutate(deleteTopicTarget.id);
                  }}
                >
                  {tCommon('actions.delete')}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Bulk Delete Topics Modal */}
      <Modal
        isOpen={isBulkDeleteOpen}
        onOpenChange={(open) => !open && setIsBulkDeleteOpen(false)}
      >
        <Modal.Backdrop>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading className="text-danger-600">
                  {t('modals.confirmBulkDeleteTitle', {
                    count: selectedTopicIds.length,
                  })}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-body-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t('modals.confirmBulkDeleteDesc')}
                </p>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onPress={() => setIsBulkDeleteOpen(false)}
                  isDisabled={isBulkDeleting}
                >
                  {tCommon('actions.cancel')}
                </Button>
                <Button
                  variant="danger"
                  isPending={isBulkDeleting}
                  onPress={async () => {
                    await bulkDeleteTopicsMutate(selectedTopicIds);
                  }}
                >
                  {tCommon('actions.delete')}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Classic Trigger Notification Modal */}
      <TriggerNotificationModal
        isOpen={isTriggerOpen}
        onClose={() => setIsTriggerOpen(false)}
        recipientCount={selectedInquiryId ? 1 : pendingEligibleItems.length}
        isPending={isTriggering}
        onSubmit={async (customMessage) => {
          await triggerMutate({
            inquiryIds: selectedInquiryId ? [selectedInquiryId] : undefined,
            customMessage,
          });
        }}
      />
    </div>
  );
};

export default InquiriesClient;
