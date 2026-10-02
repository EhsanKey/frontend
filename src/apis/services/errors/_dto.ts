import type { ErrorLevel, ErrorSource } from '@/models';

export interface ErrorLogDto {
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

export interface ResolveErrorResultDto {
  id: string;
  isResolved: boolean;
  resolvedAt: string;
  resolvedBy: string;
}
