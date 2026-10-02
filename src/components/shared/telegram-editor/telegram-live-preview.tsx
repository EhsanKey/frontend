'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, CheckCheck, Bot, Smartphone } from 'lucide-react';
import type { InlineKeyboardRow } from '@/models';
import { TelegramInlineKeyboard } from './telegram-inline-keyboard';

export interface TelegramLivePreviewProps {
  messageText: string;
  inlineButtons?: InlineKeyboardRow[];
  botName?: string;
  samplePlaceholders?: Record<string, string>;
}

export const TelegramLivePreview: React.FC<TelegramLivePreviewProps> = ({
  messageText,
  inlineButtons = [],
  botName,
  samplePlaceholders,
}) => {
  const t = useTranslations('broadcasts.preview');
  const resolvedBotName = botName || t('botName');

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  // Default sample substitutions for realistic preview
  const defaultSubstitutions: Record<string, string> = {
    '{نام_دانشجو}': 'علی رضایی',
    '{اسم_دانشجو}': 'علی رضایی',
    '{student_name}': 'علی رضایی',
    '{student}': 'علی رضایی',
    '{نام_استاد}': 'دکتر مسعود حسنی',
    '{اسم_استاد}': 'دکتر مسعود حسنی',
    '{professor_name}': 'دکتر مسعود حسنی',
    '{professor}': 'دکتر مسعود حسنی',
    '{نام_درس}': 'ریاضی عمومی ۱',
    '{اسم_درس}': 'ریاضی عمومی ۱',
    '{course_name}': 'ریاضی عمومی ۱',
    '{course}': 'ریاضی عمومی ۱',
    '{deep_link}': 'https://t.me/uni_assistant_bot?start=inq_rev_sample',
    '{لینک_مستقیم}': 'https://t.me/uni_assistant_bot?start=inq_rev_sample',
    '{لینک_ثبت_نظر}': 'https://t.me/uni_assistant_bot?start=inq_rev_sample',
    '{لینک_ثبت_منبع}': 'https://t.me/uni_assistant_bot?start=inq_res_sample',
    ...samplePlaceholders,
  };

  // Parse Telegram HTML to safe React elements
  const renderFormattedContent = (raw: string) => {
    if (!raw.trim()) {
      return (
        <span className="text-default-400 italic">
          {t('placeholder')}
        </span>
      );
    }

    let processedHtml = raw;

    // Substitute placeholders in preview with highlighting
    for (const [tag, sampleVal] of Object.entries(defaultSubstitutions)) {
      if (processedHtml.includes(tag)) {
        processedHtml = processedHtml.replaceAll(
          tag,
          `<span class="px-1 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-semibold text-xs border border-amber-300 dark:border-amber-700" title="${tag}">${sampleVal}</span>`,
        );
      }
    }

    // Replace <tg-spoiler> with interactive click-to-reveal spans
    processedHtml = processedHtml
      .replace(/<tg-spoiler>/gi, '<span class="tg-spoiler-custom">')
      .replace(/<\/tg-spoiler>/gi, '</span>')
      .replace(/<b>/gi, '<strong class="font-bold text-neutral-950 dark:text-white">')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/<strong>/gi, '<strong class="font-bold text-neutral-950 dark:text-white">')
      .replace(/<i>/gi, '<em class="italic text-neutral-900 dark:text-neutral-100">')
      .replace(/<\/i>/gi, '</em>')
      .replace(/<em>/gi, '<em class="italic text-neutral-900 dark:text-neutral-100">')
      .replace(/<u>/gi, '<u class="underline text-neutral-900 dark:text-neutral-100">')
      .replace(/<\/u>/gi, '</u>')
      .replace(/<s>/gi, '<del class="line-through text-neutral-500 dark:text-neutral-400">')
      .replace(/<\/s>/gi, '</del>')
      .replace(/<strike>/gi, '<del class="line-through text-neutral-500 dark:text-neutral-400">')
      .replace(/<\/strike>/gi, '</del>')
      .replace(/<code>/gi, '<code class="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sky-700 dark:text-sky-300 font-mono text-xs font-semibold border border-neutral-200 dark:border-neutral-700">')
      .replace(/<\/code>/gi, '</code>')
      .replace(/<pre>/gi, '<pre class="p-2 my-1 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-xs overflow-x-auto text-left border border-neutral-200 dark:border-neutral-700" dir="ltr">')
      .replace(/<\/pre>/gi, '</pre>')
      .replace(/<blockquote>/gi, '<blockquote class="border-r-3 border-sky-500 pr-2 my-1.5 text-neutral-700 dark:text-neutral-300 bg-sky-50/60 dark:bg-sky-950/40 py-1 rounded-l text-xs">')
      .replace(/<\/blockquote>/gi, '</blockquote>')
      .replace(/<a\s+href="([^"]+)">/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-0.5 font-medium">')
      .replace(/<\/a>/gi, '</a>');

    // Replace linebreaks with <br/>
    processedHtml = processedHtml.replace(/\n/g, '<br/>');

    return (
      <div
        className="telegram-html-content text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 break-words select-text"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Phone Mockup Frame */}
      <div className="w-full max-w-[340px] rounded-3xl border-4 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 shadow-xl overflow-hidden flex flex-col">
        {/* Phone Notch & Status Bar */}
        <div className="bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 flex items-center justify-between text-[11px] font-mono border-b border-neutral-300 dark:border-neutral-700">
          <span>{timeString}</span>
          <div className="w-16 h-3 bg-neutral-400/40 dark:bg-neutral-950 rounded-full mx-auto" />
          <div className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span>4G</span>
          </div>
        </div>

        {/* Telegram Chat Header */}
        <div className="bg-[#517da2] text-white px-3 py-2 flex items-center gap-2 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-xs truncate leading-tight text-white">
              {resolvedBotName}
            </span>
            <span className="text-[10px] text-white/80 leading-none">
              {t('botStatus')}
            </span>
          </div>
        </div>

        {/* Chat Background & Message Container */}
        <div
          className="p-3 min-h-[300px] flex flex-col justify-end gap-2 bg-[#d7e4ef] dark:bg-[#0f1823]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(81, 125, 162, 0.12) 0%, transparent 80%)`,
          }}
        >
          {/* Message Bubble */}
          <div className="self-start max-w-[92%] rounded-2xl rounded-tr-xs bg-white dark:bg-[#212d3b] text-neutral-900 dark:text-neutral-50 shadow-md p-3 relative flex flex-col gap-1.5 transition-all border border-neutral-200/50 dark:border-neutral-700/50">
            {/* Sender / Bot indicator */}
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
              {resolvedBotName}
            </span>

            {/* Rendered HTML Content */}
            <div className="text-right" dir="rtl">
              {renderFormattedContent(messageText)}
            </div>

            {/* Bubble Time & Read Checkmarks */}
            <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-400 dark:text-neutral-400 self-end mt-0.5">
              <span>{timeString}</span>
              <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
            </div>

            {/* Inline Buttons inside message bubble */}
            {inlineButtons && inlineButtons.length > 0 && (
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60 mt-1 w-full">
                <TelegramInlineKeyboard rows={inlineButtons} isInteractive={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
