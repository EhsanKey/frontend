export interface IAiCacheResource {
  id: string;
  label: string;
  link: string;
}

export interface IAiCacheEntry {
  id: string;
  cacheKey: string;
  intent: string;
  scopeKey?: string;
  hitCount: number;
  lastHitAt?: string;
  createdAt: string;
  updatedAt: string;
  answerPreview: string;
  answerText: string;
  resources?: IAiCacheResource[];
  resourceCount?: number;
  professor?: {
    id: string;
    name: string;
  };
  course?: {
    id: string;
    name: string;
  };
}

export interface IAiCacheTopProfessor {
  professorId: string;
  professorName: string;
  hitCount: number;
}

export interface IAiCacheStats {
  totalCachedEntries: number;
  totalHits: number;
  estimatedTokensSaved: number;
  topProfessors: IAiCacheTopProfessor[];
}

export interface AiCacheInvalidateDto {
  professorId?: string;
  courseId?: string;
  all?: boolean;
}

export interface AiCacheInvalidateResult {
  deletedCount: number;
  scope: string;
  targetId?: string;
}

export interface AiCacheFlushResult {
  deletedCount: number;
  scope: 'all';
}
