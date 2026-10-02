'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Chip,
  Tabs,
} from '@heroui/react';
import {
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { clientTelegramServices } from '@/apis/services/telegram';
import { SearchInput } from '@/components/shared';
import TableContainer, { type TableHeaderOptions } from '@/containers/table-container';
import { PAGE_SIZE, QUERY_KEYS } from '@/constants';
import { useGetRequest, useQueryState } from '@/hooks';
import { formatPersianDate } from '@/utils';
import { ChatModal } from './chat-modal';
import type {
  ITelegramConversation,
  ITelegramGroup,
  ITelegramMessage,
  ITelegramUser,
} from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

interface TelegramClientProps {
  initialGroups?: PaginatedResult<ITelegramGroup>;
  initialUsers?: PaginatedResult<ITelegramUser>;
  initialConversations?: PaginatedResult<ITelegramConversation>;
}

type GroupColumnKey = 'title' | 'chatId' | 'major' | 'messageCount' | 'configuredBy' | 'status';
type UserColumnKey =
  | 'displayName'
  | 'username'
  | 'academic'
  | 'interactionCount'
  | 'isBot'
  | 'spamCount'
  | 'status'
  | 'createdAt';
type ConvColumnKey = 'user' | 'chatTitle' | 'lastMessage' | 'lastMessageAt' | 'actions';

export const TelegramClient = ({
  initialGroups,
  initialUsers,
  initialConversations,
}: TelegramClientProps) => {
  const t = useTranslations('telegram');
  const { getQuery, updateQueries } = useQueryState();

  const selectedTab = getQuery('tab') || 'groups';
  const page = Number(getQuery('page')) || 1;
  const searchTerm = getQuery('search') || '';

  // Selected conversation for modal
  const [selectedConv, setSelectedConv] = useState<ITelegramConversation | null>(null);
  const [messages, setMessages] = useState<ITelegramMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const handleTabChange = (key: string) => {
    updateQueries({
      tab: key === 'groups' ? null : key,
      page: null,
    });
  };

  const handleSearchChange = (value: string) => {
    updateQueries({
      search: value || null,
      page: null,
    });
  };

  // Groups Query
  const { data: groupsData, isLoading: groupsLoading } = useGetRequest<
    PaginatedResult<ITelegramGroup>
  >({
    queryKey: QUERY_KEYS.telegram.groupsList({
      page: selectedTab === 'groups' ? page : 1,
      pageSize: PAGE_SIZE,
      search: searchTerm || undefined,
    }),
    requestFn: (signal) =>
      clientTelegramServices.getTelegramGroups(
        {
          page: selectedTab === 'groups' ? page : 1,
          pageSize: PAGE_SIZE,
          search: searchTerm || undefined,
        },
        signal,
      ),
    initialData:
      selectedTab === 'groups' && page === 1 && !searchTerm
        ? initialGroups
        : undefined,
    keepPreviousData: true,
  });

  // Users Query
  const { data: usersData, isLoading: usersLoading } = useGetRequest<
    PaginatedResult<ITelegramUser>
  >({
    queryKey: QUERY_KEYS.telegram.usersList({
      page: selectedTab === 'users' ? page : 1,
      pageSize: PAGE_SIZE,
      search: searchTerm || undefined,
    }),
    requestFn: (signal) =>
      clientTelegramServices.getTelegramUsers(
        {
          page: selectedTab === 'users' ? page : 1,
          pageSize: PAGE_SIZE,
          search: searchTerm || undefined,
        },
        signal,
      ),
    initialData:
      selectedTab === 'users' && page === 1 && !searchTerm
        ? initialUsers
        : undefined,
    keepPreviousData: true,
  });

  // Conversations Query
  const { data: convsData, isLoading: convsLoading } = useGetRequest<
    PaginatedResult<ITelegramConversation>
  >({
    queryKey: QUERY_KEYS.telegram.conversationsList({
      page: selectedTab === 'conversations' ? page : 1,
      pageSize: PAGE_SIZE,
      search: searchTerm || undefined,
    }),
    requestFn: (signal) =>
      clientTelegramServices.getTelegramConversations(
        {
          page: selectedTab === 'conversations' ? page : 1,
          pageSize: PAGE_SIZE,
          search: searchTerm || undefined,
        },
        signal,
      ),
    initialData:
      selectedTab === 'conversations' && page === 1 && !searchTerm
        ? initialConversations
        : undefined,
    keepPreviousData: true,
  });

  const handleOpenChat = async (conv: ITelegramConversation) => {
    setSelectedConv(conv);
    setIsModalOpen(true);
    setLoadingMessages(true);
    try {
      const msgs = await clientTelegramServices.getConversationMessages(conv.id);
      setMessages(msgs || []);
    } catch (err) {
      console.error('Failed to load conversation messages:', err);
      setMessages(conv.messages || []);
    } finally {
      setLoadingMessages(false);
    }
  };

  const groups = useMemo(() => groupsData?.items ?? [], [groupsData]);
  const users = useMemo(() => usersData?.items ?? [], [usersData]);
  const conversations = useMemo(() => convsData?.items ?? [], [convsData]);

  const totalGroups = groupsData?.meta?.total ?? initialGroups?.meta?.total ?? 0;
  const totalUsers = usersData?.meta?.total ?? initialUsers?.meta?.total ?? 0;
  const totalConvs = convsData?.meta?.total ?? initialConversations?.meta?.total ?? 0;

  const selectedConvUser = useMemo(() => {
    if (!selectedConv) return null;
    return users.find((u) => u.id === selectedConv.telegramUserId) || null;
  }, [users, selectedConv]);

  // Group columns
  const groupHeaderCells: TableHeaderOptions<GroupColumnKey>[] = [
    { id: 'title', label: t('groups.chatTitle'), isRowHeader: true },
    { id: 'chatId', label: t('groups.chatId') },
    { id: 'major', label: t('groups.major') },
    { id: 'messageCount', label: t('groups.messageCount'), className: 'w-32 text-center' },
    { id: 'configuredBy', label: t('groups.configuredBy') },
    { id: 'status', label: t('groups.status'), className: 'w-28 text-center' },
  ];

  const renderGroupCell = (group: ITelegramGroup, columnKey: GroupColumnKey) => {
    switch (columnKey) {
      case 'title':
        return (
          <div>
            <span className="font-semibold text-foreground block">
              {group.chatTitle}
            </span>
            <span className="text-xs text-muted-foreground">
              {[group.universityName, group.campusName].filter(Boolean).join(' • ') || '-'}
            </span>
          </div>
        );
      case 'chatId':
        return (
          <code className="text-xs bg-content2 px-2 py-0.5 rounded dir-ltr inline-block">
            {group.telegramChatId}
          </code>
        );
      case 'major':
        return (
          <div>
            <span className="text-foreground block">{group.majorName || '-'}</span>
            {group.degreeLevel && (
              <span className="text-xs text-muted-foreground block">{group.degreeLevel}</span>
            )}
          </div>
        );
      case 'messageCount':
        return (
          <div className="text-center">
            <span className="font-semibold text-foreground block">
              {(group.messageCount ?? 0).toLocaleString('fa-IR')}
            </span>
            {group.lastActiveAt ? (
              <span className="text-[11px] text-muted-foreground block">
                {formatPersianDate(group.lastActiveAt)}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground block">-</span>
            )}
          </div>
        );
      case 'configuredBy':
        return (
          <span className="text-xs text-muted-foreground">
            {group.configuredByDisplayName || t('groups.system')}
          </span>
        );
      case 'status':
        return (
          <div className="flex justify-center">
            <Chip
              size="sm"
              variant="secondary"
              className={
                group.isEnabled
                  ? 'bg-success-50 text-success-700 font-medium'
                  : 'bg-neutral-100 text-neutral-600 font-medium'
              }
            >
              {group.isEnabled ? t('groups.active') : t('groups.inactive')}
            </Chip>
          </div>
        );
      default:
        return null;
    }
  };

  // User columns
  const userHeaderCells: TableHeaderOptions<UserColumnKey>[] = [
    { id: 'displayName', label: t('users.displayName'), isRowHeader: true },
    { id: 'username', label: t('users.username') },
    { id: 'academic', label: t('users.academic') },
    { id: 'interactionCount', label: t('users.interactionCount'), className: 'w-32 text-center' },
    { id: 'isBot', label: t('users.isBot'), className: 'w-24 text-center' },
    { id: 'spamCount', label: t('users.spamCount'), className: 'w-24 text-center' },
    { id: 'status', label: t('users.status'), className: 'w-28 text-center' },
    { id: 'createdAt', label: t('users.createdAt'), className: 'w-36 text-center' },
  ];

  const renderUserCell = (user: ITelegramUser, columnKey: UserColumnKey) => {
    switch (columnKey) {
      case 'displayName':
        return (
          <div>
            <span className="font-semibold text-foreground block">
              {user.displayName}
            </span>
            <span className="text-xs text-muted-foreground dir-ltr inline-block">
              ID: {user.id}
            </span>
          </div>
        );
      case 'username':
        return user.username ? (
          <span className="dir-ltr text-primary inline-block">
            @{user.username}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      case 'academic':
        return (
          <div>
            <span className="text-foreground text-sm font-medium block">
              {user.universityName || '-'}
            </span>
            <span className="text-xs text-muted-foreground block">
              {[user.majorName, user.degreeLevel].filter(Boolean).join(' • ') || '-'}
            </span>
          </div>
        );
      case 'interactionCount':
        return (
          <div className="text-center">
            <span className="font-semibold text-primary block">
              {(user.interactionCount ?? 0).toLocaleString('fa-IR')}
            </span>
            {user.lastActiveAt ? (
              <span className="text-[11px] text-muted-foreground block">
                {formatPersianDate(user.lastActiveAt)}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground block">-</span>
            )}
          </div>
        );
      case 'isBot':
        return (
          <Chip
            size="sm"
            variant="secondary"
            className={
              user.isBot
                ? 'bg-warning-50 text-warning-700 font-medium'
                : 'bg-neutral-100 text-neutral-600 font-medium'
            }
          >
            {user.isBot ? t('users.bot') : t('users.human')}
          </Chip>
        );
      case 'spamCount':
        return (
          <span
            className={`font-semibold text-center block ${
              user.spamViolationCount > 0 ? 'text-danger' : 'text-foreground'
            }`}
          >
            {user.spamViolationCount}
          </span>
        );
      case 'status':
        return (
          <div className="flex justify-center">
            {user.spamBlockedUntil ? (
              <Chip
                size="sm"
                variant="secondary"
                className="bg-danger-50 text-danger-700 font-medium inline-flex items-center gap-1"
              >
                <ShieldAlert size={14} />
                {t('users.blocked')}
              </Chip>
            ) : (
              <Chip
                size="sm"
                variant="secondary"
                className="bg-success-50 text-success-700 font-medium inline-flex items-center gap-1"
              >
                <ShieldCheck size={14} />
                {t('users.normal')}
              </Chip>
            )}
          </div>
        );
      case 'createdAt':
        return (
          <span className="text-xs text-muted-foreground">
            {formatPersianDate(user.createdAt)}
          </span>
        );
      default:
        return null;
    }
  };

  // Conversation columns
  const convHeaderCells: TableHeaderOptions<ConvColumnKey>[] = [
    { id: 'user', label: t('conversations.user'), isRowHeader: true },
    { id: 'chatTitle', label: t('conversations.chatTitle') },
    { id: 'lastMessage', label: t('conversations.lastMessage') },
    { id: 'lastMessageAt', label: t('conversations.lastMessageAt'), className: 'w-36 text-center' },
    { id: 'actions', label: t('conversations.actions'), className: 'w-32 text-center' },
  ];

  const renderConvCell = (conv: ITelegramConversation, columnKey: ConvColumnKey) => {
    switch (columnKey) {
      case 'user':
        return (
          <div>
            <span className="font-semibold text-foreground block">
              {conv.userDisplayName || (conv.isGroup ? t('conversations.groupUser') : t('conversations.user'))}
            </span>
            <span className="text-xs text-muted-foreground dir-ltr inline-block">
              ID: {conv.telegramUserId || conv.telegramChatId}
            </span>
          </div>
        );
      case 'chatTitle': {
        const isGroupChat =
          conv.isGroup ||
          Boolean(conv.groupTitle) ||
          (conv.chatTitle &&
            conv.chatTitle !== t('conversations.privateChat') &&
            conv.chatTitle !== 'گفتگوی خصوصی' &&
            conv.chatTitle !== 'خصوصی');

        const displayTitle =
          conv.groupTitle ||
          conv.chatTitle ||
          (isGroupChat ? t('conversations.groupBadge') : t('conversations.privateChat'));

        return isGroupChat ? (
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="text-xs font-medium text-foreground">
              {displayTitle}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare size={14} className="shrink-0" />
            <span>{t('conversations.privateChat')}</span>
          </div>
        );
      }
      case 'lastMessage':
        return (
          <p className="line-clamp-1 max-w-md text-sm text-foreground">
            {conv.lastMessage || '-'}
          </p>
        );
      case 'lastMessageAt':
        return (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {conv.lastMessageAt ? formatPersianDate(conv.lastMessageAt) : '-'}
          </span>
        );
      case 'actions':
        return (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="primary"
              onPress={() => handleOpenChat(conv)}
            >
              {t('conversations.viewMessages')}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="sr-only">{t('title')}</h1>

      <div className="flex justify-end">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            placeholder={t('search')}
            queryValue={searchTerm}
            onValueChange={handleSearchChange}
            showSearchIcon
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => handleTabChange(String(key))}
        variant="primary"
      >
        <Tabs.List className="border-b border-divider gap-2">
          <Tabs.Tab
            id="groups"
            className="flex items-center gap-2 py-2.5 px-4 cursor-pointer data-[selected=true]:border-b-2 data-[selected=true]:border-primary"
          >
            <Users size={18} />
            <span>{t('tabs.groups')}</span>
            <Chip size="sm" variant="secondary">
              {totalGroups.toLocaleString('fa-IR')}
            </Chip>
          </Tabs.Tab>
          <Tabs.Tab
            id="users"
            className="flex items-center gap-2 py-2.5 px-4 cursor-pointer data-[selected=true]:border-b-2 data-[selected=true]:border-primary"
          >
            <User size={18} />
            <span>{t('tabs.users')}</span>
            <Chip size="sm" variant="secondary">
              {totalUsers.toLocaleString('fa-IR')}
            </Chip>
          </Tabs.Tab>
          <Tabs.Tab
            id="conversations"
            className="flex items-center gap-2 py-2.5 px-4 cursor-pointer data-[selected=true]:border-b-2 data-[selected=true]:border-primary"
          >
            <MessageSquare size={18} />
            <span>{t('tabs.conversations')}</span>
            <Chip size="sm" variant="secondary">
              {totalConvs.toLocaleString('fa-IR')}
            </Chip>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Tab Content: Groups */}
      {selectedTab === 'groups' && (
        <TableContainer
          ariaLabel={t('groups.title')}
          headerCells={groupHeaderCells}
          items={groups}
          pagination={
            groupsData?.meta
              ? {
                  ...groupsData.meta,
                  page,
                  onPageChange: (nextPage) =>
                    updateQueries({ page: nextPage === 1 ? null : nextPage }),
                }
              : undefined
          }
          isLoading={groupsLoading}
          renderCell={renderGroupCell}
        />
      )}

      {/* Tab Content: Users */}
      {selectedTab === 'users' && (
        <TableContainer
          ariaLabel={t('users.title')}
          headerCells={userHeaderCells}
          items={users}
          pagination={
            usersData?.meta
              ? {
                  ...usersData.meta,
                  page,
                  onPageChange: (nextPage) =>
                    updateQueries({ page: nextPage === 1 ? null : nextPage }),
                }
              : undefined
          }
          isLoading={usersLoading}
          renderCell={renderUserCell}
        />
      )}

      {/* Tab Content: Conversations */}
      {selectedTab === 'conversations' && (
        <TableContainer
          ariaLabel={t('conversations.title')}
          headerCells={convHeaderCells}
          items={conversations}
          pagination={
            convsData?.meta
              ? {
                  ...convsData.meta,
                  page,
                  onPageChange: (nextPage) =>
                    updateQueries({ page: nextPage === 1 ? null : nextPage }),
                }
              : undefined
          }
          isLoading={convsLoading}
          renderCell={renderConvCell}
        />
      )}

      {/* Chat Messages Modal */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        conversation={selectedConv}
        user={selectedConvUser}
        messages={messages}
        isLoading={loadingMessages}
      />
    </div>
  );
};
