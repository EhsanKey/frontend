'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { Button, Modal, Spinner } from '@heroui/react';
import {
  Bot,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  CornerUpLeft,
  GraduationCap,
  MessageCircle,
  MessageSquare,
  Quote,
  Search,
  Sparkles,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import {
  formatPersianFullDate,
  formatPersianTime,
  isSameDay,
} from '@/utils';
import { TelegramMessageContent } from './telegram-message-content';
import type {
  ITelegramConversation,
  ITelegramMessage,
  ITelegramUser,
} from '@/models';

interface ChatModalProps {
  conversation: ITelegramConversation | null;
  user?: ITelegramUser | null;
  messages: ITelegramMessage[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedReplyMessage {
  hasReference: boolean;
  referenceText?: string;
  userPrompt: string;
}

// Parses messages that contain structured reference/reply blocks
function parseReferencedMessage(content: string): ParsedReplyMessage {
  if (!content) return { hasReference: false, userPrompt: '' };

  const regex =
    /^(?:پیام مرجع|مرجع پیام|متن مرجع):\s*\n([\s\S]*?)\n+(?:درخواست کاربر|متن پیام|پیام کاربر):\s*\n([\s\S]*)$/i;
  const match = content.match(regex);

  if (match) {
    return {
      hasReference: true,
      referenceText: match[1].trim(),
      userPrompt: match[2].trim(),
    };
  }

  return {
    hasReference: false,
    userPrompt: content,
  };
}

// Finds the referenced message inside the current chat message history
function findReferencedMessage(
  refText: string | undefined,
  currentMsgIndex: number,
  allMessages: ITelegramMessage[],
): ITelegramMessage | null {
  if (!refText) return null;
  const cleanRef = refText.replace(/[\s\u200c]+/g, ' ').trim().toLowerCase();
  if (!cleanRef) return null;

  // 1. Search prior messages before this message
  for (let i = currentMsgIndex - 1; i >= 0; i--) {
    const m = allMessages[i];
    const cleanContent = m.content.replace(/[\s\u200c]+/g, ' ').trim().toLowerCase();
    if (
      cleanContent === cleanRef ||
      cleanContent.includes(cleanRef) ||
      cleanRef.includes(cleanContent) ||
      (cleanRef.length > 20 && cleanContent.slice(0, 45) === cleanRef.slice(0, 45))
    ) {
      return m;
    }
  }

  // 2. Search remaining messages just in case
  for (let i = 0; i < allMessages.length; i++) {
    if (i === currentMsgIndex) continue;
    const m = allMessages[i];
    const cleanContent = m.content.replace(/[\s\u200c]+/g, ' ').trim().toLowerCase();
    if (
      cleanContent === cleanRef ||
      cleanContent.includes(cleanRef) ||
      cleanRef.includes(cleanContent)
    ) {
      return m;
    }
  }

  return null;
}

// Telegram iconic background doodle pattern with unique patternId
const TelegramWallpaper = () => {
  const rawId = useId();
  const patternId = `tg-pat-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035] dark:opacity-[0.045] text-current"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={patternId}
          width="180"
          height="180"
          patternUnits="userSpaceOnUse"
        >
          {/* Paper airplane */}
          <path
            d="M20 30 L45 20 L35 45 L28 35 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Smile emoji */}
          <circle cx="100" cy="30" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="96" cy="27" r="1.2" fill="currentColor" />
          <circle cx="104" cy="27" r="1.2" fill="currentColor" />
          <path d="M96 33 Q 100 37 104 33" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Sparkle */}
          <path d="M150 25 L160 25 M155 20 L155 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Chat bubble */}
          <rect x="25" y="90" width="24" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M32 108 L28 114 L38 108" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Plus / Cross */}
          <path d="M95 95 L115 115 M115 95 L95 115" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {/* Clock */}
          <circle cx="150" cy="100" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M150 96 L150 100 L153 100" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {/* Cloud wave */}
          <path d="M30 150 Q 42 140 54 150 T 78 150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Star */}
          <polygon
            points="145,145 148,152 155,153 150,158 151,165 145,161 139,165 140,158 135,153 142,152"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          {/* Heart */}
          <path
            d="M100 150 C 95 142, 85 146, 85 153 C 85 160, 100 168, 100 168 C 100 168, 115 160, 115 153 C 115 146, 105 142, 100 150 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export const ChatModal = ({
  conversation,
  user,
  messages,
  isLoading,
  isOpen,
  onClose,
}: ChatModalProps) => {
  const t = useTranslations('telegram.conversations');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Client hydration safe guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search state inside chat
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to bottom indicator
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Copy states
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Target message highlight state for reply jump
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  // Auto scroll to bottom when messages finish loading or open
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isLoading && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoading, messages.length, scrollToBottom]);

  // Jump to referenced message with animated highlight
  const scrollToMessage = useCallback((messageId: string) => {
    const element = document.getElementById(`msg-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId((curr) => (curr === messageId ? null : curr));
      }, 2000);
    }
  }, []);

  // Handle scroll event to display floating scroll down button
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceFromBottom > 160);
  };

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase().trim();
    return messages.filter((msg) => msg.content.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  // Format date separator pills
  const getDateLabel = (dateStr: string) => {
    try {
      const msgDate = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (
        msgDate.getFullYear() === today.getFullYear() &&
        msgDate.getMonth() === today.getMonth() &&
        msgDate.getDate() === today.getDate()
      ) {
        return t('today');
      }

      if (
        msgDate.getFullYear() === yesterday.getFullYear() &&
        msgDate.getMonth() === yesterday.getMonth() &&
        msgDate.getDate() === yesterday.getDate()
      ) {
        return t('yesterday');
      }

      return formatPersianFullDate(dateStr);
    } catch {
      return dateStr;
    }
  };

  // Copy entire conversation transcript
  const handleCopyAll = async () => {
    try {
      const transcript = messages
        .map((m) => {
          const roleLabel =
            m.role === 'user'
              ? conversation?.userDisplayName || t('userRole')
              : t('assistantRole');
          const time = formatPersianTime(m.createdAt);
          return `[${roleLabel} - ${time}]\n${m.content}\n`;
        })
        .join('\n---\n\n');

      await navigator.clipboard.writeText(transcript);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      // Ignore
    }
  };

  // Copy individual message
  const handleCopyMessage = async (msgId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(msgId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // Ignore
    }
  };

  // Extract student and group details
  const isGroupChat =
    conversation?.isGroup ||
    Boolean(conversation?.groupTitle) ||
    Boolean(
      conversation?.chatTitle &&
        conversation.chatTitle !== t('privateChat') &&
        conversation.chatTitle !== 'گفتگوی خصوصی' &&
        conversation.chatTitle !== 'خصوصی',
    );

  const chatGroupTitle =
    conversation?.groupTitle ||
    conversation?.chatTitle ||
    (isGroupChat && conversation?.telegramChatId
      ? `گروه (${conversation.telegramChatId})`
      : isGroupChat
        ? t('groupBadge')
        : null);

  const studentName =
    conversation?.userDisplayName ||
    user?.displayName ||
    (isGroupChat ? t('groupUser') : t('userRole'));

  const studentUsername = user?.username ? `@${user.username}` : null;
  const academicInfo = useMemo(() => {
    const parts: string[] = [];
    if (user?.universityName) parts.push(user.universityName);
    if (user?.campusName && user.campusName !== user.universityName) parts.push(user.campusName);
    if (user?.majorName) parts.push(user.majorName);
    return parts.join(' • ');
  }, [user]);

  if (!mounted) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSearchOpen(false);
          setSearchQuery('');
          onClose();
        }
      }}
    >
      <Modal.Backdrop className="bg-black/60 backdrop-blur-sm">
        <Modal.Container size="cover" className="w-full !max-w-4xl p-2 md:p-4 my-auto">
          <Modal.Dialog className="relative flex h-[88vh] max-h-[860px] w-full flex-col overflow-hidden rounded-3xl border border-divider/60 bg-content1 shadow-2xl">
            <Modal.CloseTrigger />

            {/* Top Telegram Header */}
            <Modal.Header className="p-0 border-b border-divider/60 bg-background/95 backdrop-blur-md block">
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 md:px-5">
                  {/* User / Chat Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* User Avatar */}
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 text-white shadow-md">
                      <UserIcon size={22} className="opacity-95" />
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      </span>
                    </div>

                    {/* Names and Context */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-foreground md:text-base">
                          {studentName}
                        </span>
                        {studentUsername && (
                          <span className="dir-ltr rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                            {studentUsername}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {isGroupChat ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                            <Users size={13} />
                            <span>{chatGroupTitle}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare size={12} />
                            <span>{t('directChat')}</span>
                          </span>
                        )}

                        {academicInfo && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="inline-flex items-center gap-1 truncate text-[11px]">
                              <GraduationCap size={12} className="opacity-75" />
                              <span>{academicInfo}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Search Toggle */}
                    <button
                      type="button"
                      onClick={() => setSearchOpen(!searchOpen)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                        searchOpen
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-neutral-200/60 hover:text-foreground dark:hover:bg-neutral-800'
                      }`}
                      title={t('searchPlaceholder')}
                    >
                      <Search size={18} />
                    </button>

                    {/* Copy All Button */}
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      disabled={messages.length === 0}
                      className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-neutral-200/60 hover:text-foreground disabled:opacity-40 dark:hover:bg-neutral-800"
                      title={t('copyAll')}
                    >
                      {copiedAll ? (
                        <>
                          <Check size={15} className="text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">{t('allCopied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          <span className="hidden sm:inline">{t('copyAll')}</span>
                        </>
                      )}
                    </button>

                    {/* Messages Count Badge */}
                    <div className="hidden md:flex items-center gap-1 rounded-full bg-neutral-200/60 dark:bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      <MessageCircle size={13} />
                      <span>{t('messagesCount', { count: messages.length })}</span>
                    </div>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-danger-50 hover:text-danger dark:hover:bg-danger-950/30"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* In-chat Search Bar */}
                {searchOpen && (
                  <div className="flex items-center gap-3 border-t border-divider/40 bg-neutral-100/80 dark:bg-neutral-900/80 px-4 py-2 backdrop-blur-md">
                    <Search size={16} className="text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      autoFocus
                      className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    {searchQuery && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {t('searchResults', { count: filteredMessages.length })}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="rounded-full p-1 text-muted-foreground hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Modal.Header>

            {/* Telegram Chat Body */}
            <Modal.Body className="p-0 flex-1 overflow-hidden relative bg-[#eef1f5] text-neutral-800 dark:bg-[#0e1621] dark:text-neutral-100 flex flex-col">
              {/* Wallpaper background doodle */}
              <TelegramWallpaper />

              {/* Messages Scroll Area */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="relative z-10 h-full overflow-y-auto px-3 py-4 md:px-6 md:py-6 space-y-3"
              >
                {isLoading ? (
                  /* Telegram Skeleton Loading State */
                  <div className="space-y-4 py-6">
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-black/15 dark:bg-white/10 px-4 py-1.5 text-xs text-foreground backdrop-blur-md">
                        <Spinner size="sm" />
                        <span>{t('loadingMessages')}</span>
                      </div>
                    </div>
                    {/* Fake loading message skeletons */}
                    <div className="flex justify-end">
                      <div className="h-16 w-3/4 max-w-sm rounded-2xl rounded-tl-xs bg-emerald-100/40 dark:bg-[#2b5278]/40 animate-pulse" />
                    </div>
                    <div className="flex justify-start">
                      <div className="h-28 w-4/5 max-w-md rounded-2xl rounded-tr-xs bg-white/60 dark:bg-[#182533]/60 animate-pulse" />
                    </div>
                    <div className="flex justify-end">
                      <div className="h-12 w-2/3 max-w-xs rounded-2xl rounded-tl-xs bg-emerald-100/40 dark:bg-[#2b5278]/40 animate-pulse" />
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  /* Empty state */
                  <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-300/40 dark:bg-neutral-800/80 text-muted-foreground shadow-inner">
                      <MessageSquare size={32} className="opacity-60" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{t('noMessages')}</h4>
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                      در این مکالمه تا کنون پیامی رد و بدل نشده است.
                    </p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  /* Search zero results */
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search size={28} className="text-muted-foreground/60 mb-2" />
                    <span className="text-xs text-muted-foreground">{t('noSearchResults')}</span>
                  </div>
                ) : (
                  /* Message List with Date Groups */
                  filteredMessages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    const prevMsg = filteredMessages[index - 1];
                    const showDateSeparator = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
                    const isCopied = copiedMessageId === msg.id;
                    const isHighlighted = highlightedMessageId === msg.id;

                    // Parse reply / reference structure if present
                    const parsed = parseReferencedMessage(msg.content);
                    const targetMessage = parsed.hasReference
                      ? findReferencedMessage(parsed.referenceText, index, filteredMessages)
                      : null;

                    return (
                      <div key={msg.id} id={`msg-${msg.id}`} className="space-y-3 scroll-mt-20">
                        {/* Date Separator Pill */}
                        {showDateSeparator && (
                          <div className="sticky top-2 z-10 flex justify-center my-3 select-none">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 dark:bg-white/15 px-3.5 py-1 text-[11px] font-medium text-white shadow-xs backdrop-blur-md">
                              <Calendar size={12} className="opacity-80" />
                              <span>{getDateLabel(msg.createdAt)}</span>
                            </span>
                          </div>
                        )}

                        {/* Message Bubble Row */}
                        <div
                          className={`group relative flex w-full items-end gap-2 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {/* Assistant Avatar on Left in RTL */}
                          {!isUser && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-xs">
                              <Bot size={16} />
                            </div>
                          )}

                          {/* Telegram Message Bubble */}
                          <div
                            className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-xs transition-all duration-300 ${
                              isHighlighted
                                ? '!ring-2 !ring-sky-500 shadow-xl scale-[1.01] !bg-sky-100 dark:!bg-sky-950/80'
                                : 'hover:shadow-md'
                            } ${
                              isUser
                                ? 'rounded-tl-xs bg-[#effdde] text-[#182533] border border-[#cbe6ad] dark:bg-[#2b5278] dark:text-[#f8fafc] dark:border-[#386694]'
                                : 'rounded-tr-xs bg-white text-[#1e293b] border border-neutral-200/90 dark:bg-[#182533] dark:text-[#f1f5f9] dark:border-neutral-700/60'
                            }`}
                          >
                            {/* Bubble Header: Sender Name & Badges */}
                            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-1.5">
                                {isUser ? (
                                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1">
                                    <span>{studentName}</span>
                                    <span className="rounded bg-emerald-500/15 px-1 py-0.2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                                      {t('studentBadge')}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="font-bold text-sky-600 dark:text-sky-400 text-xs flex items-center gap-1">
                                    <Sparkles size={12} className="text-sky-500" />
                                    <span>{t('assistantRole')}</span>
                                    <span className="rounded bg-sky-500/15 px-1.5 py-0.2 text-[10px] font-mono font-bold text-sky-600 dark:text-sky-300">
                                      BOT
                                    </span>
                                  </span>
                                )}
                              </div>

                              {/* Floating Message Copy Trigger */}
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
                                title={t('copyMessage')}
                              >
                                {isCopied ? (
                                  <Check size={13} className="text-emerald-500" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </div>

                            {/* Reference / Reply Header */}
                            {parsed.hasReference && (
                              <>
                                {targetMessage ? (
                                  /* Case A: Reference exists in chat context -> Real Telegram Reply Bar */
                                  <button
                                    type="button"
                                    onClick={() => scrollToMessage(targetMessage.id)}
                                    className="mb-2 flex w-full items-stretch gap-2 rounded-lg border-r-3 border-sky-500 bg-black/5 dark:bg-white/10 p-2 text-right transition-all hover:bg-black/10 dark:hover:bg-white/15 cursor-pointer select-none group/reply"
                                    title={t('jumpToMessage')}
                                  >
                                    <div className="flex flex-col min-w-0 flex-1 text-xs">
                                      <span className="font-bold text-sky-600 dark:text-sky-400 text-[11px] truncate flex items-center gap-1">
                                        <CornerUpLeft
                                          size={12}
                                          className="shrink-0 text-sky-500 group-hover/reply:-translate-x-0.5 transition-transform"
                                        />
                                        <span>
                                          {targetMessage.role === 'assistant'
                                            ? t('assistantRole')
                                            : conversation?.userDisplayName || t('userRole')}
                                        </span>
                                      </span>
                                      <span className="truncate text-[11px] opacity-75 line-clamp-1 mt-0.5 text-foreground">
                                        {parsed.referenceText}
                                      </span>
                                    </div>
                                  </button>
                                ) : (
                                  /* Case B: Reference is outside chat context -> Write reference message neatly */
                                  <div className="mb-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-2.5 text-xs text-right">
                                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-[11px] mb-1">
                                      <Quote size={12} className="opacity-80" />
                                      <span>{t('externalReference')}</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-800 dark:text-neutral-200 line-clamp-3 leading-relaxed whitespace-pre-line dir-auto">
                                      {parsed.referenceText}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Message Rich Text / Markdown Content */}
                            <div className="text-xs md:text-sm leading-relaxed overflow-hidden">
                              <TelegramMessageContent
                                content={parsed.hasReference ? parsed.userPrompt : msg.content}
                                role={msg.role}
                                searchQuery={searchQuery}
                              />
                            </div>

                            {/* Bubble Footer: Timestamp & Read Status */}
                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-75 font-mono select-none">
                              <span title={formatPersianFullDate(msg.createdAt)}>
                                {formatPersianTime(msg.createdAt)}
                              </span>
                              {isUser ? (
                                <CheckCheck
                                  size={14}
                                  className="text-emerald-600 dark:text-sky-400"
                                />
                              ) : null}
                            </div>
                          </div>

                          {/* User Avatar on Right in RTL */}
                          {isUser && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xs">
                              <UserIcon size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Floating Scroll to Bottom Button */}
              {showScrollBottom && (
                <button
                  type="button"
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-xl border border-divider/70 backdrop-blur-md transition-all hover:scale-110 active:scale-95 hover:bg-background"
                  title={t('scrollToBottom')}
                >
                  <ChevronDown size={20} />
                </button>
              )}
            </Modal.Body>

            {/* Clean Telegram Footer */}
            <Modal.Footer className="p-0 border-t border-divider/60 bg-background/95 block">
              <div className="flex items-center justify-between px-4 py-2.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {conversation?.telegramUserId && (
                    <span className="font-mono text-[11px] opacity-75 dir-ltr">
                      Telegram ID: {conversation.telegramUserId}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onPress={onClose}
                  className="rounded-xl px-4 text-xs font-semibold"
                >
                  {t('close')}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
