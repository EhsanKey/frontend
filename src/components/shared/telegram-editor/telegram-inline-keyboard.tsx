'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { InlineKeyboardRow, InlineKeyboardButtonItem } from '@/models';

export interface TelegramInlineKeyboardProps {
  rows?: InlineKeyboardRow[];
  className?: string;
  onButtonClick?: (btn: InlineKeyboardButtonItem) => void;
  isInteractive?: boolean;
}

/**
 * Unified, authentic Telegram Inline Keyboard (Glass Buttons / دکمه‌های شیشه‌ای لینک‌دار)
 * Renders high-contrast, crystal-clear buttons with proper Light and Dark mode styling.
 */
export const TelegramInlineKeyboard: React.FC<TelegramInlineKeyboardProps> = ({
  rows = [],
  className = '',
  onButtonClick,
  isInteractive = true,
}) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className={`flex flex-col gap-1.5 w-full select-none ${className}`} dir="rtl">
      {rows.map((row, rIdx) => {
        if (!row || row.length === 0) return null;

        return (
          <div key={`row-${rIdx}`} className="flex gap-1.5 w-full">
            {row.map((btn) => {
              const url = btn.url?.trim() || '#';
              const isAnchor = isInteractive && url !== '#' && !url.startsWith('{');

              const content = (
                <>
                  <span className="truncate">{btn.text || 'دکمه شیشه‌ای'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
                </>
              );

              const buttonClasses =
                'flex-1 text-center py-2 px-2.5 rounded-xl text-xs font-semibold ' +
                // Light mode: Clean soft blue-gray glass with deep accessible blue text
                'bg-[#eff3f6] hover:bg-[#e2eaf0] text-[#1d70b8] border border-[#cddae3] shadow-2xs ' +
                // Dark mode: Authentic dark Telegram glass with vibrant sky blue text
                'dark:bg-[#2b394a] dark:hover:bg-[#35465a] dark:text-[#64b5f6] dark:border-[#3b4e63] ' +
                'transition-colors flex items-center justify-center gap-1.5 truncate cursor-pointer active:scale-[0.98]';

              if (isAnchor) {
                return (
                  <a
                    key={btn.id}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClasses}
                    onClick={() => onButtonClick?.(btn)}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={btn.id}
                  type="button"
                  className={buttonClasses}
                  onClick={() => onButtonClick?.(btn)}
                >
                  {content}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
