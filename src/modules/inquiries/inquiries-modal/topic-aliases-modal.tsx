'use client';

import React, { useState } from 'react';
import {
  Button,
  Chip,
  ListBox,
  Modal,
  Select,
  Spinner,
  Tabs,
  toast,
} from '@heroui/react';
import {
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Edit3,
  GitBranch,
  GitMerge,
  Layers,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientInquiriesServices } from '@/apis/services/inquiries';
import { InputField } from '@/components/shared';
import { ICON_SIZE_CLASS, QUERY_KEYS } from '@/constants';
import { formatPersianDate } from '@/utils';
import type { IInquiryAlias, IInquiryTopic } from '@/models';

interface TopicAliasesModalProps {
  topic: IInquiryTopic | null;
  isOpen: boolean;
  onClose: () => void;
  canManage?: boolean;
}

export const TopicAliasesModal: React.FC<TopicAliasesModalProps> = ({
  topic,
  isOpen,
  onClose,
  canManage = true,
}) => {
  const t = useTranslations('inquiries.modals');
  const tInquiries = useTranslations('inquiries');
  const tStatus = useTranslations('inquiries.status');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<string>('aliases');

  // Sub-modal states for the 5 variant actions
  // 1. Edit Name
  const [editAliasTarget, setEditAliasTarget] = useState<IInquiryAlias | null>(null);
  const [editNameInput, setEditNameInput] = useState('');

  // 2. Delete
  const [deleteAliasTarget, setDeleteAliasTarget] = useState<IInquiryAlias | null>(null);

  // 3. Merge Sibling
  const [mergeAliasTarget, setMergeAliasTarget] = useState<IInquiryAlias | null>(null);
  const [targetSiblingId, setTargetSiblingId] = useState<string>('');

  // 4. Move to another topic
  const [moveAliasTarget, setMoveAliasTarget] = useState<IInquiryAlias | null>(null);
  const [targetTopicId, setTargetTopicId] = useState<string>('');

  // 5. Split / Independent Topic
  const [splitAliasTarget, setSplitAliasTarget] = useState<IInquiryAlias | null>(null);
  const [splitNameInput, setSplitNameInput] = useState('');

  // Fetch complete topic details
  const { data, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.inquiries.topicDetails(topic?.id || ''),
    queryFn: () => clientInquiriesServices.getTopicDetails(topic!.id),
    enabled: isOpen && Boolean(topic?.id),
  });

  // Query other topics of the same type for moving variants
  const { data: otherTopicsData, isLoading: isLoadingOtherTopics } = useQuery({
    queryKey: ['inquiries', 'other-topics', topic?.topicType],
    queryFn: () => clientInquiriesServices.getTopics({ type: topic?.topicType, pageSize: 100 }),
    enabled: Boolean(moveAliasTarget) && Boolean(topic?.topicType),
  });

  // 1. Update Alias Name Mutation
  const { mutateAsync: updateAliasMutate, isPending: isUpdatingAlias } = useMutation({
    mutationFn: ({ aliasId, rawAlias }: { aliasId: string; rawAlias: string }) =>
      clientInquiriesServices.updateAlias(topic!.id, aliasId, { rawAlias }),
    onSuccess: () => {
      toast.success(tInquiries('toast.updateAliasSuccess'));
      setEditAliasTarget(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  // 2. Delete Alias Mutation
  const { mutateAsync: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (aliasId: string) =>
      clientInquiriesServices.deleteAlias(topic!.id, aliasId),
    onSuccess: () => {
      toast.success(tInquiries('toast.deleteAliasSuccess'));
      setDeleteAliasTarget(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  // 3. Merge Sibling Aliases Mutation
  const { mutateAsync: mergeAliasesMutate, isPending: isMergingAliases } = useMutation({
    mutationFn: ({ sourceAliasId, targetAliasId }: { sourceAliasId: string; targetAliasId: string }) =>
      clientInquiriesServices.mergeAliases(topic!.id, { sourceAliasId, targetAliasId }),
    onSuccess: () => {
      toast.success(tInquiries('toast.mergeSiblingSuccess'));
      setMergeAliasTarget(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  // 4. Move Alias to Another Topic Mutation
  const { mutateAsync: moveAliasMutate, isPending: isMovingAlias } = useMutation({
    mutationFn: ({ aliasId, targetTopicId }: { aliasId: string; targetTopicId: string }) =>
      clientInquiriesServices.moveAlias(topic!.id, aliasId, { targetTopicId }),
    onSuccess: () => {
      toast.success(tInquiries('toast.moveAliasSuccess'));
      setMoveAliasTarget(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  // 5. Split / Promote Alias Mutation
  const { mutateAsync: splitMutate, isPending: isSplitting } = useMutation({
    mutationFn: ({ aliasId, newCanonicalName }: { aliasId: string; newCanonicalName?: string }) =>
      clientInquiriesServices.splitAlias(topic!.id, aliasId, { newCanonicalName }),
    onSuccess: () => {
      toast.success(tInquiries('toast.splitSuccess'));
      setSplitAliasTarget(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inquiries.topicsLists });
    },
    onError: (err: any) => {
      toast.danger(err?.message || tInquiries('toast.sentFail'));
    },
  });

  if (!topic) return null;

  const aliases = data?.aliases || topic.aliases || [];
  const inquiries = data?.inquiries || [];
  const candidateTopics = (otherTopicsData?.items || []).filter((t) => t.id !== topic.id);
  const isSubModalOpen = Boolean(
    splitAliasTarget || deleteAliasTarget || editAliasTarget || mergeAliasTarget || moveAliasTarget,
  );

  const handleOpenSplit = (alias: IInquiryAlias) => {
    setSplitAliasTarget(alias);
    setSplitNameInput(alias.rawAlias);
  };

  const handleConfirmSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!splitAliasTarget) return;
    await splitMutate({
      aliasId: splitAliasTarget.id,
      newCanonicalName: splitNameInput.trim() || undefined,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteAliasTarget) return;
    await deleteMutate(deleteAliasTarget.id);
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isSubModalOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <Modal.Backdrop>
          <Modal.Container size="cover" className="max-w-4xl w-full p-2 sm:p-4 my-auto">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <div className="flex items-center gap-2 text-primary-600">
                  <Layers className={ICON_SIZE_CLASS.md} />
                  <div>
                    <Modal.Heading>{t('aliasesTitle', { name: topic.canonicalName })}</Modal.Heading>
                    <p className="text-caption text-neutral-500 font-normal mt-0.5">
                      {t('aliasesSubtitle')}
                    </p>
                  </div>
                </div>
              </Modal.Header>

              <Modal.Body className="flex flex-col gap-4">
                <Tabs selectedKey={activeTab} onSelectionChange={(k) => setActiveTab(k as string)}>
                  <Tabs.List className="border-b border-divider gap-2">
                    <Tabs.Tab id="aliases">
                      <span>{t('aliasesTab', { count: aliases.length })}</span>
                    </Tabs.Tab>
                    <Tabs.Tab id="inquiries">
                      <span>{t('inquiriesTab', { count: inquiries.length })}</span>
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>

                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Spinner size="md" />
                  </div>
                ) : activeTab === 'aliases' ? (
                  <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {aliases.length === 0 ? (
                      <p className="text-caption text-neutral-400 text-center p-4">
                        هیچ واریانتی ثبت نشده است.
                      </p>
                    ) : (
                      aliases.map((alias) => {
                        const countNumber = alias.studentCount ?? alias.queryCount;
                        return (
                          <div
                            key={alias.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                          >
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-neutral-900 dark:text-neutral-50">
                                  {alias.rawAlias} - {countNumber.toLocaleString('fa-IR')} نفر
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  (نرمال: {alias.normalizedAlias})
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                                <span>تکرار پرسش: {alias.queryCount.toLocaleString('fa-IR')} بار</span>
                                <span>تاریخ اولین پرسش: {formatPersianDate(alias.createdAt)}</span>
                              </div>
                            </div>

                            {canManage && (
                              <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end sm:self-auto">
                                {/* 1. ویرایش نام */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-xs gap-1"
                                  onPress={() => {
                                    setEditAliasTarget(alias);
                                    setEditNameInput(alias.rawAlias);
                                  }}
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                                  <span>{t('editAlias')}</span>
                                </Button>

                                {/* 2. ادغام با هم‌گروه (در صورت وجود بیش از یک واریانت) */}
                                {aliases.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs gap-1"
                                    onPress={() => {
                                      const siblings = aliases.filter((a) => a.id !== alias.id);
                                      setMergeAliasTarget(alias);
                                      setTargetSiblingId(siblings[0]?.id || '');
                                    }}
                                  >
                                    <GitMerge className="w-3.5 h-3.5 text-amber-500" />
                                    <span>{t('mergeSibling')}</span>
                                  </Button>
                                )}

                                {/* 3. انتقال به سرگروه دیگر */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-xs gap-1"
                                  onPress={() => {
                                    setMoveAliasTarget(alias);
                                    setTargetTopicId('');
                                  }}
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
                                  <span>{t('moveTopic')}</span>
                                </Button>

                                {/* 4. تفکیک به سرگروه مستقل */}
                                {aliases.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-xs gap-1"
                                    onPress={() => handleOpenSplit(alias)}
                                  >
                                    <GitBranch className="w-3.5 h-3.5 text-primary-600" />
                                    <span>{t('splitAlias')}</span>
                                  </Button>
                                )}

                                {/* 5. حذف واریانت */}
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 text-danger-500 hover:text-danger-600"
                                  aria-label={t('deleteAlias')}
                                  onPress={() => setDeleteAliasTarget(alias)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                    {inquiries.length === 0 ? (
                      <p className="text-caption text-neutral-400 text-center p-4">
                        هیچ پرسش کاربری ثبت نشده است.
                      </p>
                    ) : (
                      inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-50">
                                {inq.user.firstName || inq.user.lastName
                                  ? `${inq.user.firstName || ''} ${inq.user.lastName || ''}`.trim()
                                  : 'دانشجوی تلگرام'}
                                {inq.user.username ? (
                                  <span className="text-[11px] font-normal text-neutral-400 font-mono mr-1.5">
                                    @{inq.user.username}
                                  </span>
                                ) : null}
                              </p>
                              <p className="text-[11px] text-neutral-500">
                                پرسش: «{inq.rawQuery || inq.aliasName}» • {formatPersianDate(inq.inquiredAt)}
                              </p>
                            </div>
                          </div>

                          <div>
                            {inq.notificationStatus === 'converted' ? (
                              <Chip size="sm" variant="secondary" className="bg-success-50 text-success-700 text-[11px]">
                                {tStatus('converted')}
                              </Chip>
                            ) : inq.notificationStatus === 'opted_out' ? (
                              <Chip size="sm" variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px]">
                                {tStatus('opted_out')}
                              </Chip>
                            ) : inq.notificationStatus === 'sent' ? (
                              inq.followUpCount === 1 ? (
                                <Chip size="sm" variant="secondary" className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px]">
                                  در انتظار یادآوری دوره ۲ (۱/۲)
                                </Chip>
                              ) : (
                                <Chip size="sm" variant="secondary" className="bg-primary-50 text-primary-700 text-[11px]">
                                  تکمیل شده (ارسال دوره ۲)
                                </Chip>
                              )
                            ) : (
                              <Chip size="sm" variant="secondary" className="bg-warning-50 text-warning-700 text-[11px]">
                                دوره ۱ (در انتظار ارسال)
                              </Chip>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="flex justify-end">
                <Button variant="outline" onPress={onClose}>
                  {tCommon('actions.close')}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Sub-Modal 1: Edit Alias Name */}
      {editAliasTarget && (
        <Modal
          isOpen={Boolean(editAliasTarget)}
          onOpenChange={(open) => !open && setEditAliasTarget(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="sm">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex items-center gap-2 text-primary-600">
                    <Edit3 className={ICON_SIZE_CLASS.md} />
                    <Modal.Heading>{t('editAliasTitle')}</Modal.Heading>
                  </div>
                </Modal.Header>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editAliasTarget || !editNameInput.trim()) return;
                    await updateAliasMutate({
                      aliasId: editAliasTarget.id,
                      rawAlias: editNameInput.trim(),
                    });
                  }}
                >
                  <Modal.Body className="flex flex-col gap-3">
                    <InputField
                      label={t('editAliasLabel')}
                      value={editNameInput}
                      onChange={(e) => setEditNameInput(e.target.value)}
                      required
                      isDisabled={isUpdatingAlias}
                    />
                  </Modal.Body>

                  <Modal.Footer className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onPress={() => setEditAliasTarget(null)}
                      isDisabled={isUpdatingAlias}
                    >
                      {tCommon('actions.cancel')}
                    </Button>
                    <Button type="submit" variant="primary" isPending={isUpdatingAlias}>
                      {tCommon('actions.save')}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* Sub-Modal 2: Merge Sibling Aliases */}
      {mergeAliasTarget && (
        <Modal
          isOpen={Boolean(mergeAliasTarget)}
          onOpenChange={(open) => !open && setMergeAliasTarget(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="md">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex items-center gap-2 text-amber-600">
                    <GitMerge className={ICON_SIZE_CLASS.md} />
                    <Modal.Heading>{t('mergeSiblingTitle')}</Modal.Heading>
                  </div>
                </Modal.Header>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!mergeAliasTarget || !targetSiblingId) return;
                    await mergeAliasesMutate({
                      sourceAliasId: mergeAliasTarget.id,
                      targetAliasId: targetSiblingId,
                    });
                  }}
                >
                  <Modal.Body className="flex flex-col gap-3">
                    <p className="text-caption text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {t('mergeSiblingDesc', { name: mergeAliasTarget.rawAlias })}
                    </p>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {t('selectTargetSibling')}
                      </label>
                      <Select
                        selectedKey={targetSiblingId}
                        onSelectionChange={(key) => setTargetSiblingId(String(key))}
                        className="w-full"
                        aria-label={t('selectTargetSibling')}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox aria-label={t('selectTargetSibling')}>
                            {aliases
                              .filter((a) => a.id !== mergeAliasTarget.id)
                              .map((sibling) => (
                                <ListBox.Item
                                  key={sibling.id}
                                  id={sibling.id}
                                  textValue={`${sibling.rawAlias} (${sibling.studentCount ?? sibling.queryCount} نفر)`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-semibold text-xs">{sibling.rawAlias}</span>
                                    <span className="text-[11px] text-neutral-400">
                                      {sibling.studentCount ?? sibling.queryCount} نفر
                                    </span>
                                  </div>
                                </ListBox.Item>
                              ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onPress={() => setMergeAliasTarget(null)}
                      isDisabled={isMergingAliases}
                    >
                      {tCommon('actions.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isDisabled={!targetSiblingId}
                      isPending={isMergingAliases}
                    >
                      {t('mergeSibling')}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* Sub-Modal 3: Move Alias to Another Topic */}
      {moveAliasTarget && (
        <Modal
          isOpen={Boolean(moveAliasTarget)}
          onOpenChange={(open) => !open && setMoveAliasTarget(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="md">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex items-center gap-2 text-blue-600">
                    <ArrowRightLeft className={ICON_SIZE_CLASS.md} />
                    <Modal.Heading>{t('moveTopicTitle')}</Modal.Heading>
                  </div>
                </Modal.Header>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!moveAliasTarget || !targetTopicId) return;
                    await moveAliasMutate({
                      aliasId: moveAliasTarget.id,
                      targetTopicId,
                    });
                  }}
                >
                  <Modal.Body className="flex flex-col gap-3">
                    <p className="text-caption text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {t('moveTopicDesc', { name: moveAliasTarget.rawAlias })}
                    </p>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {t('selectTargetTopic')}
                      </label>
                      {isLoadingOtherTopics ? (
                        <div className="flex items-center justify-center p-4">
                          <Spinner size="sm" />
                        </div>
                      ) : (
                        <Select
                          selectedKey={targetTopicId}
                          onSelectionChange={(key) => setTargetTopicId(String(key))}
                          className="w-full"
                          aria-label={t('selectTargetTopic')}
                        >
                          <Select.Trigger>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox aria-label={t('selectTargetTopic')}>
                              {candidateTopics.length === 0 ? (
                                <ListBox.Item id="none" textValue="هیچ سرگروه دیگری یافت نشد" isDisabled>
                                  هیچ سرگروه دیگری یافت نشد
                                </ListBox.Item>
                              ) : (
                                candidateTopics.map((cand) => (
                                  <ListBox.Item
                                    key={cand.id}
                                    id={cand.id}
                                    textValue={cand.canonicalName}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="font-semibold text-xs">{cand.canonicalName}</span>
                                      <span className="text-[11px] text-neutral-400">
                                        ({cand.aliases?.length || 0} واریانت)
                                      </span>
                                    </div>
                                  </ListBox.Item>
                                ))
                              )}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      )}
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onPress={() => setMoveAliasTarget(null)}
                      isDisabled={isMovingAlias}
                    >
                      {tCommon('actions.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      isDisabled={!targetTopicId || targetTopicId === 'none'}
                      isPending={isMovingAlias}
                    >
                      {t('moveTopic')}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* Sub-Modal 4: Split / Independent Topic */}
      {splitAliasTarget && (
        <Modal
          isOpen={Boolean(splitAliasTarget)}
          onOpenChange={(open) => !open && setSplitAliasTarget(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="md">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex items-center gap-2 text-primary-600">
                    <GitBranch className={ICON_SIZE_CLASS.md} />
                    <Modal.Heading>{t('splitModalTitle', { name: splitAliasTarget.rawAlias })}</Modal.Heading>
                  </div>
                </Modal.Header>

                <form onSubmit={handleConfirmSplit}>
                  <Modal.Body className="flex flex-col gap-3">
                    <p className="text-caption text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {t('splitModalDesc')}
                    </p>

                    <InputField
                      label={t('newCanonicalNameLabel')}
                      value={splitNameInput}
                      onChange={(e) => setSplitNameInput(e.target.value)}
                      required
                      isDisabled={isSplitting}
                    />
                  </Modal.Body>

                  <Modal.Footer className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onPress={() => setSplitAliasTarget(null)}
                      isDisabled={isSplitting}
                    >
                      {tCommon('actions.cancel')}
                    </Button>
                    <Button type="submit" variant="primary" isPending={isSplitting}>
                      {t('splitAlias')}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      {/* Sub-Modal 5: Delete Alias Confirmation */}
      {deleteAliasTarget && (
        <Modal
          isOpen={Boolean(deleteAliasTarget)}
          onOpenChange={(open) => !open && setDeleteAliasTarget(null)}
        >
          <Modal.Backdrop>
            <Modal.Container size="md">
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex items-center gap-2 text-danger-600">
                    <AlertTriangle className={ICON_SIZE_CLASS.md} />
                    <Modal.Heading>{t('confirmDeleteAliasTitle', { name: deleteAliasTarget.rawAlias })}</Modal.Heading>
                  </div>
                </Modal.Header>

                <Modal.Body>
                  <p className="text-caption text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {t('confirmDeleteAliasDesc', {
                      count: deleteAliasTarget.studentCount ?? deleteAliasTarget.queryCount,
                    })}
                  </p>
                </Modal.Body>

                <Modal.Footer className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onPress={() => setDeleteAliasTarget(null)}
                    isDisabled={isDeleting}
                  >
                    {tCommon('actions.cancel')}
                  </Button>
                  <Button variant="danger" onPress={handleConfirmDelete} isPending={isDeleting}>
                    {t('deleteAlias')}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </>
  );
};
