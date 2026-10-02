import type { ErrorLogDto } from './_dto';
import type { IErrorLog } from '@/models';

export const toErrorLogModel = (dto: ErrorLogDto): IErrorLog => ({
  id: dto.id,
  source: dto.source,
  level: dto.level,
  message: dto.message,
  stack: dto.stack ?? null,
  context: dto.context ?? null,
  isResolved: Boolean(dto.isResolved),
  resolvedAt: dto.resolvedAt ?? null,
  resolvedBy: dto.resolvedBy ?? null,
  createdAt: dto.createdAt,
});
