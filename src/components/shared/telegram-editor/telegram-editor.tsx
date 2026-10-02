'use client';

import React, { useRef, useState, useMemo } from 'react';
import {
  Button,
  Tabs,
  Input,
  Chip,
} from '@heroui/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  EyeOff,
  Link as LinkIcon,
  Code,
  FileCode,
  Quote,
  Sparkles,
  Eraser,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface TelegramPlaceholderItem {
  tag: string;
  label: string;
  sampleValue?: string;
}

export interface TelegramEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  placeholders?: TelegramPlaceholderItem[];
  disabled?: boolean;
}

// Telegram message length limit
const TELEGRAM_MAX_CHARS = 4096;

export const TelegramEditor: React.FC<TelegramEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  placeholders,
  disabled = false,
}) => {
  const t = useTranslations('broadcasts.editor');
  const tCommon = useTranslations('common');

  const resolvedPlaceholder = placeholder ?? t('placeholder');
  const [activeTab, setActiveTab] = useState<string>('visual');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultPlaceholders: TelegramPlaceholderItem[] = useMemo(() => [
    { tag: t('studentNameTag') || '{نام_دانشجو}', label: t('studentNamePlaceholder') || 'نام دانشجو' },
  ], [t]);

  const activePlaceholders = placeholders && placeholders.length > 0 ? placeholders : defaultPlaceholders;

  // Validate unclosed Telegram HTML tags
  const validation = useMemo(() => {
    const issues: string[] = [];
    const tagsToCheck = ['b', 'strong', 'i', 'em', 'u', 'ins', 's', 'strike', 'del', 'tg-spoiler', 'code', 'pre', 'blockquote', 'a'];

    for (const tag of tagsToCheck) {
      const openMatches = value.match(new RegExp(`<${tag}(\\s+[^>]*)?>`, 'gi')) || [];
      const closeMatches = value.match(new RegExp(`</${tag}>`, 'gi')) || [];
      if (openMatches.length !== closeMatches.length) {
        issues.push(t('validationStatus.unclosedTag', { tag, open: openMatches.length, close: closeMatches.length }));
      }
    }

    // Check for banned HTML tags
    const bannedTags = ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'img'];
    for (const tag of bannedTags) {
      if (new RegExp(`<${tag}(\\s+[^>]*)?>`, 'i').test(value)) {
        issues.push(t('validationStatus.bannedTag', { tag }));
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }, [value, t]);

  const insertTag = (openTag: string, closeTag: string) => {
    if (disabled) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const replacement = selectedText
      ? `${openTag}${selectedText}${closeTag}`
      : `${openTag}${closeTag}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const cursorIndex = start + openTag.length + selectedText.length;
      textarea.setSelectionRange(cursorIndex, cursorIndex);
    }, 10);
  };

  const handleOpenLinkModal = () => {
    if (disabled) return;
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart || 0;
    const end = textarea?.selectionEnd || 0;
    const selectedText = value.substring(start, end);
    setLinkText(selectedText || t('linkModal.defaultLinkText'));
    setLinkUrl('https://');
    setLinkModalOpen(true);
  };

  const handleConfirmLink = () => {
    if (!linkUrl.trim()) return;
    const validUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('tg://') || linkUrl.startsWith('t.me/')
      ? linkUrl
      : `https://${linkUrl}`;

    insertTag(`<a href="${validUrl}">`, `</a>`);
    setLinkModalOpen(false);
  };

  const insertPlaceholder = (ph: string) => {
    if (disabled) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + ph + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + ph.length, start + ph.length);
    }, 10);
  };

  const clearFormatting = () => {
    if (disabled) return;
    const stripped = value.replace(/<[^>]*>?/gm, '');
    onChange(stripped);
  };

  const charsLeft = TELEGRAM_MAX_CHARS - value.length;
  const isOverLimit = charsLeft < 0;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-divider bg-content1 shadow-sm overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 border-b border-divider bg-default-50/50">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('bold')}
            isDisabled={disabled}
            onPress={() => insertTag('<b>', '</b>')}
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('italic')}
            isDisabled={disabled}
            onPress={() => insertTag('<i>', '</i>')}
          >
            <Italic className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('underline')}
            isDisabled={disabled}
            onPress={() => insertTag('<u>', '</u>')}
          >
            <Underline className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('strike')}
            isDisabled={disabled}
            onPress={() => insertTag('<s>', '</s>')}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('spoiler')}
            isDisabled={disabled}
            onPress={() => insertTag('<tg-spoiler>', '</tg-spoiler>')}
          >
            <EyeOff className="w-4 h-4" />
          </Button>

          <div className="w-[1px] h-5 bg-divider mx-1" />

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('link')}
            isDisabled={disabled}
            onPress={handleOpenLinkModal}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('code')}
            isDisabled={disabled}
            onPress={() => insertTag('<code>', '</code>')}
          >
            <Code className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('pre')}
            isDisabled={disabled}
            onPress={() => insertTag('<pre>', '</pre>')}
          >
            <FileCode className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2"
            aria-label={t('quote')}
            isDisabled={disabled}
            onPress={() => insertTag('<blockquote>', '</blockquote>')}
          >
            <Quote className="w-4 h-4" />
          </Button>

          <div className="w-[1px] h-5 bg-divider mx-1" />

          <Button
            size="sm"
            variant="outline"
            className="min-w-8 h-8 px-2 text-danger-500 hover:text-danger-600"
            aria-label={t('cleanAria')}
            isDisabled={disabled}
            onPress={clearFormatting}
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>

        {/* Dynamic Placeholders */}
        <div className="flex flex-wrap items-center gap-1">
          {activePlaceholders.map((ph) => (
            <Button
              key={ph.tag}
              size="sm"
              variant="secondary"
              className="h-8 px-2.5 text-xs gap-1"
              aria-label={ph.label}
              isDisabled={disabled}
              onPress={() => insertPlaceholder(ph.tag)}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{ph.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {linkModalOpen && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-primary-50 dark:bg-primary-950/40 border-b border-primary-200">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-default-600">{t('linkModal.text')}</span>
            <Input
              placeholder={t('linkModal.textPlaceholder')}
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-44"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-default-600">{t('linkModal.url')}</span>
            <Input
              placeholder="https://..."
              value={linkUrl}
              dir="ltr"
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="flex items-center gap-1.5 self-end">
            <Button size="sm" variant="primary" onPress={handleConfirmLink}>
              {t('linkModal.insert')}
            </Button>
            <Button size="sm" variant="ghost" onPress={() => setLinkModalOpen(false)}>
              {tCommon('actions.cancel')}
            </Button>
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="px-3 pt-1">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(k) => setActiveTab(k as string)}
          variant="secondary"
        >
          <Tabs.List className="border-b border-divider gap-2">
            <Tabs.Tab id="visual">
              <span>{t('tabs.formatted')}</span>
            </Tabs.Tab>
            <Tabs.Tab id="html">
              <span>{t('tabs.html')}</span>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>

      {/* Main Text Area */}
      <div className="p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={resolvedPlaceholder}
          rows={7}
          dir="rtl"
          disabled={disabled}
          className="w-full resize-y rounded-lg border border-divider bg-transparent p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans leading-relaxed disabled:opacity-50"
        />
      </div>

      {/* Validation Warning & Character Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-divider bg-default-50/50 text-xs">
        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <div className="flex items-center gap-1.5 text-success-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('validationStatus.valid')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-danger-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validation.issues[0]}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="secondary"
            className={isOverLimit ? 'bg-danger-50 text-danger-700' : 'bg-default-100 text-default-700'}
          >
            {t('charCount', { current: value.length, max: TELEGRAM_MAX_CHARS })}
          </Chip>
        </div>
      </div>

      {error && (
        <div className="px-3 pb-2 text-xs text-danger-500 font-medium">
          {error}
        </div>
      )}
    </div>
  );
};
