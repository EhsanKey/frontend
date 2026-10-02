export interface ITelegramUser {
  id: string;
  displayName: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isBot: boolean;
  spamViolationCount: number;
  spamBlockedUntil: string | null;
  universityId?: string | null;
  campusId?: string | null;
  majorId?: string | null;
  universityName?: string | null;
  campusName?: string | null;
  majorName?: string | null;
  degreeLevel?: string | null;
  interactionCount: number;
  lastActiveAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ITelegramGroup {
  id: string;
  telegramChatId: string;
  chatTitle: string;
  degreeLevel?: string | null;
  isEnabled: boolean;
  messageCount: number;
  lastActiveAt?: string | null;
  configuredByDisplayName?: string | null;
  universityName?: string;
  campusName?: string;
  majorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITelegramMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ITelegramConversation {
  id: string;
  telegramChatId?: string;
  telegramUserId: string;
  userDisplayName: string;
  chatTitle?: string | null;
  groupTitle?: string | null;
  isGroup?: boolean;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  messages?: ITelegramMessage[];
  user?: {
    id?: string;
    displayName?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
}
