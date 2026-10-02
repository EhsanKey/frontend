'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { Plus, Trash2, ExternalLink, Rows, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { InlineKeyboardRow, InlineKeyboardButtonItem } from '@/models';
import { TelegramInlineKeyboard } from './telegram-inline-keyboard';

export interface InlineKeyboardBuilderProps {
  rows: InlineKeyboardRow[];
  onChange: (rows: InlineKeyboardRow[]) => void;
  disabled?: boolean;
  showPreview?: boolean;
}

function createButtonId(prefix = 'btn'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

export const InlineKeyboardBuilder: React.FC<InlineKeyboardBuilderProps> = ({
  rows,
  onChange,
  disabled = false,
  showPreview = true,
}) => {
  const t = useTranslations('broadcasts.inlineKeyboard');

  const addRow = () => {
    if (disabled) return;
    const newButton: InlineKeyboardButtonItem = {
      id: createButtonId('row'),
      text: t('newLink'),
      url: '{deep_link}',
    };
    onChange([...rows, [newButton]]);
  };

  const removeRow = (rowIndex: number) => {
    if (disabled) return;
    const updated = rows.filter((_, idx) => idx !== rowIndex);
    onChange(updated);
  };

  const addButtonToRow = (rowIndex: number) => {
    if (disabled) return;
    const newButton: InlineKeyboardButtonItem = {
      id: createButtonId('btn'),
      text: t('newButton'),
      url: 'https://',
    };
    const updated = rows.map((r, idx) => (idx === rowIndex ? [...r, newButton] : r));
    onChange(updated);
  };

  const removeButton = (rowIndex: number, btnIndex: number) => {
    if (disabled) return;
    const targetRow = rows[rowIndex];
    if (!targetRow) return;

    if (targetRow.length <= 1) {
      removeRow(rowIndex);
      return;
    }

    const updatedRow = targetRow.filter((_, idx) => idx !== btnIndex);
    const updated = rows.map((r, idx) => (idx === rowIndex ? updatedRow : r));
    onChange(updated);
  };

  const updateButton = (
    rowIndex: number,
    btnIndex: number,
    field: 'text' | 'url',
    value: string,
  ) => {
    if (disabled) return;
    const updated = rows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return r;
      return r.map((b, bIdx) => {
        if (bIdx !== btnIndex) return b;
        return { ...b, [field]: value };
      });
    });
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rows className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {t('title')}
          </span>
          <span className="text-[11px] text-neutral-400">
            ({t('optional')})
          </span>
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="h-8 gap-1 text-xs"
          isDisabled={disabled}
          onPress={addRow}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('addRow')}</span>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 gap-1.5 bg-neutral-50/50 dark:bg-neutral-900/50">
          <ExternalLink className="w-6 h-6 opacity-40 mb-1" />
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{t('noButtons')}</p>
          <p className="text-[11px] text-neutral-400">
            {t('noButtonsSub')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-col gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800 pb-1.5 mb-0.5">
                <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t('rowLabel', { index: (rowIndex + 1).toLocaleString('fa-IR') })}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs gap-1 text-primary-600 hover:text-primary-700"
                    isDisabled={disabled || row.length >= 3}
                    onPress={() => addButtonToRow(rowIndex)}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t('addButton')}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-danger-500 hover:text-danger-600"
                    isDisabled={disabled}
                    onPress={() => removeRow(rowIndex)}
                    aria-label="حذف سطر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Buttons Grid in this row */}
              <div
                className={`grid gap-2.5 ${
                  row.length === 1
                    ? 'grid-cols-1'
                    : row.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-3'
                }`}
              >
                {row.map((btn, btnIndex) => (
                  <div
                    key={btn.id}
                    className="flex flex-col gap-2 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/60 shadow-2xs relative group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                        {t('buttonLabel', { index: (btnIndex + 1).toLocaleString('fa-IR') })}
                      </span>
                      {row.length > 1 && (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => removeButton(rowIndex, btnIndex)}
                          className="text-neutral-400 hover:text-danger-500 transition-colors p-0.5"
                          aria-label="حذف دکمه"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Button Text input */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-400">عنوان دکمه:</label>
                      <input
                        type="text"
                        placeholder={t('btnTextPlaceholder')}
                        value={btn.text}
                        disabled={disabled}
                        onChange={(e) =>
                          updateButton(rowIndex, btnIndex, 'text', e.target.value)
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    {/* Button URL input */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-neutral-400">لینک دکمه (URL):</label>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => updateButton(rowIndex, btnIndex, 'url', '{deep_link}')}
                          className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                          title="تنظیم خودکار دیپ‌لینک بات تلگرام"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{'{deep_link}'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="https://... یا {deep_link}"
                        value={btn.url}
                        dir="ltr"
                        disabled={disabled}
                        onChange={(e) =>
                          updateButton(rowIndex, btnIndex, 'url', e.target.value)
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Mini preview inside the builder */}
          {showPreview && rows.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-medium">
                پیش‌نمایش شکل ظاهری دکمه‌های شیشه‌ای:
              </span>
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                <TelegramInlineKeyboard rows={rows} isInteractive={false} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
