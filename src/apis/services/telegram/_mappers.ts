import type {
  TelegramConversationDto,
  TelegramGroupDto,
  TelegramMessageDto,
  TelegramUserDto,
} from './_dto';
import type {
  ITelegramConversation,
  ITelegramGroup,
  ITelegramMessage,
  ITelegramUser,
} from '@/models';

export const toTelegramUserModel = (dto: TelegramUserDto): ITelegramUser => ({
  id: dto.id,
  displayName: dto.displayName || dto.firstName || dto.username || '',
  username: dto.username ?? null,
  firstName: dto.firstName ?? null,
  lastName: dto.lastName ?? null,
  isBot: Boolean(dto.isBot),
  spamViolationCount: dto.spamViolationCount ?? 0,
  spamBlockedUntil: dto.spamBlockedUntil ?? null,
  universityId: dto.universityId ?? null,
  campusId: dto.campusId ?? null,
  majorId: dto.majorId ?? null,
  degreeLevel: dto.degreeLevel ?? null,
  universityName: dto.universityName ?? null,
  campusName: dto.campusName ?? null,
  majorName: dto.majorName ?? null,
  interactionCount: dto.interactionCount ?? 0,
  lastActiveAt: dto.lastActiveAt ?? null,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const toTelegramGroupModel = (dto: TelegramGroupDto): ITelegramGroup => ({
  id: dto.id,
  telegramChatId: dto.telegramChatId,
  chatTitle: dto.chatTitle,
  degreeLevel: dto.degreeLevel ?? null,
  isEnabled: Boolean(dto.isEnabled),
  messageCount: dto.messageCount ?? 0,
  lastActiveAt: dto.lastActiveAt ?? null,
  configuredByDisplayName: dto.configuredByDisplayName ?? null,
  universityName: dto.university?.name || dto.universityName,
  campusName: dto.campus?.name || dto.campusName,
  majorName: dto.major?.name || dto.majorName,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const toTelegramMessageModel = (
  dto: TelegramMessageDto,
): ITelegramMessage => ({
  id: dto.id,
  conversationId: dto.conversationId || '',
  role: dto.role,
  content: dto.content,
  createdAt: dto.createdAt,
});

export const toTelegramConversationModel = (
  dto: TelegramConversationDto,
): ITelegramConversation => {
  const isChatIdNegative = typeof dto.telegramChatId === 'string' && dto.telegramChatId.startsWith('-');
  const isDiff = Boolean(
    dto.telegramUserId && dto.telegramChatId && dto.telegramChatId !== dto.telegramUserId,
  );
  const isGroup =
    dto.isGroup ??
    (Boolean(dto.groupTitle) || isChatIdNegative || isDiff || !dto.telegramUserId);

  const groupTitle =
    dto.groupTitle ||
    (isGroup && dto.chatTitle && dto.chatTitle !== 'خصوصی' ? dto.chatTitle : null) ||
    (isGroup && dto.telegramChatId ? `گروه (${dto.telegramChatId})` : null);

  const chatTitle = dto.chatTitle || groupTitle || (isGroup ? 'گروه دانشجویی' : null);

  const resolvedDisplayName =
    dto.userDisplayName ||
    dto.user?.displayName ||
    dto.user?.username ||
    (dto.telegramUserId ? `کاربر (${dto.telegramUserId})` : (isGroup ? 'کاربر گروه' : 'کاربر تلگرام'));

  return {
    id: dto.id,
    telegramChatId: dto.telegramChatId || '',
    telegramUserId: dto.telegramUserId || dto.user?.id || '',
    userDisplayName: resolvedDisplayName,
    chatTitle,
    groupTitle,
    isGroup,
    lastMessage: dto.lastMessage ?? undefined,
    lastMessageAt: dto.lastMessageAt ?? undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    messages: dto.messages?.map(toTelegramMessageModel),
    user: dto.user
      ? {
          id: dto.user.id || dto.telegramUserId || '',
          displayName: dto.user.displayName || resolvedDisplayName,
          username: dto.user.username ?? null,
          firstName: dto.user.firstName ?? null,
          lastName: dto.user.lastName ?? null,
        }
      : undefined,
  };
};
