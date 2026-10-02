export interface TelegramUserDto {
  id: string;
  displayName: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isBot?: boolean;
  spamViolationCount?: number;
  spamBlockedUntil?: string | null;
  universityId?: string | null;
  campusId?: string | null;
  majorId?: string | null;
  degreeLevel?: string | null;
  universityName?: string | null;
  campusName?: string | null;
  majorName?: string | null;
  interactionCount?: number;
  lastActiveAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramGroupDto {
  id: string;
  telegramChatId: string;
  chatTitle: string;
  degreeLevel?: string | null;
  isEnabled: boolean;
  messageCount?: number;
  lastActiveAt?: string | null;
  configuredByDisplayName?: string | null;
  university?: { id: string; name: string };
  campus?: { id: string; name: string };
  major?: { id: string; name: string };
  universityName?: string;
  campusName?: string;
  majorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramMessageDto {
  id: string;
  conversationId?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface TelegramConversationDto {
  id: string;
  telegramChatId?: string;
  telegramUserId?: string;
  userDisplayName?: string;
  chatTitle?: string | null;
  groupTitle?: string | null;
  isGroup?: boolean;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  messages?: TelegramMessageDto[];
  user?: {
    id?: string;
    displayName?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
}
