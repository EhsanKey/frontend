import type { ReactNode } from 'react';

import { type EntityResolutionDto } from '@/apis/services/crawler';

const MATCH_SOURCE_LABEL: Record<string, string> = {
  database: 'پیشنهاد دیتابیس',
  excel: 'پیشنهاد کاتالوگ جامع',
  alias: 'نام مستعار',
  none: 'تطبیق',
};

export interface ExtractedVsResolvedRowProps {
  /** What the crawler read out of the message, before any catalog/DB resolution. */
  extractedLabel: string;
  extractedValue: string;
  resolution?: EntityResolutionDto;
  /** Shown when the resolution found nothing; defaults to a generic «not defined yet». */
  missingHint?: string;
  children?: ReactNode;
}

/**
 * The moderator-facing "what the crawler read" vs "what it matched" row. Professor, course and
 * academic scope all render through this one component so the two sides can never drift apart
 * again — the copy-paste variant that shipped once labelled a resolved value as the raw one.
 */
export function ExtractedVsResolvedRow({
  extractedLabel,
  extractedValue,
  resolution,
  missingHint = 'موردی یافت نشد (تعریف‌نشده)',
  children,
}: ExtractedVsResolvedRowProps) {
  return (
    <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
      <div className="flex items-center gap-1.5">
        <span className="text-neutral-500 font-medium">{extractedLabel}:</span>
        <span className="text-neutral-800 font-bold bg-white px-2 py-0.5 rounded border border-neutral-200">
          {extractedValue}
        </span>
      </div>
      {children ?? (
        <div className="flex items-center gap-1.5">
          {resolution?.matchedName ? (
            <>
              <span className="text-neutral-500 font-medium">
                {MATCH_SOURCE_LABEL[resolution.matchType ?? 'none'] ?? MATCH_SOURCE_LABEL.none} (
                {resolution.score}٪):
              </span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {resolution.matchedName}
              </span>
            </>
          ) : (
            <>
              <span className="text-neutral-500 font-medium">تطبیق:</span>
              <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {missingHint}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
