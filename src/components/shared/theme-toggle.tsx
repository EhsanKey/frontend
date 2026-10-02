'use client';

import React from 'react';
import { Button, Dropdown, Menu } from '@heroui/react';
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/providers';
import { ICON_SIZE_CLASS } from '@/constants';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('common.theme');

  const getActiveIcon = () => {
    if (theme === 'system') {
      return <Laptop className={ICON_SIZE_CLASS.md} />;
    }
    return resolvedTheme === 'dark' ? (
      <Moon className={ICON_SIZE_CLASS.md} />
    ) : (
      <Sun className={ICON_SIZE_CLASS.md} />
    );
  };

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          aria-label={t('ariaLabel')}
          className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
        >
          {getActiveIcon()}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Menu
          aria-label={t('menuAriaLabel')}
          selectionMode="single"
          selectedKeys={new Set([theme])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as 'light' | 'dark' | 'system';
            if (selected) {
              setTheme(selected);
            }
          }}
          className="w-40"
        >
          <Menu.Item id="light" textValue={t('light')} className="gap-2.5">
            <Sun className="size-4 text-warning-500" />
            <span>{t('lightMode')}</span>
          </Menu.Item>
          <Menu.Item id="dark" textValue={t('dark')} className="gap-2.5">
            <Moon className="size-4 text-primary-400" />
            <span>{t('darkMode')}</span>
          </Menu.Item>
          <Menu.Item id="system" textValue={t('system')} className="gap-2.5">
            <Laptop className="size-4 text-neutral-400" />
            <span>{t('systemMode')}</span>
          </Menu.Item>
        </Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default ThemeToggle;
