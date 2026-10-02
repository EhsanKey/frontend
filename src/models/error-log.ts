export type ErrorSource =
  | 'ai_planner'
  | 'ai_answer'
  | 'database'
  | 'internal_tool'
  | 'telegram'
  | 'system';

export type ErrorLevel = 'error' | 'warning' | 'fatal';

export interface IErrorLog {
  id: string;
  source: ErrorSource;
  level: ErrorLevel;
  message: string;
  stack?: string | null;
  context?: {
    userId?: string;
    chatId?: string;
    intent?: string;
    professors?: string[];
    [key: string]: unknown;
  } | null;
  isResolved: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  createdAt: string;
}
